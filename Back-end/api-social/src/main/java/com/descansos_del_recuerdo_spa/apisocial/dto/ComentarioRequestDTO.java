package com.descansos_del_recuerdo_spa.apisocial.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComentarioRequestDTO {

    @NotNull(message = "El ID del usuario debe ser obligatorio")
    private Long usuarioId;

    @NotBlank(message = "El contenido no puede estar vacio")
    private String contenido;

    private Long urnaId;
    private Integer calificacion;
}
