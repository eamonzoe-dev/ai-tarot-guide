"use client";

import { memo, useEffect, useId, useRef, type HTMLAttributes } from "react";

import "./DotField.css";

const TWO_PI = Math.PI * 2;

type Dot = {
  anchorX: number;
  anchorY: number;
  softX: number;
  softY: number;
};

type DotFieldProps = HTMLAttributes<HTMLDivElement> & {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  interactive?: boolean;
  paused?: boolean;
  maxDevicePixelRatio?: number;
};

function DotFieldComponent({
  dotRadius = 1.2,
  dotSpacing = 24,
  cursorRadius = 0,
  cursorForce = 0,
  bulgeStrength = 24,
  glowRadius = 96,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(138, 106, 47, 0.28)",
  gradientTo = "rgba(191, 167, 106, 0.18)",
  glowColor = "rgba(28, 22, 12, 0.18)",
  interactive = false,
  paused = false,
  maxDevicePixelRatio = 1.5,
  ...rest
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<SVGCircleElement | null>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    previousX: -9999,
    previousY: -9999,
    speed: 0,
  });
  const sizeRef = useRef({ width: 0, height: 0, offsetX: 0, offsetY: 0 });
  const frameRef = useRef(0);
  const resizeTimerRef = useRef<number | undefined>(undefined);
  const glowId = useId();

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const glowElement = glowRef.current;
    const containerElement = canvasElement?.parentElement;

    if (!canvasElement || !containerElement) {
      return;
    }

    const canvas = canvasElement;
    const container = containerElement;

    const canvasContext = canvas.getContext("2d", { alpha: true });

    if (!canvasContext) {
      return;
    }

    const context = canvasContext;
    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      maxDevicePixelRatio,
    );
    let animationFrame = 0;
    let frameCount = 0;
    let engagement = 0;
    let glowOpacity = 0;

    function buildDots(width: number, height: number) {
      const step = dotRadius + dotSpacing;
      const columns = Math.max(Math.floor(width / step), 1);
      const rows = Math.max(Math.floor(height / step), 1);
      const padX = (width % step) / 2;
      const padY = (height % step) / 2;
      const dots: Dot[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const anchorX = padX + column * step + step / 2;
          const anchorY = padY + row * step + step / 2;

          dots.push({
            anchorX,
            anchorY,
            softX: anchorX,
            softY: anchorY,
          });
        }
      }

      dotsRef.current = dots;
    }

    function resize() {
      window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(() => {
        const rect = container.getBoundingClientRect();
        const width = Math.max(rect.width, 1);
        const height = Math.max(rect.height, 1);

        canvas.width = Math.round(width * devicePixelRatio);
        canvas.height = Math.round(height * devicePixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

        sizeRef.current = {
          width,
          height,
          offsetX: rect.left + window.scrollX,
          offsetY: rect.top + window.scrollY,
        };

        buildDots(width, height);
        draw();
      }, 80);
    }

    function handlePointerMove(event: PointerEvent) {
      const size = sizeRef.current;

      mouseRef.current.x = event.pageX - size.offsetX;
      mouseRef.current.y = event.pageY - size.offsetY;
    }

    function handlePointerLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.previousX = -9999;
      mouseRef.current.previousY = -9999;
      mouseRef.current.speed = 0;
    }

    function updateMouseSpeed() {
      const mouse = mouseRef.current;
      const deltaX = mouse.previousX - mouse.x;
      const deltaY = mouse.previousY - mouse.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      mouse.speed += (distance - mouse.speed) * 0.35;

      if (mouse.speed < 0.001) {
        mouse.speed = 0;
      }

      mouse.previousX = mouse.x;
      mouse.previousY = mouse.y;
    }

    function draw() {
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const { width, height } = sizeRef.current;
      const hasInteraction = interactive && cursorRadius > 0 && !paused;
      const animationTime = frameCount * 0.02;
      const targetEngagement = hasInteraction
        ? Math.min(mouse.speed / 5, 1)
        : 0;

      engagement += (targetEngagement - engagement) * 0.06;

      if (engagement < 0.001) {
        engagement = 0;
      }

      glowOpacity += (engagement - glowOpacity) * 0.08;

      if (glowElement) {
        glowElement.setAttribute("cx", String(mouse.x));
        glowElement.setAttribute("cy", String(mouse.y));
        glowElement.style.opacity = String(glowOpacity);
      }

      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, gradientFrom);
      gradient.addColorStop(1, gradientTo);
      context.fillStyle = gradient;
      context.beginPath();

      const cursorRadiusSquared = cursorRadius * cursorRadius;
      const renderRadius = dotRadius / 2;

      for (let index = 0; index < dots.length; index += 1) {
        const dot = dots[index];
        const deltaX = mouse.x - dot.anchorX;
        const deltaY = mouse.y - dot.anchorY;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;

        if (hasInteraction && distanceSquared < cursorRadiusSquared) {
          const distance = Math.sqrt(distanceSquared);
          const falloff = 1 - distance / cursorRadius;
          const push =
            falloff * falloff * bulgeStrength * engagement * cursorForce;
          const angle = Math.atan2(deltaY, deltaX);

          dot.softX +=
            (dot.anchorX - Math.cos(angle) * push - dot.softX) * 0.15;
          dot.softY +=
            (dot.anchorY - Math.sin(angle) * push - dot.softY) * 0.15;
        } else {
          dot.softX += (dot.anchorX - dot.softX) * 0.1;
          dot.softY += (dot.anchorY - dot.softY) * 0.1;
        }

        let drawX = dot.softX;
        let drawY = dot.softY;

        if (!paused && waveAmplitude > 0) {
          drawY += Math.sin(dot.anchorX * 0.03 + animationTime) * waveAmplitude;
          drawX +=
            Math.cos(dot.anchorY * 0.03 + animationTime * 0.7) *
            waveAmplitude *
            0.5;
        }

        const sparkleScale =
          !paused && sparkle && ((index * 2654435761) ^ (frameCount >> 3)) % 100 < 2
            ? 1.55
            : 1;
        const radius = renderRadius * sparkleScale;

        context.moveTo(drawX + radius, drawY);
        context.arc(drawX, drawY, radius, 0, TWO_PI);
      }

      context.fill();
    }

    function tick() {
      frameCount += 1;
      updateMouseSpeed();
      draw();

      if (!paused && (interactive || waveAmplitude > 0 || sparkle)) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (interactive && cursorRadius > 0) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave);
    }

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(resizeTimerRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [
    bulgeStrength,
    cursorForce,
    cursorRadius,
    dotRadius,
    dotSpacing,
    glowRadius,
    gradientFrom,
    gradientTo,
    interactive,
    maxDevicePixelRatio,
    paused,
    sparkle,
    waveAmplitude,
  ]);

  return (
    <div className="dot-field-container" {...rest}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          fill={`url(#${glowId})`}
          r={glowRadius}
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
}

export const DotField = memo(DotFieldComponent);
