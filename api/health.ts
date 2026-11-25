import type { HttpLikeRequest, HttpLikeResponse } from '../server/chatHandler.ts';

export default function handler(
  _req: HttpLikeRequest,
  res: HttpLikeResponse
): void {
  res.status(200).json({ ok: true });
}
