import prisma from '../../../lib/prisma';
import { requireAuthApi } from '../../../lib/auth';


function getUserId(user) {
  const raw = user?.id ?? user?.userId ?? user?.sub ?? user?.documentId ?? user?.uid;
  return raw ? Number(raw) : undefined;
}

export default async function handler(req, res) {
  const user = requireAuthApi(req, res);
  if (!user) return; 

  const me = getUserId(user);
  if (!me) return res.status(401).json({ error: 'Sessão inválida: id do usuário ausente.' });

  if (req.method === 'GET') {
    const msgs = await prisma.message.findMany({
      where: { OR: [{ fromUserId: me }, { toUserId: me }] },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
      },
    });
    return res.status(200).json({ messages: msgs });
  }

  if (req.method === 'POST') {
    const { content: c1, body: c2, toUserId } = req.body || {};
    const content = (c1 ?? c2 ?? '').trim();
    if (!content) return res.status(400).json({ error: 'Mensagem vazia' });

    const toId = toUserId ? Number(toUserId) : me;

    const created = await prisma.message.create({
      data: { content, fromUserId: me, toUserId: toId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        fromUserId: true,
        toUserId: true,
      },
    });
    return res.status(201).json({ message: created });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}