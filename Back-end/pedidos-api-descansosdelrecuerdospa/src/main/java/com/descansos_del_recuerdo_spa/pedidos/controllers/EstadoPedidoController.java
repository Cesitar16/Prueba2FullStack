package com.descansos_del_recuerdo_spa.pedidos.controllers;

import com.descansos_del_recuerdo_spa.pedidos.entities.EstadoPedido;
import com.descansos_del_recuerdo_spa.pedidos.services.EstadoPedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estados-pedido")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EstadoPedidoController {

    private final EstadoPedidoService estadoPedidoService;

    @GetMapping
    public ResponseEntity<List<EstadoPedido>> listar() {
        return ResponseEntity.ok(estadoPedidoService.listarEstados());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoPedido> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estadoPedidoService.obtenerPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<EstadoPedido> obtenerPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(estadoPedidoService.obtenerPorNombre(nombre));
    }
}
