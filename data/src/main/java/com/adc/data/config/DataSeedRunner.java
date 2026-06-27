package com.adc.data.config;

import com.adc.data.service.DataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;

/**
 * Seeds sample data automatically on application startup.
 * The SQL scripts are idempotent, so running this repeatedly is safe.
 *
 * Because the schema is created by the other services (product/media/inventory)
 * via Hibernate ddl-auto=update, this runner waits/retries until the target
 * databases are reachable before executing the seed scripts.
 */
@Component
public class DataSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeedRunner.class);

    private final DataService dataService;
    private final DataSource dataSourceProduct;
    private final DataSource dataSourceMedia;
    private final DataSource dataSourceStock;
    private final DataSource dataSourceLocation;

    @Value("${app.seed.on-startup:true}")
    private boolean seedOnStartup;

    @Value("${app.seed.max-retries:30}")
    private int maxRetries;

    @Value("${app.seed.retry-delay-ms:5000}")
    private long retryDelayMs;

    public DataSeedRunner(DataService dataService,
                          @Qualifier("dataSourceProduct") DataSource dataSourceProduct,
                          @Qualifier("dataSourceMedia") DataSource dataSourceMedia,
                          @Qualifier("dataSourceStock") DataSource dataSourceStock,
                          @Qualifier("dataSourceLocation") DataSource dataSourceLocation) {
        this.dataService = dataService;
        this.dataSourceProduct = dataSourceProduct;
        this.dataSourceMedia = dataSourceMedia;
        this.dataSourceStock = dataSourceStock;
        this.dataSourceLocation = dataSourceLocation;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!seedOnStartup) {
            log.info("Seed on startup is disabled (app.seed.on-startup=false). Skipping.");
            return;
        }

        // Seed each group independently so that a slow or failing service does
        // not block the others. For example, an empty `location` schema must
        // still get seeded even if the product/inventory schemas are not ready.
        seedGroup("product", () -> dataService.seedProduct(),
                dataSourceProduct, "book", "brand", "category", "book_cate");
        seedGroup("media", () -> dataService.seedMedia(),
                dataSourceMedia, "media");
        seedGroup("inventory", () -> dataService.seedStock(),
                dataSourceStock, "warehouse", "stock");
        seedGroup("location", () -> dataService.seedLocation(),
                dataSourceLocation, "country", "state_or_province");
    }

    /**
     * Waits until the given group's required tables exist, then runs its seed
     * action. Any failure is logged and isolated to this group only.
     */
    private void seedGroup(String groupName, SeedAction seedAction,
                           DataSource dataSource, String... requiredTables) {
        if (!waitForTables(groupName, dataSource, requiredTables)) {
            log.error("[{}] Schema not ready after {} retries. Skipping {} seed.",
                    groupName, maxRetries, groupName);
            return;
        }
        try {
            seedAction.run();
            log.info("[{}] Sample data seeding completed successfully.", groupName);
        } catch (Exception e) {
            log.error("[{}] Sample data seeding failed", groupName, e);
        }
    }

    private boolean waitForTables(String groupName, DataSource dataSource, String... requiredTables) {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            boolean allPresent = true;
            for (String table : requiredTables) {
                if (!tableExists(dataSource, table)) {
                    allPresent = false;
                    break;
                }
            }
            if (allPresent) {
                log.info("[{}] All required tables are present (attempt {}).", groupName, attempt);
                return true;
            }
            log.info("[{}] Schema not ready yet (attempt {}/{}). Waiting {} ms...",
                    groupName, attempt, maxRetries, retryDelayMs);
            try {
                Thread.sleep(retryDelayMs);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                return false;
            }
        }
        return false;
    }

    @FunctionalInterface
    private interface SeedAction {
        void run() throws Exception;
    }


    private boolean tableExists(DataSource dataSource, String tableName) {
        try (Connection connection = dataSource.getConnection();
             ResultSet rs = connection.getMetaData()
                     .getTables(connection.getCatalog(), null, tableName, new String[]{"TABLE"})) {
            if (rs.next()) {
                return true;
            }
            // Some drivers are case-sensitive; retry with uppercase.
            try (ResultSet rsUpper = connection.getMetaData()
                    .getTables(connection.getCatalog(), null, tableName.toUpperCase(), new String[]{"TABLE"})) {
                return rsUpper.next();
            }
        } catch (Exception e) {
            return false;
        }
    }
}
