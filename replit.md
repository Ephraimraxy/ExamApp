# Online Examination System

## Overview

This is a full-stack web application for online student tests and examinations built with React (frontend), Express.js (backend), PostgreSQL (database), and TypeScript. The system is designed for reliability, security, user-friendliness, and auto-grading efficiency, supporting both administrators (teachers/examiners) and students with role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Session-based auth with bcrypt password hashing
- **API Design**: RESTful endpoints with proper error handling

### Build & Development
- **Bundler**: Vite for frontend development and building
- **Development**: Hot module replacement with Vite middleware
- **Production**: esbuild for backend bundling
- **TypeScript**: Strict mode enabled with shared types

## Key Components

### Authentication System
- Session-based authentication using express-session
- Password hashing with bcrypt
- Role-based access control (admin/student)
- Protected routes with middleware validation

### Database Schema
- **Users**: Authentication and role management
- **Exams**: Test configuration and scheduling
- **Questions**: Multiple choice, true/false, and fill-in-the-blank support
- **Exam Attempts**: Student test sessions and progress tracking
- **Answers**: Student responses with auto-grading capability

### User Interface Components
- Role-specific dashboards (admin/student)
- Real-time exam interface with timer
- Question navigator for exam navigation
- Results display with detailed scoring
- Responsive design for various screen sizes

## Data Flow

### Admin Workflow
1. Admin logs in and accesses admin dashboard
2. Creates exams with questions, duration, and scheduling
3. Activates exams for student access
4. Views student results and performance analytics

### Student Workflow
1. Student logs in and sees available exams
2. Starts exam session with timer initialization
3. Navigates through questions with progress tracking
4. Submits exam automatically or manually
5. Views results with detailed scoring breakdown

### Exam Session Management
- Real-time timer with automatic submission
- Answer persistence during exam session
- Question marking for review
- Progress tracking and navigation
- Auto-save functionality to prevent data loss

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **express-session**: Session management
- **bcrypt**: Password security
- **zod**: Runtime type validation

### UI Components
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form state management

### Development Tools
- **vite**: Development server and build tool
- **typescript**: Type safety
- **drizzle-kit**: Database migrations
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express middleware integration
- Environment-based configuration
- Replit-specific development features

### Production Build
- Frontend: Vite build to static assets
- Backend: esbuild bundle for Node.js
- Database: PostgreSQL with connection pooling
- Session storage: PostgreSQL-backed sessions

### Environment Configuration
- Database URL for PostgreSQL connection
- Session secret for secure authentication
- Node environment detection
- Development vs production optimizations

### Database Management
- Drizzle migrations for schema updates
- Connection pooling for performance
- WebSocket support for serverless deployment
- Automatic schema validation and type generation