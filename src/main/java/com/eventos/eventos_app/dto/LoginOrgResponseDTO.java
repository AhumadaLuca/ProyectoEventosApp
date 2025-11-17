package com.eventos.eventos_app.dto;

import lombok.Data;

@Data
public class LoginOrgResponseDTO {
	
	public Long id;
	public String token;
    public String nombre;
    public String rol;
    
	public LoginOrgResponseDTO(Long id, String token, String nombre, String rol) {
		this.id = id;
		this.token = token;
		this.nombre = nombre;
		this.rol = rol;
	}

    

}
