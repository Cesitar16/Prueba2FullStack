package com.descansos_del_recuerdo_spa.catalogo.repositories;

import com.descansos_del_recuerdo_spa.catalogo.entities.ImagenUrna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImagenUrnaRepository extends JpaRepository<ImagenUrna, Long> {

    // 👇 Este método es detectado automáticamente por Spring Data JPA
    List<ImagenUrna> findByUrna_Id(Long urnaId);
}
