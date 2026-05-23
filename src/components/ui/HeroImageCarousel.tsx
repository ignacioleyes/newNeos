import { useEffect, useState } from "react";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface HeroImageCarouselProps {
  images: CarouselImage[];
  /** Time between slides in ms. */
  interval?: number;
  /** Show small dot indicators bottom-right. */
  showDots?: boolean;
}

/**
 * Cinematic image carousel with crossfade + continuous Ken Burns motion.
 * Pause-on-hover so users can dwell on a slide.
 */
export function HeroImageCarousel({
  images,
  interval = 5000,
  showDots = true,
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
