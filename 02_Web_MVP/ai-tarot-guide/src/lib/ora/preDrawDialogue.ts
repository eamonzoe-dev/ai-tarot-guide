import type { MicroSlice } from "./microSliceBank";

export type SurfaceScenario =
  | "confusion"
  | "relationship_waiting"
  | "project_continue"
  | "self_sensitivity";

export type DialogueOption = {
  id: string;
  labelZh: string;
  labelEn: string;
  anchorHints: string[];
  selectedState: string;
  candidateStateKey: string;
};

export type DialogueStep = {
  id: string;
  questionZh: string;
  questionEn: string;
  options: DialogueOption[];
};

export type DialogueState = {
  surfaceQuestion: string;
  scenario: SurfaceScenario;
  firstOptionId?: string;
  secondOptionId?: string;
};

export type PreDrawDialogueResult = {
  scenario: SurfaceScenario;
  selectedState: string;
  candidateStateKey: string;
  anchorHints: string[];
  exactAnchors: string[];
  finalReflectiveQuestionZh: string;
  finalReflectiveQuestionEn: string;
  matchedMicroSlices: MicroSlice[];
};

type DialogueBranch = {
  secondStep: DialogueStep;
  finalBySecondOption: Record<
    string,
    {
      selectedState: string;
      candidateStateKey: string;
      anchorHints: string[];
      finalReflectiveQuestionZh: string;
      finalReflectiveQuestionEn: string;
    }
  >;
};

type DialogueScenarioDefinition = {
  id: SurfaceScenario;
  keywordHints: string[];
  initialStep: DialogueStep;
  branches: Record<string, DialogueBranch>;
};

export const preDrawDialogueScenarios: readonly DialogueScenarioDefinition[] = [
  {
    id: "confusion",
    keywordHints: ["迷茫", "confused", "lost", "不知道", "unclear"],
    initialStep: {
      id: "confusion_initial",
      questionZh:
        "这种迷茫更像是想太多睡不下，还是白天看起来正常，但一停下来就空掉？",
      questionEn:
        "Does this confusion feel more like thinking too much to sleep, or like seeming normal in the day but feeling empty when things get quiet?",
      options: [
        {
          id: "too_much_at_night",
          labelZh: "想太多睡不下",
          labelEn: "Thinking too much to sleep",
          anchorHints: ["想太多", "睡不下", "晚上"],
          selectedState: "late night rumination",
          candidateStateKey: "late_night_rumination",
        },
        {
          id: "empty_when_quiet",
          labelZh: "一停下来就空掉",
          labelEn: "Feeling empty when things get quiet",
          anchorHints: ["一停下来", "空掉", "安静"],
          selectedState: "quiet after social or performance",
          candidateStateKey: "quiet_after_social",
        },
      ],
    },
    branches: {
      too_much_at_night: {
        secondStep: {
          id: "confusion_night_second",
          questionZh: "那些想法更像是在推演未来，还是在翻旧决定有没有选错？",
          questionEn:
            "Do those thoughts feel more like rehearsing the future, or replaying an old decision and asking whether it was wrong?",
          options: [
            {
              id: "future_rehearsal",
              labelZh: "推演未来",
              labelEn: "Rehearsing the future",
              anchorHints: ["推演未来", "以后", "担心下一步"],
              selectedState: "future as escape",
              candidateStateKey: "future_as_escape",
            },
            {
              id: "old_decision",
              labelZh: "翻旧决定有没有选错",
              labelEn: "Replaying whether an old decision was wrong",
              anchorHints: ["旧决定", "选错", "白费"],
              selectedState: "late night rumination",
              candidateStateKey: "late_night_rumination",
            },
          ],
        },
        finalBySecondOption: {
          future_rehearsal: {
            selectedState: "future as escape",
            candidateStateKey: "future_as_escape",
            anchorHints: ["推演未来", "以后", "喘口气"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是下一步方向，还是想先从眼前这一段里喘口气？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: the next direction, or a way to breathe inside the present moment?",
          },
          old_decision: {
            selectedState: "late night rumination",
            candidateStateKey: "late_night_rumination",
            anchorHints: ["睡不下", "旧决定", "有没有白费"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是方向，还是过去那个选择有没有白费？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: the direction ahead, or whether that past choice was wasted?",
          },
        },
      },
      empty_when_quiet: {
        secondStep: {
          id: "confusion_quiet_second",
          questionZh: "这个空掉更像是社交后突然没力气，还是一件小事卡住后整个人停在那里？",
          questionEn:
            "Does the emptiness feel more like a drop after social effort, or like freezing around one small task?",
          options: [
            {
              id: "after_social",
              labelZh: "社交后突然没力气",
              labelEn: "A drop after social effort",
              anchorHints: ["社交后", "没力气", "装没事"],
              selectedState: "quiet after social",
              candidateStateKey: "quiet_after_social",
            },
            {
              id: "small_task_freeze",
              labelZh: "一件小事卡住",
              labelEn: "Freezing around one small task",
              anchorHints: ["小事", "卡住", "停在那里"],
              selectedState: "small task paralysis",
              candidateStateKey: "small_task_paralysis",
            },
          ],
        },
        finalBySecondOption: {
          after_social: {
            selectedState: "quiet after social",
            candidateStateKey: "quiet_after_social",
            anchorHints: ["一停下来", "社交后", "很空"],
            finalReflectiveQuestionZh:
              "你现在真正想看见的，是自己为什么空掉，还是刚才一直在维持什么样子？",
            finalReflectiveQuestionEn:
              "What do you most need to see now: why you feel empty, or what you were holding together before the quiet arrived?",
          },
          small_task_freeze: {
            selectedState: "small task paralysis",
            candidateStateKey: "small_task_paralysis",
            anchorHints: ["小事", "卡住", "背后的账"],
            finalReflectiveQuestionZh:
              "你现在真正想理解的，是这件小事本身，还是它背后被一起打开的那串账？",
            finalReflectiveQuestionEn:
              "What are you really trying to understand now: the small task itself, or the larger account it opens behind it?",
          },
        },
      },
    },
  },
  {
    id: "relationship_waiting",
    keywordHints: ["回来", "复合", "他会不会", "她会不会", "等他", "等她", "reply", "text"],
    initialStep: {
      id: "relationship_waiting_initial",
      questionZh:
        "这个等待更像是反复看消息有没有变化，还是在等一个信号，好让你知道自己可不可以继续？",
      questionEn:
        "Does this waiting look more like checking messages for a change, or waiting for a sign that tells you whether you may continue?",
      options: [
        {
          id: "checking_message",
          labelZh: "反复看消息有没有变化",
          labelEn: "Checking messages for a change",
          anchorHints: ["消息", "没回", "反复看"],
          selectedState: "message monitoring",
          candidateStateKey: "message_monitoring",
        },
        {
          id: "waiting_permission",
          labelZh: "等一个信号才敢继续",
          labelEn: "Waiting for a sign before continuing",
          anchorHints: ["信号", "可不可以", "继续"],
          selectedState: "checking for permission",
          candidateStateKey: "checking_for_permission",
        },
      ],
    },
    branches: {
      checking_message: {
        secondStep: {
          id: "relationship_message_second",
          questionZh: "你更常做的是等新回复，还是把旧消息翻出来听语气有没有变冷？",
          questionEn:
            "Do you more often wait for a new reply, or reread old messages to hear whether the tone has gone cold?",
          options: [
            {
              id: "new_reply",
              labelZh: "等新回复",
              labelEn: "Waiting for a new reply",
              anchorHints: ["等回复", "通知", "放在心上"],
              selectedState: "message monitoring",
              candidateStateKey: "message_monitoring",
            },
            {
              id: "old_tone",
              labelZh: "翻旧消息听语气",
              labelEn: "Rereading old messages for tone",
              anchorHints: ["旧消息", "语气", "变冷"],
              selectedState: "rereading for tone",
              candidateStateKey: "rereading_for_tone",
            },
          ],
        },
        finalBySecondOption: {
          new_reply: {
            selectedState: "message monitoring",
            candidateStateKey: "message_monitoring",
            anchorHints: ["等回复", "手机", "被放在心上"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是对方会不会回，还是你还要不要把自己的安稳交给这个通知？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether they will reply, or whether your steadiness still belongs to this notification?",
          },
          old_tone: {
            selectedState: "rereading for tone",
            candidateStateKey: "rereading_for_tone",
            anchorHints: ["旧消息", "语气", "变冷"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是那句话的意思，还是自己为什么需要从语气里找安全感？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: what that sentence meant, or why safety has become something you search for in the tone?",
          },
        },
      },
      waiting_permission: {
        secondStep: {
          id: "relationship_permission_second",
          questionZh: "你等的信号更像是给自己一个继续的理由，还是给自己一个终于可以停下的理由？",
          questionEn:
            "Is the sign you are waiting for more like a reason to continue, or a reason to finally stop?",
          options: [
            {
              id: "reason_continue",
              labelZh: "继续的理由",
              labelEn: "A reason to continue",
              anchorHints: ["继续", "理由", "允许"],
              selectedState: "checking for permission",
              candidateStateKey: "checking_for_permission",
            },
            {
              id: "reason_stop",
              labelZh: "停下的理由",
              labelEn: "A reason to stop",
              anchorHints: ["停下", "证据", "回应"],
              selectedState: "proof waiting",
              candidateStateKey: "proof_waiting",
            },
          ],
        },
        finalBySecondOption: {
          reason_continue: {
            selectedState: "checking for permission",
            candidateStateKey: "checking_for_permission",
            anchorHints: ["信号", "继续", "别人先点头"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是关系的答案，还是自己是否可以不用等别人点头才继续？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: the answer of the relationship, or whether you can continue without waiting for someone else to nod first?",
          },
          reason_stop: {
            selectedState: "proof waiting",
            candidateStateKey: "proof_waiting",
            anchorHints: ["停下", "证据", "已经看见"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是还缺一个证据，还是自己已经看见了但还没准备回应？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether one more proof is missing, or whether you have seen enough but are not ready to respond?",
          },
        },
      },
    },
  },
  {
    id: "project_continue",
    keywordHints: ["项目", "继续", "放弃", "工作", "创业", "project", "continue", "quit"],
    initialStep: {
      id: "project_continue_initial",
      questionZh:
        "这个项目现在更像是还没真正开始就很重，还是已经投入很多所以很难放下？",
      questionEn:
        "Does this project feel heavy before it has truly started, or hard to release because you have already invested so much?",
      options: [
        {
          id: "heavy_before_start",
          labelZh: "还没开始就很重",
          labelEn: "Heavy before it starts",
          anchorHints: ["没开始", "很重", "第一步"],
          selectedState: "pre-start avoidance",
          candidateStateKey: "pre_start_avoidance",
        },
        {
          id: "invested_too_much",
          labelZh: "投入太多很难放下",
          labelEn: "Too invested to release",
          anchorHints: ["投入", "不甘心", "白费"],
          selectedState: "sunk cost attachment",
          candidateStateKey: "sunk_cost_attachment",
        },
      ],
    },
    branches: {
      heavy_before_start: {
        secondStep: {
          id: "project_start_second",
          questionZh: "你现在更常做的是继续查资料，还是对着第一步迟迟下不了手？",
          questionEn:
            "Do you more often keep researching, or sit in front of the first step without starting?",
          options: [
            {
              id: "keep_researching",
              labelZh: "继续查资料",
              labelEn: "Keep researching",
              anchorHints: ["查资料", "标签页", "再看看"],
              selectedState: "research as delay",
              candidateStateKey: "research_as_delay",
            },
            {
              id: "cannot_start",
              labelZh: "第一步下不了手",
              labelEn: "Cannot start the first step",
              anchorHints: ["第一步", "打不开", "开始"],
              selectedState: "pre-start avoidance",
              candidateStateKey: "pre_start_avoidance",
            },
          ],
        },
        finalBySecondOption: {
          keep_researching: {
            selectedState: "research as delay",
            candidateStateKey: "research_as_delay",
            anchorHints: ["查资料", "行动", "推后"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是资料还不够，还是行动开始之后你就要承认这个项目变成真的了？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether the research is still not enough, or whether action would make this project real?",
          },
          cannot_start: {
            selectedState: "pre-start avoidance",
            candidateStateKey: "pre_start_avoidance",
            anchorHints: ["第一步", "开始", "变成真的"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是第一步怎么做，还是为什么按下开始会让整件事变得这么重？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: how to take the first step, or why beginning makes the whole thing feel so heavy?",
          },
        },
      },
      invested_too_much: {
        secondStep: {
          id: "project_invested_second",
          questionZh: "难放下更像是不甘心白费，还是怕放下之后不知道自己是谁？",
          questionEn:
            "Is it hard to release because the effort might feel wasted, or because you do not know who you are after letting go?",
          options: [
            {
              id: "wasted_effort",
              labelZh: "不甘心白费",
              labelEn: "Not wanting the effort to be wasted",
              anchorHints: ["白费", "投入", "不甘心"],
              selectedState: "sunk cost attachment",
              candidateStateKey: "sunk_cost_attachment",
            },
            {
              id: "identity_shift",
              labelZh: "怕不知道自己是谁",
              labelEn: "Afraid of not knowing who you are",
              anchorHints: ["不像我", "自我", "身份"],
              selectedState: "identity protection",
              candidateStateKey: "identity_protection",
            },
          ],
        },
        finalBySecondOption: {
          wasted_effort: {
            selectedState: "sunk cost attachment",
            candidateStateKey: "sunk_cost_attachment",
            anchorHints: ["投入", "白费", "放下"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是项目还值不值得继续，还是过去投入的自己有没有被好好交代？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether the project is still worth continuing, or whether the version of you that invested so much has been honored?",
          },
          identity_shift: {
            selectedState: "identity protection",
            candidateStateKey: "identity_protection",
            anchorHints: ["自我", "身份", "放下之后"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是项目的去留，还是放下它以后你还能不能认出自己？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether the project should stay, or whether you can still recognize yourself without it?",
          },
        },
      },
    },
  },
  {
    id: "self_sensitivity",
    keywordHints: ["太敏感", "敏感", "生气", "委屈", "overreact", "sensitive", "angry"],
    initialStep: {
      id: "self_sensitivity_initial",
      questionZh:
        "你问自己是不是太敏感时，更像是刚生气就开始替对方解释，还是反复回看一句话的语气？",
      questionEn:
        "When you ask whether you are too sensitive, is it more like explaining the other side as soon as anger appears, or rereading one sentence for its tone?",
      options: [
        {
          id: "soften_anger",
          labelZh: "刚生气就替对方解释",
          labelEn: "Explaining the other side as soon as anger appears",
          anchorHints: ["生气", "替对方解释", "体谅"],
          selectedState: "anger softening",
          candidateStateKey: "anger_softening",
        },
        {
          id: "read_tone",
          labelZh: "反复回看一句话的语气",
          labelEn: "Rereading one sentence for its tone",
          anchorHints: ["语气", "反复看", "是不是太敏感"],
          selectedState: "rereading for tone",
          candidateStateKey: "rereading_for_tone",
        },
      ],
    },
    branches: {
      soften_anger: {
        secondStep: {
          id: "sensitivity_anger_second",
          questionZh: "你更怕的是自己误会别人，还是怕一承认生气就必须设边界？",
          questionEn:
            "Are you more afraid of misunderstanding someone, or of needing a boundary once you admit the anger is real?",
          options: [
            {
              id: "misunderstand",
              labelZh: "怕误会别人",
              labelEn: "Afraid of misunderstanding someone",
              anchorHints: ["误会", "体谅", "解释"],
              selectedState: "anger softening",
              candidateStateKey: "anger_softening",
            },
            {
              id: "need_boundary",
              labelZh: "怕必须设边界",
              labelEn: "Afraid a boundary will be needed",
              anchorHints: ["边界", "生气", "不舒服"],
              selectedState: "anger softening",
              candidateStateKey: "anger_softening",
            },
          ],
        },
        finalBySecondOption: {
          misunderstand: {
            selectedState: "anger softening",
            candidateStateKey: "anger_softening",
            anchorHints: ["误会别人", "替对方解释", "生气"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是自己有没有误会，还是自己的不舒服能不能先被完整听见？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether you misunderstood, or whether your discomfort can be heard before it is explained away?",
          },
          need_boundary: {
            selectedState: "anger softening",
            candidateStateKey: "anger_softening",
            anchorHints: ["边界", "生气", "不舒服"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是自己是不是太敏感，还是这份不舒服正在替边界发声？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether you are too sensitive, or whether this discomfort is speaking for a boundary?",
          },
        },
      },
      read_tone: {
        secondStep: {
          id: "sensitivity_tone_second",
          questionZh: "你反复看的，是对方有没有变冷，还是自己有没有资格觉得受伤？",
          questionEn:
            "Are you rereading to see whether they went cold, or whether you are allowed to feel hurt?",
          options: [
            {
              id: "went_cold",
              labelZh: "对方有没有变冷",
              labelEn: "Whether they went cold",
              anchorHints: ["变冷", "语气", "消息"],
              selectedState: "rereading for tone",
              candidateStateKey: "rereading_for_tone",
            },
            {
              id: "allowed_hurt",
              labelZh: "自己有没有资格受伤",
              labelEn: "Whether you are allowed to feel hurt",
              anchorHints: ["资格", "受伤", "敏感"],
              selectedState: "identity protection",
              candidateStateKey: "identity_protection",
            },
          ],
        },
        finalBySecondOption: {
          went_cold: {
            selectedState: "rereading for tone",
            candidateStateKey: "rereading_for_tone",
            anchorHints: ["语气", "变冷", "反复看"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是那句话有没有变冷，还是自己的身体为什么先听见了距离？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether the sentence went cold, or why your body heard distance first?",
          },
          allowed_hurt: {
            selectedState: "anger softening",
            candidateStateKey: "anger_softening",
            anchorHints: ["太敏感", "受伤", "怎么看自己"],
            finalReflectiveQuestionZh:
              "你现在真正想确认的，是自己有没有资格受伤，还是为什么受伤会动摇你对自己的判断？",
            finalReflectiveQuestionEn:
              "What are you really trying to confirm now: whether you are allowed to feel hurt, or why feeling hurt disturbs how you judge yourself?",
          },
        },
      },
    },
  },
];

export function detectSurfaceScenario(surfaceQuestion: string): SurfaceScenario {
  const normalizedQuestion = surfaceQuestion.trim().toLowerCase();

  for (const scenario of preDrawDialogueScenarios) {
    if (scenario.keywordHints.some((hint) => normalizedQuestion.includes(hint.toLowerCase()))) {
      return scenario.id;
    }
  }

  return "confusion";
}

export function getDialogueScenario(
  scenarioId: SurfaceScenario,
): DialogueScenarioDefinition {
  return (
    preDrawDialogueScenarios.find((scenario) => scenario.id === scenarioId) ??
    preDrawDialogueScenarios[0]
  );
}

export function getInitialDialogueStep(scenarioId: SurfaceScenario): DialogueStep {
  return getDialogueScenario(scenarioId).initialStep;
}

export function getSecondDialogueStep(
  scenarioId: SurfaceScenario,
  firstOptionId: string,
): DialogueStep | undefined {
  return getDialogueScenario(scenarioId).branches[firstOptionId]?.secondStep;
}

export function buildPreDrawDialogueResult(
  state: DialogueState,
  matchedMicroSlices: MicroSlice[],
): PreDrawDialogueResult | undefined {
  if (!state.firstOptionId || !state.secondOptionId) {
    return undefined;
  }

  const scenario = getDialogueScenario(state.scenario);
  const branch = scenario.branches[state.firstOptionId];
  const final = branch?.finalBySecondOption[state.secondOptionId];
  const firstOption = scenario.initialStep.options.find(
    (option) => option.id === state.firstOptionId,
  );
  const secondOption = branch?.secondStep.options.find(
    (option) => option.id === state.secondOptionId,
  );

  if (!final || !firstOption || !secondOption) {
    return undefined;
  }

  const exactAnchors = uniqueNonEmpty([
    state.surfaceQuestion.trim(),
    firstOption.labelZh,
    secondOption.labelZh,
    ...firstOption.anchorHints,
    ...secondOption.anchorHints,
    ...final.anchorHints,
  ]).slice(0, 8);

  return {
    scenario: state.scenario,
    selectedState: final.selectedState,
    candidateStateKey: final.candidateStateKey,
    anchorHints: uniqueNonEmpty([
      ...firstOption.anchorHints,
      ...secondOption.anchorHints,
      ...final.anchorHints,
    ]),
    exactAnchors,
    finalReflectiveQuestionZh: final.finalReflectiveQuestionZh,
    finalReflectiveQuestionEn: final.finalReflectiveQuestionEn,
    matchedMicroSlices,
  };
}

function uniqueNonEmpty(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  );
}
