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
    private SQLExecuteScript sqlExecuteScript = new SQLExecuteScript();

    @Value( "${app.sql.product}")
    private String productScripts;

    @Value( "${app.sql.media}")
    private String mediaScripts;

    @Value( "${app.sql.stock}")
    private String stockScripts;

    @Autowired
    public DataService(@Qualifier("dataSourceProduct") DataSource dataSourceProduct,
                       @Qualifier("dataSourceMedia") DataSource dataSourceMedia,
                       @Qualifier("dataSourceStock") DataSource dataSourceStock
    ) {
        this.dataSourceProduct = dataSourceProduct;
        this.dataSourceMedia = dataSourceMedia;
        this.dataSourceStock = dataSourceStock;
        this.sqlExecuteScript = sqlExecuteScript;
    }

    public SampleDataVm createData() throws SQLException, IOException {
        sqlExecuteScript.executeScriptForSchema(dataSourceProduct, "public", productScripts);
        sqlExecuteScript.executeScriptForSchema(dataSourceMedia, "public", mediaScripts);
        sqlExecuteScript.executeScriptForSchema(dataSourceStock, "public", stockScripts);
        return new SampleDataVm("Insert Sample Data successfully!", true);

    }
}
