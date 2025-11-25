package com.descansos_del_recuerdo_spa.apisocial.repositories;

import com.descansos_del_recuerdo_spa.apisocial.entities.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    //Este es para el foro, en caso de que no sea una reseña
    List<Comentario> findByUrnaIdIsNullAndEstadoOrderByFechaDesc(String estado);

    //Este es específicamente para reseñas con urna específica
    List<Comentario> findByUrnaIdAndEstadoOrderByFechaDesc(Long urnaId, String estado);
}
