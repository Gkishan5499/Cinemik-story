'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadInputProps {
  label: string;
  onImageUpload: (file: File, preview: string) => void;
  currentImage?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

export default function ImageUploadInput({
  label,
  onImageUpload,
  currentImage,
  aspectRatio = 'landscape',
}: ImageUploadInputProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsLoading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onImageUpload(file, previewUrl);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">
        {/* Preview */}
        <div
          className={`w-full ${aspectRatioClass} bg-gray-900 border border-red-500/30 rounded-lg overflow-hidden flex items-center justify-center mb-4`}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-400">No image selected</p>
            </div>
          )}
        </div>

        {/* Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {/* Upload Button */}
        <label className="block w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-center cursor-pointer font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Uploading...' : 'Choose Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      </div>

      {preview && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            onImageUpload(null as any, '');
          }}
          className="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          Clear Image
        </button>
      )}
    </div>
  );
}
