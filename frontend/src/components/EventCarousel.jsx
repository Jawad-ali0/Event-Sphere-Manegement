import { useState, useEffect, useRef } from 'react';
import './EventCarousel.css';

// Roman-Urdu: EventCarousel component - aasaan code, comments Roman-Urdu mein
// Icons ko emoji ki jagah inline SVG se replace kia gaya hai taake UI zyada modern lage.

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      title: 'Tech Expo 2026',
      subtitle: 'The Future of Innovation',
      date: 'March 15-17, 2026',
      location: '📍 Convention Center, Dubai',
      attendees: '5,000+ Expected',
      icon: 'rocket',
      color: '#667eea',
      description: 'Join the largest tech expo featuring cutting-edge innovations and industry leaders'
    },
    {
      id: 2,
      title: 'Business Summit',
      subtitle: 'Global Enterprise Solutions',
      date: 'April 10-12, 2026',
      location: '📍 Grand Hall, Singapore',
      attendees: '3,000+ Expected',
      icon: 'briefcase',
      color: '#764ba2',
      description: 'Connect with industry experts and grow your business network globally'
    },
    {
      id: 3,
      title: 'Digital Marketing Conference',
      subtitle: 'Strategies for Modern Era',
      date: 'May 5-7, 2026',
      location: '📍 Tech Hub, Bangalore',
      attendees: '2,000+ Expected',
      icon: 'phone',
      color: '#f093fb',
      description: 'Master the latest digital marketing trends and strategies for success'
    },
    {
      id: 4,
      title: 'Startup Pitch Event',
      subtitle: 'Connect with Investors',
      date: 'June 1-3, 2026',
      location: '📍 Innovation Park, Toronto',
      attendees: '1,500+ Expected',
      icon: 'light',
      color: '#4facfe',
      description: 'Showcase your startup and secure funding from leading investors'
    }
  ];

  // Helper: render small SVG icon by name
  const renderIcon = (name, size = 80, color = 'white') => {
    const common = { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
    if (name === 'rocket') {
      return (
        <svg {...common} aria-hidden>
          <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.12)" />
          <path d="M20 44c6-4 12-10 18-14 4-2 8-3 12-3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 22l6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (name === 'briefcase') {
      return (
        <svg {...common} aria-hidden>
          <rect x="8" y="18" width="48" height="30" rx="4" fill="rgba(255,255,255,0.12)" />
          <path d="M20 18v-4a4 4 0 014-4h6a4 4 0 014 4v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (name === 'phone') {
      return (
        <svg {...common} aria-hidden>
          <rect x="18" y="10" width="28" height="44" rx="6" fill="rgba(255,255,255,0.12)" />
          <circle cx="32" cy="44" r="2" fill="white" />
        </svg>
      );
    }
    // default: light
    return (
      <svg {...common} aria-hidden>
        <circle cx="32" cy="28" r="10" fill="rgba(255,255,255,0.12)" />
        <path d="M32 40v8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  // Touch / swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setAutoPlay(false);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const dx = touchStartX.current - touchEndX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  const carouselRef = useRef(null);
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const resumeAutoPlay = () => {
    setAutoPlay(true);
  };

  return (
    <section className="carousel-section" aria-label="Featured events carousel">
      <div className="carousel-container">
        <div
          className="carousel-wrapper"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={resumeAutoPlay}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={carouselRef}
        >
          {/* Slides */}
          <div className="carousel-slides">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ '--slide-color': slide.color }}
                aria-hidden={index === currentSlide ? 'false' : 'true'}
              >
                <div className="slide-content">
                  <div className="slide-image">
                      {renderIcon(slide.icon)}
                  </div>
                  <div className="slide-text">
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-subtitle">{slide.subtitle}</p>
                    <p className="slide-description">{slide.description}</p>
                    
                    <div className="slide-info">
                      <div className="info-item">
                        <span className="info-icon">📅</span>
                        <span>{slide.date}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span>{slide.location}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">👥</span>
                        <span>{slide.attendees}</span>
                      </div>
                    </div>

                    <button className="slide-button" aria-label={`Register for ${slide.title}`}>Register Now →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            className="carousel-arrow carousel-arrow-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
            title="Previous event"
          >
            ❮
          </button>
          <button 
            className="carousel-arrow carousel-arrow-next"
            onClick={nextSlide}
            aria-label="Next slide"
            title="Next event"
          >
            ❯
          </button>

          {/* Indicators/Dots */}
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                title={`Event ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Auto-play Resume Button */}
        {!autoPlay && (
          <button 
            className="resume-autoplay"
            onClick={resumeAutoPlay}
            title="Resume auto-play"
          >
            ▶ Resume
          </button>
        )}
      </div>

      {/* Featured Events Summary */}
      <div className="carousel-summary">
        <h3>Upcoming Featured Events</h3>
        <div className="summary-grid">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`summary-card ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
                <div className="summary-emoji" aria-hidden>{renderIcon(slide.icon, 40)}</div>
              <h4>{slide.title}</h4>
              <p>{slide.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;
