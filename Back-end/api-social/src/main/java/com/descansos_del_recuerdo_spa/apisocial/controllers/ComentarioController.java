package com.descansos_del_recuerdo_spa.apisocial.controllers;

import com.descansos_del_recuerdo_spa.apisocial.dto.ComentarioRequestDTO;
import com.descansos_del_recuerdo_spa.apisocial.dto.ComentarioResponseDTO;
import com.descansos_del_recuerdo_spa.apisocial.services.ComentarioService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*")
public class ComentarioController {

    private final ComentarioService service;

    public ComentarioController(ComentarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ComentarioResponseDTO> crear(@Valid @RequestBody ComentarioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crearComentario(dto));
    }

    @GetMapping("/foro")
    public ResponseEntity<List<ComentarioResponseDTO>> obtenerForo() {
        return ResponseEntity.ok(service.listarForo());
    }

    @GetMapping("/urna/{urnaId}")
    public ResponseEntity<List<ComentarioResponseDTO>> obtenerResponse(@PathVariable Long urnaId) {
        return ResponseEntity.ok(service.listarResenasPorUrna(urnaId));
    }
}
