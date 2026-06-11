const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_TABLE_ID,
  FEISHU_APP_TOKEN,
  FEISHU_BASE_ID,
  GITHUB_REPOSITORY,
  GITHUB_REF_NAME,
  GITHUB_SHA,
  GITHUB_ACTOR,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL,
} = process.env;

const appToken = FEISHU_APP_TOKEN || FEISHU_BASE_ID;

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

function pickExistingFields(existingFields, candidateValues) {
  const existingNames = new Set(existingFields.map((field) => field.field_name));
  const fields = {};

  for (const [name, value] of Object.entries(candidateValues)) {
    if (existingNames.has(name) && value !== undefined && value !== null && value !== "") {
      fields[name] = value;
    }
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
  const runUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
      : "";
  const commitUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_SHA
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`
      : "";

  const candidateValues = {
    项目: "AI Tarot Guide",
    版本: shortSha,
    提交哈希: GITHUB_SHA || "",
    分支: GITHUB_REF_NAME || "",
    提交人: GITHUB_ACTOR || "",
    仓库: GITHUB_REPOSITORY || "",
    运行链接: runUrl,
    提交链接: commitUrl,
    状态: "已自动记录",
    记录时间: new Date().toISOString(),
    说明: `GitHub Actions 自动记录版本：${shortSha || "unknown"}`,
  };

  const token = await getTenantAccessToken();
  const tableFields = await getTableFields(token);
  const fields = pickExistingFields(tableFields, candidateValues);

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
