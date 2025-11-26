package com.eventos.eventos_app.config;

import org.springframework.stereotype.Component;

@Component
public class IssuerProvider {

    private final String issuer;

    public IssuerProvider() {
        this.issuer = "server-start-" + System.currentTimeMillis();  
        // Ej: server-start-1731606500000
    }

    public String getIssuer() {
        return issuer;
    }
}
