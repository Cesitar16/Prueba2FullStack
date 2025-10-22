package com.descansos_del_recuerdo_spa.inventario_stock.controllers;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.MovimientoStock;
import com.descansos_del_recuerdo_spa.inventario_stock.services.MovimientoStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "*")
public class MovimientoStockController {

    private final MovimientoStockService movimientoStockService;

    public MovimientoStockController(MovimientoStockService movimientoStockService) {
        this.movimientoStockService = movimientoStockService;
    }

    // ======================
    // 📘 LISTAR MOVIMIENTOS POR INVENTARIO
    // ======================
    @GetMapping("/inventario/{inventarioId}")
    public ResponseEntity<List<MovimientoStock>> getByInventario(@PathVariable Long inventarioId) {
        return ResponseEntity.ok(movimientoStockService.findByInventario(inventarioId));
    }

    // ======================
    // 🟢 CREAR NUEVO MOVIMIENTO MANUAL (opcional)
    // ======================
    @PostMapping
    public ResponseEntity<MovimientoStock> create(@RequestBody MovimientoStock movimientoStock) {
        return ResponseEntity.status(201).body(movimientoStockService.save(movimientoStock));
    }
}