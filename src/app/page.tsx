
"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { videos as initialVideos, type Video } from '@/lib/placeholder-videos';
import VideoPost, { SplashScreen } from '@/components/video-post';
import { Loader2, ArrowDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: Video[]) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Create a copy to avoid mutating the original

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray;
};

const PRELOAD_AHEAD_COUNT = 2;
const PULL_TO_REFRESH_THRESHOLD = 70; // pixels
const LOAD_MORE_THRESHOLD = 5; // Load more videos when user is 5 videos away from the end

export default function ReelFeedPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isSplashOpen, setIsSplashOpen] = useState(false);

  // Pull to refresh state
  const [touchStartY, setTouchStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenSplash = () => setIsSplashOpen(true);
  const handleCloseSplash = () => setIsSplashOpen(false);

  const shuffleVideos = useCallback(() => {
    setIsRefreshing(true);
    // Simulate a network request for a better user experience
    setTimeout(() => {
      const shuffled = shuffleArray(initialVideos);
      setVideos(shuffled);
      if (shuffled.length > 0) {
        setCurrentVideoId(shuffled[0].id);
        // Ensure scroll position is reset
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
      }
      setIsRefreshing(false);
      setPullDistance(0);
    }, 500);
  }, []);

  useEffect(() => {
    // Initial shuffle on client-side render
    shuffleVideos();
  }, [shuffleVideos]);

  const currentVideoIndex = useMemo(() => {
    if (currentVideoId === null) return -1;
    return videos.findIndex(v => v.id === currentVideoId);
  }, [currentVideoId, videos]);

  useEffect(() => {
    if (currentVideoIndex !== -1 && videos.length - currentVideoIndex <= LOAD_MORE_THRESHOLD) {
      setVideos(prevVideos => [...prevVideos, ...shuffleArray(initialVideos)]);
    }
  }, [currentVideoIndex, videos.length]);

  useEffect(() => {
    if (videos.length === 0) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoId = parseInt(entry.target.getAttribute('data-video-id') || '0', 10);
            setCurrentVideoId(videoId);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    const { current: currentObserver } = observer;
    const videoElements = containerRef.current?.children;

    if (videoElements) {
      // We start from child 1 because child 0 is the refresh indicator
      for (let i = 1; i < videoElements.length; i++) {
        const el = videoElements[i];
        if (el instanceof HTMLElement) {
          currentObserver?.observe(el);
        }
      }
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [videos]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const getPreloadStrategy = (index: number) => {
    if (currentVideoIndex === -1) {
      return index < PRELOAD_AHEAD_COUNT ? 'auto' : 'metadata';
    }
    const distance = Math.abs(index - currentVideoIndex);
    if (distance === 0) return 'auto';
    if (distance > 0 && distance <= PRELOAD_AHEAD_COUNT) return 'auto';
    return 'metadata';
  };

  // Pull to refresh handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (containerRef.current?.scrollTop === 0 && !isSplashOpen) {
      setTouchStartY(e.targetTouches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === 0 || isSplashOpen) return;

    const currentTouchY = e.targetTouches[0].clientY;
    const distance = currentTouchY - touchStartY;

    if (distance > 0) { // Only track downward pulls
      e.preventDefault(); // Prevent browser's default pull-to-refresh
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY === 0 || isSplashOpen) return;

    if (pullDistance > PULL_TO_REFRESH_THRESHOLD) {
      shuffleVideos();
    } else {
      setPullDistance(0);
    }
    setTouchStartY(0);
  };


  return (
    <div className="h-full w-full relative bg-black">
      <SplashScreen isOpen={isSplashOpen} onClose={handleCloseSplash} />

      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-center h-16 z-20 pointer-events-none">
        <div className="flex-grow flex justify-center pointer-events-auto">
          <button onClick={handleOpenSplash}>
            <Logo className="w-auto h-16" fill="white"/>
          </button>
        </div>
      </div>
      
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center text-white transition-opacity duration-300 z-10"
        style={{ 
          height: `${PULL_TO_REFRESH_THRESHOLD}px`,
          transform: `translateY(${Math.min(pullDistance, PULL_TO_REFRESH_THRESHOLD) - PULL_TO_REFRESH_THRESHOLD}px)`,
          opacity: isRefreshing ? 1 : Math.min(pullDistance / PULL_TO_REFRESH_THRESHOLD, 1)
        }}
      >
        {isRefreshing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1">
             <ArrowDown className="h-5 w-5 transition-transform" style={{ transform: pullDistance > PULL_TO_REFRESH_THRESHOLD ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
             <span className="text-xs font-medium">{pullDistance > PULL_TO_REFRESH_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}</span>
          </div>
        )}
      </div>

      <main 
        ref={containerRef} 
        className={cn("h-full w-full snap-y snap-mandatory", isSplashOpen ? "overflow-hidden" : "overflow-y-scroll")}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // Prevents overscroll effects like browser refresh on desktop
        style={{ overscrollBehavior: 'contain' }}
      >
        {videos.map((video, index) => (
          <section 
            key={`${video.id}-${index}`} 
            data-video-id={video.id}
            className="h-full w-full flex-shrink-0 snap-start snap-always"
          >
            <VideoPost 
              video={video} 
              isVisible={video.id === currentVideoId && index === currentVideoIndex}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              preload={getPreloadStrategy(index)}
              onOpenSplash={handleOpenSplash}
              isSplashOpen={isSplashOpen}
            />
          </section>
        ))}
      </main>
    </div>
  );
}

    
