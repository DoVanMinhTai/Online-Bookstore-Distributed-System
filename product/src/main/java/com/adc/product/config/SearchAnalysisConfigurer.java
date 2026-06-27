package com.adc.product.config;

import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurationContext;
import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurer;

/**
 * Defines the "vietnamese" analyzer used for full-text search.
 * It lowercases tokens and folds accents (ASCII folding) so that
 * a query like "tieng viet" matches the indexed "Tiếng Việt".
 */
public class SearchAnalysisConfigurer implements LuceneAnalysisConfigurer {

    @Override
    public void configure(LuceneAnalysisConfigurationContext context) {
        context.analyzer("vietnamese").custom()
                .tokenizer("standard")
                .tokenFilter("lowercase")
                .tokenFilter("asciiFolding");
    }
}
