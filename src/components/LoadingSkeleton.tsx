import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="weather-loading-skeleton" className="w-full space-y-6 animate-pulse">
      {/* Current weather card skeleton */}
      <div className="h-64 sm:h-72 w-full rounded-3xl frosted-glass p-6 sm:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-28 bg-white/[0.08] rounded-full" />
            <div className="h-8 w-48 bg-white/[0.08] rounded-lg" />
            <div className="h-4 w-32 bg-white/[0.08] rounded-full" />
          </div>
          <div className="h-16 w-16 bg-white/[0.08] rounded-2xl" />
        </div>
        <div className="flex items-baseline gap-6">
          <div className="h-14 w-36 bg-white/[0.08] rounded-xl" />
          <div className="h-6 w-24 bg-white/[0.08] rounded-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="h-8 bg-white/[0.06] rounded-lg" />
          <div className="h-8 bg-white/[0.06] rounded-lg" />
          <div className="h-8 bg-white/[0.06] rounded-lg" />
          <div className="h-8 bg-white/[0.06] rounded-lg" />
        </div>
      </div>

      {/* 7-day forecast grid skeleton */}
      <div>
        <div className="h-5 w-36 bg-white/[0.08] rounded-md mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-44 frosted-glass rounded-2xl p-3 flex flex-col items-center justify-between">
              <div className="h-4 w-12 bg-white/[0.08] rounded-full" />
              <div className="h-8 w-8 bg-white/[0.08] rounded-full my-2" />
              <div className="h-4 w-16 bg-white/[0.08] rounded-md" />
              <div className="h-3 w-10 bg-white/[0.08] rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart and Planning side-by-side / stacked skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 frosted-glass rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="h-5 w-48 bg-white/[0.08] rounded-md" />
            <div className="h-4 w-28 bg-white/[0.08] rounded-full" />
          </div>
          <div className="h-52 bg-white/[0.05] rounded-2xl" />
        </div>
        <div className="h-80 frosted-glass rounded-3xl p-6 space-y-4">
          <div className="h-5 w-40 bg-white/[0.08] rounded-md" />
          <div className="h-20 bg-white/[0.05] rounded-2xl" />
          <div className="h-20 bg-white/[0.05] rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
