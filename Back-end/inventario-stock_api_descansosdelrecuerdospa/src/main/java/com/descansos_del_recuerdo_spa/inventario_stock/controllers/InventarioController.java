package com.descansos_del_recuerdo_spa.inventario_stock.controllers;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;
import com.descansos_del_recuerdo_spa.inventario_stock.entities.dto.InventarioDetalleDTO;
import com.descansos_del_recuerdo_spa.inventario_stock.entities.dto.UrnaDTO;
import com.descansos_del_recuerdo_spa.inventario_stock.entities.dto.UrnaInventarioDTO;
import com.descansos_del_recuerdo_spa.inventario_stock.services.InventarioService;
import com.descansos_del_recuerdo_spa.inventario_stock.services.client.CatalogoClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    private final InventarioService inventarioService;
    private final CatalogoClientService catalogoClientService;

    public InventarioController(InventarioService inventarioService, CatalogoClientService catalogoClientService) {
        this.inventarioService = inventarioService;
        this.catalogoClientService = catalogoClientService;
    }



    // ======================
    // 📗 LISTAR INVENTARIO
    // ======================
    @GetMapping
    public ResponseEntity<List<Inventario>> getAll() {
        return ResponseEntity.ok(inventarioService.findAll());
    }

    // ======================
    // 📘 CONSULTAR POR ID
    // ======================
    @GetMapping("/{id}")
    public ResponseEntity<Inventario> getById(@PathVariable Long id) {
        return inventarioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ======================
    // 📘 CONSULTAR POR URNA (vía ID externo)
    // ======================
    @GetMapping("/urna/{urnaId}")
    public ResponseEntity<Inventario> getByUrna(@PathVariable Long urnaId) {
        return inventarioService.findByUrnaId(urnaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ======================
    // 🟢 CREAR NUEVO REGISTRO DE INVENTARIO
    // ======================
    @PostMapping
    public ResponseEntity<Inventario> create(@RequestBody Inventario inventario) {
        return ResponseEntity.status(201).body(inventarioService.save(inventario));
    }

    // ======================
    // 🟡 ACTUALIZAR INVENTARIO EXISTENTE
    // ======================
    @PutMapping("/{id}")
    public ResponseEntity<Inventario> update(@PathVariable Long id, @RequestBody Inventario inventario) {
        return ResponseEntity.ok(inventarioService.update(id, inventario));
    }

    // ======================
    // 🔴 ELIMINAR INVENTARIO
    // ======================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ======================
    // ⚙️ AJUSTAR STOCK MANUALMENTE
    // ======================
    @PatchMapping("/ajustar/{urnaId}")
    public ResponseEntity<Inventario> ajustarStock(
            @PathVariable Long urnaId,
            @RequestBody Map<String, Object> payload
    ) {
        int nuevaCantidad = (int) payload.get("nuevaCantidad");
        String motivo = (String) payload.getOrDefault("motivo", "Ajuste manual");
        String usuario = (String) payload.getOrDefault("usuario", "Sistema");

        return ResponseEntity.ok(inventarioService.ajustarStock(urnaId, nuevaCantidad, motivo, usuario));
    }


    // ======================
    // ➖ DISMINUIR STOCK
    // ======================
    @PatchMapping("/disminuir/{urnaId}")
    public ResponseEntity<Inventario> disminuirStock(
            @PathVariable Long urnaId,
            @RequestParam int cantidad,
            @RequestParam String motivo,
            @RequestParam(required = false, defaultValue = "Sistema") String usuario
    ) {
        return ResponseEntity.ok(inventarioService.disminuirStock(urnaId, cantidad, motivo, usuario));
    }

    // ======================
    // ➕ AUMENTAR STOCK
    // ======================
    @PatchMapping("/aumentar/{urnaId}")
    public ResponseEntity<Inventario> aumentarStock(
            @PathVariable Long urnaId,
            @RequestParam int cantidad,
            @RequestParam String motivo,
            @RequestParam(required = false, defaultValue = "Sistema") String usuario
    ) {
        return ResponseEntity.ok(inventarioService.aumentarStock(urnaId, cantidad, motivo, usuario));
    }

    @GetMapping("/urna-detalle/{urnaId}")
    public ResponseEntity<?> getInventarioConUrna(@PathVariable Long urnaId) {
        return inventarioService.findByUrnaId(urnaId)
                .map(inventario -> {
                    // Consumir microservicio Catálogo
                    UrnaDTO urna = catalogoClientService
                            .obtenerUrnaPorId(urnaId)
                            .block(); // bloqueante solo para esta llamada puntual

                    var dto = InventarioDetalleDTO.builder()
                            .inventario(inventario)
                            .urna(urna)
                            .build();

                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear-con-urna")
    public ResponseEntity<?> crearUrnaConInventario(@RequestBody UrnaInventarioDTO dto) {
        try {
            // 1️⃣ Crear urna llamando al microservicio catálogo
            UrnaDTO nuevaUrna = catalogoClientService.crearUrna(dto.getUrna()).block();

            // 2️⃣ Crear inventario asociado
            Inventario inventario = new Inventario();
            inventario.setUrnaId(nuevaUrna.getId());
            inventario.setCantidadActual(dto.getInventario().getCantidadActual());
            inventario.setCantidadMaxima(dto.getInventario().getCantidadMaxima());
            inventario.setCantidadMinima(dto.getInventario().getCantidadMinima());
            inventario.setUbicacionFisica(dto.getInventario().getUbicacionFisica());
            inventario.setEstado("Disponible");
            Inventario inventarioGuardado = inventarioService.save(inventario);

            // 3️⃣ Registrar movimiento inicial
            inventarioService.registrarMovimientoInicial(
                inventarioGuardado,
                dto.getInventario().getCantidadActual(),
                "Configuración inicial de inventario",
                "Administrador"
            );

            return ResponseEntity.ok(Map.of(
                "mensaje", "Urna e inventario creados correctamente",
                "urnaId", nuevaUrna.getId(),
                "inventarioId", inventarioGuardado.getId()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                Map.of("error", "Error al crear urna e inventario", "detalle", e.getMessage())
            );
        }
    }

}
