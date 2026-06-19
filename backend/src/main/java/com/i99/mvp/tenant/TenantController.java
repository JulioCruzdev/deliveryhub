package com.i99.mvp.tenant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {
    private final TenantRepository tenantRepository;

    public TenantController(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @GetMapping
    public List<Tenant> list() {
        return tenantRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tenant create(@Valid @RequestBody CreateTenantRequest request) {
        Tenant tenant = new Tenant();
        tenant.setName(request.name());
        return tenantRepository.save(tenant);
    }

    @GetMapping("/{tenantId}")
    public Tenant get(@PathVariable UUID tenantId) {
        return tenantRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundException(tenantId));
    }

    @DeleteMapping("/{tenantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID tenantId) {
        tenantRepository.deleteById(tenantId);
    }

    public record CreateTenantRequest(@NotBlank String name) {}
}
