package com.eventos.eventos_app.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RegistroOrgResponseDTO {
	
	public Long id;
    public String nombre;
    public String apellido;
    public String email;
    public String telefono;
    public LocalDate fechaNacimiento;
    public String nombreOrganizacion;
    public String direccionOrganizacion;
    public String fotoPerfil;
    public Boolean verificado;
    public String rol;
    
	public RegistroOrgResponseDTO(Long id, String nombre, String apellido, String email, String telefono,
			LocalDate fechaNacimiento, String nombreOrganizacion, String direccionOrganizacion, String fotoPerfil,
			Boolean verificado, String rol) {
		this.id = id;
		this.nombre = nombre;
		this.apellido = apellido;
		this.email = email;
		this.telefono = telefono;
		this.fechaNacimiento = fechaNacimiento;
		this.nombreOrganizacion = nombreOrganizacion;
		this.direccionOrganizacion = direccionOrganizacion;
		this.fotoPerfil = fotoPerfil;
		this.verificado = verificado;
		this.rol = rol;
	}
    
	

}
