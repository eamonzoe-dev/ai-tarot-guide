import { readFileSync } from "node:fs";

const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_TABLE_ID,
  FEISHU_APP_TOKEN,
  FEISHU_BASE_ID,
  GITHUB_EVENT_PATH,
  GITHUB_REPOSITORY,
  GITHUB_REF_NAME,
  GITHUB_SHA,
  GITHUB_ACTOR,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL,
} = process.env;

const appToken = FEISHU_APP_TOKEN || FEISHU_BASE_ID;
const FEISHU_FIELD_TYPES = {
  TEXT: 1,
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

requireEnv("FEISHU_APP_ID", FEISHU_APP_ID);
requireEnv("FEISHU_APP_SECRET", FEISHU_APP_SECRET);
requireEnv("FEISHU_TABLE_ID", FEISHU_TABLE_ID);
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
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${FEISHU_TABLE_ID}/fields?page_size=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await readJsonResponse(res, "getting Feishu table fields");
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

function isTextField(field) {
  return field.field_type === FEISHU_FIELD_TYPES.TEXT;
}

function optionNames(field) {
  return new Set((field.property?.options || []).map((option) => option.name));
}

function singleSelectValue(field, value) {
  return optionNames(field).has(value) ? value : undefined;
}

function multiSelectValue(field, value) {
  return optionNames(field).has(value) ? [value] : undefined;
}

function textLikeValue(field, value) {
  if (!value) {
    return undefined;
  }

  if (isTextField(field)) {
    return value;
  }

  if (field.field_type === FEISHU_FIELD_TYPES.SINGLE_SELECT) {
    return singleSelectValue(field, value);
  }

  if (field.field_type === FEISHU_FIELD_TYPES.MULTI_SELECT) {
    return multiSelectValue(field, value);
  }

  return undefined;
}

function dateValue(field, value) {
  return field.field_type === FEISHU_FIELD_TYPES.DATE ? value : undefined;
}

function urlValue(field, url, text) {
  if (!url) {
    return undefined;
  }

  if (field.field_type === FEISHU_FIELD_TYPES.URL) {
    return {
      link: url,
      text: text || url,
    };
  }

  if (isTextField(field)) {
    return url;
  }

  return undefined;
}

function buildFields(existingFields, values) {
  const fieldsByName = new Map(existingFields.map((field) => [field.field_name, field]));
  const fields = {};

  function set(name, valueFactory) {
    const field = fieldsByName.get(name);

    if (!field) {
      return;
    }

    const value = valueFactory(field);
    if (value !== undefined && value !== null && value !== "") {
      fields[name] = value;
    }
  }

  set("日期", (field) => dateValue(field, values.now));
  set("Commit", (field) => textLikeValue(field, values.commitSummary));
  set("AI总结", (field) => textLikeValue(field, values.aiSummary));
  set("GitHub链接", (field) => urlValue(field, values.githubUrl, values.githubLinkText));
  set("备注", (field) => textLikeValue(field, values.note));
  set("分支", (field) => textLikeValue(field, values.branch));
  set("来源", (field) => textLikeValue(field, values.source));

  const fallbackValues = {
    项目: "AI Tarot Guide",
    版本: values.shortSha,
    提交哈希: values.sha,
    提交人: values.actor,
    仓库: values.repository,
    运行链接: values.runUrl,
    提交链接: values.commitUrl,
    状态: values.status,
    记录时间: values.isoTime,
    说明: values.aiSummary,
  };

  for (const [name, value] of Object.entries(fallbackValues)) {
    set(name, (field) => {
      if (name.includes("链接")) {
        return urlValue(field, value, name === "提交链接" ? values.githubLinkText : name);
      }

      if (name === "记录时间") {
        return field.field_type === FEISHU_FIELD_TYPES.DATE ? values.now : textLikeValue(field, value);
      }

      return textLikeValue(field, value);
    });
  }

  return fields;
}

async function createRecord(token, fields) {
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${FEISHU_TABLE_ID}/records`,
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

  const data = await readJsonResponse(res, "creating Feishu record");
  console.log("Feishu record created:", data.data?.record?.record_id || "unknown record id");
}

async function main() {
  const shortSha = GITHUB_SHA ? GITHUB_SHA.slice(0, 7) : "";
  const commitMessage = readCommitMessage().split("\n")[0].trim();
  const runUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
      : "";
  const commitUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_SHA
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`
      : "";
  const githubUrl = commitUrl || runUrl;
  const commitSummary = [shortSha || "unknown", commitMessage].filter(Boolean).join(" - ");
  const aiSummary = commitMessage
    ? `自动记录本次 GitHub commit：${commitMessage}`
    : `自动记录本次 GitHub commit：${shortSha || "unknown"}`;

  const values = {
    actor: GITHUB_ACTOR || "",
    aiSummary,
    branch: GITHUB_REF_NAME || "",
    commitSummary,
    commitUrl,
    githubLinkText: shortSha ? `Commit ${shortSha}` : "GitHub commit",
    githubUrl,
    isoTime: new Date().toISOString(),
    note: "GitHub Actions 自动记录版本日志",
    now: Date.now(),
    repository: GITHUB_REPOSITORY || "",
    runUrl,
    sha: GITHUB_SHA || "",
    shortSha,
    source: "GitHub Actions",
    status: "已自动记录",
  };

  const token = await getTenantAccessToken();
  const tableFields = await getTableFields(token);
  const fields = buildFields(tableFields, values);

  if (Object.keys(fields).length === 0) {
    const existingNames = tableFields.map((field) => field.field_name).join(", ");
    throw new Error(`No matching Feishu fields found. Existing fields: ${existingNames}`);
  }

  await createRecord(token, fields);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
