package com.descansos_del_recuerdo_spa.usuarios.controllers;

import com.descansos_del_recuerdo_spa.usuarios.dto.AuthResponse;
import com.descansos_del_recuerdo_spa.usuarios.dto.LoginRequest;
import com.descansos_del_recuerdo_spa.usuarios.dto.RegisterRequest;
import com.descansos_del_recuerdo_spa.usuarios.dto.UsuarioDTO;
import com.descansos_del_recuerdo_spa.usuarios.entities.Usuario;
import com.descansos_del_recuerdo_spa.usuarios.security.JwtUtils;
import com.descansos_del_recuerdo_spa.usuarios.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="*")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtils jwtUtils;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager am, JwtUtils jwtUtils, UsuarioService us){
        this.authManager = am; this.jwtUtils = jwtUtils; this.usuarioService = us;
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody RegisterRequest req) {
        var user = Usuario.builder()
                .nombre(req.getNombre())
                .correo(req.getCorreo())
                .password(req.getPassword()) // se encripta en el service
                .rol(req.getRol() == null ? "Cliente" : req.getRol())
                .build();

        var saved = usuarioService.register(user);
        var dto = UsuarioDTO.builder()
                .id(saved.getId()).nombre(saved.getNombre())
                .correo(saved.getCorreo()).rol(saved.getRol())
                .estado(saved.getEstado()).fechaCreacion(saved.getFechaCreacion()).build();
        return ResponseEntity.status(201).body(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getCorreo(), req.getPassword()));
        var userOpt = usuarioService.findByCorreo(req.getCorreo());
        var user = userOpt.orElseThrow();
        String token = jwtUtils.generateToken(
                user.getCorreo(),
                Map.of("rol", user.getRol(), "uid", user.getId())
        );
        return ResponseEntity.ok(new AuthResponse(token, "Bearer"));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
        if (token == null || !jwtUtils.validate(token)) return ResponseEntity.status(401).build();
        String correo = jwtUtils.getSubject(token);
        var u = usuarioService.findByCorreo(correo).orElse(null);
        if (u == null) return ResponseEntity.status(404).build();
        var dto = UsuarioDTO.builder()
                .id(u.getId()).nombre(u.getNombre())
                .correo(u.getCorreo()).rol(u.getRol())
                .estado(u.getEstado()).fechaCreacion(u.getFechaCreacion()).build();
        return ResponseEntity.ok(dto);
    }
}