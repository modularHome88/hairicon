import React from 'react';
import type { HairstyleLook } from '../types';
import saveAs from 'file-saver';
// Note: In a real project, you would install jszip: npm install jszip
import JSZip from 'jszip';


const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


interface GalleryItemProps {
  look: HairstyleLook;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ look }) => {
    const handleDownload = () => {
        saveAs(look.imageUrl, `${look.label.replace(/\s+/g, '-')}.png`);
    };

    return (
        <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl">
            <img src={look.imageUrl} alt={look.alt} className="w-full h-auto object-cover aspect-[3/4]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                <h4 className="font-bold text-lg">{look.label}</h4>
                <p className="text-sm opacity-90">{look.note}</p>
            </div>
            <button
                onClick={handleDownload}
                title="Download Image"
                className="absolute top-2 right-2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
            >
                <DownloadIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


interface GalleryProps {
  title: string;
  looks: HairstyleLook[];
}

const Gallery: React.FC<GalleryProps> = ({ title, looks }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
      {looks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((look) => (
            <GalleryItem key={look.id} look={look} />
          ))}
        </div>
       ) : (
         <div className="text-center py-10 px-6 bg-gray-100 rounded-lg">
           <p className="text-gray-500">Could not generate hairstyles for this category. Please try again.</p>
         </div>
       )}
    </div>
  );
};


interface ResultsDisplayProps {
  naturalLooks: HairstyleLook[];
  glamorousLooks: HairstyleLook[];
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ naturalLooks, glamorousLooks, onReset }) => {
  const [isZipping, setIsZipping] = React.useState(false);
  const allLooks = [...naturalLooks, ...glamorousLooks];

  const handleDownloadAll = async () => {
    if (isZipping) return;
    setIsZipping(true);
    
    const zip = new JSZip();
    const naturalFolder = zip.folder('natural-looks');
    const glamorousFolder = zip.folder('glamorous-looks');

    const downloadPromises = allLooks.map(async (look) => {
        const response = await fetch(look.imageUrl);
        const blob = await response.blob();
        const folder = naturalLooks.includes(look) ? naturalFolder : glamorousFolder;
        folder?.file(`${look.label.replace(/\s+/g, '-')}.png`, blob);
    });

    try {
        await Promise.all(downloadPromises);
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'hairstyle-studio-looks.zip');
    } catch (error) {
        console.error("Error creating ZIP file:", error);
    } finally {
        setIsZipping(false);
    }
  };


  return (
    <div className="w-full">
        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800">Your Virtual Styles</h2>
            <p className="mt-2 text-lg text-gray-600">Explore your new looks below. Click any image to download.</p>
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={onReset}
                    className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-300"
                >
                    Start Over
                </button>
                 <button
                    onClick={handleDownloadAll}
                    disabled={isZipping || allLooks.length === 0}
                    className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-wait flex items-center gap-2"
                >
                    <DownloadIcon className="w-5 h-5" />
                    {isZipping ? 'Zipping...' : 'Download All (.zip)'}
                </button>
            </div>
        </div>

      <Gallery title="Natural & Everyday Looks" looks={naturalLooks} />
      <Gallery title="Glamorous & Evening Looks" looks={glamorousLooks} />
    </div>
  );
};