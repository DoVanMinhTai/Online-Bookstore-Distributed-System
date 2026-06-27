package com.adc.media.service;

import com.adc.media.config.FileSystemConfig;
import com.adc.media.config.ServiceUrlConfig;
import com.adc.media.model.Media;
import com.adc.media.model.dto.MediaDto;
import com.adc.media.repository.FileSystemRepository;
import com.adc.media.repository.MediaRepository;
import com.adc.media.viewmodel.MediaVm;
import com.adc.media.viewmodel.MetaData;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.InputStream;
import java.util.List;


@Service
@lombok.RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {
    private final FileSystemRepository fileSystemRepository;
    private final MediaRepository mediaRepository;
    private final ServiceUrlConfig serviceUrlConfig;

    @Override
    public MediaDto getFile(Long id, String fileName) {
        MediaDto.MediaDtoBuilder builder = MediaDto.builder();
        Media media = mediaRepository.findById(id).orElse(null);
        if (!fileName.equalsIgnoreCase(media.getFileName()) || media == null) {
            return builder.build();
        }
        System.out.println(media.getFilePath());
        MediaType mediaType = MediaType.valueOf(media.getMediaType());
        InputStream fileContent = fileSystemRepository.getFile(media.getFilePath());
        return builder.content(fileContent).mediaType(mediaType).build();
    }

    @Override
    @Cacheable(value = "mediaById", key = "#id", unless = "#result == null")
    public MediaVm getMediaById(Long id) {
        MetaData metaData = mediaRepository.findByIdWithoutFileInReturn(id);
        if (metaData == null) {
            return null;
        }
        return toMediaVm(metaData);
    }

    @Override
    public List<MediaVm> getMediaByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return mediaRepository.findAllByIdInWithoutFileInReturn(ids).stream()
                .map(this::toMediaVm)
                .toList();
    }

    private MediaVm toMediaVm(MetaData metaData) {
        String url = getMediaUrl(metaData.id(), metaData.fileName());
        return new MediaVm(metaData.id(), metaData.caption(),
                metaData.fileName(), metaData.mediaType(),
                url);
    }


    private String getMediaUrl(Long id, String fileName) {
        return UriComponentsBuilder.fromUriString(serviceUrlConfig.url())
                .path(String.format("media/media/{id}/file/{name}"))
                .buildAndExpand(id, fileName).toUriString();
    }
}
