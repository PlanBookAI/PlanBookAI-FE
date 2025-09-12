'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroSidebarProps {
  children: ReactNode;
  variant?: 'default' | 'compact';
  position?: 'left' | 'right';
  className?: string;
  width?: 'sm' | 'md' | 'lg';
}

export function HeroSidebar({ 
  children, 
  variant = 'default', 
  position = 'right',
  className,
  width = 'md'
}: HeroSidebarProps) {
  const widthClasses = {
    sm: 'w-64',
    md: 'w-72',
    lg: 'w-80'
  };

  const positionClasses = {
    left: 'order-first',
    right: 'order-last'
  };

  const variantClasses = {
    default: 'p-6',
    compact: 'p-4'
  };

  return (
    <aside className={cn(
      'hidden lg:flex lg:flex-col',
      widthClasses[width],
      positionClasses[position],
      'bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20',
      variantClasses[variant],
      className
    )}>
      {children}
    </aside>
  );
}

// Hero Sidebar Content Components for common patterns
interface HeroSidebarSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function HeroSidebarSection({ title, children, className }: HeroSidebarSectionProps) {
  return (
    <div className={cn('mb-6 last:mb-0', className)}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface HeroSidebarActionProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  href?: string;
  badge?: string;
  className?: string;
}

export function HeroSidebarAction({ 
  icon, 
  label, 
  description, 
  onClick, 
  href, 
  badge,
  className 
}: HeroSidebarActionProps) {
  const baseClasses = cn(
    'w-full flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-white hover:bg-opacity-15 transition-all duration-200 group',
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <div className="w-8 h-8 flex items-center justify-center text-white group-hover:text-blue-100">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-white group-hover:text-blue-50">{label}</div>
          {description && (
            <div className="text-sm text-blue-200 group-hover:text-blue-100">{description}</div>
          )}
        </div>
        {badge && (
          <span className="text-xs bg-white bg-opacity-30 text-white px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
    >
      <div className="w-8 h-8 flex items-center justify-center text-white group-hover:text-blue-100">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-white group-hover:text-blue-50">{label}</div>
        {description && (
          <div className="text-sm text-blue-200 group-hover:text-blue-100">{description}</div>
        )}
      </div>
      {badge && (
        <span className="text-xs bg-white bg-opacity-30 text-white px-2 py-1 rounded">
          {badge}
        </span>
      )}
    </button>
  );
}

interface HeroSidebarStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

export function HeroSidebarStats({ stats }: HeroSidebarStatsProps) {
  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-10 rounded-lg">
          <div className="flex items-center space-x-3">
            {stat.icon && (
              <div className="w-6 h-6 text-blue-200">
                {stat.icon}
              </div>
            )}
            <span className="text-sm text-blue-100">{stat.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">{stat.value}</span>
            {stat.trend && (
              <div className={cn(
                'w-3 h-3',
                stat.trend === 'up' && 'text-green-300',
                stat.trend === 'down' && 'text-red-300',
                stat.trend === 'neutral' && 'text-blue-300'
              )}>
                {stat.trend === 'up' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                )}
                {stat.trend === 'down' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                )}
                {stat.trend === 'neutral' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}