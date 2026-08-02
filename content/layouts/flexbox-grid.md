---
title: "Flexbox Grid Layout"
description: "A flexible alternative for card items that vary significantly in width."
date: 2026-06-16
tags:
  - layouts
  - css
---

<div class="flex-card-container">
  <div class="card">
    <h3>☕ Java</h3>
    <p>Core, collections, concurrency, JVM</p>
  </div>
  <div class="card">
    <h3>🌱 Spring Boot</h3>
    <p>IoC, caching, transactions, AOP</p>
  </div>
  <div class="card">
    <h3>☁️ AWS</h3>
    <p>Lambda, core services, architecture</p>
  </div>
</div>

<style>
.flex-card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}
.flex-card-container .card {
  flex: 1 1 250px;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1.2rem;
  background: var(--light);
}
</style>