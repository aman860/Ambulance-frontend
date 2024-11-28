import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  role: string;
  [key: string]: any; // For additional fields in the payload
}

export const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
