# Ora Arcana Visual + Motion Direction Reset

## 1. Redesign Goal

这次不是普通的换皮，也不是把现有页面换一组颜色和背景图。P0-10 的目标是重建 Ora Arcana 的视觉系统，并建立一套可持续扩展的 Ritual Motion System。

Ora Arcana 需要从当前偏 AI tarot web tool 的体验，升级为一个完整的产品空间：

- 实体卡牌品牌
- AI Tarot Reading Room
- Reading Journal 档案系统
- 未来 Online Store

新的视觉和动效方向必须同时服务线上阅读体验、实体卡牌销售、激活码兑换、阅读档案保存和未来 /shop。用户进入 `https://oraarcana.com/ai-guide` 时，不应该感觉自己打开了一个工具页，而应该感觉自己走进了一张安静的牌桌、一间可保存阅读记录的档案室，以及一个由 Ora 协助解读的 AI-assisted tarot reading room。

## 2. Core Positioning

建议核心定位：

**Arcane Archive + Ritual Table + Physical Deck Motion**

### Arcane Archive

Reading Journal、saved readings、questions、cards、Ora's interpretations 都应该像被妥善保存的档案。页面不应像普通 dashboard 或数据库列表，而应像一组安静、可回看的阅读档案。每条 reading 是一次有上下文的记录，不是一次生成结果。

### Ritual Table

用户体验应像进入一个安静的牌桌空间。页面布局可以有桌面、牌位、边框、标签、细线、光晕和留白，但不应该过度装饰。核心感受是专注、仪式、停顿和清晰，而不是娱乐化的抽奖或游戏。

### Physical Deck Motion

洗牌、切牌、抽牌、翻牌都应模拟实体卡牌动作。即使是 online draw，也应该让用户感觉自己在和一副真实牌互动。动效重点不是炫技，而是让用户理解当前步骤、参与仪式、等待揭示。

### Ora

Ora 不是聊天机器人，也不是承诺未来准确性的 fortune teller。Ora 是 **AI Tarot Interpreter / reading attendant**。它的角色是协助用户理解卡牌象征、问题语境和可反思的下一步。

## 3. Current Visual Audit

### 保留

- 暗色基底：当前黑色、深棕、低亮度背景适合 Reading Room 氛围。
- Ora Arcana 品牌名：已经具备正式品牌感，适合继续作为主品牌。
- Reading Room / Reading Journal / Reading Account 语言：这些命名已经比 MVP 工具语言更接近产品世界观。
- 高级 serif 字体方向：serif 适合神秘、档案、卡牌和仪式感。
- 金色细线与克制氛围：金色可以保留，但需要更像黄铜、烫金、旧纸边缘，而不是泛用奢华模板。

### 需要弱化或废弃

- 泛用星空背景感：星空可以作为少量氛围，但不应成为唯一视觉记忆点。
- 高级模板感：当前有一些 dark luxury / cosmic template 的通用感，需要建立更具体的 Ora Arcana 识别。
- 静态页面感：流程页目前更像步骤页面，缺少实体卡牌动作带来的仪式连续性。
- 缺少实体卡牌材质：需要引入纸张、牌背、暗木、黄铜、磨损边缘、档案标签等材质线索。
- 缺少强记忆点符号：需要统一的卡背图形、Ora 标记、Reading Room 线框或弧形星图系统。
- 动效不够支撑塔罗仪式：洗牌、切牌、抽牌、翻牌需要成为体验核心，而不是按钮后的结果切换。

## 4. New Visual Principles

1. **Quiet before magical**  
   先安静，再神秘。视觉要让用户沉下来，而不是不断刺激用户。

2. **Physical before digital**  
   所有核心交互都应先想象成实体牌桌动作，再转译成网页体验。

3. **Archive, not dashboard**  
   Reading Journal 是阅读档案，不是后台列表。信息要有保存、回看、标记和沉淀感。

4. **Ritual, not gamification**  
   洗牌、切牌、抽牌是仪式，不是抽奖游戏。动效应该有节奏和停顿。

5. **Premium but not flashy**  
   高级感来自材质、排版、节奏和细节，不来自大面积发光、粒子或复杂炫技。

6. **Motion must guide attention**  
   每个动效都要说明“现在发生了什么”和“下一步看哪里”。没有信息价值的动效应避免。

7. **Every interaction should feel like touching a deck**  
   点击、拖动、翻开、确认都可以有轻微的实体反馈，像触碰纸牌、牌盒或桌面。

8. **AI should feel interpreted, not generated**  
   AI reading 的呈现应像 Ora 在整理和解读，而不是机器吐出文本。

## 5. Visual System Direction

### Color palette direction

继续保留暗色主基底，但从单纯黑金转向更有材质层次的 palette：

- Deep Black / Ink Black：主背景，保持 Reading Room 的安静感。
- Charcoal Brown / Dark Walnut：模拟暗木桌面。
- Aged Brass / Muted Gold：用于细线、按钮边框、符号和重点文字。
- Warm Parchment：用于档案卡、标签、阅读摘要或 shop 中的纸张感区域。
- Oxidized Green / Deep Verdigris：可作为极少量辅助色，用于档案、印章、状态或细节。
- Soft Ember / Candle Glow：用于 hover、focus、card reveal 中的轻微暖光。

避免大面积紫蓝渐变、过亮金色、廉价星空蓝、强霓虹色。

### Typography direction

- 品牌和主标题继续使用高级 serif，强调 Reading Room 和实体卡牌品牌感。
- 正文使用清晰、安静、可长时间阅读的 sans 或低调 serif。
- Reading Journal 可加入档案标签式小字：uppercase、letter spacing 适中、不要过密。
- AI reading 文本应有书页感和阅读节奏，避免 dashboard 卡片式堆叠。

### Material direction

引入更明确的实体材质：

- 暗木桌面
- 旧纸 / 羊皮纸质感
- 黄铜细线
- 牌背纹理
- 轻微磨损边缘
- 档案标签
- 蜡封、压印、烫金等只作为小面积细节

材质应克制，不能让页面变成复古拼贴。

### Layout direction

- 首页像进入 Reading Room，不像营销 landing page。
- 流程页像牌桌上的步骤推进：中央牌位、下方行动、侧边轻提示。
- Result 页面像 Reading Dossier：卡牌、问题、Ora interpretation、reflection prompt 分层清晰。
- Reading Journal 像 archive shelf：按时间保存，条目有档案感而非列表感。
- 未来 /shop 应与 Reading Room 同系统，但更强调实体卡牌、包装、实物照片和购买路径。

### Icon / symbol direction

建立一套统一符号系统：

- Ora mark：可作为 AI Tarot Interpreter 的视觉签名。
- Card back symbol：所有 online deck motion 的核心识别。
- Arcane circle / curved star map：用于页面框架或 ritual state。
- Archive label：用于 Reading Journal、saved reading、date metadata。
- Fine-line tarot symbols：避免复杂插画，优先细线、几何、黄铜感。

图标应服务导航和状态，不要堆满神秘符号。

### Background direction

不再只依赖星空。背景应从 cosmic background 转向 layered room atmosphere：

- 深色房间基底
- 轻微桌面纹理
- 纸张或牌桌边缘
- 低透明度星图弧线
- 非抢眼的光源，如烛光、桌面微光、牌面反光

WebGL 或动态背景只应作为氛围，不应成为核心流程依赖。

### Card visual direction

卡牌是整个产品的视觉中心：

- 需要统一 card back 设计。
- Online draw 的牌背应有实体厚度和轻微阴影。
- Reveal 时应有正反面关系，而不是简单替换图片。
- 实体卡牌品牌需要真实或拟真的 product shot 方向。
- 牌面图像、牌背、边框、选中态要统一在一个系统里。

## 6. Motion Language

动效语言关键词：

- Slow
- Soft
- Deliberate
- Tactile
- Slightly ceremonial
- Never noisy
- Mobile-safe

动效应该像翻纸牌、整理档案、移动牌堆、打开盒盖、烛光轻微变化，而不是游戏抽卡或 Web3 展示。

不要做：

- 过多粒子
- 快速旋转
- 高频闪烁
- 大量 parallax
- 类 Web3 炫技
- 影响点击目标
- 移动端卡顿
- 长到让用户等待焦虑的动画

移动端优先：每个动效都需要有 reduced motion 或低性能 fallback。

## 7. Ritual Flow Animation Storyboard

### Enter Reading Room

- 用户感受：从普通网页进入一个安静、可专注的空间。
- 视觉状态：暗色房间、牌桌中心、Ora Arcana 标识、轻微桌面光。
- 动效建议：背景缓慢显现，标题轻微浮入，牌桌边线或星图弧线慢慢亮起。
- 技术实现优先级：P1。优先 CSS opacity / transform，不依赖 WebGL。

### Prepare / Center

- 用户感受：停顿、呼吸、把注意力放回问题。
- 视觉状态：中央留白，少量提示文字，牌堆未打开。
- 动效建议：呼吸式光晕、慢速 pulse、细线环轻微扩散。
- 技术实现优先级：P1。可用 Tailwind / CSS keyframes。

### Ask Question

- 用户感受：正式向阅读室提出问题。
- 视觉状态：输入区域像纸笺或档案卡，周围保持安静。
- 动效建议：输入框 focus 时黄铜边线微亮，提交后纸笺轻微下沉或归档。
- 技术实现优先级：P1。必须保留 native HTML GET form。

### Shuffle

- 用户感受：实体牌开始被整理和随机化。
- 视觉状态：牌堆由多张牌背组成，轻微错位。
- 动效建议：2D 牌背左右交错、轻微旋转、归拢成牌堆；不要快速乱飞。
- 技术实现优先级：P0 for online draw redesign。先做 2D CSS/JS 状态动画。

### Cut

- 用户感受：把牌堆一分为二，并重新合拢。
- 视觉状态：牌堆分成上下或左右两组。
- 动效建议：上半牌堆滑出、停顿、换位、归拢。
- 技术实现优先级：P0。应清楚表达 cut deck 行为。

### Draw

- 用户感受：从牌堆中取出一张属于本次问题的牌。
- 视觉状态：单张牌从牌堆顶部或中心移出。
- 动效建议：抽出的牌缓慢移到中央牌位，牌背朝上。
- 技术实现优先级：P0。核心体验。

### Reveal

- 用户感受：揭示发生，阅读正式开始。
- 视觉状态：中央牌背翻转为牌面。
- 动效建议：3D-ish CSS card flip，配合轻微桌面光，不要爆光。
- 技术实现优先级：P0。需要 mobile-safe fallback。

### Result / Reading Dossier

- 用户感受：Ora 正在整理解释，而不是机器生成文本。
- 视觉状态：卡牌、问题、interpretation、reflection prompt 像一份阅读档案。
- 动效建议：section 逐步显现，Ora interpretation 像档案被打开，不用打字机效果。
- 技术实现优先级：P1。先优化排版，再加轻动效。

### Save to Reading Journal

- 用户感受：这次阅读被保存到自己的档案。
- 视觉状态：阅读卡片或标签归入 Journal。
- 动效建议：小型 archive stamp / saved label，避免大动画。
- 技术实现优先级：P2。等保存逻辑和 journal 体验稳定后再做。

## 8. Page-by-page Redesign Direction

### /ai-guide homepage

- 需要保留：Ora Arcana、Reading Room、Physical Deck / Online Draw 双入口、Reading Account。
- 应该改变：从工具入口改为明确的 Reading Room 视觉入口，减少泛星空依赖，增加牌桌、卡背、黄铜线框和实体材质。
- 适合的动效：进入页面时牌桌微亮，入口按钮像桌面上的两张选择卡，Account popover 保持轻量。

### /ai-guide/prepare

- 需要保留：准备页、Physical / Online 两条流程、语言和 query params。
- 应该改变：更像 ritual pause，不是说明页。
- 适合的动效：呼吸光、慢速 focus ring、准备步骤逐条轻显。

### /ai-guide/ask

- 需要保留：native HTML GET form，不能改成 router.push 或 onClick-only。
- 应该改变：输入问题像写在纸笺或档案卡上。
- 适合的动效：focus 时纸面微亮，提交按钮像把问题放到牌桌上。

### /ai-guide/draw

- 需要保留：shuffle / cut / draw 流程，upright-only。
- 应该改变：从按钮步骤升级为实体牌堆交互。
- 适合的动效：2D 洗牌、切牌、抽牌，优先 CSS transform 和少量状态控制。

### /ai-guide/reveal

- 需要保留：Physical card selection 和 Online reveal 逻辑。
- 应该改变：强化牌背到牌面的 reveal moment。
- 适合的动效：卡牌翻转、光线轻微聚焦、牌面出现后稳定停住。

### /ai-guide/result

- 需要保留：URL searchParams 优先、localStorage fallback、AI reading、credits、idempotency。
- 应该改变：结果页变为 Reading Dossier，降低普通结果页感觉。
- 适合的动效：reading sections 分层显现，card reference 像打开档案附录。

### /ai-guide/readings

- 需要保留：Reading Journal 查询、登录要求、saved readings。
- 应该改变：从列表页变成阅读档案室。
- 适合的动效：档案条目轻微浮入，hover 像翻看档案卡，但不要暗示未实现的打开详情功能。

### future /shop

- 需要保留：与 Ora Arcana Reading Room 同一视觉系统。
- 应该改变：从普通电商页转向实体卡牌品牌页面。
- 适合的动效：产品图轻微视差、卡盒打开、牌背细节展示、购买路径保持清晰。

## 9. Implementation Phases

### P0-10B Visual Foundation Tokens

建立颜色、字体、边框、阴影、材质、动效变量和 Tailwind 使用规范。先定义系统，再改页面。

### P0-10C Reading Room Homepage Redesign

重构 /ai-guide 首页视觉入口，引入牌桌、实体卡牌品牌感和更强的 Ora Arcana 识别。

### P0-10D Online Draw Ritual Animation

优先实现 shuffle / cut / draw 的 2D physical deck motion，让 online draw 成为核心记忆点。

### P0-10E Card Reveal Animation

实现牌背到牌面的 reveal 动效，并适配 mobile 和 reduced motion。

### P0-10F Result / Journal Archive Polish

将 Result 和 Reading Journal 统一成 Reading Dossier / Arcane Archive 体验。

### P0-10G Shop Visual Foundation

为未来 /shop 建立实体卡牌展示、产品图、牌盒、购买 CTA 的视觉基础。

### P0-10H Mobile Performance QA

集中检查移动端性能、动画帧率、点击区域、滚动、reduced motion 和低端设备表现。

## 10. Technical Guardrails

- 不破坏 `/ask` 原生 HTML GET form。
- 不破坏 `/result` URL searchParams 优先逻辑。
- 不破坏 localStorage fallback。
- 不破坏 auth。
- 不破坏 credits。
- 不破坏 redeem。
- 不破坏 activation code。
- 不破坏 Reading Journal 查询。
- 不破坏 upright-only tarot mode。
- 不改 78-card tarot deck structure。
- 不新增大型动画库，除非单独评估体积、性能、维护成本和移动端表现。
- 优先 CSS / Tailwind animation。
- WebGL 只做背景氛围，不做核心流程依赖。
- 移动端性能优先。
- 所有动效必须考虑 reduced motion。
- 不让动画阻塞点击、表单提交或路由。
- 不为了视觉重构改变 API 合约、数据库结构或扣费规则。

## 11. Decision Needed Before Coding

正式开工前需要确认：

- 新主视觉方向是否采用 **Arcane Archive + Ritual Table + Physical Deck Motion**。
- 是否保留当前黑金主色作为基础。
- 是否加入暗木 / 纸张 / 黄铜材质。
- 是否要设计统一 card back。
- Ora mark 是否需要同步设计。
- 洗牌动画先做 2D 还是 3D。
- reveal 动效是否先采用 CSS 3D transform。
- /shop 是否直接纳入同一视觉系统。
- 是否需要真实实体卡牌摄影或 mockup 作为后续视觉资产。
- 移动端是否优先于桌面端验收。
- 是否将 Reading Journal 进一步升级为可打开历史 reading 的 archive experience。
