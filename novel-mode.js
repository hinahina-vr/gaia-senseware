(() => {
  "use strict";

  const STORAGE_KEY = "gaiaSensewareNovel:v6";
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TEXT_REVEAL_STEP_MS = 36;
  const TEXT_REVEAL_FADE_MS = 280;
  const TEXT_REVEAL_PAUSE_MS = 110;
  const AUTO_DELAY_MS = 3200;
  const CHAPTER_CARD_DURATION_MS = Math.round(2900 * 1.7);
  const SCRAMBLE_ALPHABET = Array.from("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン０１２３４５６７８９◇○△");
  const MODE_TITLES = [
    "01 — 地球の一呼吸",
    "02 — 青い循環系",
    "03 — 森の気候装置",
    "04 — 共進化プロトコル",
    "05 — すべては次の資源",
    "06 — 人類世の傷跡",
    "07 — 地球からのメッセージ",
    "08 — 三つの生態系",
    "09 — 人工物の共生化",
    "10 — 未完の地球センスウェア",
  ];

  // Legacy asset keys are retained for compatibility: sora = アマネ, minamo = ミズハ.
  const CHARACTERS = {
    narrator: { name: "観測記録", glyph: "◌" },
    sora: {
      name: "アマネ",
      glyph: "△",
      defaultExpression: "calm",
      expressions: ["calm", "startled", "exasperated", "soft"],
      profile: "少し気だるく率直な学生。長い説明を短い問いへ畳み、測れた事実と想像を分ける。ぶっきらぼうでも、相手には少し甘い。",
    },
    minamo: {
      name: "ミズハ",
      glyph: "≈",
      defaultExpression: "calm",
      expressions: ["calm", "teasing", "worried", "sad"],
      profile: "知識多めの能書き好きな学生。生態の信号を上品な口調で筋道立てて語り、ときどき俗っぽい本音と辛辣な判定がこぼれる。",
    },
    sakuya: { name: "サクヤの記録", glyph: "＊" },
    earth: { name: "地球", glyph: "◎" },
    choice: { name: "あなたの選択", glyph: "◇" },
  };

  const STORY = [
    { type: "chapter", chapter: "GX / 00", title: "酸素は、最初の廃棄物だった", mode: 0, location: "THE FIRST GX" },
    { type: "line", speaker: "narrator", mode: 0, kind: "SOURCE", signal: "SAKUYA / DEEP TIME RECORD", text: "サクヤが最後に開いていたのは、何十億年もの地球史を六つの場面に畳んだ観測記録だった。", location: "THE FIRST GX / LOCAL SNAPSHOT" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 0, kind: "SOURCE", signal: "CYANOBACTERIA / OXYGENIC PHOTOSYNTHESIS", text: "ええ、能書きタイムですの。酸素は最初、ごみでした。光を食べた小さな生命が、いらないものとして海へ捨てたんですのよ。", location: "THE FIRST GX / ANCIENT OCEAN" },
    { type: "line", speaker: "sora", expression: "startled", mode: 0, kind: "SOURCE", signal: "GREAT OXIDATION / ENVIRONMENTAL CHANGE", text: "そのごみが、今の呼吸になった。あるんだ。", location: "THE FIRST GX / ANCIENT OCEAN" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 0, kind: "DERIVED", signal: "生命が環境を変え、環境が生命を変え返す", text: "ええ。でも、きれいな成功物語ではありませんの。酸素が苦手な生命には災害でした。地球の変化は、全員へ同じ顔を見せません。余韻です。", location: "THE FIRST GX / ANCIENT OCEAN" },
    { type: "line", speaker: "sora", expression: "calm", mode: 0, kind: "SOURCE", signal: "GREEN TRANSFORMATION ≠ GAIA TRANSFORMATION", text: "ホーン？　でも、それがどうしてGXになるの。脱炭素の技術とは、ずいぶん遠いよね。", location: "THE FIRST GX / ENTRY" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 0, kind: "DERIVED", signal: "GX / GAIA TRANSFORMATION", text: "この作品のGXは、GreenではなくGaia Transformation。人間が地球を変えるだけでなく、変えた地球から人間も変え返される。その関係まで含めた転換ですわ。", location: "THE FIRST GX / ENTRY" },
    { type: "line", speaker: "sora", expression: "soft", mode: 0, kind: "DERIVED", signal: "人間も地球の関係の中にいる", text: "つまり、人間を地球の外に立たせない。そのために、人間より前の変革から見るんだね。", location: "THE FIRST GX / ENTRY" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 0, kind: "DERIVED", signal: "THE FIRST GX / CO-EVOLUTION", text: "その通り。地球改造の第一号を人間だと思うと、また身の程知らずな設計図を描きますから。", location: "THE FIRST GX / ENTRY" },
    { type: "gx", mode: 0, location: "THE FIRST GX / INTERACTIVE RECORD" },
    { type: "line", speaker: "narrator", mode: 0, kind: "SCENARIO", signal: "VISITOR TRACE / NOT OBSERVATION DATA", text: "太古の海へ置いた光と、結び直した線だけが、観客の軌跡として残った。それは過去の記録ではなく、いま加わった応答だった。", location: "THE FIRST GX / RETURN" },

    { type: "chapter", chapter: "CHAPTER 01", title: "世界は、ばらばらに見えてつながっている", mode: 1, location: "青い循環系" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 1, kind: "SOURCE", signal: "NOAA海流 × NASA風", text: "海は国境を読みませんし、風もパスポートを持ちません。問題だけ国の枠へ切って安心するとは、ずいぶんベンリネスな整理ですわね。", location: "GAIA SENSEWARE / 02" },
    { type: "line", speaker: "sora", expression: "exasperated", mode: 1, kind: "SOURCE", signal: "流速と風向は別レイヤー", text: "褒めてないね、それ。", location: "GAIA SENSEWARE / 02" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 1, kind: "SOURCE", signal: "熱と水の惑星循環", text: "ええ。ただし、つながりは責任が無限に増える話ではありませんの。届いたものを、次へどう渡すか。海流と同じですわ。", location: "GAIA SENSEWARE / 02" },
    { type: "line", speaker: "sakuya", mode: 2, kind: "SOURCE", signal: "制作ログ 2025-08-17", text: "森を背景にしないでね。雨を呼んで、土を抱いて、気温を変える。森は景色じゃなくて、働いている装置だから。", location: "サクヤの音声メモ / 保存部分" },
    { type: "line", speaker: "sora", expression: "soft", mode: 2, kind: "SOURCE", signal: "NASA MODIS土地被覆 × NASA POWER降水", text: "このメモは本物だよ。何度も聞いた。最後だけ、音が欠けてる。", location: "GAIA SENSEWARE / 03" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 2, kind: "DERIVED", signal: "欠測は欠測として表示", text: "ええ、4.8秒。私はその空白を埋められます。統計的には、かなり自然な続きを作れますの。", location: "AUDIO GAP / 4.8 SEC" },
    { type: "line", speaker: "sora", expression: "calm", mode: 2, kind: "DERIVED", signal: "自然らしさ ≠ 事実", text: "自然に聞こえるだけじゃ、事実にはならない。", location: "AUDIO GAP / 4.8 SEC" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 2, kind: "DERIVED", signal: "自然らしさ ≠ 事実", text: "ええ。だから、あなたに決めてほしい。聞きたい気持ちと、事実を守ること。その間の線は、計算だけでは引けませんの。", location: "AUDIO GAP / 4.8 SEC" },

    { type: "chapter", chapter: "CHAPTER 02", title: "人間は、地球の外側には立てない", mode: 3, location: "共進化プロトコル" },
    { type: "line", speaker: "narrator", mode: 3, kind: "SOURCE", signal: "GloBI × GBIF / 記録された関係", text: "花と虫を結ぶ線が、暗い地球に灯った。どちらかが一方を設計したのではない。互いの存在が、互いの形を変えてきた。", location: "GAIA SENSEWARE / 04" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 3, kind: "SOURCE", signal: "関係が確認できる記録だけを結ぶ", text: "共創は、仲良しの別名ではありませんの。食べる、逃げる、運ぶ、奪う。それでも長い時間の中で、相手がいる形へ変わってしまうことですわ。", location: "GAIA SENSEWARE / 04" },
    { type: "line", speaker: "sora", expression: "calm", mode: 4, kind: "SOURCE", signal: "UN SDG 12.5.1 / 廃棄物処理", text: "人間、使い終えたものを関係の外へ捨てられると思ってきた。", location: "GAIA SENSEWARE / 05" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 4, kind: "SCENARIO", signal: "処理経路の変更は仮想状態", text: "ところが『外』はありませんでした。捨てた先にも土と水と誰かの暮らしがある。地球へ無限収納を要求するの、困りますの。", location: "GAIA SENSEWARE / 05" },
    { type: "line", speaker: "sora", expression: "exasperated", mode: 4, kind: "SCENARIO", signal: "現状値と仮想経路を分ける", text: "惑星にクローゼット要求するの、やめてね。", location: "GAIA SENSEWARE / 05" },
    { type: "line", speaker: "sakuya", mode: 5, kind: "SOURCE", signal: "制作ログ 2025-09-02", text: "夜の光はきれい。でも、きれいだからこそ、その下の排出量を重ねたい。繁栄を悪者にするんじゃなくて、見えない負荷を透明にしたい。", location: "サクヤの音声メモ / 保存部分" },
    { type: "line", speaker: "narrator", mode: 5, kind: "SOURCE", signal: "VIIRS夜間光 ≠ EDGAR排出量", text: "白い都市光の下に、赤い排出の環が浮かぶ。似て見える二つの地図は、同じ意味ではない。光は排出量そのものではない。美しさも罪そのものではない。", location: "GAIA SENSEWARE / 06" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 5, kind: "SOURCE", signal: "比較して、混同しない", text: "サクヤは、私たちにも同じことを言いたかったのかもしれません。残された記録と、その人の全部を、似ているからと混ぜないで、と。", location: "GAIA SENSEWARE / 06" },

    { type: "chapter", chapter: "CHAPTER 03", title: "届かなかった4.8秒", mode: 6, location: "地球からのメッセージ" },
    { type: "line", speaker: "narrator", mode: 6, kind: "SOURCE", signal: "JMA震度記録 / P波・S波", text: "震源から水色の輪が走り、遅れて橙の輪が追う。P波とS波には速度がある。けれど、喪失が届く速さには、単位がない。", location: "GAIA SENSEWARE / 07" },
    { type: "line", speaker: "sora", expression: "soft", mode: 6, kind: "SOURCE", signal: "観測された到達と、受け取るまでの時間", text: "サクヤが来ないと気づいた朝も、この画面を作ってた。メッセージは夜中に届いてた。開いたのは、待ち合わせのあとだった。", location: "未読だったメッセージ" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 6, kind: "SOURCE", signal: "記録は残っても、本人の代わりにはならない", text: "記録は過去を保存します。でも、相手の全部を説明する装置ではありません。観測点の数字が、その場所の痛み全部にはなれないのと同じです。", location: "GAIA SENSEWARE / 07" },
    { type: "choice", id: "gap_decision", prompt: "欠けた音声の4.8秒を、どう扱いますか？", choices: [
      { text: "空白のまま、最後まで聞く", goto: "gap_source", flag: "kept_gap" },
      { text: "推定だと表示して、続きを補う", goto: "gap_derived", flag: "heard_imputation" },
    ] },
    { type: "label", label: "gap_source" },
    { type: "line", speaker: "sakuya", mode: 6, kind: "SOURCE", signal: "ORIGINAL AUDIO / 末尾4.8秒は欠測", text: "もし地球の声が聞こえたら、答えを教えてもらうんじゃなくて――……。", location: "サクヤの音声メモ / SOURCE" },
    { type: "line", speaker: "narrator", mode: 6, kind: "SOURCE", signal: "NO DATA / 空白を保存", text: "そこで音は切れた。無音は何も語らなかった。けれど、語らなかったことまで勝手に奪わない静けさがあった。", location: "AUDIO GAP / NO DATA" },
    { type: "jump", target: "after_gap" },
    { type: "label", label: "gap_derived" },
    { type: "line", speaker: "sakuya", mode: 6, kind: "DERIVED", signal: "FICTIONAL IMPUTATION / 本人の発話ではない", text: "もし地球の声が聞こえたら、答えを教えてもらうんじゃなくて、私たちが何を返せるか、一緒に考えたい。", location: "推定された続き / DERIVED" },
    { type: "line", speaker: "sora", expression: "soft", mode: 6, kind: "DERIVED", signal: "もっともらしさは、真実の証明ではない", text: "言いそうだから困る。サクヤが実際に言った声じゃない。でも、私たちが一緒に考えたかったことの形ではある。", location: "推定された続き / DERIVED" },
    { type: "label", label: "after_gap" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 6, kind: "DERIVED", signal: "補完値には出自を残す", text: "ええ。空白を残すことも、補って印をつけることも、誠実になれます。いちばん危ないのは、補った事実を忘れて『最初から真実だった』と言い始めることですの。", location: "STATISTICAL ETHICS" },

    { type: "chapter", chapter: "CHAPTER 04", title: "未来は、予測線の先にある", mode: 7, location: "三つの生態系" },
    { type: "line", speaker: "narrator", mode: 7, kind: "SOURCE", signal: "生態・社会・記憶の三層", text: "森の層、都市の層、記憶の層が重なった。人が生きる場所は、自然だけでも社会だけでも、心だけでもできていない。", location: "GAIA SENSEWARE / 08" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 7, kind: "SCENARIO", signal: "大切な場所は数値化しない", text: "サクヤの不在を、一つの理由へ畳まなくてよかったですわね。地球の健康も、七十点という一個の数字にしなくてよかった。矛盾したまま残るものには、残る理由があります。", location: "GAIA SENSEWARE / 08" },
    { type: "line", speaker: "sora", expression: "calm", mode: 8, kind: "SOURCE", signal: "自然エネルギー潜在量と現状供給", text: "予測線おるなあ。でも、これまでの傾向を延ばしただけ。未来そのものじゃない。", location: "GAIA SENSEWARE / 09" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 8, kind: "SCENARIO", signal: "二地点を結ぶ仮想ネットワーク", text: "ええ、未来はまだ観測されていません。だから予測を捨てず、仮定を書き、選び直せる形にするんですの。", location: "GAIA SENSEWARE / 09" },
    { type: "line", speaker: "earth", mode: 9, kind: "SOURCE", signal: "01〜09の信号が同時に残る", text: "――――――――――――――――。", location: "GAIA SENSEWARE / 10" },
    { type: "line", speaker: "sora", expression: "startled", mode: 9, kind: "SOURCE", signal: "沈黙も観測結果の一部", text: "地球、何て言った？", location: "GAIA SENSEWARE / 10" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 9, kind: "SOURCE", signal: "データは命令ではなく信号", text: "何も。私は地球の翻訳機であって、代弁者ではありません。データは命令しない。どう応えるかを決めるのは、生きている側ですわ。", location: "GAIA SENSEWARE / 10" },
    { type: "line", speaker: "sora", expression: "calm", mode: 9, kind: "SCENARIO", signal: "観客の選択が新しい入力になる", text: "ほいじゃ、最後の台詞は観客に渡そう。サクヤの空白を勝手な答えで閉じず、次の人が言葉を置ける場所にする。", location: "未完の地球センスウェア" },
    { type: "choice", id: "final_decision", prompt: "この空白へ、あなたは何を残しますか？", choices: [
      { text: "空白を守り、観測を続ける", goto: "END_SOURCE" },
      { text: "想像には印をつけ、語り継ぐ", goto: "END_DERIVED" },
      { text: "2050年の誰かへ、約束を残す", goto: "END_SCENARIO" },
    ] },

    { type: "label", label: "END_SOURCE" },
    { type: "line", speaker: "narrator", mode: 9, kind: "SOURCE", signal: "TRUE END / THE GAP REMAINS", text: "展示の最後に、4.8秒の空白が残った。誰の言葉にも置き換えられなかった場所で、新しい観客の足音だけが記録されていく。", location: "ENDING / SOURCE" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 9, kind: "SOURCE", signal: "観測を続ける", text: "ええ。空白は欠陥ではなかったんですのね。まだ来ていない誰かの席でした。", location: "ENDING / SOURCE" },
    { type: "end", mode: 9, title: "THE LISTENING CONTINUES", subtitle: "空白を守り、観測を続ける朝", kind: "SOURCE" },

    { type: "label", label: "END_DERIVED" },
    { type: "line", speaker: "narrator", mode: 9, kind: "DERIVED", signal: "GOOD END / A LABELED MEMORY", text: "補われた言葉の横には、消えない文字でDERIVEDと表示された。それは本人の言葉ではなく、残された私たちが作った、やさしい仮説だった。", location: "ENDING / DERIVED" },
    { type: "line", speaker: "sora", expression: "soft", mode: 9, kind: "DERIVED", signal: "想像と事実を分けて抱える", text: "本物じゃないから捨てる、ではないね。本物じゃないと知ったまま、大切にすることもできる。", location: "ENDING / DERIVED" },
    { type: "end", mode: 9, title: "A GENTLE HYPOTHESIS", subtitle: "想像に印をつけ、語り継ぐ朝", kind: "DERIVED" },

    { type: "label", label: "END_SCENARIO" },
    { type: "line", speaker: "narrator", mode: 9, kind: "SCENARIO", signal: "SCENARIO END / 2050", text: "2050年の表示へ、短い文章を置いた。『ここまでの線は予測です。ここから先は、あなたが参加した結果です』。", location: "ENDING / SCENARIO" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 9, kind: "SCENARIO", signal: "未来は選び直せる", text: "未来の人に、当たったか外れたかだけを問われないといいですわね。何を変えようとしたのかも、きちんと届いてほしい。", location: "ENDING / SCENARIO" },
    { type: "end", mode: 9, title: "TO SOMEONE IN 2050", subtitle: "未来へ約束を残す朝", kind: "SCENARIO" },
  ];

  const layer = document.querySelector("#novel-layer");
  if (!layer) return;

  const runSceneTransition = (swapScene, event = null) => {
    const transition = window.GaiaSceneTransition;
    const hasPointerOrigin = Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY) &&
      (event.clientX !== 0 || event.clientY !== 0);
    if (!transition) return Promise.resolve(swapScene());
    return transition.run(swapScene, {
      tone: "novel",
      origin: hasPointerOrigin ? { x: event.clientX, y: event.clientY } : undefined,
    });
  };
  const ENDING_RETURN_DELAY_MS = REDUCED_MOTION ? 2400 : 6200;

  const elements = {
    particles: layer.querySelector("#novel-particles"),
    titleCast: layer.querySelector("#novel-title-cast"),
    titleScreen: layer.querySelector("#novel-title-screen"),
    runtime: layer.querySelector("#novel-runtime"),
    start: layer.querySelector("#novel-start-button"),
    resume: layer.querySelector("#novel-resume-button"),
    close: layer.querySelector("#novel-close-button"),
    restart: layer.querySelector("#novel-restart-button"),
    auto: layer.querySelector("#novel-auto-button"),
    logButton: layer.querySelector("#novel-log-button"),
    logPanel: layer.querySelector("#novel-log-panel"),
    logClose: layer.querySelector("#novel-log-close"),
    logContent: layer.querySelector("#novel-log-content"),
    evesButton: layer.querySelector("#novel-eves-button"),
    evesCount: layer.querySelector("#novel-eves-count"),
    evesPanel: layer.querySelector("#novel-eves-panel"),
    evesClose: layer.querySelector("#novel-eves-close"),
    evesCurrent: layer.querySelector("#novel-eves-current"),
    evesGraph: layer.querySelector("#novel-eves-graph"),
    evesHistory: layer.querySelector("#novel-eves-history"),
    evesRewind: layer.querySelector("#novel-eves-rewind"),
    modeReadout: layer.querySelector("#novel-mode-readout"),
    progress: layer.querySelector("#novel-progress-bar"),
    chapterCard: layer.querySelector("#novel-chapter-card"),
    chapterIndex: layer.querySelector("#novel-chapter-index"),
    chapterTitle: layer.querySelector("#novel-chapter-title"),
    cast: layer.querySelector("#novel-cast"),
    characterSora: layer.querySelector("#novel-character-sora"),
    characterMinamo: layer.querySelector("#novel-character-minamo"),
    avatar: layer.querySelector("#novel-avatar"),
    avatarGlyph: layer.querySelector("#novel-avatar-glyph"),
    dataKind: layer.querySelector("#novel-data-kind"),
    signalTitle: layer.querySelector("#novel-signal-title"),
    sourceButton: layer.querySelector("#novel-source-button"),
    sourcePanel: layer.querySelector("#novel-source-panel"),
    sourceClose: layer.querySelector("#novel-source-close"),
    sourcePanelKind: layer.querySelector("#novel-source-panel-kind"),
    sourcePanelTitle: layer.querySelector("#novel-source-panel-title"),
    sourcePanelDescription: layer.querySelector("#novel-source-panel-description"),
    sourcePanelRule: layer.querySelector("#novel-source-panel-rule"),
    sourcePanelLocation: layer.querySelector("#novel-source-panel-location"),
    sourcePanelNote: layer.querySelector("#novel-source-panel-note"),
    dialogue: layer.querySelector("#novel-dialogue"),
    speaker: layer.querySelector("#novel-speaker"),
    text: layer.querySelector("#novel-text"),
    cursor: layer.querySelector("#novel-cursor"),
    continueMark: layer.querySelector("#novel-continue"),
    choices: layer.querySelector("#novel-choices"),
    location: layer.querySelector("#novel-location"),
  };

  const KIND_NOTES = Object.freeze({
    SOURCE: "場面の台詞と登場人物はフィクションです。現象や公開記録についての説明と、物語上の出来事を混同しないように分けて読んでください。",
    DERIVED: "ここには公開記録から導いた解釈が含まれます。元データそのものではなく、作品がどの関係に注目したかを示す説明です。",
    SCENARIO: "ここで扱う結果は観客の選択や仮定から生まれる物語上の可能性です。観測済みの事実や未来予報ではありません。",
  });

  const MODE_CONTENT = Object.freeze({
    0: {
      summary: "生命がつくり出した酸素は海や大気の化学状態を変え、その後の生命が生きられる条件そのものを組み替えました。",
      reading: "生命が環境へ一方的に適応するだけでなく、生命が環境を変え、変わった環境が生命を選び返す相互作用を扱います。",
      evidence: "ストロマトライト、縞状鉄鉱層、赤色層など、初期生命と酸化の変化を残す地質記録。",
    },
    1: {
      summary: "海流と風は国境を越えて熱や水分を運び、離れた地域の気候や海の状態を結びつけます。",
      reading: "一地点の変化が流れに乗って別の場所へ届くことと、つながりを『責任が無限に増えること』ではなく次へ渡す関係として読みます。",
      evidence: "NOAAの海流情報とNASAの風データを別レイヤーとして重ねた循環の記録。",
    },
    2: {
      summary: "森林は雨を受ける背景ではなく、水を保持し、蒸発散で大気へ戻し、地表温度にも影響する働き手です。",
      reading: "森林分布と降水量を重ね、森と気候が互いに影響し合う関係を、単純な因果関係に決めつけずに見ます。",
      evidence: "NASA MODISの土地被覆とNASA POWERの降水データ。サクヤの音声メモは物語上の記録です。",
    },
    3: {
      summary: "花と送粉者は、食べる・運ぶ・逃げるといった相互作用を長く重ねる中で、互いがいる環境に適した形へ変化してきました。",
      reading: "共創を『仲良し』と同一視せず、利益・競争・依存を含む関係が双方の形を変える共進化として扱います。",
      evidence: "GloBIに記録された生物間相互作用と、GBIFの生物出現記録。確認できる関係だけを結びます。",
    },
    4: {
      summary: "捨てたものは地球の外へ消えず、埋立・焼却・再資源化などの経路を通って、別の土地や水や暮らしへつながります。",
      reading: "廃棄物の量だけでなく、その後どこへ渡されるかを見て、『外へ捨てる』という考え方そのものを問い直します。",
      evidence: "国連SDG指標12.5.1の再資源化率。処理経路を変える操作は作品内の仮想状態です。",
    },
    5: {
      summary: "宇宙から見える都市の夜間光と温室効果ガス排出量は、関連して見える場合があっても同じ指標ではありません。",
      reading: "明るさを繁栄や排出の代理値として短絡せず、美しさ・活動量・環境負荷を別々の記録として比較します。",
      evidence: "VIIRSの夜間光データとEDGARの排出量データ。二つのレイヤーは合算せず並べて表示します。",
    },
    6: {
      summary: "地震波には観測できる到達時間がありますが、記録を受け取り意味を理解するまでの時間は数値だけでは表せません。",
      reading: "届いた信号と、受け取る側の時間を重ねながら、記録が残っても出来事や人の全体を説明できるわけではないことを扱います。",
      evidence: "気象庁の地震・震度記録とP波・S波の到達差。欠けた音声は物語上の記録です。",
    },
    7: {
      summary: "人が暮らす場所は、森林などの生態系、都市や制度の社会系、文化や記憶の層が重なってできています。",
      reading: "異なる尺度の記録を一つの健康点数へ潰さず、矛盾や欠けを残したまま並べて読む方法を示します。",
      evidence: "森林・都市・文化に関する公開記録を、意味の異なる三つの層として表示します。",
    },
    8: {
      summary: "日射や風の潜在量と、現在利用されている再生可能電力は同じものではありません。設備・送電・需要などの条件で差が生まれます。",
      reading: "予測線を未来そのものとせず、置いた仮定を明示し、条件を変えて選び直せる設計として扱います。",
      evidence: "各地の日射・風況の推定値と現在の再生可能電力。地点を結ぶ線は作品内の仮想ネットワークです。",
    },
    9: {
      summary: "九つの異なる地球観測データを重ねても、地球から一つの命令や台詞が得られるわけではありません。",
      reading: "データを地球の『信号』として受け取りつつ、意味づけと応答の責任は観測する人間側に残ることを示します。",
      evidence: "01〜09で用いた公開記録と、鑑賞中に触れた軌跡。異なる単位の値は一つの点数へ合算しません。",
    },
  });

  const SIGNAL_CONTENT = [
    {
      match: /ONLINE CLASS|FIRST MEETING|同じ声|画面の外|HELLO|THREE SEATS|LAST ONLINE|VISITOR/u,
      summary: "オンラインで共同制作してきた二人が、画面の外で初めて会い、返事のない三人目の席と向き合う導入です。",
      reading: "声や文章を知っていることと、その人の全体を知っていることの差を、対面の距離と空席によって示します。",
      evidence: "週次授業、制作ログ、最終メッセージは物語上の設定であり、実在する個人の記録ではありません。",
    },
    {
      match: /CYANOBACTERIA|OXYGENIC|GREAT OXIDATION|酸素|DEEP TIME RECORD/u,
      summary: "約25億年前以降、酸素発生型光合成を行う微生物が生んだ酸素は、まず海中の鉄などと反応し、やがて大気へ蓄積していきました。",
      reading: "現在の呼吸を支える酸素も、当時の嫌気性生物には有害でした。生命が環境を変え、その環境が生命の生存条件を変え返す出来事として扱います。",
      evidence: "酸素と鉄の反応が残した縞状鉄鉱層、その後の陸上酸化を示す赤色層などの地質記録。",
      note: "年代や変化の進み方には研究上の幅があります。この作品では原生代にわたる長い酸化の変化を一つの場面へ圧縮しています。",
    },
    {
      match: /GREEN TRANSFORMATION|GAIA TRANSFORMATION|CO-EVOLUTION|人間以前/u,
      summary: "この作品のGXはGreen Transformationだけでなく、生命・環境・技術が互いを変え返すGaia Transformationとして構想しています。",
      reading: "人間だけを地球の外側に置く設計図ではなく、人間の活動で変わった環境から、人間の暮らしや技術も変え返される関係を見ます。",
      evidence: "初期生命による酸素化から現在の人工物までを連続した地球史として並べた、作品独自の概念構成。",
    },
    {
      match: /AUDIO GAP|ORIGINAL AUDIO|NO DATA|自然らしさ|もっともらしさ|STATISTICAL ETHICS|補完値|未読/u,
      summary: "サクヤの音声は末尾4.8秒が欠けています。統計的に自然な続きを作ることはできても、それが本人の発言だったことにはなりません。",
      reading: "欠測を空白のまま残す方法と、補完したうえで由来を明示する方法の両方を示し、『自然らしさ』と事実を区別します。",
      evidence: "音声の欠測部分と、そこから作る補完文は物語上の設定です。SOURCEとDERIVEDの境界を考えるための場面です。",
    },
    {
      match: /選択は観測値ではなく/u,
      summary: "ここでは観客の選択が物語の次の状態を決めます。選択結果は外部で観測された値ではなく、この作品の中で新しく生まれる入力です。",
      reading: "どの選択をしたかだけでなく、その選択がどの仮定から生まれたかを経路として残します。",
      evidence: "E.V.E.S.に保存される分岐履歴。選択内容は公開データではなく観客が作るシナリオです。",
    },
    {
      match: /結論ではなく/u,
      summary: "この終点は唯一の正解ではなく、観客が選んだ経路から生まれた一つの結末です。",
      reading: "予測が当たったかだけで閉じず、何を変えようとしたかを次の人へ渡すことを物語の最後の入力にします。",
      evidence: "鑑賞中の選択履歴と、最後に残した約束から構成される物語上の終点。",
    },
  ];

  const getSceneContent = ({ kind = "SOURCE", signal = "", text = "", mode } = {}) => {
    const matched = SIGNAL_CONTENT.find((entry) => entry.match.test(signal));
    const content = matched || MODE_CONTENT[mode] || {
      summary: `この場面では「${signal || "地球から届く信号"}」が示す出来事を扱います。`,
      reading: text || "表示された記録が、物語の中でどの関係を示しているかを読みます。",
      evidence: "場面名と信号名に示された公開記録、または物語上の保存記録。",
    };
    return {
      ...content,
      note: content.note || KIND_NOTES[kind] || KIND_NOTES.SOURCE,
    };
  };

  const particleSystem = window.GaiaParticles?.create?.(elements.particles, {
    variant: "story",
    intensity: 0.78,
  }) || { start() {}, stop() {} };

  const labels = new Map();
  STORY.forEach((step, index) => {
    if (step.type === "label") labels.set(step.label, index);
  });

  let isOpen = false;
  let hasStarted = false;
  let stepIndex = 0;
  let flags = [];
  let backlog = [];
  let routeHistory = [];
  let activeDecisionId = "";
  let revealTimer = 0;
  let revealFrame = 0;
  let revealGeneration = 0;
  let chapterTimer = 0;
  let autoTimer = 0;
  let endingTimer = 0;
  let endingReturnPending = false;
  let isRevealing = false;
  let fullText = "";
  let previousFocus = null;
  let lastIllustratedPresentation = null;

  const clearTimers = () => {
    revealGeneration += 1;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    window.clearTimeout(chapterTimer);
    window.clearTimeout(autoTimer);
    window.clearTimeout(endingTimer);
    revealTimer = 0;
    revealFrame = 0;
    chapterTimer = 0;
    autoTimer = 0;
    endingTimer = 0;
  };

  const setCharacterPresentation = (speaker, requestedExpression) => {
    elements.cast.dataset.speaker = speaker;
    const character = CHARACTERS[speaker];
    const isIllustratedCharacter = speaker === "sora" || speaker === "minamo";
    elements.avatar.hidden = isIllustratedCharacter || speaker === "chapter";
    if (!isIllustratedCharacter) return;

    const expression = character.expressions.includes(requestedExpression)
      ? requestedExpression
      : character.defaultExpression;
    lastIllustratedPresentation = { speaker, expression };
    const figure = speaker === "sora" ? elements.characterSora : elements.characterMinamo;
    figure.dataset.expression = expression;
    figure.classList.remove("is-changing");
    if (!REDUCED_MOTION) {
      void figure.offsetWidth;
      figure.classList.add("is-changing");
    }
  };

  const getPreviousIllustratedPresentation = () => {
    if (lastIllustratedPresentation) return lastIllustratedPresentation;
    for (let index = stepIndex - 1; index >= 0; index -= 1) {
      const candidate = STORY[index];
      if (candidate?.speaker !== "sora" && candidate?.speaker !== "minamo") continue;
      const character = CHARACTERS[candidate.speaker];
      const expression = character.expressions.includes(candidate.expression)
        ? candidate.expression
        : character.defaultExpression;
      return { speaker: candidate.speaker, expression };
    }
    return null;
  };

  const getStoredProgress = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || !Number.isInteger(parsed.stepIndex)) return null;
      return {
        stepIndex: Math.max(0, Math.min(STORY.length - 1, parsed.stepIndex)),
        flags: Array.isArray(parsed.flags) ? parsed.flags : [],
        backlog: Array.isArray(parsed.backlog) ? parsed.backlog.slice(-80) : [],
        routeHistory: Array.isArray(parsed.routeHistory) ? parsed.routeHistory.slice(-2) : [],
        activeDecisionId: typeof parsed.activeDecisionId === "string" ? parsed.activeDecisionId : "",
      };
    } catch {
      return null;
    }
  };

  const saveProgress = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stepIndex,
        flags,
        backlog: backlog.slice(-80),
        routeHistory,
        activeDecisionId,
      }));
    } catch {
      // The story remains playable when storage is unavailable.
    }
  };

  const getCurrentChapter = () => {
    for (let index = Math.min(stepIndex, STORY.length - 1); index >= 0; index -= 1) {
      if (STORY[index]?.type === "chapter") return STORY[index];
    }
    return null;
  };

  const selectMode = (mode) => {
    if (!Number.isInteger(mode)) return;
    const currentChapter = getCurrentChapter();
    elements.modeReadout.textContent = currentChapter?.chapter === "PROLOGUE"
      ? `PROLOGUE — ${currentChapter.title}`
      : MODE_TITLES[mode] || MODE_TITLES[0];
    window.dispatchEvent(new CustomEvent("gaia:select-mode", { detail: { index: mode, source: "novel" } }));
  };

  const updateProgress = () => {
    elements.progress.style.width = `${Math.max(2, ((stepIndex + 1) / STORY.length) * 100)}%`;
  };

  const renderLog = () => {
    elements.logContent.replaceChildren();
    [...backlog].reverse().forEach((entry) => {
      const article = document.createElement("article");
      const header = document.createElement("p");
      const text = document.createElement("p");
      article.dataset.kind = entry.kind || "SOURCE";
      header.textContent = `${entry.speaker} / ${entry.kind || "SOURCE"}`;
      text.textContent = entry.text;
      article.append(header, text);
      elements.logContent.append(article);
    });
  };

  const closeLog = () => {
    elements.logPanel.hidden = true;
    elements.logPanel.setAttribute("aria-hidden", "true");
    elements.logButton.setAttribute("aria-expanded", "false");
  };

  const toggleLog = () => {
    const willOpen = elements.logPanel.hidden;
    if (willOpen) {
      closeEves();
      closeSourceDetails();
      renderLog();
      elements.logPanel.hidden = false;
      elements.logPanel.setAttribute("aria-hidden", "false");
      elements.logButton.setAttribute("aria-expanded", "true");
      elements.logClose.focus({ preventScroll: true });
    } else {
      closeLog();
      elements.logButton.focus({ preventScroll: true });
    }
  };

  const EVES_NODES = Object.freeze({
    intro: "物語の入口",
    gap_decision: "欠けた4.8秒",
    gap_source: "空白を保存",
    gap_derived: "推定を明記",
    final_decision: "未来への応答",
    END_SOURCE: "観測を続ける",
    END_DERIVED: "印をつけて語る",
    END_SCENARIO: "2050年へ約束する",
  });

  const getVisitedRoute = () => {
    const visited = ["intro"];
    routeHistory.forEach((entry, index) => {
      visited.push(entry.decisionId, entry.to);
      if (index === 0 && (routeHistory.length > 1 || activeDecisionId === "final_decision")) {
        visited.push("final_decision");
      }
    });
    if (activeDecisionId) visited.push(activeDecisionId);
    return [...new Set(visited)];
  };

  const renderEvesGraph = () => {
    if (!elements.evesGraph) return;
    const visited = getVisitedRoute();
    const visitedIndex = new Map(visited.map((node, index) => [node, index + 1]));
    const activeEdges = new Set(routeHistory.map((entry) => `${entry.decisionId}-${entry.to}`));
    if (routeHistory[0]) activeEdges.add(`${routeHistory[0].to}-final_decision`);
    const nodeMarkup = [
      ["intro", 24, 151, 112, 58, "START"],
      ["gap_decision", 174, 151, 144, 58, "DECISION 01"],
      ["gap_source", 370, 61, 128, 58, "SOURCE"],
      ["gap_derived", 370, 241, 128, 58, "DERIVED"],
      ["final_decision", 544, 151, 150, 58, "DECISION 02"],
      ["END_SOURCE", 770, 31, 134, 58, "ENDING A"],
      ["END_DERIVED", 770, 151, 134, 58, "ENDING B"],
      ["END_SCENARIO", 770, 271, 134, 58, "ENDING C"],
    ].map(([id, x, y, width, height, eyebrow]) => {
      const classes = ["eves-node"];
      if (visitedIndex.has(id)) classes.push("is-visited");
      if (activeDecisionId === id) classes.push("is-current");
      const badge = visitedIndex.has(id)
        ? `<text class="eves-node-order" x="${Number(x) + Number(width) - 15}" y="${Number(y) + 18}">${String(visitedIndex.get(id)).padStart(2, "0")}</text>`
        : "";
      return `<g class="${classes.join(" ")}" data-node="${id}">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8"></rect>
        <text class="eves-node-eyebrow" x="${Number(x) + 13}" y="${Number(y) + 18}">${eyebrow}</text>
        <text class="eves-node-label" x="${Number(x) + 13}" y="${Number(y) + 40}">${EVES_NODES[id]}</text>
        ${badge}
      </g>`;
    }).join("");
    const edge = (id, d, label, x, y) => `<g class="eves-edge ${activeEdges.has(id) ? "is-active" : ""}">
      <path d="${d}"></path><text x="${x}" y="${y}">${label}</text>
    </g>`;
    elements.evesGraph.innerHTML = `<svg viewBox="0 0 928 360" role="img" aria-label="選択によって分岐する物語の経路図">
      <defs><filter id="eves-glow"><feGaussianBlur stdDeviation="3.4" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs>
      ${edge("intro-gap_decision", "M136 180 H174", "", 0, 0)}
      ${edge("gap_decision-gap_source", "M318 170 C342 170 342 90 370 90", "空白を残す", 315, 116)}
      ${edge("gap_decision-gap_derived", "M318 190 C342 190 342 270 370 270", "推定を明記", 315, 251)}
      ${edge("gap_source-final_decision", "M498 90 C522 90 520 170 544 170", "", 0, 0)}
      ${edge("gap_derived-final_decision", "M498 270 C522 270 520 190 544 190", "", 0, 0)}
      ${edge("final_decision-END_SOURCE", "M694 169 C732 169 730 60 770 60", "観測を続ける", 687, 96)}
      ${edge("final_decision-END_DERIVED", "M694 180 H770", "語り継ぐ", 706, 169)}
      ${edge("final_decision-END_SCENARIO", "M694 191 C732 191 730 300 770 300", "2050年へ", 704, 276)}
      ${nodeMarkup}
    </svg>`;
  };

  const renderEves = () => {
    if (!elements.evesButton) return;
    elements.evesCount.textContent = `${routeHistory.length} / 2`;
    const currentId = activeDecisionId || routeHistory.at(-1)?.to || "intro";
    elements.evesCurrent.textContent = EVES_NODES[currentId] || "物語を観測中";
    elements.evesHistory.replaceChildren();
    if (!routeHistory.length) {
      const item = document.createElement("li");
      item.className = "is-empty";
      item.innerHTML = "<span>NO VARIANT YET</span><strong>最初の分岐は、欠けた4.8秒の扱いです。</strong>";
      elements.evesHistory.append(item);
    } else {
      routeHistory.forEach((entry, index) => {
        const item = document.createElement("li");
        item.innerHTML = `<span>VARIANT ${String(index + 1).padStart(2, "0")}</span><strong>${entry.choiceText}</strong><small>${EVES_NODES[entry.decisionId]} → ${EVES_NODES[entry.to]}</small>`;
        elements.evesHistory.append(item);
      });
    }
    elements.evesRewind.disabled = routeHistory.length === 0;
    renderEvesGraph();
  };

  const closeEves = () => {
    if (!elements.evesPanel) return;
    elements.evesPanel.hidden = true;
    elements.evesPanel.setAttribute("aria-hidden", "true");
    elements.evesButton.setAttribute("aria-expanded", "false");
  };

  const updateSourceDetails = (step = {}) => {
    const { kind = "SOURCE", signal } = step;
    const normalizedKind = KIND_NOTES[kind] ? kind : "SOURCE";
    const content = getSceneContent({ ...step, kind: normalizedKind });
    const title = signal || "公開データは、地球が発している信号である。";

    elements.sourcePanelKind.textContent = normalizedKind;
    elements.sourcePanelKind.dataset.kind = normalizedKind;
    elements.sourcePanelTitle.textContent = title;
    elements.sourcePanelDescription.textContent = content.summary;
    elements.sourcePanelRule.textContent = content.reading;
    elements.sourcePanelLocation.textContent = content.evidence;
    elements.sourcePanelNote.textContent = content.note;
    elements.sourceButton.setAttribute("aria-label", `この場面の内容説明を開く：${title}`);
  };

  const revealSourceSignal = () => {
    elements.sourceButton.classList.remove("is-signal-reveal");
    if (REDUCED_MOTION) return;
    void elements.sourceButton.offsetWidth;
    elements.sourceButton.classList.add("is-signal-reveal");
  };

  const closeSourceDetails = ({ restoreFocus = false } = {}) => {
    if (!elements.sourcePanel || elements.sourcePanel.hidden) return;
    elements.sourcePanel.hidden = true;
    elements.sourcePanel.setAttribute("aria-hidden", "true");
    elements.sourceButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) elements.sourceButton.focus({ preventScroll: true });
  };

  const toggleSourceDetails = () => {
    const willOpen = elements.sourcePanel.hidden;
    if (willOpen) {
      closeLog();
      closeEves();
      elements.sourcePanel.hidden = false;
      elements.sourcePanel.setAttribute("aria-hidden", "false");
      elements.sourceButton.setAttribute("aria-expanded", "true");
      elements.sourceClose.focus({ preventScroll: true });
    } else {
      closeSourceDetails({ restoreFocus: true });
    }
  };

  const toggleEves = () => {
    const willOpen = elements.evesPanel.hidden;
    if (willOpen) {
      closeLog();
      closeSourceDetails();
      renderEves();
      elements.evesPanel.hidden = false;
      elements.evesPanel.setAttribute("aria-hidden", "false");
      elements.evesButton.setAttribute("aria-expanded", "true");
      elements.evesClose.focus({ preventScroll: true });
    } else {
      closeEves();
      elements.evesButton.focus({ preventScroll: true });
    }
  };

  const rewindEves = () => {
    const entry = routeHistory.pop();
    if (!entry) return;
    stepIndex = entry.decisionStepIndex;
    flags = [...entry.flagsBefore];
    backlog = backlog.slice(0, entry.backlogLengthBefore);
    activeDecisionId = entry.decisionId;
    saveProgress();
    closeEves();
    renderCurrentStep();
  };

  const scheduleAutoAdvance = () => {
    window.clearTimeout(autoTimer);
    if (elements.auto.getAttribute("aria-pressed") !== "true" || !isOpen) return;
    const step = STORY[stepIndex];
    if (!step || step.type !== "line") return;
    autoTimer = window.setTimeout(() => advance(), AUTO_DELAY_MS);
  };

  const finishReveal = () => {
    revealGeneration += 1;
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    revealTimer = 0;
    revealFrame = 0;
    isRevealing = false;
    elements.text.classList.remove("is-preparing", "is-revealing");
    const lines = elements.text.querySelectorAll(".novel-line");
    if (lines.length > 0) {
      // Preserve the native line boundaries measured before the reveal.
      elements.text.classList.add("is-revealed");
    } else {
      elements.text.textContent = fullText;
    }
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    scheduleAutoAdvance();
  };

  const measureNativeLines = (text) => {
    elements.text.textContent = text;
    const textNode = elements.text.firstChild;
    const glyphs = Array.from(text);
    if (!(textNode instanceof Text) || glyphs.length === 0) return [glyphs];

    const range = document.createRange();
    const lines = [];
    let lineStart = 0;
    let lineTop = null;
    let textOffset = 0;

    glyphs.forEach((glyph, index) => {
      const nextOffset = textOffset + glyph.length;
      range.setStart(textNode, textOffset);
      range.setEnd(textNode, nextOffset);
      const rect = range.getBoundingClientRect();
      const top = rect.top;

      if (lineTop === null) {
        lineTop = top;
      } else if (Math.abs(top - lineTop) > 2) {
        lines.push(glyphs.slice(lineStart, index));
        lineStart = index;
        lineTop = top;
      }
      textOffset = nextOffset;
    });

    range.detach();
    lines.push(glyphs.slice(lineStart));
    return lines.filter((line) => line.length > 0);
  };

  const buildMeasuredLineLayout = (text) => {
    const measuredLines = measureNativeLines(text);
    const fragment = document.createDocumentFragment();
    let delay = 0;

    measuredLines.forEach((lineGlyphs) => {
      const lineText = lineGlyphs.join("");
      const line = document.createElement("span");
      const layout = document.createElement("span");
      const reveal = document.createElement("span");
      let duration = 0;

      line.className = "novel-line";
      line.setAttribute("aria-hidden", "true");
      layout.className = "novel-line-layout";
      reveal.className = "novel-line-reveal";
      layout.textContent = lineText;
      reveal.textContent = lineText;

      lineGlyphs.forEach((glyph) => {
        duration += TEXT_REVEAL_STEP_MS;
        if (/[。！？、…―]/u.test(glyph)) duration += TEXT_REVEAL_PAUSE_MS;
      });

      reveal.style.setProperty("--novel-line-delay", `${delay}ms`);
      reveal.style.setProperty("--novel-line-duration", `${Math.max(duration, TEXT_REVEAL_FADE_MS)}ms`);
      reveal.style.setProperty("--novel-line-steps", String(Math.max(1, lineGlyphs.length)));
      line.append(layout, reveal);
      fragment.append(line);
      delay += duration;
    });

    elements.text.replaceChildren(fragment);
    return delay;
  };

  const revealText = (text) => {
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    window.clearTimeout(autoTimer);
    const generation = ++revealGeneration;
    fullText = text;
    elements.text.setAttribute("aria-label", text);
    elements.text.classList.remove("is-revealing", "is-revealed");
    elements.continueMark.classList.remove("is-visible");

    if (REDUCED_MOTION || !text) {
      elements.text.replaceChildren();
      finishReveal();
      return;
    }

    isRevealing = true;
    elements.text.textContent = text;
    elements.text.classList.add("is-preparing");
    elements.cursor.hidden = true;

    const startMeasuredReveal = () => {
      if (generation !== revealGeneration || !isRevealing) return;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = window.requestAnimationFrame(() => {
          if (generation !== revealGeneration || !isRevealing) return;
          const delay = buildMeasuredLineLayout(text);
          elements.text.classList.remove("is-preparing");
          void elements.text.offsetWidth;
          elements.text.classList.add("is-revealing");
          elements.cursor.hidden = false;
          revealTimer = window.setTimeout(finishReveal, delay + TEXT_REVEAL_FADE_MS);
        });
      });
    };

    const fontsReady = document.fonts?.ready || Promise.resolve();
    Promise.resolve(fontsReady).then(startMeasuredReveal, startMeasuredReveal);
  };

  const showRuntime = () => {
    hasStarted = true;
    elements.titleCast.hidden = true;
    elements.titleScreen.hidden = true;
    elements.runtime.hidden = false;
    elements.restart.hidden = false;
  };

  const renderLine = (step) => {
    showRuntime();
    elements.sourceButton.hidden = false;
    elements.chapterCard.hidden = true;
    elements.dialogue.hidden = false;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    const character = CHARACTERS[step.speaker] || CHARACTERS.narrator;
    elements.avatar.dataset.speaker = step.speaker;
    elements.avatarGlyph.textContent = character.glyph;
    setCharacterPresentation(step.speaker, step.expression);
    elements.speaker.textContent = step.speaker === "narrator" ? "" : character.name;
    elements.dataKind.textContent = step.kind || "SOURCE";
    elements.dataKind.dataset.kind = step.kind || "SOURCE";
    elements.signalTitle.textContent = step.signal || "公開データは、地球が発している信号である。";
    elements.location.textContent = step.location || "GAIA SENSEWARE";
    updateSourceDetails(step);
    revealSourceSignal();
    selectMode(step.mode);
    updateProgress();
    revealText(step.text);

    const lastEntry = backlog[backlog.length - 1];
    if (!lastEntry || lastEntry.stepIndex !== stepIndex) {
      backlog.push({
        stepIndex,
        speaker: character.name,
        kind: step.kind || "SOURCE",
        text: step.text,
      });
      saveProgress();
    }
  };

  const renderChapter = (step) => {
    showRuntime();
    clearTimers();
    elements.sourceButton.hidden = true;
    selectMode(step.mode);
    elements.location.textContent = step.location || "GAIA SENSEWARE";
    elements.dialogue.hidden = true;
    elements.choices.classList.remove("is-visible");
    elements.chapterIndex.textContent = step.chapter;
    elements.chapterTitle.textContent = step.title;
    elements.chapterCard.hidden = false;
    setCharacterPresentation("chapter");
    updateProgress();
    saveProgress();
    chapterTimer = window.setTimeout(() => {
      stepIndex += 1;
      renderCurrentStep();
    }, CHAPTER_CARD_DURATION_MS);
  };

  const renderChoice = (step) => {
    showRuntime();
    clearTimers();
    elements.sourceButton.hidden = false;
    activeDecisionId = step.id || "";
    elements.chapterCard.hidden = true;
    elements.dialogue.hidden = false;
    elements.speaker.textContent = "あなたへ";
    elements.text.textContent = step.prompt;
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    elements.avatar.dataset.speaker = "choice";
    elements.avatarGlyph.textContent = CHARACTERS.choice.glyph;
    setCharacterPresentation("choice");
    elements.dataKind.textContent = "SCENARIO";
    elements.dataKind.dataset.kind = "SCENARIO";
    elements.signalTitle.textContent = "選択は観測値ではなく、ここから作る仮想状態です。";
    updateSourceDetails({
      kind: "SCENARIO",
      signal: "選択は観測値ではなく、ここから作る仮想状態です。",
      location: elements.location.textContent || "物語の分岐",
      mode: step.id === "gap_decision" ? 6 : 9,
      text: step.prompt,
    });
    revealSourceSignal();
    elements.choices.replaceChildren();
    step.choices.forEach((choice, choiceIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      const meta = document.createElement("span");
      const label = document.createElement("strong");
      const hint = document.createElement("small");
      meta.textContent = `E.V.E.S. ${step.id === "gap_decision" ? "01" : "02"} / VARIANT ${String.fromCharCode(65 + choiceIndex)}`;
      label.textContent = choice.text;
      hint.textContent = "この経路を記録する";
      button.append(meta, label, hint);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        routeHistory = routeHistory.filter((entry) => entry.decisionId !== step.id);
        routeHistory.push({
          decisionId: step.id,
          prompt: step.prompt,
          choiceText: choice.text,
          from: step.id,
          to: choice.goto,
          flag: choice.flag || "",
          decisionStepIndex: stepIndex,
          flagsBefore: [...flags],
          backlogLengthBefore: backlog.length,
        });
        if (choice.flag && !flags.includes(choice.flag)) flags.push(choice.flag);
        backlog.push({ stepIndex, speaker: CHARACTERS.choice.name, kind: "SCENARIO", text: choice.text });
        activeDecisionId = choice.goto;
        stepIndex = labels.get(choice.goto) ?? stepIndex + 1;
        saveProgress();
        renderEves();
        renderCurrentStep();
      });
      elements.choices.append(button);
    });
    elements.choices.classList.add("is-visible");
    updateProgress();
    saveProgress();
    renderEves();
    requestAnimationFrame(() => elements.choices.querySelector("button")?.focus({ preventScroll: true }));
  };

  const renderGxExhibit = (step) => {
    showRuntime();
    clearTimers();
    elements.sourceButton.hidden = true;
    selectMode(step.mode);
    elements.location.textContent = step.location;
    elements.dialogue.hidden = true;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    elements.chapterIndex.textContent = "SPECIAL INSTALLATION";
    elements.chapterTitle.textContent = "THE FIRST GXを開いています";
    elements.chapterCard.hidden = true;
    const guide = getPreviousIllustratedPresentation();
    if (guide) setCharacterPresentation(guide.speaker, guide.expression);
    else setCharacterPresentation("chapter");
    updateProgress();
    saveProgress();
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("gaia:gx-open", { detail: { returnTo: "novel", phase: 0 } }));
    });
  };

  const finishEnding = () => {
    if (endingReturnPending || !isOpen || STORY[stepIndex]?.type !== "end") return;
    endingReturnPending = true;
    window.clearTimeout(endingTimer);
    endingTimer = 0;
    void runSceneTransition(closeNovelNow).finally(() => {
      endingReturnPending = false;
    });
  };

  const renderEnd = (step) => {
    showRuntime();
    clearTimers();
    endingReturnPending = false;
    elements.sourceButton.hidden = false;
    selectMode(step.mode);
    elements.chapterCard.hidden = true;
    elements.dialogue.hidden = false;
    elements.speaker.textContent = step.title;
    elements.text.textContent = step.subtitle;
    elements.cursor.hidden = true;
    elements.continueMark.classList.remove("is-visible");
    elements.avatar.dataset.speaker = "earth";
    elements.avatarGlyph.textContent = "◎";
    setCharacterPresentation("earth");
    elements.dataKind.textContent = step.kind;
    elements.dataKind.dataset.kind = step.kind;
    elements.signalTitle.textContent = "これは結論ではなく、あなたが選んだ物語上の終点です。";
    elements.location.textContent = "— F I N — / DATA FICTION";
    updateSourceDetails({
      kind: step.kind,
      signal: "これは結論ではなく、あなたが選んだ物語上の終点です。",
      location: "— F I N — / DATA FICTION",
      mode: step.mode,
      text: step.subtitle,
    });
    revealSourceSignal();
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    updateProgress();
    saveProgress();
    endingTimer = window.setTimeout(finishEnding, ENDING_RETURN_DELAY_MS);
  };

  function renderCurrentStep() {
    clearTimers();
    closeLog();
    closeSourceDetails();
    while (STORY[stepIndex]?.type === "label") stepIndex += 1;
    const step = STORY[stepIndex];
    if (!step) {
      stepIndex = STORY.length - 1;
      return renderCurrentStep();
    }
    if (step.type === "jump") {
      stepIndex = labels.get(step.target) ?? stepIndex + 1;
      return renderCurrentStep();
    }
    layer.classList.toggle("is-chapter-transition", step.type === "chapter");
    if (step.type === "chapter") return renderChapter(step);
    if (step.type === "choice") return renderChoice(step);
    if (step.type === "gx") return renderGxExhibit(step);
    if (step.type === "end") return renderEnd(step);
    return renderLine(step);
  }

  function advance() {
    if (
      !isOpen ||
      !hasStarted ||
      !elements.logPanel.hidden ||
      !elements.evesPanel.hidden ||
      !elements.sourcePanel.hidden
    ) return;
    const step = STORY[stepIndex];
    if (!step) return;
    if (step.type === "end") {
      finishEnding();
      return;
    }
    if (step.type === "chapter") {
      clearTimers();
      stepIndex += 1;
      saveProgress();
      renderCurrentStep();
      return;
    }
    if (step.type !== "line") return;
    if (isRevealing) {
      finishReveal();
      return;
    }
    stepIndex += 1;
    saveProgress();
    renderCurrentStep();
  }

  function restartStory() {
    clearTimers();
    stepIndex = 0;
    flags = [];
    backlog = [];
    routeHistory = [];
    activeDecisionId = "intro";
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore unavailable storage.
    }
    showRuntime();
    renderEves();
    renderCurrentStep();
  }

  const resumeStory = () => {
    const stored = getStoredProgress();
    if (stored) {
      stepIndex = stored.stepIndex;
      flags = stored.flags;
      backlog = stored.backlog;
      routeHistory = stored.routeHistory;
      activeDecisionId = stored.activeDecisionId || "intro";
    }
    showRuntime();
    renderEves();
    renderCurrentStep();
  };

  const mainStoryStartIndex = STORY.findIndex((step) =>
    step.type === "chapter" && step.chapter !== "PROLOGUE"
  );

  const findStoryStartForMode = (modeIndex) => STORY.findIndex((step, index) =>
    index >= mainStoryStartIndex
      && step.mode === modeIndex
      && (step.type === "chapter" || step.type === "line"),
  );

  function openNovel(event) {
    event?.preventDefault();
    previousFocus = document.activeElement;
    particleSystem.start();
    void window.GaiaOpeningAudio?.switchTrack?.("story");
    window.dispatchEvent(new CustomEvent("gaia:novel-open"));
    isOpen = true;
    layer.hidden = false;
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("novel-open");
    const stored = getStoredProgress();
    elements.resume.hidden = !stored || stored.stepIndex <= 0;
    if (!hasStarted) {
      elements.titleCast.hidden = false;
      elements.titleScreen.hidden = false;
      elements.runtime.hidden = true;
    }
    requestAnimationFrame(() => {
      layer.classList.add("is-open");
      (hasStarted ? elements.close : elements.start).focus({ preventScroll: true });
    });
    if (window.location.hash !== "#story") history.replaceState(null, "", "#story");
  }

  function closeNovelNow() {
    clearTimers();
    closeLog();
    closeEves();
    closeSourceDetails();
    particleSystem.stop();
    void window.GaiaOpeningAudio?.switchTrack?.("opening");
    isOpen = false;
    layer.classList.remove("is-open", "is-chapter-transition");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("novel-open");
    window.setTimeout(() => {
      if (!isOpen) layer.hidden = true;
    }, 260);
    if (window.location.hash === "#story") history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new CustomEvent("gaia:return-to-intro"));
    previousFocus?.focus?.({ preventScroll: true });
  }

  function closeNovel(event = null) {
    if (!isOpen) return false;
    return runSceneTransition(closeNovelNow, event);
  }

  document.querySelectorAll("[data-novel-open]").forEach((button) => {
    button.addEventListener("click", (event) => runSceneTransition(openNovel, event));
  });
  window.addEventListener("gaia:novel-open-at-mode", (event) => {
    const requestedMode = Number(event.detail?.index);
    if (!Number.isInteger(requestedMode) || requestedMode < 0 || requestedMode >= MODE_TITLES.length) return;
    const startIndex = findStoryStartForMode(requestedMode);
    if (startIndex < 0) return;
    clearTimers();
    closeLog();
    stepIndex = startIndex;
    flags = [];
    backlog = [];
    routeHistory = [];
    activeDecisionId = "intro";
    // Opening routes enter the story directly. Prepare the runtime while the
    // layer is still hidden so the standalone title screen can never flash.
    showRuntime();
    openNovel();
    renderCurrentStep();
  });
  window.addEventListener("gaia:gx-return-to-novel", () => {
    if (!isOpen || STORY[stepIndex]?.type !== "gx") return;
    stepIndex += 1;
    saveProgress();
    renderCurrentStep();
    requestAnimationFrame(() => {
      const target = elements.dialogue.hidden ? elements.auto : elements.dialogue;
      target?.focus({ preventScroll: true });
    });
  });
  elements.start.addEventListener("click", restartStory);
  elements.resume.addEventListener("click", resumeStory);
  elements.close.addEventListener("click", (event) => closeNovel(event));
  elements.restart.addEventListener("click", restartStory);
  elements.logButton.addEventListener("click", toggleLog);
  elements.logClose.addEventListener("click", closeLog);
  elements.evesButton.addEventListener("click", toggleEves);
  elements.evesClose.addEventListener("click", closeEves);
  elements.evesRewind.addEventListener("click", rewindEves);
  elements.sourceButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSourceDetails();
  });
  elements.sourceClose.addEventListener("click", () => closeSourceDetails({ restoreFocus: true }));
  elements.sourcePanel.addEventListener("click", (event) => event.stopPropagation());
  elements.auto.addEventListener("click", () => {
    const enabled = elements.auto.getAttribute("aria-pressed") !== "true";
    elements.auto.setAttribute("aria-pressed", String(enabled));
    elements.auto.classList.toggle("is-active", enabled);
    if (enabled && !isRevealing) scheduleAutoAdvance();
    else window.clearTimeout(autoTimer);
  });
  elements.dialogue.addEventListener("click", (event) => {
    event.stopPropagation();
    advance();
  });
  layer.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, select, textarea, [role='button']")) return;
    advance();
  });
  layer.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Tab") {
      const focusable = [...layer.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.hidden && element.getClientRects().length > 0);
      if (focusable.length > 0) {
        const currentIndex = focusable.indexOf(document.activeElement);
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex = currentIndex < 0
          ? 0
          : (currentIndex + direction + focusable.length) % focusable.length;
        event.preventDefault();
        focusable[nextIndex].focus({ preventScroll: true });
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      if (!elements.sourcePanel.hidden) closeSourceDetails({ restoreFocus: true });
      else if (!elements.evesPanel.hidden) closeEves();
      else if (!elements.logPanel.hidden) closeLog();
      else closeNovel();
      return;
    }
    if ((event.key === " " || event.key === "Enter") && !event.target.closest("button")) {
      event.preventDefault();
      advance();
    }
    if (event.key.toLowerCase() === "l" && !event.target.closest("button")) {
      event.preventDefault();
      toggleLog();
    }
  });

  elements.restart.hidden = true;
  renderEves();
  if (window.location.hash === "#story") openNovel();
})();
