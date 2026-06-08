import React from 'react';

export default function WatermarkOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-40 flex flex-col justify-around items-center opacity-[0.14] dark:opacity-[0.10] p-4">
      {[...Array(8)].map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex justify-around w-full gap-4 transform -rotate-15 whitespace-nowrap"
        >
          {[...Array(4)].map((_, colIndex) => (
            <span 
              key={colIndex} 
              className="text-4xl font-black tracking-widest uppercase text-rose-600 dark:text-rose-500"
            >
              UNPAID DRAFT PREVIEW
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
