import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const SALT_BYTES = 16;
const KEY_LENGTH = 64;

/** Parolni hash qilish — salt va hash qaytaradi */
export async function hashPassword(password: string): Promise<{ salt: string; hash: string }> {
  const salt = randomBytes(SALT_BYTES).toString('base64');
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return { salt, hash: derived.toString('base64') };
}

/** Parolni tekshirish — timing-safe comparison */
export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(expectedHash, 'base64');
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
