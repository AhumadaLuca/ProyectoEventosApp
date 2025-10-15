package com.eventos.eventos_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable()) // 🔸 Desactiva CSRF (solo mientras desarrollas)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", 
                    "/index.html",
                    "/css/**", 
                    "/js/**", 
                    "/images/**",
                    "/api/**"
                ).permitAll() // 🔸 Todo accesible sin login
                .anyRequest().permitAll()
            );

        return http.build();
    }
}