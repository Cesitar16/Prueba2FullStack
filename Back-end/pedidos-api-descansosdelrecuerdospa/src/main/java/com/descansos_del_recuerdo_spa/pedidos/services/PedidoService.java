package com.descansos_del_recuerdo_spa.pedidos.services;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoRequestDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoResponseDTO;
import java.util.List;

public interface PedidoService {
    PedidoResponseDTO crearPedido(PedidoRequestDTO req);
    void actualizarEstado(Long pedidoId, Long estadoId);
    void eliminar(Long id);
    List<PedidoResponseDTO> listar();
    List<PedidoResponseDTO> listarPorUsuario(Long usuarioId);
}