package com.descansos_del_recuerdo_spa.catalogo.repositories;


import com.descansos_del_recuerdo_spa.catalogo.entities.ImagenUrna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImagenUrnaRepository extends JpaRepository<ImagenUrna, Long> {

    // Buscar imágenes asociadas a una urna
    List<ImagenUrna> findByUrnaId(Long urnaId);

    // Buscar la imagen principal
    Optional<ImagenUrna> findByUrnaIdAndPrincipalTrue(Long urnaId);

}