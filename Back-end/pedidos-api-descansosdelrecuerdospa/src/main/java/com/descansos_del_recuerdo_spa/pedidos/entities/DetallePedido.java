package com.descansos_del_recuerdo_spa.pedidos.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "detalle_pedido")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // dueño del detalle
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    // en tu diseño usas ID suelta de Urna
    @Column(name = "urna_id", nullable = false)
    private Long urnaId;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    // SUBTOTAL lo calcula MySQL (columna generada) → nunca insertar/actualizar
    @Column(name = "subtotal", precision = 10, scale = 2, insertable = false, updatable = false)
    private BigDecimal subtotal;
}