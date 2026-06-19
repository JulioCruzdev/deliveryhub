package com.i99.mvp.pricing;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PriceRuleNotFoundException extends RuntimeException {
    public PriceRuleNotFoundException(UUID ruleId) {
        super("Price rule not found: " + ruleId);
    }
}
