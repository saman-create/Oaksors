import { ButtonLink } from "@/components/ui/Button";
import { BrandPromise } from "@/components/common/BrandPromise";
import Scanner from "@/components/effects/Scanner";
import Hls from "hls.js";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const HERO_VIDEO_URL = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";
const SHOW_HERO_VERSION_SWITCHER = true;
const FloatingLines = lazy(() => import("@/components/effects/FloatingLines"));
const LineWaves = lazy(() => import("@/components/effects/LineWaves"));

export function HeroSection() {
  const [variant, setVariant] = useState<"original" | "v1" | "v2" | "v3">("original");
  const heroRef = useRef<HTMLElement>(null);
  const videoMotionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60 });
      hls.loadSource(HERO_VIDEO_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { void video.play().catch(() => undefined); });
      return () => hls.destroy();
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HERO_VIDEO_URL;
      video.addEventListener("loadedmetadata", () => { void video.play().catch(() => undefined); }, { once: true });
    }
  }, [variant]);

  useEffect(() => {
    const hero = heroRef.current;
    const motionLayer = videoMotionRef.current;
    if (!hero || !motionLayer) return;
    if (typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof window.matchMedia === "function"
      && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frameId: number | undefined;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const renderMotion = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      const hasSettled = Math.abs(targetX - currentX) <= 0.001
        && Math.abs(targetY - currentY) <= 0.001;
      if (hasSettled) {
        currentX = targetX;
        currentY = targetY;
      }

      const shiftX = currentX * 25.2;
      const shiftY = currentY * 14;
      const tiltX = currentY * -1.89;
      const tiltY = currentX * 2.1;

      motionLayer.style.transform = `perspective(1200px) translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg) scale(1.12)`;

      if (!hasSettled) {
        frameId = requestAnimationFrame(renderMotion);
      } else {
        frameId = undefined;
        motionLayer.style.willChange = "";
      }
    };

    const requestMotionFrame = () => {
      if (frameId !== undefined) return;
      motionLayer.style.willChange = "transform";
      frameId = requestAnimationFrame(renderMotion);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
      requestMotionFrame();
    };

    const resetMotion = () => {
      targetX = 0;
      targetY = 0;
      requestMotionFrame();
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", resetMotion);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", resetMotion);
      if (frameId !== undefined) cancelAnimationFrame(frameId);
      motionLayer.style.willChange = "";
    };
  }, [variant]);

  return (
    <section
      ref={heroRef}
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        padding: "0 0 60px",
      }}
    >
      {variant === "original" ? (
        <div
          ref={videoMotionRef}
          className="hero-video-motion-layer"
          data-testid="hero-video-motion-layer"
        >
          <video
            id="hero-video"
            ref={videoRef}
            data-testid="hero-original-background"
            className="hero-bg-video hero-bg-animate"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{ top: 36, height: "115%", objectPosition: "center top" }}
          />
        </div>
      ) : variant === "v1" ? (
        <div className="hero-effect-background" data-testid="hero-scanner-background">
          <Scanner
            color1="#06B6D4"
            color2="#10B981"
            color3="#FFFFFF"
            speed={1.55}
            sweepSpeed={0.15}
            sweepWidth={4}
            sweepFalloff={6}
            scale={1.0}
            frequency={2}
            ripple={0.15}
            bandDensity={8.5}
            lineSharpness={5.5}
            glow={0.54}
            scanDirection="diagonal"
            colorSpread={0.63}
            brightness={1.5}
            contrast={1.15}
            softness={1.4}
            vignette={0.45}
            scanline
            grain
            grainIntensity={0.05}
            opacity={1}
            mouseInteraction
            mouseRadius={1}
            mouseStrength={1.5}
          />
        </div>
      ) : variant === "v2" ? (
        <div className="hero-effect-background hero-effect-background--v2" data-testid="hero-floating-lines-background">
          <Suspense fallback={null}>
            <FloatingLines
              enabledWaves={["bottom", "top", "middle"]}
              lineCount={[10, 15, 20]}
              lineDistance={33}
              bendRadius={10.5}
              bendStrength={1}
              interactive
              parallax
              linesGradient={["#05666a", "#043022", "#026544"]}
            />
          </Suspense>
        </div>
      ) : (
        <div className="hero-effect-background" data-testid="hero-line-waves-background">
          <Suspense fallback={null}>
            <LineWaves
              speed={0.3}
              innerLineCount={10}
              outerLineCount={17}
              warpIntensity={0.7}
              rotation={45}
              edgeFadeWidth={0.15}
              colorCycleSpeed={1}
              brightness={0.2}
              color1="#10B981"
              color2="#06B6D4"
              color3="#027b53"
              enableMouseInteraction
              mouseInfluence={2}
            />
          </Suspense>
        </div>
      )}
      {/* Legacy video configuration kept for reference */}
      {/*
      <img
        src="/assets/images/hero-gold.png"
        alt="Gold bars and coins"
        className="hero-bg-animate"
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      */}
      {/* Hero Video Background (commented out â€” uncomment to restore video) */}
      {/*
      <video
        id="hero-video"
        class="hero-bg-animate"
        autoplay
        muted
        loop
        playsinline
        style="
          position: absolute;
          top: 36px;
          left: 0;
          width: 100%;
          height: 115%;
          object-fit: cover;
          object-position: center top;
          z-index: -1;
        "
      >
        <source data-src-config="heroVideo" type="video/mp4" />
      </video>
      */}
      {variant === "original" && (
        <img
          src="/assets/images/hero-gold-stack.png"
          alt="Gold bars and coins"
          className="hero-gold-stack"
        />
      )}
      {SHOW_HERO_VERSION_SWITCHER && (
        <div className="hero-version-switcher" role="group" aria-label="Hero version">
          <button
            type="button"
            aria-pressed={variant === "original"}
            onClick={() => setVariant("original")}
          >
            Original
          </button>
          <button
            type="button"
            aria-pressed={variant === "v1"}
            onClick={() => setVariant("v1")}
          >
            V1
          </button>
          <button
            type="button"
            aria-pressed={variant === "v2"}
            onClick={() => setVariant("v2")}
          >
            V2
          </button>
          <button
            type="button"
            aria-pressed={variant === "v3"}
            onClick={() => setVariant("v3")}
          >
            V3
          </button>
        </div>
      )}
      <div
        className="container hero-content-layer"
        style={{ position: "relative", zIndex: 10, width: "100%" }}
      >
        <div className="hero-content-copy" style={{ maxWidth: 800 }}>
          <BrandPromise />
          <h1
            className="hero-animate hero-animate-delay-1"
            style={{
              fontSize: "clamp(40px, 5.5vw, 72px)",
              lineHeight: "0.97",
              marginBottom: 20,
              fontWeight: 400,
              letterSpacing: "-0.04em",
              color: "#ffffff",
            }}
          >
            Roll over your IRA into precious metals.
          </h1>
          <p
            className="hero-animate hero-animate-delay-2"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: "clamp(16px, 1.2vw, 18px)",
              fontWeight: 400,
              marginBottom: 32,
              lineHeight: "1.45",
              color: "#d1d5db",
              maxWidth: 520,
            }}
          >
            Ask about our simple, tax- and penalty-free process for opening a
            new precious metals-backed IRA.
          </p>
          <div
            className="hero-animate hero-animate-delay-3"
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <ButtonLink href="/get-started-now/" size="lg" className="group">
              Get Started Now
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                className="icon-slide"
                style={{ marginLeft: 8 }}
              >
                <path
                  d="M4 10h12m0 0l-5-5m5 5l-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonLink>
            <ButtonLink href="#precious-metals" variant="ghost" size="lg">
              Explore Precious Metals
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
