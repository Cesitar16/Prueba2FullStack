package com.descansos_del_recuerdo_spa.ubicacion.testmockito;

import com.descansos_del_recuerdo_spa.ubicacion.entities.Region;
import com.descansos_del_recuerdo_spa.ubicacion.repository.RegionRepository;
import com.descansos_del_recuerdo_spa.ubicacion.service.impl.RegionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegionServiceImplTest {

    @Mock
    private RegionRepository regionRepository;

    @InjectMocks
    private RegionServiceImpl regionService;

    private Region region1;
    private Region region2;

    @BeforeEach
    void setUp() {
        region1 = new Region();
        region1.setId(1);
        region1.setNombre("Metropolitana");

        region2 = new Region();
        region2.setId(2);
        region2.setNombre("Valparaíso");
    }

    @Test
    void findAll_deberiaRetornarListaDeRegiones() {
        when(regionRepository.findAll()).thenReturn(Arrays.asList(region1, region2));
        List<Region> regiones = regionService.findAll();
        assertNotNull(regiones);
        assertEquals(2, regiones.size());
        verify(regionRepository).findAll();
    }

    @Test
    void findById_cuandoExiste_deberiaRetornarRegion() {
        when(regionRepository.findById(1)).thenReturn(Optional.of(region1));
        Region encontrada = regionService.findById(1);
        assertNotNull(encontrada);
        assertEquals("Metropolitana", encontrada.getNombre());
        verify(regionRepository).findById(1);
    }

    @Test
    void findById_cuandoNoExiste_deberiaRetornarNull() {
        when(regionRepository.findById(99)).thenReturn(Optional.empty());
        Region encontrada = regionService.findById(99);
        assertNull(encontrada);
        verify(regionRepository).findById(99);
    }

    @Test
    void save_deberiaGuardarYRetornarRegion() {
        Region nueva = new Region();
        nueva.setNombre("Arica y Parinacota");
        when(regionRepository.save(any(Region.class))).thenAnswer(inv -> {
            Region r = inv.getArgument(0);
            r.setId(3); // Simular ID generado
            return r;
        });

        Region guardada = regionService.save(nueva);
        assertNotNull(guardada);
        assertEquals(3, guardada.getId());
        assertEquals("Arica y Parinacota", guardada.getNombre());
        verify(regionRepository).save(nueva);
    }

    @Test
    void deleteById_deberiaLlamarDeleteByIdDelRepositorio() {
        Integer idParaBorrar = 1;
        doNothing().when(regionRepository).deleteById(idParaBorrar);
        regionService.deleteById(idParaBorrar);
        verify(regionRepository).deleteById(idParaBorrar);
    }
}