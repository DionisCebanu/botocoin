import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ImageGallery = ({ images, alt }) => {
    const [mainImageIndex, setMainImageIndex] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={mainImageIndex}
                        src={images[mainImageIndex]}
                        alt={alt}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setMainImageIndex(index)}
                            className={cn(
                                'aspect-square rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-orange focus:ring-offset-2',
                                mainImageIndex === index ? 'ring-2 ring-amber-orange ring-offset-2 scale-105' : 'opacity-70 hover:opacity-100'
                            )}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img src={img} alt={`${alt} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;