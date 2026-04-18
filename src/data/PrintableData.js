import React from 'react';
import Svg, { Circle, Rect, Polygon, Path, Text as SvgText, G, Line } from 'react-native-svg';

export const PrintableCategories = [
  {
    id: 'coloring',
    title: 'Coloring Pages',
    subtitle: 'Outline shapes, animals & objects',
    color: '#EC4899', // Pink
    iconName: 'Shapes',
    items: [
      {
        id: 'c1',
        title: 'Color the Basic Shapes',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="50" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Color these shapes!</SvgText>
            <Circle cx="120" cy="150" r="70" stroke="#000" strokeWidth="4" fill="none" />
            <Rect x="220" y="100" width="120" height="120" stroke="#000" strokeWidth="4" fill="none" />
            <Polygon points="200,280 300,420 100,420" stroke="#000" strokeWidth="4" fill="none" />
          </Svg>
        )
      },
      {
        id: 'c2',
        title: 'Color the House',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="50" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Color the House!</SvgText>
            <Polygon points="200,80 350,220 50,220" stroke="#000" strokeWidth="5" fill="none" strokeLinejoin="round" />
            <Rect x="80" y="220" width="240" height="200" stroke="#000" strokeWidth="5" fill="none" />
            <Rect x="130" y="320" width="60" height="100" stroke="#000" strokeWidth="4" fill="none" />
            <Circle cx="180" cy="370" r="5" fill="#000" />
            <Rect x="230" y="260" width="60" height="60" stroke="#000" strokeWidth="4" fill="none" />
            <Line x1="260" y1="260" x2="260" y2="320" stroke="#000" strokeWidth="4" />
            <Line x1="230" y1="290" x2="290" y2="290" stroke="#000" strokeWidth="4" />
          </Svg>
        )
      },
      {
        id: 'c3',
        title: 'Color the Happy Sun',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
             <SvgText x="200" y="50" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Color the Sun!</SvgText>
             <Circle cx="200" cy="250" r="80" stroke="#000" strokeWidth="5" fill="none" />
             {/* Sun Rays */}
             <Line x1="200" y1="130" x2="200" y2="70" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="200" y1="370" x2="200" y2="430" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="80" y1="250" x2="20" y2="250" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="320" y1="250" x2="380" y2="250" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="115" y1="165" x2="70" y2="120" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="285" y1="335" x2="330" y2="380" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="285" y1="165" x2="330" y2="120" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             <Line x1="115" y1="335" x2="70" y2="380" stroke="#000" strokeWidth="5" strokeLinecap="round" />
             {/* Smiley Face */}
             <Circle cx="170" cy="230" r="8" fill="#000" />
             <Circle cx="230" cy="230" r="8" fill="#000" />
             <Path d="M160,270 Q200,310 240,270" stroke="#000" strokeWidth="5" fill="none" strokeLinecap="round" />
          </Svg>
        )
      },
      {
        id: 'c4',
        title: 'Color the Car',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
             <SvgText x="200" y="50" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Color the Car!</SvgText>
             {/* Car Body */}
             <Path d="M70,260 L100,200 L240,200 L300,260 L350,260 L350,320 L50,320 L50,260 Z" stroke="#000" strokeWidth="5" fill="none" strokeLinejoin="round" />
             {/* Windows */}
             <Path d="M110,210 L180,210 L180,260 L80,260 Z" stroke="#000" strokeWidth="4" fill="none" strokeLinejoin="round"/>
             <Path d="M190,210 L230,210 L280,260 L190,260 Z" stroke="#000" strokeWidth="4" fill="none" strokeLinejoin="round"/>
             {/* Wheels */}
             <Circle cx="130" cy="320" r="30" stroke="#000" strokeWidth="5" fill="#FFF" />
             <Circle cx="130" cy="320" r="10" stroke="#000" strokeWidth="3" fill="none" />
             <Circle cx="280" cy="320" r="30" stroke="#000" strokeWidth="5" fill="#FFF" />
             <Circle cx="280" cy="320" r="10" stroke="#000" strokeWidth="3" fill="none" />
          </Svg>
        )
      }
    ]
  },
  {
    id: 'fill-in',
    title: 'Number Fill-In',
    subtitle: 'Fill in the missing numbers',
    color: '#10B981', // Green
    iconName: 'Numbers',
    items: [
      {
        id: 'num1',
        title: 'Missing Numbers 1-5',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="80" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Fill in the missing numbers!</SvgText>
            <G y="50">
                <Rect x="40" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="80" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">1</SvgText>
                
                {/* Box 2 Blank */}
                <Path d="M140 230 L220 230" stroke="#000" strokeWidth="4" strokeDasharray="8,8" fill="none" />
                
                <Rect x="260" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="300" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">3</SvgText>
            </G>
            <G y="180">
                <Rect x="100" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="140" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">4</SvgText>

                {/* Box 5 Blank */}
                <Path d="M220 230 L300 230" stroke="#000" strokeWidth="4" strokeDasharray="8,8" fill="none" />
            </G>
          </Svg>
        )
      },
      {
        id: 'num2',
        title: 'Missing Numbers 6-10',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="80" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Fill in the missing numbers!</SvgText>
            <G y="50">
                <Path d="M40 230 L120 230" stroke="#000" strokeWidth="4" strokeDasharray="8,8" fill="none" />
                
                <Rect x="160" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="200" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">7</SvgText>
                
                <Path d="M280 230 L360 230" stroke="#000" strokeWidth="4" strokeDasharray="8,8" fill="none" />
            </G>
            <G y="180">
                <Rect x="100" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="140" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">9</SvgText>

                <Rect x="220" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="260" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">10</SvgText>
            </G>
          </Svg>
        )
      },
      {
        id: 'num3',
        title: 'Count by 2s',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="80" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Count by 2s!</SvgText>
            <G y="50">
                <Rect x="40" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="80" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">2</SvgText>
                
                <Path d="M140 230 L220 230" stroke="#000" strokeWidth="4" strokeDasharray="8,8" fill="none" />
                
                <Rect x="260" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="300" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">6</SvgText>
            </G>
            <G y="180">
                <Path d="M100 230 L180 230" stroke="#000" strokeWidth="4" strokeDasharray="8,8" fill="none" />

                <Rect x="220" y="150" width="80" height="80" stroke="#000" strokeWidth="4" fill="none" rx="8" />
                <SvgText x="260" y="205" fontSize="48" fontWeight="bold" fill="#000" textAnchor="middle">10</SvgText>
            </G>
          </Svg>
        )
      }
    ]
  },
  {
    id: 'tracing',
    title: 'Line Tracing',
    subtitle: 'Motor skills, paths & curves',
    color: '#8B5CF6', // Purple
    iconName: 'Tracing',
    items: [
      {
        id: 't1',
        title: 'Straight & Zig-Zag',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="60" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Trace the paths to the stars!</SvgText>
            
            {/* Straight Path */}
            <Circle cx="50" cy="140" r="15" fill="#374151" />
            <Path d="M70,140 L320,140" stroke="#000" strokeWidth="5" strokeDasharray="10,12" fill="none" strokeLinecap="round" />
            <Polygon points="350,125 360,150 380,150 365,165 370,185 350,170 330,185 335,165 320,150 340,150" fill="#374151" />

            {/* Zig-Zag Path */}
            <Circle cx="50" cy="280" r="15" fill="#374151" />
            <Path d="M70,280 L120,230 L170,330 L220,230 L270,330 L320,280" stroke="#000" strokeWidth="5" strokeDasharray="10,12" fill="none" strokeLinejoin="round" />
            <Polygon points="350,265 360,290 380,290 365,305 370,325 350,310 330,325 335,305 320,290 340,290" fill="#374151" />
          </Svg>
        )
      },
      {
        id: 't2',
        title: 'Curvy Paths',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="60" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Trace the curvy lines!</SvgText>
            
            {/* Wavy */}
            <Circle cx="50" cy="150" r="15" fill="#374151" />
            <Path d="M70,150 Q110,80 150,150 T230,150 T310,150" stroke="#000" strokeWidth="5" strokeDasharray="12,12" fill="none" strokeLinecap="round" />
            <Circle cx="340" cy="150" r="20" fill="none" stroke="#000" strokeWidth="4" />
            <Circle cx="340" cy="150" r="10" fill="#374151" />

            {/* Loops */}
            <Circle cx="50" cy="300" r="15" fill="#374151" />
            <Path d="M70,300 C120,150 160,450 200,300 C240,150 280,450 310,300" stroke="#000" strokeWidth="5" strokeDasharray="12,12" fill="none" strokeLinecap="round" />
            <Circle cx="340" cy="300" r="20" fill="none" stroke="#000" strokeWidth="4" />
            <Circle cx="340" cy="300" r="10" fill="#374151" />
          </Svg>
        )
      },
      {
        id: 't3',
        title: 'Trace Shapes',
        renderImage: () => (
          <Svg width="100%" height="100%" viewBox="0 0 400 500">
            <SvgText x="200" y="60" fontSize="24" fontWeight="bold" fill="#000" textAnchor="middle">Trace the shapes!</SvgText>
            
            {/* Square */}
            <Rect x="60" y="100" width="120" height="120" stroke="#000" strokeWidth="5" strokeDasharray="12,12" fill="none" />
            
            {/* Triangle */}
            <Polygon points="280,100 350,220 210,220" stroke="#000" strokeWidth="5" strokeDasharray="12,12" fill="none" strokeLinejoin="round" />

            {/* Big Circle */}
            <Circle cx="200" cy="350" r="80" stroke="#000" strokeWidth="5" strokeDasharray="12,12" fill="none" />
          </Svg>
        )
      }
    ]
  }
];
