# Elezz land

This starter kit provides a foundation for building custom Twilight components for Salla's e-commerce platform. It includes a pre-configured build setup and development environment to help you get started quickly.

## Salla SA Development Requirements

Before developing, ensure these are installed (per [Salla CLI docs](https://docs.salla.dev/)):

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** (LTS) | ≥ 16.13.1 | Runtime for Salla CLI and this project |
| **npm** | ≥ 6.14.0 | Package manager; used to install Salla CLI globally |
| **Salla CLI** | latest | Create/manage Salla Apps and Twilight themes |

**Optional (for other Salla workflows):** PHP ≥ 8.2, [Composer](https://getcomposer.org/).

### Install Salla CLI (global)

```bash
npm install @salla.sa/cli -g
```

Verify: `salla` or `salla version` (e.g. 3.2.x).

### Partner account

Create a [Salla Partners](https://salla.partners/) account to create apps, use demo stores, and publish to the [Salla App Store](https://apps.salla.sa/).

---

## Getting Started

1. Clone this repository
2. Remove the example components in `src/components/` using:
   ```
   tw-delete-component
   ```
3. Create your own components using the component generator:
   ```
   tw-create-component <component-name>
   ```
4. Run `pnpm install` to install dependencies
5. Run `pnpm run dev` to start the development server
6. Run `pnpm run build` to build your components for production

## Project Structure

```
src/
  components/
    your-component-name/
      index.ts        # Main component file
      styles.ts       # Component styles (optional)
      types.ts        # Component types (optional)
```

## Built-in Plugins

This starter kit includes three Vite plugins that handle the build process:

### 1. Transform Plugin (`sallaTransformPlugin`)
- Transforms component files to ensure proper naming and registration
- Matches components in `src/components/*/index.ts`
- To disable: Remove from `vite.config.ts` plugins array

### 2. Build Plugin (`sallaBuildPlugin`)
- Handles component bundling and output
- Creates individual files for each component in `dist/`
- Configures external dependencies (lit libraries)
- To customize: Remove from plugins array and configure your own build settings:
  ```typescript
  {
    build: {
      lib: {
        entry: {/* your entries */},
        formats: ['es'],
        fileName: (format, entryName) => `${entryName}.js`
      },
      rollupOptions: {
        external: [/^lit/],
        output: {/* your output config */}
      }
    }
  }
  ```

### 3. Demo Plugin (`sallaDemoPlugin`)
- Provides a development environment for testing components
- Creates a demo page with your components
- Configures hot module reloading
- To disable: Remove from plugins array and set up your own dev server

### Demo Plugin Options

The `sallaDemoPlugin` accepts the following configuration options:

```typescript
{
  // Optional: Show only specific components
  components?: string[];

  // Optional: Customize the demo grid layout
  grid?: {
    // CSS grid-template-columns value
    columns?: string;     // default: 'repeat(auto-fill, minmax(300px, 1fr))'
    
    // Gap between components
    gap?: string;        // default: '1rem'
    
    // Responsive breakpoint
    minWidth?: string;   // default: '300px'
  };

  // Optional: Add custom CSS
  css?: string;

  // Optional: Add custom JavaScript
  js?: string;
}
```

#### Example Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    // ... other plugins
    sallaDemoPlugin({
      // Show only specific components
      components: ['product-card', 'scroll-top'],
      
      // Customize grid layout
      grid: {
        columns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        minWidth: '768px'
      },

      // Add custom styles
      css: `
        .component-card {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .component-card:hover {
          transform: translateY(-2px);
        }
      `,

      // Add custom JavaScript
      js: `
        console.log('Demo page loaded!');
        // Add your custom JavaScript here
      `
    })
  ]
});
```

## Component Management

### Creating New Components

This starter kit includes a component generator to help you create new components quickly. To use it, run:

```bash
pnpm tw-create-component <component-name>
```

Or run without arguments for interactive mode:

```bash
pnpm tw-create-component
```

The generator will:
1. Prompt you for a component name (in kebab-case format)
2. Validate that the name is in kebab-case and doesn't already exist
3. Create a new component folder with an `index.ts` file
4. Add the component definition to `twilight-bundle.json`

### Deleting Components

To remove a component, use:

```bash
pnpm tw-delete-component <component-name>
```

Or run without arguments to see a list of available components:

```bash
pnpm tw-delete-component
```

This will:
1. Show a list of available components to select from
2. Ask for confirmation before deletion
3. Remove the component folder from `src/components/`
4. Remove the component definition from `twilight-bundle.json`

## Component Requirements

Each component should:
1. Be a class that extends `LitElement`
2. Export the class as default
3. Be placed in its own directory under `src/components/`
4. Have an `index.ts` as the entry point

Example:
```typescript
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export default class MyComponent extends LitElement {
  @property({ type: Object })
  config?: {
    name: string;
    //... other properties
  };

  static styles = css`/* your styles */`;

  render() {
    return html`<div>Hello ${this.config?.name || 'World'}!</div>`;
  }
}
```

## Building for Production

Run `pnpm run build` to create production-ready bundles in the `dist/` directory. Each component will have its own file named after the component (e.g., `my-component.js`).

## Development

Run `pnpm run dev` to start the development server. This will:
1. Create a demo page with all your components
2. Enable hot module reloading
3. Provide a development environment for testing

### Component preview (form builder)

The demo uses Salla's form builder, which POSTs to a mock API. If that request fails (e.g. CORS), component preview may not update correctly. To fix:

1. In one terminal, run the local mock: `pnpm run form-builder-mock` (starts on port 3131).
2. In another terminal, run dev with the mock URL: `TWILIGHT_FORM_BUILDER_MOCK_BASE_URL=http://localhost:3131 pnpm run dev`.
3. Open the demo page; the form builder will use the local mock and component preview should work.

## License

MIT
