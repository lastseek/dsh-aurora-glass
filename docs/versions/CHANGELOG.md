# 版本记录

> **当前交付版本：1.5.0。** 1.4.1（右侧栏加板）、1.4.2（文件卡片加板）、1.4.3（悬浮预览框加板）均已撤回 —— 它们没能命中用户真正指的那个元素，按用户要求在 2026-11-22 回滚到 1.4.0。下面三节保留作为记录。

每次改动都递增版本号，并存下该版本的真机截图（`docs/versions/<版本>/`）。
截图一律来自真实的 DSH Web 实例（`dsh --profile web` + headless Edge CDP），不是设计稿。

## 1.5.0

**改名、去品牌、清资产、补 LICENSE。功能与外观与 1.4.0 完全一致。**

- 改名：包名 `dsh-nexus-skin` → `dsh-aurora-glass`；装载条目 id `nexus-skin` → `aurora-glass`；主题 id `nexus-glass` → `aurora-glass`；body 门槛属性 `data-nexus-skin` → `data-aurora-glass`；CSS 变量 `--nexus-*` → `--aurora-*`；localStorage 键 `dsh-nexus-skin:*` → `dsh-aurora-glass:*`；诊断全局 `__DSH_AURORA_GLASS__`。**升到这一版后外观偏好会重置一次**（主题 id 变了），插件页里重选「极光玻璃」即可。
- 文案：包描述、locale 的 title/description、设置分区名、README 标题里不再出现第三方产品名；设置分区现在叫「极光玻璃 / Aurora Glass」。
- 删资产：`skin/shark.svg`、`skin/_brand.html`、`sharktest*.html`（前两者是 DeepSeek 品牌图形，不在 `files` 白名单里但会随仓库上传）；`docs/` 下 4 张含官方 logo 的截图；`docs/versions/` 只保留 `1.4.0` 与 `1.5.0`（含真实会话标题与绝对路径的 17 个旧版本目录已删）。
- 发布准备：新增 MIT `LICENSE`（并加入 `files` 首位）、去掉 `"private": true`。
- 构建：`137 tokens, 19706 bytes of css, 67095 bytes of bundle`；`lib/client.js` 内 `nexus|Nexus` 命中 0 处。
- 截图：`docs/versions/1.5.0/{home,settings}.png`。

## 1.4.3

**撤回 1.4.2 给文件卡片加的板；改为给「悬浮预览框」加板。**

- 用户 m03253：「鼠标悬浮在文本文件卡片上时会有一个悬浮的预览框，是这个预览框的背景，文件卡片不用改黑色背景」。
- 撤回：删掉 1.4.2 的 `HOHHba_card / HOHHba_root / K5rwea_file` 板（卡片恢复原样，只保留它自己的 `_cardPreview` 内层深色）。
- 新目标：那个悬浮预览框属于面板宿主组件的 **floating** 形态（同一个 `123xe` 家族里，`_surface_123xe_127` 是停靠形态，`_floatingCell_123xe_158` / `_float_123xe_158` + `_floatHeader/_floatBody` 是浮动形态，`_floatHeader` 的 `cursor: move` 说明它是可拖的浮窗）。它继承的是半透明的菜单/卡片填充，所以背后的正文会透。

```css
body[data-nexus-skin] [class*='_floatingCell_'],
body[data-nexus-skin] [class*='_float_12'] {
  background-color: rgba(7, 12, 11, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  box-shadow: 0 26px 64px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(var(--nexus-glass-blur, 3.6px)) saturate(1.08);
  overflow: hidden;
}
body[data-nexus-skin] [class*='_floatHeader_'],
body[data-nexus-skin] [class*='_floatBody_'] { background-color: transparent !important; }
```

- 实测：注入一个 `_floatingCell_123xe_158 _float_123xe_158` 节点 → `bg rgba(7,12,11,0.96)`、`border 1px rgba(255,255,255,0.09)`、`r 14px`、`bf blur(3.6px) saturate(1.08)`，截图里它背后的侧栏按钮与正文完全被盖住。
- 说明：本地临时 `--profile web` 实例里复现不出这个 hover 预览（悬浮文件卡片不弹窗），所以这条是按家族样式推的，**需要用户在桌面 App 里确认**。

截图：`float-pane-probe.png`。

## 1.4.2

**回滚 1.4.1（右侧栏那条规则），改给「内容区里被编辑文件的卡片」加板。**

- 用户 m03169：「不是侧边栏，是内容区的悬浮小窗口。回滚到上一版再修改。」
- 回滚：删掉 1.4.1 给 `[data-slot='rightbar.session'] [class*='_surface_']` 加的全部规则（右侧栏恢复成玻璃）。
- 真正的原因（读产品 CSS 得出的）：那些文件卡片的外层写着 `background: var(--changes-fill)`，而 **本构建里 `--changes-fill` 没有定义**（实测 computed 为空字符串），于是这条声明解析成"没有背景"。产品的正文底色是不透明的，所以看起来正常；我们的正文是玻璃，卡片就成了"透明的小窗"，背后的正文直接穿过来。

```css
body[data-nexus-skin] [class*='HOHHba_card'],
body[data-nexus-skin] [class*='HOHHba_root'],
body[data-nexus-skin] [class*='K5rwea_file'] {
  background-color: rgba(7, 12, 11, 0.96) !important;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(var(--nexus-glass-blur, 3.6px)) saturate(1.08);
}
/* 卡头与内联 diff 已经在这块板上，不再自己上色 */
body[data-nexus-skin] [class*='HOHHba_header'],
body[data-nexus-skin] [class*='HOHHba_preview'],
body[data-nexus-skin] [class*='K5rwea_cardPreview'] { background-color: transparent !important; }
```

- 实测：`K5rwea_file` computed `bg rgba(7,12,11,0.96)`、`border 1px rgba(255,255,255,0.09)`、`radius 14px`；截图里卡片背后的正文不再透。
- 未能在本地复现的部分：`HOHHba_*`（"已编辑 N 个文件"那种多文件卡）在临时 `--profile web` 实例里不渲染，所以这条是按同一组件family 推的，**需要用户在桌面 App 里确认**。

截图：`file-card.png`。

## 1.4.1

**改：右侧预览面板（看 CHANGELOG.md 那个）从透明改成近不透明。**

- 用户反馈：悬浮/打开 `CHANGELOG.md` 预览时，面板还是透的，背后的正文会穿过来。
- 定位：那个面板是右侧栏的 document preview，元素链
  `_surface_123xe_127`（720×1000）→ `_tabLayout` → `_tabCell` → `_tabHost/_pane` → `_tabHostBody/_paneBody` → `acoR2W_tabBody` → `_3R73eq_preview` → `JAd_rG_document` → markdown，
  **整条链的 `background-color` 全是 `rgba(0, 0, 0, 0)`** —— 1.2.0 把整窗做成一块玻璃时，这些面板也被一起透明了，预览的正文于是叠在聊天正文上。
- 修法：只给右侧栏槽位加一层板，不碰左侧栏（同一个 `_surface_*` 类也用于左侧面板列表，所以必须按槽位限定）：

```css
body[data-nexus-skin] [data-slot='rightbar.session'] [class*='_surface_'] {
  background-color: rgba(7, 12, 11, 0.97) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: -20px 0 54px rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(var(--nexus-glass-blur, 3.6px)) saturate(1.08);
}
body[data-nexus-skin] [data-slot='rightbar.session'] [class*='_paneBody'],
body[data-nexus-skin] [data-slot='rightbar.session'] [class*='_tabBody'],
body[data-nexus-skin] [data-slot='rightbar.session'] [class*='_tabLayout'] {
  background-color: transparent !important;   /* 板只画一层，内层不重复 */
}
```

- 实测：打开 `CHANGELOG.md` 预览后，`_surface` 的 computed 为 `bg rgba(7,12,11,0.97)`、`border-left 1px rgba(255,255,255,0.08)`、`bf blur(3.6px) saturate(1.08)`；面板与聊天之间的接缝是一条细线 + 软阴影。

截图：`preview-panel.png`。

## 1.4.0

**改：自定义壁纸从「充满并裁切」改成「完整缩放」；1.3.9 的透明标题栏定稿。**

- 1.3.9 的透明覆盖层实测通过（用户：「完美解决，现在才是沉浸式一体化玻璃面板」），保留为正式行为：
  `--nexus-caption` 与 `--dsw-specific-sidebar-fill` 都送 `rgba(0, 0, 0, 0)`，标题栏条本身 `transparent`，三个原生按钮直接浮在玻璃上。
- 壁纸缩放：`html:has(body[data-nexus-skin])::before` 的 `background-size: cover` → `var(--nexus-photo-fit, contain)`。
  整张图按比例缩放到看得全（不再裁切），空出来的部分透出下面的极光渐变，所以不会看到生硬的黑边。
  想回到「充满并裁切」：把该行改成 `background-size: cover`（或把 `--nexus-photo-fit` 设成 `cover`）。
- 实测：横图 1400×933 与竖图 720×1280 都完整可见，竖图两侧由极光填充；`--nexus-photo-fit` 未设时按 `contain`。

截图：`wallpaper-landscape.png`、`wallpaper-portrait.png`。

## 1.3.9

**试：把标题栏覆盖层的颜色改成全透明，让三个原生按钮直接浮在玻璃上。**

- 用户问「怎么样可以让软件自己画这个覆盖层？」。查源码后的事实（`lib/main.js` / `lib/preload-app.cjs`）：
  - 那三个按钮是 **Windows 原生**的（`titleBarStyle: 'hidden'` + `titleBarOverlay`），页面画不了、也盖不住；
  - 页面唯一能影响它的是「壳从 `--dsw-specific-sidebar-fill` 采样后送过去的填充色」；
  - **欢迎窗口**（`lib/main.js` 约 16048 行）用的是 `titleBarOverlay: { color: '#00000000', symbolColor: … , height: 42 }`，
    也就是**全透明填充**——说明“没有底板、只有按钮”这件事 Electron/Windows 是支持的；
  - 但主窗口这条路只能送 `rgba(r,g,b,a)`（preload 的 `nativeColor()` 用 1×1 canvas 取色，永远输出 rgba 字符串），
    所以能不能透明，取决于 `setTitleBarOverlay` 是否保留 alpha。
- 本版就是把 `--nexus-caption` / `--dsw-specific-sidebar-fill` 都设成 `rgba(0, 0, 0, 0)`，并把 1.3.8 那条不透明标题栏带撤掉
  （`_frame::before` 回到 `transparent`）。实测页面侧：两个令牌都是 `rgba(0, 0, 0, 0)`、`_frame::before` 透明。
- **这是实验版**：如果 Windows 把 alpha 丢掉，右上角会变成一块纯黑板 —— 那就说明必须走“壳”这条路（见下），
  把 `CAPTION` 改回不透明色 + 恢复 1.3.8 的标题栏带即可。
- 真要让应用自己画按钮（自定义最小化/最大化/关闭）：必须改 `lib/main.js` 的窗口创建参数（去掉 `titleBarOverlay`，或改成
  `frame: false` + `titleBarStyle: 'hidden'`），并在 preload 里补三个 IPC（`minimize` / `maximize|unmaximize` / `close`）——
  现在 `DESKTOP_IPC` 里没有这三个通道，渲染端拿不到窗口控制权。代价：自绘按钮会失去 Windows 11 的「悬停显示贴靠布局」。
  这些都在 `app.asar` 里，插件（渲染端 + DSH host）改不到窗口创建参数。

截图：`home.png`。

## 1.3.8

**改：标题栏 40px 整条变成「按钮自身的颜色」，蓝色方块消失。**

- 用户反馈（附裁剪图）：右上三个按钮是一块明显的蓝色矩形，「画面太割裂了」。
- 原因：壳把 `--dsw-specific-sidebar-fill` 的取值（即我们算出来的 `--nexus-caption`）直接交给 Windows 当覆盖层的填充色，
  而 **Windows 的标题栏覆盖层不认 alpha**，那块永远是实色；同时我又把它算成了「极光右上角的合成色」（偏蓝 `rgb(27,66,107)`），
  于是按钮区是一块蓝，周围是玻璃，边界生硬。
- 修法：**让标题栏整条都用这个实色**，而不是想办法让它变透明。
  `html[data-windows-titlebar] [class*='_frame']::before { background: var(--nexus-caption, #0b1214) }`
  （加 `inset 0 -1px 0 rgba(255,255,255,0.06)` 收个边）。整条 40px 与按钮同色 → 无论壁纸是什么，都不会出现错位矩形，
  读起来就是一条深色标题栏；下面 99% 的窗口仍然是玻璃。
- 同时把 caption 颜色改成**近中性的深色**：`CAPTION_FULL = [10, 16, 17]`、`CAPTION_LOW = [15, 23, 24]`（原 `[27,66,107]`/`[32,78,129]` 是偏蓝的采样值）。
- 实测（伪造标题栏 + 伪造按钮区）：`--dsw-specific-sidebar-fill = rgb(10, 16, 17)`、`_frame::before` 背景 = `rgb(10, 16, 17)`，两者一致。
- 备选（如果更想要「标题栏也是玻璃」）：把那条 `background` 换成
  `linear-gradient(to left, var(--nexus-caption) 0 160px, transparent 300px)`，只让最后 ~200px 实色，接缝变成软过渡。

截图：`caption-band.png`。

## 1.3.7

**改：隐藏「收起侧边栏」按钮，菜单贴到窗口左边缘。**

- 用户要求：「把左上角那个收起侧边栏按钮删掉」。那个按钮是**页面**元素，不是壳的：
  `button.wtg9ga_iconButton.wtg9ga_toggle`（在 `wtg9ga_logoRow` 里），桌面壳把它 `position: fixed`
  钉在标题栏条上的 (12, 6)，28×28 —— 之前它正好占据「应用 / 编辑」左边那 27px，所以两者挤在一起。
- 皮肤现在把它隐藏：`html[data-windows-titlebar] [class*='_logoRow'] button[class*='_toggle'] { display: none }`。
  代价是**开着这个皮肤时无法从这个按钮收起侧边栏**（壳里也没有第二个入口）。
- 按钮没了，宿主不再需要让位，于是菜单从 `calc(var(--dsh-windows-menu-start, 48px) - 27px)` 改为固定的 `left: 12px`：
  「应用 / 编辑」直接贴到窗口左边缘，标题栏条左端保持空白。
- 实测（页面内伪造标题栏 + 宿主）：`toggle display = none`、`host left = 12px`、菜单按钮 `x = 12`。

截图：`chrome-menu-at-edge.png`。

## 1.3.6

**改：那一格不再画任何东西，菜单整体左移 27px。**

- 用户决定放弃那个品牌图标：「算了删除这个地方的元素吧，让它保持空白。或者把应用和编辑两个按钮往左移动。」
- 皮肤现在**不再往标题栏左侧画任何图形**：`div[data-windows-menu]::before { content: none }`（1.3.5 起关闭，这里定为永久）。
  那个位置在 Windows 上是壳和页面共用的 40px 条，谁画谁负责，而我们既拿不到 shadow root，
  也不能保证任何自绘元素不会被别的东西盖住 —— 不画，就不会再有方块。
- 同时把菜单宿主 `left` 从 `var(--dsh-windows-menu-start, 48px)` 改回 `calc(… - 27px)`：
  原来留给图标的 27px 空位被「应用 / 编辑」接手，窗口左边不再有一段空白。
- 实测（页面内伪造宿主并去掉内联样式）：`host left = 21px`、`::before content = none`。

截图：`home.png`。

## 1.3.5

**诊断版：把左上角那个图形整个关掉，用来确认它到底是谁画的。**

- 你贴的裁图（70×52）里，白色鲸鱼是「一个圆角方框里挖出来的」，这是品牌 mark 的**四子路径版本**
  （含外框）。而 1.2.0 起 `skin/shark.svg` 只有三条子路径、`1.3.3` 起连 mask 都不用了 ——
  当前代码画不出那个形状。所以要分清两种情况：图形是皮肤画的（那说明跑的是旧 bundle），
  还是别的什么东西画的（那说明我们的规则根本没落在这个元素上）。
- 这一版直接把 `div[data-windows-menu]::before` 设为 `content: none`，并把宿主 `left` 退回
  `var(--dsh-windows-menu-start, 48px)`（不再前移 27px）：
  **如果这一版跑起来方块还在，它就绝不是皮肤画的**；如果方块消失，说明之前跑的是旧客户端产物。
- 桌面 profile 里 `node_modules/dsh-nexus-skin` 是符号链接指向 `D:\deepseek-harness\default-workspace\dsh-nexus-skin`，
  已确认磁盘上的产物是 `BUILD = '1.3.5'`、`package.json` 1.3.5 —— 不存在"另一份旧拷贝"。

截图：`home.png`。

## 1.3.4

**修：图标周围那圈轮廓。**

- 1.3.3 里图标还有 `filter: drop-shadow(0 0 7px rgba(93, 232, 178, 0.38))`。
  22px 的小图形外面套一圈薄荷光，在 100% 缩放下看起来就是一个淡色的圆角方框 —— 也就是
  用户看到的「白色方框」。**删掉 glow**。
- 同时把宿主 `div[data-windows-menu]` 的 `background / border / box-shadow / outline` 全部归零，
  排除「壳给菜单栏画了底板」这条可能。
- 实测（页面内伪造宿主）：
  `::before` → `22px × 16.2px`, `background-color: rgba(0, 0, 0, 0)`, `filter: none`；
  宿主 → `background: rgba(0, 0, 0, 0)`, `border-width: 0px`。

截图：`home.png`、`icon-proof.png`（1:1 与 3 倍，同一份资源，无 glow）。

## 1.3.3

**改：鲨鱼图标不再用 mask，顺手放大到 22px。**

- 放大本身治不了白框 —— 白框来自「mask 加载失败时元素露出自己的背景色」。1.3.0 换 base64 修了 URI，
  但只要还用 mask，这条路就永远有回到白块的可能（换个解码器、换次构建都可能）。
- 现在图形直接作背景：`background: url('…') center / contain no-repeat`，**没有** `background-color`，
  `mask` 全部删掉。URI 若坏，最多是图标消失，不会再出现 18×13 的白色方块。
- 尺寸 18×13.25 → **22×16.2**（保持 viewBox 23.16:17.04 的纵横比），左边距 `-27px` → 与文字间距 10px。
- 实测 `getComputedStyle(host, '::before')`：`w=22px h=16.2px bgColour=rgba(0, 0, 0, 0) img=url("data:image/svg+xml;base64,…") mask=none`。

截图：`home.png`、`chat.png`、`icon-22px.png`（22px / 旧 18px / URI 坏掉时只剩空白）。

## 1.3.2

**改：全局模糊度降到原来 40%。**

- 一个变量管全局：`--nexus-glass-blur` 从 `9px` 改成 `3.6px`（9 × 0.4）。
  窗口薄纱、输入框、菜单/弹窗/预览框全部读它，`var()` 的兜底值也一起改成 `3.6px`，
  实测 `getComputedStyle(document.body).getPropertyValue('--nexus-glass-blur')` = `3.6px`，
  frame 的 `backdrop-filter` = `blur(3.6px) saturate(1.35) brightness(1.04)`。
- 壁纸自身的 `--nexus-photo-blur`（设置里的「背景模糊」滑杆）不受影响：那是用户对壁纸的模糊，
  不是玻璃的模糊。

截图：`home.png`、`chat.png`（极光纹理已经能看清，不再是磨砂糊成一片）。

## 1.3.1

**改：悬浮层改成接近不透明。**

- 悬浮层不坐在任何一栏里，它是**盖在正文上**的。之前菜单/弹窗/预览是
  `rgba(8, 14, 13, calc(0.68 * alpha))` + `blur(9px)`，背后的正文会透出来，读起来像预览框自己的字。
- 现在是 `rgba(7, 12, 11, 0.96)`，和输入框同一族，只是再深一步；选择器扩到
  `[role='menu'|'listbox'|'dialog'|'tooltip']`、`[class*='_menuSurface'|'_popover'|'_tooltip'|'_cardPreview'|'_previewCard']`。
  实测「更多」菜单：`bg rgba(7, 12, 11, 0.96)`、`bf blur(9px)`；交付物预览卡同样变成近黑底。
- 大容器 `_surface_*`（例如 720×1000 的层）**不**参与这条规则，避免整块被涂黑。

截图：`home.png`、`chat.png`、`menu-opaque.png`。

## 1.3.0

**修：标题栏左侧的白色方框。**

- 那个图标是 `.frame` 上方 `div[data-windows-menu]::before` 的 mask 图形（DeepSeek 鲸鱼）。
  mask 的 data URI 之前是手工百分号编码（`%22`、`%3C`、`%23`）拼出来的，浏览器判定无效后
  **不报错、直接不套用 mask** —— 于是元素只剩下自己的 `background-color: rgba(255,255,255,.93)`，
  也就是一个 18×13.25 的白色实心方块。
- 修法：`build.mjs` 的 `sharkDataUri()` 改成 base64（`data:image/svg+xml;base64,…`），
  不再依赖引号/尖括号/`#` 的转义。证明图：`shark-mask-proof.png`（左＝出厂 18px，
  中＝同一 URI 放大 4 倍，右＝mask 失效时的白方块）。

**修：标题栏三按钮跟不上主界面配色。**

- 壳的做法：往 `body` 插一个隐藏探针 `span`（`background-color: var(--dsw-specific-sidebar-fill)`），
  用 1×1 canvas 取色，`ipcRenderer.send('dsh-desktop:windows-appearance', …)`
  → 主进程 `setTitleBarOverlay({color, symbolColor})`。它只监听 `body[style]`、
  `body[data-ds-dark-theme]`、`html[lang]` 与 `head` 的变动。
- 之前令牌值经过 `var(--nexus-caption)` 间接解析，采样时机一旦早于样式表落地就会拿到空值
  （Windows 叠加层把空/透明当黑色）。现在客户端把**最终的不透明色直接内联写到 `body.style`
  上的 `--dsw-specific-sidebar-fill`**，并在 400/1200/2600/5000ms 各补一次同步，
  让壳无论什么时候采样都能取到当前配色。
- 实测探针取色：`rgb(27, 66, 107)`（默认极光、100% 透明度），`body.style` 里同时有
  `--nexus-caption` 与 `--nexus-caption-seq`。

截图：`home.png`、`chat.png`、`shark-mask-proof.png`。

## 1.2.4

**修：内容区被叠了第二层薄纱和第二个模糊。**

- 根因：`*_frame` 不是唯一的类名 —— 应用外壳 `…_frame` 与会话窗格 `…_frame` 同名，而
  `body[data-nexus-skin] [class*='_frame']` 这一条把两者都涂了。结果内容列累积了 **两层**
  薄纱（0.22 × 2 ≈ 0.39）与 **两次** `backdrop-filter`，侧栏只有一层 —— 于是内容区看起来
  偏黑，而且像单独加了一层模糊。
- 修法：只让最外层那个 frame 承载玻璃，嵌套的一律清空

  ```css
  body[data-nexus-skin] [class*='_frame'] [class*='_frame'] {
    background-color: transparent !important;
    background-image: none !important;
    backdrop-filter: none !important;
    box-shadow: none !important;
  }
  ```

- 实测（同一页面）：`mP3x-q_frame` = `rgba(4,12,11,0.22)` + `blur(9px) saturate(1.35) brightness(1.04)`；
  `V4vHZW_frame`、`SNx2jG_frame`、`n-Yh7q_frame` 全部 `rgba(0,0,0,0)` + `bf:none`。
- 换自定义壁纸后侧栏与内容列的亮度已经同族（L≈45–55），不再有暗块。

截图：`home.png`、`chat.png`、`with-photo.png`（自定义壁纸下的同一块玻璃）。

## 1.2.3

**改：侧栏不再有渐隐层。**

- `…_scrollFade` 直接 `display: none`。1.2.2 只是把它渐隐到薄纱色，仍会在列表末尾留一条淡色带；
  现在列表就在它结束的地方结束。

**改：整窗只有一个模糊预算。**

- `body[data-nexus-skin]` 上新增 `--nexus-glass-blur: 9px`，窗口、输入框、菜单/弹窗全部读这一个值
  （之前输入框和弹窗是 `blur(26px) saturate(1.5)`，比窗口重一倍，看起来像另一种材料）。

**改：输入框底色加深到几乎不透。**

- `rgba(7, 12, 11, 0.94)`（聚焦 `0.96`），且**不再**乘 `--nexus-alpha`：这是打字的地方，
  背后的消息文本必须消失，透明度滑杆不该把它一起变透。

截图：`home.png`、`chat.png`（消息滚到输入框后面，看不到透出的字）。

## 1.2.2

**修：鼠标移到左侧功能区，整条侧栏变蓝；停下来几秒又恢复；列表底部还有一条蓝色底。**

- 两个症状同一个来源：`--dsw-specific-sidebar-fill` 被侧栏的两个地方当底色用 ——
  侧栏根（`…_root`）和列表底部的渐隐层（`…_scrollFade`）。这个令牌指向 `--nexus-caption`，
  也就是给 Windows 标题栏按钮用的不透明蓝。
- 为什么"悬停才出现、几秒后消失"：侧栏在静止时带 `…_quietBars` 修饰类（隐藏滚动条），
  鼠标进入后这个类被摘掉，根元素自己的底色就露出来了；空闲几秒后类加回来，又变回透明。
  上一版 1.2.1 恰恰是按 `_quietBars` 写的规则，所以只在空闲状态有效 —— 这是我漏掉的时序。
- 修法：改用**不随状态变化**的挂载点 `[data-slot='sidebar'] > *`（slot 契约的一部分）置为透明；
  底部渐隐层改成渐隐到玻璃自身的薄纱色 `rgba(4,12,11,0 → 0.34×alpha)`，不再渐隐到蓝色。

**顺带修复（构建事故）**：一次原地写文件把 `package.json` 与 `src/client.template.js` 截成 0 字节，
已从上一版产物 `lib/client.js` 反推出模板（把两个生成块还原成占位符）并重建 `package.json`，
重建后 `node --check` 通过、`build` 字段为 1.2.2、令牌 137 条。

截图：`home.png`、`sidebar-hover.png`（鼠标停在侧栏上）、`chat.png`。

## 1.2.1

**修：侧栏是淡蓝色实底，不是玻璃。**

- 根因：`--dsw-specific-sidebar-fill` 这个令牌除了被标题栏取色器采样，还被侧栏内层根
  （`…_root …_quietBars`）当作底色。它指向 `--nexus-caption`（不透明），于是整条侧栏被刷成
  `rgb(18, 40, 65)` 的淡蓝实色 —— 玻璃只剩中间那块。
- 修法：把 `[class*='_quietBars']` 与 `[class*='_sidebarCol']` 一并置为透明（无底色、无描边、无投影）。
- 定位手段：把该令牌临时刷成 `rgb(255,0,0)`，再遍历窗口内所有元素的 computed background —— 全窗口
  只有这一个消费者。

**修：整窗看起来"黑蒙蒙"。**

- 纱从 `rgba(4,9,9,0.36)` 减到 `rgba(4,12,11,0.22)`，模糊从 `blur(14px)` 减到 `blur(9px)`，
  并补 `saturate(1.35) brightness(1.04)`；极光底色提亮（`#143028 / #0d1f1a / #112a23`）。
- 三颗标题栏按钮的取色常量随新纱重测：满透明度 `rgb(27,66,107)`、最薄 `rgb(32,78,129)`。

截图：`home.png`、`chat.png`、`settings.png`。

## 1.2.0

**改：整个窗口是同一块玻璃。**

- 薄纱与模糊只写在 `.frame` 上；`_sidebarCol`、`_centerCol`、`_mainPanel`、标题栏条全部透明。
- `--dsw-alias-bg-base` 改为 `transparent`（主面板根原来用它叠了 0.2 的底色，那正是接缝来源）。
- 鲨鱼图标只保留鲸鱼本体（品牌 path 的第 4 条子路径是外框，去掉）。

## 1.1.1

**修：三颗标题栏按钮是黑底。**

- Windows 标题栏覆盖层不认 alpha，且壳只在 `body[style]` 变化时重新采样；皮肤挂的是 `data-*` 属性，
  所以取色永远不更新。改为由插件混出**不透明**色写入 `--nexus-caption`，并写 `--nexus-caption-seq`
  制造一次 `body[style]` 变更，逼壳重新采样。

## 1.1.0

**加：壁纸与整窗透明度。**

- 设置 → Nexus 玻璃：选图片（长边 1920、JPEG q0.82，存 `localStorage`）、背景模糊 0–40px、
  透明度 20–100%。
- 所有面板底色写成 `rgba(…, calc(基值 * var(--nexus-alpha)))`，一个滑杆整窗同调。

## 1.0.0

首个可用版本：NPP 风格的暗色玻璃皮肤（令牌层 + 材质层 + `body[data-nexus-skin]` 门槛）。
