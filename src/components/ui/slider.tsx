import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../lib/utils.ts';

interface SliderProps {
  value: number | [number, number];
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number | [number, number]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  className,
}) => {
  const rangeRef = useRef<HTMLDivElement>(null);
  const thumbOneRef = useRef<HTMLDivElement>(null);
  const thumbTwoRef = useRef<HTMLDivElement>(null);
  const isRange = Array.isArray(value);

  const [isDragging, setIsDragging] = useState<'one' | 'two' | null>(null);
  const [internalValue, setInternalValue] = useState<number | [number, number]>(value);

  // Lorsque la valeur externe change, mettre à jour la valeur interne
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Convertir une valeur en pourcentage par rapport au min/max
  const valueToPercent = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // Convertir un pourcentage en valeur
  const percentToValue = (percent: number) => {
    const rawValue = min + (percent / 100) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  };

  // Gérer le début du glissement
  const handleMouseDown = (event: React.MouseEvent, thumb: 'one' | 'two') => {
    event.preventDefault();
    setIsDragging(thumb);
  };

  // Gérer le glissement
  useEffect(() => {
    if (!isDragging || !rangeRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = rangeRef.current!.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const percent = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
      const newValue = percentToValue(percent);

      if (isRange) {
        const [valueOne, valueTwo] = internalValue as [number, number];
        if (isDragging === 'one') {
          const clampedValue = Math.min(newValue, valueTwo);
          setInternalValue([clampedValue, valueTwo]);
          onValueChange([clampedValue, valueTwo]);
        } else {
          const clampedValue = Math.max(newValue, valueOne);
          setInternalValue([valueOne, clampedValue]);
          onValueChange([valueOne, clampedValue]);
        }
      } else {
        setInternalValue(newValue);
        onValueChange(newValue);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, internalValue, isRange, max, min, onValueChange, step]);

  // Calculer les pourcentages pour l'affichage
  const thumbOnePercent = isRange
    ? valueToPercent((internalValue as [number, number])[0])
    : valueToPercent(internalValue as number);
  
  const thumbTwoPercent = isRange
    ? valueToPercent((internalValue as [number, number])[1])
    : 0;

  const trackWidth = isRange
    ? thumbTwoPercent - thumbOnePercent
    : thumbOnePercent;

  const trackLeft = isRange ? thumbOnePercent : 0;

  return (
    <div 
      className={cn("relative w-full h-6 flex items-center", className)}
      ref={rangeRef}
    >
      {/* Piste d'arrière-plan */}
      <div className="absolute h-2 w-full bg-gray-200 rounded-full" />
      
      {/* Piste active */}
      <div 
        className="absolute h-2 bg-[#61dafb] rounded-full"
        style={{ 
          width: `${trackWidth}%`,
          left: `${trackLeft}%`
        }}
      />
      
      {/* Premier curseur */}
      <div
        ref={thumbOneRef}
        className={cn(
          "absolute w-4 h-4 bg-white border-2 border-[#61dafb] rounded-full shadow transform -translate-x-1/2 cursor-pointer hover:bg-[#61dafb] hover:border-[#002875]",
          isDragging === 'one' && "bg-[#61dafb] border-[#002875]"
        )}
        style={{ left: `${thumbOnePercent}%` }}
        onMouseDown={(e) => handleMouseDown(e, 'one')}
      />
      
      {/* Deuxième curseur (pour la plage) */}
      {isRange && (
        <div
          ref={thumbTwoRef}
          className={cn(
            "absolute w-4 h-4 bg-white border-2 border-[#61dafb] rounded-full shadow transform -translate-x-1/2 cursor-pointer hover:bg-[#61dafb] hover:border-[#002875]",
            isDragging === 'two' && "bg-[#61dafb] border-[#002875]"
          )}
          style={{ left: `${thumbTwoPercent}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'two')}
        />
      )}
    </div>
  );
};

export default Slider;