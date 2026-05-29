import React, { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GradientTextProps {
  children: ReactNode;
  from?: string;
  to?: string;
  className?: string;
  as?: React.ElementType;
}

export default function GradientText({
  children,
  from = '#00ffff',
  to = '#40e56c',
  className = '',
  as: Tag = 'span',
}: GradientTextProps) {
  return (
    <Tag
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {children}
    </Tag>
  );
}
