package com.descansos_del_recuerdo_spa.usuarios.services;

import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> findAll();
    Optional<Usuario> findById(Long id);
    Optional<Usuario> findByCorreo(String correo);
    Usuario register(Usuario uPlainPassword);
    Usuario update(Long id, Usuario u);   // sin cambiar pass
    void changePassword(Long id, String newPassword);
    void delete(Long id);
    Usuario save(Usuario usuario);
}