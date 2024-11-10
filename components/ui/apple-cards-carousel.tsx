"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: (index) => setCurrentIndex(index), currentIndex }}
    >
      <div className="relative w-full">
        {/* Main carousel container */}
        <div className="absolute w-full h-full">
          <div
            className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth no-scrollbar"
            ref={carouselRef}
            onScroll={checkScrollability}
          >
            <div className="flex gap-4 ">
              {items.map((item, index) => (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      delay: 0.1 * index,
                      ease: "easeOut",
                    },
                  }}
                  key={`card-${index}`}
                  className="flex-none"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="absolute right-4 bottom-4 flex gap-2 z-10">
          <button
            className={cn(
              "h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-opacity",
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-5 w-5 text-gray-800" />
          </button>
          <button
            className={cn(
              "h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-opacity",
              !canScrollRight && "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-5 w-5 text-gray-800" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative max-w-5xl mx-auto bg-white dark:bg-neutral-900 my-6 p-6 rounded-2xl"
            >
              <button
                className="absolute top-4 right-4 h-8 w-8 bg-black dark:bg-white rounded-full flex items-center justify-center"
                onClick={handleClose}
              >
                <IconX className="h-5 w-5 text-white dark:text-black" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium"
              >
                {card.category}
              </motion.p>
              <motion.h2
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-2xl font-semibold mt-2"
              >
                {card.title}
              </motion.h2>
              <div className="mt-6">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative h-40 w-32 md:h-48 md:w-48 rounded-xl overflow-hidden"
      >
        <Image
          src={card.src}
          alt={card.title}
          fill
          className="object-cover"
        />
      </motion.button>
    </>
  );
};