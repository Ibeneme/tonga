import { useState, useEffect, useCallback } from 'react';
import heroTonga from '@/assets/hero-tonga.jpg';
import scooter1 from '@/assets/scooter-1.jpeg';
import scooterFiki from '@/assets/scooter-fiki.jpeg';
import scooterHeilala from '@/assets/scooter-heilala.jpeg';
import scooterJane from '@/assets/scooter-jane.jpeg';

const images = [
  heroTonga,
  scooter1,
  scooterFiki,
  scooterHeilala,
  scooterJane,
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={image} 
            alt={`Scooter rental Tonga ${index + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary-foreground w-6' 
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
