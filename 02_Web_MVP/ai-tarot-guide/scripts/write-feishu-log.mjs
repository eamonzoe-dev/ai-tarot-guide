const {
  FEISHU_APP_ID,
  FEISHU_APP_SECRET,
  FEISHU_APP_TOKEN,
  FEISHU_TABLE_ID,
  GITHUB_SHA,
  GITHUB_REF_NAME,
  GITHUB_REPOSITORY,
} = process.env;

const commit = GITHUB_SHA?.slice(0, 7) || "unknown";
const githubUrl = `https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`;

async function getTenantToken() {
  const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET,
    }),
  });

  const data = await res.json();
  if (!data.tenant_access_token) throw new Error(JSON.stringify(data));
  return data.tenant_access_token;
}

async function createRecord(token) {
  const res = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`,
    {
      method: "POST",
      headers: {
        Au        Au        Au        Au        Au Content-Ty        Au     on        Au    },
                .stringi             fields                              .),                .stco                AI                .stringi             fields        t}                .stringi             fields                              .),    rl,
          },
          鏄惁宸查          鏄惁宸查          鏄惁宸查          鏄惁宸查          鏄惁宸查      姩",
                                                                               .j                         =                      ON.stringify(data));
  console.log("Feishu re  consreated:", data.data.record.record_id);
}



console.log("Feishu re  consreated:", data.data.record.recen);
