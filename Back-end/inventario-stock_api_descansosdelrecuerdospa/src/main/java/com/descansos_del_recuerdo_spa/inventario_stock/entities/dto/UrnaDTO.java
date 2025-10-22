package com.descansos_del_recuerdo_spa.inventario_stock.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrnaDTO {

    private Long id;
    private String idInterno;
    private String nombre;
    private String descripcionCorta;
    private BigDecimal precio;
    private Integer stock;
    private String disponible;
    private String estado;
    private String imagenPrincipal;
    private LocalDateTime fechaCreacion;

    // Atributos simplificados del microservicio Catálogo
    private String materialNombre;
    private String colorNombre;
    private String modeloNombre;
}