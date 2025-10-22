package com.eventos.eventos_app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventos.eventos_app.models.Evento;
import com.eventos.eventos_app.repository.EventoRepository;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    // Crear evento
    public Evento crearEvento(Evento evento) {
        // Validaciones básicas (se puede modificar mas adelante)
        if (evento.getFechaFin().isBefore(evento.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        if (evento.getRequiereVerificarEdad() == null) {
            evento.setRequiereVerificarEdad(false);
        }

        // Acá se guarda en la BD
        return eventoRepository.save(evento);
    }
    
 // READ: Obtener todos los eventos
    public List<Evento> obtenerTodos() {
        return eventoRepository.findAll();
    }
    
    // READ: por ID
    public Evento obtenerPorId(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con id: " + id));
    }
    
}