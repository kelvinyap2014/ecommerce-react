# Agent Guidance: E-Commerce Grocery Storefront React Project

This project demonstrates **React Front-End Engineering** capabilities for building hand-coded, maintainable UI architecture for e-commerce grocery and auto-replenishment systems using **TypeScript**, **Redux Toolkit (RTK)** for predictable state management, and **Tailwind CSS** for styling.

## Project Overview

**GrocerStore** is an e-commerce storefront application featuring:
- Consumable grocery catalog filtering via DummyJSON public API
- Subscription schedule configuration (One-time Purchase vs. Autodeliver recurring)
- Real-time pricing recalculations with discount logic (15% off autodeliver)
- Transparent state maintenance using Redux slices, async thunks, and strongly-typed selectors
- Full-stack CI/CD pipeline with Yarn, ESLint, Prettier, Jest, and Webpack

---

## Project Structure

```
ecommerce-react/
├── .github/
│   └── workflows/
│       └── build-react.yml     # GitHub Actions CI/CD pipeline (yarn lint, format:check, test, build)
├── apps/
│   └── storefront/             # React storefront application (Webpack-based)
│       ├── src/
│       │   ├── components/
│       │   │   ├── ProductCard.tsx     # Card component with subscription toggle
│       │   │   ├── ProductGrid.tsx     # Catalog container
│       │   │   ├── Navbar.tsx          # Top bar with cart item badge
│       │   │   └── CartDrawer.tsx      # Sliding cart drawer
│       │   ├── store/
│       │   │   ├── index.ts            # Redux store config & typed custom hooks
│       │   │   ├── productSlice.ts     # Product catalog slice with async thunks
│       │   │   └── cartSlice.ts        # Shopping cart slice with memoized selectors
│       │   ├── types/
│       │   │   └── grocery.ts          # Shared TypeScript interfaces & types
│       │   ├── App.tsx                 # Main layout component
│       │   └── index.tsx               # React entry point with Redux Provider
│       ├── public/
│       │   └── index.html              # HTML entry point
│       ├── package.json                # Yarn dependencies & scripts
│       ├── tsconfig.json               # TypeScript configuration
│       ├── tailwind.config.js          # Tailwind CSS configuration
│       ├── postcss.config.js           # PostCSS plugin configuration
│       ├── webpack.config.js           # Webpack build configuration
│       ├── jest.config.js              # Jest testing configuration
│       └── Dockerfile                  # Container image for deployment
├── LICENSE
└── README.md                           # Technical architecture & setup guide
```

---

## Technology Stack

| Component | Technology | Version |
|---|---|---|
| **Core Library** | React + TypeScript | 19.3.1 / 7.0.2 |
| **State Management** | Redux Toolkit | 2.13.0 |
| **Styling** | Tailwind CSS | 4.3.3 |
| **Build Tool** | Webpack | 5.112.2 |
| **Package Manager** | Yarn | Latest |
| **Code Quality** | ESLint + Prettier | 10.13.0 / 3.9.10 |
| **Testing** | Jest + ts-jest | 30.5.2 / 29.4.15 |
| **Development Server** | webpack-dev-server | 6.1.0 |

---

## Build & Development Commands

### Setup & Installation

```bash
cd apps/storefront

# Install dependencies
yarn install

# Initialize config files (if needed)
./node_modules/.bin/tailwindcss init -p
```

### Development Workflow

```bash
cd apps/storefront

# Start Development Server (watch mode, HMR enabled)
yarn start

# Run Linter (ESLint)
yarn lint

# Fix Linting Issues
yarn lint:fix

# Check Code Formatting (Prettier)
yarn format:check

# Auto-format Code
yarn format

# Run Unit & Integration Tests
yarn test

# Run Tests with Coverage Report
yarn test --coverage

# Build for Production
yarn build
```

### CI/CD Pipeline (GitHub Actions)

The `.github/workflows/build-react.yml` workflow runs on every push to main and pull request:

1. ✅ Install Dependencies — `yarn install --frozen-lockfile`
2. ✅ Lint Code — `yarn lint` (ESLint)
3. ✅ Check Formatting — `yarn format:check` (Prettier)
4. ✅ Run Tests — `yarn test --coverage` (Jest)
5. ✅ Build Application — `yarn build` (Webpack)

**Workflow triggers:**
- Push to main branch (if `apps/storefront/**` or `.github/workflows/build-react.yml` changed)
- Pull requests to main branch (same path filters)

---

## Development Workflow (Typical Sprint)

1. **Feature Branch** — Create a feature branch
   ```bash
   git checkout -b feature/xyz
   ```

2. **Local Development** — Start dev server
   ```bash
   cd apps/storefront
   yarn start
   ```

3. **Write/Edit Code** — Implement features in `src/` folder
   - Components: `src/components/`
   - Redux slices: `src/store/`
   - Shared types: `src/types/`

4. **Lint & Format** — Check code quality before commit
   ```bash
   yarn lint
   yarn format:check
   ```

5. **Run Tests** — Ensure test coverage
   ```bash
   yarn test
   ```

6. **Build Locally** — Validate production build
   ```bash
   yarn build
   ```

7. **Commit & Push** — Push feature branch
   ```bash
   git add .
   git commit -m "feat: add xyz feature"
   git push origin feature/xyz
   ```

8. **Code Review** — Create pull request, wait for approval & CI/CD checks

9. **Merge & Deploy** — Merge to main when all checks pass

---

## Key Files & Directories

| File/Directory | Purpose |
|---|---|
| `apps/storefront/src/` | Source code (components, store, types) |
| `apps/storefront/public/index.html` | HTML template for Webpack to bundle |
| `apps/storefront/package.json` | Dependencies & npm scripts |
| `apps/storefront/tsconfig.json` | TypeScript compiler options |
| `apps/storefront/webpack.config.js` | Webpack bundler configuration |
| `apps/storefront/jest.config.js` | Jest testing framework config |
| `apps/storefront/tailwind.config.js` | Tailwind CSS theme & plugin config |
| `apps/storefront/postcss.config.js` | PostCSS plugin pipeline (Tailwind) |
| `.github/workflows/build-react.yml` | CI/CD pipeline definition |
| `README.md` | Architecture, Redux design, component examples |

---

## Redux Architecture Overview

### State Shape

```typescript
// Root state (from src/store/index.ts)
{
  products: {
    items: Product[],          // Catalog from DummyJSON API
    isLoading: boolean,        // API call in progress
    error: string | null,      // Error message, if any
    searchQuery: string,       // Search term for filtering
  },
  cart: {
    items: CartItem[],         // Shopping cart items
    isDrawerOpen: boolean,     // Cart drawer visibility
  }
}
```

### Key Redux Patterns

1. **Product Slice** (`src/store/productSlice.ts`)
   - Async Thunk: `fetchProducts()`
   - Actions: `setSearchQuery()`
   - State: `items`, `isLoading`, `error`, `searchQuery`

2. **Cart Slice** (`src/store/cartSlice.ts`)
   - Actions: `addToCart()`, `updateQuantity()`, `removeItem()`, `toggleDrawer()`
   - Memoized Selectors: `selectTotalItemCount`, `selectSubtotal`, `selectTotalSavings`
   - Autodeliver discount logic: 15% off recurring orders

3. **Custom Hooks** (`src/store/index.ts`)
   - `useAppDispatch()` — Typed dispatch hook
   - `useAppSelector()` — Typed selector hook with RootState union

---

## API Integration

**Data Source**: [DummyJSON API](https://dummyjson.com/products/category/groceries)

```typescript
// Async Thunk in productSlice.ts
export const fetchProducts = createAsyncThunk<Product[], string, { rejectValue: string }>(
  'products/fetchProducts',
  async (searchQuery = '', { rejectWithValue }) => {
    const url = searchQuery.trim()
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery)}`
      : 'https://dummyjson.com/products/category/groceries';

    const response = await fetch(url);
    const data: ProductsResponse = await response.json();
    return data.products.filter((p) => p.category === 'groceries');
  }
);
```

**Error Handling**: Caught in `extraReducers` with state.error assignment and rollback on rejected thunks.

---

## Styling with Tailwind CSS

Tailwind is configured at `apps/storefront/tailwind.config.js` and processed via PostCSS into optimized CSS.

### Style Approach

All components use **utility-first Tailwind classes** (no CSS modules or styled-components):

```typescript
// Example: ProductCard.tsx
<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded" />
</div>
```

---

## Testing Strategy

### Jest Configuration

- Test framework: Jest 30.5.2 with ts-jest
- Test files: `**/*.test.ts`, `**/*.test.tsx`
- Coverage: Collect from `src/` (ignore `node_modules`, `dist`)

### Test Command

```bash
yarn test                      # Run all tests in watch mode
yarn test --coverage          # Generate coverage report
yarn test:cov                 # Alias if defined
```

**Example test structure:**
```typescript
// src/store/cartSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart, selectTotalItemCount } from './cartSlice';

describe('cartSlice', () => {
  it('should add items to cart', () => {
    const store = configureStore({ reducer: { cart: cartReducer } });
    const product = { id: 1, title: 'Milk', price: 2.50, ... };

    store.dispatch(addToCart({ product, isAutodeliver: true, frequency: '4-weeks' }));
    expect(selectTotalItemCount(store.getState())).toBe(1);
  });
});
```

---

## Code Quality & CI/CD

### ESLint Configuration

Lints TypeScript code for best practices and React hooks compliance.

```bash
yarn lint              # Check for issues
yarn lint:fix          # Auto-fix fixable issues
```

**ESLint Plugins:**
- `@typescript-eslint/eslint-plugin` — TypeScript-specific rules
- `eslint-plugin-react` — React best practices
- `eslint-plugin-react-hooks` — React Hooks rules (deps, cleanup)

### Prettier Configuration

Auto-formats code to consistent style.

```bash
yarn format            # Format all source files
yarn format:check      # Check formatting (CI/CD)
```

### GitHub Actions Workflow

Runs on every push/PR to main (path filters: `apps/storefront/**`, `.github/workflows/build-react.yml`):

```yaml
1. Install Dependencies (frozen-lockfile)
2. Lint Code (ESLint)
3. Check Formatting (Prettier)
4. Run Tests (Jest with coverage)
5. Build Application (Webpack production)
```

All 5 steps must pass before PR can be merged.

---

## Docker & Deployment

### Build Docker Image

```bash
docker build -f apps/storefront/Dockerfile -t grocer-store:latest .
```

### Run Locally

```bash
docker run -p 8080:8080 grocer-store:latest
```

The Dockerfile should:
1. Install dependencies
2. Run linting & tests
3. Build production bundle
4. Serve via lightweight HTTP server (e.g., Node.js, nginx)

---

## Available Skills

Load a skill for detailed step-by-step guidance:

| Skill | When to Use |
|---|---|
| `react-build` | Full React dev workflow (build, test, lint, format, deploy) |

---

## Stop & Consult User If

- Build or compilation fails with unclear error messages (attempt 5+ times, then ask)
- Tests fail consistently (>3 failing tests)
- Performance regression > 20% below baseline (e.g., bundle size +500KB)
- ESLint or Prettier config needs modification
- Need to add new dependencies or major framework upgrades
- Significant architectural changes are proposed (state management, routing, etc.)
- Unable to achieve zero errors/warnings in ESLint + Prettier checks

---

## Helpful Commands Quick Reference

```bash
# Development
cd apps/storefront
yarn install
yarn start                    # Dev server with HMR
yarn test                     # Run tests
yarn test --coverage          # Coverage report

# Code Quality
yarn lint
yarn lint:fix
yarn format
yarn format:check

# Build & Deploy
yarn build                    # Production bundle
docker build -f Dockerfile -t storefront:latest .
docker run -p 8080:8080 storefront:latest

# Git Workflow
git checkout -b feature/xyz
git add .
git commit -m "feat: description"
git push origin feature/xyz
```

---

## References

- **README.md** — Technical stack, Redux design patterns, component examples
- **apps/storefront/package.json** — Dependencies & build scripts
- **apps/storefront/src/** — Source code with inline documentation
- **.github/workflows/build-react.yml** — CI/CD pipeline configuration
