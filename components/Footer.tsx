
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
                <p className="text-sm">
                    <strong>Privacy Note:</strong> Your photos are processed securely and are not stored on our servers. 
                    All images are used only for the duration of your session to generate hairstyle mockups with your consent.
                </p>
                <p className="text-sm mt-2">
                    &copy; {new Date().getFullYear()} AI Hairstylist Studio. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
