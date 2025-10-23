package com.descansos_del_recuerdo_spa.catalogo.repositories;

import com.descansos_del_recuerdo_spa.catalogo.entities.Material;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrnaRepository extends JpaRepository<Urna, Long> {

    // Buscar urnas por disponibilidad
    List<Urna> findByDisponible(String disponible);

    // Buscar urnas por estado
    List<Urna> findByEstado(String estado);

    // Filtrar por material, color o modelo (si quieres búsquedas simples)
    List<Urna> findByMaterial_Id(Long materialId);
    List<Urna> findByColor_Id(Long colorId);
    List<Urna> findByModelo_Id(Long modeloId);

    // Buscar por rango de precio
    List<Urna> findByPrecioBetween(Double min, Double max);

    List<Urna> findByMaterial_(Material material);
}