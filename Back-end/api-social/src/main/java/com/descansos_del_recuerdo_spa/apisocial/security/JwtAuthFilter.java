package com.descansos_del_recuerdo_spa.apisocial.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");

        // DEBUG: Ver qué llega
        System.out.println("🔹 Filtro JWT - URL: " + req.getRequestURI());

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtils.validate(token)) {
                String username = jwtUtils.getSubject(token);
                String rol = jwtUtils.getRole(token);

                // DEBUG: Ver si el token es válido y qué rol trae
                System.out.println("✅ Token Válido. Usuario: " + username + ", Rol: " + rol);

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase());
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(authority);

                var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                // DEBUG: Token inválido
                System.out.println("❌ Token Inválido o Expirado");
            }
        } else {
            // DEBUG: No hay cabecera
            System.out.println("⚠️ No se encontró cabecera Authorization Bearer");
        }

        chain.doFilter(req, res);
    }
}