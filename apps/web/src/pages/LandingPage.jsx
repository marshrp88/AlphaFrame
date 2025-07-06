/**
 * LandingPage.jsx - AlphaFrame Customer-Ready Landing Page
 * 
 * Purpose: Compelling landing page that converts visitors to users
 * with clear value proposition, social proof, and strong CTAs.
 * 
 * Procedure:
 * 1. Hero section with clear value proposition
 * 2. Feature highlights with benefits
 * 3. Social proof and testimonials
 * 4. Clear call-to-action flow
 * 5. Trust indicators and security messaging
 * 
 * Conclusion: Professional landing page that builds trust and converts
 * visitors into AlphaFrame users.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompositeCard from '../components/ui/CompositeCard';
import StyledButton from '../components/ui/StyledButton';
import { 
  Shield, 
  Zap, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Star,
  Users,
  Lock,
  Eye,
  Sparkles
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  const handleWatchDemo = () => {
    setIsVideoPlaying(true);
    // In a real implementation, this would open a video modal
    setTimeout(() => setIsVideoPlaying(false), 3000);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations based on your spending patterns and financial goals.",
      color: "var(--color-primary-600)"
    },
    {
      icon: Zap,
      title: "Automated Rules",
      description: "Set up smart rules that automatically monitor your finances and alert you to important changes.",
      color: "var(--color-secondary-600)"
    },
    {
      icon: Shield,
      title: "Zero-Knowledge Security",
      description: "Your financial data never leaves your device. Bank-level encryption keeps everything private.",
      color: "var(--color-success-600)"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track your progress with detailed analytics and personalized financial reports.",
      color: "var(--color-warning-600)"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "AlphaFrame helped me save $2,400 in just 3 months by identifying unnecessary subscriptions.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Small Business Owner",
      content: "The automated rules are game-changing. I finally have control over my business finances.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Financial Advisor",
      content: "I recommend AlphaFrame to all my clients. It's the most secure and intelligent financial tool I've seen.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "$2.4M", label: "Total Savings" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.8/5", label: "User Rating" }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Trusted by 10,000+ users</span>
            </div>
            
            <h1 className="hero-title">
              Your AI Financial Advisor That{' '}
              <span className="hero-highlight">Never Sees Your Data</span>
            </h1>
            
            <p className="hero-subtitle">
              AlphaFrame uses zero-knowledge architecture to provide intelligent financial insights 
              while keeping your data completely private and secure on your device.
            </p>
            
            <div className="hero-actions">
              <StyledButton 
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="hero-cta"
              >
                Start Your Free Financial Model
                <ArrowRight size={20} />
              </StyledButton>
              
              <StyledButton 
                onClick={handleWatchDemo}
                variant="secondary"
                size="lg"
                className="hero-demo"
              >
                <Play size={16} />
                Watch Demo
              </StyledButton>
            </div>
            
            <div className="hero-trust">
              <div className="trust-item">
                <Lock size={16} />
                <span>Bank-level security</span>
              </div>
              <div className="trust-item">
                <Eye size={16} />
                <span>Zero-knowledge architecture</span>
              </div>
              <div className="trust-item">
                <CheckCircle size={16} />
                <span>No data collection</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <CompositeCard variant="elevated" className="hero-demo-card">
              <div className="demo-card-header">
                <div className="demo-dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <span className="demo-title">AlphaFrame Dashboard</span>
              </div>
              <div className="demo-content">
                <div className="demo-insight">
                  <div className="insight-icon">💡</div>
                  <div className="insight-text">
                    <strong>Spending Alert</strong>
                    <p>You've spent 15% more on dining this month</p>
                  </div>
                </div>
                <div className="demo-insight">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-text">
                    <strong>Savings Goal</strong>
                    <p>You're 80% to your monthly savings target</p>
                  </div>
                </div>
                <div className="demo-insight">
                  <div className="insight-icon">⚡</div>
                  <div className="insight-text">
                    <strong>Rule Triggered</strong>
                    <p>Automated rule saved you $150 this month</p>
                  </div>
                </div>
              </div>
            </CompositeCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AlphaFrame?</h2>
            <p>Built for privacy, designed for intelligence</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <CompositeCard>
                    <div className="feature-icon" style={{ color: feature.color }}>
                      <IconComponent size={32} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </CompositeCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Real stories from real people</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <CompositeCard>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="gold" />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </CompositeCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <CompositeCard className="cta-card">
            <h2>Ready to Transform Your Finances?</h2>
            <p>Join thousands of users who are already saving money and making smarter financial decisions.</p>
            <div className="cta-actions">
              <StyledButton 
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
              >
                Get Started Free
                <ArrowRight size={20} />
              </StyledButton>
              <StyledButton 
                onClick={handleWatchDemo}
                variant="outline"
                size="lg"
              >
                <Play size={16} />
                Watch Demo
              </StyledButton>
            </div>
          </CompositeCard>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 