package com.descansos_del_recuerdo_spa.pedidos.services;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoRequestDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoResponseDTO;
import java.util.List;

public interface PedidoService {

    PedidoResponseDTO crearPedido(PedidoRequestDTO request);
    List<PedidoResponseDTO> listarPedidos();
    PedidoResponseDTO obtenerPedidoPorId(Integer id);
    List<PedidoResponseDTO> listarPedidosPorUsuario(Integer usuarioId);
    PedidoResponseDTO actualizarEstado(Integer idPedido, Integer estadoId);
    void eliminarPedido(Integer id);
}
