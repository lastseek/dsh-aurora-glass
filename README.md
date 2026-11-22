# Aurora Glass (dsh-aurora-glass)

DeepSeek Harness 的暗色玻璃皮肤：极光壁纸、磨砂面板、细描边、薄荷绿签名色与胶囊动作。
它由一个注册主题（令牌层）和一张样式表（材质层）组成 —— 不注入第二个应用、不渲染自己的 DOM、不联网。

> A dark glass skin for DeepSeek Harness: aurora wallpaper, blurred glass panes,
> hairline borders, a mint accent and capsule actions. One registered theme (token layer) plus one stylesheet
> (material layer) — no second app, no DOM of its own, no network.


## 它改了什么

| 层 | 位置 | 效果 |
| --- | --- | --- |
| 令牌 | `body[data-aurora-glass] { … }`（由 `build.mjs` 从 `skin/tokens.json` 生成，同时以 `ctx.theme.register(...)` 注册成主题定义） | 137 个颜色令牌：半透明近黑底、薄荷品牌色、暖色警告、玻璃菜单面 |
| 材质 | `<style id="dsh-aurora-glass-sheet">` | 一整块玻璃：多层极光壁纸 → `.frame` 上唯一的薄纱 + `backdrop-filter`；侧栏 / 内容区 / 标题栏全部透明，只是这层玻璃的三个区域。另有胶囊主按钮、选中行绿边、玻璃 composer、玻璃菜单与弹窗、薄荷滚动条 |
| 一致性 | 三个区域共用**同一块**玻璃 | 薄纱与模糊只写在 `.frame` 上（`background-color: rgba(4,12,11,calc(.22*alpha))` + `backdrop-filter: blur(3.6px) saturate(1.35) brightness(1.04)`）；`_sidebarCol` / `_centerCol` / `_mainPanel` / 标题栏条，以及侧栏内层根 `_quietBars` 一律透明且无描边无投影。给某一栏单独加底色或模糊，那一栏立刻像另一种材料 —— 这正是前几版「左侧和内容区不协调」「标题栏像一条亮带」「侧栏是淡蓝实底」的来源 |
| 版本 | `docs/versions/<版本>/` 存每个版本的真机截图，`docs/versions/CHANGELOG.md` 记改动；每次改动都必须递增 `package.json` 与 `src/client.template.js` 的 `BUILD` |
| 门槛 | `body[data-aurora-glass]` | 所有令牌与材质规则都限定在该属性下；切回内置主题时零残留 |

> 令牌为什么写成样式表规则而不是 `<body>` 的内联变量：宿主的 theme presenter 独占 body 上的内联变量，
> 每次 `theme/change` 都会先删除自己写过的名字再写回当前定义。插件若也往 body 写同名变量，
> 就会和 presenter 抢同一组属性，并在它下一次重绘时被抹掉（实测结果正是"令牌全部失效、底色回落到产品默认值"）。
> 把令牌放进样式表的 `body[data-aurora-glass]` 规则里，就与那条重绘循环解耦：门槛属性在，令牌就在。

外观是"亮壁纸 + 暗玻璃"，不是"暗壁纸 + 暗面板"：磨砂只有在背后有颜色可模糊时才读得出来。
壁纸层与面板透明度都集中在 `skin/skin.css` 顶部与 `skin/tokens.json` 的 `bg-base / bg-layer-* / specific-sidebar-fill`。

设计拆解见 [docs/design-analysis.md](docs/design-analysis.md)（NPP 的配色、材质、半径、排版，以及每一项到 DSH 令牌的映射）。

## 行为

- **随插件开关**：插件启用 = 皮肤生效。宿主的外观选择器只持久化 `light / dark / system` 三个内置值，
  插件注册的主题 id 无法被写入设置，所以皮肤在每次页面加载后的极短时间内**认领一次**外观偏好
  （先同步认领，再回答宿主随后的设置水合；6 秒内最多 4 次，之后不再干预）。
  因此：在 设置 → 通用 → 外观 里手动切到深色/浅色，本次会话皮肤就关闭；**重启后插件会重新认领**。
  想长期关掉皮肤，请在插件页把 `极光玻璃` 关掉。
- **暗色专用**：注册为 `colorScheme: 'dark'`，与产品的深色底座匹配；不假装支持浅色。
- **与其它换肤插件互斥**：同一时刻只应启用一个换肤插件（两个插件都会在启动时认领外观偏好，
  并且各自的材质层会叠加）。实测同时启用 `dsh-dream-skin` 会出现"绿侧栏 + 紫色内容区"的混色，
  启用本皮肤时请关掉它。


## 外观设置

设置 → **极光玻璃** 里有两块：

| 项 | 作用 | 存哪 |
| --- | --- | --- |
| 壁纸 | 选一张本地图片铺满整个窗口；上传前在 canvas 里压到长边 1920、JPEG q0.82（循环降质直到 < 2.6 MB） | `localStorage['dsh-aurora-glass:photo']`（data URL） |
| 背景模糊 | 0–40px，给壁纸本身加 `filter: blur()` | `localStorage['dsh-aurora-glass:blur']` |
| 背景透明度 | 20–100，整窗一起调：所有面板的底色都是 `rgba(…, calc(基值 * var(--aurora-alpha)))` | `localStorage['dsh-aurora-glass:alpha']` |

「恢复极光」清掉壁纸回到内置渐变；「恢复默认」把透明度拉回 100。



透明度那一项同时会改写 `body.style` 上的 `--aurora-alpha` —— 桌面壳的标题栏取色器正是靠监听
`body[style]` 变化重新采样 `--dsw-specific-sidebar-fill` 的，所以右上角三个按钮的底色会跟着一起变。

### 只在桌面 App 里生效的三处

| 改动 | 做法 |
| --- | --- |
| 去掉内容区左上角的圆角 | `--dsh-windows-content-radius: 0` + `_centerCol { border-radius: 0 }` |
| 标题栏三按钮底色（1.3.8 起） | 壳把 `--dsw-specific-sidebar-fill` 直接交给 Windows 当覆盖层填充色，而覆盖层**不认 alpha** —— 那块永远是实色，不可能玻璃。所以皮肤改成把整条 40px 标题栏刷成同一个实色（`--aurora-caption`，近中性深色 `rgb(10,16,17)`），按钮就“长”在这条带子里，下面 99% 的窗口仍是玻璃。想只让最后 ~200px 实色：把那条 `background` 换成 `linear-gradient(to left, var(--aurora-caption) 0 160px, transparent 300px)` |
| 标题栏左侧的鲨鱼图标 | **已取消**（1.3.6）：Windows 上那条 40px 是壳和页面共用的区域，菜单栏在 open shadow root 里、插件拿不到，任何自绘图形都可能被别的东西盖住或盖住别的东西。皮肤现在不往那里画任何东西 |
| 标题栏左侧的「收起侧边栏」按钮 | **已隐藏**（1.3.7）：那是页面元素 `button[class*='_toggle']`（在 `[class*='_logoRow']` 里），桌面壳把它 `fixed` 钉在 (12,6)。隐藏后菜单宿主改回 `left: 12px` 贴住窗口边缘；**代价：开着皮肤时无法从这个按钮收起侧边栏**，想要它回来就关掉 `[class*='_logoRow'] button[class*='_toggle'] { display: none }` 那一条 |

Web 预览（`dsh web`）没有窗口边框，这三处看不到；要确认请刷新桌面 App。

## 安装

```
plugin_manager install_bundle target: "D:\\deepseek-harness\\default-workspace\\dsh-aurora-glass"
```

安装后**重启 DSH**：客户端产物由宿主服务，热加载只在 `pnpm run dev:web` 时生效。
需要 `restart-required` 时以 `plugin_manager` 返回的 `application` 字段为准。

## 开发

`skin/tokens.json` 与 `skin/skin.css` 是事实来源，`lib/client.js` 是生成物：

```
node build.mjs
node --check lib/client.js
```

验证套路（本次开发实际使用的回路）：

1. 临时 profile 里链入本包：`dsh plugin --profile web add "link:D:/.../dsh-aurora-glass"`，
   并把 `dsh-aurora-glass` 追加到该 profile `package.json` 的 `dsh.profile.bundles`；
2. `dsh --profile web --port 5699 --no-open`，从日志里取带 token 的 URL；
3. headless 浏览器 + CDP：`Network.setCacheDisabled(true)`（否则会跑旧 bundle），
   读 `window.__DSH_AURORA_GLASS__` 判断 `activeId / flagged / adoptError`，截图对比。

## 卸载

在插件页停用或移除即可：主题反注册、样式表移除、`body[data-aurora-glass]` 一并消失。

## 结构

```
dsh-aurora-glass/
  package.json         # dsh.bundle.patch + dsh.client(platform: web)
  cordis.patch.yml     # insert: aurora-glass
  icon.svg             # 原创图标（64×64）
  lib/index.js         # 宿主半边（无逻辑，仅让 bundle 合法装配）
  lib/client.js        # 生成物：__ModuleLoader__ 壳 + 令牌 + 材质样式
  skin/tokens.json     # 137 个令牌（事实来源）
  skin/skin.css        # 材质样式（事实来源）
  skin/shark.svg       # 标题栏用的品牌图形（构建时转 data URI）
  src/client.template.js, src/host.js
  build.mjs
  locale/{en,zh}.json  # meta.title / meta.description
  docs/design-analysis.md
```

MIT.
