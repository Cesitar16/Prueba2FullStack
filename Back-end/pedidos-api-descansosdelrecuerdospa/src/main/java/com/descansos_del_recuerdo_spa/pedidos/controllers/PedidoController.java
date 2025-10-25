package com.descansos_del_recuerdo_spa.pedidos.controllers;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.DetallePedidoDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoRequestDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoResponseDTO;
import com.descansos_del_recuerdo_spa.pedidos.services.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    // 🟢 Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<PedidoResponseDTO> crearPedido(@RequestBody PedidoRequestDTO request) {
        PedidoResponseDTO nuevoPedido = pedidoService.crearPedido(request);
        return ResponseEntity.ok(nuevoPedido);
    }

    // 🔵 Listar todos los pedidos
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }

    // 🟣 Obtener pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(pedidoService.obtenerPedidoPorId(id));
    }

    // 🟡 Listar pedidos por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidoResponseDTO>> listarPorUsuario(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorUsuario(usuarioId));
    }

    // 🟠 Actualizar estado de un pedido
    @PutMapping("/{id}/estado/{estadoId}")
    public ResponseEntity<PedidoResponseDTO> actualizarEstado(@PathVariable Integer id, @PathVariable Integer estadoId) {
        return ResponseEntity.ok(pedidoService.actualizarEstado(id, estadoId));
    }

    // 🔴 Eliminar un pedido
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Integer id) {
        pedidoService.eliminarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
