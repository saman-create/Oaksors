import { useEffect, useRef } from "react";
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import "./FloatingLines.css";

type Wave = "top" | "middle" | "bottom";
type WavePosition = { x: number; y: number; rotate: number };

type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Wave[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
};

const vertexShader = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform float animationSpeed;
uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;
uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;
uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;
uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;
uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;
uniform bool parallax;
uniform vec2 parallaxOffset;
uniform vec3 lineGradient[8];
uniform int lineGradientCount;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 getLineColor(float t) {
  if (lineGradientCount <= 0) return vec3(0.12, 0.72, 0.58);
  if (lineGradientCount == 1) return lineGradient[0] * 0.7;
  float scaled = clamp(t, 0.0, 0.9999) * float(lineGradientCount - 1);
  int index = int(floor(scaled));
  int nextIndex = min(index + 1, lineGradientCount - 1);
  return mix(lineGradient[index], lineGradient[nextIndex], fract(scaled)) * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv) {
  float time = iTime * animationSpeed;
  float amplitude = sin(offset + time * 0.2) * 0.3;
  float y = sin(uv.x + offset + time * 0.1) * amplitude;
  if (interactive) {
    vec2 delta = screenUv - mouseUv;
    float influence = exp(-dot(delta, delta) * bendRadius);
    y += (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
  }
  return 0.0175 / max(abs(uv.y - y) + 0.01, 0.001) + 0.01;
}

void main() {
  vec2 baseUv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  if (parallax) baseUv += parallaxOffset;

  vec2 mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
  mouseUv.y *= -1.0;
  vec3 color = vec3(0.0);

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec2 uv = baseUv * rotate(bottomWavePosition.z * log(length(baseUv) + 1.0));
      color += getLineColor(t) * wave(
        uv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi, baseUv, mouseUv
      ) * 0.2;
    }
  }
  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec2 uv = baseUv * rotate(middleWavePosition.z * log(length(baseUv) + 1.0));
      color += getLineColor(t) * wave(
        uv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi, baseUv, mouseUv
      );
    }
  }
  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec2 uv = baseUv * rotate(topWavePosition.z * log(length(baseUv) + 1.0));
      uv.x *= -1.0;
      color += getLineColor(t) * wave(
        uv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi, baseUv, mouseUv
      ) * 0.1;
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVector(hex: string) {
  const value = hex.trim().replace(/^#/, "");
  const normalized = value.length === 3
    ? value.split("").map((character) => character.repeat(2)).join("")
    : value;
  const parsed = Number.parseInt(normalized, 16);
  if (Number.isNaN(parsed)) return new Vector3(1, 1, 1);
  return new Vector3(
    ((parsed >> 16) & 255) / 255,
    ((parsed >> 8) & 255) / 255,
    (parsed & 255) / 255,
  );
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = "screen",
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return;
    }

    const waveValue = (value: number | number[], wave: Wave, fallback: number) => {
      if (typeof value === "number") return value;
      return value[enabledWaves.indexOf(wave)] ?? fallback;
    };
    const isEnabled = (wave: Wave) => enabledWaves.includes(wave);
    const counts = {
      top: isEnabled("top") ? waveValue(lineCount, "top", 6) : 0,
      middle: isEnabled("middle") ? waveValue(lineCount, "middle", 6) : 0,
      bottom: isEnabled("bottom") ? waveValue(lineCount, "bottom", 6) : 0,
    };
    const distances = {
      top: waveValue(lineDistance, "top", 5) * 0.01,
      middle: waveValue(lineDistance, "middle", 5) * 0.01,
      bottom: waveValue(lineDistance, "bottom", 5) * 0.01,
    };

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const gradient = Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1));
    linesGradient?.slice(0, MAX_GRADIENT_STOPS).forEach((color, index) => {
      gradient[index].copy(hexToVector(color));
    });

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      enableTop: { value: isEnabled("top") },
      enableMiddle: { value: isEnabled("middle") },
      enableBottom: { value: isEnabled("bottom") },
      topLineCount: { value: counts.top },
      middleLineCount: { value: counts.middle },
      bottomLineCount: { value: counts.bottom },
      topLineDistance: { value: distances.top },
      middleLineDistance: { value: distances.middle },
      bottomLineDistance: { value: distances.bottom },
      topWavePosition: { value: new Vector3(topWavePosition?.x ?? 10, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4) },
      middleWavePosition: { value: new Vector3(middleWavePosition?.x ?? 5, middleWavePosition?.y ?? 0, middleWavePosition?.rotate ?? 0.2) },
      bottomWavePosition: { value: new Vector3(bottomWavePosition.x, bottomWavePosition.y, bottomWavePosition.rotate) },
      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },
      parallax: { value: parallax },
      parallaxOffset: { value: new Vector2(0, 0) },
      lineGradient: { value: gradient },
      lineGradientCount: { value: Math.min(linesGradient?.length ?? 0, MAX_GRADIENT_STOPS) },
    };

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const setSize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
    };
    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    const targetMouse = new Vector2(-1000, -1000);
    const currentMouse = new Vector2(-1000, -1000);
    const targetParallax = new Vector2();
    const currentParallax = new Vector2();
    let targetInfluence = 0;
    let currentInfluence = 0;

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const pixelRatio = renderer.getPixelRatio();
      targetMouse.set(x * pixelRatio, (rect.height - y) * pixelRatio);
      targetInfluence = 1;
      targetParallax.set(
        ((x - rect.width / 2) / rect.width) * parallaxStrength,
        (-(y - rect.height / 2) / rect.height) * parallaxStrength,
      );
    };
    const onPointerLeave = () => {
      targetInfluence = 0;
    };
    if (interactive) {
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    }

    const startedAt = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const render = () => {
      uniforms.iTime.value = reduceMotion ? 0 : (performance.now() - startedAt) * 0.001;
      currentMouse.lerp(targetMouse, mouseDamping);
      uniforms.iMouse.value.copy(currentMouse);
      currentInfluence += (targetInfluence - currentInfluence) * mouseDamping;
      uniforms.bendInfluence.value = currentInfluence;
      currentParallax.lerp(targetParallax, mouseDamping);
      uniforms.parallaxOffset.value.copy(currentParallax);
      renderer.render(scene, camera);
      if (!reduceMotion) frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [
    animationSpeed,
    bendRadius,
    bendStrength,
    bottomWavePosition,
    enabledWaves,
    interactive,
    lineCount,
    lineDistance,
    linesGradient,
    middleWavePosition,
    mouseDamping,
    parallax,
    parallaxStrength,
    topWavePosition,
  ]);

  return (
    <div
      ref={containerRef}
      className="floating-lines-container"
      style={{ mixBlendMode }}
      aria-hidden="true"
    />
  );
}
