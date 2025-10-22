package com.descansos_del_recuerdo_spa.inventario_stock.entities.dto;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventarioDetalleDTO {

    private Inventario inventario;
    private UrnaDTO urna;
}