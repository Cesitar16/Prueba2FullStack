package com.descansos_del_recuerdo_spa.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String nombre;

    @Email
    @NotBlank
    private String correo;
    @NotBlank @Size(min=8, max=72)
    private String password; // BCrypt ok hasta 72

    private String rol; // opcional, default Cliente
}