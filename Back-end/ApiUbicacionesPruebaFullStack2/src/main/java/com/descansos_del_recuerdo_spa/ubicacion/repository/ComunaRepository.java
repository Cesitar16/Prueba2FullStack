package com.descansos_del_recuerdo_spa.ubicacion.repository;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Comuna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComunaRepository extends JpaRepository<Comuna, Integer> {

    // Obtener comunas filtradas por ID de región
    List<Comuna> findByRegionId(Integer regionId);
}
