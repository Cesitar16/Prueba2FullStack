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

    private final DetallePedidoRepository detallePedidoRepository;

    @Override
    public List<DetallePedidoDTO> listarDetallesPorPedido(Integer pedidoId) {
        return detallePedidoRepository.findByPedido_Id(pedidoId)
                .stream()
                .map(det -> DetallePedidoDTO.builder()
                        .urnaId(det.getUrnaId())
                        .cantidad(det.getCantidad())
                        .precioUnitario(det.getPrecioUnitario())
                        .subtotal(det.getSubtotal())
                        .build())
                .collect(Collectors.toList());
    }
}
