import React from 'react';
import MetroHero from './scroll-locked-video-hero';

export interface WeddingHeroProps {
  title?: string;
  tagline?: string;
  videoSrc?: string;
}

export const WeddingHero: React.FC<WeddingHeroProps> = ({
  title = "ETERNAL CELEBRATION",
  tagline = "Two souls, one timeless journey. The celebration begins.",
  // Cinematic wedding highlight video stream (royalty-free mp4 / CDN)
  videoSrc = "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
}) => {
  return (
    <MetroHero
      title={title}
      tagline={tagline}
      scrollHint="SCROLL TO REVEAL STORY"
      videoSrc={videoSrc}
      scrubDistance={2800}
      signature={{
        name: "FestivaAI Wedding Cinema",
        url: "#"
      }}
    />
  );
};

export default WeddingHero;
