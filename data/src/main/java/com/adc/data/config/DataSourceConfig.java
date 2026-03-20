package com.adc.data.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
@ConfigurationPropertiesScan
public class DataSourceConfig {

    @Value("${spring.datasource.book.url}")
    String urlBook;

    @Value("${spring.datasource.media.url}")
    String urlMedia;

    @Value("${spring.datasource.stock.url}")
    String urlStock;

    @Value("${spring.datasource.username}")
    String username;

    @Value("${spring.datasource.password}")
    String password;

    @Value("${spring.datasource.driver-class-name}")
    String driverClassName;

    @Bean(name = "dataSourceProduct")
    @Primary
    public DataSource dataSourceProduct() {
        return DataSourceBuilder.create().driverClassName(driverClassName).url(urlBook).username(username).password(password).build();
    }

    @Bean(name = "dataSourceMedia")
    public DataSource dataSourceMedia() {
        return DataSourceBuilder.create().driverClassName(driverClassName).url(urlMedia).username(username).password(password).build();
    }

    @Bean(name = "dataSourceStock")
    public DataSource dataSourceStock() {
        return DataSourceBuilder.create().driverClassName(driverClassName).url(urlStock).username(username).password(password).build();
    }

    @Bean(name = "jdbcProduct")
    @Primary
    public JdbcTemplate jdbcTemplateProduct(DataSource dataSourceProduct) {
        return new JdbcTemplate(dataSourceProduct);
    }

    @Bean(name = "jdbcMedia")
    public JdbcTemplate jdbcTemplateMedia(DataSource dataSourceMedia) {
        return new JdbcTemplate(dataSourceMedia);
    }

    @Bean(name = "jdbcStock")
    public JdbcTemplate jdbcTemplateStock(DataSource dataSourceStock) {
        return new JdbcTemplate(dataSourceStock);
    }
}
