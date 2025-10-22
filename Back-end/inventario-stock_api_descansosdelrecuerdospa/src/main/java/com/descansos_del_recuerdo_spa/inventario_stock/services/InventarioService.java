package com.descansos_del_recuerdo_spa.inventario_stock.services;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;

import java.util.List;
import java.util.Optional;

public interface InventarioService {

    List<Inventario> findAll();
    Optional<Inventario> findById(Long id);
    Optional<Inventario> findByUrnaId(Long urnaId);

    Inventario save(Inventario inventario);
    Inventario update(Long id, Inventario inventario);

    /**
     * Ajusta el stock manualmente y genera un movimiento en el historial.
     */
    Inventario ajustarStock(Long urnaId, int nuevaCantidad, String motivo, String usuario);

    /**
     * Disminuye el stock (por ejemplo, tras una venta).
     */
    Inventario disminuirStock(Long urnaId, int cantidad, String motivo, String usuario);

    /**
     * Incrementa el stock (por ejemplo, por reposición o devolución).
     */
    Inventario aumentarStock(Long urnaId, int cantidad, String motivo, String usuario);

    void delete(Long id);
}