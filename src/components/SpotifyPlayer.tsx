import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SpotifyPlayerProps {
  onSongChange: (songIndex: number) => void;
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

export const SpotifyPlayer = ({ onSongChange }: SpotifyPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    onSongChange(currentSong);
  }, [currentSong, onSongChange]);

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
      <div className="fixed top-20 right-4 z-40 bg-card/95 backdrop-blur-md rounded-lg shadow-luxury border border-border p-4 w-80 animate-fade-in">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-leather-dark to-leather-medium rounded flex items-center justify-center">
          <span className="text-white text-xl">♪</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{playlist[currentSong].title}</p>
          <p className="text-xs text-muted-foreground truncate">{playlist[currentSong].artist}</p>
        </div>
      </div>

      <div className="w-full bg-muted h-1 rounded-full mb-3">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center space-x-4 mb-3">
        <Button variant="ghost" size="icon" onClick={handlePrevious}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          size="icon" 
          onClick={handlePlayPause}
          className="bg-primary hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleNext}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
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
