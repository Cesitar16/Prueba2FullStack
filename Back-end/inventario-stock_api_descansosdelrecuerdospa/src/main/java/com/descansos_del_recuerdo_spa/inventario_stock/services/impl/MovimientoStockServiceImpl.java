package com.descansos_del_recuerdo_spa.inventario_stock.services.impl;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.MovimientoStock;
import com.descansos_del_recuerdo_spa.inventario_stock.repositories.MovimientoStockRepository;
import com.descansos_del_recuerdo_spa.inventario_stock.services.MovimientoStockService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimientoStockServiceImpl implements MovimientoStockService {

    private final MovimientoStockRepository movimientoStockRepository;

    public MovimientoStockServiceImpl(MovimientoStockRepository movimientoStockRepository) {
        this.movimientoStockRepository = movimientoStockRepository;
    }

    @Override
    public List<MovimientoStock> findByInventario(Long inventarioId) {
        return movimientoStockRepository.findByInventario_IdOrderByFechaMovimientoDesc(inventarioId);
    }

    @Override
    public MovimientoStock save(MovimientoStock movimientoStock) {
        return movimientoStockRepository.save(movimientoStock);
    }
}