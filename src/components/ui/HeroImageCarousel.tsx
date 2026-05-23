import { useEffect, useState } from "react";

export interface CarouselImage {
  src: string;
  alt: string;
  /** Optional label to show as a fading overlay (e.g. project name) */
  label?: string;
  /** Optional sublabel rendered above the label (e.g. location, in primary color) */
  sublabel?: string;
}

interface HeroImageCarouselProps {
  images: CarouselImage[];
  /** Time between slides in ms. */
  interval?: number;
  /** Show small dot indicators bottom-right. */
  showDots?: boolean;
  /** Render per-slide label/sublabel overlay at bottom-left. */
  showLabels?: boolean;
  /** Render an internal darkening gradient for text legibility over the images. */
  showGradient?: boolean;
}

/**
 * Cinematic image carousel with crossfade + continuous Ken Burns motion.
 * Pause-on-hover so users can dwell on a slide.
 */
export function HeroImageCarousel({
  images,
  interval = 5000,
  showDots = true,
  showLabels = false,
  showGradient = false,
}: HeroImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [images.length, interval, paused]);

  if (images.length === 0) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={`ken-burns absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {showGradient && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      )}

      {showLabels && (
        <div className="pointer-events-none absolute inset-0">
          {images.map((img, i) => (
            <div
              key={i}
              className={`absolute bottom-6 left-6 right-20 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {img.sublabel && (
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  {img.sublabel}
                </p>
              )}
              {img.label && (
                <p className="font-display text-2xl text-white leading-tight">
                  {img.label}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Imagen ${i + 1} de ${images.length}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
