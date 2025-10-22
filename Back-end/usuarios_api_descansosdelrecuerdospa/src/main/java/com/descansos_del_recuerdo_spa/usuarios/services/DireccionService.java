package com.descansos_del_recuerdo_spa.usuarios.services;

import com.descansos_del_recuerdo_spa.usuarios.entities.Direccion;
import com.descansos_del_recuerdo_spa.usuarios.exception.ResourceNotFoundException;
import com.descansos_del_recuerdo_spa.usuarios.repositories.DireccionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio de negocio para Direccion.
 */
@Service
public class DireccionService {

    private final DireccionRepository repo;

    public DireccionService(DireccionRepository repo) {
        this.repo = repo;
    }

    // 🔹 Crear o actualizar dirección
    public Direccion save(Direccion d) {
        return repo.save(d);
    }

    // 🔹 Listar todas las direcciones
    public List<Direccion> findAll() {
        return repo.findAll();
    }

    // 🔹 Buscar por ID
    public Direccion findById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // 🔹 Buscar por ID de usuario
    public List<Direccion> findByUsuario(Long usuarioId) {
        return repo.findByUsuarioId(usuarioId);
    }

    // 🔹 Actualización completa
    public Direccion update(Long id, Direccion nueva) {
        Direccion existente = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id " + id));

        existente.setCalle(nueva.getCalle());
        existente.setComuna(nueva.getComuna());
        existente.setRegion(nueva.getRegion());
        existente.setPais(nueva.getPais());
        existente.setTelefono(nueva.getTelefono());
        return repo.save(existente);
    }

    // 🔹 Actualización parcial (solo campos no nulos)
    public Direccion patch(Long id, Direccion cambios) {
        Direccion existente = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id " + id));

        if (cambios.getCalle() != null) existente.setCalle(cambios.getCalle());
        if (cambios.getComuna() != null) existente.setComuna(cambios.getComuna());
        if (cambios.getRegion() != null) existente.setRegion(cambios.getRegion());
        if (cambios.getPais() != null) existente.setPais(cambios.getPais());
        if (cambios.getTelefono() != null) existente.setTelefono(cambios.getTelefono());

        return repo.save(existente);
    }

    // 🔹 Eliminar dirección
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Dirección no encontrada con id " + id);
        }
        repo.deleteById(id);
    }
}
