package com.descansos_del_recuerdo_spa.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email
    @NotBlank
    private String correo;

    @NotBlank
    private String password;
}