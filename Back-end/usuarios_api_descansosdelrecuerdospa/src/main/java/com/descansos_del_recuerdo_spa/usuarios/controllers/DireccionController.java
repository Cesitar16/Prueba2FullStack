package com.descansos_del_recuerdo_spa.usuarios.controllers;

import com.descansos_del_recuerdo_spa.usuarios.dto.DireccionDTO;
import com.descansos_del_recuerdo_spa.usuarios.entities.Direccion;
import com.descansos_del_recuerdo_spa.usuarios.services.DireccionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para gestionar direcciones de usuarios.
 * Incluye CRUD completo y conversión a DTOs para evitar problemas de serialización.
 */
// Opcional: habilita CORS para tu front local
@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    private final DireccionService service;

    public DireccionController(DireccionService service) {
        this.service = service;
    }

    // GET /api/direcciones/{id} -> 200 con DTO o 404
    @GetMapping("/{id}")
    public ResponseEntity<DireccionDTO> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(DireccionDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/direcciones/usuario/{usuarioId} -> lista de DTOs
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<java.util.List<DireccionDTO>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.findByUsuarioId(usuarioId));
    }

    // POST /api/direcciones -> 201 con DTO creado
    @PostMapping
    public ResponseEntity<DireccionDTO> create(@Valid @RequestBody DireccionDTO dto) {
        Direccion saved = service.createFromDto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(DireccionDTO.from(saved));
    }

    // PUT /api/direcciones/{id} -> 200 con DTO actualizado
    @PutMapping("/{id}")
    public ResponseEntity<DireccionDTO> update(@PathVariable Long id, @Valid @RequestBody DireccionDTO dto) {
        dto.setId(id);
        Direccion updated = service.updateFromDto(dto);
        return ResponseEntity.ok(DireccionDTO.from(updated));
    }

    // (Opcional) Si quieres soportar delete:
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> delete(@PathVariable Long id) {
    //     service.deleteById(id); // agrega este método al service si lo necesitas
    //     return ResponseEntity.noContent().build();
    // }

    // Manejo simple de 404 cuando el service lanza EntityNotFoundException
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<java.util.Map<String, Object>> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(java.util.Map.of("message", ex.getMessage()));
    }
}