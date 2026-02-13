import { useState, useEffect } from 'react';
import './EventCarousel.css';

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      title: 'Tech Expo 2026',
      subtitle: 'The Future of Innovation',
      date: 'March 15-17, 2026',
      location: 'Convention Center, Dubai',
      attendees: '5,000+',
      color: '#667eea',
      description: 'Join the largest tech expo featuring cutting-edge innovations'
    },
    {
      id: 2,
      title: 'Business Summit',
      subtitle: 'Global Enterprise Solutions',
      date: 'April 10-12, 2026',
      location: 'Grand Hall, Singapore',
      attendees: '3,000+',
      color: '#764ba2',
      description: 'Connect with industry experts and grow your business network'
    },
    {
      id: 3,
      title: 'Digital Marketing Conf',
      subtitle: 'Strategies for Modern Era',
      date: 'May 5-7, 2026',
      location: 'Tech Hub, Bangalore',
      attendees: '2,000+',
      color: '#f093fb',
      description: 'Master the latest digital marketing trends and strategies'
    },
    {
      id: 4,
      title: 'Startup Pitch Event',
      subtitle: 'Connect with Investors',
      date: 'June 1-3, 2026',
      location: 'Innovation Park, Toronto',
      attendees: '1,500+',
      color: '#4facfe',
      description: 'Showcase your startup and secure funding from investors'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <div 
          className="carousel-wrapper"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <div className="carousel-content">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                style={{ '--slide-color': slide.color }}
              >
                <div className="item-icon">
                  <span>🎯</span>
                </div>
                <div className="item-content">
                  <div className="text-section">
                    <h3>{slide.title}</h3>
                    <p className="subtitle">{slide.subtitle}</p>
                    <p className="description">{slide.description}</p>
                    
                    <div className="event-details">
                      <div className="detail-item">
                        <span className="icon">📅</span>
                        <span>{slide.date}</span>
                      </div>
                      <div className="detail-item">
                        <span className="icon">📍</span>
                        <span>{slide.location}</span>
                      </div>
                      <div className="detail-item">
                        <span className="icon">👥</span>
                        <span>{slide.attendees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
          <button className="carousel-btn next" onClick={nextSlide}>❯</button>

          {/* Dots */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;

