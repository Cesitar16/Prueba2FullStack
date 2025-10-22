package com.descansos_del_recuerdo_spa.pedidos.services.impl;

import com.descansos_del_recuerdo_spa.pedidos.entities.EstadoPedido;
import com.descansos_del_recuerdo_spa.pedidos.repositories.EstadoPedidoRepository;
import com.descansos_del_recuerdo_spa.pedidos.services.EstadoPedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadoPedidoServiceImpl implements EstadoPedidoService {

    private final EstadoPedidoRepository estadoPedidoRepository;

    @Override
    public List<EstadoPedido> listarEstados() {
        return estadoPedidoRepository.findAll();
    }

    @Override
    public EstadoPedido obtenerPorId(Integer id) {
        return estadoPedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado de pedido no encontrado"));
    }

    @Override
    public EstadoPedido obtenerPorNombre(String nombre) {
        return estadoPedidoRepository.findByNombre(nombre);
    }
}
