import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroTonga from '@/assets/hero-tonga.jpg';
import scooter1 from '@/assets/scooter-1.jpeg';
import scooterFiki from '@/assets/scooter-fiki.jpeg';
import scooterHeilala from '@/assets/scooter-heilala.jpeg';
import scooterJane from '@/assets/scooter-jane.jpeg';

const images = [
  { src: heroTonga },
  { src: scooter1 },
  { src: scooterFiki },
  { src: scooterHeilala },
  { src: scooterJane },
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      scale: 1.1,
      opacity: 0,
      x: direction > 0 ? '5%' : '-5%',
    }),
    center: {
      scale: 1,
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      scale: 1.05,
      opacity: 0,
      x: direction < 0 ? '5%' : '-5%',
    }),
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="absolute inset-0 flex items-center justify-center bg-foreground/20"
        >
          <img 
            src={images[currentIndex].src} 
            alt={`Scooter rental Tonga ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Slide indicators */}
      <div className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex 
                ? 'bg-primary-foreground' 
                : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
            }`}
            animate={{ width: index === currentIndex ? 24 : 8 }}
            transition={{ duration: 0.3 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
