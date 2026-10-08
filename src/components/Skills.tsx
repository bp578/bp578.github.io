"use client";

import { useEffect, useRef, useState } from "react";
import { skills, type Skill } from "@/data/site";

// Bubble diameters (px) at full scale.
const DIAMETER = { lg: 150, md: 75, sm: 30 } as const;

// Motion
const FRICTION = 0.98; // velocity kept per 60fps frame
const BOUNCE = 0.8; // restitution for walls and collisions
const MAX_SPEED = 40; // px per frame
const REST_SPEED = 0.02;
const PACK_GAP = 6;

// Size changes (fractions are of the bubble's base radius)
const HOLD_DELAY = 200; // ms held still before shrinking starts
const HOLD_SLOP = 8; // px the pointer may wander and still count as holding
const SHRINK_RATE = 0.6; // per second
const SHRINK_POP = 0.3; // pops at this size
const TAP_MAX_MS = 250;
const TAP_GROWTH = 0.2; // per tap
const MAX_GROWTH = 4; // pops at this size
const RELAX_DELAY = 4000; // ms after the last tap/release before returning to base size
const RESPAWN_DELAY = 4000;
const POP_PUSH = 28; // px per frame at the popped bubble's edge

type Bubble = { skill: Skill; diameter: number; color: string };

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number; // current radius
  goal: number; // radius r eases toward
  base: number; // resting radius
  touchedAt: number;
  poppedAt: number | null;
};

type Drag = {
  index: number;
  pointerId: number;
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  downAt: number;
  downX: number;
  downY: number;
  holdAt: number;
  holdX: number;
  holdY: number;
};

const bubbles: Bubble[] = skills.map((skill) => ({
  skill,
  diameter: DIAMETER[skill.size],
  color: skill.color,
}));

/** Push two overlapping bodies apart, weighted by inverse mass. */
function separate(a: Body, b: Body, ia: number, ib: number, gap = 0) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let dist = Math.hypot(dx, dy);
  if (dist === 0) {
    dx = 0.01;
    dy = 0;
    dist = 0.01;
  }
  const overlap = a.r + b.r + gap - dist;
  if (overlap <= 0 || ia + ib === 0) return null;
  const nx = dx / dist;
  const ny = dy / dist;
  const corr = overlap / (ia + ib);
  a.x -= nx * corr * ia;
  a.y -= ny * corr * ia;
  b.x += nx * corr * ib;
  b.y += ny * corr * ib;
  return { nx, ny };
}

/** Pack every bubble into a tight circular cluster around (cx, cy). */
function pack(cx: number, cy: number, scale: number): Body[] {
  // Golden-angle spiral: earlier (larger) bubbles start nearest the center.
  const bodies = bubbles.map((b, i) => {
    const angle = i * 2.39996;
    const dist = 40 * scale * Math.sqrt(i);
    const r = (b.diameter * scale) / 2;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: 0,
      vy: 0,
      r,
      goal: r,
      base: r,
      touchedAt: 0,
      poppedAt: null,
    };
  });
  for (let iter = 0; iter < 300; iter++) {
    for (const b of bodies) {
      b.x += (cx - b.x) * 0.02;
      b.y += (cy - b.y) * 0.02;
    }
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        separate(bodies[i], bodies[j], 1, 1, PACK_GAP * scale);
      }
    }
  }
  return bodies;
}

/** One-shot burst effect: an expanding ring plus a few droplets. */
function burst(container: HTMLElement, b: Body, color: string) {
  const el = document.createElement("div");
  el.className = "bubble-burst";
  el.style.left = `${b.x}px`;
  el.style.top = `${b.y}px`;
  el.style.setProperty("--burst-color", color);
  el.style.setProperty("--burst-size", `${b.r * 2}px`);
  for (let i = 0; i < 8; i++) {
    const drop = document.createElement("span");
    const angle = (i / 8) * Math.PI * 2;
    drop.style.setProperty("--dx", `${Math.cos(angle) * b.r * 1.6}px`);
    drop.style.setProperty("--dy", `${Math.sin(angle) * b.r * 1.6}px`);
    el.appendChild(drop);
  }
  container.appendChild(el);
  setTimeout(() => el.remove(), 600);
}

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const size = useRef({ w: 0, h: 0 });
  const drag = useRef<Drag | null>(null);
  const wake = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let last = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const render = () => {
      bodies.current.forEach((b, i) => {
        const el = bubbleRefs.current[i];
        if (!el) return;
        const hidden = b.poppedAt !== null || b.r < 1;
        el.style.visibility = hidden ? "hidden" : "";
        if (hidden) return;
        el.style.width = el.style.height = `${b.r * 2}px`;
        el.style.fontSize = `${b.r}px`;
        el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
      });
    };

    const keepInside = (b: Body) => {
      const { w, h } = size.current;
      if (b.x < b.r) {
        b.x = b.r;
        b.vx = Math.abs(b.vx) * BOUNCE;
      } else if (b.x > w - b.r) {
        b.x = w - b.r;
        b.vx = -Math.abs(b.vx) * BOUNCE;
      }
      if (b.y < b.r) {
        b.y = b.r;
        b.vy = Math.abs(b.vy) * BOUNCE;
      } else if (b.y > h - b.r) {
        b.y = h - b.r;
        b.vy = -Math.abs(b.vy) * BOUNCE;
      }
    };

    const maxRadius = (b: Body) => {
      const { w, h } = size.current;
      return Math.min(b.base * MAX_GROWTH, Math.min(w, h) * 0.3);
    };

    const pop = (index: number, now: number, push: boolean) => {
      const all = bodies.current;
      const b = all[index];
      burst(container, b, bubbles[index].color);

      if (push) {
        const reach = b.r * 3;
        all.forEach((o, j) => {
          if (j === index || o.poppedAt !== null) return;
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const falloff = 1 - Math.max(0, dist - b.r - o.r) / reach;
          if (falloff <= 0) return;
          o.vx += (dx / dist) * POP_PUSH * falloff;
          o.vy += (dy / dist) * POP_PUSH * falloff;
        });
      }

      if (drag.current?.index === index) {
        delete bubbleRefs.current[index]?.dataset.dragging;
        drag.current = null;
      }
      b.poppedAt = now;
      b.vx = b.vy = 0;
      const timer = setTimeout(() => {
        timers.delete(timer);
        wake.current();
      }, RESPAWN_DELAY);
      timers.add(timer);
    };

    /** Advance the simulation; returns whether anything is still changing. */
    const step = (dt: number, now: number) => {
      const all = bodies.current;
      const d = drag.current;
      const friction = Math.pow(FRICTION, dt);
      let active = d !== null;

      all.forEach((b, i) => {
        if (b.poppedAt !== null) {
          if (now - b.poppedAt < RESPAWN_DELAY) return;
          // Respawn: regrow from nothing where it popped.
          b.poppedAt = null;
          b.r = 0;
          b.goal = b.base;
          b.touchedAt = 0;
        }

        // Size: shrink while held still, otherwise relax back to base.
        if (d?.index === i && now - d.holdAt > HOLD_DELAY) {
          b.goal -= b.base * SHRINK_RATE * (dt / 60);
          b.touchedAt = now;
        } else if (d?.index !== i && now - b.touchedAt > RELAX_DELAY) {
          b.goal += (b.base - b.goal) * Math.min(1, 0.05 * dt);
        }
        b.r += (b.goal - b.r) * Math.min(1, 0.3 * dt);
        if (Math.abs(b.goal - b.r) > 0.1 || Math.abs(b.goal - b.base) > 0.1) {
          active = true;
        }

        if (b.r <= b.base * SHRINK_POP) {
          pop(i, now, false);
          return;
        }
        if (b.r >= maxRadius(b) * 0.97) {
          pop(i, now, true);
          return;
        }

        if (drag.current?.index === i) {
          // Dragged bubble follows the pointer; its velocity carries into a throw.
          b.vx = (d!.tx - b.x) / dt;
          b.vy = (d!.ty - b.y) / dt;
          b.x = d!.tx;
          b.y = d!.ty;
        } else {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.vx *= friction;
          b.vy *= friction;
        }
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > MAX_SPEED) {
          b.vx *= MAX_SPEED / speed;
          b.vy *= MAX_SPEED / speed;
        }
      });

      const dragged = drag.current?.index;
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          const a = all[i];
          const b = all[j];
          if (a.poppedAt !== null || b.poppedAt !== null) continue;
          // Mass ~ area; the dragged bubble is immovable.
          const ia = dragged === i ? 0 : 1 / Math.max(a.r * a.r, 1);
          const ib = dragged === j ? 0 : 1 / Math.max(b.r * b.r, 1);
          const n = separate(a, b, ia, ib);
          if (!n) continue;
          const rel = (b.vx - a.vx) * n.nx + (b.vy - a.vy) * n.ny;
          if (rel >= 0) continue;
          const impulse = (-(1 + BOUNCE) * rel) / (ia + ib);
          a.vx -= impulse * n.nx * ia;
          a.vy -= impulse * n.ny * ia;
          b.vx += impulse * n.nx * ib;
          b.vy += impulse * n.ny * ib;
        }
      }

      for (const b of all) {
        if (b.poppedAt !== null) continue;
        keepInside(b);
        if (Math.hypot(b.vx, b.vy) > REST_SPEED) active = true;
      }
      return active;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / (1000 / 60), 2) || 1;
      last = now;
      const active = step(dt, now);
      render();
      raf = active ? requestAnimationFrame(tick) : 0;
    };

    wake.current = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // Re-pack whenever the container width changes.
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (w === size.current.w && bodies.current.length) {
        size.current.h = h;
        bodies.current.forEach(keepInside);
        render();
        return;
      }
      size.current = { w, h };
      const scale = Math.min(1, w / 560);
      bodies.current = pack(w / 2, h / 2, scale);
      bodies.current.forEach(keepInside);
      render();
      setReady(true);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  const pointerPos = (e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (index: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const b = bodies.current[index];
    if (!b || b.poppedAt !== null || drag.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "true";
    const p = pointerPos(e);
    const now = performance.now();
    drag.current = {
      index,
      pointerId: e.pointerId,
      ox: p.x - b.x,
      oy: p.y - b.y,
      tx: b.x,
      ty: b.y,
      downAt: now,
      downX: p.x,
      downY: p.y,
      holdAt: now,
      holdX: p.x,
      holdY: p.y,
    };
    wake.current();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const b = bodies.current[d.index];
    const { w, h } = size.current;
    const p = pointerPos(e);
    d.tx = Math.min(Math.max(p.x - d.ox, b.r), w - b.r);
    d.ty = Math.min(Math.max(p.y - d.oy, b.r), h - b.r);
    // Moving restarts the hold countdown from the new spot.
    if (Math.hypot(p.x - d.holdX, p.y - d.holdY) > HOLD_SLOP) {
      d.holdAt = performance.now();
      d.holdX = p.x;
      d.holdY = p.y;
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d?.pointerId !== e.pointerId) return;
    delete e.currentTarget.dataset.dragging;
    drag.current = null;

    const b = bodies.current[d.index];
    const now = performance.now();
    const p = pointerPos(e);
    const isTap =
      e.type === "pointerup" &&
      now - d.downAt < TAP_MAX_MS &&
      Math.hypot(p.x - d.downX, p.y - d.downY) < HOLD_SLOP;
    if (isTap) b.goal += b.base * TAP_GROWTH;
    b.touchedAt = now;
    wake.current();
  };

  return (
    <section id="skills" className="px-6 py-16 sm:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-navy-900 sm:text-7xl">
          Skills
        </h2>
        <p className="mt-6 text-base text-navy-400 sm:text-lg">
          Grab a bubble and give it a toss. Tap fast to pump one up, or hold
          it to let the air out.
        </p>

        <ul className="sr-only">
          {skills.map((s) => (
            <li key={s.name}>{s.name}</li>
          ))}
        </ul>

        <div
          ref={containerRef}
          className="relative mt-8 h-[420px] rounded-2xl border border-navy-100 bg-navy-50 sm:h-[560px]"
        >
          {bubbles.map(({ skill, color }, i) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                aria-hidden
                onPointerDown={onPointerDown(i)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{ backgroundColor: color }}
                className={`group absolute left-0 top-0 flex cursor-grab touch-none select-none items-center justify-center rounded-full shadow-md transition-[opacity,box-shadow] duration-300 hover:z-10 hover:shadow-xl data-[dragging=true]:z-20 data-[dragging=true]:cursor-grabbing data-[dragging=true]:shadow-xl ${
                  ready ? "opacity-100" : "opacity-0"
                }`}
              >
                <Icon size="1em" color={skill.iconColor} className="pointer-events-none" />
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-900 px-2.5 py-1 text-sm font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-data-[dragging=true]:opacity-100">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
