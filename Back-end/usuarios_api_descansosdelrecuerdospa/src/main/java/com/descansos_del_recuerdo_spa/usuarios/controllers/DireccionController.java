package com.descansos_del_recuerdo_spa.usuarios.controllers;

import com.descansos_del_recuerdo_spa.usuarios.dto.DireccionDTO;
import com.descansos_del_recuerdo_spa.usuarios.entities.Direccion;
import com.descansos_del_recuerdo_spa.usuarios.services.DireccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST para gestionar direcciones de usuarios.
 * Incluye CRUD completo y conversión a DTOs para evitar problemas de serialización.
 */
@RestController
@RequestMapping("/api/direcciones")
@CrossOrigin(origins = "*")
public class DireccionController {

    private final DireccionService service;

    public DireccionController(DireccionService service) {
        this.service = service;
    }

    // 📦 Crear nueva dirección
    @PostMapping
    public ResponseEntity<Direccion> create(@RequestBody Direccion direccion) {
        return ResponseEntity.status(201).body(service.save(direccion));
    }

    // 🔍 Obtener todas las direcciones (usando DTO)
    @GetMapping
    public ResponseEntity<List<DireccionDTO>> getAll() {
        List<DireccionDTO> dtos = service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 🔍 Obtener una dirección por ID
    @GetMapping("/{id}")
    public ResponseEntity<DireccionDTO> getById(@PathVariable Long id) {
        Direccion d = service.findById(id);
        return d != null ? ResponseEntity.ok(toDTO(d)) : ResponseEntity.notFound().build();
    }

    // 🔍 Obtener direcciones por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DireccionDTO>> getByUsuario(@PathVariable Long usuarioId) {
        List<DireccionDTO> dtos = service.findByUsuario(usuarioId).stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ✏️ Actualizar completa (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Direccion> update(@PathVariable Long id, @RequestBody Direccion nuevaDireccion) {
        return ResponseEntity.ok(service.update(id, nuevaDireccion));
    }

    // 🩹 Actualizar parcialmente (PATCH)
    @PatchMapping("/{id}")
    public ResponseEntity<Direccion> patch(@PathVariable Long id, @RequestBody Direccion cambios) {
        return ResponseEntity.ok(service.patch(id, cambios));
    }

    // 🗑️ Eliminar dirección
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔄 Conversor Entity → DTO
    private DireccionDTO toDTO(Direccion d) {
        return DireccionDTO.builder()
                .id(d.getId())
                .calle(d.getCalle())
                .comuna(d.getComuna())
                .region(d.getRegion())
                .pais(d.getPais())
                .telefono(d.getTelefono())
                .usuarioId(d.getUsuario() != null ? d.getUsuario().getId() : null)
                .usuarioNombre(d.getUsuario() != null ? d.getUsuario().getNombre() : null)
                .build();
    }
}
