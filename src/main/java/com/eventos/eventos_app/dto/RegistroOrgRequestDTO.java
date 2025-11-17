package com.eventos.eventos_app.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
public class RegistroOrgRequestDTO {
	
	@NotBlank @Size(min = 2, max = 30)
    public String nombre;
	
	@NotBlank @Size(min = 2, max = 30)
    public String apellido;
	
	@Email @NotBlank
    public String email;
	
	@NotBlank @Size(min = 6)
    public String password;
	
	@NotNull
    public LocalDate fechaNacimiento;
    
    @NotBlank
    public String telefono;
    
    @NotBlank
    public String nombreOrganizacion;
    
    @NotBlank
    public String direccionOrganizacion;
    
    
    public String fotoPerfil;
    
    
    public Boolean verificado;
    
    
    
}