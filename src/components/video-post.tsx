
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Heart, MessageCircle, Send, Bookmark, Loader2, Play, Pause, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Video } from '@/lib/placeholder-videos';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ThankYouImage } from '@/components/thank-you-for-slopping-with-us';

interface VideoPostProps {
  video: Video;
  isVisible: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  preload: 'auto' | 'metadata' | 'none';
  onOpenSplash: () => void;
  isSplashOpen: boolean;
}

const mediumDarkColors = [
  'bg-blue-600 hover:bg-blue-700',
  'bg-green-600 hover:bg-green-700',
  'bg-purple-600 hover:bg-purple-700',
  'bg-red-600 hover:bg-red-600',
  'bg-indigo-600 hover:bg-indigo-700',
  'bg-pink-600 hover:bg-pink-700',
  'bg-teal-600 hover:bg-teal-700',
  'bg-orange-600 hover:bg-orange-700',
];

const callToActionTexts = [
  "Learn more",
  "Shop now",
  "Get offer",
  "Sign up",
  "Shop the deal",
  "Claim offer"
];

const VerifiedBadge = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="1em" height="1em" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
     <path d="m84.656 35.656c-1.625-3.9062 0.875-12-3.7188-16.594-4.4688-4.4688-12.938-2.2188-16.594-3.7188-3.6875-1.5312-7.6562-9.0938-14.344-9.0938s-10.688 7.5625-14.344 9.0938c-3.9062 1.625-11.969-0.875-16.594 3.7188-4.5625 4.5625-2.1562 12.812-3.7188 16.594-1.5312 3.6562-9.0938 7.6562-9.0938 14.344s7.5312 10.562 9.0938 14.344c1.625 3.9062-0.875 12 3.7188 16.594 4.4688 4.4688 12.938 2.2188 16.594 3.7188 3.6875 1.5312 7.6562 9.0938 14.344 9.0938s10.688-7.5625 14.344-9.0938c3.9062-1.625 11.969 0.875 16.594-3.7188 4.5625-4.5625 2.1562-12.812 3.7188-16.594 1.5312-3.6562 9.0938-7.6562 9.0938-14.344s-7.5312-10.562-9.0938-14.344zm-16.812 4.0625-21.875 21.875c-1.2188 1.2188-3.1875 1.2188-4.4062 0l-9.375-9.375c-1.2188-1.2188-1.2188-3.1875 0-4.4062s3.1875-1.2188 4.4062 0l7.1562 7.1562 19.656-19.656c1.2188-1.2188 3.1875-1.2188 4.4062 0s1.2188 3.1875 0 4.4062z" fill="#fff"/>
    </svg>
);


export const SplashScreen = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isInteractable, setIsInteractable] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsInteractable(true);
      }, 500); // Delay to prevent accidental clicks

      return () => clearTimeout(timer);
    } else {
      setIsInteractable(false); // Reset when closed
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300 ease-in-out',
        isOpen ? 'bg-black/80' : 'bg-transparent pointer-events-none'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-full max-w-[450px] bg-neutral-900 text-white transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 hover:text-white z-10"
          >
            <X size={24} />
          </Button>
        <div className="p-6 pt-12 relative overflow-y-auto h-full">

          <div className="flex justify-center mb-6 pt-2">
            <ThankYouImage className="w-full h-auto max-w-[300px]" />
          </div>

          <div className="space-y-4">
            <p className="text-base text-white">
              Now/instead, support these non-profits committed to making high-quality, human-created knowledge available to the world. Your contribution directly funds reliable human editing, ethical sharing tools, and a permanent public library — helping ensure accurate, trustworthy knowledge is accessible & free forever.
            </p>
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="font-semibold text-lg text-white">Wikimedia Foundation (Wikipedia)</h3>
                <p className="text-base text-neutral-300 mt-1">For reliable human editing and review and ad-free knowledge.</p>
                 <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold w-auto px-4 text-left mt-4" disabled={!isInteractable}>
                    <Link href="https://donate.wikimedia.org/" target="_blank">Donate</Link>
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Creative Commons (CC)</h3>
                <p className="text-base text-neutral-300 mt-1">For tools that enable ethical sharing and reuse of creative works. (donations are via classy.org)</p>
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold w-auto px-4 text-left mt-4" disabled={!isInteractable}>
                    <Link href="https://www.classy.org/give/313412/#!/donation/checkout" target="_blank">Donate</Link>
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">The Internet Archive</h3>
                <p className="text-base text-neutral-300 mt-1">For maintaining a permanent digital library and historical record.</p>
                 <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold w-auto px-4 text-left mt-4" disabled={!isInteractable}>
                    <Link href="https://archive.org/donate/" target="_blank">Donate</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const VideoPost: React.FC<VideoPostProps> = ({ video, isVisible, isMuted, onToggleMute, preload, onOpenSplash, isSplashOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const wasLongPress = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = isMuted;

  }, [isClient, isMuted]);

  useEffect(() => {
    if (!isClient) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('playing', handleCanPlay);
    
    if (videoElement.readyState >= 3) {
      setIsLoading(false);
    }

    if (isVisible && !isSplashOpen) {

      setIsPaused(false); 
      videoElement.play().catch(error => {
        console.error("Autoplay was prevented:", error);
        setIsPaused(true);
      });
      
    } else {
      videoElement.pause();
      if (isVisible) { // Only change loading state if the video is visible
          // Don't set isLoading to true when splash is open, just pause.
      } else {
          videoElement.currentTime = 0;
          setIsLoading(true);
      }
    }
    
    return () => {
        videoElement.removeEventListener('waiting', handleWaiting);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('playing', handleCanPlay);
    }

  }, [isClient, isVisible, isSplashOpen]);
  
  const handlePressStart = (e: React.TouchEvent<HTMLVideoElement> | React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    wasLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.pause();
        setIsPaused(true);
        setShowPauseIcon(true);
        wasLongPress.current = true;
      }
    }, 200);
  };

  const handlePressEnd = (e: React.TouchEvent<HTMLVideoElement> | React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    
    const videoElement = videoRef.current;
    if (videoElement && videoElement.paused && isPaused && !isSplashOpen) {
      // Only resume play if it was a long press that caused the pause
      if (wasLongPress.current) {
         videoElement.play();
         setIsPaused(false);
      }
      setShowPauseIcon(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    if (wasLongPress.current) {
      wasLongPress.current = false;
      return; 
    }
    onToggleMute();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleMute();
  };
  
  const handleButtonInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };
  
  const handleOpenSplash = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      onOpenSplash();
  }


  const avatarImage = PlaceHolderImages.find(img => img.id === video.avatar);

  const buttonColorClass = mediumDarkColors[video.id % mediumDarkColors.length];
  const buttonText = callToActionTexts[video.id % callToActionTexts.length];

  return (
    <div 
      className="h-full w-full relative flex items-center justify-center bg-black mx-auto max-w-[450px]"
    >
      
      {isClient && (
        <video
          ref={videoRef}
          src={video.src}
          loop
          playsInline
          className="h-full w-full object-cover"
          preload={preload}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onClick={handleClick}
        />
      )}

      {(isLoading && isVisible) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
      
      {(isPaused && isVisible && !isLoading && !showPauseIcon) && (
         <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
          <Play className="h-20 w-20 text-white/50" fill="white" />
        </div>
      )}

      {showPauseIcon && (
         <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none animate-out fade-out-0 duration-500">
          <Pause className="h-20 w-20 text-white/50" fill="white" />
        </div>
      )}

      <div 
        className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex items-end justify-between pointer-events-none bg-gradient-to-t from-black/60 to-transparent"
      >
        <div className="flex-grow text-white pr-4">
          <div className="flex items-center gap-2 pointer-events-auto">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={avatarImage?.imageUrl} alt={avatarImage?.description} data-ai-hint={avatarImage?.imageHint} />
              <AvatarFallback>{video.user.charAt(1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm">{video.user}</span>
            {video.isVerified && <VerifiedBadge className="h-4 w-4" fill="white" />}
            <Button
                variant="outline"
                className="text-white bg-transparent border-white/80 rounded-lg text-xs h-6 px-3 font-semibold hover:bg-white/20 hover:text-white"
                onClick={handleButtonInteraction}
            >
                Follow
            </Button>
          </div>
          
          <div className="mt-3 pointer-events-auto w-full">
            <Button 
              variant="secondary"
              className={cn(
                "w-full h-auto text-white text-sm transition-colors duration-500 justify-between rounded-lg px-4 py-3",
                buttonColorClass
              )}
              onClick={handleOpenSplash}
              onTouchStart={handleOpenSplash}
            >
              <span className="font-semibold">{buttonText}</span>
              <ChevronRight className="h-5 w-5 font-semibold" />
            </Button>
          </div>

          <p className="text-sm mt-3 font-light line-clamp-1">{video.description}</p>
          <p className="text-xs mt-2 font-semibold opacity-80">Sponsored</p>
        </div>

        <div 
          className="flex flex-col items-center gap-0 pointer-events-auto shrink-0 -mr-2"
          onClick={handleButtonInteraction}
          onTouchStart={handleButtonInteraction}
        >
          {[
            { icon: Heart, label: video.likes, name: 'Likes' },
            { icon: MessageCircle, label: video.comments, name: 'Comments' },
            { icon: Send, label: video.sends, name: 'Send' },
            { icon: Bookmark, label: null, name: 'Save' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-white">
              <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20 rounded-full h-14 w-14" aria-label={item.name}>
                <item.icon className="transform scale-125" />
              </Button>
              {item.label && <span className="text-[10px] font-bold -mt-2">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 pointer-events-auto">
        <Button onClick={handleToggleMute} variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 hover:text-white rounded-full" aria-label="Toggle mute">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoPost;
