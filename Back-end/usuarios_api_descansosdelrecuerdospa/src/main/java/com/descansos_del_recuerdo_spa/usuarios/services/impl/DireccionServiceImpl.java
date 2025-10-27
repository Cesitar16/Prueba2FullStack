package com.descansos_del_recuerdo_spa.usuarios.services.impl;

import com.descansos_del_recuerdo_spa.usuarios.dto.DireccionDTO;
import com.descansos_del_recuerdo_spa.usuarios.entities.Direccion;
import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.repositories.DireccionRepository;
import com.descansos_del_recuerdo_spa.usuarios.repositories.UsuarioRepository;
import com.descansos_del_recuerdo_spa.usuarios.services.DireccionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class DireccionServiceImpl implements DireccionService {

    private final DireccionRepository direccionRepo;
    private final UsuarioRepository usuarioRepo;

    public DireccionServiceImpl(DireccionRepository direccionRepo, UsuarioRepository usuarioRepo) {
        this.direccionRepo = direccionRepo;
        this.usuarioRepo = usuarioRepo;
    }

    @Override
    public Direccion createFromDto(DireccionDTO dto) {
        if (dto.getUsuarioId() == null) {
            throw new IllegalArgumentException("usuarioId es requerido");
        }

        Usuario u = usuarioRepo.getReferenceById(dto.getUsuarioId());

        Direccion d = new Direccion();
        d.setUsuario(u);
        d.setCalle(dto.getCalle());
        d.setComuna(dto.getComuna());
        d.setRegion(dto.getRegion());
        d.setPais(dto.getPais() != null ? dto.getPais() : "Chile");
        d.setTelefono(dto.getTelefono());

        return direccionRepo.save(d);
    }

    @Override
    public Direccion updateFromDto(DireccionDTO dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("id es requerido para actualizar la dirección");
        }

        Direccion d = direccionRepo.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada: " + dto.getId()));

        // Si cambia el usuario (o viene explícito), reasignar
        if (dto.getUsuarioId() != null &&
                (d.getUsuario() == null || !Objects.equals(d.getUsuario().getId(), dto.getUsuarioId()))) {
            Usuario u = usuarioRepo.getReferenceById(dto.getUsuarioId());
            d.setUsuario(u);
        }

        // Actualización de campos solo si vienen en el DTO (permite "partial update" simple)
        if (dto.getCalle() != null)     d.setCalle(dto.getCalle());
        if (dto.getComuna() != null)    d.setComuna(dto.getComuna());
        if (dto.getRegion() != null)    d.setRegion(dto.getRegion());
        if (dto.getPais() != null)      d.setPais(dto.getPais());
        if (dto.getTelefono() != null)  d.setTelefono(dto.getTelefono());

        return direccionRepo.save(d);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DireccionDTO> findByUsuarioId(Long usuarioId) {
        List<Direccion> list = direccionRepo.findByUsuarioId(usuarioId);
        return list.stream()
                .map(DireccionDTO::from) // asegúrate de tener este helper en tu DTO
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Direccion> findById(Long id) {
        return direccionRepo.findById(id);
    }
}