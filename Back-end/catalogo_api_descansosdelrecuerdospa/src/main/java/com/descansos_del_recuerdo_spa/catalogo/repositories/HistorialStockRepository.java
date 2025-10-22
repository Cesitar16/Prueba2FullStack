package com.descansos_del_recuerdo_spa.catalogo.repositories;

import com.descansos_del_recuerdo_spa.catalogo.entities.HistorialStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialStockRepository extends JpaRepository<HistorialStock, Long> {

    // Listar todos los movimientos de stock de una urna
    List<HistorialStock> findByUrna_IdOrderByFechaDesc(Long urnaId);
}