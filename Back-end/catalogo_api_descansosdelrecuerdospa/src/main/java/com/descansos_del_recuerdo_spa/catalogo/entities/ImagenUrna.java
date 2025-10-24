package com.descansos_del_recuerdo_spa.catalogo.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "imagen_urna")
public class ImagenUrna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; // 👈 nombre del archivo físico
    private String url;    // 👈 URL pública (por ejemplo /uploads/imagen.jpg)
    private boolean principal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "urna_id")
    @JsonBackReference
    private Urna urna;
}
