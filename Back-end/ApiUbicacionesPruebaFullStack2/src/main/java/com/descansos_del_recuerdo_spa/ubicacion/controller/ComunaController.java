package com.descansos_del_recuerdo_spa.ubicacion.controller;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Comuna;
import com.descansos_del_recuerdo_spa.ubicacion.service.ComunaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comunas")
@CrossOrigin(origins = "*")
public class ComunaController {

    @Autowired
    private ComunaService comunaService;

    // ✅ Listar todas las comunas
    @GetMapping
    public ResponseEntity<List<Comuna>> listarComunas() {
        return ResponseEntity.ok(comunaService.findAll());
    }

    // ✅ Obtener una comuna por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Comuna> obtenerComunaPorId(@PathVariable Integer id) {
        Comuna comuna = comunaService.findById(id);
        if (comuna == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(comuna);
    }

    // ✅ Listar comunas según región
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Comuna>> listarComunasPorRegion(@PathVariable Integer regionId) {
        return ResponseEntity.ok(comunaService.findByRegionId(regionId));
    }

    // ✅ Crear una nueva comuna
    @PostMapping
    public ResponseEntity<Comuna> crearComuna(@RequestBody Comuna comuna) {
        Comuna nueva = comunaService.save(comuna);
        return ResponseEntity.ok(nueva);
    }

    // ✅ Actualizar una comuna existente
    @PutMapping("/{id}")
    public ResponseEntity<Comuna> actualizarComuna(@PathVariable Integer id, @RequestBody Comuna comuna) {
        Comuna existente = comunaService.findById(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setNombre(comuna.getNombre());
        existente.setRegion(comuna.getRegion());
        Comuna actualizada = comunaService.save(existente);
        return ResponseEntity.ok(actualizada);
    }

    // ✅ Eliminar una comuna
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComuna(@PathVariable Integer id) {
        comunaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
