import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

interface CarouselProps {
  images: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  indicators?: boolean;
  className?: string;
  imageClassName?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 5000,
  indicators = true,
  className = '',
  imageClassName = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((curr) => (curr === images.length - 1 ? 0 : curr + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoSlide) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        nextSlide();
      }, autoSlideInterval);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [autoSlide, autoSlideInterval, currentIndex]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div 
        className="flex transition-transform duration-500 ease-out h-full" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={cn("w-full h-full object-cover", imageClassName)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x400?text=Image+non+disponible';
              }}
            />
          </div>
        ))}
      </div>

      {/* Boutons navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white text-primary p-2 rounded-full shadow-md"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white text-primary p-2 rounded-full shadow-md"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicateurs */}
      {indicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-secondary' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};