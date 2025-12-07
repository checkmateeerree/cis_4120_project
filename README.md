# Music Learning Organizer

A comprehensive web application for organizing and managing your music learning journey. Track composers, pieces, practice schedules, and progress all in one place.

## Features

- **Composer Management**: Add composers with portraits and organize their pieces
- **Piece Tracking**: Upload PDF sheet music, set due dates, and track practice progress
- **PDF Viewer**: View sheet music with highlighting and note-taking capabilities
- **Section Tagging**: Tag sections of pieces with status labels (Difficult, Review, Mastered, Practice, Focus)
- **Progress Tracking**: Track pages completed and total pages for each piece
- **Calendar View**: Visualize all pieces and their due dates in a monthly calendar
- **Search Functionality**: Quickly search and find pieces across all composers
- **AI Assistants**: Get AI-powered assistance for pieces and calendar planning (requires Mistral API key)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

You can verify your installation by running:
```bash
node --version
npm --version
```

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd final_project_code
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages including React, Vite, and other dependencies.

## Configuration

The app requires a Mistral API key for AI assistant features. You need to configure this before running the app.

1. **Create or edit `config.js`** in the root directory:
   ```javascript
   window.CONFIG = {
     MISTRAL_API_KEY: 'your-mistral-api-key-here'
   };
   ```

2. **Get a Mistral API key**:
   - Visit [Mistral AI](https://mistral.ai/) to sign up and get an API key
   - Replace `'your-mistral-api-key-here'` with your actual API key

   **Note**: Alternatively, please refer to Assignment Doc A5 to find a usable Mistral API Key.

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use). The development server includes hot module replacement, so changes will automatically reload in the browser.

## Project Structure

```
final_project_code/
├── config.js                 # API configuration (create this file)
├── index.html                # Main HTML entry point
├── package.json              # Project dependencies and scripts
├── vite.config.js           # Vite configuration
├── src/
│   ├── main.jsx             # React application entry point
│   ├── App.jsx              # Main app component with routing logic
│   ├── index.css            # Global styles
│   ├── constants.js         # Tag definitions and constants
│   ├── utils.js             # Utility functions
│   └── components/
│       ├── HomePage.jsx              # Home page with composer grid
│       ├── AddComposerPage.jsx      # Form to add new composers
│       ├── ComposerPage.jsx         # Individual composer view
│       ├── PiecePage.jsx            # Individual piece view with PDF
│       ├── AddPieceForm.jsx         # Form to add new pieces
│       ├── CalendarPage.jsx         # Calendar view of pieces
│       ├── CalendarAIAssistant.jsx  # AI assistant for calendar
│       ├── PieceAIAssistant.jsx     # AI assistant for pieces
│       ├── PdfHighlighterViewer.jsx # PDF viewer with highlighting
│       ├── ProgressModal.jsx        # Progress tracking modal
│       ├── SearchOverlay.jsx        # Search functionality
│       └── BottomNav.jsx            # Bottom navigation bar
└── node_modules/            # Dependencies (generated)
```

## Technologies Used

- **React 18.2.0**: UI framework
- **Vite 5.0.8**: Build tool and development server
- **PDF.js**: PDF rendering and manipulation
- **Feather Icons**: Icon library
- **Mistral AI**: AI assistant features
- **Inter Font**: Typography

## Usage

1. **Start the app** using `npm run dev`
2. **Add a composer** by clicking "Add your first composer" or the "+ Add Composer" button
3. **Upload a portrait** (optional) and enter the composer's name
4. **Add pieces** to composers by navigating to a composer page
5. **Upload PDF sheet music** for each piece and set a due date
6. **View pieces** to see the PDF viewer, tag sections, and track progress
7. **Use the calendar** to see all pieces organized by due date
8. **Search** for pieces using the search icon in the bottom navigation

## Data Storage

**Note**: This application currently stores all data in browser memory (React state). This means:
- Data is **not persisted** between browser sessions
- Refreshing the page will reset all data
- Data is stored locally in the current browser session only

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port number.

### API Key Issues
If AI features aren't working:
- Verify your `config.js` file exists and contains a valid API key
- Check the browser console for any error messages
- Ensure the API key is correctly formatted as a string

### PDF Not Loading
- Ensure the PDF file is a valid PDF format
- Check browser console for any PDF.js errors
- Try a different PDF file to rule out file-specific issues

## Development

### Adding New Features
- Components are located in `src/components/`
- Main app logic is in `src/App.jsx`
- Styles are in `src/index.css`
- Utility functions are in `src/utils.js`

### Code Style
- Uses functional React components with hooks
- ES6+ JavaScript features
- CSS custom properties for theming

## License

This project is part of a coursework assignment.

## AI Code Attribution

AI tools were used to debug syntax issues during development.
