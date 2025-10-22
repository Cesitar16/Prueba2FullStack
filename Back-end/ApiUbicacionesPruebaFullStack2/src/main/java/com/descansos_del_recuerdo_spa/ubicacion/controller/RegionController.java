package com.descansos_del_recuerdo_spa.ubicacion.controller;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Region;
import com.descansos_del_recuerdo_spa.ubicacion.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regiones")
@CrossOrigin(origins = "*") // Permite peticiones desde tu frontend o microservicios externos
public class RegionController {

    @Autowired
    private RegionService regionService;

    // ✅ Obtener todas las regiones
    @GetMapping
    public ResponseEntity<List<Region>> listarRegiones() {
        List<Region> regiones = regionService.findAll();
        return ResponseEntity.ok(regiones);
    }

    // ✅ Obtener región por ID
    @GetMapping("/{id}")
    public ResponseEntity<Region> obtenerRegionPorId(@PathVariable Integer id) {
        Region region = regionService.findById(id);
        if (region == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(region);
    }

    // ✅ Crear una nueva región
    @PostMapping
    public ResponseEntity<Region> crearRegion(@RequestBody Region region) {
        Region nueva = regionService.save(region);
        return ResponseEntity.ok(nueva);
    }

    // ✅ Actualizar una región existente
    @PutMapping("/{id}")
    public ResponseEntity<Region> actualizarRegion(@PathVariable Integer id, @RequestBody Region region) {
        Region existente = regionService.findById(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        existente.setNombre(region.getNombre());
        Region actualizada = regionService.save(existente);
        return ResponseEntity.ok(actualizada);
    }

    // ✅ Eliminar una región
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRegion(@PathVariable Integer id) {
        regionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}