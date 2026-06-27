package com.adc.data.service;

import com.adc.data.utils.SQLExecuteScript;
import com.adc.data.viewmodel.SampleDataVm;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;

@Service
@Transactional
public class DataService {
    private final DataSource dataSourceProduct;
    private final DataSource dataSourceMedia;
    private final DataSource dataSourceStock;
    private final DataSource dataSourceLocation;
    private SQLExecuteScript sqlExecuteScript = new SQLExecuteScript();

    @Value( "${app.sql.product}")
    private String productScripts;

    @Value( "${app.sql.media}")
    private String mediaScripts;

    @Value( "${app.sql.stock}")
    private String stockScripts;

    @Value( "${app.sql.location}")
    private String locationScripts;

    @Autowired
    public DataService(@Qualifier("dataSourceProduct") DataSource dataSourceProduct,
                       @Qualifier("dataSourceMedia") DataSource dataSourceMedia,
                       @Qualifier("dataSourceStock") DataSource dataSourceStock,
                       @Qualifier("dataSourceLocation") DataSource dataSourceLocation
    ) {
        this.dataSourceProduct = dataSourceProduct;
        this.dataSourceMedia = dataSourceMedia;
        this.dataSourceStock = dataSourceStock;
        this.dataSourceLocation = dataSourceLocation;
        this.sqlExecuteScript = sqlExecuteScript;
    }

    public SampleDataVm createData() throws SQLException, IOException {
        seedProduct();
        seedMedia();
        seedStock();
        seedLocation();
        return new SampleDataVm("Insert Sample Data successfully!", true);

    }

    public void seedProduct() throws SQLException, IOException {
        sqlExecuteScript.executeScriptForSchema(dataSourceProduct, "public", productScripts);
    }

    public void seedMedia() throws SQLException, IOException {
        sqlExecuteScript.executeScriptForSchema(dataSourceMedia, "public", mediaScripts);
    }

    public void seedStock() throws SQLException, IOException {
        sqlExecuteScript.executeScriptForSchema(dataSourceStock, "public", stockScripts);
    }

    public void seedLocation() throws SQLException, IOException {
        sqlExecuteScript.executeScriptForSchema(dataSourceLocation, "public", locationScripts);
    }
}


