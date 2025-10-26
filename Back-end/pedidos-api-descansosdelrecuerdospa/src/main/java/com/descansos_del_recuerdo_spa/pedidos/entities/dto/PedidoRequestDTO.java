package com.descansos_del_recuerdo_spa.pedidos.entities.dto;

import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoRequestDTO {
    private Long usuarioId;
    private Long direccionId;                  // puede ser null
    private Long estadoPedidoId;               // 1 = Pendiente
    private List<DetallePedidoDTO> detalles;   // sin subtotal
    private BigDecimal total;                  // numérico
}
