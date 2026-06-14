# Ora Arcana Visual Direction Candidate Board

## 1. Purpose

本文件用于在正式改代码前确认 Ora Arcana 的新视觉方向。

这不是单纯换色，也不是只更换背景图。Ora Arcana 的下一轮视觉重构需要支持一个完整产品系统：

- 实体卡牌品牌
- AI Reading Room
- Reading Journal
- 未来 /shop
- Ritual Motion System

因此，视觉方向必须同时回答几个问题：用户进入 Reading Room 时看到什么，抽牌时如何感到仪式，AI Tarot Interpreter 如何被感知，阅读记录如何成为档案，实体卡牌未来如何进入销售页面。

本候选板用于比较三个方向，并给出推荐融合方案，避免后续直接进入代码时只做局部美化。

## 2. Candidate A: Arcane Archive

描述：暗色档案馆、旧纸、黄铜、暗木、阅读记录、安静高级。

### Core feeling

像进入一间安静的神秘档案馆。Reading Journal、Result、Account、Shop 信息都被妥善归档。整体是成熟、克制、可信任的高级感。

### Keywords

- Arcane Archive
- Reading Dossier
- Aged Paper
- Dark Walnut
- Brass Lines
- Saved Readings
- Quiet Record
- Interpretation Archive

### Color direction

- Ink Black / Deep Black
- Dark Walnut / Charcoal Brown
- Aged Brass / Muted Gold
- Warm Parchment
- Dusty Bronze
- Low-contrast Gray

色彩整体偏深，少量暖金与纸张色作为信息层级和重点。

### Material direction

- 暗木桌面
- 旧纸、档案卡、标签
- 黄铜细线
- 轻微磨损边缘
- 书页、档案夹、阅读记录感

### Best pages

- `/ai-guide homepage`
- `/ai-guide/result`
- `/ai-guide/readings`
- Reading Account
- future `/shop`

### Motion fit

适合慢速、克制、档案式动效：

- 档案卡轻微浮入
- section 逐层显现
- 标签或边线微亮
- 保存到 Journal 时出现小型 archive stamp

不适合承担洗牌、切牌这种核心实体动作，它更适合作为结构和氛围。

### Strengths

- 高级感稳定
- 与 Reading Journal 非常适配
- 有利于建立长期品牌系统
- 适合实体卡牌和未来 shop
- 不容易显得廉价或过度娱乐化

### Risks

- 如果太暗，可能显得沉重。
- 如果只做 archive，抽牌流程会缺少动态和仪式参与感。
- 如果纸张和黄铜用得太多，可能变成复古模板。

### Role in final system

**Arcane Archive 是主骨架。**

它适合首页、result、journal、account、shop 的信息结构。最终系统应以它作为页面容器、阅读档案、信息层级和品牌稳定性的基础。

## 3. Candidate B: Ritual Table

描述：牌桌、洗牌、切牌、抽牌、翻牌、仪式路径、实体卡动作。

### Core feeling

像用户坐到一张安静的牌桌前，亲手完成准备、提问、洗牌、切牌、抽牌、翻牌。重点是参与感和实体动作。

### Keywords

- Ritual Table
- Physical Deck
- Shuffle
- Cut
- Draw
- Reveal
- Tactile Motion
- Card Handling

### Color direction

- Deep Table Black
- Dark Wood Brown
- Candle Glow
- Muted Gold
- Card Shadow
- Low Warm Light

颜色服务牌桌和卡牌动作，不应抢走卡牌本身。

### Material direction

- 暗木牌桌
- 纸牌边缘
- 牌背纹理
- 轻微桌面阴影
- 手感式 hover / press
- 卡堆厚度与层叠

### Best pages

- `/ai-guide/prepare`
- `/ai-guide/ask`
- `/ai-guide/draw`
- `/ai-guide/reveal`

### Motion fit

这是动效最强的候选方向：

- shuffle
- cut
- draw
- reveal
- card stack movement
- tactile button press
- table glow on focus

### Strengths

- 最能形成记忆点
- 最贴近 tarot reading 的真实体验
- 能让 Online Draw 不再像随机工具
- 能为实体卡牌品牌建立强连接

### Risks

- 如果动效过度，会变成游戏抽卡。
- 如果动画太复杂，移动端性能会受影响。
- 如果没有节奏控制，会影响用户完成 reading。

### Role in final system

**Ritual Table 是交互灵魂。**

它重点服务 prepare、ask、draw、reveal。最终系统需要用它定义核心流程的动作语言，但不应该把所有页面都做成强交互牌桌。

## 4. Candidate C: Luminous Sacred Geometry

描述：骨白、珍珠灰、香槟金、神圣几何、柔光、月相、启示感。这个方向来自用户最新参考图。

### Core feeling

更明亮、更神圣、更轻盈。像月光、珍珠、香槟金线、圆形星图和神圣几何组成的仪式高光层。它带来启示感和品牌记忆点。

### Keywords

- Luminous Sacred Geometry
- Bone White
- Pearl Gray
- Champagne Gold
- Moon Phase
- Sacred Lines
- Soft Glow
- Oracle-like Light, but tarot-grounded

### Color direction

- Bone White
- Pearl Gray
- Champagne Gold
- Soft Ivory
- Pale Moonlight
- Warm Highlight
- Low-opacity Gold Lines

它不应完全替代暗色系统，而应作为仪式高光和产品展示层。

### Material direction

- 骨白纸面
- 香槟金细线
- 珍珠光泽
- 月相图形
- 低透明神圣几何
- 牌背烫金线条
- 产品包装高光

### Best pages

- `/ai-guide/prepare`
- `/ai-guide/reveal`
- card back
- future `/shop`
- 关键仪式瞬间
- 首页局部 high point

### Motion fit

适合慢速、轻柔、仪式高光动效：

- 月相线条缓慢显现
- 几何圆弧低透明转动
- reveal 时柔光扩散
- card back 细线微亮
- shop 产品图细节光

### Strengths

- 视觉记忆点强
- 能让品牌更精致、更有仪式感
- 适合实体卡牌包装、card back、shop 产品视觉
- 能平衡当前过暗的体验

### Risks

- 如果整站完全白金化，会削弱 Reading Room 的沉浸感。
- 容易变成泛灵性疗愈海报站。
- 可能偏离专业 tarot reading，变得像 oracle / healing brand。
- 过多柔光会影响文本可读性。

### Role in final system

**Luminous Sacred Geometry 适合做仪式高光层，但不建议整站完全白金化。**

它不应该让 Ora Arcana 变成泛灵性疗愈海报站。更合理的使用方式是：用于 prepare、reveal、card back、shop 产品视觉和关键仪式瞬间，在深色 Reading Room 和实体牌桌系统上提供亮点。

## 5. Candidate Comparison Table

| 维度 | Candidate A: Arcane Archive | Candidate B: Ritual Table | Candidate C: Luminous Sacred Geometry |
| --- | --- | --- | --- |
| 品牌高级感 | 高，稳定克制 | 中高，取决于材质细节 | 高，但容易偏柔美 |
| 塔罗专业感 | 高，适合 reading dossier | 高，贴近真实抽牌流程 | 中高，需避免 oracle / healing 化 |
| AI Interpreter 适配 | 高，像被整理的 interpretation archive | 中，更多服务流程动作 | 中，适合 Ora 的仪式高光但不适合全部 AI 文本 |
| 实体卡适配 | 高，适合包装和档案系统 | 很高，直接模拟实体卡动作 | 很高，适合 card back 和包装高光 |
| Reading Journal 适配 | 很高 | 中 | 中，适合少量高光 |
| 洗牌抽牌动效适配 | 中 | 很高 | 中高，适合 reveal 高光 |
| /shop 适配 | 高 | 中高，适合产品互动 | 很高，适合产品视觉和高级感 |
| 移动端稳定性 | 高 | 中，需控制动画复杂度 | 中高，需控制 glow 和透明层 |
| 视觉记忆点 | 中高 | 高 | 很高 |
| 开发难度 | 中 | 高 | 中高 |

## 6. Recommended Final Direction

推荐最终融合方向：

**Luminous Ritual Archive**

公式：

```text
Dark Reading Room
+ Tactile Card Table
+ Luminous Sacred Geometry
+ Archive Dossier System
```

说明：

- 主系统：**Arcane Archive**
- 核心交互：**Ritual Table**
- 仪式高光：**Luminous Sacred Geometry**

最终方向不应是纯黑金，也不应是纯白金。更合理的组合是：深色 Reading Room 作为场域，实体牌桌作为操作中心，白金神圣几何作为仪式瞬间和卡牌品牌识别，Reading Dossier / Reading Journal 作为信息组织方式。

## 7. Page-by-page Visual Mix

### /ai-guide homepage

- 风格比例：Arcane Archive 55% / Luminous Sacred Geometry 25% / Ritual Table 20%
- 应保留：Ora Arcana、Reading Room、Physical Deck / Online Draw、Reading Account。
- 应改变：减少泛星空背景，加入牌桌、卡背、黄铜线、骨白几何高光。
- 适合的动效：页面进入时桌面微亮，几何线条低透明显现，入口卡轻微 hover。

### /ai-guide/prepare

- 风格比例：Luminous Sacred Geometry 45% / Ritual Table 35% / Arcane Archive 20%
- 应保留：center before asking 的暂停感。
- 应改变：更像仪式前的安静聚焦，而不是说明页面。
- 适合的动效：月相或圆弧细线缓慢显现，呼吸式柔光，低强度 focus ring。

### /ai-guide/ask

- 风格比例：Ritual Table 40% / Arcane Archive 40% / Luminous Sacred Geometry 20%
- 应保留：native HTML GET form。
- 应改变：输入区像放在牌桌上的纸笺或档案卡。
- 适合的动效：输入 focus 时香槟金边线微亮，提交时纸笺轻微下沉。

### /ai-guide/draw

- 风格比例：Ritual Table 65% / Luminous Sacred Geometry 20% / Arcane Archive 15%
- 应保留：shuffle、cut、draw 步骤。
- 应改变：从按钮式步骤升级为实体卡牌动作。
- 适合的动效：2D 牌堆 shuffle、cut、draw，牌背有统一视觉符号，桌面阴影随动作变化。

### /ai-guide/reveal

- 风格比例：Ritual Table 45% / Luminous Sacred Geometry 40% / Arcane Archive 15%
- 应保留：reveal 的清晰状态和 physical / online 逻辑。
- 应改变：让牌背到牌面的翻转成为仪式高光。
- 适合的动效：card flip、月相线轻亮、柔光扩散后快速收敛，避免强闪光。

### /ai-guide/result

- 风格比例：Arcane Archive 65% / Luminous Sacred Geometry 20% / Ritual Table 15%
- 应保留：URL-first result logic、AI reading、credits、card reference。
- 应改变：从结果页变成 Reading Dossier。
- 适合的动效：段落淡入、section 分层显现、card reference 像打开档案附录。

### /ai-guide/readings

- 风格比例：Arcane Archive 75% / Luminous Sacred Geometry 15% / Ritual Table 10%
- 应保留：saved readings、server auth check、journal 查询。
- 应改变：从列表感转成 archive shelf / reading file。
- 适合的动效：档案卡轻微浮入，hover 边线微亮，不暗示未实现的打开详情功能。

### future /shop

- 风格比例：Luminous Sacred Geometry 40% / Arcane Archive 35% / Ritual Table 25%
- 应保留：Ora Arcana 与 Reading Room 同一品牌系统。
- 应改变：建立实体卡牌、包装、card back、产品材质的主视觉。
- 适合的动效：产品图柔光、卡盒轻微展开、牌背细线微亮、购买 CTA 保持稳定清晰。

## 8. Motion Implications

最终方向下的动效应服务 Luminous Ritual Archive：

### 背景动效

- 慢速几何线
- 微弱光点
- 低透明圆弧
- 柔和桌面光
- 小幅 opacity / transform

背景动效只提供氛围，不抢占主要阅读内容。

### 按钮动效

- 边线微亮
- 轻微下压
- focus 细线环
- hover 时黄铜或香槟金光泽轻微增强

按钮不应有大幅位移或强发光。

### 卡牌动效

- shuffle
- cut
- draw
- reveal
- save to journal

卡牌动效是核心记忆点，应优先保证手感和清晰步骤。首版优先 2D physical deck motion，不把复杂 3D 作为必要依赖。

### 文本动效

- 段落淡入
- section 轻微上移
- dossier 内容按层级出现

不使用廉价打字机效果。Ora 的感觉应是正在整理和解读，而不是机器逐字输出。

## 9. Visual Guardrails

明确不要做：

- 纯白整站
- 过度女性疗愈风
- 大量羽毛花瓣
- Web3 霓虹星盘风
- 过度粒子
- 强闪光 reveal
- 复杂 3D 作为首版核心
- 牺牲移动端性能
- 牺牲可读性
- 把 tarot reading 做成抽奖游戏
- 把 Ora 包装成真实预言者或 psychic
- 用视觉暗示 guaranteed prediction

## 10. Next Implementation Step

下一步是：

**P0-10B Visual Foundation Tokens**

P0-10B 才开始改代码，目标包括：

- 全局色彩 token
- surface 样式
- border 样式
- glow 样式
- card back 基础样式
- motion keyframes 基础变量
- reduced motion 基础规则
- mobile-safe animation 原则

P0-10B 不应该直接大改所有页面，也不应该触碰业务逻辑。它只建立视觉和动效基础，让后续 P0-10C、P0-10D、P0-10E 可以在同一系统下推进。
