package com.descansos_del_recuerdo_spa.catalogo.service;

import com.descansos_del_recuerdo_spa.catalogo.dto.UrnaInputDTO;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;

import java.util.List;
import java.util.Optional;

public interface UrnaService {

    List<Urna> findAll();

    Optional<Urna> findById(Long id);

    List<Urna> findByMaterial(Long materialId);

    Urna save(UrnaInputDTO dto);

    Urna update(Long id, UrnaInputDTO dto);

    void delete(Long id);
}