import { useState } from 'react';
import './Exhibitors.css';

const Exhibitors = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const exhibitors = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Chief Technology Officer',
      company: 'TechFlow Solutions',
      category: 'keynote',
      bio: 'Industry visionary with 15+ years of experience in innovative technology solutions.',
      image: 'S',
      social: {
        linkedin: '#',
        twitter: '#'
      },
      badge: 'Keynote Speaker'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Product Strategy Director',
      company: 'Innovation Labs',
      category: 'speaker',
      bio: 'Expert in scalable infrastructure and product development strategies.',
      image: 'M',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 3,
      name: 'Emma Thompson',
      title: 'UX Design Lead',
      company: 'Creative Studio',
      category: 'speaker',
      bio: 'Passionate about creating user-centered design systems and experiences.',
      image: 'E',
      social: {
        linkedin: '#',
        twitter: '#'
      },
      badge: 'Featured'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Data Science Manager',
      company: 'Analytics Pro',
      category: 'exhibitor',
      bio: 'Leveraging AI and machine learning to drive business growth.',
      image: 'D',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 5,
      name: 'Lisa Johnson',
      title: 'Marketing Director',
      company: 'Growth Partners',
      category: 'speaker',
      bio: 'Strategic marketing expert focused on scalable growth.',
      image: 'L',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 6,
      name: 'James Wilson',
      title: 'Security Engineer',
      company: 'SecureTech',
      category: 'exhibitor',
      bio: 'Cybersecurity specialist protecting enterprise infrastructure.',
      image: 'J',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 7,
      name: 'Jessica Lee',
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      category: 'speaker',
      bio: 'Cloud infrastructure and deployment automation expert.',
      image: 'J',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 8,
      name: 'Mark Bennett',
      title: 'Business Development',
      company: 'Enterprise Solutions',
      category: 'exhibitor',
      bio: 'Building strategic partnerships and business expansion.',
      image: 'M',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 9,
      name: 'Rachel Garcia',
      title: 'Product Manager',
      company: 'Tech Innovations',
      category: 'speaker',
      bio: 'Leading product vision and roadmap development.',
      image: 'R',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Speakers' },
    { id: 'keynote', label: 'Keynote Speakers' },
    { id: 'speaker', label: 'Session Speakers' },
    { id: 'exhibitor', label: 'Exhibitors' }
  ];

  const filteredExhibitors = selectedCategory === 'all' 
    ? exhibitors 
    : exhibitors.filter(e => e.category === selectedCategory);

  return (
    <div className="exhibitors-container">
      {/* Page Header */}
      <section className="exhibitors-header">
        <div className="container">
          <h1>Speakers & Exhibitors</h1>
          <p>Meet the industry leaders and innovators shaping the future</p>
        </div>
      </section>

      {/* Exhibitors Content */}
      <section className="exhibitors-content">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter" data-aos="fade-up">
            <div className="filter-group">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exhibitors Grid */}
          <div className="exhibitors-grid" data-aos="fade-up" data-aos-delay="200">
            {filteredExhibitors.map((exhibitor, index) => (
              <div 
                key={exhibitor.id} 
                className="exhibitor-card"
                data-aos="fade-up"
                data-aos-delay={300 + index * 50}
              >
                <div className="exhibitor-image-wrapper">
                  <div className="exhibitor-image">
                    {exhibitor.image}
                  </div>
                  {exhibitor.badge && (
                    <div className="exhibitor-badge">
                      <span>{exhibitor.badge}</span>
                    </div>
                  )}
                  <div className="social-overlay">
                    <a href={exhibitor.social.linkedin} className="social-link" title="LinkedIn">
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href={exhibitor.social.twitter} className="social-link" title="Twitter">
                      <i className="bi bi-twitter"></i>
                    </a>
                  </div>
                </div>

                <div className="exhibitor-info">
                  <h3 className="exhibitor-name">{exhibitor.name}</h3>
                  <p className="exhibitor-title">{exhibitor.title}</p>
                  <p className="exhibitor-company">{exhibitor.company}</p>
                  <p className="exhibitor-bio">{exhibitor.bio}</p>

                  <button className="view-profile-btn">
                    View Profile <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="exhibitors-cta" data-aos="fade-up" data-aos-delay="400">
            <div className="cta-card">
              <h2>Interested in Becoming a Speaker or Exhibitor?</h2>
              <p>Join us and share your expertise with industry leaders and innovators</p>
              <button className="btn btn-primary">
                <i className="bi bi-envelope"></i>
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exhibitors;
