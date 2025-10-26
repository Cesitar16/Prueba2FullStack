package com.descansos_del_recuerdo_spa.pedidos.services.impl;

import com.descansos_del_recuerdo_spa.pedidos.entities.*;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.*;
import com.descansos_del_recuerdo_spa.pedidos.repositories.*;
import com.descansos_del_recuerdo_spa.pedidos.services.*;
import com.descansos_del_recuerdo_spa.pedidos.services.client.InventarioClientService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final EstadoPedidoRepository estadoPedidoRepository;

    @Transactional
    @Override
    public PedidoResponseDTO crearPedido(PedidoRequestDTO req) {
        EstadoPedido estado = estadoPedidoRepository.findById(req.getEstadoPedidoId())
                .orElseThrow(() -> new EntityNotFoundException("Estado de pedido no encontrado"));

        Pedido pedido = Pedido.builder()
                .usuarioId(req.getUsuarioId())
                .direccionId(req.getDireccionId())
                .estadoPedido(estado)
                .fechaPedido(LocalDateTime.now())
                .total(BigDecimal.ZERO)
                .build();

        pedido = pedidoRepository.save(pedido);

        BigDecimal total = BigDecimal.ZERO;
        for (DetallePedidoDTO d : req.getDetalles()) {
            BigDecimal linea = d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()));
            total = total.add(linea);

            DetallePedido det = DetallePedido.builder()
                    .pedido(pedido)
                    .urnaId(d.getUrnaId())
                    .cantidad(d.getCantidad())
                    .precioUnitario(d.getPrecioUnitario())
                    .build(); // subtotal lo calcula la BD (columna generada)
            detallePedidoRepository.save(det);
        }

        pedido.setTotal(total);
        pedidoRepository.save(pedido);

        return toResponse(pedido);
    }

    @Transactional
    @Override
    public void actualizarEstado(Long pedidoId, Long estadoId) {
        Pedido p = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado"));
        EstadoPedido e = estadoPedidoRepository.findById(estadoId)
                .orElseThrow(() -> new EntityNotFoundException("Estado no encontrado"));
        p.setEstadoPedido(e);
        pedidoRepository.save(p);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        pedidoRepository.deleteById(id);
    }

    @Override
    public List<PedidoResponseDTO> listar() {
        return pedidoRepository.findAll().stream().map(this::toResponse).toList();
    }

    private PedidoResponseDTO toResponse(Pedido pedido) {
        List<DetallePedidoDTO> dets = detallePedidoRepository.findByPedido_Id(pedido.getId())
                .stream()
                .map(dp -> DetallePedidoDTO.builder()
                        .id(dp.getId())
                        .urnaId(dp.getUrnaId())
                        .cantidad(dp.getCantidad())
                        .precioUnitario(dp.getPrecioUnitario())
                        .subtotal(dp.getSubtotal())   // leído desde la BD
                        .build())
                .toList();

        return PedidoResponseDTO.builder()
                .id(pedido.getId())
                .usuarioId(pedido.getUsuarioId())
                .direccionId(pedido.getDireccionId())
                .fechaPedido(pedido.getFechaPedido())
                .estado(pedido.getEstadoPedido().getNombre())
                .total(pedido.getTotal())
                .detalles(dets)
                .build();
    }
}