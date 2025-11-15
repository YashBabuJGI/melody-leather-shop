import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Search, List, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import { productMusicMap, musicThemes } from '@/data/productMusicMap';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MinimizablePlayerProps {
  currentProductId?: string;
  hideOnHero?: boolean;
}

const playlist = [
  { 
    title: 'Western Sunset', 
    artist: 'The Ranch Band', 
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Country',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80'
  },
  { 
    title: 'Leather & Lace', 
    artist: 'Country Roads', 
    duration: 210,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Western',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80'
  },
  { 
    title: 'Silver Buckle Blues', 
    artist: 'Wyoming Riders', 
    duration: 195,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Blues',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80'
  },
  { 
    title: 'Cowboy Dreams', 
    artist: 'Desert Soul', 
    duration: 225,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Folk',
    cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80'
  },
  { 
    title: 'Rodeo Nights', 
    artist: 'Prairie Stars', 
    duration: 200,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Country',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80'
  },
  { 
    title: 'Sagebrush Serenade', 
    artist: 'The Wranglers', 
    duration: 215,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    genre: 'Western',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80'
  },
  { 
    title: 'Dust Trail Blues', 
    artist: 'Canyon Echo', 
    duration: 190,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    genre: 'Blues',
    cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'
  },
  { 
    title: 'Montana Skies', 
    artist: 'High Plains Drifters', 
    duration: 235,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Folk',
    cover: 'https://images.unsplash.com/photo-1484876065684-b683cf17d276?w=400&q=80'
  },
];

export const MinimizablePlayer = ({ currentProductId, hideOnHero = false }: MinimizablePlayerProps) => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(musicThemes[0]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastScrollY = useRef(0);
  const playerRef = useRef<HTMLDivElement | null>(null);

  // Auto-minimize on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and expanded, minimize
      if (currentScrollY > lastScrollY.current && isExpanded && currentScrollY > 100) {
        setIsExpanded(false);
        setShowPlaylist(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded && playerRef.current) {
      setIsDragging(true);
      setHasDragged(false);
      const rect = playerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isExpanded) {
        setHasDragged(true);
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isExpanded]);

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

  // Minimized view - just the thumbnail
  if (!isExpanded) {
    return (
      <>
        <audio ref={audioRef} />
        <div 
          ref={playerRef}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            if (!hasDragged) {
              setIsExpanded(true);
            }
          }}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            background: `linear-gradient(135deg, hsl(${currentTheme.primary}) 0%, hsl(${currentTheme.accent}) 100%)`,
            boxShadow: `0 10px 40px -10px hsl(${currentTheme.primary} / 0.5)`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          className="fixed z-40 group animate-fade-in"
        >
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 transition-transform hover:scale-110">
            <img 
              src={playlist[currentSong].cover} 
              alt={playlist[currentSong].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <GripVertical className="w-6 h-6 text-white" />
            </div>
            {isPlaying && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronUp className="absolute bottom-1 right-1 w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Expanded view - full player
  return (
    <>
      <audio ref={audioRef} />
      <div 
        className="fixed z-40 rounded-xl shadow-2xl border border-border transition-all duration-500 animate-scale-in"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: `linear-gradient(135deg, hsl(${currentTheme.primary}) 0%, hsl(${currentTheme.accent}) 100%)`,
          boxShadow: `0 10px 40px -10px hsl(${currentTheme.primary} / 0.5)`,
          width: showPlaylist ? '380px' : '320px',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="bg-black/20 backdrop-blur-xl rounded-xl p-4">
          {/* Header with minimize button */}
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <ChevronDown className="h-4 w-4" />
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
                      className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                        currentSong === playlist.indexOf(song)
                          ? 'bg-white/30'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <img 
                        src={song.cover} 
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{song.title}</p>
                        <p className="text-white/70 text-xs truncate">{song.artist}</p>
                        <p className="text-white/50 text-xs">{song.genre} • {formatTime(song.duration)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Album Art & Now Playing */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                  <img 
                    src={playlist[currentSong].cover} 
                    alt={playlist[currentSong].title}
                    className="w-full h-full object-cover"
                  />
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
