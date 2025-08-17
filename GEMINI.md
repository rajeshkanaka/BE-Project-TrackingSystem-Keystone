# GEMINI.md: Project Tracking System

## Project Overview

This is a web application designed as a Project Tracking System for the final year computer engineering students at Keystone College of Engineering. The application allows for the management of student projects, including tracking their progress through various review stages.

**Key Technologies:**

*   **Frontend:** React, TypeScript, Vite
*   **AI Integration:** Google Generative AI (Gemini)
*   **Styling:** Tailwind CSS (inferred from class names)
*   **Storage:** IndexedDB with `localStorage` fallback for persistent data storage.

**Core Features:**

*   Create, view, update, and delete projects.
*   Import projects from a raw text list using AI-powered parsing.
*   Track project progress through predefined review stages.
*   Provide AI-generated feedback on project reviews.
*   Backup and restore project data.

## Building and Running

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**

    Create a file named `.env.local` in the root of the project and add your Gemini API key:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Run in Development Mode:**

    ```bash
    npm run dev
    ```

4.  **Build for Production:**

    ```bash
    npm run build
    ```

5.  **Preview Production Build:**

    ```bash
    npm run preview
    ```

## Development Conventions

*   **TypeScript:** The project uses TypeScript for static typing. All new code should be written in TypeScript.
*   **Component-Based Architecture:** The UI is built with React components, which are located in the `src/components` directory.
*   **Hooks:** Reusable logic is extracted into custom hooks, found in the `src/hooks` directory.
*   **Services:** External API interactions, particularly with the Gemini API, are handled in the `src/services` directory.
*   **State Management:** Application state is managed using React hooks (`useState`, `useEffect`, `useCallback`).
*   **Data Persistence:** The `usePersistentStorage` hook is used for storing data in IndexedDB, ensuring data is not lost on page refresh.
*   **Types:** All custom types are defined in `src/types.ts`.
*   **Constants:** Application-wide constants, such as the review stages, are defined in `src/constants.ts`.
