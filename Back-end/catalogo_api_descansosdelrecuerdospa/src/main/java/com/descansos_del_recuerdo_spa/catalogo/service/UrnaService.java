package com.descansos_del_recuerdo_spa.catalogo.service;

import com.descansos_del_recuerdo_spa.catalogo.dto.UrnaInputDTO;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;

import java.util.List;
import java.util.Optional;

public interface UrnaService {
    List<Urna> findAll();
    Optional<Urna> findById(Long id);
    List<Urna> findByMaterial(Long materialId);
    List<Urna> findByColor(Long colorId);
    List<Urna> findByModelo(Long modeloId);

    // 2. Cambiar la firma de save
    Urna save(UrnaInputDTO urnaDTO);

    // 3. Cambiar la firma de update
    Urna update(Long id, UrnaInputDTO urnaDTO);

    void delete(Long id);
}