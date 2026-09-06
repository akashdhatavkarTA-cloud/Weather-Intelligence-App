import React from 'react';
import { History, Trash2, MapPin } from 'lucide-react';
import { GeoCity } from '../types';

interface SearchHistoryProps {
  history: GeoCity[];
  currentCity: GeoCity | null;
  onSelectCity: (city: GeoCity) => void;
  onClearHistory: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  currentCity,
  onSelectCity,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div id="search-history-container" className="flex flex-wrap items-center gap-2 mb-6 text-xs">
      <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
        <History className="w-3.5 h-3.5 text-sky-400" />
        <span>Recent:</span>
      </div>

      {history.map((city) => {
        const isCurrent = currentCity && currentCity.id === city.id;
        return (
          <button
            key={city.id}
            id={`recent-city-${city.id}`}
            type="button"
            onClick={() => onSelectCity(city)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
              isCurrent
                ? 'frosted-pill-active'
                : 'frosted-pill text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/[0.09]'
            }`}
          >
            <MapPin className={`w-3 h-3 ${isCurrent ? 'text-sky-300' : 'text-slate-500'}`} />
            <span className="font-medium">{city.name}</span>
            {city.country_code && (
              <span className="text-[10px] text-slate-400 uppercase">{city.country_code}</span>
            )}
          </button>
        );
      })}

      <button
        id="clear-history-button"
        type="button"
        onClick={onClearHistory}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-rose-300 frosted-pill hover:border-rose-500/30 rounded-full transition-colors ml-auto cursor-pointer"
        title="Reset stored search history"
      >
        <Trash2 className="w-3 h-3" />
        <span>Clear History</span>
      </button>
    </div>
  );
};
