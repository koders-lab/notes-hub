---
title: "Masonry-Style Layout"
description: "Ideal for cards with varying heights of text or media previews."
date: 2026-06-16
tags:
  - layouts
  - css
---

<div class="masonry-container">
  <div class="card"><h3>🧩 DSA</h3><p>Patterns & problem-solving</p></div>
  <div class="card"><h3>🏗️ System Design</h3><p>Scaling, trade-offs, consistent hashing with long descriptions and deep architectural notes.</p></div>
  <div class="card"><h3>📨 Kafka</h3><p>Streaming, partitions</p></div>
</div>

<style>
.masonry-container {
  column-count: 3;
  column-gap: 1rem;
  margin-top: 1.5rem;
}
@media (max-width: 800px) {
  .masonry-container { column-count: 2; }
}
@media (max-width: 500px) {
  .masonry-container { column-count: 1; }
}
.masonry-container .card {
  break-inside: avoid;
  margin-bottom: 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1.2rem;
  background: var(--light);
}
</style>