package com.descansos_del_recuerdo_spa.pedidos.services.impl;

import com.descansos_del_recuerdo_spa.pedidos.entities.*;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.*;
import com.descansos_del_recuerdo_spa.pedidos.repositories.*;
import com.descansos_del_recuerdo_spa.pedidos.services.*;
import com.descansos_del_recuerdo_spa.pedidos.services.client.InventarioClientService;
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
    private final InventarioClientService inventarioClientService;

    @Transactional
    @Override
    public PedidoResponseDTO crearPedido(PedidoRequestDTO request) {
        // 1) Estado inicial
        EstadoPedido estadoInicial = estadoPedidoRepository.findById(request.getEstadoPedidoId())
                .orElseThrow(() -> new RuntimeException("Estado de pedido no encontrado"));

        // 2) Crear pedido base
        Pedido pedido = Pedido.builder()
                .usuarioId(request.getUsuarioId())
                .direccionId(request.getDireccionId())
                .fechaPedido(LocalDateTime.now())
                .estadoPedido(estadoInicial)
                .total(BigDecimal.ZERO)
                .build();

        pedido = pedidoRepository.save(pedido);

        // 3) Crear detalles (SIN setear subtotal) y acumular total
        BigDecimal total = BigDecimal.ZERO;

        for (DetallePedidoDTO d : request.getDetalles()) {
            // calcula línea local (para el total del pedido)
            BigDecimal linea = d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()));
            total = total.add(linea);

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedido)
                    .urnaId(d.getUrnaId())
                    .cantidad(d.getCantidad())
                    .precioUnitario(d.getPrecioUnitario())
                    // .subtotal(linea)  ❌ NO SETEES SUBTOTAL -> lo calcula MySQL
                    .build();

            detallePedidoRepository.save(detalle);

            // (opcional) notificar inventario
            inventarioClientService.reducirStock(
                    d.getUrnaId(),
                    d.getCantidad(),
                    "Venta realizada - Pedido #" + pedido.getId()
            );
        }

        // 4) Actualizar total del pedido
        pedido.setTotal(total);
        pedidoRepository.save(pedido);

        // 5) Devolver respuesta (tu mapToResponse ya lee det.getSubtotal() desde DB)
        return mapToResponse(pedido);
    }

    @Override
    public List<PedidoResponseDTO> listarPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoResponseDTO obtenerPedidoPorId(Integer id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return mapToResponse(pedido);
    }

    @Override
    public List<PedidoResponseDTO> listarPedidosPorUsuario(Integer usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PedidoResponseDTO actualizarEstado(Integer idPedido, Integer estadoId) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        EstadoPedido nuevoEstado = estadoPedidoRepository.findById(estadoId)
                .orElseThrow(() -> new RuntimeException("Estado de pedido no encontrado"));

        pedido.setEstadoPedido(nuevoEstado);
        pedidoRepository.save(pedido);

        return mapToResponse(pedido);
    }

    @Override
    public void eliminarPedido(Integer id) {
        pedidoRepository.deleteById(id);
    }

    // 🧠 Método auxiliar
    private PedidoResponseDTO mapToResponse(Pedido pedido) {
        List<DetallePedidoDTO> detalles = detallePedidoRepository.findByPedido_Id(pedido.getId())
                .stream()
                .map(det -> DetallePedidoDTO.builder()
                        .urnaId(det.getUrnaId())
                        .cantidad(det.getCantidad())
                        .precioUnitario(det.getPrecioUnitario())
                        .subtotal(det.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return PedidoResponseDTO.builder()
                .id(pedido.getId())
                .usuarioId(pedido.getUsuarioId())
                .direccionId(pedido.getDireccionId())
                .fechaPedido(pedido.getFechaPedido())
                .estado(pedido.getEstadoPedido().getNombre())
                .total(pedido.getTotal())
                .detalles(detalles)
                .build();
    }
}
