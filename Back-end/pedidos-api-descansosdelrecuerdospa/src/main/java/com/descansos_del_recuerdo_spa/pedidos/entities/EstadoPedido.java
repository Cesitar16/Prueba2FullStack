package com.descansos_del_recuerdo_spa.pedidos.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estado_pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String nombre;

    @Column(length = 255)
    private String descripcion;
}