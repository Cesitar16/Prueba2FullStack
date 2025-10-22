package com.descansos_del_recuerdo_spa.inventario_stock.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimiento_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Relación con la tabla inventario (muchos movimientos pueden pertenecer a un inventario)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventario_id", nullable = false)
    @JsonIgnoreProperties({"movimientos", "hibernateLazyInitializer", "handler"})
    private Inventario inventario;

    @Column(nullable = false)
    private Integer cantidadAnterior;

    @Column(nullable = false)
    private Integer cantidadNueva;

    @Column(nullable = false, length = 50)
    private String tipoMovimiento;
    // Ejemplo: "Entrada", "Salida", "Ajuste", "Venta", "Reposición"

    @Column(length = 255)
    private String motivo; // Ejemplo: "Venta realizada", "Error de conteo", "Reposición de stock"

    @Column(name = "fecha_movimiento")
    private LocalDateTime fechaMovimiento = LocalDateTime.now();

    @Column(name = "usuario_responsable", length = 120)
    private String usuarioResponsable; // opcional, útil para auditoría
}
