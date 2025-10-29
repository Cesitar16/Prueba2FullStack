package com.descansos_del_recuerdo_spa.usuarios.testmockito;

import com.descansos_del_recuerdo_spa.usuarios.controllers.AuthController;
import com.descansos_del_recuerdo_spa.usuarios.dto.AuthResponse;
import com.descansos_del_recuerdo_spa.usuarios.dto.LoginRequest;
import com.descansos_del_recuerdo_spa.usuarios.dto.RegisterRequest;
import com.descansos_del_recuerdo_spa.usuarios.dto.UsuarioDTO;
import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.security.JwtUtils;
import com.descansos_del_recuerdo_spa.usuarios.services.UsuarioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private AuthController authController;

    @Test
    void register_cuandoEsValido_deberiaRetornarUsuarioCreado() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setNombre("Test User");
        request.setCorreo("test@test.com");
        request.setPassword("password123");
        request.setRol("Cliente");

        Usuario usuarioCreado = Usuario.builder()
                .id(1L)
                .nombre("Test User")
                .correo("test@test.com")
                .password("hashedPassword") // El service lo hashea
                .rol("Cliente")
                .estado("Activo")
                .fechaCreacion(LocalDateTime.now())
                .build();

        when(usuarioService.register(any(Usuario.class))).thenReturn(usuarioCreado);

        // Act
        ResponseEntity<UsuarioDTO> response = authController.register(request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Test User", response.getBody().getNombre());
        assertEquals("test@test.com", response.getBody().getCorreo());
        assertEquals("Cliente", response.getBody().getRol());
        assertEquals("Activo", response.getBody().getEstado());
        verify(usuarioService, times(1)).register(any(Usuario.class));
    }

    @Test
    void login_cuandoCredencialesSonValidas_deberiaRetornarToken() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setCorreo("user@test.com");
        request.setPassword("password");

        Authentication authentication = mock(Authentication.class); // Mock de Authentication
        Usuario usuario = Usuario.builder()
                .id(1L).correo("user@test.com").rol("Cliente").build();
        String fakeToken = "fake-jwt-token";
        Map<String, Object> expectedClaims = Map.of("rol", "Cliente", "uid", 1L);


        // Simular autenticación exitosa
        when(authenticationManager.authenticate(
                any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        // Simular búsqueda de usuario por correo
        when(usuarioService.findByCorreo("user@test.com")).thenReturn(Optional.of(usuario));
        // Simular generación de token
        when(jwtUtils.generateToken("user@test.com", expectedClaims)).thenReturn(fakeToken);

        // Act
        ResponseEntity<AuthResponse> response = authController.login(request);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(fakeToken, response.getBody().getToken());
        assertEquals("Bearer", response.getBody().getTipo());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(usuarioService, times(1)).findByCorreo("user@test.com");
        verify(jwtUtils, times(1)).generateToken("user@test.com", expectedClaims);
    }
}