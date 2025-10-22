package com.descansos_del_recuerdo_spa.catalogo.service;

import com.descansos_del_recuerdo_spa.catalogo.entities.ImagenUrna;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImagenUrnaService {
    ImagenUrna guardarImagen(Long urnaId, MultipartFile archivo, boolean principal);
    List<ImagenUrna> listarPorUrna(Long urnaId);
    void eliminarImagen(Long id);
}