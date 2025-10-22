package com.descansos_del_recuerdo_spa.catalogo.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UrnaInputDTO {
    private String idInterno;
    private String nombre;
    private String descripcionCorta;
    private String descripcionDetallada;
    private BigDecimal precio;
    private Integer stock;
    private String disponible;
    private BigDecimal ancho;
    private BigDecimal alto;
    private BigDecimal profundidad;
    private BigDecimal peso;
    private String imagenPrincipal;

    // Campos que sí aceptan IDs planos
    private Long materialId;
    private Long colorId;
    private Long modeloId;
}