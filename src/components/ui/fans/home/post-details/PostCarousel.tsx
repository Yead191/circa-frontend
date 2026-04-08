'use client';

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import SendGiftModal from "@/components/modals/fans/SendGiftModal";

interface PostCarouselProps {
  images: string[];
  title: string;
}

export default function PostCarousel({ images, title }: PostCarouselProps) {
  /* Carousel setup */
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group mb-4">
      <div className="rounded-xl overflow-hidden bg-[#1a1a24] embla" ref={emblaRef}>
        <div className="embla__container flex">
          {images && images.length > 0 ? (
            images.map((img: string, idx: number) => (
              <div key={idx} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                <div className="h-136.25 w-full relative">
                  <Image
                    src={getImageUrl(img)}
                    alt={`${title} - ${idx + 1}`}
                    fill
                    className="object-cover w-full h-full transition-all duration-300"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="embla__slide flex-[0_0_100%] min-w-0 h-[400px] flex items-center justify-center text-gray-500">
              No images available
            </div>
          )}
        </div>
      </div>

      {/* Carousel Indicators */}
      {images && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === selectedIndex ? 'bg-purple-500 w-6' : 'bg-white/20'
                }`}
            />
          ))}
        </div>
      )}

      <SendGiftModal />
    </div>
  );
}
