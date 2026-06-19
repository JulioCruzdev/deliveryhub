package com.i99.mvp.pricing;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PriceRuleRepository extends JpaRepository<PriceRule, UUID> {
    List<PriceRule> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);
}
