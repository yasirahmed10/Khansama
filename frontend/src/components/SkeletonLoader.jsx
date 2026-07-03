import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-dark-card border border-gold/10 rounded-2xl h-80 animate-pulse flex flex-col">
    <div className="bg-gray-800/40 h-40 rounded-t-2xl w-full"></div>
    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="bg-gray-800/40 h-3 w-16 rounded"></div>
          <div className="bg-gray-800/40 h-3 w-8 rounded"></div>
        </div>
        <div className="bg-gray-800/40 h-4 w-32 rounded"></div>
        <div className="bg-gray-800/40 h-3 w-full rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="bg-gray-800/40 h-8 flex-1 rounded-xl"></div>
        <div className="bg-gray-800/40 h-8 flex-1 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export const MenuSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const SectionSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center space-y-2">
      <div className="bg-gray-800/40 h-3 w-24 rounded mx-auto"></div>
      <div className="bg-gray-800/40 h-8 w-48 rounded mx-auto"></div>
    </div>
    <MenuSkeleton />
  </div>
);
