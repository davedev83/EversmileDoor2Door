# Door2Door Marketing - Modular Architecture

This document describes the new modular architecture implemented for the Door2Door Marketing application.

## 📁 Project Structure

```
Door2DoorMarketing/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components
│   │   ├── AppContainer.js
│   │   ├── Header.js
│   │   ├── Breadcrumb.js
│   │   ├── ProgressBar.js
│   │   └── index.js
│   ├── ui/              # Basic UI components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Textarea.js
│   │   ├── Select.js
│   │   ├── LoadingSpinner.js
│   │   └── index.js
│   ├── forms/           # Form-specific components
│   │   ├── DatePickerField.js
│   │   ├── SampleSelector.js
│   │   ├── CreditCardForm.js
│   │   ├── MultiStepForm.js
│   │   └── index.js
│   ├── visits/          # Visit-related components
│   │   ├── VisitCard.js
│   │   ├── VisitList.js
│   │   └── index.js
│   └── index.js         # Main components export
├── hooks/               # Custom React hooks
│   ├── useVisits.js
│   ├── useMultiStepForm.js
│   ├── useFormValidation.js
│   ├── useSwipeGestures.js
│   └── index.js
├── utils/               # Utility functions
│   ├── dateUtils.js
│   ├── sampleUtils.js
│   ├── formUtils.js
│   ├── constants.js
│   └── index.js
├── services/            # API and external services
│   ├── visitService.js
│   ├── emailService.js
│   └── index.js
├── types/               # TypeScript type definitions
│   ├── visit.ts
│   ├── form.ts
│   ├── components.ts
│   └── index.ts
├── styles/              # CSS and styling
│   ├── globals.css
│   ├── components.css
│   └── ...
├── pages/               # Next.js pages
│   ├── index.js         # Main application page
│   ├── api/             # API routes
│   └── ...
└── lib/                 # External library configurations
    └── mongodb.js
```

## 🧩 Component Architecture

### Layout Components
- **AppContainer**: Main app wrapper with responsive design
- **Header**: Application header with logo and admin mode indicator
- **Breadcrumb**: Navigation breadcrumb for form pages
- **ProgressBar**: Multi-step form progress indicator

### UI Components
- **Button**: Reusable button with variants (primary, secondary, danger)
- **Input**: Form input with validation and error display
- **Textarea**: Multi-line text input component
- **Select**: Dropdown selection component
- **LoadingSpinner**: Loading state indicator

### Form Components
- **DatePickerField**: Date selection with calendar popup
- **SampleSelector**: Sample quantity selection with toggles
- **CreditCardForm**: Credit card information form
- **MultiStepForm**: Complete multi-step visit form

### Visit Components
- **VisitCard**: Individual visit display card
- **VisitList**: Paginated list of visits with admin controls

## 🎣 Custom Hooks

### useVisits
Manages visit data state and operations:
- Fetches visits with pagination
- Handles visit deletion
- Provides loading states and error handling

### useMultiStepForm
Manages multi-step form navigation:
- Step progression and validation
- Form data state management
- Progress calculation

### useFormValidation
Handles form validation logic:
- Field-level validation
- Step-level validation
- Error state management

### useSwipeGestures
Enables touch gestures for mobile navigation:
- Swipe left/right for form navigation
- Touch event handling

## 🛠 Utility Functions

### dateUtils.js
- Date formatting for display and API
- Date parsing and validation
- Current date helpers

### sampleUtils.js
- Sample configuration management
- Sample ID/name mapping
- Sample validation

### formUtils.js
- Form field validation (email, phone, credit card)
- Input formatting (card numbers, CVV)
- Form data cleaning

### constants.js
- Application-wide constants
- Form step definitions
- API endpoints and storage keys

## 🌐 Services

### visitService.js
- API calls for visit CRUD operations
- Pagination handling
- Error handling and response formatting

### emailService.js
- Email template generation
- SendGrid integration helpers
- Email type determination

## 📝 TypeScript Support

The application now includes comprehensive TypeScript definitions:
- **visit.ts**: Visit data structures and API responses
- **form.ts**: Form validation and state types
- **components.ts**: Component prop types

## 🎨 Styling Architecture

### globals.css
- CSS variables for consistent theming
- Utility classes for common styles
- Responsive breakpoints
- Animation keyframes

### components.css
- Component-specific styles
- Form and navigation styles
- Status indicators and pagination

## 🚀 Benefits of Modular Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across the app
3. **Testability**: Isolated components are easier to test
4. **Scalability**: New features can be added without affecting existing code
5. **Developer Experience**: Clear structure makes development faster
6. **Type Safety**: TypeScript provides compile-time error checking

## 📦 Import Examples

```javascript
// Import specific components
import { Button, Input, LoadingSpinner } from '../components/ui';
import { VisitList, VisitCard } from '../components/visits';
import { useVisits, useFormValidation } from '../hooks';
import { formatDate, validateEmail } from '../utils';
import { fetchVisits, saveVisit } from '../services';

// Import all from a category
import * as dateUtils from '../utils/dateUtils';
import * as visitService from '../services/visitService';
```

## 🔧 Development Guidelines

1. **Component Naming**: Use PascalCase for components
2. **File Organization**: Group related components in folders
3. **Props Interface**: Define TypeScript interfaces for all props
4. **Error Handling**: Include proper error boundaries and validation
5. **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)
6. **Performance**: Use React.memo for expensive components
7. **Testing**: Write unit tests for utility functions and components

## 🎯 Next Steps

1. Complete the MultiStepForm implementation with all steps
2. Add comprehensive unit tests
3. Implement error boundaries
4. Add accessibility improvements
5. Optimize performance with React.memo and useMemo
6. Add Storybook for component documentation
7. Implement end-to-end tests
