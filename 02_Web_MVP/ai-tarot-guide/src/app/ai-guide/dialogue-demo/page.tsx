import { PageContainer } from "@/components/ai-guide/PageContainer";
import { PreDrawDialoguePrototype } from "@/components/ai-guide/PreDrawDialoguePrototype";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

export default async function DialogueDemoPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = normalizeLanguage(langParam);

  return (
    <PageContainer
      eyebrow="Internal Prototype"
      title={
        lang === "zh"
          ? "Ora Reflection Dialogue Prototype"
          : "Ora Reflection Dialogue Prototype"
      }
      description={
        lang === "zh"
          ? "这个内部 prototype 用来探索先对话再抽牌：把一个模糊问题收束成更具体的 reflection signal。"
          : "This internal prototype explores the pre-draw dialogue that helps turn a vague question into a more specific reflective signal."
      }
    >
      <PreDrawDialoguePrototype lang={lang} />
    </PageContainer>
  );
}
