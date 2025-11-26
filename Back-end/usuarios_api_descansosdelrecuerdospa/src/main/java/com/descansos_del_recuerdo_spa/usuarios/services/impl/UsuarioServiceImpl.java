package com.descansos_del_recuerdo_spa.usuarios.services.impl;

import com.descansos_del_recuerdo_spa.usuarios.exception.ResourceNotFoundException;
import com.descansos_del_recuerdo_spa.usuarios.security.JwtUtils;
import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.repositories.UsuarioRepository;
import com.descansos_del_recuerdo_spa.usuarios.services.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.JwtException;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public UsuarioServiceImpl(UsuarioRepository repo, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @Override public List<Usuario> findAll(){ return repo.findAll(); }
    @Override public Optional<Usuario> findById(Long id){ return repo.findById(id); }
    @Override public Optional<Usuario> findByCorreo(String correo){ return repo.findByCorreo(correo); }

    @Override public Usuario register(Usuario u) {
        if (repo.existsByCorreo(u.getCorreo())) throw new RuntimeException("Correo ya registrado");
        u.setPassword(encoder.encode(u.getPassword()));  // BCrypt
        if (u.getRol()==null) u.setRol("Cliente");
        if (u.getEstado() == null || u.getEstado().isBlank()) {
            u.setEstado("Activo");
        }
        return repo.save(u);

    }

    @Override public Usuario update(Long id, Usuario u) {
        u.setId(id);
        // NO pisar password aquí
        var current = repo.findById(id).orElseThrow();
        u.setPassword(current.getPassword());
        return repo.save(u);
    }

    @Override public void changePassword(Long id, String newPassword) {
        var u = repo.findById(id).orElseThrow();
        u.setPassword(encoder.encode(newPassword));
        repo.save(u);
    }

    @Override public void delete(Long id){ repo.deleteById(id); }

    @Override
    public Usuario save(Usuario usuario) {
        return repo.save(usuario);
    }

    // ============================================================
    //  RECUPERACIÓN DE CONTRASEÑA
    // ============================================================

    @Override
    public void solicitarRecuperacionPassword(String correo) {
        // 1. Buscar si el usuario existe
        Usuario usuario = repo.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con correo: " + correo));

        // 2. Generar token temporal (10 min)
        String token = jwtUtils.generatePasswordResetToken(correo);

        // 3. SIMULACIÓN DE ENVÍO DE CORREO (Ver Consola Java)
        // -----------------------------------------------------------------------
        // En producción, aquí llamarías a un servicio de Email (JavaMailSender)
        // -----------------------------------------------------------------------
        System.out.println("\n==================================================");
        System.out.println("📧 [SIMULACIÓN] CORREO DE RECUPERACIÓN ENVIADO");
        System.out.println("--------------------------------------------------");
        System.out.println("Para: " + correo);
        System.out.println("Token: " + token);
        System.out.println("Enlace (Frontend): http://localhost:5173/reset-password?token=" + token);
        System.out.println("==================================================\n");
    }

    @Override
    public void procesarRecuperacionPassword(String token, String nuevaPassword) {
        // 1. Validar el token y extraer el correo
        String correo;
        try {
            // Si el token expiró o fue alterado, esto lanzará excepción
            correo = jwtUtils.extractUsername(token);
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("El enlace de recuperación es inválido o ha expirado.");
        }

        // 2. Buscar el usuario (seguridad extra)
        Usuario usuario = repo.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado."));

        // 3. Actualizar contraseña (encriptada)
        usuario.setPassword(encoder.encode(nuevaPassword));
        repo.save(usuario);
    }
}