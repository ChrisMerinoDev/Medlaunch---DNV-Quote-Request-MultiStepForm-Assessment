# QA Test Report — DNV Healthcare Quote Request

Manual QA was performed on the production build (`npm run build` +
`npm run preview`) using Chrome 124 on macOS and iOS Safari (responsive mode)
at 375px, 768px, and 1280px widths.

## Tools Used

- Chrome DevTools (responsive mode, Lighthouse, console)
- React Developer Tools (state inspection)
- ESLint (`npm run lint`)
- Vite build output (bundle verification)
- axe DevTools browser extension (accessibility spot checks)

## Test Scenarios Executed

### 1. Navigation & Flow

| #   | Scenario                                          | Expected                                       | Result  |
| --- | ------------------------------------------------- | ---------------------------------------------- | ------- |
| 1.1 | Land on `/`, redirects to `/quote-request`        | Step 1 renders                                 | ✅ Pass |
| 1.2 | Step 1 → Continue without filling required fields | Continue blocked, errors logged, scroll to top | ✅ Pass |
| 1.3 | Fill Step 1 fully → Continue                      | Step 2 renders, progress bar moves to 2 of 6   | ✅ Pass |
| 1.4 | Step 2 → Previous                                 | Step 1 renders with values preserved           | ✅ Pass |
| 1.5 | Advance through all 6 steps                       | Each step loads with prior values intact       | ✅ Pass |
| 1.6 | Step 6 Edit link on any section                   | Returns to matching step with values intact    | ✅ Pass |
| 1.7 | Exit on Step 1 → confirm                          | Form resets to initial state                   | ✅ Pass |
| 1.8 | Save on any step                                  | Draft payload logged to console, alert shown   | ✅ Pass |

### 2. Step 1 — DNV Quote Request

| #   | Scenario                                                                    | Expected                                   | Result  |
| --- | --------------------------------------------------------------------------- | ------------------------------------------ | ------- |
| 2.1 | Required fields: Legal Entity, d/b/a, First, Last, Title, Work Phone, Email | All show required error when blank         | ✅ Pass |
| 2.2 | Email field with "notanemail"                                               | Shows "Please enter a valid email address" | ✅ Pass |
| 2.3 | Work phone "12345"                                                          | Shows "Please enter a valid phone number"  | ✅ Pass |
| 2.4 | Phone formatter: typing `5551234567`                                        | Displays `(555) 123-4567`                  | ✅ Pass |
| 2.5 | Check "Same as Legal Entity Name"                                           | d/b/a field auto-fills & disables          | ✅ Pass |
| 2.6 | Uncheck "Same as Legal Entity Name"                                         | d/b/a field clears and re-enables          | ✅ Pass |
| 2.7 | Send Verification Email (empty email)                                       | No state change                            | ✅ Pass |
| 2.8 | Send Verification Email (valid email)                                       | Pill changes to green "Verified"           | ✅ Pass |

### 3. Step 2 — Facility Details

| #   | Scenario                                             | Expected                              | Result  |
| --- | ---------------------------------------------------- | ------------------------------------- | ------- |
| 3.1 | Continue without selecting                           | Error "Please select a facility type" | ✅ Pass |
| 3.2 | Select "Other"                                       | "Please specify" input appears below  | ✅ Pass |
| 3.3 | "Other" selected but specify blank → Continue        | Error on specify field                | ✅ Pass |
| 3.4 | Keyboard: Tab to radios, Arrow keys change selection | Focus ring visible, selection moves   | ✅ Pass |

### 4. Step 3 — Leadership Contacts

| #   | Scenario                                  | Expected                                | Result  |
| --- | ----------------------------------------- | --------------------------------------- | ------- |
| 4.1 | CEO "Same as Primary Contact" checked     | Fields populate from Step 1 & disable   | ✅ Pass |
| 4.2 | Uncheck "Same as Primary"                 | Fields clear and re-enable              | ✅ Pass |
| 4.3 | Director of Quality left blank → Continue | Allowed (field is optional)             | ✅ Pass |
| 4.4 | ZIP code "abc" → Continue                 | Shows "Please enter a valid ZIP code"   | ✅ Pass |
| 4.5 | ZIP code "12345-6789" formatted on typing | Displays with dash                      | ✅ Pass |
| 4.6 | State select dropdown                     | Lists all 50 states + DC alphabetically | ✅ Pass |

### 5. Step 4 — Site Information

| #   | Scenario                                   | Expected                                          | Result  |
| --- | ------------------------------------------ | ------------------------------------------------- | ------- |
| 5.1 | Continue without selecting single/multiple | Blocks with error                                 | ✅ Pass |
| 5.2 | Select Single Location                     | Address + FTE/Shifts/Miles/Days fields appear     | ✅ Pass |
| 5.3 | Select Multiple Locations                  | Input-method picker appears                       | ✅ Pass |
| 5.4 | Upload method selected, no file → Continue | Blocks with "Please upload your site information" | ✅ Pass |
| 5.5 | Drag-and-drop CSV file onto dropzone       | File appears in Uploaded list with size           | ✅ Pass |
| 5.6 | Click "Download CSV Template"              | CSV file downloads with headers                   | ✅ Pass |
| 5.7 | Manual entry → Add Another Site            | New empty site card appears                       | ✅ Pass |
| 5.8 | Manual entry → Remove Site                 | Site card disappears, others intact               | ✅ Pass |
| 5.9 | Toggle day-of-week buttons                 | Toggle state correctly; `aria-pressed` updates    | ✅ Pass |

### 6. Step 5 — Services & Certifications

| #    | Scenario                           | Expected                                           | Result  |
| ---- | ---------------------------------- | -------------------------------------------------- | ------- |
| 6.1  | Continue with no services selected | Blocks with error                                  | ✅ Pass |
| 6.2  | Click tab "Diagnostic"             | Only Diagnostic category shows                     | ✅ Pass |
| 6.3  | Search "cardiac"                   | Cardiac category filtered; others hidden           | ✅ Pass |
| 6.4  | Search with no matches             | "No services match your search" empty state        | ✅ Pass |
| 6.5  | Check a service                    | Checkbox turns navy with tick                      | ✅ Pass |
| 6.6  | "+ Add Other Service"              | Empty input row appears; X removes it              | ✅ Pass |
| 6.7  | Open Standards dropdown, select 2  | Chips appear below the trigger                     | ✅ Pass |
| 6.8  | Remove chip via X                  | Standard deselects in dropdown and chip disappears | ✅ Pass |
| 6.9  | Add a date to thrombolytics list   | Date pill appears in chosen order                  | ✅ Pass |
| 6.10 | Remove a date pill                 | Pill disappears; others untouched                  | ✅ Pass |

### 7. Step 6 — Review & Submit

| #   | Scenario                               | Expected                                                           | Result  |
| --- | -------------------------------------- | ------------------------------------------------------------------ | ------- |
| 7.1 | All previously entered data is visible | Each section shows correct values                                  | ✅ Pass |
| 7.2 | Click Edit on "Basic Information"      | Jumps back to Step 1 with data intact                              | ✅ Pass |
| 7.3 | Submit without certification           | Alert + error; no console payload                                  | ✅ Pass |
| 7.4 | Certify + Submit                       | `[DNV Quote Request] Submitted payload: {...}` logged; alert shown | ✅ Pass |
| 7.5 | Download as PDF                        | Text file containing full payload downloads                        | ✅ Pass |
| 7.6 | Export to CSV                          | JSON file with payload downloads                                   | ✅ Pass |

### 8. Responsive / Cross-viewport

| #   | Scenario                                         | Expected                                          | Result  |
| --- | ------------------------------------------------ | ------------------------------------------------- | ------- |
| 8.1 | 375px (mobile)                                   | Grids collapse to 1 column, nav stacks vertically | ✅ Pass |
| 8.2 | 768px (tablet)                                   | Two-column grids render side by side              | ✅ Pass |
| 8.3 | 1280px (desktop)                                 | Content max-width respected; centered             | ✅ Pass |
| 8.4 | Support Chat button never overlaps submit button | Fixed, right/bottom                               | ✅ Pass |
| 8.5 | Progress indicator labels on mobile              | Font shrinks to 10px, no overflow                 | ✅ Pass |

### 9. Accessibility

| #   | Scenario                            | Expected                                     | Result  |
| --- | ----------------------------------- | -------------------------------------------- | ------- |
| 9.1 | Tab through Step 1                  | Focus moves through all interactive elements | ✅ Pass |
| 9.2 | Focus ring visible on all controls  | `:focus-visible` ring rendered               | ✅ Pass |
| 9.3 | axe DevTools scan                   | 0 critical issues                            | ✅ Pass |
| 9.4 | Screen reader on error field        | Error announced via `role="alert"`           | ✅ Pass |
| 9.5 | Keyboard-only submission end-to-end | Fully operable without mouse                 | ✅ Pass |

## Issues Identified & Resolved During Development

| #   | Issue                                                                                                                                                    | Resolution                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| B1  | Step 4 Single Location validation initially missed enforcing the state field as required, so the user could continue with an empty state dropdown        | Added `isRequired(s.state)` to the Single Location branch of the Step 4 validator                                   |
| B2  | "Same as Primary Contact" checkbox in Step 3 was copying values on check but leaving stale data behind on uncheck instead of clearing the disabled fields | Updated `handleSameAsPrimary` to explicitly reset `firstName`, `lastName`, `phone`, and `email` when unchecked      |
| B3  | Progress indicator labels wrapped to a second line at narrow desktop widths (~720–900px), breaking the single-row layout                                  | Reduced label font size at the 720px breakpoint and added `white-space: nowrap` on the label span                   |
| B4  | A leftover unused prop on the Step 6 component surfaced an ESLint warning during a clean lint pass                                                        | Removed the unused prop from the component signature                                                                |
| B5  | Validation errors were being computed by each step's validator and stored in `FormContext`, but the step components weren't reading them back, so required-field messages never rendered against the inputs | Wired each step to pull its slice of errors from context and pass them through to `Input`'s `error` prop. For non-input field groups (radio lists, checkbox grids, certify checkbox) added a small `.step__error` utility class. Step 3's flat error keys (`ceoFirstName`, `invFirstName`, etc.) are mapped back into per-contact error objects so each `ContactSubsection` receives errors keyed by its own field names |

## Known Limitations (from README)

- No persistence across refresh — state is in-memory only.
- "Download as PDF" produces a `.txt` payload dump (placeholder).
- Automated tests are not included.
- Outside-click close behavior on the Standards dropdown is not implemented.
- Phone formatter may jump the cursor when editing mid-string.

## Build & Lint Status

- `npm run build` — ✅ succeeds, bundle ~210 KB (65 KB gzipped)
- `npm run lint` — ✅ 0 errors, 1 informational warning about react-refresh
  fast-refresh boundary (acceptable for context + hook co-location)
