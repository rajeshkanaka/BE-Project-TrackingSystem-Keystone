# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Keystone College of Engineering Final Year Computers Project Tracking System** - a React-based web application for managing and tracking final year computer engineering student projects through multiple review stages.

The application allows:
- Creating and managing student project entries
- Importing project lists from text using AI parsing
- Tracking projects through 5 review stages (Review I, Development Start, Mid-Development, Development Complete, Final Presentation)
- AI-powered feedback enhancement for project reviews
- Local storage persistence of all project data

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

### Browser Environment Authentication

**Important**: Due to browser security limitations, this application requires a Gemini API key even when using Vertex AI. The @google/genai SDK ignores `project` and `location` parameters in browser environments.

Create a `.env.local` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

To obtain a Gemini API key:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### Server Environment (Node.js)

For server-side implementations, you can use Vertex AI authentication:
```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_LOCATION="us-central1"
export GOOGLE_GENAI_USE_VERTEXAI=1
```

The vite.config.ts handles environment variable injection for the frontend build.

## Architecture Overview

### Core Application Structure

- **App.tsx**: Main application component managing global state and routing between project list and project views
- **types.ts**: Central TypeScript definitions for all data structures
- **constants.ts**: Defines the 5 project review stages with their respective evaluation questions

### State Management

- Uses React's built-in state management with custom `useLocalStorage` hook
- All project data persists in browser localStorage
- No external state management library (Redux, Zustand, etc.)

### Key Data Flow

1. **Project Creation**: Manual entry via ProjectForm or AI-powered import via ImportForm
2. **Project Storage**: Automatic localStorage persistence through useLocalStorage hook
3. **Review Process**: Projects progress through predefined stages with structured questionnaires
4. **AI Integration**: Gemini API enhances reviewer feedback and parses imported project lists

### Component Architecture

**Core Components:**
- `ProjectList`: Displays all projects with CRUD operations
- `ProjectView`: Detailed project view with stage navigation via StageTabs
- `ProjectTracker`: Handles individual stage review forms
- `ReviewForm`: Structured questionnaire forms for each review stage

**Utility Components:**
- `ImportForm`: AI-powered text parsing for bulk project import
- `ProjectForm`: Manual project creation form
- `Header/Footer`: Layout components

### AI Integration (services/geminiService.ts)

Two primary AI functions:
- `getAIFeedback()`: Enhances reviewer remarks with AI suggestions
- `parseProjectList()`: Converts raw text into structured project data

Uses Vertex AI authentication instead of API keys. Both functions gracefully handle missing environment variables and provide fallback messaging.

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini API (@google/genai)
- **Styling**: Tailwind CSS (inferred from className usage)
- **Storage**: Browser localStorage
- **Node Version**: Requires Node.js (no specific version constraint)

## File Structure Notes

- No test files present - consider this when adding new features
- No linting configuration detected - consider adding ESLint/Prettier
- Environment variables handled through Vite's loadEnv system
- Project uses ES modules throughout (type: "module" in package.json)

## Development Workflow

Since no testing framework is configured, manual testing in the browser is required. The application is entirely client-side with no backend dependencies beyond the Gemini API for AI features.

When working with this codebase:
1. Changes require manual browser testing
2. AI features need valid Vertex AI environment variables to function
3. All data is stored locally - clearing browser storage will reset the application
4. Project stages are hardcoded in constants.ts and changing them may affect existing data