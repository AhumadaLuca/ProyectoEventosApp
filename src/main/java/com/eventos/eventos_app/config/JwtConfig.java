package com.eventos.eventos_app.config;

import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Configuration
public class JwtConfig {
	
	@Value("${jwt.secret}")
    private String SECRET;

    public String generarToken(String email, String rol) {

        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
        
     // Aseguramos el formato ROLE_XXX
        String rolConPrefijo = rol.startsWith("ROLE_") ? rol : "ROLE_" + rol;

        return Jwts.builder()
                .setSubject(email)
                .claim("roles", List.of(rolConPrefijo))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validarToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
