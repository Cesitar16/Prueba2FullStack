package com.descansos_del_recuerdo_spa.usuarios.testmockito;

import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.repositories.UsuarioRepository;
import com.descansos_del_recuerdo_spa.usuarios.services.impl.UsuarioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuario1;
    private Usuario usuario2;

    @BeforeEach
    void setUp() {
        usuario1 = Usuario.builder()
                .id(1L)
                .nombre("Usuario Uno")
                .correo("uno@test.com")
                .password("hashedPassword1")
                .rol("Cliente")
                .estado("Activo")
                .build();
        usuario2 = Usuario.builder()
                .id(2L)
                .nombre("Usuario Dos")
                .correo("dos@test.com")
                .password("hashedPassword2")
                .rol("ADMINISTRADOR")
                .estado("Activo")
                .build();
    }

    @Test
    void findAll_deberiaRetornarListaDeUsuarios() {
        // Arrange
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario1, usuario2));

        // Act
        List<Usuario> usuarios = usuarioService.findAll();

        // Assert
        assertNotNull(usuarios);
        assertEquals(2, usuarios.size());
        assertEquals("Usuario Uno", usuarios.get(0).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void findById_cuandoExiste_deberiaRetornarOptionalConUsuario() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        // Act
        Optional<Usuario> resultado = usuarioService.findById(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals("uno@test.com", resultado.get().getCorreo());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void findById_cuandoNoExiste_deberiaRetornarOptionalVacio() {
        // Arrange
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> resultado = usuarioService.findById(99L);

        // Assert
        assertTrue(resultado.isEmpty());
        verify(usuarioRepository, times(1)).findById(99L);
    }


    @Test
    void register_cuandoCorreoNoExiste_deberiaGuardarUsuario() {
        // Arrange
        Usuario nuevoUsuario = Usuario.builder()
                .nombre("Nuevo Usuario")
                .correo("nuevo@test.com")
                .password("plainPassword") // Contraseña en texto plano
                .rol("Cliente")
                .build();
        String hashedPassword = "hashedNuevoPassword";

        when(usuarioRepository.existsByCorreo("nuevo@test.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn(hashedPassword);
        // Configurar el mock para devolver el usuario con ID y campos por defecto asignados
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario u = invocation.getArgument(0);
            u.setId(3L); // Simular ID generado por la BD
            if (u.getEstado() == null || u.getEstado().isBlank()) {
                u.setEstado("Activo"); // Asegurar que el estado se establece
            }
            if (u.getRol() == null) {
                u.setRol("Cliente"); // Asegurar que el rol se establece
            }
            u.setPassword(hashedPassword); // Asegurar que la contraseña está hasheada
            return u;
        });


        // Act
        Usuario guardado = usuarioService.register(nuevoUsuario);

        // Assert
        assertNotNull(guardado);
        assertNotNull(guardado.getId());
        assertEquals("Nuevo Usuario", guardado.getNombre());
        assertEquals("nuevo@test.com", guardado.getCorreo());
        assertEquals(hashedPassword, guardado.getPassword());
        assertEquals("Cliente", guardado.getRol());
        assertEquals("Activo", guardado.getEstado());
        verify(usuarioRepository, times(1)).existsByCorreo("nuevo@test.com");
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }


    @Test
    void register_cuandoCorreoExiste_deberiaLanzarRuntimeException() {
        // Arrange
        Usuario usuarioExistente = Usuario.builder()
                .nombre("Existente")
                .correo("uno@test.com")
                .password("password")
                .build();
        when(usuarioRepository.existsByCorreo("uno@test.com")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.register(usuarioExistente);
        });
        assertEquals("Correo ya registrado", exception.getMessage());
        verify(usuarioRepository, times(1)).existsByCorreo("uno@test.com");
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void update_cuandoUsuarioExiste_deberiaActualizarSinCambiarPassword() {
        // Arrange
        Long userId = 1L;
        Usuario cambios = Usuario.builder()
                .nombre("Usuario Uno Actualizado")
                .correo("uno_actualizado@test.com")
                .rol("ADMINISTRADOR")
                .estado("Inactivo")
                // No se envía password en la actualización normal
                .build();

        // El usuario actual en la BD
        when(usuarioRepository.findById(userId)).thenReturn(Optional.of(usuario1));
        // Simular el guardado, debe mantener la contraseña original
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario uGuardar = invocation.getArgument(0);
            assertEquals(userId, uGuardar.getId()); // Verificar que el ID es correcto
            assertEquals(usuario1.getPassword(), uGuardar.getPassword()); // Verificar que la pass no cambió
            return uGuardar; // Devolver el usuario "actualizado"
        });


        // Act
        Usuario actualizado = usuarioService.update(userId, cambios);

        // Assert
        assertNotNull(actualizado);
        assertEquals(userId, actualizado.getId());
        assertEquals("Usuario Uno Actualizado", actualizado.getNombre());
        assertEquals("uno_actualizado@test.com", actualizado.getCorreo());
        assertEquals("ADMINISTRADOR", actualizado.getRol());
        assertEquals("Inactivo", actualizado.getEstado());
        assertEquals(usuario1.getPassword(), actualizado.getPassword()); // Contraseña original mantenida
        verify(usuarioRepository, times(1)).findById(userId);
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }


    @Test
    void changePassword_cuandoUsuarioExiste_deberiaCambiarPasswordHasheada() {
        // Arrange
        Long userId = 1L;
        String newPassword = "newPlainPassword";
        String hashedNewPassword = "hashedNewPassword";

        when(usuarioRepository.findById(userId)).thenReturn(Optional.of(usuario1));
        when(passwordEncoder.encode(newPassword)).thenReturn(hashedNewPassword);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario1); // Devuelve el mismo objeto modificado

        // Act
        usuarioService.changePassword(userId, newPassword);

        // Assert
        assertEquals(hashedNewPassword, usuario1.getPassword()); // Verificar que la contraseña en el objeto original fue cambiada
        verify(usuarioRepository, times(1)).findById(userId);
        verify(passwordEncoder, times(1)).encode(newPassword);
        verify(usuarioRepository, times(1)).save(usuario1); // Verificar que se guarda el objeto modificado
    }

    @Test
    void delete_deberiaLlamarDeleteByIdDelRepositorio() {
        // Arrange
        Long userId = 1L;
        doNothing().when(usuarioRepository).deleteById(userId); // Para métodos void

        // Act
        usuarioService.delete(userId);

        // Assert
        verify(usuarioRepository, times(1)).deleteById(userId);
    }
}