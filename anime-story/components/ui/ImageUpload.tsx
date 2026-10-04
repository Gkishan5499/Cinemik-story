'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxSize?: number; // in MB
  preview?: boolean;
  label?: string;
}

// Client-side image optimizer for high-res images / comic panels over 8MB
async function optimizeImageFile(file: File): Promise<File> {
  // If file is GIF or under 8MB, don't re-compress
  if (file.type === 'image/gif' || file.size <= 8 * 1024 * 1024) {
    return file;
  }

  // Only optimize standard browser-decodable images
  if (
    !file.type.startsWith('image/') &&
    !/\.(jpe?g|png|webp|bmp|avif)$/i.test(file.name)
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Downscale if massive comic scan (> 3200px)
          const maxDim = 3200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                return resolve(file);
              }
              const newName = file.name.replace(/\.[^.]+$/, '.webp');
              const optimized = new File([blob], newName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(optimized);
            },
            'image/webp',
            0.88
          );
        } catch {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  onImagesSelected,
  multiple = false,
  maxSize = 10,
  preview = true,
  label,
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;
    setError('');

    // Check types and sizes
    const validRawFiles: File[] = [];
    for (const file of rawFiles) {
      const isImg =
        file.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|gif|bmp|svg|heic|avif)$/i.test(file.name);

      if (!isImg) {
        setError(`"${file.name}" is not a recognized image format.`);
        continue;
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(`"${file.name}" exceeds the ${maxSize}MB limit.`);
        continue;
      }

      validRawFiles.push(file);
    }

    if (validRawFiles.length === 0) return;

    let targetFiles = validRawFiles;
    if (!multiple) {
      targetFiles = [validRawFiles[0]];
    }

    // Optimize any file that is large
    setOptimizing(true);
    let finalFiles: File[] = [];
    try {
      finalFiles = await Promise.all(
        targetFiles.map((f) => optimizeImageFile(f))
      );
    } catch {
      finalFiles = targetFiles;
    } finally {
      setOptimizing(false);
    }

    const nextFiles = multiple ? [...selectedFiles, ...finalFiles] : finalFiles;
    setSelectedFiles(nextFiles);
    onImagesSelected(nextFiles);

    if (preview) {
      const urls = nextFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }

    // Reset input so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    onImagesSelected(newFiles);
  };

  return (
    <div className='w-full'>
      {/* Native clickable label ensures mobile touch opens file picker immediately */}
      <label className='border-2 border-dashed border-red-500/70 hover:border-red-400 rounded-lg p-6 sm:p-8 text-center cursor-pointer block bg-black/30 hover:bg-red-500/10 transition-all select-none'>
        <input
          ref={fileInputRef}
          type='file'
          multiple={multiple}
          accept='image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif'
          onChange={handleFileSelect}
          className='sr-only'
        />
        <div className='text-gray-300 pointer-events-none'>
          <p className='text-base font-semibold mb-1 text-white'>
            📸 {label || `Tap or click to upload ${multiple ? 'images / comic pages' : 'an image'}`}
          </p>
          <p className='text-xs text-gray-400 font-mono'>
            PNG, JPG, WEBP, GIF up to {maxSize}MB {multiple ? '· Multi-select supported' : ''}
          </p>
          {optimizing && (
            <p className='text-xs text-yellow-400 mt-2 animate-pulse font-mono'>
              Optimizing high-res image quality...
            </p>
          )}
        </div>
      </label>

      {error && (
        <div className='p-2.5 mt-2 rounded bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-mono'>
          {error}
        </div>
      )}

      {preview && previewUrls.length > 0 && (
        <div
          className={`grid ${
            multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 max-w-sm'
          } gap-3 mt-4`}
        >
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className='relative group rounded-lg overflow-hidden border border-white/20 bg-black/60 shadow-md aspect-square flex items-center justify-center'
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className='w-full h-full object-cover'
              />
              <span className='absolute bottom-1 left-1 bg-black/80 text-[10px] font-mono px-1.5 py-0.5 rounded text-white/80 pointer-events-none'>
                #{index + 1}
              </span>
              {/* Delete button: always visible or easily tappable on mobile */}
              <button
                type='button'
                onClick={(e) => handleRemoveFile(e, index)}
                aria-label={`Remove image ${index + 1}`}
                className='absolute top-2 right-2 w-7 h-7 bg-red-600/90 hover:bg-red-600 active:scale-95 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-all z-10'
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className='flex items-center justify-between mt-2 text-xs font-mono text-gray-400'>
          <span>
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </span>
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              setSelectedFiles([]);
              setPreviewUrls([]);
              onImagesSelected([]);
            }}
            className='text-red-400 hover:text-red-300 hover:underline uppercase text-[11px]'
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
