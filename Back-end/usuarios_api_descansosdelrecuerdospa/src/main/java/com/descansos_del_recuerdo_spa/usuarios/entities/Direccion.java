package com.descansos_del_recuerdo_spa.usuarios.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="direccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Direccion {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false, fetch=FetchType.LAZY)
    @JoinColumn(name="usuario_id")
    @ToString.Exclude private Usuario usuario;

    private String calle;
    private String comuna;
    private String region;
    private String pais = "Chile";
    private String telefono;
}