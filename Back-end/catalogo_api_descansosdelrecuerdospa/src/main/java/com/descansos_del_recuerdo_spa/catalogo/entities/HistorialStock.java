package com.descansos_del_recuerdo_spa.catalogo.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cantidad_anterior")
    private Integer cantidadAnterior;

    @Column(name = "cantidad_nueva")
    private Integer cantidadNueva;

    @Column(length = 255)
    private String motivo;

    @Column(name = "fecha")
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "urna_id", nullable = false)
    @JsonIgnore
    private Urna urna;
}