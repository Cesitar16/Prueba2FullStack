package com.descansos_del_recuerdo_spa.inventario_stock.repositories;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    /**
     * Buscar inventario por ID de urna (viene desde el microservicio de catálogo).
     */
    Optional<Inventario> findByUrnaId(Long urnaId);

    /**
     * Listar inventarios con stock bajo (por debajo del mínimo definido).
     */
    List<Inventario> findByCantidadActualLessThan(Integer cantidadMinima);

    /**
     * Listar inventarios por estado (Disponible, Agotado, Bajo Stock, etc.)
     */
    List<Inventario> findByEstado(String estado);
}