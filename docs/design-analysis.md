# 深色玻璃界面拆解（参考应用）

这份笔记记录参考应用（一款模组管理器的桌面客户端）的界面为什么看起来是"深色玻璃管理台"，以及每一项在 DSH 皮肤里被映射成什么。
采样来源：`参考应用.exe`（PyInstaller 打包的 pywebview 壳 + 本地 Flask 服务 + Vue 3 / Element Plus 前端，
默认端口 5000），通过 DevTools Protocol 在其真实运行界面上逐个取样 `getComputedStyle` 与截图。

## 1. 底色：近黑 + 一张模糊壁纸

整个应用不是"纯黑主题"，而是 **一张全屏图片 + 一层压暗的深色**：壁纸被模糊、压暗到只剩色相，
所有面板浮在它上面。因此界面在静止时也有大面积的冷暖过渡，而不是死板的 #0f0f10。

| 元素 | 实测值 |
| --- | --- |
| 页面底色 | 壁纸（人物图）+ 深色遮罩，视觉接近 `#0a0d0c` |
| 内容主面板 | 半透明深色 + 180° 阅读渐变（上深 → 中浅 → 下深） |
| 侧栏 | `rgba(0,0,0,0.1)` + `backdrop-filter: blur(24px) saturate(1.35)` |
| 分隔 | `inset -1px 0 0 rgba(255,255,255,0.043)` 的 1px 内阴影 |

→ DSH 映射：`--dsw-alias-bg-base` 改为半透明深色，`html:has(body[data-aurora-glass])` 承载 13 层叠加的
"极光壁纸"（四角与中心放射光 + 光带 + 底色渐变 + feTurbulence 噪点），主面板再叠一层阅读渐变保证长文对比度。

## 2. 材质：玻璃，但从不"厚"

玻璃感来自三件事的组合，而不是单纯的高斯模糊：

1. **低透明度底色**（`rgba(0,0,0,0.1)` 级别的黑，或 `rgba(255,255,255,0.03)` 级别的白）；
2. **1px 细描边**（`rgba(255,255,255,0.075 ~ 0.1)`），永远比阴影更先被看见；
3. **顶部内高光**（`inset 0 1px 0 rgba(255,255,255,0.06)`）+ 柔和大阴影（`0 2px 8px rgba(0,0,0,.3)`）。

代表性组件：

| 组件 | 关键样式 |
| --- | --- |
| 玻璃卡 `.na-glass-card` | `bg rgba(0,0,0,.1)`、`border 1px rgba(255,255,255,.1)`、`radius 16px`、`blur(10px)`、`padding 24px` |
| 幽灵按钮 | `bg rgba(255,255,255,.03)`、字 `rgba(255,255,255,.74)`、`border 1px rgba(255,255,255,.075)`、`radius 10px`、`blur(5px)` |
| 折叠分区头 | `bg rgba(255,255,255,.035)`、`radius 11px 11px 0 0` |
| 游戏卡 | `radius 15px`、`blur(15px)`、`padding 12px`、无自身底色（吃父层玻璃） |

→ DSH 映射：`--dsw-alias-bg-layer-*` / `--dsw-alias-border-l*` / `--dsw-specific-menu-surface-fill` 改半透，
composer、菜单、弹窗、侧栏用 `backdrop-filter: blur(20~26px) saturate(1.3)` 与内高光复刻。

## 3. 强调色：薄荷绿，只用在"要做的事"上

| 用途 | 值 |
| --- | --- |
| 主按钮（渐变胶囊） | `linear-gradient(135deg, #22c55e, #16a34a)`，白字，`radius 20px`（完全胶囊），`blur(5px)` |
| 激活导航项描边 | `rgba(69,214,160,0.22)` + 内高光 + `0 4px 14px rgba(0,0,0,.043)` |
| 激活导航项底 | `linear-gradient(100deg, rgba(255,255,255,.067), rgba(255,255,255,.035) 58%, rgba(255,255,255,.016))` |
| 分组标签前的圆点 | 5px 薄荷圆点 + 光晕 |
| 成功/警告/错误 | `#4caf50` / `#ff9800` / `#f44336`（Element Plus 语义色，描边胶囊） |

关键在于**激活项不是实心色块**，而是"玻璃 + 一道很细的绿边"，绿只做签名，不铺面积。

→ DSH 映射：`--dsw-alias-brand-primary` 薄荷绿、`--dsw-alias-button-primary-fill` 渐变胶囊、
选中行/激活项用 `inset 0 0 0 1px rgba(69,214,160,.3)` + 白色低透明度渐变。

## 4. 形状：两套半径，一个例外

- 面板 / 卡片：14–18px（`--dsw-radius-md` 12 → 16）
- 控件（按钮、输入、导航项）：10–12px
- **动作按钮是胶囊**（`radius 20px` / `999px`）：主按钮、登录、语言、图标按钮全部如此
- 唯一的方正元素是主题预览卡（深色卡 `#1a1a1a` + `border 2px #333`，浅色卡纯白），用 2px 描边强调"选中"

→ DSH 映射：行高亮 12px、卡片 16–22px、composer 22px、`[role=tab]` 与主按钮胶囊化。

## 5. 排版

- 中文为主，标题用**超粗**（`700–900`）大字（首屏 40px+），正文 13–14px / 1.6。
- 英文只出现在两种位置：`eyebrow`（全大写 + 字距，如 `GAME ORBIT`）和产品字标（`参考应用`）。
- 字族：`MiSans VF` 优先，回退 `Helvetica Neue / PingFang SC / Microsoft YaHei`；控件用 `Inter / SF Pro Display`。
- 二级 tab 竖排（设置页左侧），14px/500，激活项深色填充 + 左侧竖条。

→ DSH 映射：字号保持 DSH 默认（皮肤不夺权），只把字重与字距用在 `_sectionLabel` 与标题上；
字族通过 `--dsh-font-family-text` 不动，避免破坏代码/终端等角色变量。

## 6. 结构：三栏 + 顶栏胶囊组

- 左栏 ~232px：logo 磁贴 + 字标（流光字）、分组导航（图标 + 文本，44px 行高）、底部版本信息与"收起"。
- 顶栏：面包屑 + 当前激活项选择器 + 状态 chip（已连接 / 会话已过期）+ 语言 + 图标按钮组 + 头像胶囊。
- 内容区：面包屑式标题行 → 页面大标题 → 卡片分区（每张卡一个主题，右侧放动作）。

→ DSH 映射：DSH 的侧栏/主面板结构本身就是这个骨架，皮肤只负责材质；顶栏与
`[role=tab]` 行用胶囊化 + 细描边对齐。

## 7. 从 NPP 到 DSH：三层落地

| 层 | 手段 | 覆盖内容 |
| --- | --- | --- |
| 令牌层 | `skin/tokens.json` → `build.mjs` 生成 `body[data-aurora-glass] { … }` 规则；同一份令牌也通过 `ctx.theme.register({ id: 'aurora-glass', colorScheme: 'dark', tokens })` 注册为主题定义 | 137 个 `--dsw-*` 颜色令牌；DSH 的组件在读取这些别名时就地取到半透明值 |
| 材质层 | `<style id="dsh-aurora-glass-sheet">` + `body[data-aurora-glass]` 作用域 | 壁纸、玻璃、胶囊、选中态、滚动条、弹窗与菜单的 chrome |
| 门槛层 | `body[data-aurora-glass]` | 皮肤不激活时零残留，切回内置深/浅色立即还原 |

### 令牌为什么放在样式表里

DSH 的 theme presenter 独占 `<body>` 上的内联变量：每次 `theme/change` 都先按自己的记录 `removeProperty()`，
再把当前定义的 `tokens` 写回去。插件如果也往 `<body>` 写同名变量，就会与它抢同一组属性，
并在它下一次重绘时被整批抹掉 —— 第一版皮肤正是这样"看起来像玻璃、实际底色全是产品默认不透明值"：
`--dsw-alias-bg-base` 仍是 `#151517`、侧栏仍是 `rgb(27,27,28)`。

改法是把令牌写成自己样式表里的 `body[data-aurora-glass]` 规则：它跟着门槛属性存在与消失，不参与那条内联重绘循环。
代价是令牌只对"读别名的地方"生效（DSH 的全部组件都读别名，因此够用），收益是确定性。

### 亮壁纸是"玻璃感"的前提

磨砂的可见度取决于背后有没有颜色可模糊。NPP 用一张人物照片；皮肤不能附带图片资源，
于是用 13 层渐变造一片极光（左上绿、右上蓝、右下青、左下橙、左下内侧紫、中心绿松石、四角压暗 + 噪点），
再把面板压到 0.3–0.5 的不透明度。深壁纸 + 深面板会让 `backdrop-filter` 无从体现——这正是第一版"没有玻璃"的观感来源。

不复制 NPP 的组件（那是 Vue + Element Plus），只迁移**设计语言**：低透明度 + 细描边 + 内高光 + 薄荷签名色
+ 胶囊动作 + 一张会呼吸的底图。

## 8. 桌面窗口：三处只有壳里才能改的细节

DSH 的桌面壳把标题栏交给 Windows（`titleBarStyle: "hidden"` + `titleBarOverlay`），
于是"标题栏"其实是三层东西：Windows 画的三个按钮、壳在 preload 里画的菜单栏、以及 Web 页面自己的顶部区域。
皮肤要改观感，必须分别处理：

| 现象 | 真实成因 | 修法 |
| --- | --- | --- |
| 内容区左上角有 16px 圆角 | `[data-windows-titlebar] .centerCol { border-radius: var(--dsh-windows-content-radius) 0 0 0 }` | 把 `--dsh-windows-content-radius` 覆盖成 `0px`，再 `border-radius: 0` 兜底 |
| 三个按钮是产品写死的深灰 | 主进程用 `chromeFallbackFill()` 作为 `titleBarOverlay.color` | 壳会监听 `body[style]`，把 `--dsw-specific-sidebar-fill` 用 1×1 canvas 采成 rgba 后 `setTitleBarOverlay({ color })`；因此皮肤只要把这个令牌做成**带 alpha 的**颜色，按钮底色就会跟着透明度滑块走 |
| 菜单栏左边没有品牌标识 | `div[data-windows-menu]` 内部是 open shadow root，页面 CSS 选不进去 | 在宿主上用 `::before` 画品牌图形（22×16.2，`background: url(<base64 svg>) center / contain no-repeat`），再把宿主 `left` 前移 27px 把宽度还回去 |

第三点的取舍：为什么不去改菜单栏本身？shadow root 里的按钮样式属于壳，插件没有稳定句柄去改它，
而宿主元素的 `::before` 是外层文档规则，特异性高于 `:host`，是唯一"够得着"的位置。

那一格走过一次弯路，值得记下来：第一版是 `background-color: rgba(255,255,255,.93)` + `mask: url(<data URI>)`
（想把官方 mark 当镂空模板刷白）。URI 用**手工百分号编码**拼出来（`%22`、`%3C`、`%23`），浏览器判定
无效时**不报错、只是不套用 mask** —— 元素于是只剩自己的底色，一个白色实心方块。结论不是"把编码改对"，
而是这条路上永远埋着同一个失败模式：**只要图形靠 mask 画，mask 一坏就变成方块**。
现在图形直接作 `background-image`（base64），没有底色可露，最坏情况只是图标不显示。

### 第一版为什么还是黑底

两个原因叠在一起，任一条都足以让按钮停在产品默认的 `#1b1b1c`：

1. **Windows 的标题栏覆盖层不接受 alpha。** 一开始把 `--dsw-specific-sidebar-fill` 写成
   `rgba(7, 16, 14, calc(0.55 * var(--aurora-alpha)))`，壳采到的是半透明值，`setTitleBarOverlay`
   把它当不透明色用 —— 结果就是近黑。
2. **采样时机早于皮肤生效。** 壳的 `MutationObserver` 只盯 `html[lang]`、`body[style]`、
   `body[data-ds-dark-theme]` 和 `head` 子树；皮肤挂的是 `body[data-aurora-glass]`，
   属性变化不触发重采样。于是皮肤生效之后再没有人重新采样过一次。

改法：令牌改成 `var(--aurora-caption, #0d1a16)`，客户端按透明度在 `rgb(8, 19, 15)` 与 `rgb(22, 52, 44)` 之间混出
**不透明**色写进 `body`，并在开关皮肤、拖动滑杆时写一个没有样式作用的 `--aurora-caption-seq`
（时间戳）—— 目的只是制造一次 `body[style]` 变更，让壳重新采样。这样按钮既不是黑的，
也仍然跟着透明度滑块走。

### 从"两块材料"到"一整块玻璃"

第一版给侧栏单独加了 `backdrop-filter: blur(30px) saturate(1.7)`，想让它在壁纸上"磨砂"。结果是
两侧质感对不上：侧栏被模糊 + 提饱和，内容区是清晰壁纸，接缝处像两块不同材料，极光也在栏与栏
之间断开，像"左边贴了一张图"。第二版改成"两侧各一层同族薄纱"，方向对了，但仍然是两座独立的
薄纱——标题栏还得刷第三种颜色去接三颗按钮，于是顶部又出现一条更亮的实色带。

现在只有一层玻璃，且只写在一个元素上：

```css
/* 窗口就是一块玻璃，三个区域只是它上面的三块地方 */
body[data-aurora-glass] [class*='_frame'] {
  background-color: rgba(4, 9, 9, calc(0.36 * var(--aurora-alpha, 1)));
  backdrop-filter: blur(var(--aurora-glass-blur, 14px)) saturate(1.22);
}
/* 侧栏 / 内容列 / 主面板 / 标题栏条：一律透明，无底色、无描边、无投影 */
```

判断标准很朴素：**任何一栏只要自己带了底色或模糊，它就立刻变成第二种材料**。所以薄纱和模糊
只能出现在它们的共同祖先 `.frame` 上；`_sidebarCol`、`_centerCol`、`_mainPanel` 甚至标题栏条
（`.frame::before`）都必须完全透明，连分隔线都去掉，只靠壁纸本身的明暗和内容的排布来分区。

唯一无法并入这块玻璃的是右上角三颗按钮：它们由 Windows 绘制，底色必须是**不透明**色，且取色
器只会采样 `--dsw-specific-sidebar-fill`。做法是让这个令牌指向 `--aurora-caption`，取值等于
"右上角薄纱合成色"的实测值（满透明度 `rgb(18, 40, 65)`，最薄 `rgb(24, 54, 90)`），于是按钮
落在与玻璃同色的底上，视觉上消失。

## 9. 壁纸与透明度：把两个旋钮交给用户

皮肤的可调项全部落在两个 CSS 变量上：

- `--aurora-photo` / `--aurora-photo-opacity` / `--aurora-photo-blur`：`html::before` 固定层铺照片，
  加一层从上到下的暗化渐变，让文字所在的中间带始终够暗；
- `--aurora-alpha`：所有面板底色写成 `rgba(…, calc(基值 * var(--aurora-alpha)))`，
  一个滑杆就能整窗同调，不必为每个面板维护一份 20% 的副本。

两个变量都由设置页写进 DOM（`<html>` 与 `<body>` 的内联样式），因此它们也参与壳的取色重采样 ——
透明度滑到 40%，右上角按钮的底色会同步变浅，而不是留在原来的深灰上。

图片在浏览器里压缩后才入 `localStorage`（长边 1920、JPEG q0.82、循环降质到 < 2.6 MB），
避免 5 MB 以上原图撑爆配额；`localStorage` 里的键名是 `dsh-aurora-glass:photo|alpha|blur`。
