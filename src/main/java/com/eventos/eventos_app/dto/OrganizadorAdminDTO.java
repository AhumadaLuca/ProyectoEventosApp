package com.eventos.eventos_app.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizadorAdminDTO {
	private Long organizadorId; 
	private String nombreOrganizador; 
	private String emailOrganizador; 
	private boolean verificadoOrganizador;
    private List<EventosAdminDTO> eventos;
}
