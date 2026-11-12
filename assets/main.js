// Camilooh — pequeños detalles de interacción.

// Borde de la cabecera al hacer scroll
const cabecera = document.getElementById('cabecera');
if (cabecera) {
  const marcar = () => cabecera.classList.toggle('con-borde', window.scrollY > 8);
  marcar();
  addEventListener('scroll', marcar, { passive: true });
}

// Las pupilas de los ojos siguen el puntero
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer: fine)').matches) {
  const pupilas = [...document.querySelectorAll('svg .pupil')].map(p => {
    const ojo = p.previousElementSibling;
    const ox = +ojo.getAttribute('cx'), oy = +ojo.getAttribute('cy'), r = +ojo.getAttribute('r');
    return { p, ojo, bx: +p.getAttribute('cx') - ox, by: +p.getAttribute('cy') - oy, max: r * 0.2 };
  });
  let px = 0, py = 0, pendiente = false;
  const mover = () => {
    pendiente = false;
    for (const o of pupilas) {
      const r = o.ojo.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || r.width === 0) continue;
      const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 240) * o.max;
      o.p.style.transform = `translate(${dx / d * k - o.bx}px, ${dy / d * k - o.by}px)`;
    }
  };
  addEventListener('pointermove', e => {
    px = e.clientX; py = e.clientY;
    if (!pendiente) { pendiente = true; requestAnimationFrame(mover); }
  }, { passive: true });
}
