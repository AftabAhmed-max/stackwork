/* ============================================
   OPEN-REDIRECT GUARD
   Only ever allow redirects to RELATIVE paths inside
   this app. Rejects absolute URLs, protocol-relative
   URLs (//evil.com), and anything that doesn't start
   with a single '/'. We prefer hardcoded role-based
   destinations, but this guard backstops any case
   where a `next`/`redirectTo` param is honoured.
   ============================================ */

const ALLOWED_PREFIXES = ['/portal']

// True if the string contains any ASCII control char
// (0x00-0x1f, includes CR/LF/TAB) or DEL (0x7f). Done
// without a regex literal to avoid embedding raw control
// bytes in source.
function hasControlChars(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (c < 0x20 || c === 0x7f) return true
  }
  return false
}

export function safeInternalPath(input: unknown, fallback = '/portal'): string {
  if (typeof input !== 'string' || input.length === 0) return fallback

  // Must be a path, not an absolute or scheme-relative URL.
  if (
    !input.startsWith('/') ||
    input.startsWith('//') ||
    input.startsWith('/\\') ||
    input.includes('\\') ||
    hasControlChars(input)
  ) {
    return fallback
  }

  // Constrain to known in-app areas.
  if (!ALLOWED_PREFIXES.some((p) => input === p || input.startsWith(p + '/'))) {
    return fallback
  }

  return input
}
