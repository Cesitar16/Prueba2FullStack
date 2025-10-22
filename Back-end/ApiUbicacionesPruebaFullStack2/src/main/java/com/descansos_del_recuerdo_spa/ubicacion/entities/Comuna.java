package com.descansos_del_recuerdo_spa.ubicacion.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comuna")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // En tu SQL la columna también se llama "id"
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    // Relación con Region
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    @JsonBackReference // evita recursión infinita al serializar JSON
    private Region region;
}
