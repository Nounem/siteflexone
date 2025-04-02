import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  value: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number | [number, number]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className
}) => {
  const isRange = Array.isArray(value);
  const [localValue, setLocalValue] = useState<number | [number, number]>(value);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newValue = min + percent * (max - min);
    const snappedValue = Math.round(newValue / step) * step;
    const limitedValue = Math.max(min, Math.min(max, snappedValue));
    
    if (isRange) {
      const [minVal, maxVal] = localValue as [number, number];
      // Determine which handle to move based on distance
      const distToMin = Math.abs(limitedValue - minVal);
      const distToMax = Math.abs(limitedValue - maxVal);
      
      if (distToMin <= distToMax) {
        if (limitedValue <= maxVal) {
          const newRangeValue: [number, number] = [limitedValue, maxVal];
          setLocalValue(newRangeValue);
          if (onValueChange) onValueChange(newRangeValue);
        }
      } else {
        if (limitedValue >= minVal) {
          const newRangeValue: [number, number] = [minVal, limitedValue];
          setLocalValue(newRangeValue);
          if (onValueChange) onValueChange(newRangeValue);
        }
      }
    } else {
      setLocalValue(limitedValue);
      if (onValueChange) onValueChange(limitedValue);
    }
  };

  const getPositionFromValue = (val: number): string => {
    return `${((val - min) / (max - min)) * 100}%`;
  };

  const getTrackFillStyle = () => {
    if (isRange) {
      const [minVal, maxVal] = localValue as [number, number];
      const left = getPositionFromValue(minVal);
      const width = `calc(${getPositionFromValue(maxVal)} - ${left})`;
      return { left, width };
    } else {
      const width = getPositionFromValue(localValue as number);
      return { width };
    }
  };

  return (
    <div className={cn("relative h-5 flex items-center", className)}>
      <div
        ref={trackRef}
        className="h-1.5 w-full bg-gray-200 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        <div
          className="absolute h-1.5 bg-[#61dafb] rounded-full"
          style={getTrackFillStyle()}
        ></div>
      </div>

      {isRange ? (
        <>
          <button
            type="button"
            className={`absolute w-5 h-5 rounded-full bg-white border-2 border-[#002875] -ml-2.5 focus:outline-none focus:ring-2 focus:ring-[#61dafb] focus:ring-offset-2`}
            style={{ left: getPositionFromValue((localValue as [number, number])[0]) }}
            onMouseDown={() => setDragging('min')}
            aria-label="Minimum value"
          />
          <button
            type="button"
            className={`absolute w-5 h-5 rounded-full bg-white border-2 border-[#002875] -ml-2.5 focus:outline-none focus:ring-2 focus:ring-[#61dafb] focus:ring-offset-2`}
            style={{ left: getPositionFromValue((localValue as [number, number])[1]) }}
            onMouseDown={() => setDragging('max')}
            aria-label="Maximum value"
          />
        </>
      ) : (
        <button
          type="button"
          className={`absolute w-5 h-5 rounded-full bg-white border-2 border-[#002875] -ml-2.5 focus:outline-none focus:ring-2 focus:ring-[#61dafb] focus:ring-offset-2`}
          style={{ left: getPositionFromValue(localValue as number) }}
          aria-label="Slider value"
        />
      )}
    </div>
  );
};

export default Slider;