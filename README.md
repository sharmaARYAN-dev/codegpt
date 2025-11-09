# UniVerse - Next.js Student Collaboration Platform

UniVerse is a comprehensive platform for college innovators, built with a modern, feature-rich stack. It's designed to facilitate collaboration, project management, and community engagement among students. This project is built with Next.js, React, TypeScript, and Tailwind CSS, featuring a backend powered by Firebase (Authentication, Firestore) and AI capabilities from Google's Genkit.

## Core Technologies

- **Framework**: Next.js 14
- **UI Library**: React 18 with ShadCN UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Backend**: Firebase (Authentication, Firestore)
- **AI**: Google Genkit

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js**: Version 20.x or later.
- **npm**: Version 10.x or later (or a compatible package manager like Yarn or pnpm).

## Getting Started

Follow these steps to get a local copy of the project up and running.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Set Up Firebase

This project requires a Firebase project to handle authentication and database storage.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your new project, navigate to **Project Settings** > **General**.
3.  Under "Your apps," create a new **Web app**.
4.  After creating the app, Firebase will provide you with a `firebaseConfig` object. Copy this object.
5.  In the root of this project, a file named `.env` is present. It is empty by default. **DO NOT** add your Firebase configuration there. Instead, create a new file at `src/firebase/config.ts`.
6.  Paste your `firebaseConfig` object into `src/firebase/config.ts` and export it. The file should look like this:

    ```typescript
    // src/firebase/config.ts
    export const firebaseConfig = {
      apiKey: "AIz...",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "...",
      appId: "1:...:web:...",
      measurementId: "G-..."
    };
    ```

7.  Enable **Google Authentication** in the Firebase Console by going to **Authentication** > **Sign-in method** and enabling the "Google" provider.
8.  Set up **Firestore**. Go to the **Firestore Database** section, create a database, and start in **production mode**. The required security rules are already included in the `firestore.rules` file in this project and will be deployed automatically by Firebase Studio.

### 3. Install Dependencies

Once your Firebase configuration is in place, install the project dependencies using npm:

```bash
npm install
```

### 4. Run the Development Servers

This project requires two separate development servers to be running simultaneously: one for the Next.js frontend and one for the Genkit AI backend.

1.  **Start the Next.js Frontend:**
    Open a terminal and run the following command. This will start the main web application.

    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:9002`.

2.  **Start the Genkit AI Backend:**
    Genkit powers the AI features. Open a **second terminal** and run this command to start the Genkit development server:

    ```bash
    npm run genkit:dev
    ```

With both servers running, you can now access the application and use all its features, including the AI-powered project idea generator.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://react.dev/) - learn about React.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [ShadCN UI Documentation](https://ui.shadcn.com/) - learn about the UI components used.
- [Genkit Documentation](https://firebase.google.com/docs/genkit) - learn about the AI framework.
- [Firebase Documentation](https://firebase.google.com/docs) - learn about Firebase services.
