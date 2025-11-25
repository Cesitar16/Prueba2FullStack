package com.descansos_del_recuerdo_spa.apisocial.services;

import com.descansos_del_recuerdo_spa.apisocial.dto.ComentarioRequestDTO;
import com.descansos_del_recuerdo_spa.apisocial.dto.ComentarioResponseDTO;

import java.util.List;

public interface ComentarioService {
    ComentarioResponseDTO crearComentario(ComentarioRequestDTO request);
    List<ComentarioResponseDTO> listarForo();
    List<ComentarioResponseDTO> listarResenasPorUrna(Long urnaId);
}
