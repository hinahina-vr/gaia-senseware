const normalized = (payload) => ({
  speaker: null,
  speakerLabel: "",
  text: "",
  time: "",
  interaction: null,
  attachments: [],
  reactions: [],
  readout: [],
  emphasis: false,
  expression: "",
  visualSpeaker: null,
  ...payload,
});

const phase = () => normalized({ type: "phase" });
const narration = (text, extra = {}) => normalized({ type: "narration", speaker: "narrator", text, ...extra });
const dialogue = (speaker, speakerLabel, text, extra = {}) => normalized({ type: "dialogue", speaker, speakerLabel, text, ...extra });
const chat = (speaker, speakerLabel, text, extra = {}) => normalized({ type: "chat", speaker, speakerLabel, text, ...extra });
const ui = (text, extra = {}) => normalized({ type: "ui", speaker: "system", speakerLabel: "SYSTEM", text, ...extra });
const chatSurface = (text) => normalized({ type: "chatSurface", text });
const interaction = (metadata) => normalized({ type: "interaction", interaction: metadata });

const slots = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const defineScene = (sceneId, availableSlots, entries) => {
  const available = new Set(availableSlots);
  const output = Object.fromEntries(availableSlots.map((slot) => [
    `${sceneId}_${String(slot).padStart(3, "0")}`,
    phase(),
  ]));
  entries.forEach(([slot, value]) => {
    if (!available.has(slot)) throw new Error(`${sceneId}: unavailable revised-story slot ${slot}`);
    output[`${sceneId}_${String(slot).padStart(3, "0")}`] = value;
  });
  return output;
};

const festivalConcept = defineScene("festival_concept", slots(1, 76), [
  [1, narration("画面の中でしか知らなかった大学へ、今日は自分の足で来た。海風の先に、年に一度の対面イベントが広がっている。")],
  [2, narration("名札のハンドルネームには見覚えがある。けれど、声をかけられる名前は一つもない。")],
  [10, narration("帰ろうかと思ったとき、五面の投影が地球を包んだ。雲、海流、気温、二酸化炭素。別々の時間が一つの空間で脈打っている。")],
  [11, dialogue("visitor", "青猫", "「……同期、少しずれてる？」")],
  [12, narration("投影の継ぎ目で、同じ雲が半拍遅れて流れた。気づけば機材のそばまで来ていたが、声が出ない。")],
  [15, dialogue("mizuha", "みず", "「何か、気になりました？」")],
  [16, dialogue("visitor", "青猫", "「あの……海側だけです。同じ雲が、少し遅れていて」")],
  [17, dialogue("amane", "あめ", "「こういう配信、触ったことある？」")],
  [18, dialogue("visitor", "青猫", "「小さい構成なら。これは初めてです。受信時刻を見れば、映像か端末かは分けられると思います」")],
  [19, dialogue("amane", "あめ", "「分かった。操作は私がする。見る場所を教えて」")],
  [20, ui("あめの操作する画面で五面の受信時刻を確認し、海側端末の遅延を補正する。")],
  [21, dialogue("amane", "あめ", "「合った。ありがとう」")],
  [22, dialogue("visitor", "青猫", "「いえ。勝手に見て、すみません」")],
  [23, dialogue("mizuha", "みず", "「違いを見つけてくださったんです。私は、みずです」")],
  [24, dialogue("amane", "あめ", "「あめ」")],
  [25, dialogue("visitor", "青猫", "「青猫です」")],
  [26, narration("みずと、あめ。画面で見た名前が、初めて声と結びついた。")],
  [28, dialogue("mizuha", "みず", "「展示は〈GAIA SENSEWARE〉です。離れた観測を並べて、関係を探すための仕組みです」")],
  [29, dialogue("amane", "あめ", "「ただし、似て見えるだけで関係があるとは限らない。そこは分ける」")],
  [30, dialogue("visitor", "青猫", "「相関を答えにしない、ってことですか」")],
  [31, dialogue("amane", "あめ", "「そう。まず見る」")],
  [32, narration("背後で大型プロジェクターが低く唸る。あめは立入線と点検票を確かめ、来場者が離れてからケーブルへ触れた。")],
  [33, dialogue("mizuha", "みず", "「あめは展示電源の担当です。資格より、手順を見ていただくほうが早いですね」")],
  [34, dialogue("amane", "あめ", "「機材は肩書きで安全にならない」")],
  [35, narration("眠そうな声なのに、点検の目だけが鋭い。その落差に、少しだけ緊張がほどけた。")],
  [36, ui("データレイヤーを切り替え、観測地点・時刻・出典を確かめる。")],
  [37, dialogue("visitor", "青猫", "「公開データだけなんですね」")],
  [38, dialogue("mizuha", "みず", "「はい。遠い機関の記録を借りて、ここで同じ空間に置いています」")],
  [39, dialogue("visitor", "青猫", "「ここで測った値も、一枚だけ混ぜられたら……」")],
  [40, dialogue("amane", "あめ", "「公式データと同じ顔では置けない」")],
  [41, narration("否定された。喉が縮む。けれど、あめは目をそらさず、続きを待っている。")],
  [42, dialogue("visitor", "青猫", "「別レイヤーにします。精度も条件も違うって、最初から見える形で」")],
  [43, dialogue("amane", "あめ", "「それなら、話せる」")],
]);

const mapMode01 = defineScene("map_mode01", slots(1, 43), [
  [4, interaction({ kind: "map01", modeIndex: 0, modeId: "breathing-earth", requiredViews: ["timeline_complete"] })],
  [5, narration("季節ごとの小さな上下を繰り返しながら、線は長い時間の中で上へ進んでいく。")],
  [6, dialogue("mizuha", "みず", "「息をしているように見えます。でも、これは地球そのものの呼吸ではなく、観測された濃度の変化です」")],
  [7, dialogue("amane", "あめ", "「比喩とデータは分ける。重ねても、混ぜない」")],
  [8, dialogue("visitor", "青猫", "「展示の光は、答えじゃなくて見る入口なんですね」")],
  [9, dialogue("mizuha", "みず", "「ええ。入口のあとで、必ず出典と尺度へ戻れるようにしています」")],
  [23, interaction({ kind: "map01", modeIndex: 0, modeId: "breathing-earth", phase: "temperature-anomaly", requiredViews: ["long_term", "temperature_anomaly"] })],
  [24, narration("基準期間との差が、青から赤へ変わる。CO₂の線と似た向きに見えても、同じ観測ではない。")],
  [25, dialogue("visitor", "青猫", "「並べると、原因と結果に見えてしまう」")],
  [26, dialogue("amane", "あめ", "「見える。だから『この画面だけでは因果を決めない』と出す」")],
  [27, dialogue("mizuha", "みず", "「分からないことまで残すのも、展示の一部です」")],
  [28, narration("海から冷たい風が吹き、テントの外とプロジェクターの熱がこもる内側で、肌の感じ方が変わった。")],
  [29, dialogue("visitor", "青猫", "「同じ時刻でも、ここだけで違う」")],
  [30, dialogue("amane", "あめ", "「温度センサー？」")],
  [31, dialogue("visitor", "青猫", "「あります。ESP32も。日なたと日陰を比べれば――」")],
  [32, dialogue("amane", "あめ", "「二台なら、個体差も混ざる」")],
  [33, dialogue("visitor", "青猫", "「……一台を動かします。完璧には比べられないけど、最初の確認なら」")],
  [34, dialogue("mizuha", "みず", "「その不完全さも表示できますか」")],
  [35, dialogue("visitor", "青猫", "「できます。測った場所と時刻、動かしてからの時間を値と一緒に残します」")],
  [36, dialogue("amane", "あめ", "「まだ展示データにはしない。試験レイヤーなら」")],
  [37, dialogue("visitor", "青猫", "「はい。失敗した値も消しません」")],
  [38, narration("思いつきを褒められたのではない。使える形へ削られた。そのことが、うれしかった。")],
]);

const gxExperience = defineScene("gx_experience", [...slots(1, 44), ...slots(55, 58)], [
  [17, interaction({ kind: "gx", requiredGestures: 3 })],
  [18, narration("表示は約46億年前で止まる。まだ、さっき見た青い海はない。")],
  [19, dialogue("mizuha", "みず", "「ここは出発点です。次は時間を進めて、海と大気の変化を追います」")],
  [20, ui("時間を進め、約27億年前の海へ移動する。")],
  [21, narration("画面の年代表示が大きく切り替わる。数十億年が、一度の操作で縮められた。")],
  [22, dialogue("visitor", "青猫", "「この速度だと、連続していたように見えます」")],
  [23, dialogue("mizuha", "みず", "「本当は、ここに私たちが想像できない長さがあります」")],
  [24, dialogue("visitor", "青猫", "「途中を省略した印を、もっと目立たせませんか」")],
  [25, dialogue("amane", "あめ", "「採用。ワープしたのに、滑らかすぎた」")],
  [26, ui("時間跳躍マーカーを有効にする。")],
  [27, narration("光合成を行う微生物と大気の変化が示される。生命は環境に従うだけでなく、環境の条件にも影響してきた。")],
  [28, dialogue("mizuha", "みず", "「地球を一人の生きものと言い切らなくても、生命と環境が互いを変えた歴史は読めます」")],
  [29, dialogue("visitor", "青猫", "「変えた側も、変えられた側も、一つじゃない」")],
  [30, dialogue("amane", "あめ", "「だから一個の声にまとめない」")],
  [31, narration("遠い海の色が、テントの向こうの海と重なる。")],
  [32, dialogue("visitor", "青猫", "「私のセンサーも、地球を測るというより、この場所の一部分を残すだけですね」")],
  [33, dialogue("mizuha", "みず", "「一部分だから、隣の記録と出会えるのだと思います」")],
  [34, dialogue("amane", "あめ", "「その前に、濡らして壊さないこと」")],
  [35, dialogue("visitor", "青猫", "「防滴ケース、持ってきます」")],
  [36, narration("私は初めて、自分から次の約束を口にした。")],
]);

const esp32Pitch = defineScene("esp32_pitch", slots(1, 43), [
  [1, narration("休憩スペースの机に紙ナプキンを広げ、青猫は裏へ小さな構成図を描いた。")],
  [2, dialogue("visitor", "青猫", "「ESP32と温湿度センサー。最初は一分ごとに送って、同じ値を端末にも残します」")],
  [3, dialogue("amane", "あめ", "「一分に根拠は？」")],
  [4, dialogue("visitor", "青猫", "「ありません。最初に試すための仮置きです」")],
  [5, dialogue("amane", "あめ", "「なら、仮と書く」")],
  [6, dialogue("mizuha", "みず", "「持って動かすと、手の熱も入りませんか」")],
  [7, dialogue("visitor", "青猫", "「入ります。一台を移動して、置いた直後は比較から外します。何分待つかも、まず試します」")],
  [8, dialogue("amane", "あめ", "「決めたふりをしない。それでいい」")],
  [9, dialogue("visitor", "青猫", "「公式観測とは別の試験レイヤーにします。場所は公開できる区画名までにします」")],
  [10, chat("sakuya", "saku", "失敗した理由を書く欄も欲しい。通信、電源、それでも分からなければ“不明”")],
  [11, dialogue("amane", "あめ", "「欄が増えても正しくはならない。追い直せるだけ」")],
  [12, chat("sakuya", "saku", "了解。言い切りすぎた")],
  [13, narration("言葉が速く行き交う。青猫は追いつけない一瞬を隠すように、紙の端を押さえた。")],
  [14, dialogue("mizuha", "みず", "「急がなくて大丈夫です。今日は、一台が動くところまでで」")],
  [15, dialogue("visitor", "青猫", "「……はい。一台を、日なたへ置きます」")],
  [16, ui("試験観測を開始する。")],
  [17, narration("最初のパケットは届かない。")],
  [18, dialogue("visitor", "青猫", "「Wi-Fiじゃない。端末の時計が合う前に送ってる」")],
  [19, dialogue("amane", "あめ", "「直せる？」")],
  [20, dialogue("visitor", "青猫", "「直します。届かなかった一回も残します」")],
  [21, ui("再接続し、最初の記録を受信する。")],
  [22, narration("画面に、小数点のついた温度と「時刻確認済み」の表示が並んだ。地球の答えではない。今日、この場所で始まった一行だった。")],
]);

const circleInvitation = defineScene("circle_invitation", slots(1, 81), [
  [1, narration("展示終了が近づき、来場者の波が少しずつ引いていく。青猫はケースを外し、ケーブルを巻いた。")],
  [2, dialogue("mizuha", "みず", "「片づけまで手伝っていただいて、ありがとうございます」")],
  [3, dialogue("visitor", "青猫", "「あの」")],
  [4, narration("続きを言う前に、三度息を吸った。遠回しな質問ならいくつも思いつく。")],
  [5, dialogue("visitor", "青猫", "「今日だけで終わらせたくないです。この観測も、展示も。できれば、みなさんと続きを作りたいです」")],
  [6, dialogue("amane", "あめ", "「途中で壊れたものも見せられる？」")],
  [7, dialogue("visitor", "青猫", "「……格好悪いログも？」")],
  [8, dialogue("amane", "あめ", "「完成品だけだと、一緒に検証できない」")],
  [9, dialogue("visitor", "青猫", "「見せます。今日の失敗から」")],
  [10, dialogue("mizuha", "みず", "「GAIA SENSEWAREは、私たちが作っているものの名前です」")],
  [11, dialogue("mizuha", "みず", "「作っている人たちの集まりは、〈惑星の放課後〉といいます」")],
  [12, dialogue("amane", "あめ", "「名前は大きい。人数は小さい」")],
  [13, dialogue("mizuha", "みず", "「その小さい集まりへ、参加していただけませんか」")],
  [29, ui("学内チャットの招待を開く。")],
  [30, ui("CIRCLE / 惑星の放課後\n参加者8名　進行中: GAIA SENSEWARE\n招待元: みず")],
  [31, narration("参加ボタンは小さい。押したあとに何を話せばいいのかは、まだ分からない。")],
  [48, ui("参加する")],
  [49, ui("参加者9名。プライベートチャネル # gaia-senseware が開く。")],
  [50, chat("sakuya", "saku", "ようこそ。さっそくだけど、失敗ログ見せて")],
  [51, dialogue("visitor", "青猫", "「歓迎より先なんですね」")],
  [52, chat("sakuya", "saku", "そのほうが話しやすいかなって")],
  [53, dialogue("amane", "あめ", "「saku基準」")],
  [54, dialogue("mizuha", "みず", "「急がなくて大丈夫です。でも、今日の一行は今日のうちに残しましょう」")],
  [55, narration("居場所を与えられた、とはまだ思わない。代わりに、自分の置いた一行の続きを、ここで確かめたいと思った。")],
]);

const welcomeChat = defineScene("welcome_chat", slots(1, 95), [
  [1, chatSurface("# gaia-senseware／人物画像は表示しない")],
  [2, narration("10月3日（土）10:06。〈惑星の放課後〉内、参加直後の # gaia-senseware。")],
  [3, narration("青猫は挨拶を二度書き直し、三度目で送信した。")],
  [4, chat("visitor", "青猫", "青猫です。今日はありがとうございました。失敗ログと構成図、送ります", { reactions: [{ emoji: "🌍", count: 8 }] })],
  [5, narration("ほかの八人から、歓迎のリアクションが一件ずつつく。")],
  [6, chat("sakuya", "saku", "見た。端末の時計が合う前に最初の送信が走ってる")],
  [7, chat("visitor", "青猫", "最初の値は“時刻未確認”にします。公開値へは出しません")],
  [8, chat("amane", "あめ", "ログには残す。それで原因を追える")],
  [9, chat("mizuha", "みず", "日なた／日陰だけでは、壁の照り返しが抜けてしまいそうです")],
  [10, chat("visitor", "青猫", "今回は壁際だったことを残します。項目は、次の比較に必要な分だけにします")],
  [11, chat("sakuya", "saku", "増やせば親切だと思ってた")],
  [12, chat("amane", "あめ", "入力するための観測になったら止める")],
  [13, narration("誰かが正解を宣言する代わりに、画面ラフと未決事項が一つずつ増えた。")],
  [14, chat("visitor", "青猫", "公式データと試験値、色だけじゃなく枠と見出しも分けたいです")],
  [15, chat("sakuya", "saku", "了解。そこは直す")],
  [16, chat("mizuha", "みず", "次は、どこを感じてみたいですか")],
  [17, narration("入力欄でカーソルが点滅する。海、木陰、屋上、雨のあと。答えは一つに決められない。")],
  [18, chat("visitor", "青猫", "まず、同じ場所の朝と夕方を比べたいです")],
  [19, chat("amane", "あめ", "電源と設置許可、確認する")],
  [20, chat("sakuya", "saku", "画面は作る。決まっていないところは空けておく")],
  [21, chat("mizuha", "みず", "私は、その場所の記録を調べます")],
  [74, narration("イベント帰りの海沿いを、みずとあめが機材箱を分けて運んでいる。青猫も一つ受け取った。")],
  [75, narration("帰ったら机の部品箱を開こう。送信ボタンを押すときほどではないけれど、二人の隣を歩くことには、まだ少し緊張している。")],
  [76, narration("防波堤の向こうで、波が一度だけ白くほどけた。")],
  [77, ui("FIRST LINK ESTABLISHED / 惑星の放課後")],
  [94, ui("記録は、次の観測を待っています。")],
  [95, ui("AFTER SCHOOL SESSION 01 / COMPLETE")],
]);

export default Object.freeze({
  ...festivalConcept,
  ...mapMode01,
  ...gxExperience,
  ...esp32Pitch,
  ...circleInvitation,
  ...welcomeChat,
});
