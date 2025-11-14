# Music Progress Tracker - MVP Documentation

## Table of Contents
1. [Overview](#overview)
2. [User Persona & Requirements](#user-persona--requirements)
3. [Feature Mapping](#feature-mapping)
4. [Technical Architecture](#technical-architecture)
5. [Component Reference](#component-reference)
6. [User Guide](#user-guide)
7. [Data Model](#data-model)
8. [Prototype Integration](#prototype-integration)

---

## Overview

The Music Progress Tracker MVP is a comprehensive frontend application designed specifically for music students who need to manage multiple pieces of music, track progress, organize teacher feedback, and meet performance deadlines.

### Key Innovation Points

1. **Visual Navigation**: Composer pictures instead of text lists for more engaging interaction
2. **Integrated Annotations**: Teacher notes embedded directly in sheet music
3. **Progress Visualization**: Percentage-based tracking with visual progress bars
4. **Calendar Integration**: Due dates visualized on a monthly calendar
5. **All-in-One Interface**: Consolidates scattered notes, PDFs, and tracking into one place
6. **Color-Coded Difficulty**: Easy visual prioritization of practice sessions

---

## User Persona & Requirements

### Tim - Cello Student at Music School

**Daily Routine**:
- Practices 3-6 hours daily
- Works on multiple pieces simultaneously (solo, chamber, orchestral)
- Receives feedback from teachers
- Manages various performance deadlines

**Current Pain Points**:
- ✗ Paper and pencil notes get scattered and lost
- ✗ Google Docs not kept up-to-date
- ✗ Hard to manage multiple pieces with different deadlines
- ✗ Difficult to track progress pace across varying difficulty levels
- ✗ Teacher comments get lost in piles of paper

**How This MVP Helps**:
- ✓ Digital notes stored with each piece, never lost
- ✓ Visual composer organization for quick navigation
- ✓ Calendar view shows all deadlines at a glance
- ✓ Progress percentage shows exactly where you are
- ✓ Difficulty badges help prioritize practice time
- ✓ Teacher notes embedded directly in sheet music

---

## Feature Mapping

### From Narrative Scenario to Implementation

| Narrative Feature | MVP Implementation | Status |
|-------------------|-------------------|--------|
| Pictures of composers on homepage | Composer Gallery with emoji avatars | ✅ Implemented |
| Click composer to see pieces | ComposerView component with piece list | ✅ Implemented |
| Click piece to see music & progress | PieceDetailView with PDF viewer | ✅ Implemented |
| Progress as percentage | Adjustable slider (0-100%) with visual bar | ✅ Implemented |
| Difficulty ratings | Color-coded badges (easy/medium/hard) | ✅ Implemented |
| Teacher notes in music | Click-to-add annotation markers on PDF | ✅ Implemented |
| Calendar for due dates | Full calendar view with monthly navigation | ✅ Implemented |
| Track when pieces are due | Each piece has due date displayed everywhere | ✅ Implemented |
| Alert based on progress | Visual indicators on calendar (future: alerts) | 🔄 Partial |

---

## Technical Architecture

### Technology Stack

```
┌─────────────────────────────────────┐
│         React 18 (CDN)              │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌─────────────────┐ │
│  │  PDF.js  │  │  LocalStorage   │ │
│  └──────────┘  └─────────────────┘ │
├─────────────────────────────────────┤
│         Babel Standalone            │
├─────────────────────────────────────┤
│    Browser APIs (Canvas, File)      │
└─────────────────────────────────────┘
```

**No Build Process Required**:
- All dependencies loaded via CDN
- Single HTML file with embedded CSS and JavaScript
- Can run directly in browser (just open index.html)

### Design System

**Colors** (from HelloStyles prototype):
```css
--dominant: #0A0A18   /* Dark backgrounds, text */
--secondary: #C3C3E1  /* Secondary elements */
--red: #FF3A3A        /* Hard difficulty, alerts */
--yellow: #FFD747     /* Medium difficulty */
--green: #65DC65      /* Easy difficulty, success */
--blue: #6577FF       /* Primary actions, active states */
--purple: #B17AFE     /* Accents, gradients */
```

**Typography**:
- Font: Inter (Google Fonts)
- Weights: 400 (regular), 600 (semibold), 700 (bold)
- Sizes: Responsive rem-based sizing

---

## Component Reference

### 1. App (Root Component)
**Purpose**: Main router and state manager

**State**:
- `view`: Current view ('home' | 'composer' | 'piece' | 'calendar')
- `selectedComposer`: Currently selected composer object
- `selectedPiece`: Currently selected piece object
- `composers`: Array of all composers
- `pieces`: Array of all pieces
- `showModal`: Boolean for modal visibility
- `modalType`: Type of modal to show

**Methods**:
- `loadData()`: Loads data from localStorage
- `saveComposers()`: Persists composers to localStorage
- `savePieces()`: Persists pieces to localStorage
- `navigateToComposer()`: Navigate to composer view
- `navigateToPiece()`: Navigate to piece detail
- `navigateHome()`: Return to homepage

### 2. Header
**Props**: `view`, `setView`, `openModal`

**Features**:
- Navigation buttons (Home, Calendar)
- Active state highlighting
- Add Composer button

### 3. HomeView
**Props**: `composers`, `pieces`, `navigateToComposer`, `openModal`

**Features**:
- Statistics dashboard (3 stat cards):
  - Total pieces count
  - Average progress percentage
  - Upcoming deadlines (within 7 days)
- Composer gallery grid
- Empty state when no composers

**Stats Calculations**:
```javascript
totalPieces = pieces.length
avgProgress = sum(pieces.progress) / pieces.length
upcomingDeadlines = count(pieces where dueDate <= today + 7 days)
```

### 4. ComposerView
**Props**: `composer`, `pieces`, `navigateToPiece`, `navigateHome`, `openModal`

**Features**:
- Back to home navigation
- Composer header with emoji and name
- Piece count display
- List of all pieces for this composer
- Add Piece button
- Each piece shows:
  - Title
  - Due date
  - Difficulty badge
  - Progress percentage
  - Progress bar

### 5. PieceDetailView
**Props**: `piece`, `pieces`, `savePieces`, `navigateHome`, `composers`

**State**:
- `annotations`: Array of annotation objects
- `pdfDoc`: Loaded PDF document object

**Features**:
- Back navigation
- Piece metadata header
- Progress slider (0-100%)
- PDF upload button
- PDF canvas viewer
- Click-to-annotate functionality
- Annotation markers with popups

**PDF Handling**:
```javascript
1. User uploads PDF file
2. FileReader converts to data URL
3. PDF.js loads the document
4. Canvas renders first page at 1.5x scale
5. Click events add annotation markers
```

**Annotation System**:
- Click on canvas creates marker at (x, y)
- Marker shows "+" when empty, "📝" when filled
- Click marker to open popup
- Edit/Save/Delete actions
- Annotations saved to localStorage

### 6. AnnotationMarker
**Props**: `annotation`, `updateAnnotation`, `deleteAnnotation`

**State**:
- `isEditing`: Boolean for edit mode
- `showPopup`: Boolean for popup visibility
- `text`: Current text content

**Behavior**:
- Auto-opens in edit mode when created
- Shows text in read mode after saving
- Positioned absolutely on canvas

### 7. CalendarView
**Props**: `pieces`, `composers`, `navigateToPiece`

**State**:
- `currentDate`: Currently displayed month

**Features**:
- Month/year header
- Previous/Next month navigation
- 7-column grid (Sun-Sat)
- 6-week view (42 days total)
- Today highlighting
- Piece cards on due dates
- Click piece to navigate to detail

**Calendar Logic**:
```javascript
1. Calculate first day of month
2. Add previous month overflow days
3. Add current month days (1 to last day)
4. Add next month overflow to fill 6 weeks
5. Match pieces to dates by dueDate
```

### 8. Modal
**Props**: `type`, `closeModal`, `composers`, `saveComposers`, `pieces`, `savePieces`, `selectedComposer`

**Types**:
- `'addComposer'`: Form to add new composer
- `'addPiece'`: Form to add new piece

**Form Fields**:

**Add Composer**:
- Name (text input, required)
- Emoji (text input, default: 🎵)

**Add Piece**:
- Title (text input, required)
- Difficulty (select: easy/medium/hard)
- Due Date (date input, required)
- Initial Progress (range slider: 0-100)

---

## User Guide

### Getting Started

1. **First Launch**:
   - Open `index.html` in your browser
   - See sample data pre-loaded (4 composers, 4 pieces)
   - Explore the interface

2. **Adding Your First Composer**:
   - Click "Add Composer" in header
   - Enter name (e.g., "Brahms")
   - Choose emoji (e.g., "🎺")
   - Click "Add Composer"

3. **Adding a Piece**:
   - Click on a composer card
   - Click "+ Add Piece"
   - Fill in piece details:
     - Title: "Violin Concerto in D major"
     - Difficulty: "Hard"
     - Due Date: Select from calendar
     - Progress: Set initial progress (usually 0%)
   - Click "Add Piece"

4. **Uploading Sheet Music**:
   - Click on a piece to open detail view
   - Click "Upload Sheet Music (PDF)"
   - Select PDF file from computer
   - Sheet music appears on canvas

5. **Adding Teacher Notes**:
   - With PDF uploaded, click anywhere on sheet
   - A marker ("+") appears
   - Type notes in the popup textarea
   - Click "Save"
   - Marker changes to "📝" to indicate saved note

6. **Updating Progress**:
   - Open piece detail page
   - Drag the progress slider
   - Progress automatically saves
   - See progress reflected in:
     - Piece detail page
     - Composer view piece list
     - Homepage statistics

7. **Using the Calendar**:
   - Click "Calendar" in header
   - See all pieces organized by due date
   - Navigate months with Previous/Next
   - Click any piece card to view details

### Tips & Best Practices

**Organizing Practice**:
- Use difficulty badges to prioritize
- Check "Due This Week" stat on homepage
- Review calendar weekly for upcoming deadlines

**Managing Notes**:
- Add specific measure numbers in annotations
- Use multiple markers for different sections
- Color-code mentally (all annotations are same color currently)

**Tracking Progress**:
- Update progress after each practice session
- Use calendar to plan which pieces need attention
- Monitor average progress on homepage

---

## Data Model

### Composer Object
```javascript
{
  id: string,          // Unique identifier (timestamp)
  name: string,        // Full composer name
  emoji: string        // Display emoji (default: 🎵)
}
```

### Piece Object
```javascript
{
  id: string,          // Unique identifier (timestamp)
  composerId: string,  // Reference to composer.id
  title: string,       // Piece title
  progress: number,    // 0-100 percentage
  difficulty: string,  // 'easy' | 'medium' | 'hard'
  dueDate: string,     // ISO date format (YYYY-MM-DD)
  notes: Array,        // Array of annotation objects
  pdfUrl: string|null  // Data URL of PDF or null
}
```

### Annotation Object
```javascript
{
  id: string,   // Unique identifier (timestamp)
  x: number,    // X coordinate on canvas
  y: number,    // Y coordinate on canvas
  text: string  // Annotation text content
}
```

### LocalStorage Keys
- `'composers'`: JSON string of composers array
- `'pieces'`: JSON string of pieces array

### Sample Data Initialization
```javascript
Default Composers:
1. Mozart (🎹)
2. Beethoven (🎼)
3. Bach (🎻)
4. Chopin (🎵)

Default Pieces:
1. Mozart - Piano Sonata No. 16 (65%, medium, due in 7 days)
2. Beethoven - Moonlight Sonata (30%, hard, due in 14 days)
3. Bach - Cello Suite No. 1 (85%, medium, due in 3 days)
4. Chopin - Nocturne in E-flat (45%, easy, due in 21 days)
```

---

## Prototype Integration

### How Each Prototype Contributed

#### 1. HelloWorld
**Contribution**: React foundation
- Basic React component structure
- CDN-based setup (no build process)
- JSX compilation with Babel

**Integration**:
- Used as template for App structure
- Component-based architecture
- Hooks (useState, useEffect, useRef)

#### 2. HelloStyles
**Contribution**: Complete design system
- Color palette (7 colors)
- Typography (Inter font)
- Icon library (Feather Icons)

**Integration**:
- All colors used in CSS variables
- Inter font applied globally
- Consistent button/form styling
- Grid and flexbox layouts

#### 3. file-manager
**Contribution**: File handling patterns
- File upload functionality
- FileReader API usage
- Preview system
- Modal patterns

**Integration**:
- PDF upload uses same FileReader pattern
- Modal component for forms
- File type validation
- Preview container structure

#### 4. pdf-highlighter-prototype
**Contribution**: PDF rendering
- PDF.js integration
- Canvas-based rendering
- Viewport and scaling
- PDF loading patterns

**Integration**:
- Same PDF.js version (3.11.174)
- Canvas rendering in PieceDetailView
- Worker configuration
- Page rendering logic

#### 5. llm-ai-prototype
**Contribution**: Form patterns and AI concepts
- Two-column form layout
- Input field styling
- Loading states
- Error handling

**Integration**:
- Form styling in Modal component
- Input/select/textarea patterns
- Future: Could add AI practice suggestions

#### 6. pdf-text-annotation-prototype
**Contribution**: Annotation system
- Click-to-add markers
- Marker positioning
- Comment popups
- CRUD operations on annotations

**Integration**:
- AnnotationMarker component directly inspired
- Click handler on canvas
- Popup positioning logic
- Edit/Delete functionality

### Integration Strategy

```
Prototypes → MVP Integration

HelloWorld ──┐
             ├──→ Component Structure
HelloStyles ─┤    ├─→ App Router
             │    ├─→ View Components
             │    └─→ Reusable Components
             │
file-manager ├──→ File Handling
             │    ├─→ PDF Upload
             │    └─→ Modal System
             │
pdf-         ├──→ PDF Features
highlighter  │    ├─→ Rendering
             │    └─→ Canvas Display
             │
pdf-text-    ├──→ Annotations
annotation   │    ├─→ Markers
             │    ├─→ Popups
             │    └─→ CRUD
             │
llm-ai-      └──→ UI Patterns
prototype         ├─→ Forms
                  └─→ Future: AI Assistant
```

---

## Advanced Features

### Data Persistence
- Automatic saving on all changes
- LocalStorage API for browser persistence
- JSON serialization of complex objects
- Data survives page refresh
- No server required

### PDF Handling
- Supports full PDF files via data URLs
- Renders first page at 1.5x scale for clarity
- Canvas-based rendering for performance
- Memory efficient (loads on-demand)

### Calendar Logic
- Dynamic month generation
- Handles month/year transitions
- Shows 6 weeks for consistency
- Includes overflow days from adjacent months
- Highlights current day
- Click-through navigation to pieces

### Progress Tracking
- Real-time updates with range slider
- Visual progress bars with gradient
- Aggregated statistics on homepage
- Percentage-based (0-100)
- Used in deadline urgency calculations

---

## Browser Compatibility

**Tested Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Browser Features**:
- ES6 JavaScript
- LocalStorage API
- FileReader API
- Canvas API
- CSS Grid & Flexbox
- PDF.js compatibility

**Known Issues**:
- Safari: PDF rendering may be slower
- Mobile: Touch events not optimized
- Private browsing: Data won't persist

---

## Future Enhancements

### Planned Features
1. **Multi-page PDF support**: Navigate through all pages
2. **Practice timer**: Track session duration
3. **Progress history**: Graph showing progress over time
4. **Highlighting**: Free-form color highlighting (from pdf-highlighter)
5. **AI Assistant**: Integration of LLM for practice tips
6. **Export/Import**: JSON export for backup
7. **Cloud sync**: Optional server-side storage
8. **Mobile app**: React Native version
9. **Collaborative**: Share pieces with teacher
10. **Audio recording**: Record practice sessions

### Technical Improvements
- TypeScript for type safety
- Unit tests with Jest
- E2E tests with Cypress
- Build process with Vite
- Component library with Storybook
- Accessibility audit (WCAG 2.1)
- Performance optimization
- PWA capabilities

---

## Troubleshooting

### Common Issues

**Problem**: Data disappears after closing browser
- **Cause**: Private/Incognito mode
- **Solution**: Use regular browser window

**Problem**: PDF won't upload
- **Cause**: File too large or wrong format
- **Solution**: Ensure file is PDF and under 10MB

**Problem**: Annotations appear in wrong location
- **Cause**: Canvas scaling mismatch
- **Solution**: Refresh page to reset canvas

**Problem**: Can't see sample data
- **Cause**: LocalStorage cleared or blocked
- **Solution**: Check browser settings for localStorage

### Development Issues

**Problem**: React not loading
- **Cause**: CDN blocked or no internet
- **Solution**: Check network, use different CDN

**Problem**: PDF.js worker error
- **Cause**: Worker URL incorrect
- **Solution**: Verify worker URL matches PDF.js version

---

## Credits & Attribution

**Course**: CIS 4120 - User-Centered Design

**User Research**: Based on interviews with music students

**Design Inspiration**: Tim the Cello Player persona

**Technologies**:
- React 18 (Facebook/Meta)
- PDF.js (Mozilla)
- Feather Icons (Cole Bemis)
- Google Fonts (Google)

**AI Attribution**: AI tools used for debugging syntax issues

---

## License

Educational project - CIS 4120

---

**Version**: 1.0.0
**Last Updated**: 2025-11-14
**Status**: MVP Complete ✅
