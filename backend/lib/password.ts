import bcrypt from "bcrypt";

// bcrypt work factor for new and upgraded password hashes. Older accounts were hashed with 5.
const ROUNDS = 10;

export function hashPassword(password: string) {
  return bcrypt.hash(password, ROUNDS);
}

// True for hashes made with a weaker work factor; they get upgraded at the next successful sign-in.
export function needsRehash(hash: string) {
  try {
    return bcrypt.getRounds(hash) < ROUNDS;
  } catch {
    return false; // not a bcrypt hash (e.g. Google/GitHub accounts have no password)
  }
}
