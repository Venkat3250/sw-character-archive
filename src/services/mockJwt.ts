/**
 * SWAPI is unauthenticated, so there is nothing real to sign against. This
 * module produces structurally correct (header.payload.signature) JWT-shaped
 * tokens entirely client-side so the app can demonstrate a realistic
 * access-token / refresh-token / silent-refresh flow end to end.
 */

export interface TokenPayload {
  sub: string;
  name: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

const HEADER = { alg: 'none', typ: 'JWT' };

function base64UrlEncode(value: unknown): string {
  const json = JSON.stringify(value);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode<T>(segment: string): T {
  const b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const json = decodeURIComponent(escape(atob(padded)));
  return JSON.parse(json) as T;
}

export function createToken(sub: string, name: string, ttlSeconds: number, type: 'access' | 'refresh'): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { sub, name, iat, exp: iat + ttlSeconds, type };
  const headerPart = base64UrlEncode(HEADER);
  const payloadPart = base64UrlEncode(payload);
  // Mock signature: clearly not a real HMAC, just gives the token the right shape.
  const signaturePart = base64UrlEncode({ mock: true, len: (headerPart + payloadPart).length });
  return `${headerPart}.${payloadPart}.${signaturePart}`;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const [, payloadPart] = token.split('.');
    return base64UrlDecode<TokenPayload>(payloadPart);
  } catch {
    return null;
  }
}

export function isExpired(payload: TokenPayload, skewSeconds = 0): boolean {
  return Date.now() / 1000 >= payload.exp - skewSeconds;
}
