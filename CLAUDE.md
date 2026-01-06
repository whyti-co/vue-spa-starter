# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Runtime

**Bun is the exclusive runtime for this project.** Do not use Node.js.

- Always use `bun` instead of `npm`, `yarn`, `pnpm`, or `node`
- Prefer Bun APIs over Node.js APIs when available:
  - `Bun.file()` instead of `fs.readFile()`
  - `Bun.write()` instead of `fs.writeFile()`
  - `Bun.serve()` instead of `http.createServer()`
  - `Bun.password` for hashing
  - `Bun.sql` for SQLite (if needed)
- Use `bun install` for dependencies
- Use `bunx` instead of `npx`

## Build Commands

- `bun run dev` - Start development server with hot reload
- `bun run build` - Type-check with vue-tsc then build for production
- `bun run preview` - Preview production build on port 5173
- `bun run i18n:extract` - Extract messages, sort all locale files, show translation diff
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome
- `bun run check` - Format + lint + organize imports (use before committing)

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |

**Scope** (optional): affected area (`auth`, `modal`, `i18n`, `router`, etc.)

**Examples:**
```
feat(auth): add email verification flow
fix(modal): prevent double-close on rapid clicks
refactor(router): simplify guard composition
chore: update dependencies
docs: add modal system documentation
```

**Rules:**
- Use imperative mood: "add feature" not "added feature"
- Lowercase first letter after type
- No period at end
- Keep first line under 72 characters

## Tech Stack

- **Bun** as exclusive runtime and package manager (prefer Bun APIs over Node.js)
- **Vue 3** with JSX syntax (not SFC .vue files)
- **TypeScript** with strict mode enabled
- **Vite** (via rolldown-vite) for build tooling
- **Tailwind CSS v4** with the Vite plugin
- **DaisyUI v5** for UI components
- **Biome** for formatting and linting
- **Vue Router** for routing with lazy-loaded pages
- **FormatJS** for i18n with ICU message syntax and lazy-loaded locales
- **Pinia** for state management with optional localStorage persistence
- **VueUse** for reactive utilities (useMediaQuery, etc.)
- **vite-svg-loader** for importing SVGs as Vue components

## Project Structure

```
src/
├── assets/
│   ├── icons/           # SVG icons (imported as Vue components)
│   └── styles/          # CSS files (themes, transitions, components, dock)
├── components/
│   └── layouts/         # Layout components (DefaultLayout, Dock, etc.)
├── core/                # App-wide setup (router, i18n, composables)
│   └── composables/     # App-wide composables (useTheme, useQueue)
├── domains/             # Feature modules (auth, catalog, etc.)
│   └── [domain]/
│       ├── api/         # API calls and types
│       ├── components/  # Domain-specific components
│       ├── composables/ # Domain-specific composables
│       └── index.ts     # Public API (exports only)
├── pages/
│   ├── app/             # Main application pages (lowercase)
│   │   ├── home.tsx
│   │   ├── 404.tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       └── settings.tsx
│   └── modals/          # Modal flow pages (lowercase, like app/)
│       ├── login/
│       │   └── index.tsx
│       └── verify-identity/
│           ├── step1.tsx
│           └── step2.tsx
├── plugins/             # App plugins (auto-loaded via plugins.config.ts)
│   └── tma/             # Telegram Mini App platform plugin
├── utils/               # Generic utility functions
├── App.tsx
└── main.ts

examples/                # Reference implementations (including plugin example)
scripts/                 # Helper scripts (i18n, etc.)
plugins.config.ts        # Plugin enable/disable configuration
vite-plugins/
└── tree-shake-plugins.ts  # Auto-generates plugin loader from config
```

### Page Naming

- Use lowercase filenames: `home.tsx`, `settings.tsx`, `404.tsx`
- Use `index.tsx` for directory default: `profile/index.tsx` → `/profile`
- Nested routes use directories: `profile/settings.tsx` → `/profile/settings`
- Modal pages follow same rules: `modals/login/index.tsx`, `modals/verify-identity/step1.tsx`

### Domain Module Rules

- Domains expose public API via `index.ts` only
- Domains import only from `core/` and `components/`
- Domains never import from sibling domains
- Pages import from domains, not internal domain files

## TypeScript Conventions

Use `type` instead of `interface`. Naming prefixes:

| Prefix | Usage | Example |
|--------|-------|---------|
| `T` | Types | `TUser`, `TLoginCredentials` |
| `E` | Enums | `EUserStatus`, `EAuthError` |

```ts
type TUser = {
  id: string
  email: string
  status: EUserStatus
}

enum EUserStatus {
  Active = 'active',
  Inactive = 'inactive',
}
```

## Architecture

### Vue JSX Components

Components must use `defineComponent` for proper HMR support:

```tsx
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentName',
  setup() {
    return () => <div>JSX content</div>
  }
})
```

### i18n System

**CRITICAL: Always write i18n-first.** NEVER hardcode text strings in JSX. All user-visible text must use the `t()` function with message descriptors.

```tsx
// ❌ WRONG - hardcoded text
<button>Cancel</button>
<h1>Welcome to our app</h1>

// ✅ CORRECT - i18n messages
<button>{t(messages.actions.cancel)}</button>
<h1>{t(messages.pages.home.welcome)}</h1>
```

Messages location:
- Common messages: `core/i18n/messages.ts` (nested: `messages.pages.home.title`)
- Domain messages: `domains/[domain]/messages.ts` (exported via `index.ts`)
- Universal actions: `messages.actions` (cancel, continue, back, complete, submit, save, delete, edit, close)

```tsx
import { messages, useI18n } from '@/core/i18n'
import { messages as authMessages } from '@/domains/auth'

const { t } = useI18n()
t(messages.pages.home.title)
t(authMessages.signIn)
```

Run `bun run i18n:extract` to:
1. Extract messages from `defineMessages` to `en.json`
2. Sort all locale files alphabetically by key
3. Show diff of missing/obsolete keys in other locales

**IMPORTANT:** NEVER manually edit `messages/*.json` files. Always add messages to `messages.ts` using `defineMessages` and run `bun run i18n:extract` to regenerate JSON files.

### Pinia Stores

Stores use composition API style with optional persistence:

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, doubled, increment }
}, {
  persist: true  // optional: saves to localStorage
})
```

### Session Pattern

User/auth state lives in `core/session`, not in the auth domain. This allows any domain to read session state without importing from sibling domains.

```
core/session     → Pinia store (user, token, isAuthenticated)
domains/auth     → actions only (login, logout, init)
domains/*        → reads from core/session
```

```ts
// Reading session (any domain or page)
import { useSession } from '@/core/session'
const session = useSession()
if (session.isAuthenticated) { ... }

// Writing session (auth domain only)
import { useAuth } from '@/domains/auth'
const { login, logout } = useAuth()
await login({ email, password })
```

Session is initialized on app start via `useAuth().init()` which restores user from persisted token.

### Route Guards

Protect routes with the `guards` object in `core/router`. Guards are functions that check session state and optionally show modals.

```ts
import { guards } from '@/core/router'

// Route configuration
{
  path: 'profile',
  meta: { guard: [guards.isAuth('overlay')] },
}

{
  path: 'profile/settings',
  meta: { guard: [guards.isAuth()] },  // defaults to 'block'
}

// Stack multiple guards
{
  path: 'premium',
  meta: { guard: [guards.isAuth(), guards.isVerified('overlay')] },
}
```

Guard modes:
- `'block'` (default) - show modal before navigation, block until satisfied
- `'overlay'` - navigate first, show modal on top of page content
- `null` - redirect only, no modal

Available guards:
- `guards.isAuth(mode?, redirectTo?)` - requires authenticated user, opens `/login` modal
- `guards.isVerified(mode?, redirectTo?)` - requires verified user, opens `/verify-identity` modal

```ts
guards.isAuth()                            // block mode, redirect to home
guards.isAuth('overlay')                   // overlay mode, redirect to home
guards.isAuth(null, { name: 'profile' })   // no modal, redirect to profile
```

Custom guards can return `true` to proceed or a route location to redirect:

```ts
const adminOnly: TRouteGuard = async ({ session }) => {
  if (session.user?.isAdmin) return true;
  return { name: 'forbidden' };
};
```

Modal pages should close with `{ success: true }` for guard compatibility:

```ts
close({ success: true })  // guard proceeds
close()                   // guard fails, redirects
```

### Modal System

Second Vue Router instance for complex modal flows with dynamic step management. **Responsive by default**: modals appear as centered dialogs on desktop (>=768px) and bottom drawers on mobile (<768px).

```
core/
├── composables/useQueue.ts  # Generic reactive queue
└── modal/
    ├── index.ts             # modalRouter, useModal, steps, isDrawerMode, isDialogMode
    ├── routes.ts            # Modal route definitions
    └── ModalRouterView.tsx  # Custom view for modal router

components/
├── Modal.tsx                # Simple DaisyUI dialog (reusable)
├── ModalWrapper.tsx         # Modal page content wrapper (centering, fill mode)
├── Stepper.tsx              # Generic stepper component
└── layouts/
    ├── ModalDefaultLayout.tsx  # Modal content wrapper with stepper
    └── Dock.tsx                # Handles drawer mode on mobile
```

**Responsive behavior:**
- Desktop (>=768px): Centered dialog modal with backdrop
- Mobile (<768px): Bottom drawer that slides up from dock with blur overlay

```tsx
import { isDrawerMode, isDialogMode, useModal } from '@/core/modal'

// Check current mode
if (isDrawerMode.value) {
  // Mobile: drawer is open
}
if (isDialogMode.value) {
  // Desktop: dialog is open
}
```

**Simple modal** (no routing):

```tsx
import Modal from '@/components/Modal'

<Modal open={isOpen.value} onClose={handleClose}>
  <div>Content</div>
</Modal>
```

**Multi-step modal** with router:

```tsx
import { steps, useModal } from '@/core/modal'

const { open, close } = useModal()

// Set steps and open
steps.set([
  { id: 'info', path: '/verify-identity/step1', label: 'Info' },
  { id: 'docs', path: '/verify-identity/step2', label: 'Docs' },
])
const result = await open<{ success: boolean }>('/verify-identity/step1')

// In step components
steps.next()                    // Navigate forward
steps.prev()                    // Navigate back
steps.insert(step, 'afterId')   // Add dynamic step
steps.remove('id')              // Remove step
close({ success: true })        // Close with result
```

**Modal page structure** with `ModalWrapper`:

All modal pages should use `ModalWrapper` for consistent layout. Content is centered by default; use `fill` prop for full-height content.

```tsx
import ModalWrapper from '@/components/ModalWrapper'
import { useModal } from '@/core/modal'

// Default - content centered vertically
<ModalWrapper>
  <h2>Title</h2>
  <p>Small content is centered</p>
  <button onClick={close}>Close</button>
</ModalWrapper>

// Full height - content fills available space
<ModalWrapper fill>
  <div>Header</div>
  <div class="flex-1">Expandable content</div>
  <button class="mt-auto">Sticky footer button</button>
</ModalWrapper>
```

**Accessing route params** in modal pages:

Modal pages use a separate router instance. Use `modalRouter.currentRoute` instead of `useRoute()`:

```tsx
import { modalRouter, useModal } from '@/core/modal'

const post = computed(() => {
  const id = modalRouter.currentRoute.value.params.id as string
  return getPostById(id)
})
```

### Theme System

Dark/light mode via `useTheme` composable in `core/composables/useTheme.ts`:

```tsx
import { useTheme } from '@/core/composables/useTheme'

const { theme, toggle } = useTheme()

// theme.value is 'light' | 'dark'
// toggle() switches between modes

<input
  type="checkbox"
  class="toggle"
  checked={theme.value === 'dark'}
  onChange={toggle}
/>
```

Features:
- Persists to localStorage
- Respects system preference (`prefers-color-scheme`) on first load
- Sets `data-theme` attribute on `<html>` for DaisyUI theming

### Layout System

Control TopBar and Dock visibility per page via the `PageWrapper` component. Every page should wrap its content in `PageWrapper` with layout config as props.

**PageWrapper provides:** `flex flex-col gap-3 p-4` plus dynamic top/bottom padding for TopBar/Dock. Place children directly without wrapper divs.

```tsx
import PageWrapper from '@/components/PageWrapper'
import { TopBarTitle } from '@/components/layouts'
import CogIcon from '@/assets/icons/cog.svg?component'

// Default layout - children placed directly
<PageWrapper>
  <div class="card bg-base-200">First card</div>
  <div class="card bg-base-200">Second card</div>
</PageWrapper>

// TopBar with title and navigation
<PageWrapper
  layout={{
    topBar: {
      visible: true,
      title: () => <TopBarTitle title={t(messages.pages.profile.title)} />,
      left: { icon: CogIcon, to: '/settings' },
    },
  }}
>
  <div class="card bg-base-200">Content</div>
</PageWrapper>

// Hide dock (settings page)
<PageWrapper
  layout={{
    topBar: {
      visible: true,
      title: () => <TopBarTitle title={t(messages.pages.settings.title)} />,
      left: { icon: ArrowLeftIcon, to: '/profile' },
    },
    dock: { visible: false },
  }}
>
  <div class="card bg-base-200">Content</div>
</PageWrapper>
```

Layout options:
- `topBar.visible` - show/hide top navigation bar
- `topBar.title` - render function returning VNode (use `TopBarTitle` for standard styling)
- `topBar.left` / `topBar.right` - action with icon + `to` (route) or `onClick` (function)
- `dock.visible` - show/hide bottom navigation dock (defaults to `true`)

### Page Transitions

iOS-style carousel page transitions with scroll position preservation:

```
DefaultLayout
├── TopBar (fixed, animated slide-down)
├── main (relative, overflow-hidden)
│   └── RouterView with Transition + KeepAlive
│       └── PageContainer (absolute, per-page scroll)
│           └── PageWrapper (padding for topbar/dock)
│               └── Page content
└── Dock (fixed, animated slide-up)
```

**Key components:**
- `DefaultLayout` - orchestrates transitions, TopBar, and Dock
- `PageContainer` - scroll container with position preservation per route
- `PageWrapper` - handles padding based on layout config

**Transition behavior:**
- Pages slide horizontally (100vw) like native mobile apps
- No overlap - pages move together edge-to-edge
- Scroll position is saved when leaving and restored when returning
- KeepAlive caches page component state (max 10 pages)

**Direction detection:**
- Forward navigation (deeper route or new route): slide left
- Back navigation (shallower route or previously visited): slide right
- Tracked via `usePageTransition` composable in `core/composables/usePageTransition.ts`

### SVG Icons

SVGs are imported as Vue components via `vite-svg-loader`. Store icons in `src/assets/icons/`.

```tsx
import HomeIcon from '@/assets/icons/home.svg?component'

<HomeIcon class="h-5 w-5" />
```

Use `?component` suffix for proper TypeScript types. Types are declared via `/// <reference types="vite-svg-loader" />` in `vite-env.d.ts`.

### Suspense Slots in JSX

Vue Suspense slots must be passed as an object with render functions:

```tsx
<Suspense>
  {{
    default: () => <AsyncComponent />,
    fallback: () => <LoadingSpinner />
  }}
</Suspense>
```

### Platform System

Runtime platform detection with plugin-provided adapters. Core provides detection framework and browser fallback; platform-specific features are provided by plugins.

```
core/platform/
├── index.ts             # usePlatform, useHaptics, useBiometry, initPlatform
├── types.ts             # EPlatform, TPlatformCapabilities, TPlatformAdapter
├── detection.ts         # detectPlatform() - uses plugin-registered detectors
└── adapters/
    ├── index.ts         # registerPlatformDetector, registerPlatformAdapter
    └── browser.ts       # Default fallback (noop implementations)

plugins/
├── tma/                 # Telegram Mini App
└── pwa/                 # Progressive Web App (haptics, share, notifications)
```

Platform plugins register their detectors and adapters during setup (before platform detection):

```ts
// plugins/tma/index.ts
import { registerPlatformAdapter, registerPlatformDetector } from '@/core/platform/adapters'
import { EPlatform } from '@/core/platform/types'

const plugin: TPlugin = {
  name: 'tma',
  setup: async () => {
    registerPlatformDetector(EPlatform.TMA, isTMA)
    registerPlatformAdapter(EPlatform.TMA, adapter)
  },
  load: () => import('./exports').then(m => m.default),
}
```

**Using platform features:**

```ts
import { usePlatform, useHaptics, useBiometry } from '@/core/platform'

const { platform, capabilities, isTMA, isPWA } = usePlatform()
// platform.value: 'browser' | 'pwa' | 'tma'
// capabilities.value: { haptics, biometry, themeSync, ... }

const haptics = useHaptics()
haptics.impact('medium')  // Noop if unavailable

const biometry = useBiometry()
if (biometry.available) {
  const success = await biometry.authenticate('Confirm payment')
}
```

**Features by platform plugin:**
| Feature | Browser (core) | TMA plugin | PWA plugin |
|---------|----------------|------------|------------|
| Haptics | ❌ | ✅ | ✅ (vibrate) |
| Biometry | ❌ | ✅ | ❌ |
| Theme Sync | ❌ | ✅ | ❌ |
| Share | ❌ | ❌ | ✅ |
| Notifications | ❌ | ❌ | ✅ |

### Plugin System

Modular plugin architecture with build-time tree-shaking and lazy-loaded exports. Plugins are auto-loaded via Vite virtual module based on `plugins.config.ts`.

```
src/plugins/
└── [plugin-name]/
    ├── index.ts         # Plugin definition (routes, setup) - loaded at startup
    ├── exports.ts       # Heavy code (composables, components) - lazy loaded
    ├── bridge/          # Platform bridge (for platform plugins)
    ├── adapter.ts       # Platform adapter (for platform plugins)
    ├── pages/           # Plugin pages
    ├── modals/          # Plugin modals
    └── composables/

plugins.config.ts        # Enable/disable plugins (controls load order)
vite-plugins/
└── tree-shake-plugins.ts  # Generates virtual:plugins-loader
```

**Plugin configuration** (`plugins.config.ts`):

```ts
export const plugins: TPluginsConfig = {
  tma: { enabled: true },       // Platform plugin - TMA
  web3: { enabled: true },      // Feature plugin
  analytics: { enabled: false }, // Disabled - tree-shaken from bundle
}
```

Plugins load in the order they appear in config. Platform plugins should be listed first so they can register adapters before platform detection.

**Creating a plugin** (see `examples/plugin/`):

```ts
// plugins/myplugin/index.ts - KEEP LIGHTWEIGHT
import type { TPlugin } from '@/core/plugins'
import type { TMyPluginExports } from './exports'

const plugin: TPlugin<TMyPluginExports> = {
  name: 'myplugin',

  // App routes (registered at startup, components lazy-loaded)
  routes: [
    { path: '/myplugin', component: () => import('./pages/index') },
  ],

  // Modal routes
  modalRoutes: [
    { path: '/myplugin-modal', component: () => import('./modals/index') },
  ],

  // Setup phase: runs at startup before app mount
  setup: async (ctx) => {
    // Register global providers, init logic
  },

  // Heavy exports: lazy-loaded on first usePlugin() call
  load: () => import('./exports').then(m => m.default),
}

export default plugin
```

```ts
// plugins/myplugin/exports.ts - HEAVY CODE HERE
import { markRaw } from 'vue'
import MyComponent from './components/MyComponent'
import { useMyFeature } from './composables/useMyFeature'

export type TMyPluginExports = {
  useMyFeature: typeof useMyFeature
  MyComponent: typeof MyComponent
}

export default {
  useMyFeature,
  MyComponent: markRaw(MyComponent),  // Mark components with markRaw()
} satisfies TMyPluginExports
```

**Using a plugin:**

```tsx
import { usePlugin } from '@/core/plugins'
import type { TMyPluginExports } from '@/plugins/myplugin/exports'

const { ready, data: plugin } = usePlugin<TMyPluginExports>('myplugin')

// In render function:
if (!ready.value || !plugin.value) {
  return <Loading />
}

const feature = plugin.value.useMyFeature()
return <plugin.value.MyComponent />
```

**Adding a new plugin:**
1. Create plugin at `src/plugins/myplugin/` (follow `examples/plugin/` or `src/plugins/tma/` structure)
2. Add entry to `plugins.config.ts`: `myplugin: { enabled: true }`

That's it. The Vite plugin auto-generates the loader and build flags based on config.

**Plugin import rules:**
- Never import from inside a plugin except via `usePlugin()` (lazy-loaded exports)
- Plugin types can be imported directly: `import type { TMyPluginExports } from '@/plugins/myplugin/exports'`
- Platform plugin adapters are accessed via `usePlatform()`, not direct imports
