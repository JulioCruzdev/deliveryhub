package com.i99.mvp.order;

import com.i99.mvp.common.Platform;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants/{tenantId}/orders")
public class OrderController {
    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public List<Order> list(@PathVariable UUID tenantId) {
        return orderRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order create(@PathVariable UUID tenantId, @Valid @RequestBody CreateOrderRequest request) {
        Order order = new Order();
        order.setTenantId(tenantId);
        order.setPlatform(request.platform());
        order.setPlatformOrderId(request.platformOrderId());
        order.setStatus(request.status());
        order.setTotalAmount(request.totalAmount());
        order.setCurrency(request.currency());
        return orderRepository.save(order);
    }

    @PatchMapping("/{orderId}/status")
    public Order updateStatus(
            @PathVariable UUID tenantId,
            @PathVariable UUID orderId,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        Order order = orderRepository.findById(orderId)
                .filter(found -> found.getTenantId().equals(tenantId))
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        order.setStatus(request.status());
        return orderRepository.save(order);
    }

    public record CreateOrderRequest(
            @NotNull Platform platform,
            @NotBlank String platformOrderId,
            @NotNull OrderStatus status,
            @NotNull @PositiveOrZero BigDecimal totalAmount,
            @NotBlank String currency
    ) {}

    public record UpdateStatusRequest(@NotNull OrderStatus status) {}
}
