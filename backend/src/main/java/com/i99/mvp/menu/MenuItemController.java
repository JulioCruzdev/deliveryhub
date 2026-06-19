package com.i99.mvp.menu;

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
@RequestMapping("/api/tenants/{tenantId}/menu-items")
public class MenuItemController {
    private final MenuItemRepository menuItemRepository;

    public MenuItemController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public List<MenuItem> list(@PathVariable UUID tenantId) {
        return menuItemRepository.findByTenantIdOrderByNameAsc(tenantId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MenuItem create(@PathVariable UUID tenantId, @Valid @RequestBody UpsertMenuItemRequest request) {
        MenuItem item = new MenuItem();
        apply(item, tenantId, request);
        return menuItemRepository.save(item);
    }

    @PutMapping("/{itemId}")
    public MenuItem update(
            @PathVariable UUID tenantId,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpsertMenuItemRequest request
    ) {
        MenuItem item = menuItemRepository.findById(itemId)
                .filter(found -> found.getTenantId().equals(tenantId))
                .orElseThrow(() -> new MenuItemNotFoundException(itemId));
        apply(item, tenantId, request);
        return menuItemRepository.save(item);
    }

    private void apply(MenuItem item, UUID tenantId, UpsertMenuItemRequest request) {
        item.setTenantId(tenantId);
        item.setName(request.name());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setCurrency(request.currency());
        item.setActive(request.active());
        item.setPlatform(request.platform());
        item.setPlatformItemId(request.platformItemId());
    }

    public record UpsertMenuItemRequest(
            @NotBlank String name,
            String description,
            @NotNull @PositiveOrZero BigDecimal price,
            @NotBlank String currency,
            boolean active,
            Platform platform,
            String platformItemId
    ) {}
}
