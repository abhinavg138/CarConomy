import React, { useState } from 'react';
import { Camera, Sparkles, Layers } from 'lucide-react';
import { Vehicle } from '../types';
import { CarImage } from './CarImage';

interface CarPhotoViewerProps {
  vehicle: Vehicle;
  className?: string;
}

type PhotoAngle = 'hero' | 'side' | 'rear' | 'front';

export const CarPhotoViewer: React.FC<CarPhotoViewerProps> = ({
  vehicle,
  className = '',
}) => {
  const [activeAngle, setActiveAngle] = useState<PhotoAngle>('hero');

  // Available real photo angles for this vehicle
  const angles: { id: PhotoAngle; label: string }[] = [
    { id: 'hero', label: 'Perspective' },
    ...(vehicle.images?.side ? [{ id: 'side' as PhotoAngle, label: 'Profile' }] : []),
    ...(vehicle.images?.rear ? [{ id: 'rear' as PhotoAngle, label: 'Rear' }] : []),
    ...(vehicle.images?.front ? [{ id: 'front' as PhotoAngle, label: 'Front' }] : []),
  ];

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#131822] via-[#0E1219] to-[#0A0D12] shadow-2xl ${className}`}>
      {/* Real Vehicle Photography */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <CarImage
          vehicle={vehicle}
          angle={activeAngle}
          priority
          fit="cover"
          className="w-full h-full"
          imageClassName="object-center"
        />

        {/* Ambient subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-transparent to-black/30 pointer-events-none" />

        {/* Top Metadata Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-300">
          <Camera className="w-3 h-3 text-[#CCFF00]" />
          <span>{vehicle.make} {vehicle.generation || vehicle.model} Press Asset</span>
        </div>

        {/* Angle Selector Chips */}
        {angles.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-white/10">
            {angles.map((ang) => (
              <button
                key={ang.id}
                onClick={() => setActiveAngle(ang.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  activeAngle === ang.id
                    ? 'bg-[#CCFF00] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
