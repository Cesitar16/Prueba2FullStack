package com.descansos_del_recuerdo_spa.catalogo.repositories;

import com.descansos_del_recuerdo_spa.catalogo.entities.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModeloRepository extends JpaRepository<Modelo, Long> {
}
