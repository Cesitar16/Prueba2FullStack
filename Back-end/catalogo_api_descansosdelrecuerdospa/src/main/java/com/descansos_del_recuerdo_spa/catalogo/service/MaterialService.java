package com.descansos_del_recuerdo_spa.catalogo.service;

import com.descansos_del_recuerdo_spa.catalogo.entities.Material;
import java.util.List;
import java.util.Optional;

public interface MaterialService {
    List<Material> findAll();
    Optional<Material> findById(Long id);
    Material save(Material material);
    Material update(Long id, Material material);
    void delete(Long id);
}