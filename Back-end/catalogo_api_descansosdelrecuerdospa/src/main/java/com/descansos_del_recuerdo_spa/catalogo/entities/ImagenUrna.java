package com.descansos_del_recuerdo_spa.catalogo.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagen_urna")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenUrna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private Boolean principal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "urna_id")
    @JsonBackReference
    private Urna urna;
}