// dsh-aurora-glass — browser half (client plugin bundle).
//
// Loaded by dsh-client-modules at /plugins/dsh-aurora-glass/client.js and executed
// through the vendored cordis Loader's lazy-CJS module table
// (window.__ModuleLoader__.load). The factory body is plain CJS with require()
// resolved against the shell's module table.
//
// Three layers, all owned by this module and all removable:
//   1. a registered theme (token layer, folded into the sheet by build.mjs),
//   2. one <style> element gated on a body attribute,
//   3. a "look" layer — the user's wallpaper and the window-wide opacity — which
//      is two CSS variables plus one settings section to drive them.
window.__ModuleLoader__.load({
  id: 'dsh-aurora-glass',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    /** Skin id registered into the theme runtime; also the Settings label. */
    var SKIN_ID = 'aurora-glass';
    /** Attribute the stylesheet keys off, so the material never leaks into other themes. */
    var BODY_FLAG = 'data-aurora-glass';
    /** Idempotent sheet id — a re-apply heals a head that was rebuilt. */
    var SHEET_ID = 'dsh-aurora-glass-sheet';
    /**
     * One-shot adoption flag. The built-in appearance picker only knows
     * light/dark/system, so a skin registered by a plugin stays invisible until
     * something selects it. We select it exactly once per browser profile and
     * never fight the user afterwards.
     */
    var ADOPTED_KEY = 'dsh-aurora-glass:adopted';

    var TOKENS = {"--dsw-alias-bg-base":"transparent","--dsw-alias-bg-layer-1":"rgba(9, 15, 13, calc(0.44 * var(--aurora-alpha, 1)))","--dsw-alias-bg-layer-2":"rgba(16, 24, 21, calc(0.42 * var(--aurora-alpha, 1)))","--dsw-alias-bg-layer-3":"rgba(255, 255, 255, 0.06)","--dsw-alias-bg-overlay":"rgba(9, 13, 12, 0.88)","--dsw-alias-bg-mask-drop":"rgba(4, 7, 7, 0.62)","--dsw-alias-bg-mask-1":"rgba(0, 0, 0, 0.52)","--dsw-alias-bg-mask-2":"rgba(0, 0, 0, 0.24)","--dsw-alias-bg-mask-3":"rgba(0, 0, 0, 0.55)","--dsw-alias-bg-module-platform":"rgba(9, 13, 12, 0.68)","--dsw-alias-bg-skeleton":"rgba(255, 255, 255, 0.07)","--dsw-alias-bg-multi-select":"rgba(20, 27, 24, 0.7)","--dsw-alias-border-l1":"rgba(255, 255, 255, 0.07)","--dsw-alias-border-l2":"rgba(255, 255, 255, 0.11)","--dsw-alias-border-l2-darkmode-thin":"rgba(255, 255, 255, 0.07)","--dsw-alias-border-l3":"rgba(255, 255, 255, 0.15)","--dsw-alias-border-l4":"rgba(255, 255, 255, 0.2)","--dsw-alias-border-selected":"rgba(69, 214, 160, 0.62)","--dsw-alias-border-inverted":"rgba(255, 255, 255, 0.07)","--dsw-alias-border-inverted2":"rgba(255, 255, 255, 0.09)","--dsw-alias-brand-primary":"#22c55e","--dsw-alias-brand-primary-invert":"#04170d","--dsw-alias-brand-primary-new-colorprimary-new-color":"#3ddc97","--dsw-alias-brand-text":"#6ef0b3","--dsw-alias-button-primary-fill":"#22c55e","--dsw-alias-button-primary-hover":"#34e072","--dsw-alias-button-primary-dimmed":"rgba(34, 197, 94, 0.42)","--dsw-alias-button-elevated-fill":"rgba(255, 255, 255, 0.07)","--dsw-alias-button-contrast-fill":"#eafff4","--dsw-alias-button-floating-fill":"rgba(14, 20, 18, 0.9)","--dsw-alias-button-floating-hover":"rgba(26, 34, 31, 0.92)","--dsw-alias-button-ghost-active-fill":"rgba(255, 255, 255, 0.1)","--dsw-alias-button-ghost-active-border":"rgba(255, 255, 255, 0.18)","--dsw-alias-button-ghost-active-hover":"rgba(255, 255, 255, 0.14)","--dsw-alias-button-info-fill":"#5b9cff","--dsw-alias-button-info-hover":"#7cb2ff","--dsw-alias-button-tool-bar-fill":"rgba(255, 255, 255, 0.06)","--dsw-alias-button-tool-bar-hover":"rgba(255, 255, 255, 0.11)","--dsw-alias-button-tool-bar-fill-invisible":"rgba(255, 255, 255, 0.03)","--dsw-alias-label-primary":"#f1fbf6","--dsw-alias-label-primary-dimmed":"#d9f3e6","--dsw-alias-label-primary-foreground":"#04170d","--dsw-alias-label-primary-inverted":"#0a1210","--dsw-alias-label-secondary":"rgba(241, 251, 246, 0.74)","--dsw-alias-label-tertiary":"rgba(241, 251, 246, 0.54)","--dsw-alias-label-caption":"rgba(241, 251, 246, 0.4)","--dsw-alias-label-dimmed":"rgba(241, 251, 246, 0.3)","--dsw-alias-label-on-color":"#ffffff","--dsw-alias-label-shimmer":"rgba(255, 255, 255, 0.42)","--dsw-alias-label-primary-bluish":"#e8fff4","--dsw-alias-label-deep-diving":"#8fe9ff","--dsw-alias-label-deep-diving-shimmer":"rgba(143, 233, 255, 0.35)","--dsw-alias-link":"#5ee9a8","--dsw-alias-menu-icon":"rgba(241, 251, 246, 0.7)","--dsw-alias-interactive-bg-hover":"rgba(255, 255, 255, 0.07)","--dsw-alias-interactive-bg-active":"rgba(255, 255, 255, 0.12)","--dsw-alias-interactive-bg-hover-solid":"rgba(255, 255, 255, 0.1)","--dsw-alias-interactive-bg-hover-accent":"rgba(69, 214, 160, 0.18)","--dsw-alias-interactive-bg-hover-danger":"rgba(255, 107, 107, 0.15)","--dsw-alias-card-fill":"rgba(255, 255, 255, 0.045)","--dsw-alias-card-fill-hover":"rgba(255, 255, 255, 0.075)","--dsw-alias-card-tile-fill":"rgba(255, 255, 255, 0.05)","--dsw-alias-state-success-primary":"#4ade80","--dsw-alias-state-success-secondary":"#86efac","--dsw-alias-state-success-tertiary":"rgba(34, 197, 94, 0.16)","--dsw-alias-state-warn-primary":"#ffb020","--dsw-alias-state-warn-secondary":"#ffc857","--dsw-alias-state-warn-tertiary":"rgba(255, 152, 0, 0.16)","--dsw-alias-state-warn-label":"#ffcc80","--dsw-alias-state-error-primary":"#ff6b6b","--dsw-alias-state-error-secondary":"#ff9a9a","--dsw-alias-state-idle-primary":"rgba(241, 251, 246, 0.34)","--dsw-alias-state-done-primary":"#b79bfa","--dsw-alias-state-business-primary":"#8ab4ff","--dsw-alias-state-business-tertiary":"rgba(138, 180, 255, 0.16)","--dsw-alias-scrollbar-bg-l1":"rgba(255, 255, 255, 0.12)","--dsw-alias-scrollbar-bg-l2":"rgba(255, 255, 255, 0.16)","--dsw-alias-scrollbar-hover-l1":"rgba(69, 214, 160, 0.42)","--dsw-alias-scrollbar-hover-l2":"rgba(69, 214, 160, 0.52)","--dsw-alias-markdown-code-block":"rgba(0, 0, 0, 0.36)","--dsw-alias-markdown-code-block-banner":"rgba(255, 255, 255, 0.05)","--dsw-alias-markdown-inline-code":"rgba(255, 255, 255, 0.07)","--dsw-alias-markdown-citation":"rgba(255, 255, 255, 0.06)","--dsw-alias-markdown-tag":"rgba(255, 255, 255, 0.07)","--dsw-alias-markdown-placeholder":"rgba(241, 251, 246, 0.3)","--dsw-alias-markdown-code-segment-selected":"rgba(255, 255, 255, 0.1)","--dsw-alias-markdown-code-segment-unselected":"rgba(0, 0, 0, 0.22)","--dsw-alias-turn-trigger-bg":"rgba(255, 255, 255, 0.05)","--dsw-alias-turn-trigger-bg-hover":"rgba(255, 255, 255, 0.09)","--dsw-alias-toast-bg":"rgba(14, 20, 18, 0.94)","--dsw-alias-toast-label":"#f2fff9","--dsw-alias-toast-action":"#6ef0b3","--dsw-alias-tooltip-bg":"rgba(12, 18, 16, 0.95)","--dsw-alias-tooltip-label":"#f2fff9","--dsw-alias-tooltip-key-bg":"rgba(255, 255, 255, 0.16)","--dsw-alias-hovercard-bg":"rgba(12, 18, 16, 0.95)","--dsw-alias-hovercard-label-primary":"#f2fff9","--dsw-alias-hovercard-label-secondary":"rgba(241, 251, 246, 0.72)","--dsw-alias-hovercard-label-tertiary":"rgba(241, 251, 246, 0.52)","--dsw-alias-switch-thumb":"#d9f7e6","--dsw-alias-illustration-background":"rgba(255, 255, 255, 0.05)","--dsw-alias-illustration-backing":"rgba(255, 255, 255, 0.09)","--dsw-alias-illustration-detail":"rgba(241, 251, 246, 0.35)","--dsw-alias-illustration-inset":"rgba(255, 255, 255, 0.09)","--dsw-alias-illustration-shadow":"rgba(0, 0, 0, 0.3)","--dsw-alias-illustration-surface":"rgba(255, 255, 255, 0.07)","--dsw-alias-chart-messages":"#6ea8ff","--dsw-alias-chart-system":"rgba(241, 251, 246, 0.45)","--dsw-alias-chart-tools":"#b79bfa","--dsw-alias-trajectory-accent":"#3ddc97","--dsw-alias-file-diff-added-bg":"rgba(34, 197, 94, 0.13)","--dsw-alias-file-diff-added-gutter":"rgba(34, 197, 94, 0.18)","--dsw-alias-file-diff-added-marker":"#41c977","--dsw-alias-file-diff-deleted-bg":"rgba(255, 107, 107, 0.12)","--dsw-alias-file-diff-deleted-gutter":"rgba(255, 107, 107, 0.18)","--dsw-alias-file-diff-deleted-marker":"#ff6b6b","--dsw-alias-code-diff-added":"rgba(34, 197, 94, 0.13)","--dsw-alias-code-diff-deleted":"rgba(255, 107, 107, 0.12)","--dsw-menu-surface-fill":"rgba(8, 14, 13, calc(0.68 * var(--aurora-alpha, 1)))","--dsw-alias-menu-group-header-fill":"rgba(11, 16, 15, 0.94)","--dsw-specific-menu":"rgba(11, 16, 15, 0.82)","--dsw-specific-sidebar-fill":"var(--aurora-caption, #0d1a16)","--dsw-specific-sidebar-nav-item-active":"rgba(255, 255, 255, 0.07)","--dsw-specific-sidebar-nav-item-active-accent":"rgba(69, 214, 160, 0.18)","--dsw-specific-input-major":"rgba(255, 255, 255, 0.05)","--dsw-specific-bubble":"rgba(34, 197, 94, 0.12)","--dsw-specific-bubble-highlight":"rgba(34, 197, 94, 0.19)","--dsw-specific-selector":"rgba(255, 255, 255, 0.06)","--dsw-specific-tip":"rgba(255, 255, 255, 0.06)","--dsw-specific-guide-hero":"rgba(255, 255, 255, 0.05)","--dsw-specific-login-input":"rgba(0, 0, 0, 0.32)","--dsw-specific-file-upload-track":"rgba(255, 255, 255, 0.08)","--dsw-specific-sidebar-right-flash":"#eafff4","--dsw-alias-settings-card-fill":"rgba(255, 255, 255, 0.04)","--dsw-alias-settings-card-stroke":"rgba(255, 255, 255, 0.09)","--dsw-focus-ring-color":"rgba(61, 220, 151, 0.55)","--dsh-hairline-width":"1px"};
    var CSS = "body[data-aurora-glass] {\n  --dsw-alias-bg-base: transparent;\n  --dsw-alias-bg-layer-1: rgba(9, 15, 13, calc(0.44 * var(--aurora-alpha, 1)));\n  --dsw-alias-bg-layer-2: rgba(16, 24, 21, calc(0.42 * var(--aurora-alpha, 1)));\n  --dsw-alias-bg-layer-3: rgba(255, 255, 255, 0.06);\n  --dsw-alias-bg-overlay: rgba(9, 13, 12, 0.88);\n  --dsw-alias-bg-mask-drop: rgba(4, 7, 7, 0.62);\n  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.52);\n  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.24);\n  --dsw-alias-bg-mask-3: rgba(0, 0, 0, 0.55);\n  --dsw-alias-bg-module-platform: rgba(9, 13, 12, 0.68);\n  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.07);\n  --dsw-alias-bg-multi-select: rgba(20, 27, 24, 0.7);\n  --dsw-alias-border-l1: rgba(255, 255, 255, 0.07);\n  --dsw-alias-border-l2: rgba(255, 255, 255, 0.11);\n  --dsw-alias-border-l2-darkmode-thin: rgba(255, 255, 255, 0.07);\n  --dsw-alias-border-l3: rgba(255, 255, 255, 0.15);\n  --dsw-alias-border-l4: rgba(255, 255, 255, 0.2);\n  --dsw-alias-border-selected: rgba(69, 214, 160, 0.62);\n  --dsw-alias-border-inverted: rgba(255, 255, 255, 0.07);\n  --dsw-alias-border-inverted2: rgba(255, 255, 255, 0.09);\n  --dsw-alias-brand-primary: #22c55e;\n  --dsw-alias-brand-primary-invert: #04170d;\n  --dsw-alias-brand-primary-new-colorprimary-new-color: #3ddc97;\n  --dsw-alias-brand-text: #6ef0b3;\n  --dsw-alias-button-primary-fill: #22c55e;\n  --dsw-alias-button-primary-hover: #34e072;\n  --dsw-alias-button-primary-dimmed: rgba(34, 197, 94, 0.42);\n  --dsw-alias-button-elevated-fill: rgba(255, 255, 255, 0.07);\n  --dsw-alias-button-contrast-fill: #eafff4;\n  --dsw-alias-button-floating-fill: rgba(14, 20, 18, 0.9);\n  --dsw-alias-button-floating-hover: rgba(26, 34, 31, 0.92);\n  --dsw-alias-button-ghost-active-fill: rgba(255, 255, 255, 0.1);\n  --dsw-alias-button-ghost-active-border: rgba(255, 255, 255, 0.18);\n  --dsw-alias-button-ghost-active-hover: rgba(255, 255, 255, 0.14);\n  --dsw-alias-button-info-fill: #5b9cff;\n  --dsw-alias-button-info-hover: #7cb2ff;\n  --dsw-alias-button-tool-bar-fill: rgba(255, 255, 255, 0.06);\n  --dsw-alias-button-tool-bar-hover: rgba(255, 255, 255, 0.11);\n  --dsw-alias-button-tool-bar-fill-invisible: rgba(255, 255, 255, 0.03);\n  --dsw-alias-label-primary: #f1fbf6;\n  --dsw-alias-label-primary-dimmed: #d9f3e6;\n  --dsw-alias-label-primary-foreground: #04170d;\n  --dsw-alias-label-primary-inverted: #0a1210;\n  --dsw-alias-label-secondary: rgba(241, 251, 246, 0.74);\n  --dsw-alias-label-tertiary: rgba(241, 251, 246, 0.54);\n  --dsw-alias-label-caption: rgba(241, 251, 246, 0.4);\n  --dsw-alias-label-dimmed: rgba(241, 251, 246, 0.3);\n  --dsw-alias-label-on-color: #ffffff;\n  --dsw-alias-label-shimmer: rgba(255, 255, 255, 0.42);\n  --dsw-alias-label-primary-bluish: #e8fff4;\n  --dsw-alias-label-deep-diving: #8fe9ff;\n  --dsw-alias-label-deep-diving-shimmer: rgba(143, 233, 255, 0.35);\n  --dsw-alias-link: #5ee9a8;\n  --dsw-alias-menu-icon: rgba(241, 251, 246, 0.7);\n  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.07);\n  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.12);\n  --dsw-alias-interactive-bg-hover-solid: rgba(255, 255, 255, 0.1);\n  --dsw-alias-interactive-bg-hover-accent: rgba(69, 214, 160, 0.18);\n  --dsw-alias-interactive-bg-hover-danger: rgba(255, 107, 107, 0.15);\n  --dsw-alias-card-fill: rgba(255, 255, 255, 0.045);\n  --dsw-alias-card-fill-hover: rgba(255, 255, 255, 0.075);\n  --dsw-alias-card-tile-fill: rgba(255, 255, 255, 0.05);\n  --dsw-alias-state-success-primary: #4ade80;\n  --dsw-alias-state-success-secondary: #86efac;\n  --dsw-alias-state-success-tertiary: rgba(34, 197, 94, 0.16);\n  --dsw-alias-state-warn-primary: #ffb020;\n  --dsw-alias-state-warn-secondary: #ffc857;\n  --dsw-alias-state-warn-tertiary: rgba(255, 152, 0, 0.16);\n  --dsw-alias-state-warn-label: #ffcc80;\n  --dsw-alias-state-error-primary: #ff6b6b;\n  --dsw-alias-state-error-secondary: #ff9a9a;\n  --dsw-alias-state-idle-primary: rgba(241, 251, 246, 0.34);\n  --dsw-alias-state-done-primary: #b79bfa;\n  --dsw-alias-state-business-primary: #8ab4ff;\n  --dsw-alias-state-business-tertiary: rgba(138, 180, 255, 0.16);\n  --dsw-alias-scrollbar-bg-l1: rgba(255, 255, 255, 0.12);\n  --dsw-alias-scrollbar-bg-l2: rgba(255, 255, 255, 0.16);\n  --dsw-alias-scrollbar-hover-l1: rgba(69, 214, 160, 0.42);\n  --dsw-alias-scrollbar-hover-l2: rgba(69, 214, 160, 0.52);\n  --dsw-alias-markdown-code-block: rgba(0, 0, 0, 0.36);\n  --dsw-alias-markdown-code-block-banner: rgba(255, 255, 255, 0.05);\n  --dsw-alias-markdown-inline-code: rgba(255, 255, 255, 0.07);\n  --dsw-alias-markdown-citation: rgba(255, 255, 255, 0.06);\n  --dsw-alias-markdown-tag: rgba(255, 255, 255, 0.07);\n  --dsw-alias-markdown-placeholder: rgba(241, 251, 246, 0.3);\n  --dsw-alias-markdown-code-segment-selected: rgba(255, 255, 255, 0.1);\n  --dsw-alias-markdown-code-segment-unselected: rgba(0, 0, 0, 0.22);\n  --dsw-alias-turn-trigger-bg: rgba(255, 255, 255, 0.05);\n  --dsw-alias-turn-trigger-bg-hover: rgba(255, 255, 255, 0.09);\n  --dsw-alias-toast-bg: rgba(14, 20, 18, 0.94);\n  --dsw-alias-toast-label: #f2fff9;\n  --dsw-alias-toast-action: #6ef0b3;\n  --dsw-alias-tooltip-bg: rgba(12, 18, 16, 0.95);\n  --dsw-alias-tooltip-label: #f2fff9;\n  --dsw-alias-tooltip-key-bg: rgba(255, 255, 255, 0.16);\n  --dsw-alias-hovercard-bg: rgba(12, 18, 16, 0.95);\n  --dsw-alias-hovercard-label-primary: #f2fff9;\n  --dsw-alias-hovercard-label-secondary: rgba(241, 251, 246, 0.72);\n  --dsw-alias-hovercard-label-tertiary: rgba(241, 251, 246, 0.52);\n  --dsw-alias-switch-thumb: #d9f7e6;\n  --dsw-alias-illustration-background: rgba(255, 255, 255, 0.05);\n  --dsw-alias-illustration-backing: rgba(255, 255, 255, 0.09);\n  --dsw-alias-illustration-detail: rgba(241, 251, 246, 0.35);\n  --dsw-alias-illustration-inset: rgba(255, 255, 255, 0.09);\n  --dsw-alias-illustration-shadow: rgba(0, 0, 0, 0.3);\n  --dsw-alias-illustration-surface: rgba(255, 255, 255, 0.07);\n  --dsw-alias-chart-messages: #6ea8ff;\n  --dsw-alias-chart-system: rgba(241, 251, 246, 0.45);\n  --dsw-alias-chart-tools: #b79bfa;\n  --dsw-alias-trajectory-accent: #3ddc97;\n  --dsw-alias-file-diff-added-bg: rgba(34, 197, 94, 0.13);\n  --dsw-alias-file-diff-added-gutter: rgba(34, 197, 94, 0.18);\n  --dsw-alias-file-diff-added-marker: #41c977;\n  --dsw-alias-file-diff-deleted-bg: rgba(255, 107, 107, 0.12);\n  --dsw-alias-file-diff-deleted-gutter: rgba(255, 107, 107, 0.18);\n  --dsw-alias-file-diff-deleted-marker: #ff6b6b;\n  --dsw-alias-code-diff-added: rgba(34, 197, 94, 0.13);\n  --dsw-alias-code-diff-deleted: rgba(255, 107, 107, 0.12);\n  --dsw-menu-surface-fill: rgba(8, 14, 13, calc(0.68 * var(--aurora-alpha, 1)));\n  --dsw-alias-menu-group-header-fill: rgba(11, 16, 15, 0.94);\n  --dsw-specific-menu: rgba(11, 16, 15, 0.82);\n  --dsw-specific-sidebar-fill: var(--aurora-caption, #0d1a16);\n  --dsw-specific-sidebar-nav-item-active: rgba(255, 255, 255, 0.07);\n  --dsw-specific-sidebar-nav-item-active-accent: rgba(69, 214, 160, 0.18);\n  --dsw-specific-input-major: rgba(255, 255, 255, 0.05);\n  --dsw-specific-bubble: rgba(34, 197, 94, 0.12);\n  --dsw-specific-bubble-highlight: rgba(34, 197, 94, 0.19);\n  --dsw-specific-selector: rgba(255, 255, 255, 0.06);\n  --dsw-specific-tip: rgba(255, 255, 255, 0.06);\n  --dsw-specific-guide-hero: rgba(255, 255, 255, 0.05);\n  --dsw-specific-login-input: rgba(0, 0, 0, 0.32);\n  --dsw-specific-file-upload-track: rgba(255, 255, 255, 0.08);\n  --dsw-specific-sidebar-right-flash: #eafff4;\n  --dsw-alias-settings-card-fill: rgba(255, 255, 255, 0.04);\n  --dsw-alias-settings-card-stroke: rgba(255, 255, 255, 0.09);\n  --dsw-focus-ring-color: rgba(61, 220, 151, 0.55);\n  --dsh-hairline-width: 1px;\n}\n\n/* ============================================================================\n   Aurora glass skin — material layer.\n   Palette lives in tokens.json (registered as theme tokens); this sheet only\n   adds what tokens cannot express: the wallpaper, glass blur, the mint-edged\n   active row, the gradient primary action and the popover chrome.\n   Everything is scoped to body[data-aurora-glass] so the skin leaves DSH's own\n   light/dark themes untouched when it is not active.\n   ========================================================================== */\n\n/* ---------- wallpaper ------------------------------------------------------ */\n/* A bright aurora field, not a dark tint: frosted panels only read as glass when\n   there is colour behind them to blur. NPP does the same — a luminous wallpaper\n   with dark translucent panes on top. */\nhtml:has(body[data-aurora-glass]) {\n  background-color: #071110;\n  background-image:\n    radial-gradient(130% 112% at 50% 46%, rgba(3, 8, 7, 0) 46%, rgba(3, 8, 7, 0.42) 100%),\n    radial-gradient(1150px 900px at 26% -6%, rgba(52, 235, 140, 0.34), rgba(52, 235, 140, 0) 62%),\n    radial-gradient(880px 760px at 108% 12%, rgba(80, 140, 255, 0.7), rgba(80, 140, 255, 0) 62%),\n    radial-gradient(1000px 780px at 94% 108%, rgba(74, 232, 214, 0.55), rgba(74, 232, 214, 0) 60%),\n    radial-gradient(820px 640px at 12% 106%, rgba(255, 174, 80, 0.34), rgba(255, 174, 80, 0) 66%),\n    radial-gradient(760px 620px at 26% 88%, rgba(168, 120, 255, 0.26), rgba(168, 120, 255, 0) 70%),\n    radial-gradient(640px 540px at 74% 64%, rgba(126, 128, 255, 0.16), rgba(126, 128, 255, 0) 70%),\n    radial-gradient(900px 620px at 44% 4%, rgba(214, 255, 238, 0.2), rgba(214, 255, 238, 0) 66%),\n    radial-gradient(1280px 900px at 46% 34%, rgba(48, 198, 148, 0.26), rgba(48, 198, 148, 0) 66%),\n    radial-gradient(1080px 820px at 58% 88%, rgba(58, 205, 196, 0.22), rgba(58, 205, 196, 0) 66%),\n    radial-gradient(1100px 760px at 54% 62%, rgba(96, 214, 190, 0.2), rgba(96, 214, 190, 0) 64%),\n    linear-gradient(118deg, rgba(150, 255, 214, 0.16) 0%, rgba(150, 255, 214, 0) 30%, rgba(150, 255, 214, 0) 66%, rgba(255, 196, 120, 0.1) 100%),\n    linear-gradient(162deg, #143028 0%, #0d1f1a 44%, #112a23 100%);\n  background-attachment: fixed;\n  background-repeat: no-repeat;\n  background-size: auto;\n}\n\n/* The user's own photo (Settings → 极光玻璃 → 壁纸) rides on a fixed root\n   pseudo-element *behind* the shell, so every translucent pane blurs the real\n   image instead of only the aurora gradients. With no photo the layer stays\n   invisible and the gradients above are the wallpaper. */\nhtml:has(body[data-aurora-glass])::before {\n  content: '';\n  position: fixed;\n  inset: 0;\n  z-index: -1;\n  background-image:\n    linear-gradient(168deg, rgba(8, 26, 22, 0.34) 0%, rgba(4, 10, 9, 0.52) 100%),\n    var(--aurora-photo, none);\n  background-position: center;\n  /* 1.4.0 — fit the whole picture instead of cropping it: the window keeps the\n     wallpaper's aspect ratio and the aurora behind shows in the leftover band. */\n  background-size: var(--aurora-photo-fit, contain);\n  background-repeat: no-repeat;\n  opacity: var(--aurora-photo-opacity, 0);\n  filter: blur(var(--aurora-photo-blur, 0px)) saturate(1.04) brightness(0.94);\n  transition: opacity 220ms ease;\n}\n\nbody[data-aurora-glass] {\n  background-color: transparent !important;\n  background-image: none !important;\n  /* Every frosted surface reads this one value, so the sidebar, the content\n     column and anything floating inside them are blurred by the same amount. */\n  /* 1.3.2: was 9px; 40% of the previous budget, everywhere at once. */\n  --aurora-glass-blur: 3.6px;\n  /* 1 = the shipped look; the Settings slider lowers it and every pane in the\n     window gets correspondingly more see-through (tokens + this sheet both\n     read the same variable). */\n  --aurora-alpha: 1;\n  accent-color: #22c55e;\n}\n\nbody[data-aurora-glass] ::selection {\n  background: rgba(34, 197, 94, 0.32);\n  color: #f4fff9;\n}\n\n/* ---------- one pane of glass ---------------------------------------------- */\n/* The window is a single sheet. The sidebar, the content column and the title\n   bar are three regions of that one sheet, so the veil and the blur are painted\n   here, on the frame, and nowhere else: every column stays fully transparent and\n   simply lets this layer through. Per-column backgrounds are what made the\n   earlier builds read as two materials with a brighter bar on top. */\nbody[data-aurora-glass] [class*='_frame'] {\n  background-color: rgba(4, 12, 11, calc(0.22 * var(--aurora-alpha, 1))) !important;\n  background-image: none !important;\n  backdrop-filter: blur(var(--aurora-glass-blur, 3.6px)) saturate(1.35) brightness(1.04);\n}\n\n/* `*_frame` is not unique: the app shell and the conversation pane are both named\n   `..._frame`, so the rule above painted the sheet twice over the transcript —\n   two veils and two backdrops accumulated on the content column only, which read\n   as a dark, extra-blurred box next to an untinted sidebar. Only the outermost\n   frame may carry the sheet; every nested one is cleared here. */\nbody[data-aurora-glass] [class*='_frame'] [class*='_frame'] {\n  background-color: transparent !important;\n  background-image: none !important;\n  backdrop-filter: none !important;\n  box-shadow: none !important;\n}\n\n/* ---------- desktop window chrome ----------------------------------------- */\n/* The shell rounds the content column's top-left corner. Over a wallpaper that\n   corner reads as a stray notch, so the skin squares it off. */\nhtml[data-windows-titlebar] [class*='_frame'] {\n  --dsh-windows-content-radius: 0px;\n}\n\nhtml[data-windows-titlebar] [class*='_centerCol'] {\n  border-radius: 0 !important;\n}\n\n/* The caption buttons are painted by the shell with --dsw-specific-sidebar-fill\n   (preload samples that token with a 1x1 canvas and ships it to the window\n   overlay). Painting the title-bar strip with the same token keeps the three\n   buttons and the bar in one colour.\n\n   Opaque on purpose: Windows' title-bar overlay ignores alpha, so a translucent\n   value arrives as flat black. The client therefore mixes an opaque caption\n   colour from the opacity setting and parks it in --aurora-caption. */\n/* Windows draws the three caption buttons itself, with an opaque fill it takes\n   from --dsw-specific-sidebar-fill; alpha is ignored, so that corner can never be\n   glass. Painting the whole 40px strip in the same opaque colour is the only way\n   to avoid a mismatched rectangle: whatever the wallpaper, the buttons sit in a\n   band that is exactly their own colour, and the band reads as window chrome.\n\n   Everything below the strip stays glass. If you would rather keep glass in the\n   strip, replace this with a left-to-right gradient that only becomes the colour\n   in the last ~200px - the seam just becomes a soft edge instead of a hard one. */\nhtml[data-windows-titlebar] [class*='_frame']::before {\n  /* 1.3.9 — the strip is part of the sheet again. The caption colour is fully\n     transparent now, so there is no plate to match; if the buttons come out on an\n     opaque plate, go back to 1.3.8's band: background: var(--aurora-caption). */\n  background: transparent !important;\n}\n\n/* The menu bar lives in an open shadow root; its host element is the only place\n   a page can draw on that side of it, and a flex ::before lands exactly before\n   the first menu button. */\nhtml[data-windows-titlebar] div[data-windows-menu] {\n  /* 1.3.7 — the sidebar toggle that used to sit in this strip is hidden below,\n     so the menu starts at the window edge instead of clearing a button. */\n  left: 12px;\n  /* The host is a flex row the shell styles; make sure nothing of it can read as\n     a frame around the glyph. */\n  background: transparent !important;\n  border: 0 !important;\n  box-shadow: none !important;\n  outline: none !important;\n}\n\n/* The sidebar collapse button is pinned into the caption strip on desktop\n   (`fixed`, 28x28 at the top-left). It is a page element, not a shell one, so a\n   skin rule can remove it: with the button gone the strip's left end is free and\n   「应用 / 编辑」 take that space. Cost: the sidebar can no longer be collapsed\n   from that control while this skin is on. */\nhtml[data-windows-titlebar] [class*='_logoRow'] button[class*='_toggle'] {\n  display: none !important;\n}\n\n/* The brand glyph stays off (see 1.3.5/1.3.6): nothing is drawn, so nothing can\n   turn into a box. */\nhtml[data-windows-titlebar] div[data-windows-menu]::before {\n  content: none;\n}\n\n/* Columns are windows onto the sheet, not panes of their own. */\nbody[data-aurora-glass] [class*='_centerCol'],\nbody[data-aurora-glass] [class*='_mainPanel'] {\n  background-color: transparent !important;\n  background-image: none !important;\n}\n\n/* ---------- left sidebar --------------------------------------------------- */\nbody[data-aurora-glass] [class*='_sidebarCol'],\n/* The sidebar's own root fills itself with --dsw-specific-sidebar-fill. That\n   token carries the opaque caption colour, so the pane turns pale blue while the\n   rest of the window is glass. The root paints it only while the pointer is\n   inside the sidebar (`…_quietBars` is added back on idle, which is why the fill\n   seemed to appear on hover and fade a few seconds later). Target the slot\n   wrapper instead of a state class: `data-slot=\"sidebar\"` is part of the slot\n   contract and does not change with hover. */\nbody[data-aurora-glass] [data-slot='sidebar'] > *,\nbody[data-aurora-glass] [class*='_quietBars'] {\n  background-color: transparent !important;\n  background-image: none !important;\n  border-right: 0 !important;\n  box-shadow: none !important;\n}\n\n\nbody[data-aurora-glass] [class*='_sidebarCol'] [class*='_newSession'] {\n  background-image: linear-gradient(135deg, #2ee06f 0%, #17a34a 100%) !important;\n  background-color: #22c55e !important;\n  color: #04160c !important;\n  border: 1px solid rgba(255, 255, 255, 0.22) !important;\n  border-radius: 12px !important;\n  font-weight: 600 !important;\n  box-shadow:\n    0 10px 24px rgba(16, 128, 62, 0.32),\n    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;\n  transition: filter 160ms ease, box-shadow 160ms ease, transform 160ms ease;\n}\n\nbody[data-aurora-glass] [class*='_sidebarCol'] [class*='_newSession']:hover {\n  filter: brightness(1.08) saturate(1.05);\n  box-shadow:\n    0 12px 30px rgba(16, 128, 62, 0.42),\n    inset 0 1px 0 rgba(255, 255, 255, 0.45) !important;\n}\n\nbody[data-aurora-glass] [class*='_sidebarCol'] [class*='_newSession'] * {\n  color: #04160c !important;\n  fill: currentColor;\n}\n\n/* No fade layer in the sidebar: rows end where the list ends. The product's\n   fade used --dsw-specific-sidebar-fill (the opaque caption colour), which put a\n   blue band under the list; a fade to the veil still tinted that band. */\nbody[data-aurora-glass] [class*='_scrollFade'] {\n  display: none !important;\n}\n\n/* group captions (\"工作区\") get NPP's mint bullet */\nbody[data-aurora-glass] [class*='_sectionLabel'] {\n  color: rgba(241, 251, 246, 0.42) !important;\n  font-weight: 600 !important;\n  letter-spacing: 0.08em;\n}\n\nbody[data-aurora-glass] [class*='_sectionLabel']::before {\n  content: '';\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  margin-right: 7px;\n  border-radius: 50%;\n  vertical-align: middle;\n  background: #3ddc97;\n  box-shadow: 0 0 9px rgba(61, 220, 151, 0.9);\n}\n\n/* rows: the feature list (插件 / 插件市场 / 自动化任务 / 更多), the workspace\n   list and the project rows are ONE list style — same height, radius, rhythm,\n   typography, hover wash and selected capsule. The product already aligns their\n   leading 16px glyph column (nav) with the 16px status slot (sessions), so only\n   the surfaces and the type scale had to be brought together. */\nbody[data-aurora-glass] [class*='_panelRow'],\nbody[data-aurora-glass] [class*='_sessionRow'],\nbody[data-aurora-glass] [class*='_projectRow'] {\n  min-height: 32px !important;\n  border-radius: 12px !important;\n  padding-left: 9px !important;\n  gap: 6px !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  color: rgba(241, 251, 246, 0.74) !important;\n  transition: background-color 150ms ease, box-shadow 150ms ease, color 150ms ease;\n}\n\nbody[data-aurora-glass] [class*='_panelRow'] [class*='_panelGlyph'],\nbody[data-aurora-glass] [class*='_panelRow'] svg,\nbody[data-aurora-glass] [class*='_sessionRow'] [class*='_slot'] {\n  width: 16px !important;\n  min-width: 16px !important;\n  opacity: 0.82;\n}\n\n/* the selected session gets the same mint bullet the group captions wear */\nbody[data-aurora-glass] [class*='_sessionRow'] [class*='_slot']::before {\n  content: '';\n  display: block;\n  width: 5px;\n  height: 5px;\n  margin: 0 auto;\n  border-radius: 50%;\n  background: rgba(241, 251, 246, 0.18);\n  box-shadow: 0 0 0 rgba(61, 220, 151, 0);\n  transition: background 160ms ease, box-shadow 160ms ease;\n}\n\nbody[data-aurora-glass] [class*='_sessionRow'][aria-selected='true'] [class*='_slot']::before,\nbody[data-aurora-glass] [class*='_sessionRow'][class*='_selected'] [class*='_slot']::before {\n  background: #3ddc97;\n  box-shadow: 0 0 9px rgba(61, 220, 151, 0.9);\n}\n\nbody[data-aurora-glass] [class*='_panelRow']:hover,\nbody[data-aurora-glass] [class*='_sessionRow']:hover,\nbody[data-aurora-glass] [class*='_projectRow']:hover,\nbody[data-aurora-glass] [class*='_triggerRow']:hover {\n  background-color: rgba(255, 255, 255, 0.06) !important;\n  color: rgba(241, 251, 246, 0.94) !important;\n}\n\nbody[data-aurora-glass] [class*='_triggerRow'] {\n  border-radius: 12px !important;\n  transition: background-color 150ms ease, color 150ms ease;\n}\n\n/* selected session / project / active nav: NPP's active-row gradient with a\n   mint hairline. One recipe for every list in the sidebar. */\nbody[data-aurora-glass] [class*='_selected'],\nbody[data-aurora-glass] [aria-current='page'],\nbody[data-aurora-glass] [aria-selected='true'] {\n  background-color: transparent !important;\n  background-image: linear-gradient(\n    100deg,\n    rgba(255, 255, 255, 0.105) 0%,\n    rgba(255, 255, 255, 0.055) 58%,\n    rgba(255, 255, 255, 0.028) 100%\n  ) !important;\n  color: #f4fff9 !important;\n  box-shadow:\n    inset 0 0 0 1px rgba(69, 214, 160, 0.3),\n    inset 0 1px 0 rgba(255, 255, 255, 0.08),\n    0 4px 16px rgba(0, 0, 0, 0.3);\n}\n\nbody[data-aurora-glass] [class*='_selected'] [class*='_title'],\nbody[data-aurora-glass] [class*='_selected'] [class*='_label'],\nbody[data-aurora-glass] [aria-current='page'] [class*='_title'],\nbody[data-aurora-glass] [aria-current='page'] [class*='_label'] {\n  color: #f4fff9 !important;\n}\n\n/* the \"展开其余 N 个会话\" row indents to the same text column as the rows above */\nbody[data-aurora-glass] [class*='_sessionOverflowButton'] {\n  padding-left: 31px !important;\n  border-radius: 10px !important;\n  color: rgba(241, 251, 246, 0.54) !important;\n}\n\nbody[data-aurora-glass] [class*='_sessionOverflowButton']:hover {\n  background-color: rgba(255, 255, 255, 0.055) !important;\n  color: rgba(241, 251, 246, 0.86) !important;\n}\n\n/* ---------- view tabs (对话 / 轨迹 …) -------------------------------------- */\nbody[data-aurora-glass] [role='tab'] {\n  border-radius: 999px;\n  padding: 2px 10px;\n  color: rgba(241, 251, 246, 0.6);\n  transition: background-color 150ms ease, color 150ms ease;\n}\n\nbody[data-aurora-glass] [role='tab']:hover {\n  background-color: rgba(255, 255, 255, 0.06);\n  color: rgba(241, 251, 246, 0.86);\n}\n\nbody[data-aurora-glass] [role='tab'][aria-selected='true'],\nbody[data-aurora-glass] [role='tab'][data-state='active'] {\n  background-color: rgba(69, 214, 160, 0.14);\n  color: #eafff4;\n  box-shadow: inset 0 0 0 1px rgba(69, 214, 160, 0.26);\n}\n\n/* ---------- composer ------------------------------------------------------- */\nbody[data-aurora-glass] [class*='_composerStack'] [class*='_card'] {\n  /* Deliberately deep and *not* scaled by --aurora-alpha: this is where text is\n     typed, so whatever is behind it has to disappear. */\n  background-color: rgba(7, 12, 11, 0.94) !important;\n  border-radius: 22px !important;\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.1),\n    0 20px 52px rgba(0, 0, 0, 0.44),\n    inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;\n  backdrop-filter: blur(var(--aurora-glass-blur, 3.6px));\n  -webkit-backdrop-filter: blur(var(--aurora-glass-blur, 3.6px));\n  transition: box-shadow 180ms ease, background-color 180ms ease;\n}\n\nbody[data-aurora-glass] [class*='_composerStack'] [class*='_card']:focus-within {\n  background-color: rgba(8, 14, 13, 0.96) !important;\n  box-shadow:\n    0 0 0 1px rgba(69, 214, 160, 0.42),\n    0 0 0 5px rgba(34, 197, 94, 0.1),\n    0 22px 56px rgba(0, 0, 0, 0.46),\n    inset 0 1px 0 rgba(255, 255, 255, 0.09) !important;\n}\n\n/* send button: mint gradient capsule */\nbody[data-aurora-glass] [class*='_composerStack'] [class*='_primary'] {\n  background-image: linear-gradient(135deg, #2ee06f 0%, #16a34a 100%) !important;\n  background-color: #22c55e !important;\n  color: #04160c !important;\n  box-shadow:\n    0 6px 18px rgba(16, 128, 62, 0.4),\n    inset 0 1px 0 rgba(255, 255, 255, 0.32) !important;\n}\n\nbody[data-aurora-glass] [class*='_composerStack'] [class*='_primary']:hover {\n  filter: brightness(1.09);\n}\n\nbody[data-aurora-glass] [class*='_composerStack'] [class*='_add'] {\n  background-color: rgba(255, 255, 255, 0.08) !important;\n  color: rgba(241, 251, 246, 0.82) !important;\n}\n\nbody[data-aurora-glass] [class*='_composerStack'] [class*='_add']:hover {\n  background-color: rgba(255, 255, 255, 0.13) !important;\n}\n\n/* ---------- popovers, menus, dialogs -------------------------------------- */\n/* Floating layers do not sit in a column: they float *over* the transcript, so\n   anything translucent here lets the text underneath read as part of the\n   popover. This is the one place that must be close to opaque — same family as\n   the composer, one step further. */\nbody[data-aurora-glass] [role='menu'],\nbody[data-aurora-glass] [role='listbox'],\nbody[data-aurora-glass] [role='dialog'],\nbody[data-aurora-glass] [role='tooltip'],\nbody[data-aurora-glass] [class*='_menuSurface'],\nbody[data-aurora-glass] [class*='_popover'],\nbody[data-aurora-glass] [class*='_tooltip'],\nbody[data-aurora-glass] [class*='_cardPreview'],\nbody[data-aurora-glass] [class*='_previewCard'] {\n  background-color: rgba(7, 12, 11, 0.96) !important;\n  border: 1px solid rgba(255, 255, 255, 0.09) !important;\n  border-radius: 14px !important;\n  backdrop-filter: blur(var(--aurora-glass-blur, 3.6px));\n  -webkit-backdrop-filter: blur(var(--aurora-glass-blur, 3.6px));\n  box-shadow:\n    0 26px 64px rgba(0, 0, 0, 0.55),\n    inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;\n}\n\n/* menu rows take the NPP hover wash: mint tint on a transparent row */\nbody[data-aurora-glass] [role='menuitem']:hover,\nbody[data-aurora-glass] [role='menuitem'][data-highlighted],\nbody[data-aurora-glass] [role='option']:hover,\nbody[data-aurora-glass] [role='option'][aria-selected='true'] {\n  background-color: rgba(69, 214, 160, 0.12) !important;\n  background-image: none !important;\n  color: #eafff4 !important;\n  box-shadow: inset 0 0 0 1px rgba(69, 214, 160, 0.2);\n}\n\n/* ---------- scrollbars ----------------------------------------------------- */\nbody[data-aurora-glass] ::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n}\n\nbody[data-aurora-glass] ::-webkit-scrollbar-track {\n  background: transparent;\n}\n\nbody[data-aurora-glass] ::-webkit-scrollbar-thumb {\n  background-color: rgba(255, 255, 255, 0.14);\n  background-clip: content-box;\n  border: 3px solid transparent;\n  border-radius: 999px;\n}\n\nbody[data-aurora-glass] ::-webkit-scrollbar-thumb:hover {\n  background-color: rgba(69, 214, 160, 0.45);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-aurora-glass] * {\n    transition-duration: 1ms !important;\n  }\n}\n";

    /** Settings section + row locale namespace. */
    var NS = 'settings.auroraSkin';
    /** localStorage keys for the look layer. */
    var LOOK_KEY = {
      photo: 'dsh-aurora-glass:photo',
      alpha: 'dsh-aurora-glass:alpha',
      blur: 'dsh-aurora-glass:blur',
    };
    /** Opacity is a percentage of the shipped look; keep a floor so the shell never goes fully invisible. */
    var ALPHA_MIN = 20;
    var ALPHA_MAX = 100;
    var BLUR_MAX = 40;

    /**
     * Read-only diagnostics on `window`, for support and for the smoke test:
     * which generation of the bundle is live, whether the theme registration
     * succeeded, what the runtime thinks the preference is, and why the last
     * adoption attempt failed. Nothing here affects rendering.
     */
    var STATUS_KEY = '__DSH_AURORA_GLASS__';
    var BUILD = '1.5.0';
    var status = { skinId: SKIN_ID, build: BUILD, registered: false, registerError: null, adoptError: null };

    function publish(extra) {
      try {
        var next = { skinId: SKIN_ID, build: BUILD, registered: status.registered, registerError: status.registerError, adoptError: status.adoptError };
        if (extra) for (var key in extra) next[key] = extra[key];
        window[STATUS_KEY] = next;
      } catch {}
    }

    /** The theme runtime owns the token layer; slots/locale own the settings UI. */
    var inject = ['theme', 'slots', 'locale'];

    function ensureSheet() {
      var existing = document.getElementById(SHEET_ID);
      if (existing) {
        if (existing.textContent !== CSS) existing.textContent = CSS;
        return existing;
      }
      var el = document.createElement('style');
      el.id = SHEET_ID;
      el.textContent = CSS;
      document.head.appendChild(el);
      return el;
    }

    function removeSheet() {
      var el = document.getElementById(SHEET_ID);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function activeId(ctx) {
      try {
        var snapshot = ctx.theme.getTheme();
        var active = snapshot && snapshot.active;
        return active && typeof active.id === 'string' ? active.id : null;
      } catch {
        return null;
      }
    }

    function preferenceOf(ctx) {
      try {
        var snapshot = ctx.theme.getTheme();
        return snapshot ? snapshot.preference : null;
      } catch {
        return null;
      }
    }

    /* ------------------------------------------------------------------ look */

    function readStored(key, fallback) {
      try {
        var value = window.localStorage.getItem(key);
        return value === null || value === '' ? fallback : value;
      } catch {
        return fallback;
      }
    }

    function writeStored(key, value) {
      try {
        if (value === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, value);
        return true;
      } catch (err) {
        status.storageError = (err && err.name) || String(err);
        return false;
      }
    }

    function readAlpha() {
      var raw = parseInt(readStored(LOOK_KEY.alpha, String(ALPHA_MAX)), 10);
      if (!isFinite(raw)) raw = ALPHA_MAX;
      return Math.min(ALPHA_MAX, Math.max(ALPHA_MIN, raw));
    }

    function readBlur() {
      var raw = parseInt(readStored(LOOK_KEY.blur, '0'), 10);
      if (!isFinite(raw)) raw = 0;
      return Math.min(BLUR_MAX, Math.max(0, raw));
    }

    function readPhoto() {
      var raw = readStored(LOOK_KEY.photo, '');
      return typeof raw === 'string' && raw.length > 32 ? raw : null;
    }

    /**
     * Push the look onto the document. `--aurora-alpha` is written on <body>
     * inline on purpose: the desktop shell samples the caption-button colour with
     * a 1x1 canvas driven by a MutationObserver on `body[style]`, so this one
     * write is what makes the window buttons follow the slider too.
     */
    /**
     * Windows paints the caption buttons with a flat colour: the shell samples
     * `--dsw-specific-sidebar-fill` through a 1x1 canvas and hands the rgba to
     * `setTitleBarOverlay`, which ignores alpha and renders as near-black. The
     * token therefore points at `--aurora-caption`, and this mixes an *opaque*
     * colour.
     *
     * It mirrors the sheet itself, not the sidebar: the two ends are the measured
     * composite at the top-right corner — the aurora's blue behind the default
     * 0.36 veil — and the same corner with the thinnest veil the slider allows.
     * Thinner veil, more wallpaper, so the low end is *brighter* than the full
     * end; that is the opposite direction from the old per-pane design.
     */
    /**
     * 1.3.9 — the caption is *transparent*, and the native buttons float on the
     * sheet with no plate of their own.
     *
     * The shell samples `--dsw-specific-sidebar-fill` through a 1x1 canvas and
     * hands the resulting `rgba(...)` to `setTitleBarOverlay`. A flat colour there
     * can only ever be a mismatched plate over a wallpaper, so the value is now
     * fully transparent: Windows still draws the three native buttons (so Snap
     * Layouts keep working) but paints no fill behind them.
     *
     * If a build turns that into an opaque black plate, alpha is being dropped on
     * the way in: set `CAPTION` to an opaque colour again and paint the 40px strip
     * with it, which is exactly what 1.3.8 did.
     */
    var CAPTION = 'rgba(0, 0, 0, 0)';

    function captionColor() {
      return CAPTION;
    }

    /**
     * The shell only re-samples the caption colour when `body[style]` changes, so
     * every path that flips the skin on/off or moves a slider ends with a write
     * here. The `--aurora-caption-seq` bump is the trigger: it carries no styling,
     * it exists so a repeated identical colour still produces a mutation record.
     */
    function syncCaption() {
      var body = document.body;
      if (!body) return;
      if (body.hasAttribute(BODY_FLAG)) {
        var colour = captionColor();
        body.style.setProperty('--aurora-caption', colour);
        // The shell does not read --aurora-caption; its probe reads this token.
        // Writing it inline (it normally comes from the stylesheet) means the
        // sample cannot depend on when our sheet landed, and it is the same
        // mutation the probe's observer is waiting for.
        body.style.setProperty('--dsw-specific-sidebar-fill', colour);
      } else {
        body.style.removeProperty('--aurora-caption');
        body.style.removeProperty('--dsw-specific-sidebar-fill');
      }
      body.style.setProperty('--aurora-caption-seq', String(Date.now()));
    }

    function applyLook() {
      var root = document.documentElement;
      var body = document.body;
      if (!root) return;
      var photo = readPhoto();
      var alpha = readAlpha();
      var blur = readBlur();
      root.style.setProperty('--aurora-photo', photo ? 'url("' + photo + '")' : 'none');
      root.style.setProperty('--aurora-photo-opacity', photo ? '1' : '0');
      root.style.setProperty('--aurora-photo-blur', blur + 'px');
      if (body) body.style.setProperty('--aurora-alpha', String(alpha / 100));
      syncCaption();
      publish({ alpha: alpha, blur: blur, hasPhoto: !!photo, storageError: status.storageError || null, lookAt: Date.now() });
    }

    /** Downscale to a 1920px长边 JPEG so a photo survives the localStorage budget. */
    function downscale(file) {
      return new Promise(function (resolve, reject) {
        if (!file || !/^image\//.test(file.type || '')) {
          reject(new Error('not an image'));
          return;
        }
        var url = URL.createObjectURL(file);
        var img = new Image();
        img.onload = function () {
          URL.revokeObjectURL(url);
          try {
            var max = 1920;
            var scale = Math.min(1, max / Math.max(img.width, img.height));
            var width = Math.max(1, Math.round(img.width * scale));
            var height = Math.max(1, Math.round(img.height * scale));
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx2d = canvas.getContext('2d');
            if (!ctx2d) throw new Error('no 2d context');
            ctx2d.drawImage(img, 0, 0, width, height);
            var quality = 0.82;
            var dataUrl = canvas.toDataURL('image/jpeg', quality);
            while (dataUrl.length > 2600000 && quality > 0.46) {
              quality -= 0.08;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = function () {
          URL.revokeObjectURL(url);
          reject(new Error('decode failed'));
        };
        img.src = url;
      });
    }

    /* -------------------------------------------------------------- settings */

    var S = {
      block: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'var(--dsw-alias-bg-layer-2)',
      },
      head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' },
      title: { fontSize: '13px', fontWeight: 600, color: 'var(--dsw-alias-label-primary)' },
      hint: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' },
      controls: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
      button: {
        height: '28px',
        padding: '0 12px',
        borderRadius: '8px',
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
      },
      buttonPrimary: {
        height: '28px',
        padding: '0 12px',
        borderRadius: '8px',
        border: '1px solid rgba(34, 197, 94, 0.45)',
        background: 'rgba(34, 197, 94, 0.16)',
        color: 'var(--dsw-alias-label-primary)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
      },
      value: {
        minWidth: '44px',
        fontSize: '12px',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--dsw-alias-label-secondary)',
      },
      range: { width: '180px', accentColor: '#22c55e' },
      thumb: {
        width: '100%',
        height: '56px',
        borderRadius: '8px',
        border: '1px solid var(--dsw-alias-border-l2)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      },
    };

    function buildRows(React) {
      var h = React.createElement;

      var onPickFile = function (setter) {
        return function (event) {
          var input = event.currentTarget;
          var file = input.files && input.files[0];
          input.value = '';
          if (!file) return;
          downscale(file)
            .then(function (dataUrl) {
              if (writeStored(LOOK_KEY.photo, dataUrl)) {
                setter(dataUrl);
                applyLook();
              } else {
                console.warn('[dsh-aurora-glass] wallpaper could not be stored (quota):', status.storageError);
              }
            })
            .catch(function (err) {
              console.warn('[dsh-aurora-glass] wallpaper rejected:', err && err.message);
            });
        };
      };

      function WallpaperRow(props) {
        var t = props.t;
        var photoState = React.useState(readPhoto());
        var photo = photoState[0];
        var setPhoto = photoState[1];
        var blurState = React.useState(readBlur());
        var blur = blurState[0];
        var setBlur = blurState[1];
        var fileRef = React.useRef(null);
        var pick = function () {
          if (fileRef.current) fileRef.current.click();
        };
        // A native listener as well as the React prop: file inputs are the one
        // control whose `change` some harnesses (and a few IME/browser combos)
        // deliver without going through React's synthetic system.
        React.useEffect(function () {
          var input = fileRef.current;
          if (!input) return undefined;
          var handler = onPickFile(setPhoto);
          input.addEventListener('change', handler);
          return function () {
            input.removeEventListener('change', handler);
          };
        }, []);
        var clear = function () {
          writeStored(LOOK_KEY.photo, null);
          setPhoto(null);
          applyLook();
        };
        var changeBlur = function (event) {
          var next = parseInt(event.target.value, 10) || 0;
          writeStored(LOOK_KEY.blur, String(next));
          setBlur(next);
          applyLook();
        };
        return h(
          'div',
          { style: S.block },
          h('div', { style: S.head }, h('span', { style: S.title }, t('wallpaper.title'))),
          h('span', { style: S.hint }, t('wallpaper.hint')),
          h(
            'div',
            { style: S.controls },
            h('span', {
              style: Object.assign({}, S.thumb, {
                background: photo
                  ? 'url("' + photo + '") center / cover no-repeat'
                  : 'linear-gradient(140deg, #0f2a23, #07110f 60%, #12233a)',
              }),
            }),
            h('button', { type: 'button', style: S.buttonPrimary, onClick: pick }, t('wallpaper.pick')),
            h('button', { type: 'button', style: S.button, onClick: clear, disabled: !photo }, t('wallpaper.clear')),
            h('input', {
              ref: fileRef,
              type: 'file',
              accept: 'image/*',
              style: { display: 'none' },
              onChange: onPickFile(setPhoto),
            })
          ),
          h(
            'div',
            { style: S.controls },
            h('span', { style: S.hint }, t('wallpaper.blur')),
            h('input', {
              type: 'range',
              min: 0,
              max: BLUR_MAX,
              step: 1,
              value: blur,
              style: S.range,
              onChange: changeBlur,
            }),
            h('span', { style: S.value }, blur + ' px')
          )
        );
      }

      function OpacityRow(props) {
        var t = props.t;
        var alphaState = React.useState(readAlpha());
        var alpha = alphaState[0];
        var setAlpha = alphaState[1];
        var change = function (event) {
          var next = parseInt(event.target.value, 10) || ALPHA_MAX;
          writeStored(LOOK_KEY.alpha, String(next));
          setAlpha(next);
          applyLook();
        };
        var reset = function () {
          writeStored(LOOK_KEY.alpha, null);
          setAlpha(ALPHA_MAX);
          applyLook();
        };
        return h(
          'div',
          { style: S.block },
          h('div', { style: S.head }, h('span', { style: S.title }, t('opacity.title'))),
          h('span', { style: S.hint }, t('opacity.hint')),
          h(
            'div',
            { style: S.controls },
            h('input', {
              type: 'range',
              min: ALPHA_MIN,
              max: ALPHA_MAX,
              step: 5,
              value: alpha,
              style: S.range,
              onChange: change,
            }),
            h('span', { style: S.value }, alpha + ' %'),
            h('button', { type: 'button', style: S.button, onClick: reset }, t('opacity.reset'))
          )
        );
      }

      function Section(props) {
        return h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px 0 8px' },
          children: props.renderSlot('settings.auroraSkin.item', {}),
        });
      }

      function NavIcon(props) {
        var size = (props && props.size) || 16;
        return h(
          'svg',
          {
            width: size,
            height: size,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            'aria-hidden': true,
            focusable: false,
          },
          h('circle', { cx: 12, cy: 12, r: 8.5 }),
          h('path', { d: 'M12 3.5v17M3.5 12h17' }),
          h('circle', { cx: 12, cy: 12, r: 2.4, fill: 'currentColor', stroke: 'none' })
        );
      }

      return { WallpaperRow: WallpaperRow, OpacityRow: OpacityRow, Section: Section, NavIcon: NavIcon };
    }

    /* ---------------------------------------------------------------- plugin */

    /**
     * Token layer is material, not runtime: build.mjs folds skin/tokens.json into
     * the sheet as a `body[data-aurora-glass] { … }` rule. The registration below
     * still publishes the same tokens to the theme runtime so the definition is
     * self-describing, but the document gets them from the sheet — inline
     * variables here would race the shell's theme presenter, which rewrites the
     * names it owns on every theme/change.
     */
    function applyFlag(ctx) {
      if (!document.body) return;
      var on = activeId(ctx) === SKIN_ID;
      if (on) document.body.setAttribute(BODY_FLAG, '');
      else document.body.removeAttribute(BODY_FLAG);
      // The flag only changes a data attribute, which the shell's caption
      // observer does not watch — re-sync so the window buttons repaint with (or
      // without) the skin instead of keeping the previous colour until the next
      // slider move.
      syncCaption();
      var snapshotTokens = 0;
      try {
        var snap = ctx.theme.getTheme();
        snapshotTokens = Object.keys((snap && snap.active && snap.active.tokens) || {}).length;
      } catch {}
      publish({
        activeId: activeId(ctx),
        preference: preferenceOf(ctx),
        flagged: on,
        tokensInSnapshot: snapshotTokens,
        tokenRule: on ? Object.keys(TOKENS).length : 0,
        appliedAt: Date.now(),
      });
    }

    function apply(ctx) {
      publish({ applying: true, hasThemeService: !!ctx.theme });
      // The token layer: register() throws on a duplicate id, so a second copy
      // of this plugin (or a future rename collision) must degrade to "no skin
      // of mine" instead of taking the shell down.
      ctx.effect(function () {
        try {
          var disposer = ctx.theme.register({ id: SKIN_ID, colorScheme: 'dark', tokens: TOKENS });
          status.registered = true;
          publish({ registeredAt: Date.now() });
          return disposer;
        } catch (err) {
          status.registerError = (err && err.message) || String(err);
          console.warn('[dsh-aurora-glass] cannot register skin "' + SKIN_ID + '":', err && err.message);
          publish();
          return function () {};
        }
      }, 'dsh-aurora-glass: theme registration');

      // The material layer. Registered inside apply (never at factory scope) so
      // disabling the plugin removes the stylesheet again.
      ctx.effect(function () {
        ensureSheet();
        return removeSheet;
      }, 'dsh-aurora-glass: stylesheet');

      // The look layer: the user's wallpaper and the window opacity, restored
      // from localStorage before the first paint that can use them.
      ctx.effect(function () {
        applyLook();
        var onReady = null;
        if (!document.body) {
          onReady = function () {
            applyLook();
          };
          document.addEventListener('DOMContentLoaded', onReady, { once: true });
        }
        return function () {
          if (onReady) document.removeEventListener('DOMContentLoaded', onReady);
          try {
            document.documentElement.style.removeProperty('--aurora-photo');
            document.documentElement.style.removeProperty('--aurora-photo-opacity');
            document.documentElement.style.removeProperty('--aurora-photo-blur');
            if (document.body) {
              document.body.style.removeProperty('--aurora-alpha');
              document.body.style.removeProperty('--aurora-caption');
              document.body.style.removeProperty('--aurora-caption-seq');
            }
          } catch {}
        };
      }, 'dsh-aurora-glass: wallpaper and opacity');

      // Smoke: 壁纸 + 背景透明度 live in their own Settings section.
      ctx.effect(function () {
        var disposers = [];
        try {
          disposers.push(
            ctx.locale.register(NS, {
              zh: {
                'section.title': '极光玻璃',
                'settings.nav': '极光玻璃',
                'wallpaper.title': '壁纸',
                'wallpaper.hint': '选一张图片作为整个窗口的背景；面板会把它磨砂透出来。图片会压缩到 1920px 以内并保存在本机。',
                'wallpaper.pick': '选择图片…',
                'wallpaper.clear': '恢复极光',
                'wallpaper.blur': '背景模糊',
                'opacity.title': '背景透明度',
                'opacity.hint': '整个窗口一起调整：数值越低，面板越透，壁纸越明显（最低 20%）。',
                'opacity.reset': '恢复默认',
              },
              en: {
                'section.title': 'Aurora Glass',
                'settings.nav': 'Aurora Glass',
                'wallpaper.title': 'Wallpaper',
                'wallpaper.hint': 'Pick an image for the whole window; the frosted panes blur it through. Images are downscaled to 1920px and kept on this machine.',
                'wallpaper.pick': 'Choose image…',
                'wallpaper.clear': 'Back to aurora',
                'wallpaper.blur': 'Background blur',
                'opacity.title': 'Background opacity',
                'opacity.hint': 'Applies to the whole window: lower means more see-through panes and a stronger wallpaper (20% floor).',
                'opacity.reset': 'Reset',
              },
            })
          );
        } catch (err) {
          console.warn('[dsh-aurora-glass] could not register dictionaries:', err && err.message);
        }

        try {
          var React = require('react');
          var rows = buildRows(React);
          // One bound translator for the section label; an unavailable locale
          // service or a dictionary that has not landed must still render a row
          // instead of an empty nav item.
          var translate = typeof ctx.locale.bind === 'function' ? ctx.locale.bind(NS) : function (key) { return key; };
          var t = function (key) {
            try {
              var text = translate(key);
              return typeof text === 'string' && text !== '' && text !== key ? text : key;
            } catch {
              return key;
            }
          };
          disposers.push(
            ctx.slots.inject('settings.section', function () {
              return ctx.slots.register(
                {
                  name: 'settings.section',
                  id: 'aurora-glass',
                  order: 60,
                  label: function () {
                    return t('settings.nav');
                  },
                  locale: NS,
                  children: { 'settings.auroraSkin.item': { kind: 'list', scope: 'root' } },
                },
                rows.Section
              );
            })
          );
          disposers.push(
            ctx.slots.inject('settings.auroraSkin.item', function () {
              return ctx.slots.register(
                { name: 'settings.auroraSkin.item', id: 'aurora-glass-wallpaper', order: 10, locale: NS, inject: function () { return {}; } },
                rows.WallpaperRow
              );
            })
          );
          disposers.push(
            ctx.slots.inject('settings.auroraSkin.item', function () {
              return ctx.slots.register(
                { name: 'settings.auroraSkin.item', id: 'aurora-glass-opacity', order: 20, locale: NS, inject: function () { return {}; } },
                rows.OpacityRow
              );
            })
          );
          try {
            disposers.push(
              ctx.slots.inject('settings.section.icon', function () {
                return ctx.slots.register({ name: 'settings.section.icon', id: 'aurora-glass' }, rows.NavIcon);
              })
            );
          } catch {}
        } catch (err) {
          console.warn('[dsh-aurora-glass] settings section unavailable:', err && err.message);
        }

        return function () {
          for (var i = 0; i < disposers.length; i += 1) {
            var dispose = disposers[i];
            try {
              if (typeof dispose === 'function') dispose();
              else if (dispose && typeof dispose.dispose === 'function') dispose.dispose();
            } catch {}
          }
        };
      }, 'dsh-aurora-glass: settings section');

      // Wire the skin on. The theme preference a plugin registers cannot be
      // persisted: the appearance picker only persists its own ids
      // (light/dark/system), so the host re-sends the product's preference a
      // few hundred ms after boot and would strand a plugin theme on every
      // start. The skin therefore claims the preference once per page load:
      // the first theme/change that disagrees with us (the host hydration) is
      // answered with setTheme(), and after that the appearance preference is
      // the user's — switching to 深色/浅色 in Settings simply turns the
      // material off for the rest of the session, and the plugin itself stays
      // the on/off switch across restarts.
      ctx.effect(function () {
        var armedUntil = performance.now() + 6000;
        var attempts = 0;
        var report = function (reason) {
          try {
            window.__DSH_AURORA_GLASS_ADOPT__ = {
              reason: reason,
              attempts: attempts,
              after: preferenceOf(ctx),
              at: Math.round(performance.now()),
            };
          } catch {}
        };
        var claim = function (reason) {
          attempts += 1;
          try {
            if (preferenceOf(ctx) !== SKIN_ID) ctx.theme.setTheme(SKIN_ID);
            status.adoptError = null;
            report(reason);
            publish();
          } catch (err) {
            status.adoptError = (err && err.message) || String(err);
            console.warn('[dsh-aurora-glass] could not claim the appearance preference:', err && err.message);
            publish();
          }
        };
        // Claim synchronously first (covers the case where the host already
        // delivered its preference before this plugin applied) …
        claim('apply');
        // … then answer the host hydration that follows within a short window.
        // Beyond that window the appearance preference is the user's, so
        // switching to 深色/浅色 in Settings simply turns the material off for
        // the rest of the session; the plugin itself stays the on/off switch.
        var disposeClaim = ctx.on('theme/change', function (snapshot) {
          var id = (snapshot && snapshot.preference) || '';
          if (id === SKIN_ID) {
            status.adoptError = null;
            return;
          }
          if (attempts >= 4 || performance.now() > armedUntil) return;
          claim('hydration');
        });
        return function () {
          if (typeof disposeClaim === 'function') disposeClaim();
          else if (disposeClaim && typeof disposeClaim.dispose === 'function') disposeClaim.dispose();
        };
      }, 'dsh-aurora-glass: claim appearance preference');

      // Gate the material on the active theme, and keep it in sync when the
      // user switches skins in Settings.
      ctx.effect(function () {
        applyFlag(ctx);
        /* A copy that runs before <body> parsed has to arm the flag later. */
        var onReady = null;
        if (!document.body) {
          onReady = function () { applyFlag(ctx); };
          document.addEventListener('DOMContentLoaded', onReady, { once: true });
        }
        // The shell samples the caption colour at times we cannot see (window
        // creation, focus, theme events, its own debounce). A handful of late
        // re-syncs cost nothing and make the buttons land on our colour even if
        // the first sample happened before the sheet existed.
        var retries = [];
        [400, 1200, 2600, 5000].forEach(function (delay) {
          retries.push(
            window.setTimeout(function () {
              try { syncCaption(); } catch {}
            }, delay)
          );
        });
        var disposeChange = ctx.on('theme/change', function (snapshot) {
          try {
            window.__DSH_AURORA_GLASS_EVENTS__ = (window.__DSH_AURORA_GLASS_EVENTS__ || []).concat([{
              at: Math.round(performance.now()),
              preference: snapshot && snapshot.preference,
              active: snapshot && snapshot.active && snapshot.active.id,
            }]).slice(-40);
          } catch {}
          applyFlag(ctx);
        });
        return function () {
          if (onReady) document.removeEventListener('DOMContentLoaded', onReady);
          for (var i = 0; i < retries.length; i += 1) window.clearTimeout(retries[i]);
          if (typeof disposeChange === 'function') disposeChange();
          else if (disposeChange && typeof disposeChange.dispose === 'function') disposeChange.dispose();
          if (document.body) {
            document.body.removeAttribute(BODY_FLAG);
            document.body.style.removeProperty('--aurora-caption');
            document.body.style.removeProperty('--dsw-specific-sidebar-fill');
            document.body.style.removeProperty('--aurora-caption-seq');
          }
        };
      }, 'dsh-aurora-glass: active-skin flag');
    }

    exports.SKIN_ID = SKIN_ID;
    exports.BODY_FLAG = BODY_FLAG;
    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
