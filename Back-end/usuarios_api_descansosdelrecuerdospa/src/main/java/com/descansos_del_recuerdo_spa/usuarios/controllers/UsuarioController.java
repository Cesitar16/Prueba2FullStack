package com.descansos_del_recuerdo_spa.usuarios.controllers;

import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.services.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins="*")
public class UsuarioController {

    private final UsuarioService service;
    public UsuarioController(UsuarioService s){ this.service = s; }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Usuario>> getAll(){ return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id){
        return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody Usuario u){
        return ResponseEntity.ok(service.update(id, u));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Usuario> partialUpdate(@PathVariable Long id, @RequestBody Usuario cambios) {
        Optional<Usuario> optional = service.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optional.get();

        if (cambios.getNombre() != null) usuario.setNombre(cambios.getNombre());
        if (cambios.getRol() != null) usuario.setRol(cambios.getRol());
        if (cambios.getEstado() != null) usuario.setEstado(cambios.getEstado());

        Usuario actualizado = service.save(usuario);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestParam String newPassword){
        service.changePassword(id, newPassword);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
