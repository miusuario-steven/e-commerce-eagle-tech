package com.eagletech.ecommerce.backend.infrastructure.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class PaypalConfig {

    @Value("${paypal.redirect.base-url}")
    private String baseUrl;

    @Value("${paypal.redirect.success-path}")
    private String successPath;

    @Value("${paypal.redirect.cancel-path}")
    private String cancelPath;

    @Value("${paypal.redirect.error-path}")
    private String errorPath;

    public String getSuccessUrl() {
        return baseUrl + successPath;
    }

    public String getCancelUrl() {
        return baseUrl + cancelPath;
    }

    public String getErrorUrl() {
        return baseUrl + errorPath;
    }
}
