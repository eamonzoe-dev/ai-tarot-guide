const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_APP_TOKEN,
  FEISHU_BASE_ID,
  FEISHU_PROJECT_LOG_TABLE_ID,
  FEISHU_PROJECT_LOG_DRY_RUN,
  GITHUB_ACTOR,
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
  GITHUB_SERVER_URL,
  PROJECT_LOG_TITLE,
  PROJECT_LOG_CATEGORY,
  PROJECT_LOG_STATUS,
  PROJECT_LOG_PRIORITY,
  PROJECT_LOG_SUMMARY,
  PROJECT_LOG_NEXT_STEP,
  PROJECT_LOG_NOTE,
} = process.env;

const appToken = FEISHU_APP_TOKEN || FEISHU_BASE_ID;
const tableId = FEISHU_PROJECT_LOG_TABLE_ID;
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

function requiredInput(name, value) {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`Missing required project log input: ${name}`);
  }

  return normalized;
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

  if (
    type === FEISHU_FIELD_TYPES.DATE ||
    type === FEISHU_FIELD_TYPES.NUMBER ||
    type === FEISHU_FIELD_TYPES.URL
  ) {
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
    },
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
    },
  );

  const data = await readJsonResponse(res, "getting project log fields");
  return data.data?.items || [];
}

function setFirstMatchingField(recordFields, fieldsByName, mappingRows, valueFactory) {
  const matchedNames = [];

  for (const fieldName of mappingRows) {
    const field = fieldsByName.get(fieldName);

    if (!field) {
      continue;
    }

    const value = valueFactory(field);

    if (value !== undefined && value !== null && value !== "") {
      recordFields[fieldName] = value;
      matchedNames.push(fieldName);
      break;
    }
  }

  return matchedNames;
}

function appendUnmappedNote(baseNote, unmappedValues) {
  const extras = Object.entries(unmappedValues)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);

  return [baseNote, extras.length ? `Unmapped fields:\n${extras.join("\n")}` : ""]
    .filter(Boolean)
    .join("\n\n");
}

function buildRecordFields(existingFields, values) {
  const fieldsByName = new Map(existingFields.map((field) => [field.field_name, field]));
  const recordFields = {};
  const mapped = new Set();

  function mapValue(key, fieldNames, valueFactory) {
    const matched = setFirstMatchingField(recordFields, fieldsByName, fieldNames, valueFactory);

    if (matched.length > 0) {
      mapped.add(key);
    }
  }

  mapValue("title", ["标题", "Title", "阶段标题", "记录标题", "任务名称", "浠诲姟鍚嶇О"], (field) =>
    textOrSelectValue(field, values.title),
  );
  mapValue("category", ["分类", "Category", "类型", "阶段分类", "模块", "妯″潡"], (field) =>
    textOrSelectValue(field, values.category),
  );
  mapValue("status", ["状态", "Status", "进度", "鐘舵€?"], (field) =>
    textOrSelectValue(field, values.status),
  );
  mapValue("priority", ["优先级", "Priority", "浼樺厛绾?"], (field) =>
    textOrSelectValue(field, values.priority),
  );
  mapValue("summary", ["摘要", "Summary", "阶段摘要", "AI总结", "AI鎬荤粨", "说明", "璇存槑"], (field) =>
    textOrSelectValue(field, values.summary),
  );
  mapValue("nextStep", ["下一步", "Next Step", "Next step", "后续行动", "Action", "楠屾敹缁撴灉"], (field) =>
    textOrSelectValue(field, values.nextStep),
  );
  mapValue("source", ["来源", "Source", "鏉ユ簮"], (field) =>
    textOrSelectValue(field, values.source),
  );
  mapValue("date", ["日期", "Date", "创建时间", "记录时间", "鏃ユ湡", "璁板綍鏃堕棿"], (field) =>
    dateValue(field, values.now),
  );
  mapValue("runUrl", ["GitHub链接", "GitHub Link", "GitHub閾炬帴", "运行链接", "杩愯閾炬帴"], (field) =>
    urlValue(field, values.runUrl, "GitHub Actions run"),
  );

  const note = appendUnmappedNote(values.note, {
    title: mapped.has("title") ? "" : values.title,
    category: mapped.has("category") ? "" : values.category,
    status: mapped.has("status") ? "" : values.status,
    priority: mapped.has("priority") ? "" : values.priority,
    summary: mapped.has("summary") ? "" : values.summary,
    next_step: mapped.has("nextStep") ? "" : values.nextStep,
    source: mapped.has("source") ? "" : values.source,
    run_url: mapped.has("runUrl") ? "" : values.runUrl,
  });

  mapValue("note", ["备注", "Note", "澶囨敞"], (field) =>
    textOrSelectValue(field, note),
  );

  return {
    fields: recordFields,
    mappedKeys: [...mapped],
  };
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
    },
  );

  const data = await readJsonResponse(res, "creating project log record");
  console.log("Project log record created:", data.data?.record?.record_id || "unknown record id");
}

async function main() {
  const runUrl =
    GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID
      ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
      : "";
  const values = {
    title: requiredInput("title", PROJECT_LOG_TITLE),
    category: requiredInput("category", PROJECT_LOG_CATEGORY),
    status: requiredInput("status", PROJECT_LOG_STATUS),
    priority: requiredInput("priority", PROJECT_LOG_PRIORITY),
    summary: requiredInput("summary", PROJECT_LOG_SUMMARY),
    nextStep: PROJECT_LOG_NEXT_STEP?.trim() || "",
    note: PROJECT_LOG_NOTE?.trim() || "",
    now: Date.now(),
    runUrl,
    source: "GitHub Actions Manual",
    actor: GITHUB_ACTOR || "",
  };

  if (values.actor) {
    values.note = [values.note, `Triggered by: ${values.actor}`].filter(Boolean).join("\n");
  }

  if (FEISHU_PROJECT_LOG_DRY_RUN === "1" || FEISHU_PROJECT_LOG_DRY_RUN === "true") {
    console.log("Project log dry-run input:", values);
    return;
  }

  requireEnv("FEISHU_APP_ID", FEISHU_APP_ID);
  requireEnv("FEISHU_APP_SECRET", FEISHU_APP_SECRET);
  requireEnv("FEISHU_APP_TOKEN or FEISHU_BASE_ID", appToken);
  requireEnv("FEISHU_PROJECT_LOG_TABLE_ID", tableId);

  const token = await getTenantAccessToken();
  const fields = await getTableFields(token);
  console.log("Project log fields:", fields.map((field) => ({ name: field.field_name, type: field.type })));

  const { fields: recordFields, mappedKeys } = buildRecordFields(fields, values);
  console.log("Project log mapped keys:", mappedKeys);
  console.log("Project log record fields:", recordFields);

  if (Object.keys(recordFields).length === 0) {
    const existingNames = fields.map((field) => field.field_name).join(", ");
    throw new Error(`No writable project log fields found. Existing fields: ${existingNames}`);
  }

  await createRecord(token, recordFields);
}

main().catch((error) => {
  console.error("Failed to write Feishu project log:", error);
  process.exit(1);
});
