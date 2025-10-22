package com.descansos_del_recuerdo_spa.catalogo.controller;

import com.descansos_del_recuerdo_spa.catalogo.entities.HistorialStock;
import com.descansos_del_recuerdo_spa.catalogo.service.HistorialStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-stock")
@CrossOrigin(origins = "*")
public class HistorialStockController {

    private final HistorialStockService historialStockService;

    public HistorialStockController(HistorialStockService historialStockService) {
        this.historialStockService = historialStockService;
    }

    @GetMapping("/urna/{urnaId}")
    public ResponseEntity<List<HistorialStock>> getByUrna(@PathVariable Long urnaId) {
        return ResponseEntity.ok(historialStockService.findByUrna(urnaId));
    }

    @PostMapping
    public ResponseEntity<HistorialStock> create(@RequestBody HistorialStock historialStock) {
        return ResponseEntity.status(201).body(historialStockService.save(historialStock));
    }
}