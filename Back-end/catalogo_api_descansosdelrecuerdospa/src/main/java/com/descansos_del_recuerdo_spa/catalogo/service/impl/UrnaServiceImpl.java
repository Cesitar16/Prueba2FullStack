package com.descansos_del_recuerdo_spa.catalogo.service.impl;

import com.descansos_del_recuerdo_spa.catalogo.dto.UrnaInputDTO;
import com.descansos_del_recuerdo_spa.catalogo.entities.Color;
import com.descansos_del_recuerdo_spa.catalogo.entities.Material;
import com.descansos_del_recuerdo_spa.catalogo.entities.Modelo;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ColorRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.MaterialRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ModeloRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.UrnaRepository;
import com.descansos_del_recuerdo_spa.catalogo.service.UrnaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UrnaServiceImpl implements UrnaService {

    private final UrnaRepository urnaRepository;
    // 1. Inyectar los repositorios necesarios
    private final MaterialRepository materialRepository;
    private final ColorRepository colorRepository;
    private final ModeloRepository modeloRepository;

    // 2. Actualizar el constructor
    public UrnaServiceImpl(UrnaRepository urnaRepository,
                           MaterialRepository materialRepository,
                           ColorRepository colorRepository,
                           ModeloRepository modeloRepository) {
        this.urnaRepository = urnaRepository;
        this.materialRepository = materialRepository;
        this.colorRepository = colorRepository;
        this.modeloRepository = modeloRepository;
    }

    @Override
    public List<Urna> findAll() {
        return urnaRepository.findAll();
    }

    @Override
    public Optional<Urna> findById(Long id) {
        return urnaRepository.findById(id);
    }

    @Override
    public List<Urna> findByMaterial(Long materialId) {
        return urnaRepository.findByMaterial_Id(materialId);
    }

    @Override
    public List<Urna> findByColor(Long colorId) {
        return urnaRepository.findByColor_Id(colorId);
    }

    @Override
    public List<Urna> findByModelo(Long modeloId) {
        return urnaRepository.findByModelo_Id(modeloId);
    }

    @Override
    public Urna save(UrnaInputDTO dto) {
        // Buscar las entidades relacionadas por ID
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new EntityNotFoundException("Material no encontrado con id: " + dto.getMaterialId()));

        Color color = colorRepository.findById(dto.getColorId())
                .orElseThrow(() -> new EntityNotFoundException("Color no encontrado con id: " + dto.getColorId()));

        Modelo modelo = modeloRepository.findById(dto.getModeloId())
                .orElseThrow(() -> new EntityNotFoundException("Modelo no encontrado con id: " + dto.getModeloId()));

        // Construir la entidad Urna usando el Builder (ya que tu entidad Urna.java tiene @Builder)
        Urna urna = Urna.builder()
                .idInterno(dto.getIdInterno())
                .nombre(dto.getNombre())
                .descripcionCorta(dto.getDescripcionCorta())
                .descripcionDetallada(dto.getDescripcionDetallada())
                .precio(dto.getPrecio())
                .stock(dto.getStock() != null ? dto.getStock() : 0)
                .disponible(dto.getDisponible() != null ? dto.getDisponible() : "s")
                .ancho(dto.getAncho())
                .alto(dto.getAlto())
                .profundidad(dto.getProfundidad())
                .peso(dto.getPeso())
                .imagenPrincipal(dto.getImagenPrincipal())
                .estado("Activo")
                .fechaCreacion(LocalDateTime.now())
                .material(material)
                .color(color)
                .modelo(modelo)
                .build();

        return urnaRepository.save(urna);
    }

    @Override
    public Urna update(Long id, UrnaInputDTO dto) {
        // Primero, buscar la urna existente
        Urna existingUrna = urnaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Urna no encontrada con id: " + id));

        // Buscar las entidades relacionadas (igual que en 'save')
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new EntityNotFoundException("Material no encontrado con id: " + dto.getMaterialId()));

        Color color = colorRepository.findById(dto.getColorId())
                .orElseThrow(() -> new EntityNotFoundException("Color no encontrado con id: " + dto.getColorId()));

        Modelo modelo = modeloRepository.findById(dto.getModeloId())
                .orElseThrow(() -> new EntityNotFoundException("Modelo no encontrado con id: " + dto.getModeloId()));

        // Actualizar los campos de la urna existente
        existingUrna.setIdInterno(dto.getIdInterno());
        existingUrna.setNombre(dto.getNombre());
        existingUrna.setDescripcionCorta(dto.getDescripcionCorta());
        existingUrna.setDescripcionDetallada(dto.getDescripcionDetallada());
        existingUrna.setPrecio(dto.getPrecio());
        existingUrna.setStock(dto.getStock());
        existingUrna.setDisponible(dto.getDisponible());
        existingUrna.setAncho(dto.getAncho());
        existingUrna.setAlto(dto.getAlto());
        existingUrna.setProfundidad(dto.getProfundidad());
        existingUrna.setPeso(dto.getPeso());
        existingUrna.setImagenPrincipal(dto.getImagenPrincipal());

        // Actualizar las relaciones
        existingUrna.setMaterial(material);
        existingUrna.setColor(color);
        existingUrna.setModelo(modelo);

        return urnaRepository.save(existingUrna);
    }

    @Override
    public void delete(Long id) {
        urnaRepository.deleteById(id);
    }
}