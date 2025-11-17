package com.eventos.eventos_app.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventos.eventos_app.dto.EventoAdminDTO;
import com.eventos.eventos_app.models.Evento;
import com.eventos.eventos_app.models.Organizador;
import com.eventos.eventos_app.repository.EventoRepository;
import com.eventos.eventos_app.repository.OrganizadorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServicio {

	@Autowired
    private EventoRepository eventoRepository;
    
    @Autowired
    private OrganizadorRepository organizadorRepository;

    public List<EventoAdminDTO> obtenerEventosConOrganizadores() {
        List<Evento> eventos = eventoRepository.findAll();

        return eventos.stream().map(e -> {
            Organizador org = e.getOrganizador();

            return new EventoAdminDTO(
                e.getId(),
                e.getTitulo(),
                e.getDescripcion(),
                e.getCategoria() != null ? e.getCategoria().getNombre() : null,
                e.getFechaInicio() != null ? e.getFechaInicio().toString() : null,
                e.getFechaFin() != null ? e.getFechaFin().toString() : null,
                e.getValidado(),
                org != null ? org.getId() : null,
                org != null ? org.getNombre() + " " + org.getApellido() : null,
                org != null ? org.getEmail() : null,
                org != null && Boolean.TRUE.equals(org.getVerificado())
            );
        }).collect(Collectors.toList());
    }
    
    public void validarEvento(Long idEvento) {
        Evento evento = eventoRepository.findById(idEvento)
            .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        if(evento.getValidado()){
        	evento.setValidado(false);
        }else {
        	evento.setValidado(true);
        }
        eventoRepository.save(evento);
    }
    
    public Organizador verOrganizador(Long id){
    	return organizadorRepository.findById(id)
    			.orElseThrow(() -> new RuntimeException("Organizador no encontrado"));
    	
    }
    
    public void verificarOrganizador(Long idOrganizador) {
        Organizador org = organizadorRepository.findById(idOrganizador)
            .orElseThrow(() -> new RuntimeException("Organizador no encontrado"));

        if(org.getVerificado()) {
        	org.setVerificado(false);
        }else {
        	org.setVerificado(true);
        }
        
        organizadorRepository.save(org);
    }
    
    public void eliminarOrganizadorConEventos(Long id) {
        Organizador organizador = organizadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organizador no encontrado"));

        // Gracias a CascadeType.ALL y orphanRemoval, esto elimina también sus eventos
        organizadorRepository.delete(organizador);
    }
    
}
