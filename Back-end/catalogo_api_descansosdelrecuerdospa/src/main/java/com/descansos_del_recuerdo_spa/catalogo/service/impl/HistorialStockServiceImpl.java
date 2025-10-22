package com.descansos_del_recuerdo_spa.catalogo.service.impl;

import com.descansos_del_recuerdo_spa.catalogo.entities.HistorialStock;
import com.descansos_del_recuerdo_spa.catalogo.repositories.HistorialStockRepository;
import com.descansos_del_recuerdo_spa.catalogo.service.HistorialStockService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialStockServiceImpl implements HistorialStockService {

    private final HistorialStockRepository historialStockRepository;

    public HistorialStockServiceImpl(HistorialStockRepository historialStockRepository) {
        this.historialStockRepository = historialStockRepository;
    }

    @Override
    public List<HistorialStock> findByUrna(Long urnaId) {
        return historialStockRepository.findByUrna_IdOrderByFechaDesc(urnaId);
    }

    @Override
    public HistorialStock save(HistorialStock historialStock) {
        return historialStockRepository.save(historialStock);
    }
}