package com.eventos.eventos_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventos.eventos_app.models.Organizador;

@Repository
public interface OrganizadorRepository extends JpaRepository<Organizador, Long> {
	Optional<Organizador> findByEmail(String email);
    boolean existsByEmail(String email);
}
