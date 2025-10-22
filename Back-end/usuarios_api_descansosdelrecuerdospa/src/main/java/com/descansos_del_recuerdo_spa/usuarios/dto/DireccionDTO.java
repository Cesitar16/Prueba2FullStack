package com.descansos_del_recuerdo_spa.usuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para enviar datos de Direccion al frontend
 * sin problemas de serialización y sin exponer el objeto Usuario completo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DireccionDTO {
    private Long id;
    private String calle;
    private String comuna;
    private String region;
    private String pais;
    private String telefono;
    private Long usuarioId;
    private String usuarioNombre;
}
