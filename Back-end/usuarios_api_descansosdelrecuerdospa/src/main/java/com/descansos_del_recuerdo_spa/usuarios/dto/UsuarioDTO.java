package com.descansos_del_recuerdo_spa.usuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private Long id; private String nombre; private String correo;
    private String rol; private String estado; private LocalDateTime fechaCreacion;
}