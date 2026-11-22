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

    var TOKENS = __TOKENS_JSON__;
    var CSS = __SKIN_CSS__;

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
