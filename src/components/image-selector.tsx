'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface ImageSelectorProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  figurePrefix?: string;
  captionText?: string;
}

export function ImageSelector({
  images,
  onImagesChange,
  maxImages = 3,
  figurePrefix = '1.',
  captionText = 'Image',
}: ImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target?.result as string;
        if (editingIndex !== null) {
          // Replace existing image
          const updatedImages = [...images];
          updatedImages[editingIndex] = newImage;
          onImagesChange(updatedImages);
          setEditingIndex(null);
        } else {
          // Add new image
          onImagesChange([...images, newImage]);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddClick = () => {
    setEditingIndex(null);
    fileInputRef.current?.click();
  };

  const handleImageClick = (index: number) => {
    setEditingIndex(index);
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the image click
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <div className="my-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div key={index} className="group relative text-center">
            <button
              onClick={() => handleImageClick(index)}
              className="w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Image src={src} alt={`Attachment image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
            </button>
             <button
                onClick={(e) => handleRemoveImage(index, e)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
            >
                <X className="w-4 h-4" />
            </button>
            <p className="text-sm text-muted-foreground mt-2 italic">
              Figure {figurePrefix}{index + 1}: {captionText}
            </p>
          </div>
        ))}
        {images.length < maxImages && (
          <div className="text-center">
             <button
                onClick={handleAddClick}
                className="w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Add new image"
            >
                <Plus className="w-8 h-8" />
                <span>Add Image</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
