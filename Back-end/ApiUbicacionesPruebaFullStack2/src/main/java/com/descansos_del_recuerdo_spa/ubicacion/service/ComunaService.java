package com.descansos_del_recuerdo_spa.ubicacion.service;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Comuna;
import java.util.List;

public interface ComunaService {

    List<Comuna> findAll();
    Comuna findById(Integer id);
    List<Comuna> findByRegionId(Integer regionId);
    Comuna save(Comuna comuna);
    void deleteById(Integer id);
}
