
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import type { HairstyleLook, FaceShape, HairLength, AppState } from './types';
import { getHairstylePrompts } from './constants';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initial');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [naturalLooks, setNaturalLooks] = useState<HairstyleLook[]>([]);
  const [glamorousLooks, setGlamorousLooks] = useState<HairstyleLook[]>([]);

  const ai = useMemo(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      setError("API key is not configured. This app cannot generate images.");
      return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }, []);

  const handleReset = () => {
    setAppState('initial');
    setOriginalImage(null);
    setError(null);
    setNaturalLooks([]);
    setGlamorousLooks([]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const generateHairstyles = useCallback(async (imageFile: File, faceShape: FaceShape, hairLength: HairLength) => {
    if (!ai) {
        setError("Image generation service is not available.");
        setAppState('error');
        return;
    }

    setAppState('generating');
    setError(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const mimeType = imageFile.type;
      
      const { natural, glamorous } = getHairstylePrompts(faceShape, hairLength);

      const generateLook = async (promptData: { label: string; note: string; prompt: string }): Promise<HairstyleLook | null> => {
        try {
          const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
              parts: [
                {
                  inlineData: {
                    data: base64Image,
                    mimeType: mimeType,
                  },
                },
                {
                  text: promptData.prompt,
                },
              ],
            },
            config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
          });
          
          const imagePart = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
          if (imagePart && imagePart.inlineData) {
             const imageData = imagePart.inlineData;
             return {
                id: crypto.randomUUID(),
                imageUrl: `data:${imageData.mimeType};base64,${imageData.data}`,
                label: promptData.label,
                note: promptData.note,
                alt: `Hairstyle mockup: ${promptData.label}`
             };
          }
          return null;
        } catch (e) {
          console.error(`Error generating "${promptData.label}":`, e);
          return null; // Return null on failure to not break Promise.all
        }
      };

      const naturalPromises = natural.map(generateLook);
      const glamorousPromises = glamorous.map(generateLook);

      const naturalResults = (await Promise.all(naturalPromises)).filter((look): look is HairstyleLook => look !== null);
      const glamorousResults = (await Promise.all(glamorousPromises)).filter((look): look is HairstyleLook => look !== null);

      if (naturalResults.length === 0 && glamorousResults.length === 0) {
        throw new Error("Failed to generate any hairstyles. The service may be busy or an error occurred.");
      }
      
      setNaturalLooks(naturalResults);
      setGlamorousLooks(glamorousResults);
      setAppState('results');

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during hairstyle generation.';
      setError(errorMessage);
      setAppState('error');
    }
  }, [ai]);

  const renderContent = () => {
    switch (appState) {
      case 'initial':
      case 'image-selected':
        return <ImageUploader onGenerate={generateHairstyles} />;
      case 'generating':
        return <Loader />;
      case 'results':
        return <ResultsDisplay naturalLooks={naturalLooks} glamorousLooks={glamorousLooks} onReset={handleReset} />;
      case 'error':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
            <p className="text-gray-600 mb-6">{error || 'Something went wrong.'}</p>
            <button
              onClick={handleReset}
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
