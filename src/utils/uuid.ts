/** Generates a random UUIDv4. */
export function randomUUID(): string {
  if (typeof crypto === 'object' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  } else {
    // Fallback, e.g. for non-HTTPS/local contexts, see https://stackoverflow.com/a/2117523
    console.warn('Using fallback UUID generator');
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }
}
