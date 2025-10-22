package com.descansos_del_recuerdo_spa.pedidos.services.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventarioClientService {

    private final WebClient webClient;

    @Value("${api.inventario.url}")
    private String inventarioApiUrl;

    /**
     * Envía una solicitud a la API de inventario para reducir el stock de una urna.
     */
    public void reducirStock(Integer urnaId, Integer cantidad, String motivo) {
        Map<String, Object> payload = Map.of(
                "urnaId", urnaId,
                "cantidad", cantidad,
                "motivo", motivo
        );

        webClient.post()
                .uri(inventarioApiUrl + "/actualizar-stock")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(ex -> {
                    System.err.println("❌ Error al comunicar con la API de inventario: " + ex.getMessage());
                    return Mono.empty();
                })
                .subscribe();
    }
}
