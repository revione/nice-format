export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export function generateContextId() {
  return "ctx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

export function showMessage(containerId, message, type = "success") {
  const el = qs(`#${containerId}`);
  if (!el) return;
  el.innerHTML = `<div class="message ${type}">${message}</div>`;
  // opcional: auto-hide
  // setTimeout(() => el.innerHTML = "", 2000);
}

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "Nunca");
