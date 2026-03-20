package com.adc.inventory.services;

import com.adc.commonlibrary.exception.NotFoundException;
import com.adc.inventory.model.Stock;
import com.adc.inventory.model.StockHistory;
import com.adc.inventory.model.WareHouse;
import com.adc.inventory.model.enumeration.FilterExitsInWhSelection;
import com.adc.inventory.repository.StockHistoryRepository;
import com.adc.inventory.repository.StockRepository;
import com.adc.inventory.repository.WareHouseRepository;
import com.adc.inventory.viewmodel.product.ProductQuantityPostVm;
import com.adc.inventory.viewmodel.stock.*;
import com.adc.inventory.viewmodel.product.ProductInfo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StockService {
    private final StockRepository stockRepository;
    private final WareHouseRepository wareHouseRepository;
    private final ProductService productService;
    private final WareHouseService wareHouseService;
    private final StockHistoryService stockHistoryService;
    private final StockHistoryRepository stockHistoryRepository;

    public void addProductIntoWareHouse(List<StockPostVm> postVms) {
        List<Stock> stocks = postVms.stream().map(postVm -> {
            boolean existWareHouseIdAndProductId = stockRepository.existsByWareHouseIdAndProductId(postVm.wareHouseId(), postVm.productId());
            if (existWareHouseIdAndProductId) {
                try {
                    throw new Exception("exists stock");
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }

            ProductInfo productInfo = productService.getProduct(postVm.productId());
            if (productInfo == null) {
                throw new NotFoundException("product not found");
            }

            Optional<WareHouse> wareHouse = wareHouseRepository.findById(postVm.wareHouseId());
            if (wareHouse.isPresent()) {
                throw new NotFoundException("warehouse not found");
            }
            return Stock.builder().productId(postVm.productId())
                    .wareHouse(wareHouse.get())
                    .quantity(0L)
                    .reversedQuantity(0L)
                    .build();
        }).toList();
        stockRepository.saveAll(stocks);
    }

    public List<StockVm> getStocksByWarehouseIdAndProductNameAndSku(Long warehouseId, String productName, String productSku) {

        HashMap<Long, ProductInfo> productInfoHashMap = (HashMap<Long, ProductInfo>) wareHouseService.getProductWarehouse(warehouseId, productName, productSku, FilterExitsInWhSelection.YES)
                .parallelStream()
                .collect(Collectors.toMap(ProductInfo::id, productInfo -> productInfo));

        List<Stock> stocks = stockRepository.findAllByWareHouseIdAndProductIdIn(warehouseId
                , productInfoHashMap.values().parallelStream().map(ProductInfo::id).toList());

        return stocks.stream().map(
                stock -> {
                    ProductInfo productInfo = productInfoHashMap.get(stock.getProductId());

                    return StockVm.fromModel(stock, productInfo);
                }
        ).toList();
    }


    public void updateProductQuantityInStock(final StockQuantityUpdateVm requestBody) {
        List<StockQuantityVm> stockQuantityVms = requestBody.stockQuantityVmList();
        List<Stock> stocks = stockRepository.findAllById(stockQuantityVms.parallelStream().map(StockQuantityVm::stockId).toList());

        for (final Stock stock : stocks) {
            StockQuantityVm stockQuantityVm = stockQuantityVms.parallelStream()
                    .filter(current -> current.stockId().equals(stock.getId()))
                    .findFirst()
                    .orElse(null);

            if (stockQuantityVm == null) {
                continue;
            }

            Long adjustedQuantity = stockQuantityVm.quantity() != null ? stockQuantityVm.quantity() : 0L;

            stock.setQuantity(stockQuantityVm.quantity() + adjustedQuantity);
        }
        stockRepository.saveAll(stocks);
        stockHistoryService.createStockHistories(stocks, stockQuantityVms);

        List<ProductQuantityPostVm> productQuantityPostVms = stocks.parallelStream()
                .map(ProductQuantityPostVm::fromModel)
                .toList();

        if (!productQuantityPostVms.isEmpty()) {
            productService.updateQuantity(productQuantityPostVms);
        }
    }

    @Transactional
    public void reduceStock(List<StockDeleteVm> stockDeleteVms) {
        for (StockDeleteVm vm : stockDeleteVms) {
            Stock stock = stockRepository.findByProductIdAndWarehouseIdWithLock(vm.productId(), vm.warehouseId()).orElseThrow(
                    () -> new NotFoundException("STOCK_NOT_FOUND")
            );

            if (stock.getQuantity() < vm.quantity()) {
                throw new RuntimeException("OUT_OF_STOCK");
            }

            if (stock.getReversedQuantity() < vm.quantity()) {
                stock.setReversedQuantity(0L);
            } else {
                stock.setReversedQuantity(stock.getReversedQuantity() - vm.quantity());
            }

            stock.setQuantity(stock.getQuantity() - vm.quantity());

            StockHistory history = StockHistory.builder()
                    .productId(vm.productId())
                    .wareHouse(stock.getWareHouse())
                    .adjustedQuantity((long) -vm.quantity())
                    .note("Xuất kho")
                    .build();

            stockHistoryRepository.save(history);
        }
    }

    @Transactional
    public void reserveStock(Long productId, Long warehouseId, Long quantity) {
//      Default WarehouseId = 1L;
        warehouseId = 1L;
        Stock stock = stockRepository.findByProductIdAndWarehouseIdWithLock(productId, warehouseId).orElseThrow();

        long availableStock = stock.getQuantity() - stock.getReversedQuantity();
        if (availableStock < quantity) {
            throw new RuntimeException("PRODUCT_ORDERED");
        }

        stock.setReversedQuantity(stock.getReversedQuantity() + quantity);
        stockRepository.save(stock);
    }

    @Transactional
    public void releaseStock(Long productId, Long warehouseId, Long quantity) {
        Stock stock = stockRepository.findByProductIdAndWarehouseIdWithLock(productId, warehouseId).orElseThrow();

        stock.setReversedQuantity(Math.max(0, stock.getReversedQuantity() - quantity));
        stockRepository.save(stock);
    }
}
