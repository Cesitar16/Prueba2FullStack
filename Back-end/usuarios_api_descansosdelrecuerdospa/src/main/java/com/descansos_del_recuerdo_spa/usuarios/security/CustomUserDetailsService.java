package com.descansos_del_recuerdo_spa.usuarios.security;

import com.descansos_del_recuerdo_spa.usuarios.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository repo;
    public CustomUserDetailsService(UsuarioRepository repo){ this.repo = repo; }
    @Override public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        var u = repo.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new CustomUserDetails(u);
    }
}