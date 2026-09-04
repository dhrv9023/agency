import React from 'react';
import { BookingScheduler } from '../components/interactive/BookingScheduler';

export const Book: React.FC = () => {
  return (
    <div className="book-page">
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Direct Calendar Access</span>
          <h1 className="page-hero-title">Schedule a Technical Discovery Session</h1>
          <p className="page-hero-desc">
            Connect directly with a founding systems architect. In 45 minutes, we will unpack your operational friction, review your software dependencies, and outline a concrete automation roadmap.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <BookingScheduler />
        </div>
      </section>
    </div>
  );
};
