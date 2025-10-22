package com.descansos_del_recuerdo_spa.ubicacion.service;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Region;
import java.util.List;

public interface RegionService {

    List<Region> findAll();
    Region findById(Integer id);
    Region save(Region region);
    void deleteById(Integer id);
}
