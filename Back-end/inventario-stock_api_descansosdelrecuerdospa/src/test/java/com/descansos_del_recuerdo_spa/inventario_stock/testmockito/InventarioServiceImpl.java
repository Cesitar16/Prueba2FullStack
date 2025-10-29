package com.descansos_del_recuerdo_spa.inventario_stock.testmockito;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.Inventario;
import com.descansos_del_recuerdo_spa.inventario_stock.entities.MovimientoStock;
import com.descansos_del_recuerdo_spa.inventario_stock.repositories.InventarioRepository;
import com.descansos_del_recuerdo_spa.inventario_stock.repositories.MovimientoStockRepository;
import com.descansos_del_recuerdo_spa.inventario_stock.services.impl.InventarioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventarioServiceImplTest {

    @Mock
    private InventarioRepository inventarioRepository;

    @Mock
    private MovimientoStockRepository movimientoStockRepository;

    @InjectMocks
    private InventarioServiceImpl inventarioService;

    private Inventario inventario;
    private Long urnaId = 1L;

    @BeforeEach
    void setUp() {
        inventario = Inventario.builder()
                .id(10L)
                .urnaId(urnaId)
                .cantidadActual(10)
                .cantidadMinima(5)
                .cantidadMaxima(50)
                .estado("Disponible")
                .ultimaActualizacion(LocalDateTime.now().minusDays(1))
                .build();
    }

    @Test
    void findByUrnaId_cuandoExiste_deberiaRetornarOptionalConInventario() {
        // Arrange
        when(inventarioRepository.findByUrnaId(urnaId)).thenReturn(Optional.of(inventario));

        // Act
        Optional<Inventario> resultado = inventarioService.findByUrnaId(urnaId);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(10, resultado.get().getCantidadActual());
        verify(inventarioRepository, times(1)).findByUrnaId(urnaId);
    }

    @Test
    void save_deberiaEstablecerUltimaActualizacionYGuardar() {
        // Arrange
        LocalDateTime tiempoAntes = LocalDateTime.now();
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Inventario guardado = inventarioService.save(inventario);

        // Assert
        assertNotNull(guardado);
        assertNotNull(guardado.getUltimaActualizacion());
        assertTrue(guardado.getUltimaActualizacion().isAfter(tiempoAntes) || guardado.getUltimaActualizacion().isEqual(tiempoAntes));
        verify(inventarioRepository, times(1)).save(inventario);
    }

    @Test
    void ajustarStock_cuandoInventarioExiste_deberiaActualizarYRegistrarMovimiento() {
        // Arrange
        int nuevaCantidad = 15;
        String motivo = "Conteo físico";
        String usuario = "admin";
        int cantidadAnterior = inventario.getCantidadActual();

        when(inventarioRepository.findByUrnaId(urnaId)).thenReturn(Optional.of(inventario));
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));
        when(movimientoStockRepository.save(any(MovimientoStock.class))).thenAnswer(inv -> inv.getArgument(0));

        ArgumentCaptor<MovimientoStock> movimientoCaptor = ArgumentCaptor.forClass(MovimientoStock.class);

        // Act
        Inventario actualizado = inventarioService.ajustarStock(urnaId, nuevaCantidad, motivo, usuario);

        // Assert
        assertNotNull(actualizado);
        assertEquals(nuevaCantidad, actualizado.getCantidadActual());
        assertEquals("Disponible", actualizado.getEstado()); // Asume que 15 está por encima del mínimo
        assertNotNull(actualizado.getUltimaActualizacion());

        verify(inventarioRepository, times(1)).findByUrnaId(urnaId);
        verify(inventarioRepository, times(1)).save(inventario); // Una por el ajuste, otra en ajustarStock
        verify(movimientoStockRepository, times(1)).save(movimientoCaptor.capture());

        MovimientoStock movimientoRegistrado = movimientoCaptor.getValue();
        assertEquals(inventario, movimientoRegistrado.getInventario());
        assertEquals(cantidadAnterior, movimientoRegistrado.getCantidadAnterior());
        assertEquals(nuevaCantidad, movimientoRegistrado.getCantidadNueva());
        assertEquals("Ajuste", movimientoRegistrado.getTipoMovimiento());
        assertEquals(motivo, movimientoRegistrado.getMotivo());
        assertEquals(usuario, movimientoRegistrado.getUsuarioResponsable());
        assertNotNull(movimientoRegistrado.getFechaMovimiento());
    }

    @Test
    void disminuirStock_cuandoHaySuficiente_deberiaDisminuirYRegistrarSalida() {
        // Arrange
        int cantidadADisminuir = 3;
        String motivo = "Venta";
        String usuario = "vendedor";
        int cantidadAnterior = inventario.getCantidadActual();
        int cantidadEsperada = cantidadAnterior - cantidadADisminuir; // 7

        when(inventarioRepository.findByUrnaId(urnaId)).thenReturn(Optional.of(inventario));
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));
        when(movimientoStockRepository.save(any(MovimientoStock.class))).thenAnswer(inv -> inv.getArgument(0));

        ArgumentCaptor<MovimientoStock> movimientoCaptor = ArgumentCaptor.forClass(MovimientoStock.class);

        // Act
        Inventario actualizado = inventarioService.disminuirStock(urnaId, cantidadADisminuir, motivo, usuario);

        // Assert
        assertEquals(cantidadEsperada, actualizado.getCantidadActual());
        assertEquals("Disponible", actualizado.getEstado()); // 7 > 5
        verify(movimientoStockRepository, times(1)).save(movimientoCaptor.capture());
        MovimientoStock mov = movimientoCaptor.getValue();
        assertEquals("Salida", mov.getTipoMovimiento());
        assertEquals(cantidadAnterior, mov.getCantidadAnterior());
        assertEquals(cantidadEsperada, mov.getCantidadNueva());
    }

    @Test
    void disminuirStock_cuandoResultaEnBajoStock_deberiaActualizarEstado() {
        // Arrange
        int cantidadADisminuir = 6; // 10 - 6 = 4, que es < 5 (min)
        when(inventarioRepository.findByUrnaId(urnaId)).thenReturn(Optional.of(inventario));
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Inventario actualizado = inventarioService.disminuirStock(urnaId, cantidadADisminuir, "Venta", "user");

        // Assert
        assertEquals(4, actualizado.getCantidadActual());
        assertEquals("Bajo Stock", actualizado.getEstado());
    }

    @Test
    void disminuirStock_cuandoResultaAgotado_deberiaActualizarEstado() {
        // Arrange
        int cantidadADisminuir = 10; // 10 - 10 = 0
        when(inventarioRepository.findByUrnaId(urnaId)).thenReturn(Optional.of(inventario));
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Inventario actualizado = inventarioService.disminuirStock(urnaId, cantidadADisminuir, "Venta", "user");

        // Assert
        assertEquals(0, actualizado.getCantidadActual());
        assertEquals("Agotado", actualizado.getEstado());
    }


    @Test
    void aumentarStock_deberiaAumentarYRegistrarEntrada() {
        // Arrange
        int cantidadAAumentar = 5;
        String motivo = "Reposición";
        String usuario = "bodeguero";
        int cantidadAnterior = inventario.getCantidadActual();
        int cantidadEsperada = cantidadAnterior + cantidadAAumentar; // 15

        when(inventarioRepository.findByUrnaId(urnaId)).thenReturn(Optional.of(inventario));
        when(inventarioRepository.save(any(Inventario.class))).thenAnswer(inv -> inv.getArgument(0));
        when(movimientoStockRepository.save(any(MovimientoStock.class))).thenAnswer(inv -> inv.getArgument(0));

        ArgumentCaptor<MovimientoStock> movimientoCaptor = ArgumentCaptor.forClass(MovimientoStock.class);

        // Act
        Inventario actualizado = inventarioService.aumentarStock(urnaId, cantidadAAumentar, motivo, usuario);

        // Assert
        assertEquals(cantidadEsperada, actualizado.getCantidadActual());
        assertEquals("Disponible", actualizado.getEstado());
        verify(movimientoStockRepository, times(1)).save(movimientoCaptor.capture());
        MovimientoStock mov = movimientoCaptor.getValue();
        assertEquals("Entrada", mov.getTipoMovimiento());
        assertEquals(cantidadAnterior, mov.getCantidadAnterior());
        assertEquals(cantidadEsperada, mov.getCantidadNueva());
    }

    @Test
    void registrarMovimientoInicial_deberiaGuardarMovimientoTipoInicial() {
        // Arrange
        int cantidadInicial = 20;
        String motivo = "Carga inicial";
        String usuario = "sistema";

        ArgumentCaptor<MovimientoStock> movimientoCaptor = ArgumentCaptor.forClass(MovimientoStock.class);
        when(movimientoStockRepository.save(any(MovimientoStock.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        inventarioService.registrarMovimientoInicial(inventario, cantidadInicial, motivo, usuario);

        // Assert
        verify(movimientoStockRepository, times(1)).save(movimientoCaptor.capture());
        MovimientoStock mov = movimientoCaptor.getValue();
        assertEquals(inventario, mov.getInventario());
        assertEquals(0, mov.getCantidadAnterior()); // Importante para inicial
        assertEquals(cantidadInicial, mov.getCantidadNueva());
        assertEquals("Inicial", mov.getTipoMovimiento());
        assertEquals(motivo, mov.getMotivo());
        assertEquals(usuario, mov.getUsuarioResponsable());
        assertNotNull(mov.getFechaMovimiento());
    }
}