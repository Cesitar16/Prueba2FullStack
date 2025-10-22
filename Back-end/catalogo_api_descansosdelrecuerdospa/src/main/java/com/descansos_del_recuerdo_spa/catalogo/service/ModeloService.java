package com.descansos_del_recuerdo_spa.catalogo.service;


import com.descansos_del_recuerdo_spa.catalogo.entities.Modelo;

import java.util.List;
import java.util.Optional;

public interface ModeloService {
    List<Modelo> findAll();
    Optional<Modelo> findById(Long id);
    Modelo save(Modelo modelo);
    Modelo update(Long id, Modelo modelo);
    void delete(Long id);
}