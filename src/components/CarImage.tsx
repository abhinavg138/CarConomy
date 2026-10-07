import React, { useState } from 'react';
import { Car as CarIcon, AlertCircle } from 'lucide-react';
import { Vehicle } from '../types';

interface CarImageProps {
  vehicle: Vehicle;
  angle?: 'hero' | 'front' | 'rear' | 'side' | 'interior';
  className?: string;
  imageClassName?: string;
  alt?: string;
  priority?: boolean;
  showBadge?: boolean;
  aspectRatio?: 'video' | 'wide' | 'square' | 'auto';
  fit?: 'cover' | 'contain';
}

export const CarImage: React.FC<CarImageProps> = ({
  vehicle,
  angle = 'hero',
  className = '',
  imageClassName = '',
  alt,
  priority = false,
  showBadge = false,
  aspectRatio = 'auto',
  fit = 'cover',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Resolve image from structured vehicle images or fallback hero image
  const resolvedSrc = 
    vehicle.images?.[angle] || 
    vehicle.images?.hero || 
    vehicle.image;

  const altText = alt || `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}`;

  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'wide' ? 'aspect-[16/10]' :
    aspectRatio === 'square' ? 'aspect-square' : '';

  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

  // Honest, intentional fallback if image fails or is unavailable
  if (!resolvedSrc || hasError) {
    return (
      <div 
        className={`relative w-full h-full min-h-[140px] rounded-2xl bg-gradient-to-b from-[#141922] to-[#0A0D12] border border-white/10 flex flex-col items-center justify-center p-4 text-center ${aspectClass} ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-2">
          <CarIcon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <span className="text-xs font-bold text-white tracking-wide">
          {vehicle.make} {vehicle.model}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono-numbers mt-0.5">
          {vehicle.generation ? `${vehicle.generation} • ` : ''}Verified Image Unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectClass} ${className}`}>
      {/* Skeleton / Low-contrast background while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#141922] to-[#0D1016] animate-pulse" />
      )}

      <img
        src={resolvedSrc}
        alt={altText}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-300 ${fitClass} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imageClassName}`}
      />

      {/* Verified Model & Generation Badge */}
      {showBadge && vehicle.generation && (
        <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-bold text-zinc-300 tracking-wider uppercase font-mono-numbers">
          {vehicle.make} {vehicle.generation}
        </div>
      )}
    </div>
  );
};
