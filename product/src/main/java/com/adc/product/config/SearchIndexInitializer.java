package com.adc.product.config;

import com.adc.product.model.Book;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.massindexing.MassIndexer;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Builds the Lucene full-text index from the data already present in the
 * database on application startup. Failures are logged but do not stop the app.
 */
@Component
public class SearchIndexInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SearchIndexInitializer.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        try {
            reindex();
            log.info("Hibernate Search mass indexing completed for Book.");
        } catch (Exception e) {
            log.error("Hibernate Search mass indexing failed on startup", e);
        }
    }

    @Transactional
    public void reindex() throws InterruptedException {
        SearchSession searchSession = Search.session(entityManager);
        MassIndexer indexer = searchSession.massIndexer(Book.class)
                .threadsToLoadObjects(2);
        indexer.startAndWait();
    }
}
