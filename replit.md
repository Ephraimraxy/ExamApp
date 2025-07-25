# Online Examination System

## Overview

This is a simplified full-stack web application for online student tests and examinations built with React (frontend), Express.js (backend), PostgreSQL (database), and TypeScript. The system is designed for direct exam setup and testing without authentication, featuring multiple question types, one-question-per-page interface, automatic grading, and results export capabilities.

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
- **Database**: Firebase Firestore (NoSQL document database)
- **Session Management**: Express sessions with in-memory store
- **Authentication**: Session-based auth with bcrypt password hashing (simplified - no login required)
- **API Design**: RESTful endpoints with proper error handling
- **Firebase Integration**: Firestore for data persistence with real-time capabilities
- **Migration Status**: Successfully migrated from PostgreSQL to Firebase Firestore with string-based IDs

### Build & Development
- **Bundler**: Vite for frontend development and building
- **Development**: Hot module replacement with Vite middleware
- **Production**: esbuild for backend bundling
- **TypeScript**: Strict mode enabled with shared types

## Key Components

### Simplified Access System
- No authentication required - direct access to all features
- Students provide name and email when starting exams
- Public exam creation and management
- Open access to all exam results and analytics

### Database Schema (Firebase Firestore)
- **Users**: Authentication and role management stored in Firebase
- **Exams**: Test configuration and scheduling in Firestore collections
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

### Exam Setup Workflow
1. Anyone can access the home page to create exams
2. Creates exams with questions, duration, and scheduling
3. Multiple question types: MCQ, True/False, Fill-in-the-Blank
4. Activates exams for public access

### Student Testing Workflow
1. Students access available exams without login
2. Provides name and email to start exam session
3. One-question-per-page interface with navigation
4. Timer with automatic submission when time expires
5. Immediate results with detailed scoring
6. Results export as CSV/PDF

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
- Firebase Firestore for real-time data persistence
- String-based IDs with Firebase document references
- In-memory filtering to avoid complex indexing requirements
- Automatic timestamp conversion for date fields

## Recent Changes (July 24, 2025)

### Firebase Migration & Bug Fixes
- **Completed**: Successfully migrated from PostgreSQL to Firebase Firestore
- **Fixed**: Missing /student route causing 404 errors
- **Fixed**: Timer component setState during render warning with deferred callback
- **Fixed**: Firebase indexing issues by implementing in-memory filtering for complex queries
- **Implemented**: Direct results navigation from exam records table to avoid question selection step
- **Modified**: Edit functionality now creates new exam records instead of updating existing ones
- **Fixed**: All-results page properly handles URL parameters for direct exam access

### User Interface Improvements
- **Enhanced**: Exam records page with proper Results button navigation
- **Fixed**: View Results page implementation with proper data loading
- **Improved**: Error handling throughout the application
- **Added**: Comprehensive exam attempt tracking and percentage calculations