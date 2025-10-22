package com.descansos_del_recuerdo_spa.usuarios.services.impl;

import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.repositories.UsuarioRepository;
import com.descansos_del_recuerdo_spa.usuarios.services.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    private final UsuarioRepository repo; private final PasswordEncoder encoder;
    public UsuarioServiceImpl(UsuarioRepository repo, PasswordEncoder encoder){
        this.repo = repo; this.encoder = encoder;
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
}