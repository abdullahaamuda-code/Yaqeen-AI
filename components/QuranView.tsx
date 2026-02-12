
import React from 'react';

interface QuranViewProps {
  url: string;
}

const QuranView: React.FC<QuranViewProps> = ({ url }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950">
      <div className="flex-grow relative">
        <iframe 
          src={url}
          className="absolute inset-0 w-full h-full border-none"
          title="Quran View"
          allow="geolocation"
        />
      </div>
    </div>
  );
};

export default QuranView;
