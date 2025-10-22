package com.descansos_del_recuerdo_spa.usuarios.security;

import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public class CustomUserDetails implements UserDetails {
    private final Usuario u;
    public CustomUserDetails(Usuario u){ this.u = u; }
    @Override public List<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol().toUpperCase()));
    }
    @Override public String getPassword(){ return u.getPassword(); }
    @Override public String getUsername(){ return u.getCorreo(); }
    @Override public boolean isAccountNonExpired(){ return true; }
    @Override public boolean isAccountNonLocked(){ return true; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled(){ return "Activo".equalsIgnoreCase(u.getEstado()); }
    public Usuario getUsuario(){ return u; }
}