package com.descansos_del_recuerdo_spa.pedidos.repositories;

import com.descansos_del_recuerdo_spa.pedidos.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    // 🔹 Buscar pedidos por usuario
    List<Pedido> findByUsuarioId(Integer usuarioId);

    // 🔹 Buscar pedidos por estado
    List<Pedido> findByEstadoPedido_Id(Integer estadoPedidoId);

    // 🔹 Buscar pedidos por rango de fechas (si se requiere más adelante)
    // List<Pedido> findByFechaPedidoBetween(LocalDateTime inicio, LocalDateTime fin);
}
