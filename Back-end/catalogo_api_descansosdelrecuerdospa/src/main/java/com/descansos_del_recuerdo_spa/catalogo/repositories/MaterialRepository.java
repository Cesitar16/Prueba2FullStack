package com.descansos_del_recuerdo_spa.catalogo.repositories;

import com.descansos_del_recuerdo_spa.catalogo.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
}