package com.descansos_del_recuerdo_spa.pedidos.controllers;

import com.descansos_del_recuerdo_spa.pedidos.entities.Carrito;
import com.descansos_del_recuerdo_spa.pedidos.entities.ItemCarrito;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.ItemCarritoRequest;
import com.descansos_del_recuerdo_spa.pedidos.repositories.CarritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private CarritoRepository carritoRepo;

    // GET: Obtener el carrito del usuario (usando el ID del path por simplicidad o Token)
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Carrito> obtenerCarrito(@PathVariable Long usuarioId) {
        Carrito carrito = carritoRepo.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuarioId(usuarioId);
                    return carritoRepo.save(nuevo);
                });
        return ResponseEntity.ok(carrito);
    }

    // POST: Sincronizar/Agregar item
    @PostMapping("/{usuarioId}/items")
    public ResponseEntity<Carrito> agregarItem(@PathVariable Long usuarioId, @RequestBody ItemCarritoRequest req) {
        Carrito carrito = carritoRepo.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    Carrito c = new Carrito();
                    c.setUsuarioId(usuarioId);
                    return carritoRepo.save(c);
                });

        // Buscar si el item ya existe
        Optional<ItemCarrito> existente = carrito.getItems().stream()
                .filter(i -> i.getUrnaId().equals(req.getUrnaId()))
                .findFirst();

        if (existente.isPresent()) {
            existente.get().setCantidad(existente.get().getCantidad() + req.getCantidad());
        } else {
            ItemCarrito nuevo = ItemCarrito.builder()
                    .carrito(carrito)
                    .urnaId(req.getUrnaId())
                    .cantidad(req.getCantidad())
                    .build();
            carrito.getItems().add(nuevo);
        }

        return ResponseEntity.ok(carritoRepo.save(carrito));
    }

    // DELETE: Eliminar item
    @DeleteMapping("/{usuarioId}/items/{urnaId}")
    public ResponseEntity<Carrito> eliminarItem(@PathVariable Long usuarioId, @PathVariable Long urnaId) {
        Optional<Carrito> carritoOpt = carritoRepo.findByUsuarioId(usuarioId);
        if (carritoOpt.isPresent()) {
            Carrito carrito = carritoOpt.get();
            carrito.getItems().removeIf(i -> i.getUrnaId().equals(urnaId));
            return ResponseEntity.ok(carritoRepo.save(carrito));
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE: Vaciar carrito (al comprar)
    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> vaciarCarrito(@PathVariable Long usuarioId) {
        Optional<Carrito> carritoOpt = carritoRepo.findByUsuarioId(usuarioId);
        if (carritoOpt.isPresent()) {
            Carrito carrito = carritoOpt.get();
            carrito.getItems().clear();
            carritoRepo.save(carrito);
        }
        return ResponseEntity.ok().build();
    }
}