package com.eventos.eventos_app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventos.eventos_app.models.Organizador;
import com.eventos.eventos_app.repository.OrganizadorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrganizadorServicio {
	
	 @Autowired
	    private OrganizadorRepository organizadorRepository;
	
	public Organizador verOrganizador(Long id){
    	return organizadorRepository.findById(id)
    			.orElseThrow(() -> new RuntimeException("Organizador no encontrado"));
    	
    }

}
