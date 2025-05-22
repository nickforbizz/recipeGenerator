
# PhotoRecipe App - Powered by Firebase Studio

Welcome to PhotoRecipe, an innovative application built with Next.js and Genkit! This app allows you to take a photo of food, automatically detect the ingredients, and then receive AI-powered recipe suggestions.

## How It Works

The PhotoRecipe app simplifies your cooking process with a seamless workflow:

1.  **Upload a Photo**: Start by uploading a clear image of your food item(s) or a dish. The app uses this image to identify potential ingredients.
2.  **AI-Powered Ingredient Detection**: Leveraging Google's Gemini model via Genkit, the app analyzes the uploaded photo and attempts to detect the ingredients present.
3.  **Review and Edit Ingredients**: Once the ingredients are detected, you'll see a list. You can:
    *   Review the AI-detected ingredients.
    *   Manually add any ingredients the AI might have missed.
    *   Remove any incorrectly identified ingredients.
4.  **Get Recipe Suggestions**: With your finalized list of ingredients, click "Get Recipes." The app will again use Genkit to query an AI model, this time to suggest recipes that can be made with those ingredients.
5.  **View and Use Recipes**: Each suggested recipe will include:
    *   The recipe name.
    *   Detailed, step-by-step preparation instructions.
6.  **Download and Share**:
    *   **Download PDF**: You can download any recipe as a PDF document for offline use.
    *   **Share on X (Twitter)**: Directly share a link to the recipe (or its details) on X.
    *   **Copy for Instagram/TikTok**: Copy the recipe text to your clipboard, ready to be pasted into your Instagram or TikTok posts.

## Key Features

*   **Visual Ingredient Recognition**: Upload a photo and let AI do the initial work of identifying ingredients.
*   **Interactive Ingredient List**: Easily modify the ingredient list to ensure accuracy.
*   **AI Recipe Generation**: Get creative recipe ideas based on your specific ingredients.
*   **Detailed Instructions**: Each recipe comes with comprehensive steps.
*   **Export & Share**: Save recipes as PDFs or share them on popular social media platforms.
*   **Modern UI**: Built with ShadCN UI components and Tailwind CSS for a clean and responsive user experience.
*   **Toast Notifications**: User-friendly feedback for actions like ingredient detection, recipe generation, and sharing.

## Tech Stack

*   **Frontend**: Next.js (React framework)
*   **AI Integration**: Genkit (for connecting to Google's Gemini models)
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **PDF Generation**: jspdf

## Getting Started

To explore the app's functionality:

1.  Ensure you have Node.js and npm (or yarn) installed.
2.  Clone the repository.
3.  Install dependencies: `npm install` (or `yarn install`).
4.  Set up your `.env` file with any necessary API keys for Genkit/Google AI.
5.  Run the development server: `npm run dev`.
6.  Open your browser to `http://localhost:9002` (or the port specified in your `dev` script).

The main application logic can be found in `src/app/page.tsx` and the client-side component `src/components/photo-recipe-client-page.tsx`. The AI flows are located in `src/ai/flows/`.
