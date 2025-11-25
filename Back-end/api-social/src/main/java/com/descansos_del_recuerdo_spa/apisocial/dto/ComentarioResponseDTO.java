package com.descansos_del_recuerdo_spa.apisocial.dto;

import com.descansos_del_recuerdo_spa.apisocial.entities.Comentario;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComentarioResponseDTO {

    private Long id;
    private Long usuarioId;
    private String contenido;
    private LocalDateTime fecha;

    private Long urnaId;
    private Integer calificacion;

    private String tipo;


    //Convertir entidad a DTO
    public static ComentarioResponseDTO fromEntity(Comentario c) {
        return ComentarioResponseDTO.builder()
                .id(c.getId())
                .usuarioId(c.getUsuarioId())
                .contenido(c.getContenido())
                .fecha(c.getFecha())
                .urnaId(c.getUrnaId())
                .calificacion(c.getCalificacion())
                .tipo(c.getTipo())
                .build();

    }

}
