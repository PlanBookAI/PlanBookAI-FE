# PlanBook AI - Frontend

## Overview

PlanBook AI is an intelligent education management system that integrates AI to support teachers effectively. This is a modern Next.js 15 frontend application built with TypeScript, featuring a comprehensive landing page, secure authentication system, and teacher dashboard for managing lesson plans, exams, and educational content. The system is specifically designed for Vietnamese high school chemistry education but can be extended to other subjects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router for modern React development
- **Language**: TypeScript for type safety and better developer experience
- **Styling**: Tailwind CSS with custom design system using HSL color variables
- **UI Components**: Radix UI primitives with custom variants using class-variance-authority (cva)
- **State Management**: React hooks (useState, useEffect, useCallback) with Zustand for global state
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Authentication & Security
- **CAPTCHA Integration**: Cloudflare Turnstile with intelligent session management
- **Session Management**: Custom TurnstileSessionManager with 30-minute expiry
- **Authentication Flow**: JWT-based authentication with refresh tokens
- **Security Headers**: Custom Next.js headers for XSS protection, content type validation, and frame security
- **Route Protection**: Route groups for authenticated and public pages with middleware guards

### Component Architecture
- **Design System**: Consistent 4-color palette (primary blue, secondary indigo, light white, dark gray)
- **Layout Structure**: Modular layout components with navbar, footer, and section-based organization
- **UI Library**: Custom button, input, and form components with variant-based styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Data Layer
- **API Integration**: RESTful API communication with custom AuthService and LessonService
- **Type Safety**: Comprehensive TypeScript interfaces for API responses and data models
- **Error Handling**: Structured error handling with user-friendly messages
- **Data Fetching**: Native Fetch API with custom service layer abstraction

### Route Organization
- **Public Routes**: Landing page with hero, features, about, and contact sections
- **Auth Routes**: Login and register pages with CAPTCHA verification
- **Protected Routes**: User dashboard and management interfaces
- **API Routes**: Turnstile verification endpoint for server-side CAPTCHA validation

## External Dependencies

### Core Technologies
- **Next.js 15**: React framework with App Router and API routes
- **React 18**: UI library with hooks and concurrent features
- **TypeScript 5**: Static typing and enhanced development experience
- **Tailwind CSS 3**: Utility-first CSS framework with custom configuration

### UI & Styling
- **Radix UI**: Accessible component primitives (@radix-ui/react-slot)
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management
- **Tailwind Merge & clsx**: Utility for conditional and merged class names

### Form & Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for type-safe form handling
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### State & Data Management
- **Zustand**: Lightweight state management for global application state
- **TanStack React Query**: Server state management and caching
- **Axios**: HTTP client for API requests (alongside native fetch)

### Security & Authentication
- **Cloudflare Turnstile**: CAPTCHA service for bot protection
- **JWT**: Token-based authentication system
- **Custom Session Management**: Client-side session handling with expiry

### Development Tools
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting with Tailwind plugin
- **TypeScript ESLint**: Enhanced TypeScript linting rules

### Backend Integration
- **API Endpoint**: Configurable backend URL (default: http://localhost:8080)
- **Vietnamese Language Support**: All UI text and API responses in Vietnamese
- **Chemistry Subject Focus**: Specialized for high school chemistry education with grade levels 10-12