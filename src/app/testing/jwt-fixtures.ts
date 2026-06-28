export interface JwtPayload {
  id?: number;
  groups?: string[];
  exp?: number;
}

export function buildJwt(payload: JwtPayload): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

export function buildValidJwt(groups: string[] = ['passport.admin']): string {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return buildJwt({ id: 1, groups, exp });
}

export function buildExpiredJwt(groups: string[] = ['passport.admin']): string {
  const exp = Math.floor(Date.now() / 1000) - 3600;
  return buildJwt({ id: 1, groups, exp });
}
