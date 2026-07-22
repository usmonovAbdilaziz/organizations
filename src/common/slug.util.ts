/**
 * SEO-friendly slug generator.
 * Transliterates Cyrillic (uz/ru) + Uzbek Latin specials to ASCII,
 * lowercases, and collapses everything else to single hyphens.
 */
const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu',
  я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

const LATIN_MAP: Record<string, string> = {
  "o'": 'o', "g'": 'g', 'oʻ': 'o', 'gʻ': 'g', 'ʼ': '', "'": '', 'ʻ': '',
};

export function slugify(input: string): string {
  if (!input) return '';
  let s = input.toLowerCase().trim();

  for (const [from, to] of Object.entries(LATIN_MAP)) {
    s = s.split(from).join(to);
  }
  s = s
    .split('')
    .map((ch) => (ch in CYRILLIC_MAP ? CYRILLIC_MAP[ch] : ch))
    .join('');

  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Build a slug that is unique against `exists(slug) => boolean`.
 * Appends -2, -3, ... on collision. Falls back to a random suffix.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  let root = slugify(base) || 'org';
  let candidate = root;
  let i = 1;
  while (await exists(candidate)) {
    i += 1;
    candidate = `${root}-${i}`;
    if (i > 50) {
      candidate = `${root}-${Math.random().toString(36).slice(2, 8)}`;
      break;
    }
  }
  return candidate;
}
