import prisma from '../../lib/prisma';
import { requireAuthApi } from '../../lib/auth';

function normalizeUserId(user) {
  const raw = user?.id ?? user?.userId ?? user?.sub ?? user?.uid;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function handler(req, res) {
 
  if (!['GET'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  
  const user = requireAuthApi(req, res);
  if (!user) return;

  const meId = normalizeUserId(user);
  if (!meId) {
    return res.status(401).json({ error: 'Sessão inválida: id do usuário ausente.' });
  }

  
  const dbUser = await prisma.user.findUnique({
    where: { id: meId },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });

  
  if (!dbUser) {
    return res.status(200).json({
      user: {
        id: meId,
        name: user?.name || null,
        email: user?.email || null,
      },
      source: 'token',
    });
  }

  return res.status(200).json({ user: dbUser, source: 'database' });
}