export interface JwtPayload {
  sub: string; // matrícula como string
  matricula: string;
  persona: number;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  access_token: string;
  user: {
    matricula: string;
    persona: number;
    nombre?: string;
    apellido?: string;
  };
  expires_in: string;
  needsPasswordSetup?: boolean; // Para primera vez
  message?: string; // Mensaje adicional
}
