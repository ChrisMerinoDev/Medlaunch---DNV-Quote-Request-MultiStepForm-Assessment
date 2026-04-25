# DNV Healthcare — New Quote Request

A production-grade, multi-step form built with React (JavaScript) and pure CSS for the Assessment.

## Tech Stack

| Concern          | Choice                       |
| ---------------- | ---------------------------- |
| Framework        | React 18 (JavaScript)        |
| Build tool       | Vite                         |
| Routing          | React Router v6              |
| State management | React Context + `useReducer` |
| Styling          | Pure CSS                     |
| Linting          | ESLint                       |

No third-party form libraries, UI kits, or CSS frameworks are used.

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server (hot reload) at http://localhost:5173
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview

# Lint the source
npm run lint
```

Node 18+ is recommended.

## Development Approach

The app is a single multi-step form that lives at `/quote-request`.

```
src/
├── App.jsx                       # Router + FormProvider at the app shell
├── main.jsx                      # ReactDOM entry
├── pages/
│   └── QuoteRequestPage.jsx      # Orchestrator: renders active step + nav
├── context/
│   └── FormContext.jsx           # Global form store (useReducer)
├── components/
│   ├── common/                   # Reusable primitives
│   │   └── Button, Input, Select, Checkbox, Radio,
│   │       Card, Pill, SelectableCard
│   ├── layout/                   # App chrome
│   │   └── Header, ProgressIndicator, SupportChat, FormNavigation
│   ├── form/                     # Domain-specific composite inputs
│   │   └── AddressFields, ContactSubsection, FileUpload, DateChipInput
│   └── steps/                    # One file per step
│       └── Step1QuoteRequest ... Step6Review
├── constants/                    # Pure data: steps, services, states, etc.
├── utils/                        # validators, formatters
└── styles/
    └── global.css                # Design tokens + resets
```

### State management

A single `FormProvider` wraps the app and exposes a reducer-backed store with
actions for updating sections and nested sub-sections, advancing/rewinding the
current step, and storing per-step validation errors. Every step reads/writes
through the same context, so navigation preserves values and the final
Review & Submit step can present an accurate summary.

### Per-step validation

Each step registers a validator function with the page orchestrator via a
`registerValidator` prop and a ref. When the user hits **Continue**, the
orchestrator invokes the active validator and blocks navigation if it returns
any errors.

Errors are stored in context keyed by step number and rendered inline next to
the affected field via the `Input` component's `error` prop, or a small
`.step__error` utility class for field groups (radio lists, checkbox grids,
the certify checkbox).

Validators themselves live in `utils/validators.js`: `isRequired`,
`isValidEmail`, `isValidPhone`, `isValidZip`, and a `validateFields` helper.

### Design fidelity

Design tokens (colors, spacing scale, type scale, shadows) are defined
as CSS variables in `styles/global.css` and consumed by every component. The
navy primary `#0b3d91`, light-blue selection `#e6edf7`, danger red `#d1344a`,
and the "Not verified" warning pill palette all come from the Figma.

The progress indicator, card chrome, selectable cards, tabs, chip inputs,
file dropzone, and review-page accordion sections are all implemented with CSS.

### Responsive behavior

Every grid collapses to a single column below 640px. The header trims the
username label on narrow screens, the progress-indicator labels shrink, and
the footer navigation stacks vertically. The support chat pill repositions
along the right edge.

### Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<nav>`)
- Form fields use associated `<label>`s and `aria-invalid`/`aria-describedby`
  for error messages
- Radios/checkboxes use visually-hidden inputs backed by a keyboard-focusable
  custom indicator
- The progress indicator uses `aria-current="step"` on the active step
- `aria-pressed` is used on toggleable day-of-week buttons and selection cards
- Visible `:focus-visible` ring using the accent color

### Form submission

The final **Submit Application** button in Step 6 runs the Step 6 validator
(which enforces the certification checkbox) and, on success, logs the full
payload to the console as required:

```
[DNV Quote Request] Submitted payload: { ... }
```

Step 6 also includes **Download as PDF** and **Export to CSV** actions that
generate a downloadable file with the captured payload.

## Assumptions Made

- The "Send Verification Email" flow simulates verification by flipping a
  local flag on click. No real email is sent.
- The standards catalog, services catalog, and state list are hard-coded in
  `src/constants/`. In a real app they'd be fetched from an API.
- The CSV template download produces a header-only file as a starting
  scaffold — it is not derived from real backend metadata.
- "Download as PDF" on the review page emits a plain-text dump of the payload
  (the real app would call a server PDF renderer).
- The Support Chat button logs a message to the console on click — it does
  not open a real chat widget.
- Step 1 asks for a `d/b/a` value; the "Same as Legal Entity Name" checkbox
  auto-fills the d/b/a field AND disables it until unchecked.
- For Multiple Locations, users may either upload a CSV/Excel OR enter sites
  manually. Manual entry is provided as a practical addition to the Upload
  flow shown in the Figma frame.
- The phone formatter targets North American numbers `(XXX) XXX-XXXX`;
  international phone formatting is out of scope.

## Known Limitations

- **No persistence**: Refreshing the page resets the form. A real app would
  serialize the store to `localStorage` or a backend draft endpoint.
- The Review page's download-as-PDF outputs a `.txt` file as a placeholder.
- Automated unit tests are not included; manual QA is captured in
  `QA_Test_Report.md`.

## Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR       |
| `npm run build`   | Produce a production build under `dist/` |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | Run ESLint across `src/`                 |
