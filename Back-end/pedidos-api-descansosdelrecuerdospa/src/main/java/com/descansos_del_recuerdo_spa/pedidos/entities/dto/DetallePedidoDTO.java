package com.descansos_del_recuerdo_spa.pedidos.entities.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedidoDTO {
    private Long id;                 // solo en respuesta
    private Long urnaId;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;     // solo en respuesta (lo calcula la BD)
}