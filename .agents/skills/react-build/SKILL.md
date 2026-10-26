# SKILL: React Build & Development Workflow

Complete step-by-step guide for building, testing, and deploying the E-Commerce Grocery Storefront React application using Yarn, Webpack, Jest, ESLint, and Prettier.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Development Workflow](#development-workflow)
3. [Testing & Code Quality](#testing--code-quality)
4. [Building for Production](#building-for-production)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Project Setup

### Prerequisites

- **Node.js** 18+ (with npm or corepack)
- **Yarn** 3.6+ (package manager)
- **Git** (version control)

### Step 1: Clone & Navigate to Project

```bash
# Navigate to workspace root
cd /home/user/hobby/ecommerce-react

# Verify project structure
ls -la apps/storefront/
#  output: src/ public/ package.json tsconfig.json webpack.config.js ...
```

### Step 2: Install Global Yarn (if needed)

```bash
# Install Yarn globally via npm or corepack
npm install -g yarn

# Verify installation
yarn --version
# output: 3.6.0 (or higher)
```

### Step 3: Install Project Dependencies

```bash
# Navigate to React storefront directory
cd apps/storefront

# Install all dependencies from package.json
yarn install

# Verify dependencies installed
ls -la node_modules/ | head -20
# output: @reduxjs, @types, react, react-dom, webpack, ...
```

**Expected output:**
- ✅ All dependencies installed in `node_modules/`
- ✅ `yarn.lock` file created (version-pinned dependencies)
- ✅ `node_modules/.bin/` contains executable build tools

### Step 4: Verify TypeScript Configuration

```bash
# Check TypeScript target and module settings
cat tsconfig.json | grep -E '"target"|"module"'
# output: "target": "ES2020", "module": "ESNext"

# Verify TypeScript is installed
./node_modules/.bin/tsc --version
# output: Version X.X.X
```

---

## Development Workflow

### Workflow Overview

```
Start Dev Server → Write Code → Lint & Format → Test → Commit → Push
     (Step 1)        (Step 2)       (Step 3)     (Step 4) (Step 5) (Step 6)
```

### Step 1: Create Feature Branch

```bash
# At project root
cd /home/user/hobby/ecommerce-react

# Create feature branch from main
git checkout -b feature/xyz-description

# Verify branch created
git branch -a
# output: * feature/xyz-description
#          main
```

### Step 2: Start Development Server

```bash
# Navigate to React app
cd apps/storefront

# Start Webpack dev server (watch mode with HMR)
yarn start

# Expected output:
# <W> [webpack-dev-server] Project is running at:
# <W> [webpack-dev-server] Localhost: http://localhost:8080/
# <W> [webpack-dev-server] On Your Network: http://192.168.x.x:8080/
```

**Dev Server Features:**
- ✅ Hot Module Replacement (HMR) — code changes auto-refresh browser
- ✅ TypeScript type-checking during compilation
- ✅ Source maps for easy debugging
- ✅ Auto-refresh on `.tsx` file changes

### Step 3: Write Code

#### Editing Components

```typescript
// Example: src/components/ProductCard.tsx
import React, { useState } from 'react';
import { Product, DeliveryFrequency } from '../types/grocery';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [purchaseType, setPurchaseType] = useState<'once' | 'autodeliver'>('autodeliver');
  const [frequency, setFrequency] = useState<DeliveryFrequency>('4-weeks');

  const autodeliverPrice = (product.price * 0.85).toFixed(2);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        isAutodeliver: purchaseType === 'autodeliver',
        frequency,
      })
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* JSX content */}
    </div>
  );
};
```

**File Organization:**
- Components: `src/components/*.tsx`
- Redux slices: `src/store/*.ts` (with `.test.ts` tests)
- Shared types: `src/types/grocery.ts`
- Entry point: `src/index.tsx`
- Root component: `src/App.tsx`

#### Editing Redux Store

```typescript
// Example: src/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product, DeliveryFrequency } from '../types/grocery';

interface AddToCartPayload {
  product: Product;
  isAutodeliver: boolean;
  frequency: DeliveryFrequency;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isDrawerOpen: false,
  },
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      // Immer-based mutation syntax
      const { product, isAutodeliver, frequency } = action.payload;
      state.items.push({
        product,
        quantity: 1,
        isAutodeliver,
        frequency,
      });
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
```

**Redux Best Practices:**
- Immutable state updates (Redux Toolkit uses Immer)
- Type-safe actions with PayloadAction
- Extract selectors as separate exports
- Use memoized selectors for derived state

### Step 4: Live Debugging

With dev server running, open browser:

```bash
# In a new terminal (dev server still running in first terminal)
# Open http://localhost:8080/

# Chrome DevTools:
# - Inspect Elements (Ctrl+Shift+I)
# - Redux DevTools Extension (if installed)
# - Console for errors
# - Sources tab for breakpoints

# Redux DevTools:
# Install browser extension: https://github.com/reduxjs/redux-devtools-extension
# Then you can inspect / replay Redux actions in browser
```

---

## Testing & Code Quality

### Step 1: Run Linter (ESLint)

```bash
# From apps/storefront/
cd /home/user/hobby/ecommerce-react/apps/storefront

# Check for linting errors
yarn lint

# Expected output (if no errors):
# ✔ No ESLint errors found

# Or (if errors exist):
# src/components/ProductCard.tsx
#   42:5  error  'unused variable'  no-unused-vars
```

### Step 2: Auto-fix Linting Issues

```bash
# Auto-fix fixable ESLint issues (imports, spacing, etc.)
yarn lint:fix

# Verify fixes
yarn lint
# output: ✔ No ESLint errors found
```

**Common ESLint Rules:**
- `no-unused-vars` — Remove unused imports/variables
- `react-hooks/rules-of-hooks` — Hook dependency correctness
- `@typescript-eslint/no-explicit-any` — Avoid `any` type
- `no-console` — Remove debug console.log (warn level)

### Step 3: Check Code Formatting (Prettier)

```bash
# Check if code matches Prettier format (no changes)
yarn format:check

# Expected output:
# ✔ All files are formatted correctly

# Or (if formatting issues):
# src/components/ProductCard.tsx
# src/store/cartSlice.ts
```

### Step 4: Auto-format Code

```bash
# Auto-format all source files to Prettier style
yarn format

# Verify formatting
yarn format:check
# output: ✔ All files are formatted correctly
```

**Prettier Rules Applied:**
- Single quotes (') for strings
- 2-space indentation
- 80-character line length (with exceptions)
- Trailing commas in multi-line arrays/objects
- JSX formatting with closing tag on new line

### Step 5: Run Unit Tests

```bash
# Run Jest (test runner)
yarn test

# Interactive mode (press 'a' to run all):
# PASS  src/store/cartSlice.test.ts
# ✓ cartSlice addToCart should add items (25ms)
# ✓ selectTotalItemCount should return correct count (5ms)
#
# Test Suites: 1 passed
# Tests:       2 passed

# Or exit code on first failure (CI mode)
yarn test --run  # or CI=true yarn test
```

### Step 6: Run Tests with Coverage Report

```bash
# Generate coverage report
yarn test --coverage

# Output:
# ————————————————————————————————————————
# File                | % Stmts | % Branch | % Funcs | % Lines
# ————————————————————————————————————————
# All files           |  85.2   |  80.1    |  90.0   |  84.9
# src/store/cartSlice |  92.0   |  88.0    |  100    |  91.5
# src/components      |  78.0   |  72.0    |  85.0   |  77.8
# ————————————————————————————————————————

# Coverage report also generated as HTML in coverage/index.html
open coverage/index.html  # View visual report in browser
```

**Coverage Targets:**
- Statements: ≥ 80%
- Branches: ≥ 75%
- Functions: ≥ 80%
- Lines: ≥ 80%

### Step 7: Full Quality Check (Pre-commit)

```bash
# Run all checks in sequence
bash -c '
  echo "🔍 Linting..."
  yarn lint && \
  echo "✨ Formatting..."
  yarn format:check && \
  echo "🧪 Testing..."
  yarn test --coverage && \
  echo "✅ All checks passed!"
'
```

---

## Building for Production

### Step 1: Build Webpack Bundle

```bash
# From apps/storefront/
cd apps/storefront

# Build for production (minified, optimized)
yarn build

# Expected output:
# asset index.js 125 KiB [compared to initial]
# asset index.css 45 KiB [compared to initial]
# webpack x.x.x compiled with 0 warnings in XXXms

# Verify build output
ls -lh dist/
# output: index.html (4.2K)
#         index.js (125K)
#         index.css (45K)
```

**Build Optimizations:**
- ✅ Code minification (remove whitespace, rename variables)
- ✅ Tree shaking (remove dead code)
- ✅ Chunk splitting (separate vendor bundle)
- ✅ CSS optimization (combine, minify)
- ✅ Source maps (for debugging production builds)

### Step 2: Test Production Build Locally

```bash
# Install simple HTTP server
npm install -g http-server

# Serve dist/ folder
cd dist/
http-server -p 8000 -c-1

# Open browser
open http://localhost:8000/

# Verify:
# - Page loads without errors
# - Network tab shows minified bundle
# - Console has no errors
```

### Step 3: Docker Build (Optional)

```bash
# From project root
cd /home/user/hobby/ecommerce-react

# Build Docker image
docker build -f apps/storefront/Dockerfile -t grocer-store:latest .

# Expected output:
# Successfully built abc123def456
# Successfully tagged grocer-store:latest

# Run container
docker run -p 8080:8080 grocer-store:latest

# Test in browser
open http://localhost:8080/
```

---

## Commit & Push Workflow

### Step 1: Stage Changes

```bash
# From project root
cd /home/user/hobby/ecommerce-react

# View status
git status
# output: On branch feature/xyz-description
#         modified:   apps/storefront/src/components/ProductCard.tsx
#         modified:   apps/storefront/src/store/cartSlice.ts

# Stage all changes
git add .

# Or stage specific files
git add apps/storefront/src/components/ProductCard.tsx
```

### Step 2: Create Commit

```bash
# Commit with descriptive message
git commit -m "feat: add subscription toggle to ProductCard component

- Add isAutodeliver state toggle in ProductCard
- Display 15% discount for autodeliver option
- Add frequency selector dropdown for autodeliver
- Add tests for new cart functionality
"

# Verify commit created
git log --oneline -3
```

**Commit Message Format:**
- Type: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`
- Scope: `(ProductCard)`, `(cartSlice)`, etc.
- Subject: Imperative, lowercase, no period
- Body: Optional, wrapped at 72 chars

### Step 3: Push to Remote

```bash
# Push feature branch to origin
git push origin feature/xyz-description

# If first push, set upstream
git push --set-upstream origin feature/xyz-description
```

### Step 4: Create Pull Request

```bash
# On GitHub, create PR from feature/xyz-description → main
# PR description should reference:
# - Related issues (#123)
# - Summary of changes
# - Testing performed
# - Screenshots (if UI changes)

# GitHub Actions will automatically:
# ✅ yarn lint
# ✅ yarn format:check
# ✅ yarn test --coverage
# ✅ yarn build
```

### Step 5: Merge (After Review)

```bash
# Once PR approved and CI passes:
# Click "Squash and merge" (or "Rebase and merge") on GitHub

# Pull latest main to local
git checkout main
git pull origin main

# Verify branch merged
git branch -a
# output: feature/xyz-description should be gone
```

---

## Troubleshooting Common Issues

### Issue 1: Dev Server Won't Start

**Error:** `Port 8080 already in use` or `EADDRINUSE`

**Solution:**
```bash
# Kill process on port 8080
lsof -i :8080
# output: node  12345  user  ...

kill -9 12345

# Or use different port
PORT=3000 yarn start
```

### Issue 2: ESLint / Prettier Conflict

**Error:** ESLint warns about formatting, but Prettier changes it back

**Solution:**
```bash
# ESLint should defer to Prettier for formatting
# Ensure .eslintrc includes:
# "prettier" in extends array
# eslint-config-prettier installed

yarn add -D eslint-config-prettier

# Then run both in sequence
yarn lint:fix && yarn format
```

### Issue 3: Tests Fail with Module Resolution

**Error:** `Cannot find module '@reduxjs/toolkit'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install

# Verify jest.config.js moduleNameMapper
cat jest.config.js | grep -A5 moduleNameMapper

# Run tests again
yarn test
```

### Issue 4: TypeScript Compilation Errors

**Error:** `Property 'X' does not exist on type 'Y'`

**Solution:**
```bash
# Check TypeScript compiler in dev server (will show errors)
# Or run tsc directly
./node_modules/.bin/tsc --noEmit

# Common fixes:
# - Add missing type imports: import { Product } from '../types/grocery'
# - Export types from index.ts: export type { Product }
# - Update tsconfig target/lib if necessary
```

### Issue 5: Build Size Too Large

**Issue:** `yarn build` produces bundle > 200KB

**Solution:**
```bash
# Analyze bundle composition
npm install -g webpack-bundle-analyzer

# Add to webpack.config.js:
# const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
# plugins: [new BundleAnalyzerPlugin()]

yarn build
# Opens http://localhost:8888 with visual breakdown

# Reduce size by:
# - Code-split lazy-load routes (React.lazy)
# - Remove unused dependencies
# - Compression (gzip in nginx/CDN)
```

### Issue 6: Tests Timeout

**Error:** `Test timed out - 5000ms exceeded`

**Solution:**
```bash
# Increase Jest timeout for async tests
// In test file:
jest.setTimeout(10000);

describe('Async fetch', () => {
  it('should load products', async () => {
    // test code
  }, 10000);  // 10 second timeout
});

# Or increase globally in jest.config.js:
# testTimeout: 10000
```

---

## CI/CD Pipeline Troubleshooting

### GitHub Actions Failure: `yarn lint failed`

```bash
# Replicate locally
cd apps/storefront
yarn lint

# Fix issues
yarn lint:fix

# Commit and push
git add .
git commit -m "fix: resolve linting issues"
git push origin feature/xyz
```

### GitHub Actions Failure: `Test coverage below threshold`

```bash
# Check coverage locally
yarn test --coverage

# If below 80% for key files, add tests:
# Create src/store/cartSlice.test.ts
# Add test cases for new functions

# Re-run and push
yarn test --coverage
git push origin feature/xyz
```

### GitHub Actions Failure: `Build step failed`

```bash
# Build locally
yarn build

# Check output errors
# Common issues:
# - Unused variables (remove or prefix with _)
# - TypeScript errors (fix types)
# - Missing dependencies (yarn install)

# Commit and re-run
git push origin feature/xyz
```

---

## Performance Tips

### 1. Lazy-Load Components

```typescript
// src/components/CartDrawer.tsx
import React, { Suspense } from 'react';
const CartDrawer = React.lazy(() => import('./CartDrawer'));

export const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CartDrawer />
  </Suspense>
);
```

### 2. Memoize Redux Selectors

```typescript
// src/store/cartSlice.ts
export const selectTotalItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);
// Only recalculates when selectCartItems result changes
```

### 3. Use React.memo for Components

```typescript
// src/components/ProductCard.tsx
export const ProductCard = React.memo(({ product }: Props) => {
  // Component only re-renders if `product` prop changes
  return <div>...</div>;
});
```

### 4. Code Split with Dynamic Imports

```typescript
// Only load checkout form when needed
const CheckoutForm = dynamic(() => import('./CheckoutForm'), {
  loading: () => <div>Loading...</div>,
});
```

---

## Additional Resources

- [React 19 Documentation](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)
- [Webpack Configuration](https://webpack.js.org/configuration/)
- [Jest Testing Guide](https://jestjs.io/docs/getting-started)
- [ESLint Docs](https://eslint.org/docs/latest/)
- [Prettier Docs](https://prettier.io/docs/en/index.html)
