# cis_4120_project

## 🎵 Music Progress Tracker - MVP (Final Application)

**To run the complete MVP application**: Open `index.html` in the root directory in your web browser!

This comprehensive MVP integrates all prototypes into a cohesive music progress tracking application for students like Tim (our cello player persona).

### MVP Features:
- ✨ **Composer Gallery**: Visual organization by composer with emoji icons
- 📊 **Progress Tracking**: Track completion percentage for each piece
- 📄 **PDF Sheet Music Viewer**: Upload and view sheet music
- 📝 **Teacher Notes**: Click-to-add annotations on sheet music
- 📅 **Calendar View**: Visualize all pieces by due date
- 🎯 **Difficulty Indicators**: Color-coded easy/medium/hard badges
- 💾 **Data Persistence**: All data saved in browser localStorage

### Quick Start:
1. Open `index.html` in your web browser
2. Explore the pre-loaded sample data (4 composers, 4 pieces)
3. Add your own composers and pieces
4. Upload PDF sheet music and add annotations
5. View all deadlines on the calendar

---

## Assignment 5 - Implementation Prototypes

Our Implementation Prototypes for Assignment 5

### Instructions For Running Individual Prototypes

Clone the entire repository and enter it in VSCode, and to run a specific prototype, enter into that prototype's directory and click the Go Live button at the bottom of VSCode. For the LLM AI Prototype specifically, testing it requires an API Key that can be found in the google doc. If you want to test run it, you must create a config.js file in the same directory as the index.html file, and paste this code in it:

```javascript
const CONFIG = {
   MISTRAL_API_KEY: (INPUT SPECIFIC API KEY FOUND IN GOOGLE DOC SUBMISSION!)
};
```

Also, sometimes there may be a 429 error for this LLM part because we are using a free LLM API, so please click the Ask button again (multiple times if needed until the LLM works) if you encounter a 429 error.

### Available Prototypes:
1. **HelloWorld** - Basic React setup
2. **HelloStyles** - Design system with colors and typography
3. **file-manager** - File upload and organization
4. **pdf-highlighter-prototype** - PDF viewing with color highlighting
5. **llm-ai-prototype** - AI music learning assistant
6. **pdf-text-annotation-prototype** - PDF annotation with text notes

### AI Attribution
We used AI to aid us with debugging syntax issues.
