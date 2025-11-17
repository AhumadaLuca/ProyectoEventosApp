package com.eventos.eventos_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventos.eventos_app.models.Evento;


@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
	List<Evento> findByOrganizadorId(Long organizadorId);
}