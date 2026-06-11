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

async function getTenantAccessToken() {
  const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET,
    }),
  });

  const data = await res.json()  const data = await res.json()  const daata.tenant  const doken) {
  const data = rror(`  const data = rnan  const data =: ${JS  const data = ta)  const data = rrn da  const datccess_to  cons

async async as getTablasync async as {
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${FEISHU_TABLE_ID}/fields?page_size=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok || data.code !== 0) {
    throw new Error(`Failed to get table fields: ${JSON.stringify(data)}`);
  }

  return data.data.items ||  return data.dn pickExistingFields(existingFields, candidateValues) {
  const existingNames = new Set(existingFields.map((field) => field.field_name));
  const result = {};

  for (const [name, value] of Object.entries(candidateValues)) {
    if (existingNames.has(name) && value !== undefined && value !== null && value !== "") {
                                    }

  return result;
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
    }
  const data = await res.json();

  if (!res.ok || data.code !== 0) {
    throw new Error(`Failed to create     th record: ${JSON.stringify(data)}`);
  }

  console.log("Feishu record created:", data.data.record.record_id);
}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}} runUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
      : "";

  const candidateValues = {
    "项目": "AI Tarot Guide",
    "版本": shortSha,
    "提交哈�    "提UB_SHA || "",
    "分支": GITHUB_REF_NAME || "",
    "提交人": GITHUB_ACTOR || "",
    "仓库": GITHUB_REPOSITORY ||     "仓庿�行链接": runUrl,
    "状态": "已自动记录",
    "记录时间": new Date().toISOString(),
    "说明": `GitHub Actions 自动记录版本：${shortSha}`,
  };

  const  const  const  etTenantAccessToken();
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
