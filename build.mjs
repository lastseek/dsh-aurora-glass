/**
 * Build step: inline the authored skin material (skin/tokens.json + skin/skin.css)
 * into the browser half (lib/client.js).
 *
 * The bundle has to be a single file — dsh-client-modules serves exactly
 * `dsh.client`'s file and the factory runs in the page, where a relative fetch
 * of a CSS asset would be a second network dependency. So the source of truth
 * stays the two authored files and this script is the only writer of lib/.
 *
 * Usage: node build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Tokens are authored as JSON (so tooling can diff the palette) and emitted as
 * a `body[data-aurora-glass] { … }` block, not as inline variables on <body>.
 *
 * Why a stylesheet rule and not `body.style.setProperty`: the shell's own theme
 * presenter owns the inline variables for the active definition and re-syncs
 * them on every `theme/change` — it removes the names it wrote before rewriting
 * them. Writing the same names inline from here therefore races that presenter
 * and loses whenever it repaints. A rule inside the skin sheet is independent of
 * that cycle: it applies for exactly as long as the gate attribute is on, it
 * inherits the aliases wherever the shell reads them, and disabling the plugin
 * removes it with the rest of the sheet.
 */
function withTokenBlock(css, tokens) {
  const lines = Object.entries(tokens).map(([name, value]) => `  ${name}: ${value};`);
  return `body[data-aurora-glass] {\n${lines.join('\n')}\n}\n\n${css}`;
}

const tokens = JSON.parse(readFileSync(join(root, 'skin/tokens.json'), 'utf8'));
const css = readFileSync(join(root, 'skin/skin.css'), 'utf8');
const template = readFileSync(join(root, 'src/client.template.js'), 'utf8');

// Compact, single-line JSON keeps the bundle diffable and the token names are
// the only thing a reader needs to scan.
const tokensJson = JSON.stringify(tokens);
const cssLiteral = JSON.stringify(withTokenBlock(css, tokens));

if (!template.includes('__TOKENS_JSON__') || !template.includes('__SKIN_CSS__')) {
  throw new Error('client.template.js is missing a placeholder — refusing to build');
}

const out = template
  .replaceAll('__TOKENS_JSON__', () => tokensJson)
  .replaceAll('__SKIN_CSS__', () => cssLiteral);

writeFileSync(join(root, 'lib/client.js'), out, 'utf8');

// The host half is emitted too, so `lib/` is the complete runtime surface that
// package.json `files` ships — nothing under src/ is needed at install time.
const host = readFileSync(join(root, 'src/host.js'), 'utf8').replace(/\/\*\*[\s\S]*?\*\/\n/, '');
writeFileSync(join(root, 'lib/index.js'), host, 'utf8');

const tokenCount = Object.keys(tokens).length;
console.log(
  `built lib/client.js — ${tokenCount} tokens, ${css.length} bytes of css, ${out.length} bytes of bundle`
);
