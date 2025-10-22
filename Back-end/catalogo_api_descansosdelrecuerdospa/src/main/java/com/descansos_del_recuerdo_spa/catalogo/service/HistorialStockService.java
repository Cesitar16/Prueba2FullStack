package com.descansos_del_recuerdo_spa.catalogo.service;


import com.descansos_del_recuerdo_spa.catalogo.entities.HistorialStock;

import java.util.List;

public interface HistorialStockService {
    List<HistorialStock> findByUrna(Long urnaId);
    HistorialStock save(HistorialStock historialStock);
}