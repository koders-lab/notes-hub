---
title: "Quartz Component Lists"
description: "Programmatically render lists of notes and categorized folders as grid tiles."
date: 2026-06-16
tags:
  - layouts
  - quartz
---

<div class="quartz-grid-list">
  <div class="card">
    <h3>⚡ Refresher</h3>
    <p>Fast-recall cheat sheets before an interview</p>
  </div>
  <div class="card">
    <h3>🗺️ Maps of Content</h3>
    <p>Guided learning paths per topic</p>
  </div>
</div>

<style>
.quartz-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
  margin-top: 1.5rem;
}
.quartz-grid-list .card {
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--light);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.quartz-grid-list .card:hover {
  transform: translateY(-2px);
  border-color: var(--secondary);
}
</style>