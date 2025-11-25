package com.descansos_del_recuerdo_spa.apisocial.services.impl;

import com.descansos_del_recuerdo_spa.apisocial.dto.ComentarioRequestDTO;
import com.descansos_del_recuerdo_spa.apisocial.dto.ComentarioResponseDTO;
import com.descansos_del_recuerdo_spa.apisocial.entities.Comentario;
import com.descansos_del_recuerdo_spa.apisocial.repositories.ComentarioRepository;
import com.descansos_del_recuerdo_spa.apisocial.services.ComentarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    private final ComentarioRepository repo;

    public ComentarioServiceImpl(ComentarioRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public ComentarioResponseDTO crearComentario(ComentarioRequestDTO req) {
        Comentario c = new Comentario();
        c.setUsuarioId(req.getUsuarioId());
        c.setContenido(req.getContenido());
        c.setUrnaId(req.getUrnaId());
        c.setCalificacion(req.getCalificacion());
        c.setFecha(LocalDateTime.now());
        c.setEstado("VISIBLE");

        if (req.getUrnaId() != null) {
            c.setTipo("RESEÑA");
        } else {
            c.setTipo("FORO");
        }

        Comentario guardado = repo.save(c);
        return ComentarioResponseDTO.fromEntity(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComentarioResponseDTO> listarForo() {
        return repo.findByUrnaIdIsNullAndEstadoOrderByFechaDesc("VISIBLE")
                .stream()
                .map(ComentarioResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComentarioResponseDTO> listarResenasPorUrna(Long urnaId) {
        return repo.findByUrnaIdAndEstadoOrderByFechaDesc(urnaId, "VISIBLE")
                .stream()
                .map(ComentarioResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
