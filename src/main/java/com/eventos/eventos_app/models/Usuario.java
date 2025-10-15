package com.eventos.eventos_app.models;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="nombre", length=20, nullable = false)
	private String nombre;
	
	@Column(name="apellido", length=20, nullable = false)
	private String apellido;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name="clave", nullable = false)
    private String clave;

    @Enumerated(EnumType.STRING)
    private Rol rol;
}
