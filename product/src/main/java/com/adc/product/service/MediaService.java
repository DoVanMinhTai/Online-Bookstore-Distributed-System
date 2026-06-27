package com.adc.product.service;

import com.adc.product.config.ServiceUrlConfig;
import com.adc.product.viewmodel.MetaData;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



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

    /**
     * Fetch multiple media records in a single HTTP call to avoid N+1 calls.
     */
    @Retry(name = "restApi")
    @CircuitBreaker(name = "restCircuitBreaker", fallbackMethod = "handleMediaListFallback")
    public List<MetaData> getMediaByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        final URI url = UriComponentsBuilder.fromUriString(serviceUrlConfig.media())
                .path("/media/ids")
                .queryParam("ids", ids)
                .build().toUri();
        log.info("Calling Media Service (batch) URL: {}", url);
        List<MetaData> result = restClient.get().uri(url)
                .retrieve()
                .body(new ParameterizedTypeReference<List<MetaData>>() {
                });
        return result == null ? Collections.emptyList() : result;
    }

    /**
     * Returns a map of mediaId -> url for the given ids using a single batch call.
     */
    public Map<Long, String> getMediaUrlMap(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyMap();
        }
        List<Long> distinctIds = ids.stream().filter(java.util.Objects::nonNull).distinct().toList();
        try {
            return getMediaByIds(distinctIds).stream()
                    .filter(m -> m != null && m.id() != null)
                    .collect(Collectors.toMap(MetaData::id, MetaData::url, (a, b) -> a));
        } catch (Exception ex) {
            // Never let a media outage break the product listing; thumbnails just
            // render with the frontend fallback image instead.
            log.error("Failed to load media urls for ids {}. Returning empty map. Detail: {}", distinctIds, ex.getMessage());
            return Collections.emptyMap();
        }
    }


    private List<MetaData> handleMediaListFallback(Throwable throwable) {
        log.error("Media batch call failed, returning empty list. Detail: {}", throwable.getMessage());
        return Collections.emptyList();
    }
}


