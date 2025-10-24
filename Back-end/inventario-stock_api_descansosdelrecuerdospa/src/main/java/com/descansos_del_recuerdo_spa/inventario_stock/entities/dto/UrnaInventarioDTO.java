package com.descansos_del_recuerdo_spa.inventario_stock.entities.dto;

import lombok.Data;
import java.util.List;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;

@Data
public class UrnaInventarioDTO {
    private UrnaDTO urna;
    private Inventario inventario;
    private List<ImagenDTO> imagenes;

    @Data
    public static class ImagenDTO {
        private String nombre;
        private boolean principal;
        private String contenido; // Base64
    }
}
