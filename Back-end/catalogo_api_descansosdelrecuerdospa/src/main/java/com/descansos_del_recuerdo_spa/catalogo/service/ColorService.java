package com.descansos_del_recuerdo_spa.catalogo.service;

import com.descansos_del_recuerdo_spa.catalogo.entities.Color;
import java.util.List;
import java.util.Optional;

public interface ColorService {
    List<Color> findAll();
    Optional<Color> findById(Long id);
    Color save(Color color);
    Color update(Long id, Color color);
    void delete(Long id);
}