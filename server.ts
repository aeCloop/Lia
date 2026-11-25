import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleChatRequest } from './server/chatHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '16mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    await handleChatRequest(req, res);
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const indexPath = path.join(distDir, 'index.html');
    const rawIndexHtml = fs.existsSync(indexPath)
      ? fs.readFileSync(indexPath, 'utf-8')
      : '';

    app.use(express.static(distDir, { index: false }));
    app.get('/{*splat}', (req: Request, res: Response) => {
      if (!rawIndexHtml) {
        res.sendFile(indexPath);
        return;
      }
      const forwardedProto =
        (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim() ||
        'https';
      const host =
        (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0]?.trim() ||
        req.headers.host;
      const html =
        host && rawIndexHtml.includes('content="/og-image.png"')
          ? rawIndexHtml.replaceAll(
              'content="/og-image.png"',
              `content="${forwardedProto}://${host}/og-image.png"`
            )
          : rawIndexHtml;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lia server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
