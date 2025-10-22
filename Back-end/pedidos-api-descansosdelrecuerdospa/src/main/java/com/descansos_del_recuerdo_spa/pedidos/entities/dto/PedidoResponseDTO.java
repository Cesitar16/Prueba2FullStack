package com.descansos_del_recuerdo_spa.pedidos.entities.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponseDTO {

    private Integer id;
    private Integer usuarioId;
    private Integer direccionId;
    private LocalDateTime fechaPedido;
    private String estado;
    private BigDecimal total;
    private List<DetallePedidoDTO> detalles;
}