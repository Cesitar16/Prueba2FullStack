package com.descansos_del_recuerdo_spa.inventario_stock.services.impl;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;
import com.descansos_del_recuerdo_spa.inventario_stock.entities.MovimientoStock;
import com.descansos_del_recuerdo_spa.inventario_stock.repositories.InventarioRepository;
import com.descansos_del_recuerdo_spa.inventario_stock.repositories.MovimientoStockRepository;
import com.descansos_del_recuerdo_spa.inventario_stock.services.InventarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventarioServiceImpl implements InventarioService {

    private final InventarioRepository inventarioRepository;
    private final MovimientoStockRepository movimientoStockRepository;

    public InventarioServiceImpl(InventarioRepository inventarioRepository,
                                 MovimientoStockRepository movimientoStockRepository) {
        this.inventarioRepository = inventarioRepository;
        this.movimientoStockRepository = movimientoStockRepository;
    }

    @Override
    public List<Inventario> findAll() {
        return inventarioRepository.findAll();
    }

    @Override
    public Optional<Inventario> findById(Long id) {
        return inventarioRepository.findById(id);
    }

    @Override
    public Optional<Inventario> findByUrnaId(Long urnaId) {
        return inventarioRepository.findByUrnaId(urnaId);
    }

    @Override
    public Inventario save(Inventario inventario) {
        inventario.setUltimaActualizacion(LocalDateTime.now());
        return inventarioRepository.save(inventario);
    }

    @Override
    public Inventario update(Long id, Inventario inventario) {
        inventario.setId(id);
        inventario.setUltimaActualizacion(LocalDateTime.now());
        return inventarioRepository.save(inventario);
    }

    @Override
    @Transactional
    public Inventario ajustarStock(Long urnaId, int nuevaCantidad, String motivo, String usuario) {
        Inventario inv = inventarioRepository.findByUrnaId(urnaId)
                .orElseThrow(() -> new RuntimeException("No existe inventario para la urna ID " + urnaId));

        int cantidadAnterior = inv.getCantidadActual();
        inv.setCantidadActual(nuevaCantidad);
        inv.setUltimaActualizacion(LocalDateTime.now());

        actualizarEstado(inv);

        // Registrar movimiento
        MovimientoStock movimiento = MovimientoStock.builder()
                .inventario(inv)
                .cantidadAnterior(cantidadAnterior)
                .cantidadNueva(nuevaCantidad)
                .tipoMovimiento("Ajuste")
                .motivo(motivo)
                .fechaMovimiento(LocalDateTime.now())
                .usuarioResponsable(usuario)
                .build();

        movimientoStockRepository.save(movimiento);
        return inventarioRepository.save(inv);
    }

    @Override
    @Transactional
    public Inventario disminuirStock(Long urnaId, int cantidad, String motivo, String usuario) {
        Inventario inv = inventarioRepository.findByUrnaId(urnaId)
                .orElseThrow(() -> new RuntimeException("No existe inventario para la urna ID " + urnaId));

        int cantidadAnterior = inv.getCantidadActual();
        int nuevaCantidad = Math.max(0, cantidadAnterior - cantidad);
        inv.setCantidadActual(nuevaCantidad);
        inv.setUltimaActualizacion(LocalDateTime.now());

        actualizarEstado(inv);

        MovimientoStock movimiento = MovimientoStock.builder()
                .inventario(inv)
                .cantidadAnterior(cantidadAnterior)
                .cantidadNueva(nuevaCantidad)
                .tipoMovimiento("Salida")
                .motivo(motivo)
                .fechaMovimiento(LocalDateTime.now())
                .usuarioResponsable(usuario)
                .build();

        movimientoStockRepository.save(movimiento);
        return inventarioRepository.save(inv);
    }

    @Override
    @Transactional
    public Inventario aumentarStock(Long urnaId, int cantidad, String motivo, String usuario) {
        Inventario inv = inventarioRepository.findByUrnaId(urnaId)
                .orElseThrow(() -> new RuntimeException("No existe inventario para la urna ID " + urnaId));

        int cantidadAnterior = inv.getCantidadActual();
        int nuevaCantidad = cantidadAnterior + cantidad;
        inv.setCantidadActual(nuevaCantidad);
        inv.setUltimaActualizacion(LocalDateTime.now());

        actualizarEstado(inv);

        MovimientoStock movimiento = MovimientoStock.builder()
                .inventario(inv)
                .cantidadAnterior(cantidadAnterior)
                .cantidadNueva(nuevaCantidad)
                .tipoMovimiento("Entrada")
                .motivo(motivo)
                .fechaMovimiento(LocalDateTime.now())
                .usuarioResponsable(usuario)
                .build();

        movimientoStockRepository.save(movimiento);
        return inventarioRepository.save(inv);
    }

    private void actualizarEstado(Inventario inv) {
        if (inv.getCantidadActual() <= 0) {
            inv.setEstado("Agotado");
        } else if (inv.getCantidadActual() < inv.getCantidadMinima()) {
            inv.setEstado("Bajo Stock");
        } else {
            inv.setEstado("Disponible");
        }
    }

    @Override
    public void delete(Long id) {
        inventarioRepository.deleteById(id);
    }

    @Override
    public void registrarMovimientoInicial(Inventario inventario, int cantidad, String motivo, String usuario) {
        MovimientoStock movimiento = new MovimientoStock();
        movimiento.setInventario(inventario);
        movimiento.setCantidadAnterior(0); // primera vez, no había stock antes
        movimiento.setCantidadNueva(cantidad);
        movimiento.setMotivo(motivo);
        movimiento.setTipoMovimiento("Inicial"); // coherente con tu estructura
        movimiento.setUsuarioResponsable(usuario);
        movimiento.setFechaMovimiento(LocalDateTime.now());
        movimientoStockRepository.save(movimiento);
    }


}