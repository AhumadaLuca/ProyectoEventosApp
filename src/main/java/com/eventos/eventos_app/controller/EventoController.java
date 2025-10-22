package com.eventos.eventos_app.controller;

import com.eventos.eventos_app.services.EventoService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventos.eventos_app.models.Evento;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @PostMapping(value = "/guardar", consumes = {"multipart/form-data"})
    public ResponseEntity<Evento> crearEvento(
            @RequestPart("evento") Evento evento,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
    	
    	// Algunas validaciones (se agregarán más o menos segun lo que necesitemos)
        if (evento.getPrecio() == null) {
            evento.setPrecio(0.0);
        }
        if (evento.getRequiereVerificarEdad() == null) {
            evento.setRequiereVerificarEdad(false);
        }

        
        if (evento.getFechaFin().isBefore(evento.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        try {
            if (imagen != null && !imagen.isEmpty()) {
                String nombreArchivo = UUID.randomUUID() + "_" + imagen.getOriginalFilename();
                Path ruta = Paths.get("src/main/resources/static/uploads/" + nombreArchivo);
                Files.copy(imagen.getInputStream(), ruta);
                evento.setImagenUrl("/uploads/" + nombreArchivo);
            }

            Evento nuevo = eventoService.crearEvento(evento);
            return ResponseEntity.ok(nuevo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
 // READ: Todos los eventos
    @GetMapping
    public ResponseEntity<List<Evento>> listarEventos() {
        List<Evento> eventos = eventoService.obtenerTodos();
        return ResponseEntity.ok(eventos);
    }
    
 // READ: Evento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerEventoPorId(@PathVariable Long id) {
        Evento evento = eventoService.obtenerPorId(id);
        return ResponseEntity.ok(evento);
    }
    
}
