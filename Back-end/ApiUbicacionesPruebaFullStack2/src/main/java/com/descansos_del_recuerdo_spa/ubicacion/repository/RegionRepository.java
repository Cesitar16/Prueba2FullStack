package com.descansos_del_recuerdo_spa.ubicacion.repository;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegionRepository extends JpaRepository<Region, Integer> {
}
