interface MeditationMarkProps {
  className?: string;
}

/** High-contrast lotus-and-seated-practitioner mark for guided meditation. */
const MeditationMark = ({ className = "h-6 w-6" }: MeditationMarkProps) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <path d="M32 8c-5.5 6-5.5 13.5 0 18 5.5-4.5 5.5-12 0-18Z" fill="currentColor" opacity=".36" />
    <circle cx="32" cy="21" r="5" fill="currentColor" />
    <path d="M23 38c1.7-9 5-13 9-13s7.3 4 9 13l5.4 4.1c-3.4 3-8 4.7-14.4 4.7s-11-1.7-14.4-4.7L23 38Z" fill="currentColor" />
    <path d="M32 36c-4.9 7.6-11.8 10.8-20.7 9.5 3.2 7.1 10.1 10.5 20.7 10.5s17.5-3.4 20.7-10.5C43.8 46.8 36.9 43.6 32 36Z" fill="currentColor" opacity=".8" />
    <path d="M12 51c5.5-1.6 10.7-1.1 15.5 1.6M52 51c-5.5-1.6-10.7-1.1-15.5 1.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 15c-3.8 1.2-6.6 3.5-8.4 7M44 15c3.8 1.2 6.6 3.5 8.4 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".7" />
  </svg>
);

export default MeditationMark;
