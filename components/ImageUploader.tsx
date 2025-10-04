
import React, { useState, useCallback, useRef } from 'react';
import type { FaceShape, HairLength } from '../types';

interface ImageUploaderProps {
  onGenerate: (imageFile: File, faceShape: FaceShape, hairLength: HairLength) => void;
}

const UploadIcon: React.FC = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onGenerate }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [faceShape, setFaceShape] = useState<FaceShape>('oval');
  const [hairLength, setHairLength] = useState<HairLength>('medium');
  const [consent, setConsent] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [resolutionWarning, setResolutionWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        setImageFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const img = new Image();
        img.onload = () => {
            if (img.width < 800 || img.height < 1000) {
                setResolutionWarning(`Low resolution (${img.width}x${img.height}). For best results, use an image at least 800x1000px.`);
            } else {
                setResolutionWarning(null);
            }
            URL.revokeObjectURL(url); // Clean up blob URL after loading
        };
        img.src = url;
        
    } else {
        setImageFile(null);
        setPreviewUrl(null);
    }
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileChange(e.dataTransfer.files[0]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile && consent) {
      onGenerate(imageFile, faceShape, hairLength);
    }
  };
  
  const isFormValid = imageFile && consent;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side: Upload & Preview */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">1. Upload Your Photo</h3>
            <p className="text-sm text-gray-500 mb-2">For best results, use a clear, front-facing portrait with your hair pulled back.</p>

            <div
                className={`mt-2 flex justify-center rounded-lg border-2 border-dashed ${isDragOver ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'} px-6 py-10 transition-colors`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {previewUrl ? (
                    <div className="text-center">
                        <img src={previewUrl} alt="Image preview" className="mx-auto max-h-60 rounded-md shadow-md" />
                        <button type="button" onClick={() => handleFileChange(null)} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                            Choose a different photo
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <UploadIcon />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} ref={fileInputRef} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                )}
            </div>
             {resolutionWarning && (
                <div className="mt-4 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                   <strong>Warning:</strong> {resolutionWarning}
                </div>
            )}
          </div>

          {/* Right Side: Options & Submit */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">2. Tell Us About You</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="face-shape" className="block text-sm font-medium leading-6 text-gray-900">Face Shape (approximated)</label>
                  <select id="face-shape" value={faceShape} onChange={(e) => setFaceShape(e.target.value as FaceShape)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="oval">Oval</option>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="heart">Heart</option>
                    <option value="diamond">Diamond</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hair-length" className="block text-sm font-medium leading-6 text-gray-900">Current Hair Length</label>
                  <select id="hair-length" value={hairLength} onChange={(e) => setHairLength(e.target.value as HairLength)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="short">Short (chin-length or shorter)</option>
                    <option value="medium">Medium (shoulder-length)</option>
                    <option value="long">Long (below shoulders)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Consent</h3>
                 <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="consent" className="font-medium text-gray-900">I consent to hairstyle mockups using my photo.</label>
                        <p className="text-gray-500">Your photo will be used only for this session to generate results and will not be stored.</p>
                    </div>
                </div>
            </div>
            
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 disabled:shadow-none"
            >
              Generate My Styles
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
