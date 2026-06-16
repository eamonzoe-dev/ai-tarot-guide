# P0-17 SEO / Launch Checklist

- Status: Draft / Pre-launch checklist
- Owner: eamonzoe
- Last updated: 2026-06-17
- Scope: SEO, indexing, launch readiness, QA notes

## 当前项目状态

- 项目名：Ora Arcana / AI Tarot Guide
- 当前主要入口：`/ai-guide`
- 当前上线地址：`https://ai-tarot-guide.vercel.app/ai-guide`
- 当前核心流程：Home -> Prepare -> Ask -> Draw/Reveal -> Result -> Reading Journal / Account
- 当前登录方式：Email Magic Link
- Google / Apple 登录：目前只是 UI preview，未接 OAuth

## SEO 当前策略

- 上线前可以保持 `noindex` / `nofollow` 保护，避免测试内容或未完成页面被搜索引擎收录。
- 正式开放收录前，必须确认所有公开页面的 `noindex` 已移除。
- 正式开放收录前，必须确认 Vercel Protection、`robots.txt`、middleware / proxy、headers 没有阻止搜索引擎访问。
- 记录：目前 `src/proxy.ts` 曾用于处理 robots header / 访问保护，上线前必须重点复查。
- 在未完成完整 QA 前，不应假设当前站点已经适合提交给搜索引擎收录。

## 当前索引与访问保护记录

- 当前开发期曾启用整站访问锁，相关 Vercel 环境变量包括：
  - `SITE_LOCK_ENABLED`
  - `SITE_LOCK_USERNAME`
  - `SITE_LOCK_PASSWORD`
- `src/proxy.ts` 曾用于处理 Basic Auth / robots header / 访问保护，上线前必须复查。
- `next.config.ts` 曾配置全站 `X-Robots-Tag: noindex, nofollow`，正式开放收录前必须确认已移除。
- Google Search Console 已验证 `oraarcana.com`。
- Google 曾收录过 `http://oraarcana.com/` 首页，需确认最终只保留正式 HTTPS 主域名。
- `/ai-guide`、`/ai-guide/ask`、`/ai-guide/result` 当前未明显被 Google 收录。
- `ai-tarot-guide.vercel.app` 当前不应作为正式索引域名。
- Search Console 中如有临时移除记录，正式开放收录前需要确认状态和影响。

## 正式开放收录前检查

- [ ] `robots.txt` 可访问，且没有错误阻止目标页面。
- [ ] `sitemap.xml` 可访问，且只包含计划公开收录的页面。
- [ ] canonical URL 已确认，避免 Vercel 临时域名、重复语言参数或错误路径成为主索引地址。
- [ ] 主要页面的 title / description 已确认。
- [ ] Open Graph / Twitter Card 已确认。
- [ ] favicon / icon / metadata 已确认。
- [ ] `lang=en|zh` 页面策略已确认，语言切换和索引策略没有冲突。
- [ ] `/privacy`、`/terms`、`/disclaimer`、`/contact` 页面可访问。
- [ ] AI / entertainment disclaimer 清晰可见，避免用户误解为医疗、法律、金融或确定性预测服务。
- [ ] 首页无明显英文/中文错乱。
- [ ] 登录弹窗不阻挡主要内容，不影响未登录用户浏览核心入口。
- [ ] 主要 CTA 可点击，并能进入预期流程。
- [ ] mobile Safari 检查通过。
- [ ] mobile Chrome 检查通过。
- [ ] Vercel Production Ready 状态已确认。
- [ ] GitHub `main` clean 状态已确认。
- [ ] Vercel Protection / robots / middleware / headers 已逐项复查，确认不会阻止计划公开收录的页面。

## 不应该立刻做的事

- 不接 Stripe。
- 不接真实 Google / Apple OAuth。
- 不做复杂会员后端。
- 不急着开放搜索引擎收录。
- 不把测试站在还没检查时提交到 Google Search Console。

## 上线前手动 QA URL

- `/ai-guide?lang=en`
- `/ai-guide?lang=zh`
- `/ai-guide/prepare?lang=en`
- `/ai-guide/prepare?lang=zh`
- `/ai-guide/ask?lang=en`
- `/ai-guide/ask?lang=zh`
- `/privacy`
- `/terms`
- `/disclaimer`
- `/contact`

## Release checklist

- [ ] Build passes
- [ ] Vercel Ready
- [ ] Home page EN/ZH checked
- [ ] Auth modal checked
- [ ] Online reading flow checked
- [ ] Physical deck flow checked
- [ ] Result page checked
- [ ] Reading Journal checked
- [ ] Account / credits / redeem checked
- [ ] Legal pages checked
- [ ] noindex strategy confirmed
- [ ] Search Console decision made
