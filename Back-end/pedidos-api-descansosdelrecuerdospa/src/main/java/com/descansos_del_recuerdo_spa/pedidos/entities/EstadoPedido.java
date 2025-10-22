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
    private Integer id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;
}
