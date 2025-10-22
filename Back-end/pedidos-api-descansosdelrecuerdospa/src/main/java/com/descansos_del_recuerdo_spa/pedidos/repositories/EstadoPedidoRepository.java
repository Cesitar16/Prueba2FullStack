package com.descansos_del_recuerdo_spa.pedidos.repositories;

import com.descansos_del_recuerdo_spa.pedidos.entities.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstadoPedidoRepository extends JpaRepository<EstadoPedido, Integer> {

    // 🔹 Buscar estado por nombre (útil para lógica interna o inicialización)
    EstadoPedido findByNombre(String nombre);
}
