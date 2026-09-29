# Angular Material Simplified Inputs (`@jetonpeche/angular-mat-input`)

Simplify form development with Angular Material. This package wraps native Angular Material form inputs to eliminate repetitive boilerplate and handle validation errors automatically.

## Key Features

* **Dual Compatibility:** Fully supports both **Signal Forms** (`@angular/forms/signals`) and **Reactive Forms** (`ReactiveFormsModule`).
* **Built-in Multilingual Errors (i18n):** Pre-translated validation messages in 13 languages (FR, EN, ES, IT, PT, DE, AR, JA, NL, PL, RU, SV, ZH).
* **Auto-detect Language:** Automatically adapts to the user's browser language, with an optional override in application providers. *(Fallback language: English)*.
* **Custom Error Messages:** Full support for custom error overrides on individual field rules.

## Compatibility Matrix

| Package Version | Angular Version |
| :--- | :--- |
| `1.1.11` | Angular 20.3.0 |
| `1.2.10` | Angular 21 |
| `2.0.0+` | Angular 22+ |

## Table of Contents

- [Installation & Configuration](#installation--configuration)
  - [1. Application Config](#1-application-config)
  - [2. Assets Setup](#2-assets-setup)
- [Components](#components)
  - [1. Text Input](#input-text)
  - [2. Number Input](#input-number)
  - [3. Password Input](#input-password)
  - [4. Date Picker Input](#date-picker-input)
  - [5. Autocomplete](#autocomplete)
  - [6. Textarea](#textarea)
  - [7. File Inputs](#inputs-file)
  - [8. Button Loader](#button-loader)
- [License](#license)

## Installation & Configuration

### 1. Application Config

Provide global options in `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideJpMatInput } from '@jetonpeche/angular-mat-input';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optional: force a specific language (defaults to browser language)
    provideJpMatInput({ lang: 'en' })
  ]
};
```

### 2. Assets setup
Add translation files to the `assets` array in your `angular.json`

```json
{
  "assets": [
   //... your other config
    {
      "glob": "**/*",
      "input": "node_modules/@jetonpeche/angular-mat-input/src/assets",
      "output": "/assets/"
    }
  ]
}
```

## Components

### Input text  
| Attribute | Type | Description |
|:--- | :--- | :--- |
| `formControlName` / `[field]`| `string` / `FieldTree` | Required. Form binding (Reactive Forms vs. Signal Forms). |
| `label` | `string` | Field label text. |
| `placeholder` | `string` | Placeholder text. |
| `type` | `string` | Native input type (`text`, `email`, `url`, `search`, `tel`, `color`). Default is `text` |
| `prefixIcon` | `string` | Material icon placed at the start/left. |
| `suffixIcon` | `string` | Material icon placed at the end/right. |
| `isBtnIcon` | `boolean` | Converts the icon into a clickable button. |
| `floatLabel` | `FloatLabelType` |  Controls label floating behavior (`auto`, `always`). |
| `showMaxLength` | `boolean` | Displays remaining / maximum character length counter. |
| `hiddenRequiredMarker` | `boolean` | Hides the asterisk (`*`) when the input is required. |
| `clicked`| `Output<void>` | Emitted when the icon button is clicked (if `isBtnIcon` is enabled). |

#### Example
```html
<!-- Reactive Forms -->
<jp-input-text label="Username" formControlName="username" />

<!-- Signal Forms -->
<jp-signal-input-text label="Username" [field]="profileForm.username" />
```

### Input number
| Attribute | Type | Description |
|:--- | :--- | :--- |
| `formControlName` / `[field]`| `string` / `FieldTree` | Required. Form binding (Reactive Forms vs. Signal Forms). |
| `label` | `string` | Field label text. |
| `placeholder` | `string` | Placeholder text. |
| `step` | `number` | Step interval for incrementing or decrementing values. |
| `prefixIcon` | `string` | Material icon placed at the start/left. |
| `suffixIcon` | `string` | Material icon placed at the end/right. |
| `textRight` | `boolean` | Aligns text content to the right. |
| `hiddenArrows` | `boolean` | Hides browser default up/down step arrows. |
| `floatLabel` | `FloatLabelType` |  Controls label floating behavior (`auto`, `always`). |
| `hiddenRequiredMarker` | `boolean` | Hides the asterisk (`*`) when the input is required. |

#### Example

```html
<!-- Reactive Forms -->
<jp-input-number label="Age" formControlName="age" />

<!-- Signal Forms -->
<jp-signal-input-number label="Age" [field]="profileForm.age" />
```

### Input password

#### password validator
Includes built-in password policy enforcement:
- At least one lowercase letter.
- At least one uppercase letter.
- At least one digit.
- At least one special character.
- Minimum length: 8 characters (customizable in Signal Forms).

- **Reactive forms:** `passwordValidator`
- **Signal forms:** `password(path, { minLength?: number })` (default 8)

| Attribute | Type | Description |
|:--- | :--- | :--- |
| `formControlName` / `[field]`| `string` / `FieldTree` | Required. Form binding (Reactive Forms vs. Signal Forms). |
| `label` | `string` | Field label text. |
| `floatLabel` | `FloatLabelType` | Controls label floating behavior (`auto`, `always`). |
| `placeholder` | `string` | Placeholder text. |
| `hiddenButtonSwitch` | `boolean` | Hides the toggle visibility eye button. |
| `showMaxLength` | `boolean` | Displays the maximum length counter. |
| `hiddenRequiredMarker` | `boolean` | Hides the asterisk (`*`) required marker. |

#### Example
```html
<!-- Reactive Forms -->
<jp-input-password label="Password" formControlName="password" />

<!-- Signal Forms -->
<jp-signal-input-password label="Password" [field]="profileForm.password" />
```
```ts
import { passwordValidator, password } from '@jetonpeche/angular-mat-input';

// Signal Forms
const profile = signal({ password: '' });
const profileForm = form(profile, (path) => {
  required(path.password);
  password(path.password, { minLength: 10 }); // Configurable minimum length (default: 8)
});

// Reactive Forms
const formGroup = new FormGroup({
  password: new FormControl('', [Validators.required, passwordValidator])
});
```

### Date picker input

#### Validation helpers
- **Reactive forms:** `minDateValidator(date: string | Date)`, `maxDateValidator(date: string | Date)`  
- **Signal forms:** `minDate(path, Date | string | Fn)`, `maxDate(path, Date | string | Fn)` (accepts static dates, strings or dynamic lambda callbacks)

| Attribute | Type | Description |
|:--- | :--- | :--- |
| `formControlName` / `[field]`| `string` / `FieldTree` | Required. Form binding (Reactive Forms vs. Signal Forms). |
| `label` | `string` | Field label text. |
| `iconPicker` | `string` | Custom Material icon for the picker button. |
| `floatLabel` | `FloatLabelType` | Controls label floating behavior (auto, always). |
| `touchUi` | `boolean` | Enables mobile touch-optimized dialog mode. |
| `disabledPartial` | `boolean` | Disables keyboard text input while keeping the calendar picker active |
| `disabledDays` | `EDay[]` | Days of the week to disable. |
| `disabledMonths` | `EMonth[]`| Months of the year to disable (index `0` to `11`). |
| `disabledDates` | `string[]` | Specific dates to block each year (MM-DD) |
| `disabledWeekend` | `boolean` | Disables Saturdays and Sundays. |
| `disabledWeek` | `boolean` | Disables weekdays (Monday–Friday). |
| `disabledSundayAndMonday` | `boolean`| Disables Sundays and Mondays. |
| `hiddenRequiredMarker` | `boolean` | Hides the asterisk (`*`) required marker. |

#### Enums
- `EDay`:Enum for days of the week
- `EMonth`: Enum for months of the year (indexed from 0 to 11)

#### Example
```html
<!-- Reactive Forms -->
<jp-input-date label="Birth Date" formControlName="date" />

<!-- Signal Forms -->
<jp-signal-input-date label="Birth Date" [field]="profileForm.date" />
```
```ts
import { minDateValidator, maxDateValidator, minDate, maxDate } from '@jetonpeche/angular-mat-input';

// Signal Forms
const profile = signal({ date: null as Date | null });
const profileForm = form(profile, (path) => {
  required(path.date);

  // Static string or Date instance
  minDate(path.date, '2025-01-01');

  // Dynamic evaluation using a lambda callback
  maxDate(path.date, () => new Date());
});

// Reactive Forms
const formGroup = new FormGroup({
  date: new FormControl(null, [
    Validators.required,
    minDateValidator('2025-01-01'), // Accepts string or Date
    maxDateValidator(new Date(2026, 11, 31))
  ])
});
```

### Autocomplete
Handles single-item autocomplete selection as well as multiple selection using Material Chips.

| Attribute | Type | Description |
|:--- | :--- | :--- |
| `formControlName` / `[field]`| `string` / `FieldTree` | **Required**. Form binding (Reactive Forms vs. Signal Forms). |
| `label` | `string` | Field label text. |
| `dataSource` | `Model<AutocompleteDataSource[]>` | **Required**. Array of `{ display: string, value: any }` items. |
| `multiple` | `boolean` | Enables multi-select mode rendered as Material Chips. |
| `requireSelection` | `boolean` | Forces the value to match an item in `dataSource`. If `false`, permits free text entry.
| `disabledFilterComplete` | `boolean` | Disables internal client-side autocomplete list filtering. |
| `autoDesactiveFirstOption` | `boolean` | Prevents automatically highlighting the first option. |
| `floatLabel` | `FloatLabelType` | Controls label floating behavior (`auto`, `always`). |
| `hiddenRequiredMarker` | `boolean` | Hides the asterisk (`*`) required marker. |
| `autocompleteChange` | `Output<string>` | Emits raw search string on every keystroke. |
| `opened / closed` | `Output<void>` | Emitted when dropdown overlay opens/closes. |

#### Example
```html
<!-- Single Selection -->
<jp-autocomplete label="Favorite item" 
                           [dataSource]="list()" 
                           formControlName="item" />

<!-- Multiple Selection (Chips) with Free Text Input -->
<jp-signal-autocomplete label="Tags" 
                                    multiple 
                                    requireSelection
                                    [dataSource]="tagList()" 
                                    [field]="profileForm.tags" />
```
```ts
const list = signal<AutocompleteDataSource[]>([
  { display: 'One', value: 1 },
  { display: 'Two', value: 2 }
]);

// Signal Forms
const profile = signal({ tags: [] as string[] });
const profileForm = form(profile, (path) => 
{
  required(path.tags);
});

// Reactive Forms
const formGroup = new FormGroup({
  item: new FormControl<number | null>(null, [Validators.required])
});
```

### Textarea
| Attribute | Type | Description |
|:--- | :--- | :--- |
| `formControlName` / `[field]`| `string` / `FieldTree` | Required. Form binding (Reactive Forms vs. Signal Forms). |
| `label` | `string` | Field label text. |
| `placeholder` | `string` | Placeholder text. |
| `rows` / `cols` | `string` | Dimensions of the textarea element. |
| `showMaxLength` | `boolean` | Displays the maximum length counter. |
| `floatLabel` | `FloatLabelType` |  Controls label floating behavior (`auto`, `always`). |
| `hiddenRequiredMarker` | `boolean` | Hides the asterisk (`*`) when the input is required. |

#### Example
```html
<!-- Reactive Forms -->
<jp-textarea label="Additional details" [rows]="4" formControlName="details" />

<!-- Signal Forms -->
<jp-signal-textarea label="Additional details" [rows]="4" [field]="profileForm.details" />
```

### Inputs file

#### Button file input
A file picker integrated into an Angular Material button style:
```html
<jp-input-file-btn matFab 
                           extended 
                           label="Upload CV" 
                           accept=".pdf,.docx" 
                           (fileChange)="onFileSelected($event)" />

<jp-signal-input-file-btn [field]="profileForm.file" />
```

#### Drop zone file input
```html
<jp-input-file-drop-zone accept="image/*" 
                                       notMultiple
                                       (selectedFiles)="onFilesDropped($event)" />
```

### Button loader
A Material button that displays a loading spinner and handles interaction locks during async operations.
When `loading` is `true`, `disabledInteractive` is automatically turned on to lock button actions.

| Attribute | Type | Description |
|:--- | :--- | :--- |
| `label` | `string` | Field label text. |
| `icon` | `string` | Material icon name. |
| `loading` | `boolean` | Replaces or accompanies the icon with a spinner and locks interactions. |
| `matButton`, `matFab`, `matMiniFab`, `matIconButton` | `boolean` | Style variants matching Angular Material buttons. |
| `extended` `| `boolean` | Extends the matFab style with a text label. |
| `matTooltip` / `matTooltipPosition` | `string` / `TooltipPosition` | Optional tooltip text and position |
| `matDialogClose` | `any` | Closes the current dialog on click, mirroring `mat-dialog-close`
| `disabledInteractive` | `boolean` | Disables focus and events while maintaining visual styles. |
| `disableRipple` | `boolean` | Disables the ripple effect. |
| `disabled` | `boolean` | Disables the button. |
| `clicked` | `Output<void>` | Click event emitter. |

#### Example
```html
<jp-button-loader label="Save Changes" 
                           icon="check" 
                           matButton="filled"
                           [loading]="isSaving()" 
                           (clicked)="saveProfile()" />
```

## License
MIT