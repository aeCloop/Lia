import { handleChatRequest } from '../server/chatHandler.ts';
import type {
  HttpLikeRequest,
  HttpLikeResponse,
} from '../server/chatHandler.ts';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
  },
};

export default async function handler(
  req: HttpLikeRequest,
  res: HttpLikeResponse
): Promise<void> {
  await handleChatRequest(req, res);
}
