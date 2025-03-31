import React, { forwardRef } from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapOverlayProps {
  className?: string;
}

const MapOverlay = forwardRef<HTMLDivElement, MapOverlayProps>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="hidden bg-white rounded-md shadow-lg p-4 max-w-sm z-50 absolute transform -translate-x-1/2 -translate-y-full pointer-events-auto"
      style={{ 
        marginBottom: '15px',
        display: 'none' // Hidden by default
      }}
    >
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
      
      <div className="gymInfo">
        <h3 className="text-[#002875] font-semibold text-lg line-clamp-1 mb-1"></h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="gym-address"></span>
        </div>
        
        <div className="flex items-center mb-2 gym-rating">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="ml-1 text-sm"></span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3 gym-amenities">
          {/* Les équipements seront ajoutés dynamiquement */}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-[#002875] font-medium gym-price"></p>
          <Link 
            to=""
            className="bg-[#002875] text-white px-3 py-1 rounded hover:bg-opacity-90 text-sm gym-link"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
});

MapOverlay.displayName = 'MapOverlay';

export default MapOverlay;