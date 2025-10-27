package com.descansos_del_recuerdo_spa.pedidos.services;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.DetallePedidoDTO;
import java.util.List;

public interface DetallePedidoService {

    List<DetallePedidoDTO> listarDetallesPorPedido(Long pedidoId);
}
