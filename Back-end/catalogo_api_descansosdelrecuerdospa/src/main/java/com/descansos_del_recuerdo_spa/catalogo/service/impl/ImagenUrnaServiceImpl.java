package com.descansos_del_recuerdo_spa.catalogo.service.impl;

import com.descansos_del_recuerdo_spa.catalogo.config.StorageConfig;
import com.descansos_del_recuerdo_spa.catalogo.entities.ImagenUrna;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ImagenUrnaRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.UrnaRepository;
import com.descansos_del_recuerdo_spa.catalogo.service.ImagenUrnaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImagenUrnaServiceImpl implements ImagenUrnaService {

    private final UrnaRepository urnaRepository;
    private final ImagenUrnaRepository imagenUrnaRepository;
    private final StorageConfig storageConfig;

    @Override
    @Transactional
    public ImagenUrna guardarImagen(Long urnaId, MultipartFile archivo, boolean principal) {
        Urna urna = urnaRepository.findById(urnaId)
                .orElseThrow(() -> new EntityNotFoundException("Urna no encontrada"));

        // === Crear carpeta de urnas ===
        Path carpetaUrnas = Paths.get(storageConfig.getBasePath(), "urnas");
        try {
            Files.createDirectories(carpetaUrnas);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear la carpeta de almacenamiento", e);
        }

        // === Generar nombre único ===
        String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
        Path destino = carpetaUrnas.resolve(nombreArchivo);

        try {
            archivo.transferTo(destino.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }

        // === Si es principal, desmarcar anteriores ===
        if (principal) {
            List<ImagenUrna> actuales = imagenUrnaRepository.findByUrna_Id(urnaId);
            actuales.forEach(img -> img.setPrincipal(false));
            imagenUrnaRepository.saveAll(actuales);
        }

        // === Crear entidad ImagenUrna ===
        ImagenUrna nueva = new ImagenUrna();
        nueva.setNombre(nombreArchivo);
        nueva.setUrl(storageConfig.getBaseUrl() + "/urnas/" + nombreArchivo);
        nueva.setPrincipal(principal);
        nueva.setUrna(urna);
        imagenUrnaRepository.save(nueva);

        // === Si es imagen principal, actualizar la Urna ===
        if (principal) {
            urna.setImagenPrincipal(nueva.getUrl());
            urnaRepository.save(urna);
        }

        return nueva;
    }


    @Override
    public List<ImagenUrna> listarPorUrna(Long urnaId) {
        return imagenUrnaRepository.findByUrna_Id(urnaId);
    }

    @Override
    public void eliminarImagen(Long id) {
        ImagenUrna img = imagenUrnaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Imagen no encontrada"));

        // Eliminar archivo físico
        Path archivoPath = Paths.get(storageConfig.getBasePath(), "urnas", img.getNombre());
        File archivo = archivoPath.toFile();
        if (archivo.exists()) archivo.delete();

        // Eliminar registro
        imagenUrnaRepository.delete(img);
    }
}
