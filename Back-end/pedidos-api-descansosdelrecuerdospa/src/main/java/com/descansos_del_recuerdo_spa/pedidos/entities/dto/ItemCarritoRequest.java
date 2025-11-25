package com.descansos_del_recuerdo_spa.pedidos.entities.dto;

import lombok.Data;

@Data
public class ItemCarritoRequest {
    private Long urnaId;
    private int cantidad;
    // Podrías recibir precio/nombre si quisieras guardarlos,
    // pero por ahora usaremos solo ID y el frontend ya tiene los datos.
}
