package com.descansos_del_recuerdo_spa.usuarios.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=100) private String nombre;
    @Column(nullable=false, unique=true, length=120) private String correo;

    /** Password encriptado con BCrypt */
    @Column(nullable=false, length=255) private String password;

    /** Rol como texto por tu esquema (Administrador/Cliente) */
    @Column(nullable=false, length=20) private String rol = "Cliente";

    @Column(nullable=false, length=10) private String estado = "Activo";

    @Column(name="fecha_creacion") private LocalDateTime fechaCreacion = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
