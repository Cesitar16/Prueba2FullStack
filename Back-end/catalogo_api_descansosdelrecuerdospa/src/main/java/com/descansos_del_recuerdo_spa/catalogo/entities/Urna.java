package com.descansos_del_recuerdo_spa.catalogo.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "urna")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Urna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_interno", length = 50)
    private String idInterno;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(name = "descripcion_corta", columnDefinition = "TEXT")
    private String descripcionCorta;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "descripcion_detallada", columnDefinition = "TEXT")
    private String descripcionDetallada;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false, columnDefinition = "ENUM('s','n') DEFAULT 's'")
    private String disponible = "s";

    private BigDecimal ancho;
    private BigDecimal alto;
    private BigDecimal profundidad;
    private BigDecimal peso;

    @Column(name = "imagen_principal", length = 255)
    private String imagenPrincipal;

    @Column(nullable = false, columnDefinition = "ENUM('Activo','Inactivo') DEFAULT 'Activo'")
    private String estado = "Activo";

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // Relaciones
    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    @ManyToOne
    @JoinColumn(name = "modelo_id")
    private Modelo modelo;

    @OneToMany(mappedBy = "urna", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ImagenUrna> imagenes;
}