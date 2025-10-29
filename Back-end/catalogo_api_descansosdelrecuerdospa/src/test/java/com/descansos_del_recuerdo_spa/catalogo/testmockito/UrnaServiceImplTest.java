package com.descansos_del_recuerdo_spa.catalogo.testmockito;

import com.descansos_del_recuerdo_spa.catalogo.dto.UrnaInputDTO;
import com.descansos_del_recuerdo_spa.catalogo.entities.Color;
import com.descansos_del_recuerdo_spa.catalogo.entities.Material;
import com.descansos_del_recuerdo_spa.catalogo.entities.Modelo;
import com.descansos_del_recuerdo_spa.catalogo.entities.Urna;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ColorRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.MaterialRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.ModeloRepository;
import com.descansos_del_recuerdo_spa.catalogo.repositories.UrnaRepository;
import com.descansos_del_recuerdo_spa.catalogo.service.impl.UrnaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrnaServiceImplTest {

    @Mock
    private UrnaRepository urnaRepository;
    @Mock
    private MaterialRepository materialRepository;
    @Mock
    private ColorRepository colorRepository;
    @Mock
    private ModeloRepository modeloRepository;

    @InjectMocks
    private UrnaServiceImpl urnaService;

    private Urna urnaExistente;
    private UrnaInputDTO urnaInputDTO;
    private Material material;
    private Color color;
    private Modelo modelo;

    @BeforeEach
    void setUp() {
        material = Material.builder().id(1L).nombre("Madera").build();
        color = Color.builder().id(1L).nombre("Café").build();
        modelo = Modelo.builder().id(1L).nombre("Clásico").build();

        urnaExistente = Urna.builder()
                .id(1L)
                .nombre("Urna Clásica Madera")
                .idInterno("URN-001")
                .precio(new BigDecimal("150.00"))
                .material(material)
                .color(color)
                .modelo(modelo)
                .estado("Activo")
                .disponible("s")
                .fechaCreacion(LocalDateTime.now().minusDays(1))
                .build();

        urnaInputDTO = new UrnaInputDTO();
        urnaInputDTO.setNombre("Urna Nueva");
        urnaInputDTO.setIdInterno("URN-002");
        urnaInputDTO.setPrecio(200.0);
        urnaInputDTO.setMaterialId(1L);
        urnaInputDTO.setColorId(1L);
        urnaInputDTO.setModeloId(1L);
        urnaInputDTO.setEstado("Activo");
        urnaInputDTO.setDisponible("s");
        urnaInputDTO.setAlto(50.0);
        urnaInputDTO.setAncho(30.0);
        urnaInputDTO.setProfundidad(25.0);
        urnaInputDTO.setPeso(5.5);
    }

    @Test
    void findById_cuandoExiste_deberiaRetornarOptionalConUrna() {
        when(urnaRepository.findById(1L)).thenReturn(Optional.of(urnaExistente));
        Optional<Urna> resultado = urnaService.findById(1L);
        assertTrue(resultado.isPresent());
        assertEquals("URN-001", resultado.get().getIdInterno());
        verify(urnaRepository).findById(1L);
    }

    @Test
    void save_deberiaMapearDtoYGuardarUrna() {
        when(materialRepository.findById(1L)).thenReturn(Optional.of(material));
        when(colorRepository.findById(1L)).thenReturn(Optional.of(color));
        when(modeloRepository.findById(1L)).thenReturn(Optional.of(modelo));
        when(urnaRepository.save(any(Urna.class))).thenAnswer(inv -> {
            Urna u = inv.getArgument(0);
            u.setId(2L); // Simular ID generado
            assertNotNull(u.getFechaCreacion()); // Verificar que se asignó fecha
            return u;
        });

        ArgumentCaptor<Urna> urnaCaptor = ArgumentCaptor.forClass(Urna.class);

        Urna guardada = urnaService.save(urnaInputDTO);

        assertNotNull(guardada);
        assertEquals(2L, guardada.getId());
        assertEquals("Urna Nueva", guardada.getNombre());
        assertEquals("URN-002", guardada.getIdInterno());
        assertEquals(0, new BigDecimal("200.0").compareTo(guardada.getPrecio()));
        assertEquals(material, guardada.getMaterial());
        assertEquals(color, guardada.getColor());
        assertEquals(modelo, guardada.getModelo());
        assertEquals(0, new BigDecimal("50.0").compareTo(guardada.getAlto()));
        assertNotNull(guardada.getFechaCreacion());

        verify(materialRepository).findById(1L);
        verify(colorRepository).findById(1L);
        verify(modeloRepository).findById(1L);
        verify(urnaRepository).save(urnaCaptor.capture());

        // Verificar mapeo en el objeto capturado antes de guardar
        Urna urnaAntesDeGuardar = urnaCaptor.getValue();
        assertEquals("Urna Nueva", urnaAntesDeGuardar.getNombre());
        assertEquals(0, new BigDecimal("5.5").compareTo(urnaAntesDeGuardar.getPeso()));

    }

    @Test
    void update_cuandoUrnaExiste_deberiaActualizarCampos() {
        Long urnaId = 1L;
        UrnaInputDTO dtoUpdate = new UrnaInputDTO();
        dtoUpdate.setNombre("Urna Clásica Actualizada");
        dtoUpdate.setPrecio(160.0);
        dtoUpdate.setEstado("Inactivo");
        // No se envían IDs de relaciones, deben mantenerse las originales si no se especifican

        when(urnaRepository.findById(urnaId)).thenReturn(Optional.of(urnaExistente));
        // No se mockean repositorios de relaciones porque el DTO no los incluye
        when(urnaRepository.save(any(Urna.class))).thenAnswer(inv -> inv.getArgument(0)); // Devuelve el objeto modificado

        ArgumentCaptor<Urna> urnaCaptor = ArgumentCaptor.forClass(Urna.class);

        Urna actualizada = urnaService.update(urnaId, dtoUpdate);

        assertNotNull(actualizada);
        assertEquals(urnaId, actualizada.getId());
        assertEquals("Urna Clásica Actualizada", actualizada.getNombre());
        assertEquals(0, new BigDecimal("160.0").compareTo(actualizada.getPrecio()));
        assertEquals("Inactivo", actualizada.getEstado());
        // Verificar que las relaciones se mantuvieron
        assertEquals(material, actualizada.getMaterial());
        assertEquals(color, actualizada.getColor());
        assertEquals(modelo, actualizada.getModelo());

        verify(urnaRepository).findById(urnaId);
        verify(urnaRepository).save(urnaCaptor.capture());

        // Verificar el objeto capturado
        Urna urnaAntesDeGuardar = urnaCaptor.getValue();
        assertEquals("Urna Clásica Actualizada", urnaAntesDeGuardar.getNombre());
        assertEquals("Inactivo", urnaAntesDeGuardar.getEstado());

    }

    @Test
    void update_cuandoUrnaNoExiste_deberiaLanzarExcepcion() {
        Long urnaId = 99L;
        when(urnaRepository.findById(urnaId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            urnaService.update(urnaId, urnaInputDTO);
        });

        assertTrue(exception.getMessage().contains("Urna no encontrada con id " + urnaId));
        verify(urnaRepository).findById(urnaId);
        verify(urnaRepository, never()).save(any());
    }

}