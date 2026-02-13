import './About.css';

const About = () => {
  const whyChooseUs = [
    {
      id: 1,
      title: 'Advanced Technology',
      description: 'Cutting-edge platform with AI-powered features for seamless event management.',
      icon: 'bi-cpu'
    },
    {
      id: 2,
      title: 'Expert Team',
      description: 'Industry veterans with 20+ years of combined experience in event management.',
      icon: 'bi-people'
    },
    {
      id: 3,
      title: 'Global Network',
      description: 'Connect with thousands of exhibitors, attendees, and partners worldwide.',
      icon: 'bi-globe'
    },
    {
      id: 4,
      title: '24/7 Support',
      description: 'Dedicated support team ready to help you at every step of your event journey.',
      icon: 'bi-headset'
    },
    {
      id: 5,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security protecting all your event data and transactions.',
      icon: 'bi-shield-lock'
    },
    {
      id: 6,
      title: 'Cost Effective',
      description: 'Transparent pricing with no hidden fees - pay only for what you use.',
      icon: 'bi-cash-coin'
    }
  ];

  const stats = [
    { label: 'Events Managed', value: '500+' },
    { label: 'Active Users', value: '50,000+' },
    { label: 'Exhibitors', value: '5,000+' },
    { label: 'Success Rate', value: '98%' }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'Constantly evolving with the latest technologies and industry best practices.'
    },
    {
      title: 'Reliability',
      description: 'Your events are our priority - we ensure 99.9% uptime and support.'
    },
    {
      title: 'Community',
      description: 'Building a vibrant ecosystem connecting organizers, exhibitors, and attendees.'
    },
    {
      title: 'Excellence',
      description: 'Delivering exceptional service and exceeding expectations on every event.'
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 data-aos="fade-down">About EventSphere</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Pakistan's most advanced event management platform, designed to make organizing expos, trade shows, and corporate events easy, digital, and stress-free.
          </p>
          <div className="hero-cta" data-aos="fade-up" data-aos-delay="400">
            <button className="btn btn-primary">
              <i className="bi bi-play-circle"></i>
              Watch Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" data-aos="fade-up">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="about-content-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Why Choose EventSphere?</h2>
            <p>Trusted by industry leaders and innovators across the globe</p>
          </div>

          <div className="features-grid" data-aos="fade-up" data-aos-delay="200">
            {whyChooseUs.map((feature, index) => (
              <div key={feature.id} className="feature-card" data-aos="fade-up" data-aos-delay={300 + index * 50}>
                <div className="feature-icon">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section" data-aos="fade-up">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Our Core Values</h2>
            <p>Guiding principles that drive everything we do</p>
          </div>

          <div className="values-grid" data-aos="fade-up" data-aos-delay="200">
            {values.map((value, index) => (
              <div key={index} className="value-card" data-aos="fade-up" data-aos-delay={300 + index * 75}>
                <div className="value-number">{index + 1}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta" data-aos="fade-up">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Transform Your Events?</h2>
            <p>Join thousands of organizers, exhibitors, and attendees using EventSphere</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                <i className="bi bi-rocket-takeoff"></i>
                Get Started Free
              </button>
              <button className="btn btn-outline">
                <i className="bi bi-calendar-event"></i>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
