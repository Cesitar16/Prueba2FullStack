package com.descansos_del_recuerdo_spa.pedidos.controllers;

import com.descansos_del_recuerdo_spa.pedidos.entities.dto.DetallePedidoDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoRequestDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoResponseDTO;
import com.descansos_del_recuerdo_spa.pedidos.repositories.DetallePedidoRepository;
import com.descansos_del_recuerdo_spa.pedidos.services.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;
    private final DetallePedidoRepository detallePedidoRepository;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> crearPedido(@Valid @RequestBody PedidoRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearPedido(request));
    }

    @GetMapping
    public List<PedidoResponseDTO> listar() {
        return pedidoService.listar();
    }

    @PutMapping("/{id}/estado/{estadoId}")
    public ResponseEntity<Void> actualizarEstado(@PathVariable Long id, @PathVariable Long estadoId) {
        pedidoService.actualizarEstado(id, estadoId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/detalles")
    public List<DetallePedidoDTO> detalles(@PathVariable Long id) {
        return detallePedidoRepository.findByPedido_Id(id).stream()
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