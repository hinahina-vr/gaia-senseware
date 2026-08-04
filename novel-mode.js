(() => {
  "use strict";

  const STORAGE_KEY = "gaiaSensewareNovel:v5";
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TEXT_REVEAL_STEP_MS = 36;
  const TEXT_REVEAL_FADE_MS = 280;
  const TEXT_REVEAL_PAUSE_MS = 110;
  const AUTO_DELAY_MS = 3200;
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

  const CHARACTERS = {
    narrator: { name: "観測記録", glyph: "◌" },
    sora: {
      name: "アマネ",
      glyph: "△",
      defaultExpression: "calm",
      expressions: ["calm", "startled", "exasperated", "soft"],
      profile: "画面越しでも言葉を丁寧に選ぶ学生。測れたことと想像の境界を、急いで一つにしない。",
    },
    minamo: {
      name: "ミズハ",
      glyph: "≈",
      defaultExpression: "calm",
      expressions: ["calm", "teasing", "worried", "sad"],
      profile: "数字の揺れを感覚でつかむ学生。測られた事実を守りながら、地球の信号を人の手触りへ渡す。",
    },
    sakuya: { name: "サクヤの記録", glyph: "＊" },
    earth: { name: "地球", glyph: "◎" },
    choice: { name: "あなたの選択", glyph: "◇" },
  };

  const STORY = [
    { type: "chapter", chapter: "PROLOGUE", title: "はじめまして、画面の外で", mode: 0, location: "夏の逗子" },
    { type: "line", speaker: "narrator", mode: 0, kind: "SOURCE", signal: "ONLINE CLASS / WEEKLY SESSION", text: "私たちは毎週、同じ画面にいた。声も、考え方も、文字を打つ間も知っている。それでも今日が、初対面だった。", location: "海の見える共同制作室" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 0, kind: "SOURCE", signal: "FIRST MEETING / MIZUHA", text: "……アマネ？", location: "海の見える共同制作室" },
    { type: "line", speaker: "sora", expression: "startled", mode: 0, kind: "SOURCE", signal: "FIRST MEETING / AMANE", text: "はい。ミズハさんですか？", location: "海の見える共同制作室" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 0, kind: "SOURCE", signal: "同じ声 / はじめての距離", text: "毎週話してたのに、さん付けするんだ。", location: "海の見える共同制作室" },
    { type: "line", speaker: "sora", expression: "calm", mode: 0, kind: "SOURCE", signal: "画面の外では初対面", text: "画面の外では初対面なので。", location: "海の見える共同制作室" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 0, kind: "SOURCE", signal: "HELLO / OUTSIDE THE SCREEN", text: "そっか。じゃあ――はじめまして。", location: "海の見える共同制作室" },
    { type: "line", speaker: "sora", expression: "soft", mode: 0, kind: "SOURCE", signal: "HELLO / OUTSIDE THE SCREEN", text: "はい。はじめまして。", location: "海の見える共同制作室" },
    { type: "line", speaker: "narrator", mode: 0, kind: "SOURCE", signal: "THREE SEATS / TWO ARRIVALS", text: "三人分の席のうち、ひとつだけが空いていた。サクヤからは、まだ返事がない。", location: "SAKUYA / OFFLINE" },
    { type: "line", speaker: "sakuya", mode: 0, kind: "SOURCE", signal: "LAST ONLINE 02:14 / 制作ログ", text: "データだけ先に上げた。きれいにしすぎないでね。", location: "サクヤの最終メッセージ" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 0, kind: "SCENARIO", signal: "THE VISITOR BECOMES A PARTICIPANT", text: "サクヤを待つあいだ、少しだけ手伝ってくれませんか？", location: "GAIA SENSEWARE / ENTRANCE" },

    { type: "chapter", chapter: "GX / 00", title: "酸素は、最初の廃棄物だった", mode: 0, location: "THE FIRST GX" },
    { type: "line", speaker: "narrator", mode: 0, kind: "SOURCE", signal: "SAKUYA / DEEP TIME RECORD", text: "サクヤが最後に開いていたのは、何十億年もの地球史を六つの場面に畳んだ観測記録だった。", location: "THE FIRST GX / LOCAL SNAPSHOT" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 0, kind: "SOURCE", signal: "CYANOBACTERIA / OXYGENIC PHOTOSYNTHESIS", text: "ねえ、酸素って、最初はごみだったんだよ。光を食べた小さな生命が、いらないものとして海へ捨てた。", location: "THE FIRST GX / ANCIENT OCEAN" },
    { type: "line", speaker: "sora", expression: "startled", mode: 0, kind: "SOURCE", signal: "GREAT OXIDATION / ENVIRONMENTAL CHANGE", text: "そのごみが、私たちの呼吸になった？", location: "THE FIRST GX / ANCIENT OCEAN" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 0, kind: "DERIVED", signal: "生命が環境を変え、環境が生命を変え返す", text: "うん。でも、きれいな成功物語じゃない。酸素が苦手な生命には災害だった。地球が変わるって、誰にとっても同じ変化じゃないんだ。", location: "THE FIRST GX / ANCIENT OCEAN" },
    { type: "line", speaker: "sora", expression: "calm", mode: 0, kind: "SOURCE", signal: "GREEN TRANSFORMATION ≠ GAIA TRANSFORMATION", text: "でも、そこからどうしてGXになるんですか。脱炭素の技術とは、ずいぶん遠い話に見えます。", location: "THE FIRST GX / ENTRY" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 0, kind: "DERIVED", signal: "GX / GAIA TRANSFORMATION", text: "この作品のGXは、GreenじゃなくてGaia Transformation。人間だけが地球を変えるんじゃなくて、変えた地球から人間も変え返される。その関係まで含めた転換なんだ。", location: "THE FIRST GX / ENTRY" },
    { type: "line", speaker: "sora", expression: "soft", mode: 0, kind: "DERIVED", signal: "人間も地球の関係の中にいる", text: "人間を地球の外に立たせないために、まず人間以前の変革を見るんですね。", location: "THE FIRST GX / ENTRY" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 0, kind: "DERIVED", signal: "THE FIRST GX / CO-EVOLUTION", text: "そう。地球改造の第一号を人間だと思ってると、また偉そうな設計図を描いちゃうから。", location: "THE FIRST GX / ENTRY" },
    { type: "gx", mode: 0, location: "THE FIRST GX / INTERACTIVE RECORD" },
    { type: "line", speaker: "narrator", mode: 0, kind: "SCENARIO", signal: "VISITOR TRACE / NOT OBSERVATION DATA", text: "太古の海へ置いた光と、結び直した線だけが、観客の軌跡として残った。それは過去の記録ではなく、いま加わった応答だった。", location: "THE FIRST GX / RETURN" },

    { type: "chapter", chapter: "CHAPTER 01", title: "世界は、ばらばらに見えてつながっている", mode: 1, location: "青い循環系" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 1, kind: "SOURCE", signal: "NOAA海流 × NASA風", text: "海は国境を読めない。風もパスポートを持たない。なのに人間だけが、問題を自分の国の枠に切って安心する。器用だよね。", location: "GAIA SENSEWARE / 02" },
    { type: "line", speaker: "sora", expression: "exasperated", mode: 1, kind: "SOURCE", signal: "流速と風向は別レイヤー", text: "褒めてないだろ、それ。", location: "GAIA SENSEWARE / 02" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 1, kind: "SOURCE", signal: "熱と水の惑星循環", text: "うん。でも、つながっていることは責任が無限に増える話じゃない。届いたものを、次へどう渡すかって話。海流みたいに。", location: "GAIA SENSEWARE / 02" },
    { type: "line", speaker: "sakuya", mode: 2, kind: "SOURCE", signal: "制作ログ 2025-08-17", text: "森を背景にしないでね。雨を呼んで、土を抱いて、気温を変える。森は景色じゃなくて、働いている装置だから。", location: "サクヤの音声メモ / 保存部分" },
    { type: "line", speaker: "sora", expression: "soft", mode: 2, kind: "SOURCE", signal: "NASA MODIS土地被覆 × NASA POWER降水", text: "このメモは本物です。私が何度も聞きました。最後のところだけ、音が欠けています。", location: "GAIA SENSEWARE / 03" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 2, kind: "DERIVED", signal: "欠測は欠測として表示", text: "知ってる。4.8秒。私はその空白を埋められる。統計的には、かなり自然な続きを作れる。", location: "AUDIO GAP / 4.8 SEC" },
    { type: "line", speaker: "sora", expression: "calm", mode: 2, kind: "DERIVED", signal: "自然らしさ ≠ 事実", text: "自然な続きと、本当に言ったことは違う。", location: "AUDIO GAP / 4.8 SEC" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 2, kind: "DERIVED", signal: "自然らしさ ≠ 事実", text: "うん。だから、君に決めてほしい。聞きたい気持ちと、事実を守ること。その間に線を引くのは、計算じゃできないから。", location: "AUDIO GAP / 4.8 SEC" },

    { type: "chapter", chapter: "CHAPTER 02", title: "人間は、地球の外側には立てない", mode: 3, location: "共進化プロトコル" },
    { type: "line", speaker: "narrator", mode: 3, kind: "SOURCE", signal: "GloBI × GBIF / 記録された関係", text: "花と虫を結ぶ線が、暗い地球に灯った。どちらかが一方を設計したのではない。互いの存在が、互いの形を変えてきた。", location: "GAIA SENSEWARE / 04" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 3, kind: "SOURCE", signal: "関係が確認できる記録だけを結ぶ", text: "共創って、仲良しの別名じゃないよ。食べる、逃げる、運ぶ、奪う。それでも長い時間の中で、相手がいる形へ変わってしまうこと。", location: "GAIA SENSEWARE / 04" },
    { type: "line", speaker: "sora", expression: "calm", mode: 4, kind: "SOURCE", signal: "UN SDG 12.5.1 / 廃棄物処理", text: "人間は、使い終えたものを関係の外へ捨てられると思ってきた。", location: "GAIA SENSEWARE / 05" },
    { type: "line", speaker: "minamo", expression: "teasing", mode: 4, kind: "SCENARIO", signal: "処理経路の変更は仮想状態", text: "でも『外』はなかった。捨てた先にも土があって、水があって、誰かの暮らしがあった。地球、収納スペース少なすぎ問題。", location: "GAIA SENSEWARE / 05" },
    { type: "line", speaker: "sora", expression: "exasperated", mode: 4, kind: "SCENARIO", signal: "現状値と仮想経路を分ける", text: "惑星にクローゼットを要求するな。", location: "GAIA SENSEWARE / 05" },
    { type: "line", speaker: "sakuya", mode: 5, kind: "SOURCE", signal: "制作ログ 2025-09-02", text: "夜の光はきれい。でも、きれいだからこそ、その下の排出量を重ねたい。繁栄を悪者にするんじゃなくて、見えない負荷を透明にしたい。", location: "サクヤの音声メモ / 保存部分" },
    { type: "line", speaker: "narrator", mode: 5, kind: "SOURCE", signal: "VIIRS夜間光 ≠ EDGAR排出量", text: "白い都市光の下に、赤い排出の環が浮かぶ。似て見える二つの地図は、同じ意味ではない。光は排出量そのものではない。美しさも罪そのものではない。", location: "GAIA SENSEWARE / 06" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 5, kind: "SOURCE", signal: "比較して、混同しない", text: "サクヤは、私たちにも同じことを言いたかったのかもしれない。残された記録と、その人全部を、似ているからって混ぜないでって。", location: "GAIA SENSEWARE / 06" },

    { type: "chapter", chapter: "CHAPTER 03", title: "届かなかった4.8秒", mode: 6, location: "地球からのメッセージ" },
    { type: "line", speaker: "narrator", mode: 6, kind: "SOURCE", signal: "JMA震度記録 / P波・S波", text: "震源から水色の輪が走り、遅れて橙の輪が追う。P波とS波には速度がある。けれど、喪失が届く速さには、単位がない。", location: "GAIA SENSEWARE / 07" },
    { type: "line", speaker: "sora", expression: "soft", mode: 6, kind: "SOURCE", signal: "観測された到達と、受け取るまでの時間", text: "サクヤが来ないと気づいた朝も、私はこの画面を作ってた。メッセージは夜中に届いていたのに、開いたのは待ち合わせのあとだった。", location: "未読だったメッセージ" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 6, kind: "SOURCE", signal: "記録は残っても、本人の代わりにはならない", text: "記録は過去を保存する。でも、相手の全部を説明する装置じゃない。観測点の数字が、その場所の痛み全部になれないのと同じ。", location: "GAIA SENSEWARE / 07" },
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
    { type: "line", speaker: "sora", expression: "soft", mode: 6, kind: "DERIVED", signal: "もっともらしさは、真実の証明ではない", text: "言いそうだ。だから困る。これはサクヤが実際に言った声じゃない。でも、私たちが彼女と考えたかったことの形ではある。", location: "推定された続き / DERIVED" },
    { type: "label", label: "after_gap" },
    { type: "line", speaker: "minamo", expression: "worried", mode: 6, kind: "DERIVED", signal: "補完値には出自を残す", text: "空白を残すのも、補って印をつけるのも、どちらも誠実になれる。いちばん危ないのは、補ったことを忘れて『事実だった』と言い始めること。", location: "STATISTICAL ETHICS" },

    { type: "chapter", chapter: "CHAPTER 04", title: "未来は、予測線の先にある", mode: 7, location: "三つの生態系" },
    { type: "line", speaker: "narrator", mode: 7, kind: "SOURCE", signal: "生態・社会・記憶の三層", text: "森の層、都市の層、記憶の層が重なった。人が生きる場所は、自然だけでも社会だけでも、心だけでもできていない。", location: "GAIA SENSEWARE / 08" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 7, kind: "SCENARIO", signal: "大切な場所は数値化しない", text: "サクヤの不在を、一つの理由に畳まなくてよかったね。地球の健康も、七十点みたいな一個の数字にしなくてよかった。矛盾したまま残るものには、残る理由がある。", location: "GAIA SENSEWARE / 08" },
    { type: "line", speaker: "sora", expression: "calm", mode: 8, kind: "SOURCE", signal: "自然エネルギー潜在量と現状供給", text: "未来予測も同じだ。これまでの傾向を延ばした線は、未来そのものじゃない。", location: "GAIA SENSEWARE / 09" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 8, kind: "SCENARIO", signal: "二地点を結ぶ仮想ネットワーク", text: "未来は、まだ観測されていない。だから予測を捨てるんじゃなくて、仮定を書いて、選び直せる形にする。", location: "GAIA SENSEWARE / 09" },
    { type: "line", speaker: "earth", mode: 9, kind: "SOURCE", signal: "01〜09の信号が同時に残る", text: "――――――――――――――――。", location: "GAIA SENSEWARE / 10" },
    { type: "line", speaker: "sora", expression: "startled", mode: 9, kind: "SOURCE", signal: "沈黙も観測結果の一部", text: "地球は、何て言った？", location: "GAIA SENSEWARE / 10" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 9, kind: "SOURCE", signal: "データは命令ではなく信号", text: "何も。私は地球の翻訳機であって、地球の代弁者じゃない。データは命令しない。どう応えるかを決めるのは、生きている側だよ。", location: "GAIA SENSEWARE / 10" },
    { type: "line", speaker: "sora", expression: "calm", mode: 9, kind: "SCENARIO", signal: "観客の選択が新しい入力になる", text: "じゃあ、この作品の最後の台詞は、観客に渡そう。サクヤの空白を勝手な答えで閉じずに、次の人が自分の言葉を置ける場所にする。", location: "未完の地球センスウェア" },
    { type: "choice", id: "final_decision", prompt: "この空白へ、あなたは何を残しますか？", choices: [
      { text: "空白を守り、観測を続ける", goto: "END_SOURCE" },
      { text: "想像には印をつけ、語り継ぐ", goto: "END_DERIVED" },
      { text: "2050年の誰かへ、約束を残す", goto: "END_SCENARIO" },
    ] },

    { type: "label", label: "END_SOURCE" },
    { type: "line", speaker: "narrator", mode: 9, kind: "SOURCE", signal: "TRUE END / THE GAP REMAINS", text: "展示の最後に、4.8秒の空白が残った。誰の言葉にも置き換えられなかった場所で、新しい観客の足音だけが記録されていく。", location: "ENDING / SOURCE" },
    { type: "line", speaker: "minamo", expression: "sad", mode: 9, kind: "SOURCE", signal: "観測を続ける", text: "空白は、欠陥じゃなかったんだね。まだ来ていない誰かの席だった。", location: "ENDING / SOURCE" },
    { type: "end", mode: 9, title: "THE LISTENING CONTINUES", subtitle: "空白を守り、観測を続ける朝", kind: "SOURCE" },

    { type: "label", label: "END_DERIVED" },
    { type: "line", speaker: "narrator", mode: 9, kind: "DERIVED", signal: "GOOD END / A LABELED MEMORY", text: "補われた言葉の横には、消えない文字でDERIVEDと表示された。それは本人の言葉ではなく、残された私たちが作った、やさしい仮説だった。", location: "ENDING / DERIVED" },
    { type: "line", speaker: "sora", expression: "soft", mode: 9, kind: "DERIVED", signal: "想像と事実を分けて抱える", text: "本物じゃないから捨てるんじゃない。本物じゃないと知ったまま、大切にすることもできる。", location: "ENDING / DERIVED" },
    { type: "end", mode: 9, title: "A GENTLE HYPOTHESIS", subtitle: "想像に印をつけ、語り継ぐ朝", kind: "DERIVED" },

    { type: "label", label: "END_SCENARIO" },
    { type: "line", speaker: "narrator", mode: 9, kind: "SCENARIO", signal: "SCENARIO END / 2050", text: "2050年の表示へ、短い文章を置いた。『ここまでの線は予測です。ここから先は、あなたが参加した結果です』。", location: "ENDING / SCENARIO" },
    { type: "line", speaker: "minamo", expression: "calm", mode: 9, kind: "SCENARIO", signal: "未来は選び直せる", text: "未来の人に、当たったか外れたかだけ聞かれないといいね。何を変えようとしたかも、ちゃんと届くといい。", location: "ENDING / SCENARIO" },
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
    dialogue: layer.querySelector("#novel-dialogue"),
    speaker: layer.querySelector("#novel-speaker"),
    text: layer.querySelector("#novel-text"),
    cursor: layer.querySelector("#novel-cursor"),
    continueMark: layer.querySelector("#novel-continue"),
    choices: layer.querySelector("#novel-choices"),
    location: layer.querySelector("#novel-location"),
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
  let chapterTimer = 0;
  let autoTimer = 0;
  let isRevealing = false;
  let fullText = "";
  let previousFocus = null;

  const clearTimers = () => {
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    window.clearTimeout(chapterTimer);
    window.clearTimeout(autoTimer);
    revealTimer = 0;
    revealFrame = 0;
    chapterTimer = 0;
    autoTimer = 0;
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
    const figure = speaker === "sora" ? elements.characterSora : elements.characterMinamo;
    figure.dataset.expression = expression;
    figure.classList.remove("is-changing");
    if (!REDUCED_MOTION) {
      void figure.offsetWidth;
      figure.classList.add("is-changing");
    }
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

  const toggleEves = () => {
    const willOpen = elements.evesPanel.hidden;
    if (willOpen) {
      closeLog();
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
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    revealTimer = 0;
    revealFrame = 0;
    isRevealing = false;
    elements.text.textContent = fullText;
    elements.text.classList.remove("is-revealing");
    elements.cursor.hidden = true;
    elements.continueMark.classList.add("is-visible");
    scheduleAutoAdvance();
  };

  const revealText = (text) => {
    window.clearTimeout(revealTimer);
    window.cancelAnimationFrame(revealFrame);
    window.clearTimeout(autoTimer);
    fullText = text;
    elements.text.setAttribute("aria-label", text);
    elements.continueMark.classList.remove("is-visible");

    if (REDUCED_MOTION || !text) {
      finishReveal();
      return;
    }

    const glyphs = Array.from(text);
    const fragment = document.createDocumentFragment();
    let delay = 0;
    glyphs.forEach((glyph) => {
      const span = document.createElement("span");
      span.className = "novel-glyph";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--novel-glyph-delay", `${delay}ms`);
      span.textContent = glyph === " " ? "\u00a0" : glyph;
      fragment.append(span);
      delay += TEXT_REVEAL_STEP_MS;
      if (/[。！？、…―]/u.test(glyph)) delay += TEXT_REVEAL_PAUSE_MS;
    });

    isRevealing = true;
    elements.text.classList.add("is-revealing");
    elements.text.replaceChildren(fragment);
    elements.cursor.hidden = false;
    revealTimer = window.setTimeout(finishReveal, delay + TEXT_REVEAL_FADE_MS);
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
    }, 1450);
  };

  const renderChoice = (step) => {
    showRuntime();
    clearTimers();
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
    selectMode(step.mode);
    elements.location.textContent = step.location;
    elements.dialogue.hidden = true;
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    elements.chapterIndex.textContent = "SPECIAL INSTALLATION";
    elements.chapterTitle.textContent = "THE FIRST GXを開いています";
    elements.chapterCard.hidden = false;
    setCharacterPresentation("chapter");
    updateProgress();
    saveProgress();
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("gaia:gx-open", { detail: { returnTo: "novel", phase: 0 } }));
    });
  };

  const renderEnd = (step) => {
    showRuntime();
    clearTimers();
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
    elements.choices.replaceChildren();
    elements.choices.classList.remove("is-visible");
    updateProgress();
    saveProgress();
  };

  function renderCurrentStep() {
    clearTimers();
    closeLog();
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
    if (step.type === "chapter") return renderChapter(step);
    if (step.type === "choice") return renderChoice(step);
    if (step.type === "gx") return renderGxExhibit(step);
    if (step.type === "end") return renderEnd(step);
    return renderLine(step);
  }

  function advance() {
    if (!isOpen || !hasStarted || !elements.logPanel.hidden || !elements.evesPanel.hidden) return;
    const step = STORY[stepIndex];
    if (!step) return;
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
    particleSystem.stop();
    void window.GaiaOpeningAudio?.switchTrack?.("opening");
    isOpen = false;
    layer.classList.remove("is-open");
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
      if (!elements.evesPanel.hidden) closeEves();
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
