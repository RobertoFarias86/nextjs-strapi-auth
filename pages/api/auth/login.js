import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { signToken, setAuthCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

   
    const payload = { id: user.id, name: user.name, email: user.email };
    const token = signToken(payload);
    setAuthCookie(res, token);

    
    return res.status(200).json({ user: payload });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao autenticar' });
  }
}