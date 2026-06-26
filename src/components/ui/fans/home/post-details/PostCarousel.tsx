'use client';

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import SendGiftModal from "@/components/modals/fans/SendGiftModal";
import VideoPlayer from "@/components/shared/VideoPlayer";

interface PostCarouselProps {
  images: string[];
  title: string;
  authorId: string;
  video?: string;
}

export default function PostCarousel({ images, title, authorId, video }: PostCarouselProps) {
  /* Carousel setup — images first, then the video as the last slide */
  const imageCount = images?.length || 0;
  const mediaCount = imageCount + (video ? 1 : 0);
  const videoSlideIndex = video ? imageCount : -1;

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
          {mediaCount > 0 ? (
            <>
              {images?.map((img: string, idx: number) => (
                <div key={`img-${idx}`} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                  <div className="h-136.25 w-full relative">
                    <Image
                      src={getImageUrl(img)}
                      alt={`${title} - ${idx + 1}`}
                      fill
                      className="object-cover w-full h-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}

              {video && (
                <div key="video" className="embla__slide flex-[0_0_100%] min-w-0 relative">
                  <div className="h-136.25 w-full bg-black">
                    <VideoPlayer
                      src={getImageUrl(video) || ''}
                      fill
                      active={selectedIndex === videoSlideIndex}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="embla__slide flex-[0_0_100%] min-w-0 h-100 flex items-center justify-center text-gray-500">
              No media available
            </div>
          )}
        </div>
      </div>

      {/* Carousel Indicators */}
      {mediaCount > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {Array.from({ length: mediaCount }).map((_, idx: number) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all ${idx === selectedIndex ? 'bg-purple-500 w-6' : 'bg-white/20 w-2'
                }`}
            />
          ))}
        </div>
      )}

      <SendGiftModal authorId={authorId} />
    </div>
  );
}
