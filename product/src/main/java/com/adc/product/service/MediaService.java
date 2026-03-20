package com.adc.product.service;

import com.adc.product.config.ServiceUrlConfig;
import com.adc.product.viewmodel.MetaData;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService extends AbstractCircuitBreakFallbackHandler {
    private final RestClient restClient;
    private final ServiceUrlConfig serviceUrlConfig;

    @Retry(name = "restApi")
    @CircuitBreaker(name = "restCircuitBreaker", fallbackMethod = "handleMediaFallback")
    public MetaData getMedia(Long id) {
        if (id == null) {
            return new MetaData(null, null, null, null, null, null);
        }
        final URI url = UriComponentsBuilder.fromUriString(serviceUrlConfig.media())
                .path("/media/{id}").buildAndExpand(id).toUri();
        log.info("Calling Media Service URL: {}", url);
        return restClient.get().uri(url)
                .retrieve().body(MetaData.class);
    }

    private MetaData handleMediaFallback(Throwable throwable) throws Throwable {
        return handleTypedFallback(throwable);
    }
}
