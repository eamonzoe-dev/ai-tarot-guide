import { RiskLevel as riskLevelValues } from "./reflectionSignal";
import type { RiskLevel } from "./reflectionSignal";

export type MicroSlice = {
  sliceId: string;
  stateKey: string;
  surfaceTopics: string[];
  requiredSignals: string[];
  microScene: string;
  concreteLineZh: string;
  concreteLineEn: string;
  riskLevel: RiskLevel;
  doNotUseIf: string[];
  softenedVersionZh: string;
  anchorHints: string[];
  tags: string[];
};

export type MicroSliceBankValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

const forbiddenConcreteLineZhPhrases = [
  "我知道你",
  "你一定",
  "命中注定",
  "他一定",
  "她一定",
  "未来会",
  "注定会",
  "必然会",
] as const;

export const microSliceBank: readonly MicroSlice[] = [
  {
    sliceId: "late_night_rumination_001",
    stateKey: "late_night_rumination",
    surfaceTopics: ["confusion", "decision", "sleep", "work", "relationship"],
    requiredSignals: ["sleep_reference", "replaying_thoughts", "past_choice_regret"],
    microScene:
      "The user functions during the day, then replays unresolved choices when trying to sleep.",
    concreteLineZh:
      "你可能不是白天最混乱，而是到了该睡的时候，脑子才开始转那些白天不敢认真想的事。",
    concreteLineEn:
      "It may not be the daytime that feels most tangled; it may be the hour when you try to sleep and your mind starts turning the things you avoided looking at directly.",
    riskLevel: "low",
    doNotUseIf: ["user describes acute insomnia, panic, or a medical sleep diagnosis"],
    softenedVersionZh:
      "如果这个画面不完全贴合，可以只保留一点：有些念头像是在安静下来之后才追上你。",
    anchorHints: ["睡不下", "想太多", "晚上", "旧决定", "白天不敢想"],
    tags: ["time_texture", "rumination", "sleep", "decision"],
  },
  {
    sliceId: "message_monitoring_001",
    stateKey: "message_monitoring",
    surfaceTopics: ["relationship", "work", "friendship", "communication"],
    requiredSignals: ["waiting_for_reply", "checking_app", "low_agency"],
    microScene:
      "The user keeps checking a message thread, using small signs to measure whether they still matter.",
    concreteLineZh:
      "它像是在照见你把手机放下又拿起的那几分钟，不是真的缺一个通知，而是在等某个回复帮你确认自己有没有被放在心上。",
    concreteLineEn:
      "It looks like the few minutes of putting the phone down and picking it back up again, not because one notification solves it, but because a reply would make you feel placed somewhere in their attention.",
    riskLevel: "medium",
    doNotUseIf: ["user mentions stalking, harassment, or unsafe contact behavior"],
    softenedVersionZh:
      "如果这句话说重了，也许可以放轻成：你在等的可能不只是消息，而是消息背后的分量。",
    anchorHints: ["等回复", "看手机", "已读", "没回", "通知"],
    tags: ["communication", "attachment", "checking", "agency"],
  },
  {
    sliceId: "rereading_for_tone_001",
    stateKey: "rereading_for_tone",
    surfaceTopics: ["relationship", "work", "message", "conflict"],
    requiredSignals: ["rereading_message", "tone_decoding", "uncertainty"],
    microScene:
      "The user rereads the same words to detect whether a tone has changed or a hidden judgment is present.",
    concreteLineZh:
      "它像是在照见你反复点开同一段话的动作，眼睛看的是字，身体其实在听那个语气有没有变冷。",
    concreteLineEn:
      "It looks like opening the same message again and again: your eyes are reading the words, while your body is listening for whether the tone has gone cold.",
    riskLevel: "low",
    doNotUseIf: ["the user provided no message or communication context"],
    softenedVersionZh:
      "如果不完全是这段消息，也许是类似的时刻：你在文字里找的不是内容，而是温度。",
    anchorHints: ["语气", "反复看", "那句话", "是不是生气", "消息"],
    tags: ["communication", "tone", "body_signal", "uncertainty"],
  },
  {
    sliceId: "pre_start_avoidance_001",
    stateKey: "pre_start_avoidance",
    surfaceTopics: ["work", "study", "creative", "decision"],
    requiredSignals: ["task_not_started", "opening_step_feels_heavy", "avoidance_before_action"],
    microScene:
      "The user delays the first visible step because starting would turn a vague pressure into a real commitment.",
    concreteLineZh:
      "它像是在照见开始前的那一下：文件还没打开，消息还没发出，真正重的不是任务本身，而是按下开始之后它就变成真的了。",
    concreteLineEn:
      "It looks like the moment before starting: the file is not open and the message is not sent, and the heavy part is not the task itself but how real it becomes once you begin.",
    riskLevel: "low",
    doNotUseIf: ["user describes inability to function or urgent clinical distress"],
    softenedVersionZh:
      "如果这不是逃开，也许只是说明这个开始键背后压着比任务更大的意义。",
    anchorHints: ["还没开始", "打不开", "拖着", "第一步", "开始"],
    tags: ["action", "work", "threshold", "avoidance"],
  },
  {
    sliceId: "research_as_delay_001",
    stateKey: "research_as_delay",
    surfaceTopics: ["work", "study", "purchase", "decision", "planning"],
    requiredSignals: ["more_information", "postponed_action", "decision_uncertainty"],
    microScene:
      "The user keeps gathering information because research feels safer than choosing or acting.",
    concreteLineZh:
      "它像是在照见你开着很多标签页的时刻：表面是在补资料，深一点像是在用更多信息，把真正要下手的那一步往后推一点。",
    concreteLineEn:
      "It looks like having too many tabs open: on the surface you are collecting information, but underneath, more research may be moving the first real action a little farther away.",
    riskLevel: "low",
    doNotUseIf: ["the user is doing safety-critical, legal, medical, or financial research"],
    softenedVersionZh:
      "如果这里不是拖延，也许只是提醒：资料已经够不够，可以和行动分开看。",
    anchorHints: ["查资料", "再看看", "做攻略", "比较", "还没决定"],
    tags: ["research", "delay", "decision", "planning"],
  },
  {
    sliceId: "sunk_cost_attachment_001",
    stateKey: "sunk_cost_attachment",
    surfaceTopics: ["relationship", "work", "project", "decision"],
    requiredSignals: ["past_investment", "hard_to_leave", "wasted_effort_fear"],
    microScene:
      "The user stays attached to a path partly because leaving would make past effort feel unprotected.",
    concreteLineZh:
      "它像是在照见你舍不得放下的那一段，不只是因为现在还合适，也因为一旦松手，前面花掉的时间就像要自己承认它没有换来想要的东西。",
    concreteLineEn:
      "It looks like the part you hesitate to release, not only because it still fits now, but because letting go would make the time already spent feel exposed.",
    riskLevel: "medium",
    doNotUseIf: ["the situation involves abuse, coercion, or immediate safety concerns"],
    softenedVersionZh:
      "如果这句话太重，可以把它放轻成：你可能也在照顾过去那个已经投入很多的自己。",
    anchorHints: ["舍不得", "都这么久了", "不甘心", "投入", "白费"],
    tags: ["attachment", "decision", "loss", "continuity"],
  },
  {
    sliceId: "identity_protection_001",
    stateKey: "identity_protection",
    surfaceTopics: ["career", "relationship", "family", "creative", "self-image"],
    requiredSignals: ["self_image_threat", "choice_conflict", "fear_of_becoming_someone"],
    microScene:
      "The user avoids a choice because choosing would disturb the story they have held about who they are.",
    concreteLineZh:
      "它像是在照见一个很小但很刺的念头：真正难的不是选哪边，而是选完以后，你要怎么面对那个和原来自我形象不太一样的自己。",
    concreteLineEn:
      "It looks like a small sharp thought: the hard part may not be which side to choose, but how to face the version of yourself that exists after choosing.",
    riskLevel: "medium",
    doNotUseIf: ["user mentions identity-based discrimination, outing risk, or personal safety risk"],
    softenedVersionZh:
      "如果这个说法太靠里，也许可以先说成：这个选择牵动的不只是事情，还有你怎么看自己。",
    anchorHints: ["不像我", "我怎么会", "人设", "面子", "自我"],
    tags: ["identity", "choice", "self_image", "tension"],
  },
  {
    sliceId: "quiet_after_social_001",
    stateKey: "quiet_after_social",
    surfaceTopics: ["friendship", "family", "work", "social", "belonging"],
    requiredSignals: ["after_social_drop", "quiet_room", "performance_fatigue"],
    microScene:
      "The user seems fine around others, then feels hollow or exposed once the social role ends.",
    concreteLineZh:
      "它像是在照见聚会或会议结束后的那段路：刚才还接得上话，回到安静里以后，才发现自己一直在用力维持一个看起来没事的样子。",
    concreteLineEn:
      "It looks like the walk after a gathering or meeting: you were able to respond in the room, and only in the quiet afterward do you notice how much effort went into seeming fine.",
    riskLevel: "low",
    doNotUseIf: ["user describes severe isolation, self-harm risk, or acute crisis"],
    softenedVersionZh:
      "如果不完全是聚会，也许是任何一个人群散掉之后，身体才慢慢承认自己累了的时刻。",
    anchorHints: ["一停下来", "社交后", "回家路上", "很空", "装没事"],
    tags: ["social", "quiet", "body_signal", "fatigue"],
  },
  {
    sliceId: "draft_without_sending_001",
    stateKey: "draft_without_sending",
    surfaceTopics: ["relationship", "work", "apology", "boundary", "communication"],
    requiredSignals: ["drafted_message", "not_sent", "fear_of_consequence"],
    microScene:
      "The user drafts a message but pauses before sending because sending would make the tension shared and irreversible.",
    concreteLineZh:
      "它像是在照见输入框里那几行没发出去的话：你不是没有想清楚要说什么，而是手指停在发送前，知道一发出去关系里的安静就会被打破。",
    concreteLineEn:
      "It looks like the unsent lines in the input box: not because you have no words, but because your finger stops before sending, knowing the quiet between you will change once it leaves.",
    riskLevel: "medium",
    doNotUseIf: ["message context involves legal threats, safety risks, or harassment"],
    softenedVersionZh:
      "如果不是消息，也许是任何一个准备表达但还没交出去的动作：话已经有了，只是后果还没有被允许进来。",
    anchorHints: ["写了没发", "输入框", "删掉", "发送", "怎么开口"],
    tags: ["communication", "action", "boundary", "hesitation"],
  },
  {
    sliceId: "small_task_paralysis_001",
    stateKey: "small_task_paralysis",
    surfaceTopics: ["work", "home", "admin", "study", "health"],
    requiredSignals: ["small_task", "outsized_weight", "blocked_action"],
    microScene:
      "The user is blocked by a small task because it carries a larger emotional account behind it.",
    concreteLineZh:
      "它像是在照见那个明明十分钟能做完的小事：真正卡住的不是动作难，而是它背后连着一串你暂时不想打开的账。",
    concreteLineEn:
      "It looks like the small thing that might take ten minutes: the action itself may not be hard, but it opens a longer account you do not feel ready to look at.",
    riskLevel: "low",
    doNotUseIf: ["task is urgent medical, legal, or safety-critical action"],
    softenedVersionZh:
      "如果这件小事没有那么重，也许只是说明它旁边放着太多没被整理的东西。",
    anchorHints: ["小事", "十分钟", "就是做不了", "拖很久", "卡住"],
    tags: ["task", "paralysis", "admin", "hidden_weight"],
  },
  {
    sliceId: "checking_for_permission_001",
    stateKey: "checking_for_permission",
    surfaceTopics: ["career", "relationship", "family", "creative", "decision"],
    requiredSignals: ["waiting_for_sign", "external_permission", "delayed_choice"],
    microScene:
      "The user waits for a sign, response, or approval before letting themselves choose what they already lean toward.",
    concreteLineZh:
      "它像是在照见你等一个信号的姿势：表面是在确认可不可以，里面更像是在等别人先点头，这样你就不用独自承担自己已经偏向的选择。",
    concreteLineEn:
      "It looks like waiting for a signal: on the surface you are checking whether it is allowed, while underneath you may be waiting for someone else to nod first so the choice is not only yours to hold.",
    riskLevel: "low",
    doNotUseIf: ["the user truly needs formal consent, legal approval, or safety clearance"],
    softenedVersionZh:
      "如果这里确实需要别人确认，那就保留现实部分；只是也可以看看，有没有一小块决定其实已经在你这边成形了。",
    anchorHints: ["等信号", "可不可以", "别人怎么想", "同意", "允许"],
    tags: ["permission", "agency", "decision", "signal"],
  },
  {
    sliceId: "anger_softening_001",
    stateKey: "anger_softening",
    surfaceTopics: ["relationship", "family", "work", "conflict", "boundary"],
    requiredSignals: ["anger_present", "quick_understanding", "boundary_blur"],
    microScene:
      "The user quickly translates anger into understanding, sometimes before the boundary has had room to speak.",
    concreteLineZh:
      "它像是在照见你刚生气又立刻替对方解释的那一秒：火还没来得及把边界照亮，就先被你揉成了理解和体谅。",
    concreteLineEn:
      "It looks like the second when anger appears and you immediately explain the other side: the heat has not had time to light up the boundary before it is softened into understanding.",
    riskLevel: "medium",
    doNotUseIf: ["conflict involves immediate danger, abuse, or required safety planning"],
    softenedVersionZh:
      "如果这不是压住愤怒，也许只是提醒：理解别人之前，可以先让自己的不舒服完整出现一下。",
    anchorHints: ["算了", "他也不容易", "我是不是太敏感", "生气", "体谅"],
    tags: ["anger", "boundary", "relationship", "body_signal"],
  },
  {
    sliceId: "future_as_escape_001",
    stateKey: "future_as_escape",
    surfaceTopics: ["career", "relationship", "life_change", "planning", "escape"],
    requiredSignals: ["imagined_future", "present_discomfort", "delayed_grief_or_action"],
    microScene:
      "The user leans on an imagined future because the present is too cramped to sit in directly.",
    concreteLineZh:
      "它像是在照见你把注意力放到很远以后的画面里：不是那个画面不好，而是此刻太窄了，于是先借一个远处的自己喘口气。",
    concreteLineEn:
      "It looks like placing your attention far ahead: not because that image is wrong, but because the present feels narrow enough that you borrow a distant version of yourself to breathe.",
    riskLevel: "low",
    doNotUseIf: ["user is making immediate safety, housing, medical, or financial decisions"],
    softenedVersionZh:
      "如果这不是逃开，也许只是说明远处的画面正在帮你撑过眼前这一段。",
    anchorHints: ["以后就好了", "换个地方", "重新开始", "远方", "将来"],
    tags: ["future", "escape", "planning", "present_tension"],
  },
  {
    sliceId: "proof_waiting_001",
    stateKey: "proof_waiting",
    surfaceTopics: ["relationship", "work", "decision", "self-trust"],
    requiredSignals: ["one_more_proof", "pattern_already_visible", "hesitation"],
    microScene:
      "The user waits for one more piece of proof even though the current pattern is already visible enough to respond to.",
    concreteLineZh:
      "它像是在照见你还想再等一个证据的时刻：不是因为眼前完全看不清，而是承认已经看见之后，下一步就会轮到你来回应。",
    concreteLineEn:
      "It looks like the moment of waiting for one more proof: not because everything is unclear, but because once you admit what is already visible, the next response belongs to you.",
    riskLevel: "low",
    doNotUseIf: ["more evidence is required for legal, medical, financial, or safety reasons"],
    softenedVersionZh:
      "如果现在确实还需要信息，那就继续确认；只是也可以分辨一下，你等的是证据，还是等自己愿意回应。",
    anchorHints: ["再等等", "再证明一次", "还不确定", "证据", "看清楚"],
    tags: ["proof", "decision", "agency", "pattern"],
  },
];

export function getMicroSlicesByStateKey(stateKey: string): MicroSlice[] {
  return microSliceBank
    .filter((slice) => slice.stateKey === stateKey)
    .map(cloneMicroSlice);
}

export function getMicroSlicesByTopic(topic: string): MicroSlice[] {
  return microSliceBank
    .filter((slice) => slice.surfaceTopics.includes(topic))
    .map(cloneMicroSlice);
}

export function getMicroSliceById(sliceId: string): MicroSlice | undefined {
  const slice = microSliceBank.find((item) => item.sliceId === sliceId);
  return slice ? cloneMicroSlice(slice) : undefined;
}

export function getAllMicroSlices(): MicroSlice[] {
  return microSliceBank.map(cloneMicroSlice);
}

export function validateMicroSliceBank(): MicroSliceBankValidationResult {
  const errors: string[] = [];
  const seenSliceIds = new Set<string>();

  microSliceBank.forEach((slice, index) => {
    const path = `microSliceBank[${index}]`;

    if (!isNonEmptyString(slice.sliceId)) {
      errors.push(`${path}.sliceId must be non-empty`);
    } else if (seenSliceIds.has(slice.sliceId)) {
      errors.push(`${path}.sliceId must be unique: ${slice.sliceId}`);
    } else {
      seenSliceIds.add(slice.sliceId);
    }

    if (!isNonEmptyString(slice.stateKey)) {
      errors.push(`${path}.stateKey must be non-empty`);
    }

    validateStringArray(slice.surfaceTopics, `${path}.surfaceTopics`, 1, errors);
    validateStringArray(slice.requiredSignals, `${path}.requiredSignals`, 2, errors);

    if (!isNonEmptyString(slice.concreteLineZh)) {
      errors.push(`${path}.concreteLineZh must be non-empty`);
    }

    for (const phrase of forbiddenConcreteLineZhPhrases) {
      if (slice.concreteLineZh.includes(phrase)) {
        errors.push(`${path}.concreteLineZh includes forbidden phrase: ${phrase}`);
      }
    }

    if (!isNonEmptyString(slice.concreteLineEn)) {
      errors.push(`${path}.concreteLineEn must be non-empty`);
    }

    if (!isNonEmptyString(slice.softenedVersionZh)) {
      errors.push(`${path}.softenedVersionZh must be non-empty`);
    }

    if (!riskLevelValues.includes(slice.riskLevel)) {
      errors.push(`${path}.riskLevel must be low, medium, or high`);
    }

    validateStringArray(slice.doNotUseIf, `${path}.doNotUseIf`, 1, errors);
  });

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

function cloneMicroSlice(slice: MicroSlice): MicroSlice {
  return {
    ...slice,
    surfaceTopics: [...slice.surfaceTopics],
    requiredSignals: [...slice.requiredSignals],
    doNotUseIf: [...slice.doNotUseIf],
    anchorHints: [...slice.anchorHints],
    tags: [...slice.tags],
  };
}

function validateStringArray(
  value: readonly string[],
  path: string,
  minLength: number,
  errors: string[],
): void {
  if (value.length < minLength) {
    errors.push(`${path} must include at least ${minLength} item(s)`);
  }

  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      errors.push(`${path}[${index}] must be non-empty`);
    }
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
