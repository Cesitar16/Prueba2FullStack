package com.descansos_del_recuerdo_spa.catalogo.controller;

import com.descansos_del_recuerdo_spa.catalogo.entities.ImagenUrna;
import com.descansos_del_recuerdo_spa.catalogo.service.ImagenUrnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/imagenes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ImagenUrnaController {

    private final ImagenUrnaService imagenUrnaService;

    @PostMapping("/{urnaId}")
    public ResponseEntity<ImagenUrna> subirImagen(
            @PathVariable Long urnaId,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam(defaultValue = "false") boolean principal) {

        ImagenUrna imagen = imagenUrnaService.guardarImagen(urnaId, archivo, principal);
        return ResponseEntity.status(201).body(imagen);
    }

    @GetMapping("/{urnaId}")
    public ResponseEntity<List<ImagenUrna>> listarPorUrna(@PathVariable Long urnaId) {
        return ResponseEntity.ok(imagenUrnaService.listarPorUrna(urnaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long id) {
        imagenUrnaService.eliminarImagen(id);
        return ResponseEntity.noContent().build();
    }
}