package com.descansos_del_recuerdo_spa.pedidos.services;

import com.descansos_del_recuerdo_spa.pedidos.entities.EstadoPedido;
import java.util.List;

public interface EstadoPedidoService {

    List<EstadoPedido> listarEstados();
    EstadoPedido obtenerPorId(Integer id);
    EstadoPedido obtenerPorNombre(String nombre);
}
