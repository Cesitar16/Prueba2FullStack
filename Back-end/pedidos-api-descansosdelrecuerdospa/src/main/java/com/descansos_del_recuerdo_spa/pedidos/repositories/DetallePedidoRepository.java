package com.descansos_del_recuerdo_spa.pedidos.repositories;

import com.descansos_del_recuerdo_spa.pedidos.entities.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    // 🔹 Buscar detalles por pedido
    List<DetallePedido> findByPedido_Id(Long pedidoId);

    // 🔹 Buscar detalles por urna
    List<DetallePedido> findByUrnaId(Long urnaId);
}
