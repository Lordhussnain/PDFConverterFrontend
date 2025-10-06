# AI Development Rules

This document outlines the tech stack and provides clear rules for which libraries to use for specific functionalities within this application.

## Tech Stack

- **Framework**: React with Vite for a fast development experience.
- **Language**: TypeScript for type safety and improved code quality.
- **Styling**: Tailwind CSS for a utility-first styling approach.
- **Component Library**: shadcn/ui for a set of pre-built, accessible, and customizable React components.
- **Icons**: `lucide-react` for a comprehensive and consistent set of icons.
- **Routing**: `react-router-dom` for handling client-side navigation.
- **State Management**: `zustand` for simple and scalable global state management.
- **Data Fetching**: `@tanstack/react-query` for managing server state, including fetching, caching, and synchronization.

## Library Usage Rules

- **Styling**:
  - **ALWAYS** use Tailwind CSS for styling.
  - **DO NOT** write custom CSS in `.css` files unless absolutely necessary for global base styles.
  - **PRIORITIZE** using utility classes over creating custom component classes.

- **Components**:
  - **ALWAYS** check for an existing component in `src/components/ui/` (shadcn/ui) before creating a new one.
  - New, reusable custom components should be placed in `src/components/`.
  - Pages, which are components that represent a route, should be placed in `src/pages/`.

- **Icons**:
  - **ONLY** use icons from the `lucide-react` library to maintain visual consistency.

- **Routing**:
  - **ALL** application routes should be defined and managed using `react-router-dom`.
  - Keep route definitions centralized, preferably in `src/App.tsx`.

- **State Management**:
  - For local component state, use React's built-in hooks like `useState` and `useReducer`.
  - For global or shared state that needs to be accessed across multiple components, use `zustand`.

- **Data Fetching & Server State**:
  - **ALWAYS** use `@tanstack/react-query` for fetching, caching, and managing data from APIs.
  - **DO NOT** use `useEffect` with `fetch` for data fetching.

- **File Structure**:
  - **Pages**: `src/pages/`
  - **Reusable Components**: `src/components/`
  - **shadcn/ui Components**: `src/components/ui/`
  - **Utility Functions**: `src/lib/`
  - **Global State Stores**: `src/stores/`