package com.descansos_del_recuerdo_spa.pedidos.testmockito;

import com.descansos_del_recuerdo_spa.pedidos.entities.DetallePedido;
import com.descansos_del_recuerdo_spa.pedidos.entities.EstadoPedido;
import com.descansos_del_recuerdo_spa.pedidos.entities.Pedido;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.DetallePedidoDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoRequestDTO;
import com.descansos_del_recuerdo_spa.pedidos.entities.dto.PedidoResponseDTO;
import com.descansos_del_recuerdo_spa.pedidos.repositories.DetallePedidoRepository;
import com.descansos_del_recuerdo_spa.pedidos.repositories.EstadoPedidoRepository;
import com.descansos_del_recuerdo_spa.pedidos.repositories.PedidoRepository;
import com.descansos_del_recuerdo_spa.pedidos.services.impl.PedidoServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceImplTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private DetallePedidoRepository detallePedidoRepository;

    @Mock
    private EstadoPedidoRepository estadoPedidoRepository;

    @InjectMocks
    private PedidoServiceImpl pedidoService;

    private PedidoRequestDTO pedidoRequest;
    private EstadoPedido estadoPendiente;
    private Pedido pedidoGuardado;
    private DetallePedido detalleGuardado1;
    private DetallePedido detalleGuardado2;


    @BeforeEach
    void setUp() {
        estadoPendiente = EstadoPedido.builder().id(1L).nombre("Pendiente").build();

        DetallePedidoDTO detalleDTO1 = DetallePedidoDTO.builder()
                .urnaId(101L).cantidad(1).precioUnitario(new BigDecimal("100.00")).build();
        DetallePedidoDTO detalleDTO2 = DetallePedidoDTO.builder()
                .urnaId(102L).cantidad(2).precioUnitario(new BigDecimal("50.00")).build();

        pedidoRequest = PedidoRequestDTO.builder()
                .usuarioId(1L)
                .direccionId(5L)
                .estadoPedidoId(1L)
                .detalles(Arrays.asList(detalleDTO1, detalleDTO2))
                .build(); // Total se calcula en el servicio


        pedidoGuardado = Pedido.builder()
                .id(1L) // ID simulado después de guardar
                .usuarioId(1L)
                .direccionId(5L)
                .estadoPedido(estadoPendiente)
                .fechaPedido(LocalDateTime.now()) // Fecha simulada
                .total(new BigDecimal("200.00")) // Total calculado
                .build();

        detalleGuardado1 = DetallePedido.builder()
                .id(11L).pedido(pedidoGuardado).urnaId(101L).cantidad(1)
                .precioUnitario(new BigDecimal("100.00")).subtotal(new BigDecimal("100.00")).build();
        detalleGuardado2 = DetallePedido.builder()
                .id(12L).pedido(pedidoGuardado).urnaId(102L).cantidad(2)
                .precioUnitario(new BigDecimal("50.00")).subtotal(new BigDecimal("100.00")).build();
    }

    @Test
    void crearPedido_cuandoDatosSonValidos_deberiaCrearPedidoYDetalles() {
        // Arrange
        when(estadoPedidoRepository.findById(1L)).thenReturn(Optional.of(estadoPendiente));

        // Simular primer guardado del pedido (aún sin total)
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido p = invocation.getArgument(0);
            if (p.getId() == null) { // Solo asignar ID la primera vez
                p.setId(1L); // Asignar ID simulado
                p.setFechaPedido(LocalDateTime.now()); // Simular fecha de creación
            }
            // El total se asignará en la segunda llamada a save
            return p;
        });

        // Simular guardado de detalles
        when(detallePedidoRepository.save(any(DetallePedido.class))).thenAnswer(invocation -> {
            DetallePedido d = invocation.getArgument(0);
            // Simular cálculo de subtotal (aunque lo hace la BD)
            BigDecimal sub = d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()));
            d.setSubtotal(sub);
            // Asignar IDs simulados a los detalles guardados
            if(d.getUrnaId() == 101L) d.setId(11L);
            if(d.getUrnaId() == 102L) d.setId(12L);
            return d;
        });

        when(detallePedidoRepository.findByPedido_Id(pedidoGuardado.getId()))
                .thenReturn(Arrays.asList(detalleGuardado1, detalleGuardado2)); // Devuelve los detalles simulados

        ArgumentCaptor<Pedido> pedidoCaptor = ArgumentCaptor.forClass(Pedido.class);

        // Act
        PedidoResponseDTO response = pedidoService.crearPedido(pedidoRequest);


        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1L, response.getUsuarioId());
        assertEquals(5L, response.getDireccionId());
        assertEquals("Pendiente", response.getEstado());
        // assertEquals(0, new BigDecimal("200.00").compareTo(response.getTotal())); // Compara BigDecimals
        assertNotNull(response.getFechaPedido());
        assertEquals(2, response.getDetalles().size());

        // Verificar interacciones
        verify(detallePedidoRepository, times(1)).findByPedido_Id(pedidoGuardado.getId());
        verify(pedidoRepository, times(2)).save(pedidoCaptor.capture()); // Se llama dos veces a save para Pedido
        verify(detallePedidoRepository, times(2)).save(any(DetallePedido.class)); // Una vez por cada detalle

        // Verificar el estado final del pedido guardado (la segunda captura)
        Pedido pedidoFinalGuardado = pedidoCaptor.getAllValues().get(1);
        assertEquals(0, new BigDecimal("200.00").compareTo(pedidoFinalGuardado.getTotal()));
    }

    @Test
    void crearPedido_cuandoEstadoNoExiste_deberiaLanzarEntityNotFoundException() {
        // Arrange
        when(estadoPedidoRepository.findById(99L)).thenReturn(Optional.empty());
        pedidoRequest.setEstadoPedidoId(99L);

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            pedidoService.crearPedido(pedidoRequest);
        });
        assertEquals("Estado de pedido no encontrado", exception.getMessage());
        verify(pedidoRepository, never()).save(any());
        verify(detallePedidoRepository, never()).save(any());
    }

    @Test
    void actualizarEstado_cuandoPedidoYEstadoExisten_deberiaActualizarEstado() {
        // Arrange
        Long pedidoId = 1L;
        Long nuevoEstadoId = 2L;
        EstadoPedido nuevoEstado = EstadoPedido.builder().id(nuevoEstadoId).nombre("En Proceso").build();

        when(pedidoRepository.findById(pedidoId)).thenReturn(Optional.of(pedidoGuardado));
        when(estadoPedidoRepository.findById(nuevoEstadoId)).thenReturn(Optional.of(nuevoEstado));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedidoGuardado); // Devuelve el objeto modificado

        // Act
        pedidoService.actualizarEstado(pedidoId, nuevoEstadoId);

        // Assert
        assertEquals(nuevoEstado, pedidoGuardado.getEstadoPedido()); // Verificar que el estado en el objeto original cambió
        verify(pedidoRepository, times(1)).findById(pedidoId);
        verify(estadoPedidoRepository, times(1)).findById(nuevoEstadoId);
        verify(pedidoRepository, times(1)).save(pedidoGuardado);
    }

    @Test
    void actualizarEstado_cuandoPedidoNoExiste_deberiaLanzarEntityNotFoundException() {
        // Arrange
        Long pedidoId = 99L;
        Long estadoId = 1L;
        when(pedidoRepository.findById(pedidoId)).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            pedidoService.actualizarEstado(pedidoId, estadoId);
        });
        assertEquals("Pedido no encontrado", exception.getMessage());
        verify(estadoPedidoRepository, never()).findById(any());
        verify(pedidoRepository, never()).save(any());
    }

    @Test
    void eliminar_deberiaLlamarDeleteByIdDelRepositorio() {
        // Arrange
        Long pedidoId = 1L;
        doNothing().when(pedidoRepository).deleteById(pedidoId);

        // Act
        pedidoService.eliminar(pedidoId);

        // Assert
        verify(pedidoRepository, times(1)).deleteById(pedidoId);
    }

    @Test
    void listar_deberiaRetornarListaDePedidoResponseDTO() {
        // Arrange
        // Asegúrate de que el pedidoGuardado tenga los detalles asociados para el mapeo
        when(pedidoRepository.findAll()).thenReturn(List.of(pedidoGuardado));
        when(detallePedidoRepository.findByPedido_Id(pedidoGuardado.getId()))
                .thenReturn(List.of(detalleGuardado1, detalleGuardado2));

        // Act
        List<PedidoResponseDTO> lista = pedidoService.listar();

        // Assert
        assertNotNull(lista);
        assertEquals(1, lista.size());
        PedidoResponseDTO dto = lista.get(0);
        assertEquals(pedidoGuardado.getId(), dto.getId());
        assertEquals(pedidoGuardado.getEstadoPedido().getNombre(), dto.getEstado());
        assertEquals(2, dto.getDetalles().size());
        assertEquals(detalleGuardado1.getId(), dto.getDetalles().get(0).getId());
        verify(pedidoRepository, times(1)).findAll();
        verify(detallePedidoRepository, times(1)).findByPedido_Id(pedidoGuardado.getId());
    }
}