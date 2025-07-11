import React, { useEffect, useRef, useState, memo } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

const Image: React.FC<ImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  placeholder,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 85
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (imageRef.current && loading === 'lazy' && !priority) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, [loading, priority]);

  const generateSrcSet = (url: string): string => {
    const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
    return widths
      .map((w) => {
        const qualityParam = quality < 100 ? `&q=${quality}` : '';
        return `${url}?format=webp&width=${w}${qualityParam} ${w}w`;
      })
      .join(', ');
  };

  const baseClasses = 'lazy-image transition-opacity duration-300';
  const loadedClass = isLoaded ? 'loaded opacity-100' : 'opacity-0';

  return (
    <div 
      className={`${baseClasses} ${className}`} 
      style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
    >
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-load"
          aria-hidden="true"
          width={width}
          height={height}
        />
      )}
      <picture>
        <source 
          type="image/avif" 
          srcSet={src.replace('format=webp', 'format=avif')} 
          sizes={sizes} 
        />
        <source 
          type="image/webp" 
          srcSet={generateSrcSet(src)} 
          sizes={sizes} 
        />
        <img
          ref={imageRef}
          src={priority || loading === 'eager' ? src : undefined}
          data-src={!priority && loading === 'lazy' ? src : undefined}
          width={width}
          height={height}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover ${loadedClass}`}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          sizes={sizes}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.src === nextProps.src &&
    prevProps.alt === nextProps.alt &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className &&
    prevProps.loading === nextProps.loading &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.sizes === nextProps.sizes &&
    prevProps.priority === nextProps.priority &&
    prevProps.quality === nextProps.quality
  );
});

Image.displayName = 'Image';

export default Image;