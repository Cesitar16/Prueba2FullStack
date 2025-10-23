package com.descansos_del_recuerdo_spa.catalogo.dto;

import lombok.Data;

@Data
public class UrnaInputDTO {
    private String nombre;
    private String descripcionCorta;
    private String descripcionDetallada;
    private Double precio;
    private Double alto;
    private Double ancho;
    private Double profundidad;
    private Double peso;
    private String disponible; // 's' o 'n'
    private String estado;

    // Relaciones — permite recibir id y nombre desde el front
    private Long materialId;
    private String materialNombre;

    private Long colorId;
    private String colorNombre;

    private Long modeloId;
    private String modeloNombre;

    private String imagenPrincipal;
}