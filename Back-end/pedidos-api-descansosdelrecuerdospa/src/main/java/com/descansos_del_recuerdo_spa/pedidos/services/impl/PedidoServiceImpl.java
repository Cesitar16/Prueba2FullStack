package com.descansos_del_recuerdo_spa.pedidos.services.impl;

import com.descansos_del_recuerdo_spa.pedidos.entities.*;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.*;
import com.descansos_del_recuerdo_spa.pedidos.repositories.*;
import com.descansos_del_recuerdo_spa.pedidos.services.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final EstadoPedidoRepository estadoPedidoRepository;

    @Transactional
    @Override
    public PedidoResponseDTO crearPedido(PedidoRequestDTO req) {
        // 1. Validar Estado
        EstadoPedido estado = estadoPedidoRepository.findById(req.getEstadoPedidoId())
                .orElseThrow(() -> new EntityNotFoundException("Estado no encontrado"));

        // 2. Construir entidad base
        Pedido pedido = Pedido.builder()
                .usuarioId(req.getUsuarioId())
                .direccionId(req.getDireccionId())
                .estadoPedido(estado)
                .fechaPedido(LocalDateTime.now())
                .build();

        // 3. Procesar Detalles y Calcular Total Neto
        // OJO: Aquí asumimos que el precioUnitario viene del request.
        // Idealmente deberías validarlo contra el ms-catalogo, pero para este paso confiamos en el item.
        BigDecimal sumaNeto = BigDecimal.ZERO;

        List<DetallePedido> detalles = req.getDetalles().stream().map(d -> {
            // Calculamos subtotal por item
            BigDecimal subtotalItem = d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()));

            return DetallePedido.builder()
                    .pedido(pedido)
                    .urnaId(d.getUrnaId())
                    .cantidad(d.getCantidad())
                    .precioUnitario(d.getPrecioUnitario())
                    // .subtotal(subtotalItem) // Si tuvieras columna subtotal en BD
                    .build();
        }).toList();

        // Sumar todos los subtotales
        for (DetallePedido d : detalles) {
            BigDecimal sub = d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()));
            sumaNeto = sumaNeto.add(sub);
        }

        // 4. APLICAR IVA (19%) EN EL BACKEND
        // Total = Neto * 1.19
        BigDecimal totalConIva = sumaNeto.multiply(new BigDecimal("1.19"));

        // Redondear a 0 decimales (Pesos Chilenos no usan centavos) o 2 según tu preferencia
        pedido.setTotal(totalConIva.setScale(0, RoundingMode.HALF_UP));

        pedido.setDetalles(detalles);

        // 5. Guardar (Cascada guarda los detalles)
        Pedido guardado = pedidoRepository.save(pedido);

        return toResponse(guardado);
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

    @Override
    @Transactional(readOnly = true) // Opcional: mejora rendimiento en lecturas
    public List<PedidoResponseDTO> listarPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}