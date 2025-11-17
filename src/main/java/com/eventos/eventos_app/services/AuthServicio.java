package com.eventos.eventos_app.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.eventos.eventos_app.config.JwtConfig;
import com.eventos.eventos_app.dto.LoginOrgRequestDTO;
import com.eventos.eventos_app.dto.LoginOrgResponseDTO;
import com.eventos.eventos_app.dto.RegistroOrgRequestDTO;
import com.eventos.eventos_app.dto.RegistroOrgResponseDTO;
import com.eventos.eventos_app.models.Organizador;
import com.eventos.eventos_app.models.Rol;
import com.eventos.eventos_app.repository.OrganizadorRepository;

@Service
public class AuthServicio {

	@Autowired
	private OrganizadorRepository orgRepository;

	@Autowired
	private JwtConfig jwt;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

	public RegistroOrgResponseDTO registrar(RegistroOrgRequestDTO dto, MultipartFile imagen) throws IOException {
		if (orgRepository.existsByEmail(dto.email)) {
			throw new RuntimeException("EMAIL_EXISTE");
		}

		Organizador o = new Organizador();
		o.setNombre(dto.nombre);
		o.setApellido(dto.apellido);
		o.setEmail(dto.email);
		o.setClave(encoder.encode(dto.password));
		o.setFechaNacimiento(dto.fechaNacimiento);
		o.setTelefono(dto.telefono);
		o.setNombreOrganizacion(dto.nombreOrganizacion);
		o.setFotoPerfil(dto.fotoPerfil);
		o.setDireccionOrganizacion(dto.direccionOrganizacion);
		o.setVerificado(false);
		o.setRol(Rol.ORGANIZADOR);

        if (imagen != null && !imagen.isEmpty()) {
            String nombreArchivo = UUID.randomUUID() + "_" + imagen.getOriginalFilename();
            Path ruta = Paths.get("src/main/resources/static/uploads/" + nombreArchivo);
            Files.copy(imagen.getInputStream(), ruta);
            
            o.setFotoPerfil("/uploads/" + nombreArchivo);
        }

		Organizador saved = orgRepository.save(o);

		return new RegistroOrgResponseDTO(saved.getId(), saved.getNombre(), saved.getApellido(), saved.getEmail(),
				saved.getTelefono(), saved.getFechaNacimiento(), saved.getNombreOrganizacion(),
				saved.getDireccionOrganizacion(), saved.getFotoPerfil(), saved.getVerificado(), saved.getRol().name());
	}

	public LoginOrgResponseDTO login(LoginOrgRequestDTO dto) {
		
		Organizador o = orgRepository.findByEmail(dto.email)
	            .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña incorrectos"));

	    if (!encoder.matches(dto.password, o.getClave())) {
	        throw new IllegalArgumentException("Usuario o contraseña incorrectos");
	    }
	    
	    if (!passwordEncoder.matches(dto.getPassword(), o.getClave())) {
	    	throw new IllegalArgumentException("Usuario o contraseña incorrectos");
	    }

	    String token = jwt.generarToken(o.getEmail(), o.getRol().name());

	    return new LoginOrgResponseDTO(o.getId(),token, o.getNombre(), o.getRol().name());
    }

}
