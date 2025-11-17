package com.eventos.eventos_app.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eventos.eventos_app.dto.LoginOrgRequestDTO;
import com.eventos.eventos_app.dto.LoginOrgResponseDTO;
import com.eventos.eventos_app.dto.RegistroOrgResponseDTO;
import com.eventos.eventos_app.dto.RegistroOrgRequestDTO;
import com.eventos.eventos_app.services.AuthServicio;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthServicio authServicio;

	@PostMapping(value = "/registro", consumes = { "multipart/form-data" })
	public ResponseEntity<?> registrarOrganizador(
			@Valid @RequestPart("organizador") RegistroOrgRequestDTO organizadorDTO,
			@RequestPart(value = "fotoPerfil", required = false) MultipartFile imagen) {
		System.out.println("📩 Registro recibido: " + organizadorDTO);
		System.out.println("📷 Imagen: " + (imagen != null ? imagen.getOriginalFilename() : "Sin imagen"));
		try {
            RegistroOrgResponseDTO nuevo = authServicio.registrar(organizadorDTO, imagen);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);

        } catch (RuntimeException e) {
            if (e.getMessage().equals("EMAIL_EXISTE")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El correo ya está registrado");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en los datos");
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
	

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginOrgRequestDTO dto) {
		try {
			LoginOrgResponseDTO resp = authServicio.login(dto);
			return ResponseEntity.ok(resp);
		}catch (IllegalArgumentException e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
	    }
	}

}
