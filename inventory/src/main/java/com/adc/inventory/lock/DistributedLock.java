package com.adc.inventory.lock;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation for distributed locking using Redisson.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {

    /**
     * The key for the lock, supports SpEL (Spring Expression Language).
     * For example: "'product:' + #productId"
     */
    String key();

    /**
     * The maximum time to wait for the lock.
     */
    long waitTime() default 5;

    /**
     * The maximum time to hold the lock after acquiring it.
     */
    long leaseTime() default 10;
}
