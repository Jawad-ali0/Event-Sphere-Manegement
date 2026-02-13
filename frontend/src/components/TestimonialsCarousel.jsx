import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './TestimonialsCarousel.css';

const TestimonialsCarousel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get('/contact/recent/feedback?limit=10');
        if (response.data.success) {
          setFeedbacks(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || feedbacks.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, feedbacks.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    setAutoPlay(false);
  };

  const getStatusColor = (feedbackType) => {
    const colors = {
      suggestion: '#4facfe',
      complaint: '#fa709a',
      partnership: '#30b0c5',
      general: '#667eea',
      other: '#764ba2'
    };
    return colors[feedbackType] || colors.general;
  };

  if (loading) {
    return (
      <section className="testimonials-carousel-section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">TRUSTED BY EVENT ORGANIZERS WORLDWIDE</p>
          <div className="loading-message">
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <section className="testimonials-carousel-section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">TRUSTED BY EVENT ORGANIZERS WORLDWIDE</p>
          <div className="no-testimonials">
            <p>Share your experience! <Link to="/contact">Send us your feedback</Link></p>
          </div>
        </div>
      </section>
    );
  }

  const currentFeedback = feedbacks[currentIndex];

  return (
    <section className="testimonials-carousel-section">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">TRUSTED BY EVENT ORGANIZERS WORLDWIDE</p>

        <div className="testimonials-carousel-wrapper">
          <div className="testimonials-carousel-container">
            {/* Main Carousel Card */}
            <div className="testimonials-carousel-main">
              <div
                className="testimonial-carousel-card"
                style={{
                  borderTopColor: getStatusColor(currentFeedback.feedbackType)
                }}
              >
                {/* Card Header */}
                <div className="carousel-card-header">
                  <div className="carousel-card-avatar">
                    {currentFeedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="carousel-card-info">
                    <h3>{currentFeedback.name}</h3>
                    <div className="carousel-card-meta">
                      <span className="feedback-type-badge" style={{
                        backgroundColor: getStatusColor(currentFeedback.feedbackType) + '20',
                        color: getStatusColor(currentFeedback.feedbackType)
                      }}>
                        {currentFeedback.feedbackType}
                      </span>
                      <span className="feedback-date">
                        {new Date(currentFeedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="carousel-card-content">
                  <p className="carousel-card-subject">{currentFeedback.subject}</p>
                  <p className="carousel-card-message">{currentFeedback.message}</p>
                </div>

                {/* Card Footer */}
                <div className="carousel-card-footer">
                  <div className="carousel-rating">
                    {currentFeedback.rating && (
                      <>
                        {'⭐'.repeat(currentFeedback.rating)}
                        <span className="rating-text">{currentFeedback.rating}/5</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                className="carousel-nav-btn carousel-nav-prev"
                onClick={goToPrevious}
                aria-label="Previous testimonial"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                className="carousel-nav-btn carousel-nav-next"
                onClick={goToNext}
                aria-label="Next testimonial"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {feedbacks.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    backgroundColor: index === currentIndex ? '#667eea' : '#ddd'
                  }}
                ></button>
              ))}
            </div>

            {/* Carousel Info */}
            <div className="carousel-info">
              <p className="carousel-counter">
                <span className="current">{currentIndex + 1}</span> / <span className="total">{feedbacks.length}</span>
              </p>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="testimonials-thumbnails">
            <div className="thumbnails-wrapper">
              {feedbacks.map((feedback, index) => (
                <div
                  key={feedback._id}
                  className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  style={{
                    borderTopColor: index === currentIndex ? getStatusColor(feedback.feedbackType) : '#ddd'
                  }}
                >
                  <div className="thumbnail-avatar">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="thumbnail-info">
                    <p className="thumbnail-name">{feedback.name}</p>
                    <p className="thumbnail-subject">{feedback.subject.substring(0, 20)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
