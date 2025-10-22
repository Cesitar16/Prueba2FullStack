package com.descansos_del_recuerdo_spa.inventario_stock.repositories;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.MovimientoStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {

    /**
     * Listar todos los movimientos de un inventario, ordenados por fecha descendente.
     */
    List<MovimientoStock> findByInventario_IdOrderByFechaMovimientoDesc(Long inventarioId);
}