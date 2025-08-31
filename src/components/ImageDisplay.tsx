'use client';

interface ImageDisplayProps {
  imageUrl: string;
  alt?: string;
}

export function ImageDisplay({ imageUrl, alt = "Game image" }: ImageDisplayProps) {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999"%3EImage not available%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
    </div>
  );
}