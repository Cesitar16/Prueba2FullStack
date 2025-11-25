package com.descansos_del_recuerdo_spa.apisocial.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comentario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "urna_id")
    private Long urnaId;

    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "calificacion")
    private Integer calificacion;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @Column(name = "estado", nullable = false)
    private String estado = "VISIBLE";

    private LocalDateTime fecha = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
        if (estado == null) estado = "VISIBLE";
        if(tipo == null) tipo = (urnaId == null) ? "FORO" : "RESENA";
    }
}
