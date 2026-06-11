import { readFileSync } from "node:fs";

const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_APP_TOKEN,
  FEISHU_BASE_ID,
  FEISHU_PROJECT_BOARD_TABLE_ID,
  GITHUB_EVENT_PATH,
  GITHUB_REPOSITORY,
  GITHUB_REF_NAME,
  GITHUB_SHA,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL,
} = process.env;

const appToken = FEISHU_APP_TOKEN || FEISHU_BASE_ID;
const tableId = FEISHU_PROJECT_BOARD_TABLE_ID;
const FEISHU_FIELD_TYPES = {
  TEXT: 1,
  NUMBER: 2,
  SINGLE_SELECT: 3,
  MULTI_SELECT: 4,
  DATE: 5,
  URL: 15,
};

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

if (!tableId) {
  console.log("FEISHU_PROJECT_BOARD_TABLE_ID is not configured. Skipping project board write.");
  process.exit(0);
}

requireEnv("FEISHU_APP_ID", FEISHU_APP_ID);
requireEnv("FEISHU_APP_SECRET", FEISHU_APP_SECRET);
requireEnv("FEISHU_APP_TOKEN or FEISHU_BASE_ID", appToken);

async function readJsonResponse(res, action) {
  let data;

  try {
    data = await res.json();
  } catch (error) {
    throw new Error(`Failed to parse Feishu response while ${action}: ${error.message}`);
  }

  if (!res.ok || data.code !== 0) {
    throw new Error(`Failed while ${action}: ${JSON.stringify(data)}`);
  }

  return data;
}

async function getTenantAccessToken() {
  const res = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    }
  );

  const data = await readJsonResponse(res, "getting tenant access token");

  if (!data.tenant_access_token) {
    throw new Error(`Feishu response did not include tenant_access_token: ${JSON.stringify(data)}`);
  }

  return data.tenant_access_token;
}

async function getTableFields(token) {
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields?page_size=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await readJsonResponse(res, "getting project board fields");
  return data.data?.items || [];
}

function readCommitMessage() {
  if (!GITHUB_EVENT_PATH) {
    return "";
  }

  try {
    const event = JSON.parse(readFileSync(GITHUB_EVENT_PATH, "utf8"));
    return event.head_commit?.message || "";
  } catch (error) {
    console.warn(`Could not read GitHub event commit message: ${error.message}`);
    return "";
  }
}

function fieldType(field) {
  return field.field_type ?? field.type;
}

function optionNames(field) {
  return new Set((field.property?.options || []).map((option) => option.name));
}

function textOrSelectValue(field, value) {
  if (!value) {
    return undefined;
  }

  const type = fieldType(field);

  if (type === FEISHU_FIELD_TYPES.SINGLE_SELECT) {
    return optionNames(field).has(value) ? value : undefined;
  }

  if (type === FEISHU_FIELD_TYPES.MULTI_SELECT) {
    return optionNames(field).has(value) ? [value] : undefined;
  }

  if (type === FEISHU_FIELD_TYPES.DATE || type === FEISHU_FIELD_TYPES.URL || type === FEISHU_FIELD_TYPES.NUMBER) {
    return undefined;
  }

  return value;
}

function dateValue(field, value) {
  return fieldType(field) === FEISHU_FIELD_TYPES.DATE ? value : undefined;
}

function urlValue(field, url, text) {
  if (!url) {
    return undefined;
  }

  const type = fieldType(field);

  if (type === FEISHU_FIELD_TYPES.URL) {
    return {
      link: url,
      text: text || url,
    };
  }

  if (
    type === FEISHU_FIELD_TYPES.DATE ||
    type === FEISHU_FIELD_TYPES.NUMBER ||
    type === FEISHU_FIELD_TYPES.SINGLE_SELECT ||
    type === FEISHU_FIELD_TYPES.MULTI_SELECT
  ) {
    return undefined;
  }

  return url;
}

function classifyCommit(message) {
  const normalized = message.toLowerCase();

  if (/(feishu|workflow|action|log)/.test(normalized)) {
    return {
      milestone: "M6｜GitHub / Vercel / 飞书自动化",
      parentTask: "M6｜GitHub / Vercel / 飞书自动化",
      module: "自动化",
    };
  }

  if (/(draw|reveal|ask|result|prepare)/.test(normalized)) {
    return {
      milestone: "M4｜在线抽牌流程与移动端稳定性",
      parentTask: "M4｜在线抽牌流程与移动端稳定性",
      module: "页面流程",
    };
  }

  if (/(lang|i18n|nav)/.test(normalized)) {
    return {
      milestone: "M3｜多语言与导航基础",
      parentTask: "M3｜多语言与导航基础",
      module: "多语言",
    };
  }

  if (/(galaxy|background|ui|css)/.test(normalized)) {
    return {
      milestone: "M5｜视觉背景与页面体验",
      parentTask: "M5｜视觉背景与页面体验",
      module: "视觉体验",
    };
  }

  if (/(tarotcards|card|reading)/.test(normalized)) {
    return {
      milestone: "M7｜内容体系与 78 张牌数据库",
      parentTask: "M7｜内容体系与 78 张牌数据库",
      module: "内容数据",
    };
  }

  if (/(deploy|vercel|build)/.test(normalized)) {
    return {
      milestone: "M8｜部署验收与线上稳定",
      parentTask: "M8｜部署验收与线上稳定",
      module: "部署",
    };
  }

  if (/(qr|print|guide card)/.test(normalized)) {
    return {
      milestone: "M9｜实体卡牌 / 引导卡 / 商业化准备",
      parentTask: "M9｜实体卡牌 / 引导卡 / 商业化准备",
      module: "实体产品",
    };
  }

  return {
    milestone: "M0｜项目基础搭建",
    parentTask: "M0｜项目基础搭建",
    module: "项目维护",
  };
}

function getChineseTaskTitle(commitMessage) {
  const normalized = commitMessage.toLowerCase();

  if (normalized.includes("feishu") && normalized.includes("board")) {
    return "新增飞书项目看板自动写入功能";
  }

  if (normalized.includes("feishu") && normalized.includes("log")) {
    return "修复飞书版本日志自动化";
  }

  if (normalized.includes("workflow") || normalized.includes("action")) {
    return "调整 GitHub Actions 自动化流程";
  }

  if (normalized.includes("galaxy") || normalized.includes("background")) {
    return "优化网页视觉背景效果";
  }

  if (/(draw|reveal|ask|result|prepare)/.test(normalized)) {
    return "优化塔罗抽牌流程页面";
  }

  if (/(i18n|lang|nav)/.test(normalized)) {
    return "优化多语言与导航体验";
  }

  if (/(deploy|vercel|build)/.test(normalized)) {
    return "调整部署与构建配置";
  }

  if (/(card|tarotcards|reading)/.test(normalized)) {
    return "优化塔罗牌数据与解读内容";
  }

  const firstWord = normalized.match(/^[a-z]+/)?.[0];
  const verbPrefixes = {
    add: "新增",
    cleanup: "清理",
    fix: "修复",
    improve: "优化",
    map: "调整",
    polish: "优化",
    refactor: "重构",
    remove: "移除",
    repair: "修复",
    update: "更新",
  };

  return firstWord && verbPrefixes[firstWord]
    ? `${verbPrefixes[firstWord]}项目功能`
    : "项目维护更新";
}

function buildRecordFields(existingFields, values) {
  const fieldsByName = new Map(existingFields.map((field) => [field.field_name, field]));
  const recordFields = {};

  function set(name, valueFactory) {
    const field = fieldsByName.get(name);

    if (!field) {
      return;
    }

    const value = valueFactory(field);
    if (value !== undefined && value !== null && value !== "") {
      recordFields[name] = value;
    }
  }

  set("里程碑", (field) => textOrSelectValue(field, values.milestone));
  set("任务编号", (field) => textOrSelectValue(field, values.taskNumber));
  set("父级任务", (field) => textOrSelectValue(field, values.parentTask));
  set("任务名称", (field) => textOrSelectValue(field, values.taskName));
  set("任务层级", (field) => textOrSelectValue(field, values.taskLevel));
  set("状态", (field) => textOrSelectValue(field, values.status));
  set("优先级", (field) => textOrSelectValue(field, values.priority));
  set("模块", (field) => textOrSelectValue(field, values.module));
  set("来源", (field) => textOrSelectValue(field, values.source));
  set("日期", (field) => dateValue(field, values.now));
  set("Commit", (field) => textOrSelectValue(field, values.commitSummary));
  set("GitHub链接", (field) => urlValue(field, values.githubUrl, values.githubLinkText));
  set("分支", (field) => textOrSelectValue(field, values.branch));
  set("验收结果", (field) => textOrSelectValue(field, values.acceptance));
  set("备注", (field) => textOrSelectValue(field, values.note));

  return recordFields;
}

async function createRecord(token, fields) {
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields,
      }),
    }
  );

  const data = await readJsonResponse(res, "creating project board task");
  console.log("Project board task created:", data.data?.record?.record_id || "unknown record id");
}

async function main() {
  const shortSha = GITHUB_SHA ? GITHUB_SHA.slice(0, 7) : "";
  const commitMessage = readCommitMessage().split("\n")[0].trim() || `Commit ${shortSha || "unknown"}`;
  const commitUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_SHA
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`
      : "";
  const runUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
      : "";
  const githubUrl = commitUrl || runUrl;
  const classification = classifyCommit(commitMessage);
  const taskTitle = getChineseTaskTitle(commitMessage);
  const values = {
    acceptance: "未验收",
    branch: GITHUB_REF_NAME || "",
    commitSummary: [shortSha || "unknown", commitMessage].filter(Boolean).join(" - "),
    githubLinkText: shortSha ? `Commit ${shortSha}` : "GitHub commit",
    githubUrl,
    module: classification.module,
    milestone: classification.milestone,
    note: `原始提交信息：${commitMessage}。GitHub Actions 自动创建，待人工验收。`,
    now: Date.now(),
    parentTask: classification.parentTask,
    priority: "中",
    source: "GitHub Actions",
    status: "待验收",
    taskLevel: "子任务",
    taskName: taskTitle,
    taskNumber: `AUTO-${shortSha || "unknown"}`,
  };

  const token = await getTenantAccessToken();
  const fields = await getTableFields(token);
  console.log("Project board fields:", fields.map((field) => ({ name: field.field_name, type: field.type })));

  const recordFields = buildRecordFields(fields, values);

  if (Object.keys(recordFields).length === 0) {
    const existingNames = fields.map((field) => field.field_name).join(", ");
    throw new Error(`No writable project board fields found. Existing fields: ${existingNames}`);
  }

  await createRecord(token, recordFields);
}

main().catch((error) => {
  console.error("Failed to write Feishu project board task:", error);
  process.exit(1);
});
