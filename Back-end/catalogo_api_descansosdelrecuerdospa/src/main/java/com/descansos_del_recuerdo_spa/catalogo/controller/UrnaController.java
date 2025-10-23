package com.descansos_del_recuerdo_spa.catalogo.controller;

import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;
import com.descansos_del_recuerdo_spa.catalogo.service.UrnaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.descansos_del_recuerdo_spa.catalogo.dto.UrnaInputDTO;

import java.util.List;

@RestController
@RequestMapping("/api/urnas")
@CrossOrigin(origins = "http://localhost:5173") // Ajusta si usas otro puerto o dominio
public class UrnaController {

    @Autowired
    private UrnaService urnaService;

    // ✅ Obtener todas las urnas
    @GetMapping
    public ResponseEntity<List<Urna>> getAll() {
        List<Urna> urnas = urnaService.findAll();
        return urnas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(urnas);
    }

    // ✅ Obtener urna por ID
    @GetMapping("/{id}")
    public ResponseEntity<Urna> getById(@PathVariable Long id) {
        return urnaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Obtener urnas por material (opcional, si se usa)
    @GetMapping("/material/{materialId}")
    public ResponseEntity<List<Urna>> getByMaterial(@PathVariable Long materialId) {
        List<Urna> urnas = urnaService.findByMaterial(materialId);
        return urnas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(urnas);
    }

    // ✅ Crear una nueva urna
    @PostMapping
    public ResponseEntity<Urna> create(@RequestBody UrnaInputDTO dto) {
        Urna nueva = urnaService.save(dto);
        return ResponseEntity.status(201).body(nueva);
    }

    // ✅ Actualizar parcialmente (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<Urna> update(@PathVariable Long id, @RequestBody UrnaInputDTO dto) {
        try {
            Urna actualizada = urnaService.update(id, dto);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Eliminar urna
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        urnaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}