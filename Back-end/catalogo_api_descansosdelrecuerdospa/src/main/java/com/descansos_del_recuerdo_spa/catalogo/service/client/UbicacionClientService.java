package com.descansos_del_recuerdo_spa.catalogo.service.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class UbicacionClientService {

    private final WebClient webClient;

    public UbicacionClientService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8001/api").build();
    }

    public Mono<List<Object>> obtenerRegiones() {
        return webClient.get()
                .uri("/regiones")
                .retrieve()
                .bodyToFlux(Object.class)
                .collectList();
    }
}
