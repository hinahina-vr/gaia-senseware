// Generated from story/APPROVED_SCRIPT_2026-08-24.md by scripts/build-novel-story.mjs. Do not edit by hand.
globalThis.GAIA_NOVEL_STORY = Object.freeze({
  "storyVersion": 13,
  "title": "惑星の放課後",
  "systemTitle": "GAIA SENSEWARE",
  "subtitle": "GAIA SENSATION",
  "estimatedDuration": "10〜12分",
  "sourceSha256": "27db292fbcfd2fc5130c9dcef8f33532ee0956abb559729347aa055dc5cd6b0c",
  "revisionId": "approved-script-20260824",
  "approvedSourceSha256": "7c604f070b37567ae35445292d1a70515cf70d10a5d8faa70030c2c0b1052976",
  "characterSourceSha256": "4d4759fe93dd3ba15b2472c18a10d2f83c46f45ed934e577c070a02ffc49215e",
  "characters": {
    "amane": {
      "formalName": "雨音",
      "reading": "アマネ",
      "campusName": "あめ"
    },
    "mizuha": {
      "formalName": "瑞葉",
      "reading": "ミズハ",
      "campusName": "みず"
    },
    "sakuya": {
      "formalName": "咲弥",
      "reading": "サクヤ",
      "campusName": "saku"
    }
  },
  "startSceneId": "festival_concept",
  "temporal": {
    "schemaVersion": 2,
    "calendar": "GREGORIAN",
    "timeZone": "Asia/Tokyo",
    "clockPolicy": "AUTHOR_FIXED",
    "missingMetadataPolicy": "ERROR",
    "sceneOrder": [
      "festival_concept",
      "map_mode01",
      "gx_experience",
      "esp32_pitch",
      "circle_invitation",
      "welcome_chat"
    ],
    "archives": []
  },
  "saveFields": [
    "storyVersion",
    "stepId",
    "reachedSceneIds",
    "viewed",
    "evesRoute",
    "observationOrder",
    "editorialChoice",
    "reflectionIds",
    "resultTone",
    "demoInterest",
    "audio",
    "readStepIds",
    "clear",
    "archivesUnlocked",
    "sessionId"
  ],
  "requiredSceneIds": [
    "festival_concept",
    "map_mode01",
    "gx_experience",
    "esp32_pitch",
    "circle_invitation",
    "welcome_chat"
  ],
  "requiredInteractions": [
    "map01",
    "gx"
  ],
  "finalResults": [],
  "resultCopy": {},
  "generationDetails": {},
  "scenes": [
    {
      "id": "festival_concept",
      "number": 1,
      "title": "地球の感覚器",
      "chapter": "01 / CONCEPT",
      "duration": "0:00–1:45",
      "date": "10月3日（土）",
      "time": "AM 9:20–9:40",
      "location": "オンライン大学・年次対面イベント／海側広場・学生作品展示",
      "modeIndex": 0,
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 9:20–9:40｜オンライン大学・年次対面イベント／海側広場・学生作品展示",
        "date": "10月3日（土）",
        "time": "AM 9:20–9:40",
        "duration": "0:00–1:45",
        "location": "オンライン大学・年次対面イベント／海側広場・学生作品展示"
      },
      "steps": [
        {
          "id": "festival_concept_001",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面越しに眺めてきた大学へ、今日は自分の足で来た。知らない誰かの輪へ入るのが怖くて、それでも何かが変わるかもしれないと、海風の中で最初の一歩を踏み出した。"
        },
        {
          "id": "festival_concept_new_001",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "受付棟を抜けて海側の広場へ出ると、秋の日差しと潮風が頬に当たった。コーヒーと揚げものの匂いが混じり、ステージの低音が地面から靴底へ伝わってきた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_001"
        },
        {
          "id": "festival_concept_new_002",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "授業のほとんどをオンラインで行う大学が、年に一度だけ、海沿いの巨大な展示場へ学生を集める。ゲーム、映像、研究発表、参加型展示、ステージ、飲食区画。学生にとっては、この日が学園祭だ。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_001"
        },
        {
          "id": "festival_concept_005",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "私は電子工作が好きだ。誰かと相談するより、自宅の机で一人、基板と配線を相手に黙々と手を動かすほうが性に合っている。今日は出展者ではない。学内チャットで眺めているだけだった輪の中へ、顔も知らないまま一人で入るのが怖かった。何度も参加登録の画面を閉じ、見るだけなら話しかけなくていいと自分に言い聞かせて、ようやくここまで来た。"
        },
        {
          "id": "festival_concept_006",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "受付で学生証をかざす。短い電子音のあと、入場証が表示された。"
        },
        {
          "id": "festival_concept_new_003",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "受付を抜けると、行き交う学生たちの胸元の名札に、学内チャットで見たことのあるハンドルネームがいくつもあった。けれど、話したことのある名前は一つもない。画面の中にいた学生たちが友人を呼び、笑い合うたび、自分だけが名前のない匿名ユーザーのように、人の輪を外から眺めていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_006"
        },
        {
          "id": "festival_concept_008",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "受付棟の上階から海側を見下ろすと、テントと展示設備が幾何学模様のように広がり、その間を大勢の学生が行き交っていた。想像していた学園祭より、ずっと大きい。"
        },
        {
          "id": "festival_concept_new_004",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "吹き抜け越しに見える海までが会場の一部に思えた。私は人の流れと案内表示を目で追い、自分でも入れそうな展示を探した。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_008"
        },
        {
          "id": "festival_concept_010",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "受付棟から階段を下り、海風の吹く屋外展示エリアへ出る。歓声と呼び込みの間を歩いていると、五つの投影面が地球を包む没入型展示に目を奪われた。"
        },
        {
          "id": "festival_concept_011",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "雲の白い筋と海岸線が五つの面を渡り、光が静かに脈打つ。投影された地球と背後の海が借景のように重なり、展示がそのまま現実の海へ続いているようだった。私は歩く速度を落とした。"
        },
        {
          "id": "festival_concept_012",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "テント脇の案内板には、白い文字で「GAIA SENSEWARE｜地球の声、聴いてみませんか」と書かれている。"
        },
        {
          "id": "festival_concept_013",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "机の向こうで、淡い青のボブヘアの学生が、固定したケーブルを端から順に点検している。半分眠そうな目はコネクターの表示を正確に追い、机の端にはドライバーと結束バンドが整然と並んでいた。"
        },
        {
          "id": "festival_concept_014",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "その隣では、水面のような色の長い髪をした学生が、説明用のタブレットを確かめていた。表示された文章を上から下まで目で追い、最後の一行で一度だけ小さくうなずく。"
        },
        {
          "id": "festival_concept_015",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面へ近づくと、私の影が地球に重なった。青い髪の学生が顔を上げ、私と目が合う。肩の力を抜いたまま、声をかける合図のように小さくうなずいた。"
        },
        {
          "id": "festival_concept_016",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "女の子",
          "text": "「こんにちは。太古の海から、いま起きている気候の変化まで、触れてたどる展示です。よかったら体験してみませんか？」"
        },
        {
          "id": "festival_concept_new_005",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "最後の言葉に合わせて、彼女の口元が少しだけ緩んだ。呼び込み用の笑顔というより、私が断っても気にしないような、力の抜けた表情だった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_016"
        },
        {
          "id": "festival_concept_new_006",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "声をかけられると思っていなかった。こういう場所では、見終えたら誰とも話さず帰るつもりだった。私は少し遅れて会釈する。彼女は急かさず、言葉が出てくるまでこちらを見ていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_016"
        },
        {
          "id": "festival_concept_019",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい。お願いします」"
        },
        {
          "id": "festival_concept_new_007",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "返事を聞くと、青い髪の学生はわずかに目を細めた。私が投影面へ向き直るのを待ってから、地球の見方を短く案内する。落ち着いた声を聞くうちに、さっきまでの緊張が少しやわらいだ。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_019"
        },
        {
          "id": "festival_concept_021",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "女の子",
          "text": "「体験してくれて、ありがとうございます。改めまして、私は『あめ』です」"
        },
        {
          "id": "festival_concept_new_008",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "「あめ」と名乗っても、照れたり笑ったりはしなかった。柔らかな響きとは対照的に、言葉は簡潔だった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_021"
        },
        {
          "id": "festival_concept_023",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "もう一人の女の子",
          "text": "「私は『みず』と申します。あなたも、うちの大学の方ですの？」"
        },
        {
          "id": "festival_concept_024",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめと、みず。空から地上へ、二人の名前だけでひとつの流れができていた。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。"
        },
        {
          "id": "festival_concept_new_009",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "長い髪の学生もタブレットから顔を上げた。表情は落ち着いているが、「うちの大学」と言ったところで眉が少し上がる。答えを予想するより、こちらの返事を楽しみにしているように見えた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_024"
        },
        {
          "id": "festival_concept_new_010",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは名乗ったあとも、机の端のケーブルを指先で確かめている。みずはタブレットを両手で持ち、返事を待つあいだ、わずかに首を傾けていた。地球の青い光が、長い髪の内側へ薄く映っている。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_024"
        },
        {
          "id": "festival_concept_027",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい、同じ大学の学生です。今日は学生作品を見に来ました。この地球の展示が気になって」"
        },
        {
          "id": "festival_concept_new_011",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "みずの眉が元の位置へ戻り、目元が少し柔らかくなった。私は改めてブースを見回す。表示は一枚だけではなく、テントの奥から左右のパネルへ切れ目なく続いていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_027"
        },
        {
          "id": "festival_concept_029",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「すごいですね。ソフトウェアも演出も、映像の迫力も。学生作品で、ここまで本格的な展示を見られるとは思いませんでした」"
        },
        {
          "id": "festival_concept_new_012",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "思ったことが、そのまま口から出た。初対面の相手に自分から感想を伝えたのは、今日初めてだった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_029"
        },
        {
          "id": "festival_concept_031",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめの指がケーブルの上で止まる。みずが隣で、秘密を明かす順番を知っているように小さく笑った。"
        },
        {
          "id": "festival_concept_032",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「実は、親戚のおじさんがイルミネーション屋さんなんです。日中の屋外でも使える、20,000ルーメン級のプロジェクターを貸してくれて、設営も一緒に考えてくれました」"
        },
        {
          "id": "festival_concept_new_013",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめはテントの支柱に沿うケーブルを指でたどり、最後に展示台脇のプロジェクターを示した。借り物だと打ち明けても、その声には自分たちで作り上げた場所への誇らしさがあった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_032"
        },
        {
          "id": "festival_concept_034",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「20,000ルーメン……。明るさだけでなく、投影面の角度も海風への備えも、全部きちんと設計されているんですね」"
        },
        {
          "id": "festival_concept_new_014",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめが小さくうなずく。その横で、みずが楽しそうに口元をほころばせた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_034"
        },
        {
          "id": "festival_concept_036",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。日差しの中でも見やすい画面の向きも、海風でケーブルが揺れない留め方も、あめと一緒に考えてくださいましたの」"
        },
        {
          "id": "festival_concept_new_015",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "みずの言い方には、設営の日にあめや叔父と試行錯誤した時間を、誰かへ伝えたかったような弾みがあった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_036"
        },
        {
          "id": "festival_concept_038",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「私も、こう見えて電気工事は得意なんです」"
        },
        {
          "id": "festival_concept_039",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「あめは、電気工事士の資格も持っていますの。今日の配線も、あめと叔父さまが安全を確認しましたわ」"
        },
        {
          "id": "festival_concept_new_016",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "思わずあめを見ると、彼女は少しだけ胸を張った。眠そうな目のままなのに、今度は分かりやすく得意そうだった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_017",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "text": "「資格で扱えるのは、600V以下の一般用電気工作物だよ。このブースの配線も、その範囲で確認してる」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_018",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "text": "「あめは電気工事士だけでなく、第三種電気主任技術者の資格も持っていますの」",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_019",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "text": "「でも高圧設備を扱った経験はないよ。試験に受かっただけの、まだペーパー資格だから」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_020",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "低圧の配線から発電所や工場の高圧設備まで学んだということか。眠そうな顔との落差も含めて、素直にすごいと思った。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_045",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "text": "「資格まで持っているんだ。僕なんて、せいぜいマイコンにセンサーをつないで、値を送るくらいなのに」",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "festival_concept_new_021",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "言ってから、自分と比べる必要はなかったと気づく。完成したものを人に見せた経験もほとんどない。けれど、あめとみずは笑わず、同時にこちらを見た。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_045"
        },
        {
          "id": "festival_concept_047",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは「そのお話、あとで詳しく」と言うようにタブレットを胸元へ寄せた。あめも短くうなずく。自分の未完成のセンサーについて話したのに、隠したい気持ちより、続きを話したい気持ちが少しだけ勝っていた。"
        },
        {
          "id": "festival_concept_048",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「GAIA SENSEWAREって、何をするシステムなんですか？」"
        },
        {
          "id": "festival_concept_049",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは指を止め、こちらへ向き直った。あめも口を挟まず、みずのほうを見る。ここは彼女が答えるところらしい。"
        },
        {
          "id": "festival_concept_050",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球を観測し、変化を予測し、これから選べる未来を考える。それがGAIA SENSEWAREのコンセプトですの。ただ、実装はまだ始まったばかりですわ」"
        },
        {
          "id": "festival_concept_new_022",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "言い終えると、みずはこちらを見る。理解できたかを問うのではなく、最初の言葉をどこまで受け取ったか、表情から確かめようとしているようだった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_050"
        },
        {
          "id": "festival_concept_052",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「環境にいい行動を教えるだけの、いわゆる『エコ展示』とは少し違います」"
        },
        {
          "id": "festival_concept_new_023",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは「エコ展示」という言葉で、眉をほんの少し寄せた。嫌っているというより、その一言で全部まとめられることを警戒している顔だった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_052"
        },
        {
          "id": "festival_concept_new_024",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "環境展示と聞いて、私は節電やリサイクルの話を想像していた。どうやら、そういう展示ではないらしい。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_052"
        },
        {
          "id": "festival_concept_055",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「生まれたばかりの地球は、いまの生命には地獄のような環境でしたの。生命が海や大気や土を変え、その環境がまた次の生命を育ててきましたわ」"
        },
        {
          "id": "festival_concept_new_025",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "みずの声に、さっきセンサーの話を聞いたときとは別の熱が混じる。視線は私と地球のあいだを行き来し、言葉を重ねるほど少しずつ前のめりになっていく。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_055"
        },
        {
          "id": "festival_concept_057",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みずの視点は、いつも地球の始まりからなんだね」"
        },
        {
          "id": "festival_concept_058",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「いまだけを見ても、地球と生命が変え合ってきた理由は分かりませんもの」"
        },
        {
          "id": "festival_concept_new_026",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは小さく息を吐いた。困っているようで、止める気はないらしい。みずもそれが分かっている顔で、口元にかすかな笑みを残していた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_058"
        },
        {
          "id": "festival_concept_060",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「変化は一方向ではありません。環境と生命が影響を返し合う、その長い往復の中に私たち人間もいます」"
        },
        {
          "id": "festival_concept_new_027",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめが要点をまとめると、みずは「ええ」とだけ短く返した。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_060"
        },
        {
          "id": "festival_concept_062",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人の説明に応えるように、画面の地球から十本の光が伸びた。大気、海、森、都市。離れた現象が、同じ惑星の出来事として結ばれていく。"
        },
        {
          "id": "festival_concept_new_028",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "CO2や海流に混じって、都市や文化の文字もある。地球の観測という言葉から想像していた範囲より、ずっと広い。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_062"
        },
        {
          "id": "festival_concept_064",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球で起きていることを、見たり、聞いたり、触れたりできるようにする。いわば、まだ作りかけの『地球の感覚器』ですの」"
        },
        {
          "id": "festival_concept_new_029",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "十本の光を見つめるみずの表情には、作ったものを見せる誇らしさと、説明が正しく届くかを気にする緊張が同時にあった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_064"
        },
        {
          "id": "festival_concept_066",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「数字のままでは見えにくい変化を、地図や光や音へ翻訳しています。ただし表示が答えを決めるわけではありません。出典と時間の幅を確かめて、自分で読み取れるようにします」"
        },
        {
          "id": "festival_concept_new_030",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "画面上のCO2濃度が切り替わるたび、短い低音が一度鳴る。数値が更新されたことを、画面を見ていなくても知らせるための音だった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_066"
        },
        {
          "id": "festival_concept_new_031",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは画面下の出典欄に視線を移し、表示中の数値と提供元が合っているかを確かめた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_066"
        },
        {
          "id": "festival_concept_070",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「いま使っているのは、NASAやJAXA、気象庁などが公開している観測データです。利用条件を守れば誰でも使える、オープンデータです」"
        },
        {
          "id": "festival_concept_072",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「まずは、このデータで大気中のCO2濃度がどう変わってきたか見てみましょう」"
        },
        {
          "id": "festival_concept_new_032",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "最後にもう一度こちらを見て、あめが小さく目を細める。説明を聞く時間は終わり、今度は私が触る番だと促す合図に見えた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_072"
        },
        {
          "id": "festival_concept_new_033",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "気づくと、さっきより一歩、画面の近くに立っていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_072"
        },
        {
          "id": "festival_concept_075",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめが何かを押したようには見えなかった。それでも球体だった地球は静かに開き、世界地図へ切り替わった。"
        },
        {
          "id": "festival_concept_076",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "大気中のCO2と気温の記録が、薄い光になって地図へ重なっていく。"
        }
      ],
      "nextSceneId": "map_mode01"
    },
    {
      "id": "map_mode01",
      "number": 2,
      "title": "地球温暖化を地図で見る",
      "chapter": "02 / MAP 01",
      "duration": "1:45–3:25",
      "date": "10月3日（土）",
      "time": "AM 9:40–9:45",
      "location": "展示端末・地図MODE 01",
      "modeIndex": 0,
      "interaction": {
        "kind": "map01",
        "modeIndex": 0,
        "modeId": "breathing-earth",
        "requiredViews": [
          "timeline_complete"
        ]
      },
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 9:40–9:45｜展示端末・地図MODE 01",
        "date": "10月3日（土）",
        "time": "AM 9:40–9:45",
        "duration": "1:45–3:25",
        "location": "展示端末・地図MODE 01"
      },
      "steps": [
        {
          "id": "map_mode01_001",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "世界地図の横に、CO2濃度を示す一本の線が現れる。線は細かく上下しながら、ゆっくり右上へ伸びていた。"
        },
        {
          "id": "map_mode01_002",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "地図を見るだけだと思っていたが、世界地図は物語の上に小さな窓として開き、1958年から年代を自動で送り始めた。"
        },
        {
          "id": "map_mode01_003",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「こちらがMODE 01です。1958年から2050年まで、地球の変化を続けて見てください」"
        },
        {
          "id": "map_mode01_004",
          "sceneId": "map_mode01",
          "type": "interaction",
          "text": "",
          "interaction": {
            "kind": "map01",
            "modeIndex": 0,
            "modeId": "breathing-earth",
            "requiredViews": [
              "timeline_complete"
            ]
          }
        },
        {
          "id": "map_mode01_005",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "年代が進むたび、観測時点と大気中のCO2濃度が切り替わる。細かな季節変動を繰り返しながら、長期的には数値が上昇していった。"
        },
        {
          "id": "map_mode01_new_001",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "1958年の過去から現在を通り、2050年の試算へ進む。地球の明るさと背景の色が、数値に合わせて少しずつ変わる。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_005"
        },
        {
          "id": "map_mode01_007",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "観測データが現在まで進んだあと、表示は2050年の試算へ切り替わる。実測と予測の境界を示してから、地図の窓は静かに閉じて物語へ戻った。"
        },
        {
          "id": "map_mode01_008",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "年代ごとの値を並べると、同じ場所でも変化が見える。自宅のセンサーも、測った時刻を並べれば変化が分かる。そういうことか。"
        },
        {
          "id": "map_mode01_009",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「CO2は、植物の活動などによって季節ごとに上下しますの。けれど観測期間を長くすると、その波を重ねながら基準の高さが上がっていることが分かりますわ」"
        },
        {
          "id": "map_mode01_new_002",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "みずの目は、説明しているあいだも波の頂点を追っていた。暗記した文章を話すのではなく、いま画面に出ている変化を一緒に読んでいるように見える。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_009"
        },
        {
          "id": "map_mode01_011",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「毎年下がる時期はあっても、元の高さには戻っていない」"
        },
        {
          "id": "map_mode01_new_003",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "声に出すと、右肩上がりの線が急に現実味を持った。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_011"
        },
        {
          "id": "map_mode01_new_004",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "ここから見えない遠い場所の空気が、いま画面の一点に残っている。地図を見ることは、離れた場所を感じることなのかもしれない。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_011"
        },
        {
          "id": "map_mode01_013",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「はい。数年だけを見ると季節の上下が目立ちますが、数十年を続けて見ると、全体が上がっていることが分かります」"
        },
        {
          "id": "map_mode01_new_005",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "あめは何も言わず、画面から一度だけこちらへ視線を移した。こちらの理解が展示の意図とずれていないと分かって、少し安心したように見えた。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_013"
        },
        {
          "id": "map_mode01_015",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは画面の端を確かめてから、みずへ顔を向ける。"
        },
        {
          "id": "map_mode01_016",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ほいじゃ、次お願い」"
        },
        {
          "id": "map_mode01_017",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。ここからは気温ですわね」"
        },
        {
          "id": "map_mode01_018",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「気温の説明は長くしないでね」"
        },
        {
          "id": "map_mode01_019",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「必要なところだけですわ」"
        },
        {
          "id": "map_mode01_new_006",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "私に説明するときより少しだけ軽い声で答え、みずが画面へ手を伸ばす。あめは一歩だけ横へずれ、その場所を譲った。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_019"
        },
        {
          "id": "map_mode01_021",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "地図の右端に「気温偏差」の表示が点灯する。"
        },
        {
          "id": "map_mode01_022",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「次は、気温偏差を地図の変化として確かめてみてください」"
        },
        {
          "id": "map_mode01_023",
          "sceneId": "map_mode01",
          "type": "interaction",
          "text": "",
          "interaction": {
            "kind": "map01",
            "modeIndex": 0,
            "modeId": "breathing-earth",
            "phase": "temperature-anomaly",
            "requiredViews": [
              "long_term"
            ]
          }
        },
        {
          "id": "map_mode01_024",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "年代のスライダーを動かして地図の気になる場所に触れると、青から黄色、赤へ塗り分けられた色の配置が切り替わった。ある年の一枚だけなら、赤と青はまだらに見える。ところが同じ基準で年代を重ねると、赤い側へ移る場所が増えていった。"
        },
        {
          "id": "map_mode01_025",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「気温偏差は、その場所の気温と、基準となる期間の平均気温との差ですの」"
        },
        {
          "id": "map_mode01_026",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは地図の赤い場所ではなく、端にある凡例を先に指した。色の強さだけで判断させないためだと、少し遅れて気づく。"
        },
        {
          "id": "map_mode01_027",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「赤い場所ほど、基準より気温が高いんですね」"
        },
        {
          "id": "map_mode01_028",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。ただし一枚の地図では傾向も原因も決められませんの。同じ基準で時期と場所を比べて、どれほど続く変化かを確かめますわ」"
        },
        {
          "id": "map_mode01_new_007",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "画面の端に、使われているデータの情報が開く。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_028"
        },
        {
          "id": "map_mode01_030",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "カードには、提供元、観測期間、単位が並んでいた。地図の色が、どのデータから作られたのか確認できる。"
        },
        {
          "id": "map_mode01_031",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「これはNASAなどが公開しているオープンデータです。提供元、観測期間、基準期間、単位はこちらで確認できます。デモでは保存済みのデータを使っています」"
        },
        {
          "id": "map_mode01_032",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「いま届いているデータではないんですね」"
        },
        {
          "id": "map_mode01_033",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「将来はデータを自動更新し、統計解析や機械学習、深層学習、生成AIも使って予測を支援したいです。データサイエンスを知らない人でも、地球の変化と未来を考えられるシステムにしたいんです」"
        },
        {
          "id": "map_mode01_035",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の下に、まだ接続されていない入力欄が薄く現れる。そこには「参加者の温度・湿度データ」とある。自宅のセンサーで測った値も、ここから地図に加えられるのだろうか。"
        },
        {
          "id": "map_mode01_036",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは入力欄の動作を確認し、みずは空欄を見つめる私の顔を見ていた。思いつきを口にするのが怖くて、私はまだ黙っていた。それでも二人は、答えを急かさず待っているように見えた。"
        },
        {
          "id": "map_mode01_037",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「さらに、参加した人が自分で測った温度や湿度も、時刻、観測場所、機器、測り方と一緒に表示できるようにしたいですわ」"
        },
        {
          "id": "map_mode01_038",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「自分で測ったデータも、地球の表示に加えられるんですか」"
        },
        {
          "id": "map_mode01_new_008",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "自宅の机で動かしている小さなセンサーなら、いまも温度と湿度を記録できる。観測場所や時刻を添えて送れば、この地図に表示できるデータになるかもしれない。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_038"
        },
        {
          "id": "map_mode01_040",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「はい。参加者のセンサーは、測った場所や時刻、条件を添えて表示します。身近な観測を持ち寄って、みんなで地球の違いを確かめられるようにしたいんです」"
        },
        {
          "id": "map_mode01_new_009",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "地図が丸まり、現在の地球へ戻る。赤や青の色は消え、雲だけがゆっくり流れている。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_040"
        },
        {
          "id": "map_mode01_042",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "私は画面から指を離した。それでも空欄を目で追う。測った数値は、条件がなければ比べられない。逆に条件まで見せれば、未完成の工作も誰かと検証できるのかもしれない。"
        },
        {
          "id": "map_mode01_043",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ここまでは、いま観測されている地球です。次は、時間を大きくさかのぼります」"
        }
      ],
      "nextSceneId": "gx_experience"
    },
    {
      "id": "gx_experience",
      "number": 3,
      "title": "太古の海に触れる",
      "chapter": "03 / DEEP TIME",
      "duration": "3:25–5:35",
      "date": "10月3日（土）",
      "time": "AM 9:45–9:53",
      "location": "展示端末・GX／太古の海",
      "modeIndex": 0,
      "interaction": {
        "kind": "gx",
        "requiredGestures": 3
      },
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 9:45–9:53｜展示端末・GX／太古の海",
        "date": "10月3日（土）",
        "time": "AM 9:45–9:53",
        "duration": "3:25–5:35",
        "location": "展示端末・GX／太古の海"
      },
      "steps": [
        {
          "id": "gx_experience_001",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "表示は現在の地球から、太古の海を再現した映像へ自動で切り替わる。"
        },
        {
          "id": "gx_experience_002",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "さっきまでの世界地図が遠ざかり、都市の光も国境も消える。代わりに、暗い海が画面いっぱいに広がった。"
        },
        {
          "id": "gx_experience_003",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面が切り替わる瞬間、あめは端に出た読み込み表示を見ていた。みずは太古の海が現れるまで、こちらの表情を見ている。驚く場所を知っている人の待ち方だった。"
        },
        {
          "id": "gx_experience_004",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、音どう？」"
        },
        {
          "id": "gx_experience_005",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「大丈夫ですわ。今日はきれいに聞こえていますの」"
        },
        {
          "id": "gx_experience_006",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ええ。よかった」"
        },
        {
          "id": "gx_experience_007",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人のあいだだけで交わされた短い確認のあと、あめはこちらへ向き直る。そのときには、声がまた説明員の丁寧な調子へ戻っていた。"
        },
        {
          "id": "gx_experience_008",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ここからは、地球そのものの変化を扱います。GXという言葉を知っていますか？　もしくは、どこかで見たことがありますか？」"
        },
        {
          "id": "gx_experience_009",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「企業の広告で見たことがあります。Green Transformation、ですよね」"
        },
        {
          "id": "gx_experience_010",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「一般には、脱炭素へ社会を変えるGreen Transformationですわ。わたくしたちは地球の未来を考える大学の授業で、生命と地球が変え合う歴史まで含めたいと思いました。そこで考えたのが、GAIA Transformationという概念ですの」"
        },
        {
          "id": "gx_experience_011",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ここでは、生命と地球が互いを変えてきた過程を、時間をさかのぼりながら見ていきます」"
        },
        {
          "id": "gx_experience_012",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の下に、現在から太古まで続く時間軸が現れる。"
        },
        {
          "id": "gx_experience_013",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "目盛りの端にある「現在」は、ほとんど線のように細い。その先に、見たことのない長さの時間が横たわっていた。"
        },
        {
          "id": "gx_experience_014",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ではデモを始めますわ。現在から、地球が生まれた約四十六億年前まで一気にさかのぼりますの」"
        },
        {
          "id": "gx_experience_015",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「四十六億年前まで戻るんですか」"
        },
        {
          "id": "gx_experience_016",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。いまの海や大気とは、まったく違う地球まで戻りますの」"
        },
        {
          "id": "gx_experience_017",
          "sceneId": "gx_experience",
          "type": "interaction",
          "text": "",
          "interaction": {
            "kind": "gx",
            "requiredGestures": 3
          }
        },
        {
          "id": "gx_experience_018",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "デモが始まると、現在の地球が遠ざかり、年代表示が高速で巻き戻されていく。指で促すたび、都市も森も輪郭を失っていった。"
        },
        {
          "id": "gx_experience_020",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "四十六億年分の変化が進み、画面には岩と水、酸素の乏しい大気が広がった。見慣れたものが一つずつ消えるたびに、どこまで戻れば地球が地球でなくなるのか考えた。けれど、岩と海だけになっても、画面にはまだ地球と表示されていた。"
        },
        {
          "id": "gx_experience_021",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "年代表示が、今度はゆっくりと先へ進み始める。地表に水が満ち、海の色が深くなっていく。やがて表示が止まった。約二十七億年前。暗い海の底で、まだ見えない何かが、静かに息を始めていた。"
        },
        {
          "id": "gx_experience_022",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「水面を、ゆっくりなぞってみてくださいまし」"
        },
        {
          "id": "gx_experience_023",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "人差し指で画面に触れる。黒に近かった水面が、触れた場所だけわずかに青くなる。"
        },
        {
          "id": "gx_experience_024",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが画面を示そうと私のほうへ身を乗り出す。長い髪が肩のすぐ近くで揺れ、異性とこんな距離で話した経験のない私は、説明より先に心臓の音を意識した。"
        },
        {
          "id": "gx_experience_025",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、近づきすぎだよ」"
        },
        {
          "id": "gx_experience_026",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「あら。失礼しましたわ」"
        },
        {
          "id": "gx_experience_027",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "そう言いながらも、みずが戻ったのはほんの数センチだった。あめはそれ以上言わず、私の指ではなく、画面の隅に流れる数値を見ている。一人は現象を見せ、一人は表示が正しく動いているかを見ていた。"
        },
        {
          "id": "gx_experience_028",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "指のあとへ、青緑色の小さな点が灯る。"
        },
        {
          "id": "gx_experience_029",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "点が灯るたび、短い音が返ってくる。はじめは会場の雑音に紛れていたが、点が増えると音同士が重なり、暗い海の奥から届く信号のように聞こえた。"
        },
        {
          "id": "gx_experience_030",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "暗い海の中で、点は呼吸するように明るくなり、やがて細い金色の筋を周囲へ伸ばしていく。"
        },
        {
          "id": "gx_experience_031",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「光合成を行う小さな生命の活動を、光として表現していますの」"
        },
        {
          "id": "gx_experience_032",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「この光が、酸素をつくっているんですね」"
        },
        {
          "id": "gx_experience_033",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「これはシアノバクテリアです。海で光合成を行い、酸素を生み出した微小な細菌です」"
        },
        {
          "id": "gx_experience_035",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "光は増えるだけではなかった。生まれたそばから海の中へ吸い込まれ、何度も途切れる。私は指を止めたまま、その行方を追った。"
        },
        {
          "id": "gx_experience_036",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「生まれた酸素は、最初から大気へたまったわけではありませんわ。長いあいだ、海水中の鉄など、別の物質との反応に使われましたの」"
        },
        {
          "id": "gx_experience_037",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "時間を先へ進めると、海の色が少しずつ変わる。やがて大気にも、淡い光の層が現れる。"
        },
        {
          "id": "gx_experience_038",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "ほんの数秒の表示に、気の遠くなる時間が畳み込まれている。小さな生命は一つずつでは目立たない。それでも無数の活動が積み重なり、物質の循環を通じて海と空の条件を変えていた。"
        },
        {
          "id": "gx_experience_new_001",
          "sceneId": "gx_experience",
          "type": "narration",
          "text": "あめは静かな声で説明し、みずは私の反応を待った。画面の変化を、自分の速度で受け止められた。",
          "speaker": "narrator",
          "cueFromStepId": "gx_experience_038"
        },
        {
          "id": "gx_experience_040",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「生命の活動は、地球環境を変える要因の一つになりました」"
        },
        {
          "id": "gx_experience_041",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「生命が海と大気を変え、その環境が次の生命を変えましたの。互いに影響を与えながら進む――これが地球と生命の共進化ですわ」"
        },
        {
          "id": "gx_experience_042",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "太古の海の表示が閉じ、投影面に現在の地球が戻る。森、都市、夜の光が、いつもの展示空間へ重なっていった。"
        },
        {
          "id": "gx_experience_043",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「いまの私たちの暮らしも、地球へ影響を与え、地球の変化から影響を受けています。これから何を共につくるかも、その関係の一部です」"
        },
        {
          "id": "gx_experience_new_002",
          "sceneId": "gx_experience",
          "type": "narration",
          "text": "生命が環境を変え、変わった環境が生命の条件を変える。画面を行き来する光を見て、共進化とは、完成へ向かう一本道ではなく影響を返し合うことなのだと分かった。",
          "speaker": "narrator",
          "cueFromStepId": "gx_experience_043"
        },
        {
          "id": "gx_experience_055",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の端に、海、森、都市、地震、宇宙などを開くボタンが並んだ。"
        },
        {
          "id": "gx_experience_056",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「今日はCO2濃度の地図と、四十六億年をたどるデモを体験してもらいました。ほかのボタンからも、違う地球の変化を見られます」"
        },
        {
          "id": "gx_experience_057",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「一つの展示なのに、見る時間や感覚を変えるだけで、地球がまったく別の存在に見えます。まだ触っていないものも気になります」"
        },
        {
          "id": "gx_experience_058",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「そう言ってもらえるとうれしいです。気になるものは、あとでゆっくり試してください。分からないところは、私たちも一緒に考えます」"
        }
      ],
      "nextSceneId": "esp32_pitch"
    },
    {
      "id": "esp32_pitch",
      "number": 4,
      "title": "もう一つの感覚器",
      "chapter": "04 / PROPOSAL",
      "duration": "5:35–7:15",
      "date": "10月3日（土）",
      "time": "AM 9:53–10:00",
      "location": "年次対面イベント・GAIA SENSEWARE展示ブース",
      "modeIndex": 0,
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 9:53–10:00｜年次対面イベント・GAIA SENSEWARE展示ブース",
        "date": "10月3日（土）",
        "time": "AM 9:53–10:00",
        "duration": "5:35–7:15",
        "location": "年次対面イベント・GAIA SENSEWARE展示ブース"
      },
      "steps": [
        {
          "id": "esp32_pitch_001",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面に秋の日差しと海辺の会場が戻る。暗い海を見ていた目には、パネルへ差す光が少しまぶしい。"
        },
        {
          "id": "esp32_pitch_002",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "太古の海の残像が消えるまで、私は画面の前から動けなかった。"
        },
        {
          "id": "esp32_pitch_new_001",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "あめは端末から手を離し、こちらを見る。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_002"
        },
        {
          "id": "esp32_pitch_004",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「デモはここまでです。いかがでしたか？」"
        },
        {
          "id": "esp32_pitch_005",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "感想を答えようとして、操作パネルの参加型センサー欄に目が止まる。二人が時間をかけて作った展示へ、自分の安い工作を持ち出すのは怖い。それでも、ここなら机の上だけで終わっていた記録に意味を与えられるかもしれない。"
        },
        {
          "id": "esp32_pitch_006",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "案を笑われたら、センサーを人に見せる勇気まで失いそうだった。けれど、個人の測定をこの展示へつなげられるか確かめずに帰れば、きっと後悔する。私は二人の反応を聞くために口を開いた。"
        },
        {
          "id": "esp32_pitch_007",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「これ、個人で作ったセンサーの値も入れられますか」"
        },
        {
          "id": "esp32_pitch_008",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめも、みずも、すぐには答えなかった。失敗したと思いかけたとき、二人が続きを待っているのだと気づいた。"
        },
        {
          "id": "esp32_pitch_009",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめの視線が机の配線へ走り、みずの指がタブレットの上で止まる。評価されているのではない。二人とも、私の案を自分たちの問題として考え始めていた。"
        },
        {
          "id": "esp32_pitch_010",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「ESP32という、小さなコンピューターのような基板をよく使うんです。いくつかのセンサーをつないで、測った値をその場で処理したり、Wi-Fiで送ったりできます」"
        },
        {
          "id": "esp32_pitch_011",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ESP32って、どんな基板なんですか？　値段や性能、できることも教えてください」"
        },
        {
          "id": "esp32_pitch_new_002",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "質問が具体的だったので、少し安心した。得意な話なら、言葉が出る。自宅の机で何度も組み直した部品と配線が、頭の中で順番につながった。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_011"
        },
        {
          "id": "esp32_pitch_013",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「千円前後から買える小型マイコンで、Wi-FiとBluetoothを内蔵しています。温湿度、照度、大気、水質、音や振動などのセンサーを組み合わせられます。最近は生成AIへ相談しながら、プログラムだけでなく回路設計も進められます」"
        },
        {
          "id": "esp32_pitch_new_003",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "思いつくまま並べると、あめの指がもうタブレットの上で動き始めていた。みずは口を挟まず、測れるもの同士のつながりを考えるように、ゆっくり視線を動かしている。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_013"
        },
        {
          "id": "esp32_pitch_015",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「全データを送るだけでなく、ESP32側で平均を計算したり、急な変化を検知したり、複数の値から簡単な判定もできます。現場で先に処理するので、エッジ処理と呼びます」"
        },
        {
          "id": "esp32_pitch_016",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「公開データが地球を広く見るものなら、ESP32は身近な一点を細かく観測できます」"
        },
        {
          "id": "esp32_pitch_016a",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "あめが腕を組み、投影面の出典欄へ目をやった。考える顔だった。",
          "speaker": "narrator"
        },
        {
          "id": "esp32_pitch_016b",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「気になる点が二つ。一つは、個人のセンサー値と、NASAや気象庁の観測値を同じ地図に載せたら、見た人がどちらが正しいのか混同しない？」",
          "speaker": "amane",
          "speakerLabel": "あめ"
        },
        {
          "id": "esp32_pitch_016c",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「……あ。確かに、そのままだと混ざって見えます」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "esp32_pitch_016d",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「もう一つ。日なたと日陰じゃ、同じ時刻でも値が全然違う。場所も時刻も分からない値が並んだら、比較のしようがないよ。思いつきは面白い。でも今のままじゃ、展示には載せられない」",
          "speaker": "amane",
          "speakerLabel": "あめ"
        },
        {
          "id": "esp32_pitch_016e",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "言い返したいのに、言葉が出てこない。さっきまで流れていた話が、そこで止まった。あめの言うことは、展示でずっと見てきた「条件」そのものだった。出典も、時間の幅も、二人は最初から見せてくれていた。",
          "speaker": "narrator"
        },
        {
          "id": "esp32_pitch_016f",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "その横に、自宅のセンサーで記録してきた値がある。条件さえ残せば、比べられない値は、比べられる値になる。",
          "speaker": "narrator"
        },
        {
          "id": "esp32_pitch_016g",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「……じゃあ、こういうのは？　個人の測定は、公開観測データとは分けて表示する。必ず時刻・場所・機器・設置条件を添えて、『その一点で、その瞬間に測った値』だと分かるようにする」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "esp32_pitch_016h",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「値が違ったら誤差で片づけない。条件をたどって、天候なのか、設置の仕方なのかを確かめる。比較できないから捨てるんじゃなく、比較できる形で残すんです」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "esp32_pitch_016i",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「……それなら、比較の土台ができる。いいね」",
          "speaker": "amane",
          "speakerLabel": "あめ"
        },
        {
          "id": "esp32_pitch_017",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが説明用のタブレットから顔を上げる。"
        },
        {
          "id": "esp32_pitch_018",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「公開機関の観測データとは分けて、参加者がその場で測ったデータとして表示するのですね」"
        },
        {
          "id": "esp32_pitch_019",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、その整理すごく分かりやすい。消さずに、試作メモへ入れておいて」",
          "expression": "bright"
        },
        {
          "id": "esp32_pitch_020",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「もう書いていますわ」"
        },
        {
          "id": "esp32_pitch_021",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ええ。さすが」"
        },
        {
          "id": "esp32_pitch_new_004",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "みずは少しだけ得意そうに眉を上げた。あめも口元を緩める。私の案を二人の会話の中で扱ってくれていることが、言葉以上にうれしかった。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_021"
        },
        {
          "id": "esp32_pitch_024",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい。場所、時刻、センサーの種類を付けます。正確な住所は出さず、地域は大まかにできます」"
        },
        {
          "id": "esp32_pitch_025",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「通信が切れたら、センサーの欄だけを『未接続』にします。地図などはそのまま使えます。再接続できたら、受信と表示を自動で再開します」"
        },
        {
          "id": "esp32_pitch_new_005",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "話しているうちに、見学者の感想ではなく、試作の相談になっていた。自分の未完成品を見せるのと同じ怖さが戻り、二人の表情を確かめる。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_025"
        },
        {
          "id": "esp32_pitch_028",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "入力する指が速い。私が口にした項目が、言葉の順番どおりにメモへ並んでいく。みずはその隣から、単位と観測条件だけを静かに足していた。"
        },
        {
          "id": "esp32_pitch_new_006",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「いいですね。広い範囲の観測と、手元の一点を分けて扱えます。違いを誤差で片づけず、観測条件までたどれます。通信が切れても、ほかの機能はそのままです」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "esp32_pitch_028"
        },
        {
          "id": "esp32_pitch_new_007",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「測定値と一緒に、時刻、場所、機器、設置条件を残しましょう。同じ地域でも差が出たとき、天候なのか設置方法なのかを確かめられますわ」",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "cueFromStepId": "esp32_pitch_028"
        },
        {
          "id": "esp32_pitch_031",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「まずは一台で概念実証、PoCまでなら、手元の部品で始められます」"
        },
        {
          "id": "esp32_pitch_032",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「先に、最初のPoCで確かめたいことを一つ決めましょう。たとえば日なたと日陰の差なら、必要なセンサーと設置条件も決められます」"
        },
        {
          "id": "esp32_pitch_033",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめはタブレットへ「1台でPoC」と書き加え、期待を隠さない目でこちらを見た。自宅で閉じていた部品箱が、初めて誰かとの実験につながった。"
        },
        {
          "id": "esp32_pitch_034",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「この案、会場だけで終わらせたくない。試作として進めよう」",
          "expression": "bright"
        },
        {
          "id": "esp32_pitch_035",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。測った値だけでなく、あとで比較できる条件まで設計に入れますわ」",
          "expression": "smile"
        },
        {
          "id": "esp32_pitch_036",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「最初から全部は詰め込まないで、一台で確かめられる範囲に絞ろう」"
        },
        {
          "id": "esp32_pitch_037",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「承知しましたわ。続きは、試してからですわね」"
        },
        {
          "id": "esp32_pitch_new_008",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "あめがPoCの目的を囲み、みずが時刻・場所・機器・設置条件を追記した。二人の表情はもう見学者へ向けるものではない。私の思いつきが、三人で試す計画へ変わっていった。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_037"
        },
        {
          "id": "esp32_pitch_039",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「本当に使えそうですか」"
        },
        {
          "id": "esp32_pitch_040",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「使えます。センサーで変化を測り、条件の違うデータと比べて、次はどこをどう測るか決められます。GAIA SENSEWAREが目指している流れに合っています」"
        },
        {
          "id": "esp32_pitch_041",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「公開データだけでは見えない身近な環境を、参加者のセンサーが補えますの。青猫さんが具体的な方法を持ってきてくださったから、実験として始められますわ」"
        },
        {
          "id": "esp32_pitch_new_009",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "みずはまっすぐこちらを見て言った。あめも、記録したメモを消さずに残している。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_041"
        },
        {
          "id": "esp32_pitch_043",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "ただ、メモのどこにも私の名前はなかった。この案の続きを一緒に作りたいと思っている自分に、そのとき初めて気づいた。"
        }
      ],
      "nextSceneId": "circle_invitation"
    },
    {
      "id": "circle_invitation",
      "number": 5,
      "title": "惑星の放課後",
      "chapter": "05 / AFTER SCHOOL",
      "duration": "7:15–9:05",
      "date": "10月3日（土）",
      "time": "AM 10:00–10:07",
      "location": "年次対面イベント・GAIA SENSEWARE展示ブース",
      "modeIndex": 0,
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 10:00–10:07｜年次対面イベント・GAIA SENSEWARE展示ブース",
        "date": "10月3日（土）",
        "time": "AM 10:00–10:07",
        "duration": "7:15–9:05",
        "location": "年次対面イベント・GAIA SENSEWARE展示ブース"
      },
      "steps": [
        {
          "id": "circle_invitation_001",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "展示終了まで、あと三十分だというアナウンスが流れた。隣のブースでは、配布物を箱へ戻し始めている。"
        },
        {
          "id": "circle_invitation_002",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面が現在の地球へ戻る。二人と一緒に試作を進める光景が一瞬浮かんだ。けれど、連絡先も知らないままこの場を離れるのが、来たときより少し寂しかった。"
        },
        {
          "id": "circle_invitation_new_001",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "何か、もう一つ質問はなかっただろうか。CO2のことでも、太古の海のことでもいい。話を続けられる理由を探したが、思いつくものは全部、さっき二人が教えてくれていた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_002"
        },
        {
          "id": "circle_invitation_004",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "明日には、今日交わした言葉も名前も、広いインターネットの海へ溶けてしまうかもしれない。アバターでもホログラムでもない二人の表情と声を、私はもう少し近くで覚えていたかった。"
        },
        {
          "id": "circle_invitation_new_002",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "ついさっきまで名前も知らなかった三人が、同じ地球を前にして一つの実験を考えている。その時間を、ここで終わらせたくなかった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_004"
        },
        {
          "id": "circle_invitation_006",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「このシステム、これからも作り続けるんですか」"
        },
        {
          "id": "circle_invitation_007",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「はい。いまの形を、完成品だとは思っていません」"
        },
        {
          "id": "circle_invitation_008",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球は明日も変わりますもの。人の力も、乱す側にしか働かないと決まったわけではありませんわ。観測して、つくり直し続けたいですの」"
        },
        {
          "id": "circle_invitation_new_003",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「二人と何かを作りたいと思っていました。でも、作ることは口実なのかもしれません。画面越しではない声で、また二人と話したいんです」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "cueFromStepId": "circle_invitation_008"
        },
        {
          "id": "circle_invitation_new_004",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "それでも黙って帰れば、また一人の机へ戻るだけだ。そのほうが、断られることより苦しかった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_008"
        },
        {
          "id": "circle_invitation_011",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「自宅でデータや出典を見直したいので、この展示は家からでも見られますか？」"
        },
        {
          "id": "circle_invitation_012",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "いかにも実務的な理由を、私は必要以上に丁寧な声で並べた。口実だと伝わったのか、二人は一度だけ顔を見合わせた。"
        },
        {
          "id": "circle_invitation_013",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが閉じたタブレットに指を添え、あめの視線がその指からみずの顔へ移った。二人はほんの短いあいだ顔を見合わせる。説明の順番を決めているのではない。どこまで言っていいのか、互いの気持ちを確かめているように見えた。"
        },
        {
          "id": "circle_invitation_015",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「公開しているページなら見られます。でも、いま作っている部分はまだ出していません」"
        },
        {
          "id": "circle_invitation_new_005",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめはすぐに答えず、タブレットの端を指でなぞった。それから、少し申し訳なさそうに首を振る。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_015"
        },
        {
          "id": "circle_invitation_017",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「制作の相談は、学内チャットで続けていますの」"
        },
        {
          "id": "circle_invitation_new_006",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずはそう言いながら、机の端へ手を伸ばした。けれど何も取らず、指先を止める。私が次に何を言うのか待っている。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_017"
        },
        {
          "id": "circle_invitation_019",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "オンライン大学のチャットは、これまで授業の連絡を読むだけの場所だった。二人がそこにいると知っただけで、広く静かだった校舎に手の届く部屋ができたように感じた。"
        },
        {
          "id": "circle_invitation_020",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「制作の話をしているチャットに、僕も参加できますか？」"
        },
        {
          "id": "circle_invitation_021",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "背後を台車が通り、車輪の音が遠ざかる。そのあいだ、あめは何も言わなかった。"
        },
        {
          "id": "circle_invitation_022",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の地球からこちらへ視線を戻す。半分眠そうだった目が、いまは少しだけ細くなっている。口元も、ほんのわずかに緩んだ。質問の裏側まで聞こえたような顔だった。"
        },
        {
          "id": "circle_invitation_023",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「見学だけのつもりなら、そんなに真剣な顔では聞かないですよね」",
          "expression": "smile"
        },
        {
          "id": "circle_invitation_024",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが目を丸くして、あめの横顔を見る。あめは気づいているはずなのに、そちらを見なかった。"
        },
        {
          "id": "circle_invitation_new_007",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "答えに詰まった。見るだけでは足りない。完成したものを褒める側ではなく、失敗を見せ合いながら作る側へ行きたかった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_024"
        },
        {
          "id": "circle_invitation_026",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「何か、できることがあれば」"
        },
        {
          "id": "circle_invitation_027",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの目元が、ゆっくり柔らかくなる。それでもすぐには動かず、もう一度あめを見た。"
        },
        {
          "id": "circle_invitation_028",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "今度は、あめが小さくうなずいた。"
        },
        {
          "id": "circle_invitation_029",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "それを見てから、みずは机の端から小さな案内カードを取り出した。丸い惑星の絵と、「惑星の放課後」という文字が印刷されている。こちらへ文字が見える向きに差し出したが、手元で止めて次の言葉を待った。"
        },
        {
          "id": "circle_invitation_030",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「私たちのサークルは、このGAIA SENSEWAREを作りながら、それぞれの興味や得意なことを持ち寄る場所です」"
        },
        {
          "id": "circle_invitation_031",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「このシステムの続きも、ここで話していますの」"
        },
        {
          "id": "circle_invitation_new_008",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "いつもの丁寧な声だったが、最後の一文だけ少しゆっくりだった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_031"
        },
        {
          "id": "circle_invitation_new_009",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめは案内カードを見たあと、またこちらへ視線を戻す。机に添えた手は動かないままだった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_031"
        },
        {
          "id": "circle_invitation_034",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「さっきの案、言い出した人がいないと始められません」"
        },
        {
          "id": "circle_invitation_035",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは返事を急かさず、それでも期待を隠せない目で私を見ていた。"
        },
        {
          "id": "circle_invitation_new_010",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずはカードを持ったまま、その縁を一度だけ指先でなぞった。笑ってはいなかった。冗談ではなく、二人で同じ返事を選んだのだと分かった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_035"
        },
        {
          "id": "circle_invitation_038",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人は黙って私の答えを待った。海風と展示の低い駆動音だけが、短い沈黙を埋めた。"
        },
        {
          "id": "circle_invitation_039",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「じゃあ、最後まで付き合います」"
        },
        {
          "id": "circle_invitation_new_011",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめの肩から力が抜けた。小さく息を吐き、ようやくみずのほうを見る。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_039"
        },
        {
          "id": "circle_invitation_040",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずも同じタイミングであめを見た。二人の口元に、ほとんど同時に笑みが浮かぶ。さっきまで隠していたものが、返事を聞いてようやく表へ出たようだった。"
        },
        {
          "id": "circle_invitation_new_012",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "返事を聞くと、みずはカードをもう一歩こちらへ近づけた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_040"
        },
        {
          "id": "circle_invitation_043",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「では次は、見学者ではなく仲間として、一緒に試してみませんこと？」"
        },
        {
          "id": "circle_invitation_new_013",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "居場所は、誰かから完成品として与えられるものではない。何かを一緒に試し、そのたびに互いが少しずつ変わる。その共進化の途中に、いつの間にか生まれるものなのかもしれない。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_043"
        },
        {
          "id": "circle_invitation_new_014",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "二人へ向き直り、今度は迷わず答えた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_043"
        },
        {
          "id": "circle_invitation_046",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「これから、よろしくお願いします」"
        },
        {
          "id": "circle_invitation_new_015",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "答えると、あめの肩からわずかに力が抜けた。断られる可能性を考えていたらしい。みずは隠すことなく声を弾ませ、カードを手渡す距離まで差し出した。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_046"
        },
        {
          "id": "circle_invitation_048",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "私は二人の間から、そのカードを受け取った。"
        },
        {
          "id": "circle_invitation_049",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "QRコードを読むと、学生ポータルにサークルの参加画面が開く。"
        },
        {
          "id": "circle_invitation_050",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "押す前に一度だけ、あめとみずを見る。二人とも急かさず、こちらの手元を待っていた。"
        },
        {
          "id": "circle_invitation_051",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "親指でJOINに触れる。"
        },
        {
          "id": "circle_invitation_052",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "短い電子音が鳴り、画面が「参加しました」に変わる。"
        },
        {
          "id": "circle_invitation_new_016",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "通知音に、あめがこちらを見た。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_052"
        },
        {
          "id": "circle_invitation_054",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "半分眠そうだった目がはっきり開く。次の瞬間、口元だけでなく頬まで緩んだ。今日見た中で、いちばん大きな表情だった。"
        },
        {
          "id": "circle_invitation_055",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ええ。参加できています」"
        },
        {
          "id": "circle_invitation_new_017",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "そう告げる声は落ち着いていたが、あめはこちらから視線を外さなかった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_055"
        },
        {
          "id": "circle_invitation_new_018",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずはそんなあめを見て、それから私を見る。驚いたように目を丸くしたあと、胸の前で両手を合わせた。堪えていた笑みが、そのまま目元まで広がっていく。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_055"
        },
        {
          "id": "circle_invitation_058",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「うれしいですわ。本当に来てくださるのですね」"
        },
        {
          "id": "circle_invitation_059",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みずも、待ってたね」"
        },
        {
          "id": "circle_invitation_060",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「あめもでしょう？」"
        },
        {
          "id": "circle_invitation_new_019",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「ええ」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_new_020",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "二人は目を合わせ、また笑った。今度は隠すための間もなかった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_new_021",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "自分で参加を押したのに、二人がこれほど喜ぶとは思っていなかった。胸の奥に、少し遅れて実感が追いついてくる。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_new_022",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「みず、先に言った」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_065",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ようこそ、『惑星の放課後』へ。これからよろしくお願いいたしますわ」",
          "expression": "smile"
        },
        {
          "id": "circle_invitation_066",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "text": "「放課後は長いから、歓迎会は次の実験と一緒でいいよ」",
          "speakerLabel": "あめ",
          "expression": "bright"
        },
        {
          "id": "circle_invitation_new_023",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "画面に歓迎の文字が浮かんだあと、私は投影面から二人へ視線を戻した。同じ海風の中に立つ二人の生身の表情が、あらためて目に入った。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_066"
        },
        {
          "id": "circle_invitation_068",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「制作は、わたくしとあめ、それから今日は来られなかったsakuさんの三人で進めていますの」"
        },
        {
          "id": "circle_invitation_new_024",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「sakuはシステム全体の設計と進行を見ています。アーキテクト兼プロデューサー、というのが近いです」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_068"
        },
        {
          "id": "circle_invitation_new_025",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「GAIA SENSEWAREという名前を最初につけたのもsakuですの。機能と物語を、一つの作品へまとめていますわ」",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "cueFromStepId": "circle_invitation_068"
        },
        {
          "id": "circle_invitation_069",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「sakuは遠い海の向こうの国に住んでるから、今日は会場まで来られなかったんだ」"
        },
        {
          "id": "circle_invitation_072",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "遠い国にいる学生と同じサークルを作り、学園祭の展示まで完成させている。さすがオンライン大学だ、と私は妙なところで感心した。"
        },
        {
          "id": "circle_invitation_073",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "加入通知と一緒に、学内チャットの新着が表示される。"
        },
        {
          "id": "circle_invitation_074",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "参加画面には、「青猫が『惑星の放課後』に参加しました」と出ていた。みずの視線が、その二文字で止まる。"
        },
        {
          "id": "circle_invitation_075",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「青猫さん、というのですね。すてきなお名前ですわ」"
        },
        {
          "id": "circle_invitation_new_026",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「みず、先に言ったね」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_027",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「まあ。同じことを思っていましたの？」",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_028",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめはみずには答えず、少しだけ気まずそうにこちらを見る。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_029",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「……はい。いい名前だと思います」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_030",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずは楽しそうに目を細めた。あめはまた画面へ視線を戻したが、耳が少し赤くなっていた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_081",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "チャットの中でしか使ってこなかった名前が、同じ展示場にいる二人の声になった。呼ばれただけなのに、さっきより少し近くに立っている気がした。"
        }
      ],
      "nextSceneId": "welcome_chat"
    },
    {
      "id": "welcome_chat",
      "number": 6,
      "title": "つながる世界",
      "chapter": "06 / WELCOME",
      "duration": "9:05–11:30",
      "date": "10月3日（土）",
      "time": "AM 10:07–10:45",
      "location": "学内チャット「惑星の放課後」／午前展示枠終了後の海側広場",
      "modeIndex": 0,
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 10:07–10:45｜学内チャット「惑星の放課後」／午前展示枠終了後の海側広場",
        "date": "10月3日（土）",
        "time": "AM 10:07–10:45",
        "duration": "9:05–11:30",
        "location": "学内チャット「惑星の放課後」／午前展示枠終了後の海側広場"
      },
      "steps": [
        {
          "id": "welcome_chat_001",
          "sceneId": "welcome_chat",
          "type": "chatSurface",
          "text": "惑星の放課後_雑談"
        },
        {
          "id": "welcome_chat_002",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "学生ポータルから、サークルの学内チャットが開く。画面にあるのはハンドルネームと文字だけで、人物画像は一つも表示されていない。"
        },
        {
          "id": "welcome_chat_new_001",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "スマートフォンの画面には、『惑星の放課後』の未読表示が小さく光っていた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_002"
        },
        {
          "id": "welcome_chat_004",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:06",
          "speaker": "system",
          "speakerLabel": "SYSTEM",
          "text": "青猫が「惑星の放課後」に参加しました。"
        },
        {
          "id": "welcome_chat_new_002",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "二人に呼ばれたばかりの名前が、今度はチャットの参加通知に現れている。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_004"
        },
        {
          "id": "welcome_chat_006",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:06",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "みなさま、新しい仲間をご紹介しますわ。今日の展示に来てくださった、青猫さんですの。"
        },
        {
          "id": "welcome_chat_007",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:07",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "マイコンやセンサーに詳しい人だよ。"
        },
        {
          "id": "welcome_chat_008",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:07",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "青猫さん、どうぞよろしくお願いいたしますわ。"
        },
        {
          "id": "welcome_chat_new_003",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "二人が目の前で話していたときと、ほとんど同じ調子だった。文字だけの場所へ戻っても、さっき会った時間は消えないらしい。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_008"
        },
        {
          "id": "welcome_chat_010",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "入力欄を開いたまま、私は何度も短い挨拶を書き直した。授業の提出以外でここへ書き込むのは、ほとんど初めてだった。"
        },
        {
          "id": "welcome_chat_new_004",
          "sceneId": "welcome_chat",
          "type": "chat",
          "text": "はじめまして、青猫です。",
          "speaker": "visitor",
          "speakerLabel": "青猫",
          "time": "10:08",
          "cueFromStepId": "welcome_chat_010"
        },
        {
          "id": "welcome_chat_011",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:08",
          "speaker": "visitor",
          "speakerLabel": "青猫",
          "text": "参加させていただき、ありがとうございます。ESP32の試作からお手伝いします。よろしくお願いします！\n🎉 4　🌍 3　🫶 2"
        },
        {
          "id": "welcome_chat_013",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "九人のメンバーから歓迎の絵文字が次々に付き、数字が増えていく。短い反応なのに、画面の向こうへ本当に入れてもらえた気がした。"
        },
        {
          "id": "welcome_chat_new_005",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "数分後、新しい未読が一件増える。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_013"
        },
        {
          "id": "welcome_chat_015",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "まだ会ったことのないsakuから、短いメッセージが届いた。"
        },
        {
          "id": "welcome_chat_016",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:14",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "「青猫」\nいい名前。"
        },
        {
          "id": "welcome_chat_new_006",
          "sceneId": "welcome_chat",
          "type": "chat",
          "text": "エーテルに満たされてる。",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "time": "10:14",
          "cueFromStepId": "welcome_chat_016"
        },
        {
          "id": "welcome_chat_018",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:15",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "よろしくね、青猫さん。"
        },
        {
          "id": "welcome_chat_019",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "短い返事のあと、sakuはすぐにセンサーの話題へ戻した。初対面でも、作りたいものがあれば会話は続くらしい。画面越しの距離が、少し縮まった気がした。"
        },
        {
          "id": "welcome_chat_021",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:17",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "さっきの続き、スレッドにしたよ。"
        },
        {
          "id": "welcome_chat_022",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:17",
          "speaker": "system",
          "speakerLabel": "SYSTEM",
          "text": "あめが # 惑星の放課後_センサー を作成しました。"
        },
        {
          "id": "welcome_chat_023",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:18",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "学園祭で相談した、ESP32からGAIA SENSEWAREへ観測データを送る接続図ですの。まずは一台でPoCを行い、時刻・場所・機器・設置条件も一緒に記録しますわ。",
          "attachments": [
            {
              "id": "GAIA_CONNECTION_DIAGRAM",
              "description": "ESP32からGAIA SENSEWAREへ観測データを送る接続図"
            }
          ]
        },
        {
          "id": "welcome_chat_new_007",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "ESP32からGAIA SENSEWAREへ観測データを送る接続図",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_023"
        },
        {
          "id": "welcome_chat_024",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:19",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "ESP32、いいね。"
        },
        {
          "id": "welcome_chat_025",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:19",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "広域の公開データと、青猫さんのセンサーが測る身近なデータを、同じ地図で比べてみたい。"
        },
        {
          "id": "welcome_chat_026",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:20",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "同じ町でも、日なたと日陰では値が違う。身近なセンサーなら、その差まで記録できるから。"
        },
        {
          "id": "welcome_chat_027",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:20",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "センサー一台ごとに、測定値と単位、時刻、設置条件、機器名を付けよう。あとで別の場所と比べられる。"
        },
        {
          "id": "welcome_chat_028",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:21",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "急に仕様が具体的。"
        },
        {
          "id": "welcome_chat_029",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:21",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "設置場所や高さ、日なたか日陰かが分かれば、値が違った理由を確かめられるから。"
        },
        {
          "id": "welcome_chat_030",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:21",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "そこは賛成。"
        },
        {
          "id": "welcome_chat_new_008",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "会場で恐る恐る口にした思いつきが、観測条件を持つ試作へ変わっていく。未完成だから隠すのではなく、確かめられる形で見せれば誰かと作れるのだと、そこでようやく実感した。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_030"
        },
        {
          "id": "welcome_chat_new_009",
          "sceneId": "welcome_chat",
          "type": "chat",
          "text": "saku、システム設計の話になると返事が早いね。",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "time": "10:22",
          "cueFromStepId": "welcome_chat_030"
        },
        {
          "id": "welcome_chat_033",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:22",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "それでは、まず一台で試しましょう。何を確かめたいか決めてから、使うセンサーと測定間隔を選びますの。"
        },
        {
          "id": "welcome_chat_new_010",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "みずの投稿を読みながら、机の上にある自分の部品箱を思い浮かべる。温湿度センサー、照度センサー、ESP32、短いUSBケーブル。必要なものを頭の中で一つずつ確かめた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_033"
        },
        {
          "id": "welcome_chat_035",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:23",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "じゃあ、一分おきで。センサーの場所はあとで考えよう。"
        },
        {
          "id": "welcome_chat_036",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:23",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "データが届かなかったときの表示も、あとで決めましょう。"
        },
        {
          "id": "welcome_chat_037",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:23",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "了解。青猫さん、その設定でつなげそう？"
        },
        {
          "id": "welcome_chat_038",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:23",
          "speaker": "visitor",
          "speakerLabel": "青猫",
          "text": "いけます。"
        },
        {
          "id": "welcome_chat_039",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:24",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "お願い。動いたら、照度も足してみよう。"
        },
        {
          "id": "welcome_chat_040",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:25",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "続きは、# 惑星の放課後_センサー で。"
        },
        {
          "id": "welcome_chat_041",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "新しくできた # 惑星の放課後_センサー を開く。投稿はまだ一件もない。最初の一行を任された空白が、もう怖いものには見えなかった。"
        },
        {
          "id": "welcome_chat_new_011",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "顔を知っている二人、遠い国にいるsaku、そしてまだ話したことのない五人。九人全員が、新しいチャンネルの向こうにいる。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_041"
        },
        {
          "id": "welcome_chat_new_012",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "テントの向こうには、澄んだ秋の青空と海が広がっていた。高い雲がゆっくり流れ、午前の日差しが展示パネルの縁へ淡く反射している。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_041"
        },
        {
          "id": "welcome_chat_044",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "朝は、誰とも話さず作品を見て帰るつもりだった。いまは、自宅の机にあるセンサーを二人へ見せ、失敗した配線まで一緒に直すことを考えている。"
        },
        {
          "id": "welcome_chat_045",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "最初は一台。それが十台、百台になれば、離れた学生たちの場所から、条件の異なる小さな観測が届く。同じ尺度で並べても、地域ごとの差を消さずに見られる。"
        },
        {
          "id": "welcome_chat_new_013",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "基板だけでは、地球の感覚器にはならない。観測の条件を残し、違いを読み、次の行動へ返す人までつながったとき、感覚器の一部になれる。そんな未来を想像した。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_045"
        },
        {
          "id": "welcome_chat_047",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "午前展示枠の終了を告げるアナウンスが流れ、周囲の一部のブースが休止表示へ切り替わっていく。"
        },
        {
          "id": "welcome_chat_new_014",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "チャットで決まった手順を、頭の中でもう一度並べた。値を測って条件を残し、ほかの観測と比べ、違いの理由を考えて、次の測り方を決める。数字を集めることが目的ではない。数字から何を読み、次に何を変えるかまでが試作なのだ。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_047"
        },
        {
          "id": "welcome_chat_new_015",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "GAIA SENSEWAREがつないだのは、離れた場所のデータだけではなかった。地球のことを考える人間同士までつないでいた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_047"
        },
        {
          "id": "welcome_chat_055",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「青猫さん」"
        },
        {
          "id": "welcome_chat_056",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "チャットではなく、すぐ隣からもう一度聞こえた。"
        },
        {
          "id": "welcome_chat_057",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "振り向くと、みずが少しだけ目を伏せている。"
        },
        {
          "id": "welcome_chat_058",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「次にお会いするときも、そうお呼びしてよろしい？」"
        },
        {
          "id": "welcome_chat_059",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい。お願いします」"
        },
        {
          "id": "welcome_chat_060",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「私も、そう呼びます」"
        },
        {
          "id": "welcome_chat_061",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは地球を見たまま言った。加入画面を見たときより声は落ち着いていたが、こちらを見ないのは、たぶん、そのほうが言いやすかったからだ。"
        },
        {
          "id": "welcome_chat_new_016",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "私には、地球の未来を語るより、その二言へ返事をするほうが難しかった。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_061"
        },
        {
          "id": "welcome_chat_new_017",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "地球の未来を考えたい。センサーをつなぎたい。二人にまた会いたい。どれも同じくらい本当だった。周囲では、午前枠を終えた学生たちが機材を箱へ戻し始めていた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_061"
        },
        {
          "id": "welcome_chat_064",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「私たちも、そろそろ片づけます。展示画面を消しますね」"
        },
        {
          "id": "welcome_chat_new_018",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "あめが展示画面の終了に触れる。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_064"
        },
        {
          "id": "welcome_chat_066",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の地球がゆっくり暗くなり、消えた。"
        },
        {
          "id": "welcome_chat_067",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "黒くなった画面には、並んで立つ三人の姿が映っている。その中で、私たち三人の視線が交わった。"
        },
        {
          "id": "welcome_chat_069",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが案内カードを箱へしまい、あめがケーブルをまとめる。私は何をすればいいか分からず立っていたが、足元にあった小さな機材箱を持ち上げた。"
        },
        {
          "id": "welcome_chat_070",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「それ、重いです」"
        },
        {
          "id": "welcome_chat_071",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「持てます」"
        },
        {
          "id": "welcome_chat_072",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「では、お願いしますわ」"
        },
        {
          "id": "welcome_chat_073",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "もう客として扱われていないことが、少しうれしかった。"
        },
        {
          "id": "welcome_chat_new_019",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "三人で展示ブースを離れる。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_073"
        },
        {
          "id": "welcome_chat_075",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "海沿いの通路では、海と空が鮮やかな青を重ねていた。朝から大きく鳴っていた大学旗が、秋の海風の中で軽やかに揺れている。"
        },
        {
          "id": "welcome_chat_076",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "人の流れに合わせて歩きながら、次に集まる日の話をした。日付も、使うセンサーも、データの形も決まっていない。それでも会話は終わらなかった。"
        },
        {
          "id": "welcome_chat_077",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "最初の一台はきっと失敗する。それでもみんなで直し、次の観測へ進めばいい。"
        },
        {
          "id": "welcome_chat_078",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "スマートフォンが、ポケットの中で短く震えた。"
        },
        {
          "id": "welcome_chat_new_020",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "機材箱を持ち直し、画面を開く。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_078"
        },
        {
          "id": "welcome_chat_new_021",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "新しい投稿が届いていた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_078"
        },
        {
          "id": "welcome_chat_081",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:41",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "次に測る場所、決まったら教えて。"
        },
        {
          "id": "welcome_chat_082",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:42",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "一台から、いままで見えなかった変化が見える。"
        },
        {
          "id": "welcome_chat_083",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:42",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "観測結果を見て、次に測る場所を決めよう。"
        },
        {
          "id": "welcome_chat_084",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "その二行が、今日の展示で見てきたものと、これから始める観測をつないだ。"
        },
        {
          "id": "welcome_chat_new_022",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "知ったことで選択が変わる。一人で帰るはずだった私が、次は部品箱を持って会いに行く。その小さな選択も、きっと次の何かを変える。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_084"
        },
        {
          "id": "welcome_chat_092",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "スマートフォンをポケットへ戻す。顔を上げると、隣を歩く二人と目が合った。"
        },
        {
          "id": "welcome_chat_094",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "次に画面を開くとき、そこには私たちが送った最初の観測点が加わっている。その未来を確かめるため、私は机の部品箱へ手を伸ばした。"
        },
        {
          "id": "welcome_chat_new_023",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "その選択の中に、今日から私たちもいる。物語は、ここからも続いていく。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_094"
        },
        {
          "id": "welcome_chat_095",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "その選択の中に、今日から私たちもいる。物語は、ここからも続いていく。"
        }
      ],
      "nextSceneId": null
    }
  ]
});
globalThis.GAIA_NOVEL_STORY_V6 = globalThis.GAIA_NOVEL_STORY;
