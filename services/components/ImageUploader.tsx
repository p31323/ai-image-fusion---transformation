
import React, { useRef, ChangeEvent } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageUploaderProps {
    id: string;
    onImageSelect: (file: File | null) => void;
    imagePreviewUrl: string | null;
    title: string;
    disabled?: boolean;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ id, onImageSelect, imagePreviewUrl, title, disabled = false }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguage();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelect(event.target.files[0]);
        }
    };
    
    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onImageSelect(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className="w-full">
            <span id={`${id}-label`} className={`block text-sm font-medium text-blue-200 mb-2 ${disabled ? 'text-blue-500' : ''}`}>{title}</span>
            <label 
                aria-labelledby={`${id}-label`}
                className={`relative group w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-center transition-colors ${disabled ? 'border-blue-800 bg-blue-900/30 cursor-not-allowed' : 'border-blue-700 hover:border-cyan-500 bg-blue-950/30 hover:bg-blue-900/50 cursor-pointer'}`}
            >
                {imagePreviewUrl ? (
                    <>
                        <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                         <button 
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
                            aria-label={t('removeImageAriaLabel')}
                         >
                            <XCircleIcon className="w-6 h-6" />
                         </button>
                    </>
                ) : (
                    <div className={`text-blue-400 ${disabled ? '' : 'group-hover:text-cyan-300'}`}>
                        <UploadIcon className="mx-auto h-12 w-12" />
                        <p>{t('uploadAction')}</p>
                    </div>
                )}
                 <input
                    ref={inputRef}
                    id={id}
                    name={id}
                    type="file"
                    className="sr-only"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    disabled={disabled}
                />
            </label>
        </div>
    );
};

export default ImageUploader;