package com.descansos_del_recuerdo_spa.usuarios.services;



import com.descansos_del_recuerdo_spa.usuarios.dto.DireccionDTO;
import com.descansos_del_recuerdo_spa.usuarios.entities.Direccion;

import java.util.List;
import java.util.Optional;

public interface DireccionService {

    Direccion createFromDto(DireccionDTO dto);

    Direccion updateFromDto(DireccionDTO dto);

    List<DireccionDTO> findByUsuarioId(Long usuarioId);

    Optional<Direccion> findById(Long id);
}
