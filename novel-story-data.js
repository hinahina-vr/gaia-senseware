// Generated from story/物語台本.md by scripts/build-novel-story.mjs. Do not edit by hand.
globalThis.GAIA_NOVEL_STORY = Object.freeze({
  "storyVersion": 10,
  "title": "GAIA SENSATION",
  "systemTitle": "GAIA SENSEWARE",
  "subtitle": "コンテスト機能限定版",
  "estimatedDuration": "10〜12分",
  "sourceSha256": "fed88965250d118d3db17392a6e4dbd9c853633311a116beb69a2d264f40365d",
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
      "location": "オンライン大学・年次対面イベント／学生作品・体験展示ホール",
      "modeIndex": 0,
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 9:20–9:40｜オンライン大学・年次対面イベント／学生作品・体験展示ホール",
        "date": "10月3日（土）",
        "time": "AM 9:20–9:40",
        "duration": "0:00–1:45",
        "location": "オンライン大学・年次対面イベント／学生作品・体験展示ホール"
      },
      "steps": [
        {
          "id": "festival_concept_001",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "海から吹く風にあおられ、入口の大学旗が大きな音を立てていた。"
        },
        {
          "id": "festival_concept_002",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "ガラス張りの展示場へ入ると、空調の冷気が頬に当たる。コーヒーと揚げものの匂いが混じり、ステージの低音が床から靴底へ伝わってきた。"
        },
        {
          "id": "festival_concept_003",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "ここでは今日、オンライン大学の年次対面イベントが開かれている。"
        },
        {
          "id": "festival_concept_004",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "授業のほとんどをオンラインで行う大学が、年に一度だけ、海沿いの巨大な展示場へ学生を集める。ゲーム、映像、研究発表、参加型展示、ステージ、飲食区画。学生にとっては、この日が学園祭だ。"
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
          "id": "festival_concept_007",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "受付を抜けると、行き交う学生たちの胸元の名札に、学内チャットで見たことのあるハンドルネームがいくつもあった。けれど、話したことのある名前は一つもない。画面の中にいた学生たちが友人を呼び、笑い合うたび、自分だけが名前のない匿名ユーザーのように、人の輪を外から眺めていた。"
        },
        {
          "id": "festival_concept_008",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "長い連絡通路を渡り、学生作品が集まる国際展示場の8ホールへ入る。エスカレーターの先に、無数のブースと人の流れが一望できた。想像していた学園祭より、ずっと大きい。"
        },
        {
          "id": "festival_concept_009",
          "sceneId": "festival_concept",
          "type": "ui",
          "text": "会場案内｜国際展示場 8ホール　学生作品・体験展示"
        },
        {
          "id": "festival_concept_010",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "歓声と呼び込みが天井へ反響する。誰かと一緒なら、この景色を見て何と言っただろう。答える相手のいないまま歩いていると、照明を落とした一角で、深い紺色の地球が光っていた。"
        },
        {
          "id": "festival_concept_011",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "雲のような白い筋が五つの面を渡り、ところどころで光が脈を打っている。単管と暗幕で作られた小さなブースなのに、入口から一歩入るだけで、巨大な地球の内側へ沈むようだった。私は歩く速度を落とした。"
        },
        {
          "id": "festival_concept_012",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "壁の札には、白い文字で「GAIA SENSEWARE｜地球の声、聴いてみませんか」と書かれている。"
        },
        {
          "id": "festival_concept_013",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "机の向こうで、淡い青のボブヘアの学生が、抜けかけたケーブルを差し直している。半分眠そうに見える目が、コネクターの根元だけをじっと見ていた。机の端には、ドライバーと結束バンドがひとまとめになっている。"
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
          "text": "画面へ近づくと、私の影が地球に重なった。青い髪の学生の指が止まる。こちらへ顔を上げたときも肩は落ちたままで、驚いた様子はなかった。"
        },
        {
          "id": "festival_concept_016",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "女の子",
          "text": "「こんにちは。太古の海から、いま起きている気候の変化まで、画面に触れながらたどる展示です。よかったら体験してみませんか？」"
        },
        {
          "id": "festival_concept_017",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "最後の言葉に合わせて、彼女の口元が少しだけ緩んだ。呼び込み用の笑顔というより、私が断っても気にしないような、力の抜けた表情だった。"
        },
        {
          "id": "festival_concept_018",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "声をかけられると思っていなかった。こういう場所では、見終えたら誰とも話さず帰るつもりだった。私は少し遅れて会釈する。彼女は急かさず、言葉が出てくるまでこちらを見ていた。"
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
          "id": "festival_concept_020",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "返事を聞くと、青い髪の学生はわずかに目を細めた。画面の端へ触れると、地球が一度だけゆっくり明滅し、海から都市までの光が短くつながった。最初のデモを終えてから、彼女はケーブルを離し、体ごとこちらへ向き直る。"
        },
        {
          "id": "festival_concept_021",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "女の子",
          "text": "「改めまして、私は『あめ』です」"
        },
        {
          "id": "festival_concept_022",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "「あめ」と名乗っても、照れたり笑ったりはしなかった。柔らかな響きとは対照的に、言葉は簡潔だった。"
        },
        {
          "id": "festival_concept_023",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "もう一人の女の子",
          "text": "「みず」と申します。あなたも、うちの大学の方ですの？"
        },
        {
          "id": "festival_concept_024",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめと、みず。空から地上へ、二人の名前だけでひとつの流れができていた。本名ではなく、学内で使っている名前らしい。オンラインの大学では、そのほうが自然だった。"
        },
        {
          "id": "festival_concept_025",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "長い髪の学生もタブレットから顔を上げた。表情は落ち着いているが、「うちの大学」と言ったところで眉が少し上がる。答えを予想するより、こちらの返事を楽しみにしているように見えた。"
        },
        {
          "id": "festival_concept_026",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは名乗ったあとも、机の端のケーブルを指先で確かめている。みずはタブレットを両手で持ち、返事を待つあいだ、わずかに首を傾けていた。地球の青い光が、長い髪の内側へ薄く映っている。"
        },
        {
          "id": "festival_concept_027",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい。同じ大学の学生です。今日は学生作品を見に来ました。通路から見えた、この地球が気になって」"
        },
        {
          "id": "festival_concept_028",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの眉が元の位置へ戻り、目元が少し柔らかくなった。私は改めてブースを見回す。投影は奥壁だけでなく、左右の暗幕と天井、床まで切れ目なく続いていた。"
        },
        {
          "id": "festival_concept_029",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「これ、すごいね。ソフトウェアも演出も、映像の迫力も。学生作品って聞いていたから、ここまで本格的だと思わなかった」"
        },
        {
          "id": "festival_concept_030",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "思ったことが、そのまま口から出た。初対面の相手に自分から感想を伝えたのは、今日初めてだった。"
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
          "text": "「実はね。親戚のおじさんがイルミネーション屋さんなんです。このブースの設営もやってくれて、ハイパワーのプロジェクターも貸してくれました」"
        },
        {
          "id": "festival_concept_033",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは壁際の単管を指でたどり、最後に天井のプロジェクターを示した。借り物だと打ち明けても、その声には自分たちで作り上げた場所への誇らしさがあった。"
        },
        {
          "id": "festival_concept_034",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「親戚のおじさんが、ここまで？」"
        },
        {
          "id": "festival_concept_035",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめが小さくうなずく。その横で、みずが楽しそうに口元をほころばせた。"
        },
        {
          "id": "festival_concept_036",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。暗幕の張り方も、光が漏れない角度も、あめと一緒に考えてくださいましたの」"
        },
        {
          "id": "festival_concept_037",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの言い方には、設営の日にあめや叔父と試行錯誤した時間を、誰かへ伝えたかったような弾みがあった。"
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
          "id": "festival_concept_040",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "思わずあめを見ると、彼女は少しだけ胸を張った。眠そうな目のままなのに、今度は分かりやすく得意そうだった。"
        },
        {
          "id": "festival_concept_041",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「資格で扱えるのは、六百ボルト以下の低圧設備だよ。このブースの配線も、その範囲で確認してる」"
        },
        {
          "id": "festival_concept_042",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "具体的な範囲が返ってきて、資格が示す仕事をようやく想像できた。みずは隣で、何度も聞いた説明のようにうなずいている。"
        },
        {
          "id": "festival_concept_043",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「でも、私はまだ現場経験が少ないからね。資格を持っているだけで、叔父さんには全然かなわないよ」"
        },
        {
          "id": "festival_concept_044",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "最後だけ少し照れたように目をそらし、あめはケーブルの被覆を指先で確かめた。資格があっても、現場では叔父を頼りにしている。その距離感が少し分かった。"
        },
        {
          "id": "festival_concept_045",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "「資格まで持ってるんだ。僕なんて、せいぜいESP32にセンサーをつないで、Wi-Fiで値を送るくらいなのに」"
        },
        {
          "id": "festival_concept_046",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "言ってから、自分の工作を比べる必要はなかったと気づく。完成したものを人に見せた経験もほとんどない。けれど、あめとみずは笑わず、同時にこちらを見た。"
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
          "text": "「GAIA SENSEWAREは、地球と生命、そして人類が、互いをどう変えてきたかを観測から考えるためのシステムですわ」"
        },
        {
          "id": "festival_concept_051",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "言い終えると、みずはこちらを見る。理解できたかを問うのではなく、最初の言葉をどこまで受け取ったか、表情から確かめようとしているようだった。"
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
          "id": "festival_concept_053",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは「エコ展示」という言葉で、眉をほんの少し寄せた。嫌っているというより、その一言で全部まとめられることを警戒している顔だった。"
        },
        {
          "id": "festival_concept_054",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "環境展示と聞いて、私は節電やリサイクルの話を想像していた。どうやら、そういう展示ではないらしい。"
        },
        {
          "id": "festival_concept_055",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球は、生命のために最初から用意された、動かない舞台ではありませんの。生命の活動が海や大気や土を変え、その環境がまた次の生命の条件を変えてきましたわ」"
        },
        {
          "id": "festival_concept_056",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの声に、さっきセンサーの話を聞いたときとは別の熱が混じる。視線は私と地球のあいだを行き来し、言葉を重ねるほど少しずつ前のめりになっていく。"
        },
        {
          "id": "festival_concept_057",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みずは最初から、地球全体を見渡すところから話すんだね」"
        },
        {
          "id": "festival_concept_058",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球の話ですもの。小さくはできませんわ」"
        },
        {
          "id": "festival_concept_059",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは小さく息を吐いた。困っているようで、止める気はないらしい。みずもそれが分かっている顔で、口元にかすかな笑みを残していた。"
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
          "id": "festival_concept_061",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは、みずが広げた話を手元へ引き寄せるように短く結んだ。言い終えたあと、みずを見る。みずもすぐにうなずき、二人の間では説明の受け渡しが済んだらしい。"
        },
        {
          "id": "festival_concept_062",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の地球から、十本の細い光が伸びた。大気、海、森、都市。遠く離れて見えるものが、同じ地球の上で静かにつながっていく。"
        },
        {
          "id": "festival_concept_063",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "CO2や海流に混じって、都市や文化の文字もある。地球の観測という言葉から想像していた範囲より、ずっと広い。"
        },
        {
          "id": "festival_concept_064",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球で起きていることを、見たり、聞いたり、触れたりできる形にする。GAIA SENSEWAREは、まだ作りかけの『地球の感覚器』ですの」"
        },
        {
          "id": "festival_concept_065",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "十本の光を見つめるみずの表情には、作ったものを見せる誇らしさと、説明が正しく届くかを気にする緊張が同時にあった。"
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
          "id": "festival_concept_067",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面上のCO2濃度が切り替わるたび、短い低音が一度鳴る。数値が更新されたことを、画面を見ていなくても知らせるための音だった。"
        },
        {
          "id": "festival_concept_068",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは画面下の出典欄に視線を移し、表示中の数値と提供元が合っているかを確かめた。"
        },
        {
          "id": "festival_concept_069",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の下に、現在のデータ構成が表示される。"
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
          "id": "festival_concept_071",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは画面下の出典欄を指し、NASA、JAXA、気象庁のどのデータを使っているか説明した。"
        },
        {
          "id": "festival_concept_072",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「まずは、このデータで地球温暖化を見てみましょう」"
        },
        {
          "id": "festival_concept_073",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "最後にもう一度こちらを見て、あめが小さく目を細める。説明を聞く時間は終わり、今度は私が触る番だと促す合図に見えた。"
        },
        {
          "id": "festival_concept_074",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "気づくと、さっきより一歩、画面の近くに立っていた。"
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
          "text": "年代が自動で進むたび、観測時点が切り替わり、画面上のCO2濃度と気温偏差の数値も連動して変わった。"
        },
        {
          "id": "map_mode01_006",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "1958年の過去から現在を通り、2050年の試算へ進む。地球の明るさと背景の色が、数値に合わせて少しずつ変わる。"
        },
        {
          "id": "map_mode01_007",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "2050年まで届くと、地図の窓は最後の色を一度だけ残し、静かに閉じて物語へ戻った。"
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
          "id": "map_mode01_010",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの目は、説明しているあいだも波の頂点を追っていた。暗記した文章を話すのではなく、いま画面に出ている変化を一緒に読んでいるように見える。"
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
          "id": "map_mode01_012",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "声に出すと、右肩上がりの線が急に現実味を持った。"
        },
        {
          "id": "map_mode01_013",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「はい。同じデータでも、どの長さの時間窓で見るかによって、読める変化が違います」"
        },
        {
          "id": "map_mode01_014",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめが一度だけうなずいた。こちらの理解が展示の意図とずれていないと分かって、少し安心したように見えた。"
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
          "id": "map_mode01_020",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "私に説明するときより少しだけ軽い声で答え、みずが画面へ手を伸ばす。あめは一歩だけ横へずれ、その場所を譲った。"
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
          "text": "「次は、気温偏差を重ねてみてください」"
        },
        {
          "id": "map_mode01_023",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "世界地図が、青から黄色、赤へと場所ごとに塗り分けられる。年を進めると、赤く表示される範囲が少しずつ広がっていく。"
        },
        {
          "id": "map_mode01_024",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "年を送るたびに色の配置は変わる。ある年の一枚だけなら、赤と青はまだらに見える。ところが同じ基準で年代を重ねると、赤い側へ移る場所が増えていった。"
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
          "id": "map_mode01_029",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の端に、使われているデータの情報が開く。"
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
          "text": "「はい。将来は更新を自動で受け取り、地球の変化をほぼリアルタイムで見られるようにしたいと考えています」"
        },
        {
          "id": "map_mode01_034",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の下に、まだ接続されていない入力欄が薄く現れる。"
        },
        {
          "id": "map_mode01_035",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "入力欄には「参加者の温度・湿度データ」とある。自宅のセンサーで測った値も、ここから地図に加えられるのだろうか。"
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
          "id": "map_mode01_039",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "自宅の机で動かしている小さなセンサーなら、いまも温度と湿度を記録できる。観測場所や時刻を添えて送れば、この地図に表示できるデータになるかもしれない。"
        },
        {
          "id": "map_mode01_040",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「はい。公的な観測と同じものとして混ぜず、地域の一点で測った記録として並べます。それが、このシステムをユーザー参加型にするための次の段階です」"
        },
        {
          "id": "map_mode01_041",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "地図が丸まり、現在の地球へ戻る。赤や青の色は消え、雲だけがゆっくり流れている。"
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
          "text": "表示は現在の地球から、約二十七億年前の海を再現した映像へ自動で切り替わる。"
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
          "text": "「GXという言葉は、どこかで見たことがありますか？」"
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
          "text": "「一般にはそうですわ。でも、この画面のGXは『GAIA Transformation』。生命が地球を変え、変わった海や大気がまた生命の条件を変えてきた、その相互作用を表す言葉ですの」"
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
          "text": "「時間軸を左へ。海まで戻ってみてくださいまし」"
        },
        {
          "id": "gx_experience_015",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「二十七億年前まで戻るんですか」"
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
          "text": "時間軸へ触れ、左へ引く。指を少し動かすだけで、画面の上では何千万年もの時間が過ぎていく。"
        },
        {
          "id": "gx_experience_019",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "時間軸を左へ動かすほど、森林も都市も消えていく。"
        },
        {
          "id": "gx_experience_020",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "見慣れたものが一つずつ消えるたびに、どこまで戻れば地球が地球でなくなるのか考えた。けれど、岩と海だけになっても、画面にはまだ地球と表示されていた。"
        },
        {
          "id": "gx_experience_021",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面は、岩と水、そして酸素の乏しい大気に覆われた地球を映していた。"
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
          "text": "みずが少し身を乗り出す。"
        },
        {
          "id": "gx_experience_025",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、近いかも」"
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
          "text": "「これはシアノバクテリアです。海で光合成を行い、酸素を生み出した微小な細菌です。触れたことで増えたのではなく、触れた場所で当時の活動を表示しています」"
        },
        {
          "id": "gx_experience_034",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "金色の筋は、すぐには空へ昇らない。海の中の物質へ触れ、そのたびに暗くなる。"
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
          "id": "gx_experience_039",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは大きな変化を前にしても、声を強めなかった。みずも、答えを言い切ったあとはこちらの反応を待っている。感動するよう促されないぶん、画面で起きたことが長く残った。"
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
          "text": "「そして変わった海と大気が、そのあとに生きる生命の条件を変えましたの。どちらかが一方を完成させた、という話ではありませんわ」"
        },
        {
          "id": "gx_experience_042",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の右側に、現在へ続く細い線が伸びる。森、都市、夜の光が順番に戻ってくる。"
        },
        {
          "id": "gx_experience_043",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「いまの私たちの暮らしも、この相互作用の外にはありません」"
        },
        {
          "id": "gx_experience_044",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "生命が環境を変え、変わった環境が生命の条件を変える。画面を行き来する光を見て、共進化とは、完成へ向かう一本道ではなく影響を返し合うことなのだと分かった。"
        },
        {
          "id": "gx_experience_055",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の端に、まだ開いていない機能の入口がいくつか並ぶ。"
        },
        {
          "id": "gx_experience_056",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「今日はGXとMODE 01だけですが、ほかにも海や森、都市、地震、宇宙まで、いろいろな切り口で見られます」"
        },
        {
          "id": "gx_experience_057",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地図から好きな場所を選んだり、使っているデータを確かめたりもできますの」"
        },
        {
          "id": "gx_experience_058",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「気になるものがあれば、あとで自由に触ってみてください」"
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
          "text": "画面に展示ホールの白い光が戻る。暗い海を見ていた目には、天井の照明が少しまぶしい。"
        },
        {
          "id": "esp32_pitch_002",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の端には、「参加者が測ったデータ」と書かれた空欄があった。"
        },
        {
          "id": "esp32_pitch_003",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは端末から手を離し、こちらを見る。"
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
          "text": "感想を答えようとして、また空の入力枠に目が戻った。立派な展示の前で自分の工作を話すのは怖い。それでも、私にも測れるものはある。"
        },
        {
          "id": "esp32_pitch_006",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "完成した展示へ、未完成の思いつきを差し出す。笑われたら、たぶんしばらく作れなくなる。それでも、聞かずに帰るほうが後悔すると思った。"
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
          "text": "「その基板で、どんな値を測れますか？」"
        },
        {
          "id": "esp32_pitch_012",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "質問が具体的だったので、少し安心した。得意な話なら、言葉が出る。自宅の机で何度も組み直した部品と配線が、頭の中で順番につながった。"
        },
        {
          "id": "esp32_pitch_013",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「温度、湿度、明るさ、気圧、空気中の粒子、音、振動。センサーを替えれば、もっといろいろ測れます。いくつか組み合わせて、その場所の環境をまとめて記録することもできます」"
        },
        {
          "id": "esp32_pitch_014",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "思いつくまま並べると、あめの指がもうタブレットの上で動き始めていた。みずは口を挟まず、測れるもの同士のつながりを考えるように、ゆっくり視線を動かしている。"
        },
        {
          "id": "esp32_pitch_015",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「それに、全部の値をそのまま送るだけじゃありません。手元のESP32で平均を出したり、急な変化だけを拾ったり、いくつかの値を組み合わせて簡単な判定をしたりできます。こういう、その場での処理をエッジ処理といいます」"
        },
        {
          "id": "esp32_pitch_016",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「公開データが地球を広く見るものなら、ESP32は身近な一点を細かく観測できます。時刻や設置条件も一緒に残せます」"
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
          "text": "「みず、それ残して。あとで使うかも」"
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
          "id": "esp32_pitch_022",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは少しだけ得意そうに眉を上げた。あめも口元を緩める。私の案を二人の会話の中で扱ってくれていることが、言葉以上にうれしかった。"
        },
        {
          "id": "esp32_pitch_023",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが言葉にしてくれたことで、一人で抱えていた思いつきが、三人で考えられる形になった。"
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
          "text": "「通信が切れたときは、センサーから届く表示だけを止めます。ほかの機能はそのまま使えて、つながり直したらセンサーの表示も再開します」"
        },
        {
          "id": "esp32_pitch_026",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "話しているうちに、見学者の感想ではなく、試作の相談になっていた。自分の未完成品を見せるのと同じ怖さが戻り、二人の表情を確かめる。"
        },
        {
          "id": "esp32_pitch_027",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめはもう、説明用タブレットに新しい提案メモを作り始めていた。"
        },
        {
          "id": "esp32_pitch_028",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "入力する指が速い。私が口にした項目が、言葉の順番どおりにメモへ並んでいく。みずはその隣から、単位と観測条件だけを静かに足していた。"
        },
        {
          "id": "esp32_pitch_029",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「いいですね。広い範囲の観測と、手元の一点を分けて扱えます。違いを誤差で片づけず、観測条件までたどれます。通信が切れても、ほかの機能はそのままです」"
        },
        {
          "id": "esp32_pitch_030",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「観測条件も残せますわ。会場内と最寄りの観測所で値が違えば、機器や設置場所を確かめてから、その差が何を示すのか考えられますの」"
        },
        {
          "id": "esp32_pitch_031",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「最初は、一台分の構成で試せると思います」"
        },
        {
          "id": "esp32_pitch_032",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「まず『何を測れるか』より、『どの変化を見分けたいか』を決めましょう。一台なら、設計どおり比較できるか確かめられます」"
        },
        {
          "id": "esp32_pitch_033",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめはタブレットへ「まず一台」と書き加えた。自宅の部品箱が浮かぶ。いつも一人で閉じていた机が、初めて誰かとの作業場所につながった。"
        },
        {
          "id": "esp32_pitch_034",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、この案は残したい」"
        },
        {
          "id": "esp32_pitch_035",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。測る条件も一緒に残しますわ」"
        },
        {
          "id": "esp32_pitch_036",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「決めすぎないでね。一台で分かるところまで」"
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
          "id": "esp32_pitch_038",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは短くうなずき、みずは観測条件を二行だけ加えた。私の思いつきではなく、三人で試す案へ変わっていく。その変化を、消さずに見ていたかった。"
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
          "text": "「はい。GAIA SENSEWAREに合う案です。センサーを接続して終わりにせず、観測して、比べて、次の選択へ返せます」"
        },
        {
          "id": "esp32_pitch_041",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「小さな人工物でも、場所の変化を受け取り、人へ返す循環に加われますの。わたくしたちだけでは、ここまで具体的に考えられませんでしたわ」"
        },
        {
          "id": "esp32_pitch_042",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずはまっすぐこちらを見て言った。あめも、記録したメモを消さずに残している。"
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
          "text": "あめが展示画面を最初の地球へ戻し、みずがタブレットを閉じた。デモは終わった。三人で作る未来を一瞬だけ想像したぶん、見学者へ戻るのが朝より寂しかった。"
        },
        {
          "id": "circle_invitation_003",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "何か、もう一つ質問はなかっただろうか。CO2のことでも、太古の海のことでもいい。話を続けられる理由を探したが、思いつくものは全部、さっき二人が教えてくれていた。"
        },
        {
          "id": "circle_invitation_004",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "明日になれば、二人はまた学内チャットのハンドルネームへ戻る。今日知った目の動きも、言葉の前の短い間も、画面からは見えなくなる。"
        },
        {
          "id": "circle_invitation_005",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "GAIA SENSEWAREは、離れた場所で起きた変化を一つの地球へつなぐシステムだった。その地球の前で、名前も知らなかった三人が話している。"
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
          "id": "circle_invitation_009",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "その「終わる」という言葉に、胸の内を見抜かれた気がした。帰りたくないのではない。この二人と作ってみたい。そう認めるには、今日ここへ来るより、もう少し勇気が要った。"
        },
        {
          "id": "circle_invitation_010",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "それでも黙って帰れば、また一人の机へ戻るだけだ。そのほうが、断られることより苦しかった。"
        },
        {
          "id": "circle_invitation_011",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「この展示、家に帰ってからも見られますか」"
        },
        {
          "id": "circle_invitation_012",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "自分で思っていたより、声が小さくなった。展示の公開場所を聞いただけだと言い直すこともできた。でも、二人ともすぐには答えなかった。"
        },
        {
          "id": "circle_invitation_013",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが閉じたタブレットに指を添える。あめの視線が、その指からみずの顔へ移った。みずもあめを見る。"
        },
        {
          "id": "circle_invitation_014",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人はほんの短いあいだ、顔を見合わせた。いつものように説明の順番を決めているのではない。どこまで言っていいのか、互いの気持ちを確かめているように見えた。"
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
          "id": "circle_invitation_016",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは最初の地球へ戻った画面を見たまま答えた。「今日の続き」と言う直前だけ、わずかに間があった。"
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
          "id": "circle_invitation_018",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずはそう言いながら、机の端へ手を伸ばした。けれど何も取らず、指先を止める。私が次に何を言うのか待っている。"
        },
        {
          "id": "circle_invitation_019",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "学内チャット。その言葉だけで、閉じかけていた今日の先に細い道が伸びた。オンラインの大学で友人を作れなかった私にも、まだ入れる場所があるのかもしれない。"
        },
        {
          "id": "circle_invitation_020",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「その相談、学内チャットで見せてもらえますか」"
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
          "text": "「見るだけでいいんですか」"
        },
        {
          "id": "circle_invitation_024",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが目を丸くして、あめの横顔を見る。あめは気づいているはずなのに、そちらを見なかった。"
        },
        {
          "id": "circle_invitation_025",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "答えに詰まった。見るだけでは足りない。完成したものを褒める側ではなく、失敗を見せ合いながら作る側へ行きたかった。"
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
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「『惑星の放課後』という学内サークルですの。GAIA SENSEWAREだけでなく、それぞれの興味から、いろいろなことをしていますわ」"
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
          "id": "circle_invitation_032",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "いつもの丁寧な声だったが、最後の一文だけ少しゆっくりだった。"
        },
        {
          "id": "circle_invitation_033",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは案内カードを見たあと、またこちらへ視線を戻す。机に添えた手は動かないままだった。"
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
          "text": "あめは言い終えてから、みずのほうを見る。"
        },
        {
          "id": "circle_invitation_036",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずはカードを持ったまま、一度だけうなずく。笑ってはいなかった。冗談ではなく、二人で同じ返事を選んだのだと分かった。"
        },
        {
          "id": "circle_invitation_037",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめがこちらへ向き直る。言葉は案の話をしているのに、視線は返事を待っていた。"
        },
        {
          "id": "circle_invitation_038",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずも何も足さない。案内カードを差し出したまま、返事を待っている。急かす言葉は一つも足さなかった。"
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
          "id": "circle_invitation_040",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめの肩から力が抜けた。小さく息を吐き、ようやくみずのほうを見る。"
        },
        {
          "id": "circle_invitation_041",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずも同じタイミングであめを見た。二人の口元に、ほとんど同時に笑みが浮かぶ。さっきまで隠していたものが、返事を聞いてようやく表へ出たようだった。"
        },
        {
          "id": "circle_invitation_042",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "返事を聞くと、みずはカードをもう一歩こちらへ近づけた。"
        },
        {
          "id": "circle_invitation_043",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「では、今度は作る側でお会いしましょう」"
        },
        {
          "id": "circle_invitation_044",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "地球の声を聞くためのシステムが、一人で作ってきた私を、同じように手を動かしてきた二人へつないでいた。救われるとは、居場所をもらうことではなく、一緒に作る仕事が生まれることなのかもしれない。"
        },
        {
          "id": "circle_invitation_045",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人へ向き直り、今度は迷わず答えた。"
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
          "id": "circle_invitation_047",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "答えると、あめの肩からわずかに力が抜けた。断られる可能性を考えていたらしい。みずは隠すことなく笑みを深くし、カードを手渡す距離まで差し出した。"
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
          "id": "circle_invitation_053",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "通知音に、あめがこちらを見た。"
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
          "id": "circle_invitation_056",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "そう告げる声は落ち着いていたが、あめは笑みを隠さなかった。"
        },
        {
          "id": "circle_invitation_057",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずはそんなあめを見て、それから私を見る。驚いたように目を丸くしたあと、胸の前で両手を合わせた。堪えていた笑みが、そのまま目元まで広がっていく。"
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
          "id": "circle_invitation_061",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ええ」"
        },
        {
          "id": "circle_invitation_062",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人は目を合わせ、また笑った。今度は隠すための間もなかった。"
        },
        {
          "id": "circle_invitation_063",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "自分で参加を押したのに、二人がこれほど喜ぶとは思っていなかった。胸の奥に、少し遅れて実感が追いついてくる。"
        },
        {
          "id": "circle_invitation_064",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ようこそ。次は、一緒に作りましょう」"
        },
        {
          "id": "circle_invitation_065",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ようこそ、『惑星の放課後』へ」"
        },
        {
          "id": "circle_invitation_066",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人はまた顔を見合わせ、今度は確かめ合うためではなく、同じ嬉しさを分けるように笑った。"
        },
        {
          "id": "circle_invitation_067",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の文字が変わっただけだった。それでも、終わりかけていた一日が、二人ともう一度会うための未来へつながった。"
        },
        {
          "id": "circle_invitation_068",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「GAIA SENSEWAREは、わたくしとあめ、それからsakuの三人で作っていますの」"
        },
        {
          "id": "circle_invitation_069",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「sakuはシステム全体の設計と進行を見ています。アーキテクト兼プロデューサー、というのが近いです」"
        },
        {
          "id": "circle_invitation_070",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「GAIA SENSEWAREという名前を最初につけたのもsakuですの。機能と物語を、一つの作品へまとめていますわ」"
        },
        {
          "id": "circle_invitation_071",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「今日はチャットにいます。あとでご紹介します」"
        },
        {
          "id": "circle_invitation_072",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "短い紹介なのに、二人がsakuを大切にしていることは伝わった。"
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
          "id": "circle_invitation_076",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、先に言ったね」"
        },
        {
          "id": "circle_invitation_077",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「まあ。同じことを思っていましたの？」"
        },
        {
          "id": "circle_invitation_078",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめはみずには答えず、少しだけ気まずそうにこちらを見る。"
        },
        {
          "id": "circle_invitation_079",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「……はい。いい名前だと思います」"
        },
        {
          "id": "circle_invitation_080",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは楽しそうに目を細めた。あめはまた画面へ視線を戻したが、耳が少し赤くなっていた。"
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
      "title": "新しい試作スレッド",
      "chapter": "06 / WELCOME",
      "duration": "9:05–11:30",
      "date": "10月3日（土）",
      "time": "AM 10:07–10:45",
      "location": "学内チャット「惑星の放課後」／午前展示枠終了後の展示ホール",
      "modeIndex": 0,
      "temporal": {
        "temporalContext": "CURRENT",
        "timePrecision": "MINUTE",
        "displayTitle": "10月3日（土） AM 10:07–10:45｜学内チャット「惑星の放課後」／午前展示枠終了後の展示ホール",
        "date": "10月3日（土）",
        "time": "AM 10:07–10:45",
        "duration": "9:05–11:30",
        "location": "学内チャット「惑星の放課後」／午前展示枠終了後の展示ホール"
      },
      "steps": [
        {
          "id": "welcome_chat_001",
          "sceneId": "welcome_chat",
          "type": "chatSurface",
          "text": "# はじめまして／人物画像は表示しない"
        },
        {
          "id": "welcome_chat_002",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "学生ポータルから、サークルの学内チャットが開く。画面にあるのはハンドルネームと文字だけで、人物画像は一つも表示されていない。"
        },
        {
          "id": "welcome_chat_003",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "「あめ」と「みず」の投稿は、もう二人の声で読めた。あめは短く、みずは丁寧に書く。人物画像がなくても、どちらの投稿かすぐに分かる。"
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
          "id": "welcome_chat_005",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人に呼ばれたばかりの名前が、今度はチャットの参加通知に現れている。"
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
          "text": "ESP32に詳しい。参加者が測った温度や湿度をGAIA SENSEWAREに表示する案を出してくれたよ。"
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
          "id": "welcome_chat_009",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人が目の前で話していたときと、ほとんど同じ調子だった。文字だけの場所へ戻っても、さっき会った時間は消えないらしい。"
        },
        {
          "id": "welcome_chat_010",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "投稿欄のカーソルが点滅している。オンラインの教室では何度も閉じたままにした入力欄だ。自己紹介を長く書きかけて消し、今度は逃げずに一文だけ残した。"
        },
        {
          "id": "welcome_chat_011",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:08",
          "speaker": "visitor",
          "speakerLabel": "青猫",
          "text": "はじめまして、青猫です。よろしくお願いします。"
        },
        {
          "id": "welcome_chat_012",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "送信すると、短い挨拶が二人の投稿と同じ場所へ並んだ。たった一件なのに、オンラインの大学へ入ってから初めて、自分の言葉で誰かの輪へ入れた気がした。"
        },
        {
          "id": "welcome_chat_013",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人の紹介で、会場で話したことまでチャットのみんなへ伝わった。名前だけの加入通知より、少しだけ背筋が伸びる。"
        },
        {
          "id": "welcome_chat_014",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "数分後、新しい未読が一件増える。"
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
          "id": "welcome_chat_017",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:14",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "エーテルに満たされてる。"
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
          "text": "一瞬、指が止まった。名前の由来を話した覚えはない。それでもsakuは、たった二文字から、その続きを返してきた。"
        },
        {
          "id": "welcome_chat_020",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "sakuの短い返事で、画面越しの距離が縮まった。初めてのチャットなのに、このまま話を続けられる気がした。"
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
          "text": "あめが #GSW-esp32 を作成しました。"
        },
        {
          "id": "welcome_chat_023",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:18",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "青猫さんが会場で話してくださった、ESP32の案ですの。"
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
          "text": "「広い地域の記録と、青猫さんのいる場所の記録」\n並べて見たい。"
        },
        {
          "id": "welcome_chat_026",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:20",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "同じ町でも、日なたと日陰では違うから。"
        },
        {
          "id": "welcome_chat_027",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:20",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "一分ごとの数値に、時刻、設置条件、機器名も付けよう。あとで別の場所と比べられる。"
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
          "text": "場所が違うデータは、条件が分からないと比べられないから。"
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
          "id": "welcome_chat_031",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "会場で恐る恐る口にした思いつきが、観測条件を持つ試作へ変わっていく。未完成だから隠すのではなく、確かめられる形で見せれば誰かと作れるのだと、そこでようやく実感した。"
        },
        {
          "id": "welcome_chat_032",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:22",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "saku、ESP32の話になると返事が早いね。"
        },
        {
          "id": "welcome_chat_033",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:22",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "それでは、まず一台で試しましょう。温度と湿度を、何分おきに測るか決めたいですわ。"
        },
        {
          "id": "welcome_chat_034",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの投稿を読みながら、机の上にある自分の部品箱を思い浮かべる。温湿度センサー、照度センサー、ESP32、短いUSBケーブル。必要なものを頭の中で一つずつ確かめた。"
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
          "text": "まず一台つなぎます。"
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
          "text": "続きは、#GSW-esp32 で。"
        },
        {
          "id": "welcome_chat_041",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "新しくできた #GSW-esp32 を開く。投稿はまだ一件もない。最初の一行を任された空白が、もう怖いものには見えなかった。"
        },
        {
          "id": "welcome_chat_042",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "顔を知っている二人と、顔を知らない一人。その全員が、この何も書かれていない画面の向こうにいる。"
        },
        {
          "id": "welcome_chat_043",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "ガラス張りの壁の向こうには、澄んだ秋の青空と海が広がっていた。高い雲がゆっくり流れ、午前の日差しが会場の床へ淡く反射している。"
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
          "id": "welcome_chat_046",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "基板だけでは、地球の感覚器にはならない。観測の条件を残し、違いを読み、次の行動へ返す人までつながったとき、感覚器の一部になれる。そんな未来を想像した。"
        },
        {
          "id": "welcome_chat_047",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "午前展示枠の終了を告げるアナウンスが流れ、周囲の一部のブースが休止表示へ切り替わっていく。"
        },
        {
          "id": "welcome_chat_048",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "測る。条件を残す。違いを読む。"
        },
        {
          "id": "welcome_chat_049",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "見えた違いを、次の設計へ返す。"
        },
        {
          "id": "welcome_chat_050",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "チャットで決まった手順を、頭の中でもう一度並べた。数字を集めることが目的ではない。数字から何を読み、次に何を変えるかまでが試作なのだ。"
        },
        {
          "id": "welcome_chat_051",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "二十七億年前の生命は、未来の地球を計画して酸素を生んだわけではない。活動が物質循環を変え、その結果を、いまの私たちは岩石や大気の記録から読み取っている。"
        },
        {
          "id": "welcome_chat_052",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "今日の一台も地球を代表する答えにはならない。それでも、いつ、どこで、どう測ったかを残せば、別の観測と比べられる問いになる。"
        },
        {
          "id": "welcome_chat_053",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "地球の記録は、最初から意味を説明してはくれない。異なる時間と場所を比べ、解釈を確かめる私たちの仕事が要る。"
        },
        {
          "id": "welcome_chat_054",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "GAIA SENSEWAREがつないだのは、離れた場所のデータだけではなかった。地球のことを考える人間同士までつないでいた。"
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
          "id": "welcome_chat_062",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "私には、地球の未来を語るより、その二言へ返事をするほうが難しかった。"
        },
        {
          "id": "welcome_chat_063",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "地球の未来を考えたい。ESP32をつなぎたい。二人にまた会いたい。どれも同じくらい本当だった。周囲では、午前枠を終えた学生たちが機材を箱へ戻し始めていた。"
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
          "id": "welcome_chat_065",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめが展示画面の終了に触れる。"
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
          "text": "黒くなった画面には、並んで立つ三人の姿が映っている。"
        },
        {
          "id": "welcome_chat_068",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "黒い画面の中で、私たち三人の視線が交わった。"
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
          "id": "welcome_chat_074",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "三人で展示ホールを出る。"
        },
        {
          "id": "welcome_chat_075",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "ガラス張りの通路の外では、海と空が鮮やかな青を重ねていた。朝から大きく鳴っていた大学旗が、秋の海風の中で軽やかに揺れている。"
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
          "text": "最初の一台は、たぶん何度も失敗する。意見が合わず、返事が途切れる夜も来る。それでも、つながらなかった時間まで記録に残せる。"
        },
        {
          "id": "welcome_chat_078",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "スマートフォンが、ポケットの中で短く震えた。"
        },
        {
          "id": "welcome_chat_079",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "機材箱を持ち直し、画面を開く。"
        },
        {
          "id": "welcome_chat_080",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "新しい投稿が届いていた。"
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
          "text": "見えたものは、次の選択を変える。\n観測する私たちも、地球の外にはいないから。"
        },
        {
          "id": "welcome_chat_084",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "その二行が、今日の展示で見てきたものと、これから始める観測をつないだ。"
        },
        {
          "id": "welcome_chat_085",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "生命の活動が海と大気を変え、変わった環境が生命の条件を変えた。その相互作用の中で、一人の工作が二人の展示と出会い、三人で確かめる試作へ変わろうとしている。"
        },
        {
          "id": "welcome_chat_086",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "共進化は、完成へ向かう一本道ではない。互いの条件を変え、その応答がまた次の変化を生む。だから未来は、まだ一つに決まっていない。"
        },
        {
          "id": "welcome_chat_087",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "GAIA SENSEWAREは、地球の変化を受け取り、人の解釈と選択へ返すための感覚器だ。そして観測する私たち自身も、その循環の外にはいない。"
        },
        {
          "id": "welcome_chat_088",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "知ったことで選択が変わる。一人で帰るはずだった私が、次は部品箱を持って会いに行く。その小さな選択も、きっと次の何かを変える。"
        },
        {
          "id": "welcome_chat_089",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "一人で考えるには、地球の未来は大きすぎる。"
        },
        {
          "id": "welcome_chat_090",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "この活動の未来も、一人で完成させるには大きすぎる。"
        },
        {
          "id": "welcome_chat_091",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "だから、完成した答えを一人で抱える必要はない。"
        },
        {
          "id": "welcome_chat_092",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "スマートフォンをポケットへ戻す。顔を上げると、隣を歩く二人と目が合った。"
        },
        {
          "id": "welcome_chat_093",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "二十七億年の変化の先で、人類は自分たちの影響を地球規模の観測で知り、複数の未来を比べながら次の変化を選ぼうとしている。"
        },
        {
          "id": "welcome_chat_094",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "三人の会話は、午前展示枠を終えたホールでも終わらなかった。画面の向こうには、まだ顔を知らないsakuがいる。"
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
