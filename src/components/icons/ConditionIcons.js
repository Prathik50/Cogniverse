import React from 'react';
import Svg, { Path, Circle, Rect, G, Ellipse, Polygon } from 'react-native-svg';

// Autism Spectrum Disorder Icon - Puzzle piece
export const AutismIcon = ({ size = 40, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C10.9 2 10 2.9 10 4C10 4.7 10.4 5.3 11 5.6V7H9C8.4 7 8 7.4 8 8V10H6.4C6.1 9.4 5.5 9 4.8 9C3.8 9 3 9.8 3 10.8C3 11.8 3.8 12.6 4.8 12.6C5.5 12.6 6.1 12.2 6.4 11.6H8V13C8 13.6 8.4 14 9 14H11V15.4C10.4 15.7 10 16.3 10 17C10 18.1 10.9 19 12 19C13.1 19 14 18.1 14 17C14 16.3 13.6 15.7 13 15.4V14H15C15.6 14 16 13.6 16 13V11H17.6C17.9 11.6 18.5 12 19.2 12C20.2 12 21 11.2 21 10.2C21 9.2 20.2 8.4 19.2 8.4C18.5 8.4 17.9 8.8 17.6 9.4H16V8C16 7.4 15.6 7 15 7H13V5.6C13.6 5.3 14 4.7 14 4C14 2.9 13.1 2 12 2Z"
      fill={color}
    />
  </Svg>
);

// Down Syndrome Icon - Heart with care
export const DownSyndromeIcon = ({ size = 40, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
      fill={color}
    />
    <Circle cx="9" cy="9" r="1.5" fill="white" />
    <Circle cx="15" cy="9" r="1.5" fill="white" />
    <Path
      d="M12 14C13.66 14 15 12.88 15 11.5H9C9 12.88 10.34 14 12 14Z"
      fill="white"
    />
  </Svg>
);

// ADHD Icon - Lightning bolt with energy
export const ADHDIcon = ({ size = 40, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill={color}
    />
    <Circle cx="13" cy="6" r="1.5" fill="white" opacity="0.8" />
    <Circle cx="11" cy="16" r="1.5" fill="white" opacity="0.8" />
  </Svg>
);

// Dyslexia Icon - Book with letters
export const DyslexiaIcon = ({ size = 40, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z"
      fill={color}
    />
    <Path
      d="M7 8H17M7 12H17M7 16H14"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="16" cy="16" r="1" fill="white" />
  </Svg>
);

// Cerebral Palsy Icon - Accessibility symbol
export const CerebralPalsyIcon = ({ size = 40, color = '#EC4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="7" r="3" fill={color} />
    <Path
      d="M12 11C8.13 11 5 14.13 5 18V22H8V18C8 15.79 9.79 14 12 14C14.21 14 16 15.79 16 18V22H19V18C19 14.13 15.87 11 12 11Z"
      fill={color}
    />
    <Path
      d="M15 15L18 12M9 15L6 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Intellectual Disability Icon - Brain
export const IntellectualDisabilityIcon = ({ size = 40, color = '#14B8A6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 3C9.23 3 6.19 5.95 6 9.66L4.08 12.19C3.84 12.5 4.08 13 4.5 13H6V16C6 17.11 6.89 18 8 18H9V21H15V16.5C17.21 15.81 18.88 13.65 19 11.09C19.16 7.61 16.39 4.68 13 3.93V3Z"
      fill={color}
    />
    <Circle cx="10" cy="10" r="1.5" fill="white" />
    <Circle cx="14" cy="10" r="1.5" fill="white" />
    <Path
      d="M9 13C9 13 10 14.5 12 14.5C14 14.5 15 13 15 13"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);

// Speech Delay Icon - Speech bubble
export const SpeechDelayIcon = ({ size = 40, color = '#F97316' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8L12 22L16 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
      fill={color}
    />
    <Path
      d="M7 8H17M7 12H14"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Back Arrow Icon
export const BackArrowIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Chatbot Icon
export const ChatbotIcon = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="6" width="16" height="12" rx="2" fill={color} />
    <Circle cx="9" cy="11" r="1.5" fill="#6366F1" />
    <Circle cx="15" cy="11" r="1.5" fill="#6366F1" />
    <Path
      d="M8 14C8 14 9.5 15.5 12 15.5C14.5 15.5 16 14 16 14"
      stroke="#6366F1"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Rect x="10" y="18" width="4" height="2" fill={color} />
    <Rect x="8" y="20" width="8" height="1" fill={color} />
    <Circle cx="4" cy="6" r="1" fill={color} />
    <Circle cx="20" cy="6" r="1" fill={color} />
  </Svg>
);

// Send Icon
export const SendIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Menu Icon
export const MenuIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21M3 12H21M3 18H21"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

// Help Icon
export const HelpIcon = ({ size = 32, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path
      d="M9.09 9C9.32 8.42 9.73 7.93 10.26 7.59C10.79 7.25 11.41 7.09 12.04 7.13C12.67 7.17 13.27 7.41 13.75 7.81C14.23 8.21 14.57 8.76 14.71 9.37C14.85 9.98 14.79 10.62 14.54 11.19C14.29 11.76 13.86 12.23 13.32 12.54C12.61 12.96 12.25 13.5 12.25 14.25"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="17" r="1" fill="#6366F1" />
  </Svg>
);

// Suite Icons
export const CommunicationIcon = ({ size = 40, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
      fill={color}
    />
    <Circle cx="8" cy="9" r="1.5" fill="white" />
    <Circle cx="12" cy="9" r="1.5" fill="white" />
    <Circle cx="16" cy="9" r="1.5" fill="white" />
    <Path
      d="M7 13C7 13 9 15 12 15C15 15 17 13 17 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const LearningIcon = ({ size = 40, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3Z"
      fill={color}
    />
    <Path
      d="M12 12.5L7 9.5L12 6.5L17 9.5L12 12.5Z"
      fill="white"
      opacity="0.8"
    />
  </Svg>
);

export const SocialIcon = ({ size = 40, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="8" r="4" fill={color} />
    <Circle cx="17" cy="8" r="3" fill={color} opacity="0.7" />
    <Path
      d="M15 13C12.33 13 7 14.34 7 17V20H17V17C17 14.34 17.67 13 15 13Z"
      fill={color}
    />
    <Path
      d="M22 17V20H18V17C18 15.9 18.5 14.5 19.5 13.5C20.24 13.19 21.1 13 22 13V17Z"
      fill={color}
      opacity="0.7"
    />
  </Svg>
);

export const GamesIcon = ({ size = 40, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.58 16.09L18.85 11.74C18.31 10.81 17.32 10.25 16.25 10.25H7.75C6.68 10.25 5.69 10.81 5.15 11.74L2.42 16.09C1.43 17.79 2.61 20 4.58 20C5.58 20 6.5 19.41 6.92 18.5L8 16.25H16L17.08 18.5C17.5 19.41 18.42 20 19.42 20C21.39 20 22.57 17.79 21.58 16.09Z"
      fill={color}
    />
    <Circle cx="8" cy="14" r="1.5" fill="white" />
    <Circle cx="16" cy="14" r="1.5" fill="white" />
    <Path
      d="M12 4V8M10 6H14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// My Voice / Communication Board Icon
export const MyVoiceIcon = ({ size = 48, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
      fill={color}
    />
    <Path
      d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z"
      fill={color}
    />
    <Path
      d="M10 6C10 6 10.5 7 12 7C13.5 7 14 6 14 6"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="10.5" cy="8.5" r="0.8" fill="white" />
    <Circle cx="13.5" cy="8.5" r="0.8" fill="white" />
  </Svg>
);

// Learn to Build / Sentence Builder Icon
export const LearnToBuildIcon = ({ size = 48, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
      fill={color}
    />
    <Path
      d="M7 8H11M7 12H17M7 16H14"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="15" cy="8" r="1.5" fill="white" />
  </Svg>
);

// Story Time Icon
export const StoryTimeIcon = ({ size = 48, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2Z"
      fill={color}
    />
    <Path
      d="M8 7H16M8 11H16M8 15H13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 2L14 6L12 4L10 6L12 2Z"
      fill="white"
      opacity="0.8"
    />
  </Svg>
);

// Clear/Delete Icon
export const ClearIcon = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
      fill={color}
    />
  </Svg>
);

// Play/Speak Icon
export const PlayIcon = ({ size = 24, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5V19L19 12L8 5Z"
      fill={color}
    />
  </Svg>
);

// Add/Plus Icon
export const AddIcon = ({ size = 24, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
      fill={color}
    />
  </Svg>
);

// Settings Icon
export const SettingsIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z"
      fill={color}
    />
  </Svg>
);

// Dashboard Icon
export const DashboardIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
      fill={color}
    />
  </Svg>
);

// Info/Conditions Icon
export const InfoIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path
      d="M11 7H13V9H11V7ZM11 11H13V17H11V11Z"
      fill="white"
    />
  </Svg>
);
