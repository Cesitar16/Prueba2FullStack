package com.descansos_del_recuerdo_spa.pedidos.entities.dto;

import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoRequestDTO {

    private Integer usuarioId;
    private Integer direccionId;
    private Integer estadoPedidoId;
    private List<DetallePedidoDTO> detalles;

    // opcional: si lo calculas en backend, este campo puede omitirse
    private BigDecimal total;
}
