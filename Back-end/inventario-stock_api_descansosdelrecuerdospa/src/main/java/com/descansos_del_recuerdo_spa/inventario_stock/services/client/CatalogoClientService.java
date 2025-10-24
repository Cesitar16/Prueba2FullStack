package com.descansos_del_recuerdo_spa.inventario_stock.services.client;

import com.descansos_del_recuerdo_spa.inventario_stock.entities.dto.UrnaDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class CatalogoClientService {

    private final WebClient webClient;

    public CatalogoClientService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8082/api/urnas")
                .build();
    }

    /**
     * Obtiene los datos de una urna desde el microservicio Catálogo
     * y los mapea directamente al DTO UrnaDTO.
     */
    public Mono<UrnaDTO> obtenerUrnaPorId(Long urnaId) {
        return webClient.get()
                .uri("/{id}", urnaId)
                .retrieve()
                .bodyToMono(UrnaDTO.class)
                .onErrorResume(ex -> Mono.empty());
    }
    
    public Mono<UrnaDTO> crearUrna(UrnaDTO urna) {
        return webClient.post()
                .uri("/api/urnas")
                .bodyValue(urna)
                .retrieve()
                .bodyToMono(UrnaDTO.class);
    }

}