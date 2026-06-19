package com.i99.mvp.pricing;

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
@RequestMapping("/api/tenants/{tenantId}/price-rules")
public class PriceRuleController {
    private final PriceRuleRepository priceRuleRepository;

    public PriceRuleController(PriceRuleRepository priceRuleRepository) {
        this.priceRuleRepository = priceRuleRepository;
    }

    @GetMapping
    public List<PriceRule> list(@PathVariable UUID tenantId) {
        return priceRuleRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PriceRule create(@PathVariable UUID tenantId, @Valid @RequestBody UpsertPriceRuleRequest request) {
        PriceRule rule = new PriceRule();
        apply(rule, tenantId, request);
        return priceRuleRepository.save(rule);
    }

    @PutMapping("/{ruleId}")
    public PriceRule update(
            @PathVariable UUID tenantId,
            @PathVariable UUID ruleId,
            @Valid @RequestBody UpsertPriceRuleRequest request
    ) {
        PriceRule rule = priceRuleRepository.findById(ruleId)
                .filter(found -> found.getTenantId().equals(tenantId))
                .orElseThrow(() -> new PriceRuleNotFoundException(ruleId));
        apply(rule, tenantId, request);
        return priceRuleRepository.save(rule);
    }

    private void apply(PriceRule rule, UUID tenantId, UpsertPriceRuleRequest request) {
        rule.setTenantId(tenantId);
        rule.setName(request.name());
        rule.setType(request.type());
        rule.setValue(request.value());
        rule.setCurrency(request.currency());
        rule.setActive(request.active());
    }

    public record UpsertPriceRuleRequest(
            @NotBlank String name,
            @NotNull PriceRuleType type,
            @NotNull @PositiveOrZero BigDecimal value,
            @NotBlank String currency,
            boolean active
    ) {}
}
