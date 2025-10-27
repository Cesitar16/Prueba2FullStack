package com.descansos_del_recuerdo_spa.pedidos.controllers;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.DetallePedidoDTO;
import com.descansos_del_recuerdo_spa.pedidos.services.DetallePedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/detalles-pedido")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DetallePedidoController {

    private final DetallePedidoService detallePedidoService;

    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<List<DetallePedidoDTO>> listarDetallesPorPedido(@PathVariable Long pedidoId) {
        return ResponseEntity.ok(detallePedidoService.listarDetallesPorPedido(pedidoId));
    }
}