package com.eventos.eventos_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventos.eventos_app.config.IssuerProvider;

@RestController
@RequestMapping("/issuer")
public class IssuerController {

    @Autowired
    private IssuerProvider issuerProvider;

    @GetMapping("/validar")
    public String getIssuer() {
        return issuerProvider.getIssuer();
    }
}
