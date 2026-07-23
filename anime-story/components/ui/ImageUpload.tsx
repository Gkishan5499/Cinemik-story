'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxSize?: number; // in MB
  preview?: boolean;
}

export default function ImageUpload({
  onImagesSelected,
  multiple = false,
  maxSize = 25,
  preview = true,
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    // Validate file size and type
    const validFiles = files.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} exceeds ${maxSize}MB limit`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError(`File ${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    let filesToSet = validFiles;
    if (!multiple && validFiles.length > 0) {
      filesToSet = [validFiles[0]];
    }

    setSelectedFiles(filesToSet);
    onImagesSelected(filesToSet);

    // Generate preview URLs
    if (preview) {
      const urls = filesToSet.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    onImagesSelected(newFiles);
  };

  return (
    <div className='w-full'>
      <div
        onClick={() => fileInputRef.current?.click()}
        className='border-2 border-dashed border-red-500 rounded-lg p-8 text-center cursor-pointer hover:bg-red-50/10 transition'
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple={multiple}
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
        />
        <div className='text-gray-400'>
          <p className='mb-2'>📸 Click to upload {multiple ? 'images' : 'an image'}</p>
          <p className='text-sm'>PNG, JPG, WEBP, GIF up to {maxSize}MB</p>
        </div>
      </div>

      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

      {preview && previewUrls.length > 0 && (
        <div className={`grid ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4 mt-4`}>
          {previewUrls.map((url, index) => (
            <div key={index} className='relative group'>
              <img
                src={url}
                alt={`Preview ${index}`}
                className='w-full h-40 object-cover rounded-lg'
              />
              <button
                onClick={() => handleRemoveFile(index)}
                className='absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition'
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <p className='text-sm text-gray-400 mt-2'>
          {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
