import { defineConfig } from 'vite';
import { sallaTransformPlugin, sallaBuildPlugin, sallaDemoPlugin } from '@salla.sa/twilight-bundles/vite-plugins';
import path from 'path';
import fs from 'fs';

const fixWindowsPathsPlugin = () => {
  return {
    name: 'fix-windows-paths',
    transformIndexHtml(html) {
      if (process.platform !== 'win32') return html;
      
      return html.replace(
        /(\/@fs\/?)?([a-zA-Z]):\\\\/g, 
        '/@fs/$2://'
      ).replace(
        /(\/@fs\/[a-zA-Z]:\/\/)([^"]+)/g,
        (match, prefix, path) => {
          return prefix + path.replace(/\\\\/g, '/');
        }
      );
    }
  };
};

/** Mock form-builder API so demo preview works without CORS (POST to same origin) */
const formBuilderMockPlugin = () => ({
  name: 'form-builder-mock',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0];
      if (req.method !== 'POST' || url !== '/api/v1/form-builder-mock') return next();
      let body = '';
      req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true, data: body ? JSON.parse(body || '{}') : {} }));
      });
    });
  }
});

/** Inject import map for "lit" and point form builder to local mock so preview works */
const litImportMapPlugin = () => ({
  name: 'lit-import-map',
  enforce: 'pre' as const,
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0];
      if (url !== '/node_modules/.salla-temp/index.html') return next();
      const index = path.join(server.config.root, 'node_modules/.salla-temp/index.html');
      if (!fs.existsSync(index)) return next();
      let html = fs.readFileSync(index, 'utf-8');
      if (html.includes('twilight-bundles.js') && !html.includes('type="importmap"')) {
        const importMap = `
    <script type="importmap">
      {"imports":{"lit":"/node_modules/.vite/deps/lit.js","lit/decorators.js":"/node_modules/.vite/deps/lit_decorators__js.js"}}
    </script>`;
        html = html.replace(/(<head[^>]*>)/i, `$1${importMap}`);
      }
      // Point form builder to same-origin mock so POST succeeds and component preview works
      if (html.includes('formBuilderMockUrl')) {
        html = html.replace(
          /window\.formBuilderMockUrl\s*=\s*'[^']*'/,
          "window.formBuilderMockUrl = '/api/v1/form-builder-mock'"
        );
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
    });
  }
});

export default defineConfig({
  resolve: {
    alias: [
      { find: /^lit$/, replacement: path.resolve(__dirname, 'node_modules/lit/index.js') },
      { find: /^lit\/decorators\.js$/, replacement: path.resolve(__dirname, 'node_modules/lit/decorators.js') }
    ]
  },
  optimizeDeps: {
    include: ['lit', 'lit/decorators.js']
  },
  plugins: [
    formBuilderMockPlugin(),
    litImportMapPlugin(),
    fixWindowsPathsPlugin(),
    sallaTransformPlugin(),
    sallaBuildPlugin(),
    sallaDemoPlugin({
      grid: {
        columns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }
    })
  ]
});
