import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse, Polyline } from 'react-native-svg';

// Eating Icon
export const EatingIcon = ({ size = 64, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Path
      d="M20 18V28C20 30 22 32 24 32V46C24 47.1 24.9 48 26 48C27.1 48 28 47.1 28 46V18M32 18V28C32 30 34 32 36 32V46C36 47.1 36.9 48 38 48C39.1 48 40 47.1 40 46V18M44 18V32C44 34 42 36 40 36V46C40 47.1 40.9 48 42 48C43.1 48 44 47.1 44 46V18"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <Circle cx="32" cy="24" r="8" fill={color} />
  </Svg>
);

// Drinking Icon
export const DrinkingIcon = ({ size = 64, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Path
      d="M24 16L22 48H42L40 16H24Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M22 20H42"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M26 28C26 28 28 32 32 32C36 32 38 28 38 28"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

// Bathing Icon
export const BathingIcon = ({ size = 64, color = '#06B6D4' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Rect x="16" y="28" width="32" height="16" rx="2" fill={color} />
    <Path
      d="M16 36H48M20 44V48M28 44V48M36 44V48M44 44V48"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="38" cy="20" r="4" fill={color} />
    <Path
      d="M18 24C18 24 20 20 24 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

// Brushing Teeth Icon
export const BrushingTeethIcon = ({ size = 64, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Path
      d="M28 18L26 38C26 40 27 42 29 42H35C37 42 38 40 38 38L36 18"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Rect x="26" y="14" width="12" height="6" rx="1" fill="white" />
    <Path
      d="M28 16H30M32 16H34"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Circle cx="44" cy="24" r="6" fill={color} />
    <Path
      d="M42 22L46 26M42 26L46 22"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Sleeping Icon
export const SleepingIcon = ({ size = 64, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Circle cx="32" cy="32" r="14" fill={color} />
    <Path
      d="M26 30C26 30 28 28 30 28M34 28C36 28 38 30 38 30"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M28 36C28 36 30 38 32 38C34 38 36 36 36 36"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M42 16H46L42 20H46L42 24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Getting Dressed Icon
export const DressingIcon = ({ size = 64, color = '#EC4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Path
      d="M24 20L20 28V48H28V36H36V48H44V28L40 20H24Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="32" cy="28" r="3" fill="white" />
    <Path
      d="M28 32V40M36 32V40"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Playing Icon
export const PlayingIcon = ({ size = 64, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Rect x="16" y="20" width="32" height="24" rx="4" fill={color} />
    <Circle cx="24" cy="36" r="4" fill="white" />
    <Circle cx="40" cy="36" r="4" fill="white" />
    <Path
      d="M28 28H32M36 28H40"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Rect x="34" y="32" width="2" height="8" fill="white" />
  </Svg>
);

// Reading Icon
export const ReadingIcon = ({ size = 64, color = '#6366F1' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Path
      d="M18 20V44L32 38L46 44V20L32 26L18 20Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M22 26H28M22 30H28M22 34H26M36 26H42M36 30H42M38 34H42"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M32 26V38" stroke="white" strokeWidth="2" />
  </Svg>
);

// Walking Icon
export const WalkingIcon = ({ size = 64, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Circle cx="32" cy="18" r="5" fill={color} />
    <Path
      d="M32 24L28 32L24 44M32 24L36 32L40 44M32 32L38 36"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="24" cy="46" r="2" fill={color} />
    <Circle cx="40" cy="46" r="2" fill={color} />
  </Svg>
);

// Sitting Icon
export const SittingIcon = ({ size = 64, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Circle cx="28" cy="18" r="5" fill={color} />
    <Path
      d="M28 24V32H36V36M28 32L22 42M36 36L38 46"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="20" y="30" width="24" height="4" rx="2" fill={color} />
  </Svg>
);

// Help Icon (SOS)
export const HelpSOSIcon = ({ size = 64, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Path
      d="M20 26C20 24 22 22 24 22H26C28 22 30 24 30 26C30 28 28 30 26 30H24C22 30 20 28 20 26Z"
      fill="white"
    />
    <Path
      d="M34 26C34 24 36 22 38 22H40C42 22 44 24 44 26C44 28 42 30 40 30H38C36 30 34 28 34 26Z"
      fill="white"
    />
    <Path
      d="M20 38C20 36 22 34 24 34H26C28 34 30 36 30 38C30 40 28 42 26 42H24C22 42 20 40 20 38Z"
      fill="white"
    />
    <Path
      d="M34 34H40V42H34V34Z"
      fill="white"
    />
  </Svg>
);

// Toilet Icon
export const ToiletIcon = ({ size = 64, color = '#06B6D4' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Rect x="22" y="28" width="20" height="20" rx="3" fill={color} />
    <Ellipse cx="32" cy="34" rx="6" ry="4" fill="white" />
    <Path
      d="M26 22C26 20 28 18 30 18H34C36 18 38 20 38 22V28H26V22Z"
      fill={color}
    />
    <Rect x="28" y="48" width="8" height="4" fill={color} />
  </Svg>
);

// Happy Icon
export const HappyIcon = ({ size = 64, color = '#FBBF24' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Circle cx="24" cy="28" r="3" fill="white" />
    <Circle cx="40" cy="28" r="3" fill="white" />
    <Path
      d="M22 36C22 36 26 42 32 42C38 42 42 36 42 36"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M20 24C20 24 22 22 24 22M40 22C42 22 44 24 44 24"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Sad Icon
export const SadIcon = ({ size = 64, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Circle cx="24" cy="28" r="3" fill="white" />
    <Circle cx="40" cy="28" r="3" fill="white" />
    <Path
      d="M22 42C22 42 26 36 32 36C38 36 42 42 42 42"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M20 24C20 24 22 22 24 22M40 22C42 22 44 24 44 24"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Tired Icon
export const TiredIcon = ({ size = 64, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Path
      d="M20 28H28M36 28H44"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Ellipse cx="32" cy="38" rx="6" ry="4" fill="white" />
    <Path
      d="M18 22L22 24L18 26M46 22L42 24L46 26"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Hungry Icon
export const HungryIcon = ({ size = 64, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Circle cx="24" cy="26" r="3" fill="white" />
    <Circle cx="40" cy="26" r="3" fill="white" />
    <Circle cx="32" cy="38" r="8" fill="white" />
    <Path
      d="M28 36C28 36 30 40 32 40C34 40 36 36 36 36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Thirsty Icon
export const ThirstyIcon = ({ size = 64, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Circle cx="24" cy="26" r="3" fill="white" />
    <Circle cx="40" cy="26" r="3" fill="white" />
    <Path
      d="M28 36H36"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M32 40C32 40 28 44 28 46C28 48 30 50 32 50C34 50 36 48 36 46C36 44 32 40 32 40Z"
      fill="white"
    />
  </Svg>
);

// Hot Icon
export const HotIcon = ({ size = 64, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Circle cx="24" cy="28" r="3" fill="white" />
    <Circle cx="40" cy="28" r="3" fill="white" />
    <Path
      d="M24 38H40"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M28 16C28 16 26 20 26 22C26 24 28 26 30 26C32 26 34 24 34 22C34 20 32 16 32 16M36 18C36 18 34 22 34 24C34 26 36 28 38 28C40 28 42 26 42 24C42 22 40 18 40 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

// Cold Icon
export const ColdIcon = ({ size = 64, color = '#06B6D4' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Circle cx="24" cy="28" r="3" fill="white" />
    <Circle cx="40" cy="28" r="3" fill="white" />
    <Path
      d="M24 38H40"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Path
      d="M32 16V24M26 18L32 22L38 18M26 22L32 18L38 22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sick Icon
export const SickIcon = ({ size = 64, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} />
    <Path
      d="M20 28L24 24L20 20M44 20L40 24L44 28"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M24 38C24 38 26 42 32 42C38 42 40 38 40 38"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <Rect x="28" y="32" width="8" height="3" rx="1.5" fill="white" />
  </Svg>
);

// Washing Hands Icon
export const WashingHandsIcon = ({ size = 64, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Path
      d="M24 28C24 26 26 24 28 24H36C38 24 40 26 40 28V40C40 42 38 44 36 44H28C26 44 24 42 24 40V28Z"
      fill={color}
    />
    <Circle cx="26" cy="18" r="2" fill={color} />
    <Circle cx="32" cy="16" r="2" fill={color} />
    <Circle cx="38" cy="18" r="2" fill={color} />
    <Path
      d="M28 32H36M28 36H36"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Cooking Icon
export const CookingIcon = ({ size = 64, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Ellipse cx="32" cy="36" rx="14" ry="8" fill={color} />
    <Path
      d="M18 36V40C18 42 20 44 22 44H42C44 44 46 42 46 40V36"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M24 28V32M32 26V32M40 28V32"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Circle cx="28" cy="38" r="2" fill="white" />
    <Circle cx="36" cy="38" r="2" fill="white" />
  </Svg>
);

// Cleaning Icon
export const CleaningIcon = ({ size = 64, color = '#06B6D4' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Rect x="28" y="16" width="8" height="20" rx="2" fill={color} />
    <Path
      d="M20 36L24 40L40 40L44 36L32 32L20 36Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M24 40V46M32 40V48M40 40V46"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Watching TV Icon
export const WatchingTVIcon = ({ size = 64, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" fill={color} opacity="0.2" />
    <Rect x="16" y="22" width="32" height="22" rx="2" fill={color} />
    <Rect x="20" y="26" width="24" height="14" fill="white" />
    <Circle cx="42" cy="30" r="2" fill="white" />
    <Circle cx="42" cy="36" r="2" fill="white" />
    <Path
      d="M28 18L32 22L36 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="28" y="44" width="8" height="4" fill={color} />
  </Svg>
);
