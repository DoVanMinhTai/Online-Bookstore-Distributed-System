package com.adc.backoffice_bff.controller;

import com.adc.backoffice_bff.viewmodel.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class AuthenticationController {

    @GetMapping("/authentication/user")
    public Mono<ResponseEntity<AuthenticatedUser>> user(@AuthenticationPrincipal OidcUser principal) {
        if (principal == null) {
            return Mono.just(ResponseEntity.status(401).build());
        }
        String username = principal.getPreferredUsername();
        return Mono.just(ResponseEntity.ok(new AuthenticatedUser(username)));
    }
}
