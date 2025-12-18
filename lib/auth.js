import jwt from 'jsonwebtoken';
import { serialize, parse as parseCookie } from 'cookie';

const COOKIE_NAME = 'AUTH_TOKEN';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_TTL = 60 * 60 * 24 * 7; 


export function signToken(user) {
  const payload = {
    id: user.id,                  
    email: user.email || '',
    name: user.name || '',
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}


function makeCookie(token, maxAge = TOKEN_TTL) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge,
  });
}


export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', makeCookie(token));
}


export function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 0,
    })
  );
}


export function parseAuth(req) {
  try {
    const raw = req.headers?.cookie ? parseCookie(req.headers.cookie) : {};
    const token = raw[COOKIE_NAME];
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded && typeof decoded === 'object' ? decoded : null;
  } catch {
    return null;
  }
}


export function requireAuthApi(req, res) {
  const user = parseAuth(req);
  if (!user) {
    res.status(401).json({ error: 'Não autenticado' });
    return null;
  }
  return user;
}


export async function requireAuthPage(ctx) {
  const user = parseAuth(ctx.req);
  if (!user) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }
  return { props: { user } };
}


export function getUserFromReq(req) {
  return parseAuth(req);
}