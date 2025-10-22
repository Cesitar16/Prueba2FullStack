package com.descansos_del_recuerdo_spa.catalogo.service.impl;

import com.descansos_del_recuerdo_spa.catalogo.entities.ImagenUrna;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ImagenUrnaRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.UrnaRepository;
import com.descansos_del_recuerdo_spa.catalogo.service.ImagenUrnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImagenUrnaServiceImpl implements ImagenUrnaService {

    private final ImagenUrnaRepository imagenUrnaRepository;
    private final UrnaRepository urnaRepository;

    private static final String UPLOAD_DIR = "uploads/urnas/";

    @Override
    public ImagenUrna guardarImagen(Long urnaId, MultipartFile archivo, boolean principal) {
        Urna urna = urnaRepository.findById(urnaId)
                .orElseThrow(() -> new RuntimeException("Urna no encontrada"));

        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
            Path ruta = Paths.get(UPLOAD_DIR + nombreArchivo);
            Files.copy(archivo.getInputStream(), ruta, StandardCopyOption.REPLACE_EXISTING);

            String nuevaUrl = "/" + UPLOAD_DIR + nombreArchivo;

            // 🔥 Si la nueva imagen es principal
            if (principal) {
                // Desmarcar la anterior
                imagenUrnaRepository.findByUrnaIdAndPrincipalTrue(urnaId)
                        .ifPresent(imgAnterior -> {
                            imgAnterior.setPrincipal(false);
                            imagenUrnaRepository.save(imgAnterior);
                        });

                // 🪄 Actualizar el campo imagenPrincipal en la tabla urna
                urna.setImagenPrincipal(nuevaUrl);
                urnaRepository.save(urna);
            }

            // Guardar la nueva imagen
            ImagenUrna nueva = ImagenUrna.builder()
                    .urna(urna)
                    .url(nuevaUrl)
                    .principal(principal)
                    .build();

            ImagenUrna guardada = imagenUrnaRepository.save(nueva);

            // Si es principal, ponerla primera visualmente
            if (principal && urna.getImagenes() != null) {
                List<ImagenUrna> imagenes = urna.getImagenes();
                imagenes.removeIf(ImagenUrna::getPrincipal); // remover la vieja principal
                imagenes.add(0, guardada);
            }

            return guardada;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar la imagen", e);
        }
    }

    @Override
    public List<ImagenUrna> listarPorUrna(Long urnaId) {
        return imagenUrnaRepository.findByUrnaId(urnaId);
    }

    @Override
    public void eliminarImagen(Long id) {
        imagenUrnaRepository.deleteById(id);
    }
}