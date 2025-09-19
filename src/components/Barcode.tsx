import React, { useMemo } from 'react';

const Barcode: React.FC = () => {
  const bars = useMemo(() => {
    const generatedBars = [];
    let currentX = 4;
    while (currentX < 276) {
      const width = Math.floor(Math.random() * 3) + 1; // width 1, 2, or 3
      generatedBars.push({ x: currentX, width });
      const gap = Math.floor(Math.random() * 3) + 2; // gap 2, 3, or 4
      currentX += width + gap;
    }
    return generatedBars;
  }, []);

  return (
    <div className="bg-white/[.19] rounded-lg p-1.5 w-full h-12">
      <svg viewBox="0 0 280 40" className="w-full h-full">
        <defs>
          <clipPath id="barcode-clip">
            <rect x="0" y="0" width="280" height="40" rx="6" />
          </clipPath>
        </defs>
        <g clipPath="url(#barcode-clip)">
          {bars.map((bar, i) => (
            <rect
              key={i}
              x={bar.x}
              y="0"
              width={bar.width}
              height="40"
              fill="#F7B733"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default Barcode;
