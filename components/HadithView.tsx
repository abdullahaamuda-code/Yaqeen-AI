
import React from 'react';

interface HadithViewProps {
  url: string;
}

const HadithView: React.FC<HadithViewProps> = ({ url }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950">
      <div className="flex-grow relative">
        <iframe 
          src={url}
          className="absolute inset-0 w-full h-full border-none"
          title="Hadith View"
        />
      </div>
    </div>
  );
};

export default HadithView;
