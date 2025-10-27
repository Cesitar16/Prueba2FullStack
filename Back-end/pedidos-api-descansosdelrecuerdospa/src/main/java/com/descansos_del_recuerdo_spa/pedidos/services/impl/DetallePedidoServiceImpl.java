package com.descansos_del_recuerdo_spa.pedidos.services.impl;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.DetallePedidoDTO;
import com.descansos_del_recuerdo_spa.pedidos.repositories.DetallePedidoRepository;
import com.descansos_del_recuerdo_spa.pedidos.services.DetallePedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DetallePedidoServiceImpl implements DetallePedidoService {

    private final DetallePedidoRepository repository;

    @Override
    public List<DetallePedidoDTO> listarDetallesPorPedido(Long pedidoId) {
        return repository.findByPedido_Id(pedidoId).stream()
                .map(dp -> DetallePedidoDTO.builder()
                        .id(dp.getId())
                        .urnaId(dp.getUrnaId())
                        .cantidad(dp.getCantidad())
                        .precioUnitario(dp.getPrecioUnitario())
                        .subtotal(dp.getSubtotal())
                        .build())
                .toList();
    }
}