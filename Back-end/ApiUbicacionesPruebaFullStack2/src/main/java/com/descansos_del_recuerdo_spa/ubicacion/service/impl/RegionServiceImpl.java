package com.descansos_del_recuerdo_spa.ubicacion.service.impl;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Region;
import com.descansos_del_recuerdo_spa.ubicacion.repository.RegionRepository;
import com.descansos_del_recuerdo_spa.ubicacion.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegionServiceImpl implements RegionService {

    @Autowired
    private RegionRepository regionRepository;

    @Override
    public List<Region> findAll() {
        return regionRepository.findAll();
    }

    @Override
    public Region findById(Integer id) {
        return regionRepository.findById(id).orElse(null);
    }

    @Override
    public Region save(Region region) {
        return regionRepository.save(region);
    }

    @Override
    public void deleteById(Integer id) {
        regionRepository.deleteById(id);
    }
}
