package com.adc.media;

import com.adc.media.config.ServiceUrlConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
@EnableConfigurationProperties(ServiceUrlConfig.class)
public class MediaApplication {


	public static void main(String[] args) {
		SpringApplication.run(MediaApplication.class, args);
	}

}
