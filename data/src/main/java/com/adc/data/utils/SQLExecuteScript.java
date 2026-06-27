package com.adc.data.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.datasource.init.ScriptUtils;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Objects;

@Slf4j
public class SQLExecuteScript {

    private final ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();


    public void executeScriptForSchema(DataSource dataSource, String schema, String pathPattern) throws IOException, SQLException {
        Resource[] resources = resourcePatternResolver.getResources(pathPattern);

        // Execute scripts in a deterministic order (by file name) so that
        // scripts with FK dependencies run after their referenced data.
        Arrays.sort(resources, Comparator.comparing(
                r -> Objects.requireNonNullElse(r.getFilename(), "")));

        for (Resource resource : resources) {
            executeSQLScript(dataSource, schema, resource);
        }
    }

    private void executeSQLScript(DataSource dataSource, String schema, Resource resource) {
        try (Connection connection = dataSource.getConnection()) {
            connection.setSchema(schema);
            ScriptUtils.executeSqlScript(connection, resource);
            log.info("Executed SQL script: {}", resource);
        } catch (Exception e) {
            log.error("Failed to execute SQL script: {}", resource, e);
        }
    }
}
