import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Search, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import { productMusicMap, musicThemes } from '@/data/productMusicMap';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpotifyPlayerProps {
  currentProductId?: string;
  hideOnHero?: boolean;
}

const playlist = [
  { 
    title: 'Western Sunset', 
    artist: 'The Ranch Band', 
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Country'
  },
  { 
    title: 'Leather & Lace', 
    artist: 'Country Roads', 
    duration: 210,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Western'
  },
  { 
    title: 'Silver Buckle Blues', 
    artist: 'Wyoming Riders', 
    duration: 195,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Blues'
  },
  { 
    title: 'Cowboy Dreams', 
    artist: 'Desert Soul', 
    duration: 225,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Folk'
  },
  { 
    title: 'Rodeo Nights', 
    artist: 'Prairie Stars', 
    duration: 200,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Country'
  },
  { 
    title: 'Sagebrush Serenade', 
    artist: 'The Wranglers', 
    duration: 215,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Western'
  },
  { 
    title: 'Dust Trail Blues', 
    artist: 'Canyon Echo', 
    duration: 190,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Blues'
  },
  { 
    title: 'Montana Skies', 
    artist: 'High Plains Drifters', 
    duration: 235,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Folk'
  },
];

export const EnhancedSpotifyPlayer = ({ currentProductId, hideOnHero = false }: SpotifyPlayerProps) => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(musicThemes[0]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    const themes = Object.values(musicThemes);
    setCurrentTheme(themes[currentSong % themes.length]);
  }, [currentSong]);

  // Detect if hero section is in viewport
  useEffect(() => {
    if (!hideOnHero || location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const heroSection = document.querySelector('section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => observer.disconnect();
  }, [location.pathname, hideOnHero]);

  if (hideOnHero && isHeroVisible && location.pathname === '/') {
    return <audio ref={audioRef} />;
  }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredPlaylist = playlist.filter(
    song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <audio ref={audioRef} />
      <div 
        className="fixed top-20 right-4 z-40 rounded-xl shadow-2xl border border-border transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, hsl(${currentTheme.primary}) 0%, hsl(${currentTheme.accent}) 100%)`,
          boxShadow: `0 10px 40px -10px hsl(${currentTheme.primary} / 0.5)`,
          width: showPlaylist ? '380px' : '320px'
        }}
      >
        <div className="bg-black/20 backdrop-blur-xl rounded-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <span className="text-white text-lg">♪</span>
              </div>
              <span className="text-white font-semibold text-sm">Wyoming Spur Radio</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                {showPlaylist ? <Play className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {showPlaylist ? (
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs..."
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Playlist */}
              <ScrollArea className="h-80">
                <div className="space-y-1 pr-4">
                  {filteredPlaylist.map((song, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentSong(playlist.indexOf(song));
                        setProgress(0);
                        if (!isPlaying) setIsPlaying(true);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        currentSong === playlist.indexOf(song)
                          ? 'bg-white/30'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <p className="text-white font-medium text-sm truncate">{song.title}</p>
                      <p className="text-white/70 text-xs truncate">{song.artist}</p>
                      <p className="text-white/50 text-xs">{song.genre} • {formatTime(song.duration)}</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Now Playing */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center animate-pulse">
                  <span className="text-white text-2xl">♪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-white">
                    {playlist[currentSong].title}
                  </p>
                  <p className="text-xs text-white/80 truncate">
                    {playlist[currentSong].artist}
                  </p>
                  <p className="text-xs text-white/60">
                    {playlist[currentSong].genre}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 mb-4">
                <div className="w-full bg-white/20 h-1.5 rounded-full">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <span>{formatTime((progress / 100) * playlist[currentSong].duration)}</span>
                  <span>{formatTime(playlist[currentSong].duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handlePrevious}
                  className="text-white hover:bg-white/20 h-10 w-10"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon" 
                  onClick={handlePlayPause}
                  className="bg-white text-primary hover:bg-white/90 h-12 w-12 rounded-full"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleNext}
                  className="text-white hover:bg-white/20 h-10 w-10"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-3">
                <Volume2 className="h-4 w-4 text-white/80" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-white/60 w-8 text-right">{volume[0]}%</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
