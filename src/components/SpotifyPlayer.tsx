import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLocation } from 'react-router-dom';
import { productMusicMap, musicThemes } from '@/data/productMusicMap';

interface SpotifyPlayerProps {
  currentProductId?: string;
}

const playlist = [
  { 
    title: 'Western Sunset', 
    artist: 'The Ranch Band', 
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  { 
    title: 'Leather & Lace', 
    artist: 'Country Roads', 
    duration: 210,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  { 
    title: 'Silver Buckle Blues', 
    artist: 'Wyoming Riders', 
    duration: 195,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  { 
    title: 'Cowboy Dreams', 
    artist: 'Desert Soul', 
    duration: 225,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
];

export const SpotifyPlayer = ({ currentProductId }: SpotifyPlayerProps) => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(musicThemes[0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Change song based on product
  useEffect(() => {
    if (currentProductId && productMusicMap[currentProductId] !== undefined) {
      const newSong = productMusicMap[currentProductId];
      setCurrentSong(newSong);
      setCurrentTheme(musicThemes[newSong]);
    }
  }, [currentProductId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = playlist[currentSong].url;
    audio.volume = volume[0] / 100;
    
    if (isPlaying) {
      audio.play().catch(err => console.log('Playback prevented:', err));
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => console.log('Playback prevented:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    setCurrentTheme(musicThemes[currentSong]);
  }, [currentSong]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextSong = (currentSong + 1) % playlist.length;
    setCurrentSong(nextSong);
    setProgress(0);
  };

  const handlePrevious = () => {
    const prevSong = currentSong === 0 ? playlist.length - 1 : currentSong - 1;
    setCurrentSong(prevSong);
    setProgress(0);
  };

  return (
    <>
      <audio ref={audioRef} />
      <div 
        className="fixed top-20 right-4 z-40 bg-card/95 backdrop-blur-md rounded-lg shadow-luxury border border-border p-4 w-80 animate-fade-in transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, hsl(${currentTheme.primary}) 0%, hsl(${currentTheme.accent}) 100%)`,
          boxShadow: `0 10px 40px -10px hsl(${currentTheme.primary} / 0.5)`
        }}
      >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded flex items-center justify-center animate-pulse">
          <span className="text-white text-xl">♪</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-white">{playlist[currentSong].title}</p>
          <p className="text-xs text-white/80 truncate">{playlist[currentSong].artist}</p>
        </div>
      </div>

      <div className="w-full bg-white/20 h-1 rounded-full mb-3">
        <div 
          className="h-full bg-white rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center space-x-4 mb-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrevious}
          className="text-white hover:bg-white/20"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          onClick={handlePlayPause}
          className="bg-white text-primary hover:bg-white/90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext}
          className="text-white hover:bg-white/20"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4 text-white/80" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
      </div>
    </>
  );
};
