package com.descansos_del_recuerdo_spa.inventario_stock.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ID de la urna que viene desde el microservicio de Catálogo.
     * No hay relación directa con una entidad Urna.
     */
    @Column(name = "urna_id", nullable = false)
    private Long urnaId;

    @Column(nullable = false)
    private Integer cantidadActual;

    @Column(nullable = false)
    private Integer cantidadMinima = 0;

    @Column(nullable = false)
    private Integer cantidadMaxima = 0;

    @Column(length = 255)
    private String ubicacionFisica; // ejemplo: "Bodega Central - Estante A3"

    @Column(length = 50)
    private String estado = "Disponible"; // o "Agotado", "Bajo Stock"

    @Column(name = "ultima_actualizacion")
    private LocalDateTime ultimaActualizacion = LocalDateTime.now();
}