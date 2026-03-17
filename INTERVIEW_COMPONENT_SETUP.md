# Interview Component Setup

## Overview
The `Interview` component has been fully implemented with a modern three-panel layout matching the wireframe and following the same design theme as the Home component.

## Component Structure

### File Locations
- **Component**: `/Frontend/src/features/interview/page/interview.jsx`
- **Styles**: `/Frontend/src/features/interview/style/interview.scss`

## Layout Architecture

The component uses a three-section flex layout:

```
┌─────────────────────────────────────────┐
│ LEFT SIDEBAR  │    MAIN CONTENT    │ RIGHT SIDEBAR │
│ (256px)       │    (flex: 1)       │    (320px)    │
├───────────────┼────────────────────┼───────────────┤
│ • Brand Logo  │ • Question Header  │ Skill Gaps    │
│ • Navigation  │ • Question Content │ • Tags        │
│ • Profile     │ • Answer Textarea  │ • Tips        │
│   with Score  │ • Navigation BTN   │               │
└─────────────────────────────────────────────────────┘
```

## Data Structure

The component accepts an `interviewData` prop with the following format:

```javascript
{
  _id: "69b1dc530362044cd947de5b",
  name: "Alex Kumar",
  email: "alex.kumar@example.com",
  matchScore: 88,
  technicalQuestions: [
    {
      title: "Design a Distributed Cache",
      description: "...",
      category: "System Design",
      difficulty: "Hard",
      estimatedTime: "45 Mins"
    },
    // ... more questions
  ],
  behavioralQuestions: [
    {
      title: "Tell us about a time...",
      description: "...",
      category: "Leadership",
      difficulty: "Medium",
      estimatedTime: "30 Mins"
    },
    // ... more questions
  ],
  skillGaps: [
    { skill: "Redis Cluster", color: "purple" },
    { skill: "Message Queues", color: "cyan" },
    // ... more skills
  ],
  preparationPlan: [
    {
      title: "Week 1: Foundation",
      description: "Start with core concepts..."
    },
    // ... more steps
  ]
}
```

## Features

### Left Sidebar
- **Brand Header**: Resume Tailor logo and branding
- **Navigation Tabs**:
  - Technical Questions
  - Behavioral Questions
  - Career Roadmap
  - Mock History
- **Profile Card**: Shows user name, email, and match score (88/100)

### Main Content Area
Three different views based on active tab:

#### Technical/Behavioral Questions View
- **Question Progress Bar**: Shows current question number and progress
- **Question Content**:
  - Tags (Category, Difficulty, Time estimate)
  - Question title and description
  - Answer textarea with focus glow effect
  - Toolbar with mic, draw, attachment buttons
  - "Analyze Answer" button
- **Navigation Panel** (Right of content):
  - Previous/Next buttons
  - Question list with quick navigation

#### Career Roadmap View
- Timeline visualization of preparation steps
- Visual line connecting all steps
- Animated markers on the timeline
- Step titles and descriptions

### Right Sidebar
- **Skill Gaps Section**:
  - AI badge
  - Skill tags with hover effects
  - Color-coded tags (purple/cyan/neutral)
- **Interview Tips Card**:
  - Lightbulb icon
  - Motivational tips
  - Bold highlight on key points

## Styling Features

### Theme Colors
- **Primary Purple**: `#a855f7` (darker) / `#7000ff` (electric)
- **Accent Cyan**: `#22d3ee` (softer) / `#00f2fe` (electric)
- **Background**: `#0f172a` (slate-900)

### Glass Morphism Effect
- Layered backdrop blur with semi-transparent backgrounds
- Border with subtle transparency
- Applied to cards, sidebars, and content areas

### Animations
- `fadeInUp`: Smooth entrance animation for content
- `glowPulse`: Pulsing glow effect on buttons
- `pulse`: Subtle opacity pulse animation
- All transitions use cubic-bezier easing for smooth feel

### Responsive Design
- Desktop: Full three-panel layout
- Tablet: Adjusted spacing and sizing
- Mobile: Can be stacked (needs custom media queries if needed)

## Component State Management

```javascript
const [activeTab, setActiveTab] = useState("technical");        // Current tab
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // Current Q#
const [answer, setAnswer] = useState("");                       // User's answer
```

## Usage Example

```jsx
import Interview from './features/interview/page/interview';

const interviewData = {
  name: "Alex Kumar",
  email: "alex.kumar@example.com",
  matchScore: 88,
  technicalQuestions: [...],
  behavioralQuestions: [...],
  skillGaps: [...],
  preparationPlan: [...]
};

export default function App() {
  return <Interview interviewData={interviewData} />;
}
```

## Integration Steps

1. **Import the component** in your app:
   ```jsx
   import Interview from '@/features/interview/page/interview';
   ```

2. **Prepare your data** in the required format

3. **Pass data as prop**:
   ```jsx
   <Interview interviewData={yourData} />
   ```

4. **Ensure Material Symbols font** is available:
   ```html
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
   ```

## Customization Points

### Colors
Edit variables in `interview.scss`:
- `$purple`, `$cyan`: Main theme colors
- `$slate-*`: Grayscale palette

### Animations
Modify keyframes in `interview.scss`:
- `@keyframes fadeInUp`
- `@keyframes glowPulse`
- `@keyframes pulse`

### Layout
Adjust flex widths:
- `.sidebar-left`: `width: 256px`
- `.sidebar-right`: `width: 320px`
- `.main-content`: `flex: 1`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest with backdrop-filter support)
- Mobile browsers (iOS 13+, Android 10+)
