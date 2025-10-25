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
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(name = "urna_id", nullable = false)
    private Integer urnaId;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @org.hibernate.annotations.Generated(org.hibernate.annotations.GenerationTime.ALWAYS)
    @Column(name = "subtotal", precision = 10, scale = 2, insertable = false, updatable = false)
    private java.math.BigDecimal subtotal;
}
