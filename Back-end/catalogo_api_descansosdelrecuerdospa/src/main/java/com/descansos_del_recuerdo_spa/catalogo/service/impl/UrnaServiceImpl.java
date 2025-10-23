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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UrnaServiceImpl implements UrnaService {

    @Autowired
    private UrnaRepository urnaRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private ModeloRepository modeloRepository;

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
    public Urna save(UrnaInputDTO dto) {
        Urna urna = new Urna();
        mapDtoToEntity(dto, urna);
        urna.setFechaCreacion(LocalDateTime.now());
        return urnaRepository.save(urna);
    }

    @Override
    public Urna update(Long id, UrnaInputDTO dto) {
        Urna urna = urnaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Urna no encontrada con id " + id));
        mapDtoToEntity(dto, urna);
        return urnaRepository.save(urna);
    }

    private void mapDtoToEntity(UrnaInputDTO dto, Urna urna) {
        urna.setNombre(dto.getNombre());
        urna.setDescripcionCorta(dto.getDescripcionCorta());
        urna.setDescripcionDetallada(dto.getDescripcionDetallada());

        if (dto.getPrecio() != null)
            urna.setPrecio(BigDecimal.valueOf(dto.getPrecio()));

        if (dto.getAlto() != null)
            urna.setAlto(BigDecimal.valueOf(dto.getAlto()));

        if (dto.getAncho() != null)
            urna.setAncho(BigDecimal.valueOf(dto.getAncho()));

        if (dto.getProfundidad() != null)
            urna.setProfundidad(BigDecimal.valueOf(dto.getProfundidad()));

        if (dto.getPeso() != null)
            urna.setPeso(BigDecimal.valueOf(dto.getPeso()));

        urna.setEstado(dto.getEstado());
        urna.setDisponible(dto.getDisponible() != null ? dto.getDisponible() : "s");
        urna.setImagenPrincipal(dto.getImagenPrincipal());

        if (dto.getMaterialId() != null) {
            Material mat = materialRepository.findById(dto.getMaterialId()).orElse(null);
            urna.setMaterial(mat);
        }

        if (dto.getColorId() != null) {
            Color col = colorRepository.findById(dto.getColorId()).orElse(null);
            urna.setColor(col);
        }

        if (dto.getModeloId() != null) {
            Modelo mod = modeloRepository.findById(dto.getModeloId()).orElse(null);
            urna.setModelo(mod);
        }
    }

    @Override
    public void delete(Long id) {
        urnaRepository.deleteById(id);
    }
}