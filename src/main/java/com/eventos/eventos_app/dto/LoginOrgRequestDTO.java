package com.eventos.eventos_app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginOrgRequestDTO {
	
	@Email @NotBlank
	public String email;
	
	@NotBlank
    public String password;

}
