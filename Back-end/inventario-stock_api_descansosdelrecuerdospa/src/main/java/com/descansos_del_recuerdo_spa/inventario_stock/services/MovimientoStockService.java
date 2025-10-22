package com.descansos_del_recuerdo_spa.inventario_stock.services;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.MovimientoStock;

import java.util.List;

public interface MovimientoStockService {
    List<MovimientoStock> findByInventario(Long inventarioId);
    MovimientoStock save(MovimientoStock movimientoStock);
}