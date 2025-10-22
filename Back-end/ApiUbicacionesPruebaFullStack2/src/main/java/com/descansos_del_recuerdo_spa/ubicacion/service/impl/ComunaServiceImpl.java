package com.descansos_del_recuerdo_spa.ubicacion.service.impl;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Comuna;
import com.descansos_del_recuerdo_spa.ubicacion.repository.ComunaRepository;
import com.descansos_del_recuerdo_spa.ubicacion.service.ComunaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComunaServiceImpl implements ComunaService {

    @Autowired
    private ComunaRepository comunaRepository;

    @Override
    public List<Comuna> findAll() {
        return comunaRepository.findAll();
    }

    @Override
    public Comuna findById(Integer id) {
        return comunaRepository.findById(id).orElse(null);
    }

    @Override
    public List<Comuna> findByRegionId(Integer regionId) {
        return comunaRepository.findByRegionId(regionId);
    }

    @Override
    public Comuna save(Comuna comuna) {
        return comunaRepository.save(comuna);
    }

    @Override
    public void deleteById(Integer id) {
        comunaRepository.deleteById(id);
    }
}
