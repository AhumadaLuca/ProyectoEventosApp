package com.eventos.eventos_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoAdminDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String categoria;
    private String fechaInicio;
    private String fechaFin;
    private boolean validado;

    // Datos del organizador
    private Long organizadorId;
    private String nombreOrganizador;
    private String emailOrganizador;
    private boolean verificadoOrganizador;
}
