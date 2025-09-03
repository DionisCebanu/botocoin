import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Donut = ({ size=58 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="28" fill="#FDE68A"/>
    <circle cx="32" cy="32" r="28" stroke="#D97706" strokeWidth="3"/>
    <circle cx="32" cy="32" r="11" fill="white" opacity=".9"/>
    <g stroke="#EA580C" strokeWidth="3" strokeLinecap="round">
      <path d="M18 25l5 2"/><path d="M26 20l3 3"/><path d="M44 24l-4 2"/>
      <path d="M24 40l-3 2"/><path d="M40 42l3 2"/>
    </g>
  </svg>
);

const Bean = ({ size=48 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <path d="M42 14c8 6 9 18 2 26s-18 8-26 2c-9-7-9-19-2-26 6-6 18-8 26-2Z"
      fill="#8B5E3C" opacity=".9"/>
    <path d="M27 14c7 8 10 20 2 30" stroke="#E7C9A3" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const Sprinkle = ({ w=36, h=6 }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
    <rect x="0" y="0" width={w} height={h} rx="3" fill="#F59E0B"/>
  </svg>
);

const items = [
  { comp: Donut,    style:{ top:'8%',  left:'6%'  }, delay:0   },
  { comp: Bean,     style:{ top:'20%', right:'8%' }, delay:.35 },
  { comp: Sprinkle, style:{ top:'34%', left:'12%' }, delay:.7  },
  { comp: Donut,    style:{ top:'12%', right:'18%'}, delay:.2  },
  { comp: Bean,     style:{ bottom:'14%', left:'10%'}, delay:.55 },
];

export default function FlyingDecor({ className = '' }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0', className)}>
      {items.map(({ comp:Icon, style, delay }, i) => (
        <motion.div key={i} className="absolute"
          style={style}
          animate={{ y:[0,-14,0], rotate:[0,8,0] }}
          transition={{ duration:6, delay, repeat:Infinity, ease:'easeInOut' }}>
          <Icon/>
        </motion.div>
      ))}
    </div>
  );
}