package com.descansos_del_recuerdo_spa.catalogo.service.impl;

import com.descansos_del_recuerdo_spa.catalogo.entities.Modelo;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ModeloRepository;
import com.descansos_del_recuerdo_spa.catalogo.service.ModeloService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModeloServiceImpl implements ModeloService {

    private final ModeloRepository modeloRepository;

    public ModeloServiceImpl(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    @Override
    public List<Modelo> findAll() {
        return modeloRepository.findAll();
    }

    @Override
    public Optional<Modelo> findById(Long id) {
        return modeloRepository.findById(id);
    }

    @Override
    public Modelo save(Modelo modelo) {
        return modeloRepository.save(modelo);
    }

    @Override
    public Modelo update(Long id, Modelo modelo) {
        modelo.setId(id);
        return modeloRepository.save(modelo);
    }

    @Override
    public void delete(Long id) {
        modeloRepository.deleteById(id);
    }
}