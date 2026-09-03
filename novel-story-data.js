// Generated from story/APPROVED_SCRIPT_2026-08-24.md by scripts/build-novel-story.mjs. Do not edit by hand.
globalThis.GAIA_NOVEL_STORY = Object.freeze({
  "storyVersion": 13,
  "title": "惑星の放課後",
  "systemTitle": "GAIA SENSEWARE",
  "subtitle": "GAIA SENSATION",
  "estimatedDuration": "10〜12分",
  "sourceSha256": "27db292fbcfd2fc5130c9dcef8f33532ee0956abb559729347aa055dc5cd6b0c",
  "revisionId": "approved-script-20260824",
  "approvedSourceSha256": "0255319be34a5eca3537254683e209f4ea3af7589d2b697e6de5f4adb561d044",
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
          "text": "画面越しに眺めてきた大学のキャンパスに、今日は自分の足で来た。知らない誰かの輪に入るのは正直怖かったけれど、秋の海風のなか、思い切って最初の一歩を踏み出した。"
        },
        {
          "id": "festival_concept_new_001",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "受付棟を抜けて海側の広場へ出ると、強い日差しと潮風が真っ直ぐ頬に当たった。コーヒーと揚げものの匂いに混じって、野外ステージの重低音が靴底からビリビリ伝わってくる。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_001"
        },
        {
          "id": "festival_concept_new_002",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "授業のほとんどをオンラインで行う大学が、年に一度だけ、海沿いの展示場に学生を集める。ゲーム、映像、研究発表、参加型展示、露店。普段は四角いアイコンでしか見ない仲間たちが、今日は生身でここに集まっていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_001"
        },
        {
          "id": "festival_concept_005",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "私は電子工作が好きだ。誰かと話しながら作業するより、自室の机で一人、基板とハンダごてを相手に黙々と手を動かすほうが落ち着く。今日だって出展者じゃない。チャットのタイムラインを眺めていただけの自分が、顔も知らない輪の中へ入っていくのは気が引けた。何度も参加登録を閉じかけ、「遠くから見るだけなら誰とも話さなくていい」と自分に言い訳して、ようやくここまで来た。"
        },
        {
          "id": "festival_concept_006",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "受付でスマートフォンを取り出し、画面の二次元コードをリーダーにかざす。"
        },
        {
          "id": "festival_concept_new_003",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "行き交う学生たちの胸元を見ると、チャットで見慣れたハンドルネームがいくつも揺れていた。けれど、話したことのある相手は一人もいない。チャットですら発言できず、いつもログを追うだけだった。オフラインのここでも同じだ。自分だけが名前のない観客のように、輪の外側を歩いていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_006"
        },
        {
          "id": "festival_concept_008",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "通路の上階から広場を見下ろすと、立ち並ぶテントと展示パネルが幾何学模様を描き、その隙間を大勢の人が埋めていた。想像していたよりもずっと広い。"
        },
        {
          "id": "festival_concept_new_004",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "吹き抜けの向こうに見える青い海まで、会場の一部のように溶け込んでいる。人の流れに流されながら、気後れせずに入れそうなブースを探した。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_008"
        },
        {
          "id": "festival_concept_010",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "階段を下り、海風の抜ける屋外展示エリアへ出る。呼び込みや歓声のなかを歩いていると、遮光暗幕で四方を囲まれた大型のブースが目に入った。"
        },
        {
          "id": "festival_concept_011",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "白い雲の筋と青い海岸線が、五つの投影面をまたいで滑らかに流れている。映し出された地球の背景にリアルの海が重なり、展示の向こうへそのまま水平線が続いているように見えた。思わず足が止まる。"
        },
        {
          "id": "festival_concept_012",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "テント脇の案内板には、控えめなフォントで「GAIA SENSEWARE｜地球の声、聴いてみませんか」と書かれていた。"
        },
        {
          "id": "festival_concept_013",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "長机の向こうで、水色ボブヘアの学生が、結束バンドで固定された太いケーブルを端から順に手繰っている。眠たげな目つきのままコネクタの抜け止めを正確に確かめ、机の端にはドライバーやニッパーが几帳面に並んでいた。"
        },
        {
          "id": "festival_concept_014",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "その隣では、深い海のような長い髪の学生が、タブレットの画面を覗き込んでいた。表示された文章を指でスクロールし、最後の一行を読んで小さくうなずく。"
        },
        {
          "id": "festival_concept_015",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面に一歩近づくと、私の影が投影された地球の端に落ちた。水色ボブの学生がパッと顔を上げ、目が合う。気負いのない、少し力の抜けた会釈が返ってきた。"
        },
        {
          "id": "festival_concept_016",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "女の子",
          "text": "「こんにちは。何十億年前の太古から今の気候まで、まるごと触って確かめられる展示です。よかったら見ていきませんか？」"
        },
        {
          "id": "festival_concept_new_005",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "声をかけ終えると、彼女の口元がふっと緩んだ。営業用の作り笑いではなく、「見るだけでも全然いいよ」というような、肩の力が抜けた空気だった。隣の長い髪の学生も、穏やかにこちらを見ている。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_016"
        },
        {
          "id": "festival_concept_new_006",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "声をかけられるとは思っていなかった。見たらすぐ立ち去るつもりだったのに、足が止まってしまう。少し慌てて頭を下げると、彼女は急かすこともなく、こちらの言葉を待ってくれた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_016"
        },
        {
          "id": "festival_concept_019",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「あ、はい。お願いします」"
        },
        {
          "id": "festival_concept_new_007",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "短く返すと、青い髪の学生の目元が少し和らいだ。私がスクリーンの前に立つタイミングを見計らって、地球の見方を手短に案内してくれる。落ち着いたトーンを聞いているうちに、胸のあたりのこわばりが少しずつ解けていった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_019"
        },
        {
          "id": "festival_concept_021",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "女の子",
          "text": "「ありがとうございます！ 改めまして、私は『あめ』って言います。情報系の2年です」"
        },
        {
          "id": "festival_concept_new_008",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "「あめ」と名乗りながらも、気取った様子はまったくない。親しみやすい響きなのに、どこか淡々とした職人気質を感じさせた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_021"
        },
        {
          "id": "festival_concept_023",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "もう一人の女の子",
          "text": "「わたくしは『みず』と申します。同じく2年生。あなたも、うちの大学の方ですの？」"
        },
        {
          "id": "festival_concept_024",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめ、と、みず。雨と水。本名ではなく、学内のハンドルネームだろう。オンライン主体の大学では、お互いをハンドルで呼び合うほうがずっと自然だった。"
        },
        {
          "id": "festival_concept_new_009",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "みずも落ち着いた佇まいだが、初対面の相手への好奇心を隠しきれていない様子だった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_024"
        },
        {
          "id": "festival_concept_new_010",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "タブレットを両手で抱え、こちらの返事を待つあいだ、わずかに首をかしげる。青いスクリーンの光が、彼女の長い黒髪の毛先に淡く透けていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_024"
        },
        {
          "id": "festival_concept_027",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい、同じ大学の学生です。学生作品の展示を見に来たんですが……この地球のビジュアルがすごく気になって」"
        },
        {
          "id": "festival_concept_new_011",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "みずの表情がパッと明るくなった。改めてブースの内側を見回す。遮光幕で囲まれた空間には複数台のプロジェクターが整然と設置され、パネルの継ぎ目を感じさせないシームレスな映像が広がっている。学生のサークル展示とは思えない、本物のメディアアート現場のような設営だった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_027"
        },
        {
          "id": "festival_concept_029",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「すごいですね。シェーダーの描画も映像の迫力も……学生のブースでここまで本格的なものが見られるとは思っていませんでした」"
        },
        {
          "id": "festival_concept_new_012",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "打算のない本音が、そのまま口をついて出た。今日ここへ来てから、初対面の誰かに自分からこんなに長く話したのは初めてだった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_029"
        },
        {
          "id": "festival_concept_031",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめの顔にわかりやすく得意げな色が浮かび、みずも「それ言っちゃいます？」という顔でいたずらっぽく笑った。"
        },
        {
          "id": "festival_concept_032",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ふふ、お目が高い！ 実はね、親戚のオジキが屋外イルミネーションのプロなんです。真昼の屋外でも色が飛ばない20,000ルーメン級の業務用プロジェクターを引っ張ってきてくれて、躯体の組み立ても手伝ってもらいました」"
        },
        {
          "id": "festival_concept_new_013",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは支柱に沿わせた太い電源ケーブルを指でなぞり、奥に鎮座する大型機材を誇らしげに指差した。借り物だとあっけらかんと明かすところにも、現場をやり切った自信が滲んでいる。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_032"
        },
        {
          "id": "festival_concept_034",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「20,000ルーメン……野外フェスで使うようなやつじゃないですか。しかもこれ、直射日光の遮光も海風の煽り対策も、全部きっちり計算して組まれてますよね」"
        },
        {
          "id": "festival_concept_new_014",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめが目を輝かせてぶんぶんと首を縦に振る。さっきまでの眠たげな雰囲気はどこへやら、技術の話になった途端にスイッチが入ったらしい。その横で、みずが嬉しそうに目を細めていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_034"
        },
        {
          "id": "festival_concept_036",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。外光が入らないスクリーンの角度も、突風でトラスが歪まないワイヤーの張り方も、あめとおじさまが夜遅くまで図面を引いてくださいましたの」"
        },
        {
          "id": "festival_concept_new_015",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "現場で泥臭く試行錯誤した時間が、みずの声の端々からこぼれ落ちてくる。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_036"
        },
        {
          "id": "festival_concept_038",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「こう見えて、配線と電気まわりは得意なんです」"
        },
        {
          "id": "festival_concept_039",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「あめは電気工事士の資格も持っていますのよ。この仮設電源の安全管理も、すべてあめが現場で仕切りましたわ」"
        },
        {
          "id": "festival_concept_new_016",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "思わずあめを見直すと、彼女は少しだけ胸を張った。どこか眠そうな目つきのまま、隠しきれない自負が覗く。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_017",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "text": "「まあ、扱えるのは600V以下の一般電気工作物だけどね。このブースの負荷計算とブレーカー容量の割り振りは完璧だよ」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_018",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "text": "「それだけではなくて、第三種電気主任技術者の筆記も通っていますの」",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_019",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "text": "「電験三種はまだ受かっただけのペーパーだよ。高圧受電設備の実務経験なんてないし」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_new_020",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "低圧の取り回しから高圧理論まで押さえているのか。華奢な外見とのギャップに、純粋な敬意が湧いた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_039"
        },
        {
          "id": "festival_concept_045",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "text": "「電験まで持ってるんだ……すごいな。僕なんて、自室の机でマイコンにセンサーつないで、ひとりで数値を眺めてるくらいですよ」",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "festival_concept_new_021",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "言ってから、初対面の相手に自分の地味な趣味を卑下してしまったと後悔した。けれど、ふたりは笑うどころか、身を乗り出すようにこちらを見ていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_045"
        },
        {
          "id": "festival_concept_047",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが「今の話、もっと聞きたいです」と語るようにタブレットを抱え直す。あめも真剣な目でうなずいている。気後れよりも、話の先を共有したい気持ちが勝り始めた。"
        },
        {
          "id": "festival_concept_048",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「このGAIA SENSEWAREって、どういうコンセプトで作られた展示なんですか？」"
        },
        {
          "id": "festival_concept_049",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが指を止め、背筋を伸ばして向き直る。あめも口を挟まず、みずへ視線を預けた。ここからは彼女の担当らしい。"
        },
        {
          "id": "festival_concept_050",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球のいまを観測し、変化の兆候を捉え、人間が選べる次の関係を模索する――それがこのGAIA SENSEWAREの出発点ですの。もっとも、実装としてはまだまだ試作の段階ですけれど」"
        },
        {
          "id": "festival_concept_new_022",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "彼女の澄んだ瞳が、こちらの反応を確かめるように見つめてくる。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_050"
        },
        {
          "id": "festival_concept_052",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「よくある『ゴミを減らしましょう』みたいな、説教くさいエコ展示にするつもりは全然なくて」"
        },
        {
          "id": "festival_concept_new_023",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは「エコ」という単語のところで、鼻の頭に少しだけしわを寄せた。手垢のついたお題目に回収されるのを嫌っているのが伝わってくる。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_052"
        },
        {
          "id": "festival_concept_new_024",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "正直、私もそういった啓発展示を想像していた。どうやらそんな薄っぺらいものではないらしい。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_052"
        },
        {
          "id": "festival_concept_055",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「原始の地球は、今の生き物にとっては猛毒に満ちた灼熱の世界でしたの。けれど生命が海や大気を変え、その変えられた環境がまた新しい生命を育んできましたわ」"
        },
        {
          "id": "festival_concept_new_025",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "みずの声の温度が一段上がる。スクリーンの青と私の顔を交互に見つめながら、言葉に熱がこもっていく。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_055"
        },
        {
          "id": "festival_concept_057",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みずの解説は、いつも数十億年前のビッグバンから始まるんだよね」"
        },
        {
          "id": "festival_concept_058",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ここから始めなければ、地球と生命がどうやって今の形を作ってきたのか、本当の面白さが伝わりませんもの」"
        },
        {
          "id": "festival_concept_new_026",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめは呆れたように息を吐きながらも、どこか楽しそうだ。いつもの掛け合いなのだろう。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_058"
        },
        {
          "id": "festival_concept_060",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「変化は一方通行じゃないんです。環境と生命がお互いに影響を投げ返し合う、その何十億年のキャッチボールの最前線に、いまの私たち人間がいるってことです」"
        },
        {
          "id": "festival_concept_new_027",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめが端的にまとめると、みずは「ええ、まさに」と深くうなずいた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_060"
        },
        {
          "id": "festival_concept_062",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "ふたりの言葉に呼応するように、スクリーンの中の地球から淡い光の筋が立ち上がり、大気と海を編み上げるように広がっていった。気流、海流、都市の光。無数のパラメータが一本の有機的な網目になって脈打つ。"
        },
        {
          "id": "festival_concept_new_028",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "画面の端にはCO2濃度だけでなく、風向や都市の電力消費のパラメータも並んでいた。気象シミュレーションという枠をはるかに超えている。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_062"
        },
        {
          "id": "festival_concept_064",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球の鼓動を、データとして見るだけでなく、光や音として全身で感じられるようにする。わたくしたちが作っているのは、いわば未完成の『地球の感覚器』ですの」"
        },
        {
          "id": "festival_concept_new_029",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "画面を見つめるみずの瞳に、青い光が反射していた。自分たちの手で作り出した世界への誇りと、目の前の相手にそれが伝わるかを見守る緊張が同居している。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_064"
        },
        {
          "id": "festival_concept_066",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「グラフの数字だけ眺めててもピンとこないでしょ？ だから地図やシェーダーの光、空間音響に変えて、身体全体で直感できるようにしたかったんです」"
        },
        {
          "id": "festival_concept_new_031",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "「地球の感覚と、人間の感覚を重ね合わせる」。\nまだ作りかけだと二人は照れくさそうに笑っていたけれど、私にはそれがとんでもない可能性の塊に見えた。綺麗にまとめられた既製品の展示より、いま目の前で動いているアイデアの生々しさのほうが、ずっと強く胸に刺さる。\n画面の文字を追うのをやめて、光と音の揺らぎに目を委ねてみる。遠い海の波や大気のうねりが、そのまま自分の呼吸に重なっていくようだった。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_066"
        },
        {
          "id": "festival_concept_070",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「裏側で動いているのは、NASAやJAXA、気象庁が公開している本物の観測データです。利用規約さえ守れば誰でも扱えるオープンデータですね」"
        },
        {
          "id": "festival_concept_072",
          "sceneId": "festival_concept",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「まずは、このデータを使って大気中のCO2濃度がどう推移してきたか、実際に動かして見てみてください」"
        },
        {
          "id": "festival_concept_new_032",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "あめが横に一歩下がり、操作コンソールをこちらへ差し向けた。「さあ、触ってみて」という合図だ。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_072"
        },
        {
          "id": "festival_concept_new_033",
          "sceneId": "festival_concept",
          "type": "narration",
          "text": "気づけば、吸い寄せられるようにスクリーンの前へ歩み寄っていた。",
          "speaker": "narrator",
          "cueFromStepId": "festival_concept_072"
        },
        {
          "id": "festival_concept_075",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "コンソールのトラックパッドに指を置くと、球体だった地球が滑らかに展開し、ワイドな世界地図へと広がった。"
        },
        {
          "id": "festival_concept_076",
          "sceneId": "festival_concept",
          "type": "narration",
          "speaker": "narrator",
          "text": "蓄積されたCO2濃度と気温の時系列データが、淡い光のグラデーションとなって大陸の上へ重なっていく。"
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
          "text": "世界地図の傍らに、CO2濃度を示す折れ線グラフが描かれた。細かなギザギザを刻みながら、ゆっくりと右上へ傾いていく。"
        },
        {
          "id": "map_mode01_002",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "静止した地図だと思っていた画面が動き出し、1958年から現代へ向けて年代スライダーが滑らかに進み始めた。"
        },
        {
          "id": "map_mode01_003",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「これがMODE 01です。1958年から2050年までのシミュレーションを、通しで体感してみてください」"
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
          "text": "年代が進むにつれて、大気中のCO2濃度が上がっていく。季節ごとの呼吸のような増減を繰り返しながら、全体の基準値が確実に押し上げられていくのが視覚的に分かる。"
        },
        {
          "id": "map_mode01_new_001",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "1958年の過去から、私たちが生きる現在を通り過ぎ、2050年の予測モデルへ。数値の上昇に引きずられるように、地球全体の輝きと色調が徐々に赤みを帯びていく。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_005"
        },
        {
          "id": "map_mode01_007",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "観測実測値から将来予測シミュレーションの境界線を越えたところで、スライダーが止まる。地図のオーバーレイがフェードし、視点は再びメイン画面へと戻った。"
        },
        {
          "id": "map_mode01_008",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "タイムスタンプをつけて値を記録し続ければ、同じ場所でもこれだけの差が浮かび上がる。私の部屋のセンサーも、時間を追えばこういう意味を持つんだろうか。"
        },
        {
          "id": "map_mode01_009",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「植物の光合成によって、CO2は季節ごとに上下の波を描きますの。けれど時間軸を数十年単位に広げると、その波を抱えたまま、土台そのものが底上げされているのが分かりますわ」"
        },
        {
          "id": "map_mode01_new_002",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "みずの指先が、画面上のピークとボトムをなぞる。台本を読み上げるのではなく、目の前のデータを一緒に読み解いている手つきだった。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_009"
        },
        {
          "id": "map_mode01_011",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「冬に上がって夏に下がっても、前の年の基準には戻っていないんだ」"
        },
        {
          "id": "map_mode01_new_003",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "口に出してみると、抽象的だった折れ線グラフが急に切迫した手触りを帯びてくる。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_011"
        },
        {
          "id": "map_mode01_new_004",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "ここからは見えないマウナロアや南極の大気が、目の前のスクリーンに確かな痕跡として焼き付いていた。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_011"
        },
        {
          "id": "map_mode01_013",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「そうなんです。数年だけ切り取ると単なる季節変動に見えちゃうんですけど、半世紀で見ると明らかなトレンドになるんです」"
        },
        {
          "id": "map_mode01_new_005",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "あめがこちらを見て小さくうなずいた。私がデータの意図を正確に拾い上げたことに、ホッとした表情を浮かべている。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_013"
        },
        {
          "id": "map_mode01_015",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは画面の描画負荷を確認してから、みずへ目配せした。"
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
          "text": "「ええ。次は地表面温度の推移ですわね」"
        },
        {
          "id": "map_mode01_018",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「熱弁しすぎて解説長くしないでよ？」"
        },
        {
          "id": "map_mode01_019",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「要点だけに絞りますわ」"
        },
        {
          "id": "map_mode01_new_006",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "軽口を叩き合いながら、みずがコンソールへ手を伸ばす。あめは自然に半歩下がり、スペースを空けた。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_019"
        },
        {
          "id": "map_mode01_021",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "マップの右隅に「気温偏差（Temperature Anomaly）」のインジケータが点灯する。"
        },
        {
          "id": "map_mode01_022",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「今度は、気温の偏りをヒートマップとして触ってみてください」"
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
          "text": "スライダーを動かしながら各地をタップすると、青、黄、赤の等高線が波打つように変化する。ある単年だけを見ると青と赤のモザイクに見えるが、年代を進めるにつれて、赤い領域が大陸を覆い尽くすように広がっていった。"
        },
        {
          "id": "map_mode01_025",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「気温偏差は、その地点の観測値と、基準期間の長期平均値との差分ですの」"
        },
        {
          "id": "map_mode01_026",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは真っ赤に染まった地域ではなく、画面端の凡例スケールをまず指差した。派手な色に目を奪われず、基準値の定義から見ろという無言の配慮だった。"
        },
        {
          "id": "map_mode01_027",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「平年値からどれくらいズレているか、その差分を見ているわけですね」"
        },
        {
          "id": "map_mode01_028",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「おっしゃる通りですわ。一瞬の猛暑や寒波だけで結論は出せませんの。同じ基準点を用いて、どれほどの期間その偏差が継続しているかを検証しますの」"
        },
        {
          "id": "map_mode01_new_007",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "スクリーンのフッターに、データソースのメタ情報がポップアップした。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_028"
        },
        {
          "id": "map_mode01_030",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "データセット名、提供機関、観測期間、ベースライン期間、単位系。表示されているグラフィックの根拠が、すべて明記されている。"
        },
        {
          "id": "map_mode01_031",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「NASAのGISTEMPなどの公開データをパースして使っています。今日はオフライン環境なのでキャッシュした静的データですけどね」"
        },
        {
          "id": "map_mode01_032",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「リアルタイムのストリーミングではないんですね」"
        },
        {
          "id": "map_mode01_033",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「将来的にはAPIから自動でフェッチして、推論モデルで先の変化も予測できるようにしたいんです。専門知識がなくても、触るだけで『これから地球がどうなるか』を直感で試せる仕組みにしたくて」"
        },
        {
          "id": "map_mode01_035",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の下部に、グレーアウトされた入力スロットが薄く見えた。『外部センサー入力：温度・湿度・照度』。私の机の上にあるマイコンも、ここに繋がるのだろうか。"
        },
        {
          "id": "map_mode01_036",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめがそのUIの配置を調整し、みずは空スロットを見つめる私の視線に気づいたようだった。何か言いたげな私の口元を、ふたりは静かに待ってくれている。"
        },
        {
          "id": "map_mode01_037",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ゆくゆくは、来場者が手元で測った温度や湿度も、観測時刻やデバイスの条件と一緒にマッピングできるようにしたいと考えていますの」"
        },
        {
          "id": "map_mode01_038",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「個人が組んだセンサーの値も、このグローバルな地図に並べられるんですか？」"
        },
        {
          "id": "map_mode01_new_008",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "部屋の隅で動いているESP32と安価な温湿度センサーが頭をよぎる。測定場所と条件さえ整えれば、あのおもちゃみたいな基板のデータも、この地図の一部になれるかもしれない。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_038"
        },
        {
          "id": "map_mode01_040",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「はい。どこで、どんな条件で測ったものかをセットで扱えば、身近な足元のデータと宇宙からの衛星データを重ね合わせられるはずなんです」"
        },
        {
          "id": "map_mode01_new_009",
          "sceneId": "map_mode01",
          "type": "narration",
          "text": "地図がゆっくりと球体に巻き直され、元の地球の姿に戻る。極端な赤や青のグラデーションは消え、青い海の上を白い雲が静かに流れていく。",
          "speaker": "narrator",
          "cueFromStepId": "map_mode01_040"
        },
        {
          "id": "map_mode01_042",
          "sceneId": "map_mode01",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面から手を離した。けれど、あの空スロットの文字が頭から離れない。どんなセンサー値も、測定条件がなければただのノイズだ。けれど条件さえ揃えれば、個人の電子工作だって比較可能なデータになる。"
        },
        {
          "id": "map_mode01_043",
          "sceneId": "map_mode01",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ここまでは、いま観測できる現代の地球の話です。ここからは……時間を一気に巻き戻します」"
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
          "text": "プロジェクターのファンが低く唸りを上げ、画面の地球が暗転した。"
        },
        {
          "id": "gx_experience_002",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "大陸の輪郭も、都市の灯火も消え去る。代わりに現れたのは、光の届かない太古の海の底だった。"
        },
        {
          "id": "gx_experience_003",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめはコンソール端のシェーダーコンパイル状況をチラリと確認し、みずは暗黒の海が現れるのを待つ私の横顔を見つめている。演出の効き目を測るような目つきだった。"
        },
        {
          "id": "gx_experience_004",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、オーディオの位相どう？」"
        },
        {
          "id": "gx_experience_005",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「良好ですわ。海風のノイズにも負けていませんの」"
        },
        {
          "id": "gx_experience_006",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「よし、いこう」"
        },
        {
          "id": "gx_experience_007",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "二人のあいだで手短なオペレーション確認が交わされると、あめは再び展示用のトーンへ切り替えてこちらを向いた。"
        },
        {
          "id": "gx_experience_008",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ここからは、地球そのものの変容の歴史に入ります。GX――グリーントランスフォーメーションっていう言葉、聞いたことありますか？」"
        },
        {
          "id": "gx_experience_009",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「ニュースや広告でよく見ます。脱炭素とかエネルギーシフトの話ですよね」"
        },
        {
          "id": "gx_experience_010",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「一般には産業社会の脱炭素シフトを指しますわね。けれどわたくしたちの大学のプロジェクトでは、生命と地球環境が互いを作り変えてきた四十数億年の歴史まで広げて捉え直したいと思いましたの。それが、このGAIA Transformationというアプローチですわ」"
        },
        {
          "id": "gx_experience_011",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「生命と地球がどうやって互いを書き換えてきたのか、時間を遡りながら確かめていきます」"
        },
        {
          "id": "gx_experience_012",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の下部に、現在から先カンブリア時代へと続く対数タイムラインが展開した。"
        },
        {
          "id": "gx_experience_013",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "スケールの右端にある「現在」は、針の先ほどのごくわずかな幅しかない。その左側に、気の遠くなるような深遠な時間が横たわっている。"
        },
        {
          "id": "gx_experience_014",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「では、始めますわね。現在から、地球が生まれた四十六億年前まで一気に潜りますの」"
        },
        {
          "id": "gx_experience_015",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「四十六億年……一気にそこまで行くんですか」"
        },
        {
          "id": "gx_experience_016",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。海も大気も、今とはまったく異なる原初の星まで戻りますわ」"
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
          "text": "ジェスチャー入力でタイムラインを激しくスワイプすると、年代表示が猛烈なスピードで逆回転を始めた。緑の森林が砂漠へ還り、大陸が一つに固まり、やがて地表の輪郭そのものが溶けていく。"
        },
        {
          "id": "gx_experience_020",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "四十六億年前。画面に広がったのは、重苦しい褐色の空と、酸素をまったく含まない荒れ狂う海だった。見慣れた景色がすべて剥ぎ取られても、スクリーン中央のステータスには確かに『EARTH』と表示されている。"
        },
        {
          "id": "gx_experience_021",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "今度はスライダーがゆっくりと順方向へ動き出す。猛烈な熱が冷め、海の色が深い群青へと落ち着いていく。そして約二十七億年前でピタリと止まった。静寂の海のなかで、微かな青い光が瞬き始めている。"
        },
        {
          "id": "gx_experience_022",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「その水面を、指先でゆっくり撫でてみてくださいまし」"
        },
        {
          "id": "gx_experience_023",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "指先をスクリーンに触れさせる。漆黒に近かった水面に、触れた場所から淡い波紋が広がった。"
        },
        {
          "id": "gx_experience_024",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが操作をサポートしようと、すぐ隣まで身を寄せてくる。潮風に混じって彼女の髪の香りが微かに届き、突然の距離の近さに思わず息を呑んだ。"
        },
        {
          "id": "gx_experience_025",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、近すぎ。お客さん緊張してるよ」"
        },
        {
          "id": "gx_experience_026",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「あら……失礼いたしましたわ」"
        },
        {
          "id": "gx_experience_027",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずは照れくさそうにほんの数センチだけ身を引いた。あめはツッコミを入れつつも、視線はフレームレートのドロップがないかモニターの数値を監視している。現象に没入させるみずと、背後のシステムを冷徹に支えるあめ。役割分担が鮮やかだった。"
        },
        {
          "id": "gx_experience_028",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "指先でなぞった軌跡に沿って、青緑色の小さな粒子群がポツポツと灯り始める。"
        },
        {
          "id": "gx_experience_029",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "粒子が生まれるたび、低い正弦波のトーンが返ってくる。ブースの周りの喧騒を掻い潜り、海の底から届くソナーのように耳へ響いた。"
        },
        {
          "id": "gx_experience_030",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "光の粒子は周囲の有機的なテクスチャと絡み合いながら、微細な網目状のフィラメントを伸ばしていく。"
        },
        {
          "id": "gx_experience_031",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「光合成を始めた原初の生命活動を、パーティクルの光としてレンダリングしていますの」"
        },
        {
          "id": "gx_experience_032",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「これが、地球上で最初の酸素を生み出している光……」"
        },
        {
          "id": "gx_experience_033",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「シアノバクテリアですね。海の中で光合成を行って、地球環境を根本から塗り替えてしまった細菌たちです」"
        },
        {
          "id": "gx_experience_035",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "光は際限なく増え続けるわけではなかった。海中に漂う暗い影に吸い込まれ、明滅しながら何度も消えていく。"
        },
        {
          "id": "gx_experience_036",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「生まれた酸素は、すぐに大気へ満ちたわけではありませんわ。気の遠くなるような時間をかけて、海中の鉄イオンを酸化させ、沈殿させるために消費され尽くしましたの」"
        },
        {
          "id": "gx_experience_037",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "時間を進めると、海が澄んだ青へとグラデーションを描き、やがて大気の上層に薄いオゾン層のベールが形成されていく。"
        },
        {
          "id": "gx_experience_038",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "わずか数十秒のインタラクションのなかに、億年単位の物質循環が凝縮されている。単体のバクテリアは顕微鏡でしか見えない点にすぎない。けれどその気の遠くなるような集積が、惑星の組成そのものをひっくり返してしまった。"
        },
        {
          "id": "gx_experience_new_001",
          "sceneId": "gx_experience",
          "type": "narration",
          "text": "あめの淡々とした解説と、みずの熱を帯びた眼差し。二人のガイドのおかげで、壮大なスケールが無理なく身体に入ってくる。",
          "speaker": "narrator",
          "cueFromStepId": "gx_experience_038"
        },
        {
          "id": "gx_experience_040",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「生命は単に環境に適応しただけじゃなくて、環境そのものを能動的に作り変えるドライバーになったんです」"
        },
        {
          "id": "gx_experience_041",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「生命が海と大気を変え、その新しくなった環境がまた次の生命を呼び寄せる。この果てしない相互作用こそが、地球と生命の共進化ですわ」"
        },
        {
          "id": "gx_experience_042",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "シミュレーションが終了し、スクリーンには再び現代の青い地球が戻ってきた。森林、大陸、そして夜の側を走る都市の光の帯。"
        },
        {
          "id": "gx_experience_043",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「今の私たちの文明活動も、地球というシステムへの巨大な入力の一つです。だからこそ、次にどんなフィードバックを返すかが問われているんだと思います」"
        },
        {
          "id": "gx_experience_new_002",
          "sceneId": "gx_experience",
          "type": "narration",
          "text": "一方的な搾取でも、無垢な自然への回帰でもない。影響を与え、影響を受け取る長い往復運動のなかに、自分たちの生活も確かにあるのだと腑に落ちる。",
          "speaker": "narrator",
          "cueFromStepId": "gx_experience_043"
        },
        {
          "id": "gx_experience_055",
          "sceneId": "gx_experience",
          "type": "narration",
          "speaker": "narrator",
          "text": "画面の端に、海洋、植生、気象、都市グリッドなどのパラメータパネルが並んだ。"
        },
        {
          "id": "gx_experience_056",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「今日はCO2の時系列マップと、この太古の海のデモを用意しました。他のレイヤーもそれぞれ違うデータソースと繋がっています」"
        },
        {
          "id": "gx_experience_057",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「視点を変えるだけで、地球がまったく別の生き物みたいに見えてきますね。他のパラメータも触ってみたいです」"
        },
        {
          "id": "gx_experience_058",
          "sceneId": "gx_experience",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「そう言ってもらえると設営の苦労が報われます！ あとでじっくり触ってみてください。ソースコードの構成も全部説明しますから」"
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
          "text": "暗幕の隙間から秋の日差しが差し込み、プロジェクターの光と混ざり合う。暗い深海のシミュレーションを見ていたせいで、外の光が少しまぶしい。"
        },
        {
          "id": "esp32_pitch_002",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "太古の海と現代の地球の残像が網膜に焼き付き、しばらくその場から動けなかった。"
        },
        {
          "id": "esp32_pitch_new_001",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "あめがコンソールから手を離し、こちらの様子を伺うように見ていた。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_002"
        },
        {
          "id": "esp32_pitch_004",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「デモはひとまず以上です。……どうでした？」"
        },
        {
          "id": "esp32_pitch_005",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "感想を言おうとして、さっき目にした操作パネルの空きスロット――『外部センサー入力』の文字が頭をよぎる。こんな完成度の高い展示に、自分の手慰みのような工作の話を持ち出してもいいものだろうか。けれど、ここで話さなければ、自分の部屋の机の上で完結していた測定は何の広がりも持たないままだ。"
        },
        {
          "id": "esp32_pitch_006",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "門外漢の思いつきだと笑われるかもしれない。それでも、このふたりなら面白がってくれるんじゃないかという直感が背中を押した。"
        },
        {
          "id": "esp32_pitch_007",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「あの……さっきの空きスロット、個人が作ったマイコンのセンサー値でも繋げられますか？」"
        },
        {
          "id": "esp32_pitch_008",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめとみずが一瞬だけ目を丸くした。的外れなことを言ったかと喉が乾きかけたが、ふたりが真剣な顔で私の次の言葉を待っていることに気づく。"
        },
        {
          "id": "esp32_pitch_009",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめの目が机の上の配線へ走り、みずがタブレットのメモアプリを開く。値踏みされているのではない。彼女たちは早くも「実装の課題」として考え始めていた。"
        },
        {
          "id": "esp32_pitch_010",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「普段、自室でESP32っていう小型のマイコンボードをいじってるんです。Wi-FiとBluetoothが載ってて、温度や気圧のセンサーを繋いでデータを外へ飛ばせるやつなんですけど」"
        },
        {
          "id": "esp32_pitch_011",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ESP32！ 使ってる人、周りには少なくて。具体的にどんな構成で組んでるんですか？」"
        },
        {
          "id": "esp32_pitch_new_002",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "食いつきが予想以上に良くて、強張っていた声がスッと通るようになった。慣れ親しんだパーツの名前なら、いくらでも話せる。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_011"
        },
        {
          "id": "esp32_pitch_013",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「千円ちょっとで買える安いやつです。温湿度とか気圧、照度センサーをI2Cで繋いで、MQTTかHTTPでサーバーに投げる構成です。最近はコードも回路図も生成AIに壁打ちしながら組めるので、個人でもかなり手軽に作れるんですよ」"
        },
        {
          "id": "esp32_pitch_new_003",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "矢継ぎ早に説明する私の前で、あめの指がタブレット上で猛スピードでメモを走らせる。みずは腕を組み、システム全体の整合性を吟味するようにゆっくり頷いている。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_013"
        },
        {
          "id": "esp32_pitch_015",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「ただ値を送るだけじゃなくて、マイコン側で移動平均を取ったり、閾値を超えた変化だけを検知してエッジ側で前処理させることもできます」"
        },
        {
          "id": "esp32_pitch_016",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「公開されている衛星データが『地球をマクロに見る目』なら、ESP32は『身近な街角の1点を測る触角』になれるんじゃないかと思って」"
        },
        {
          "id": "esp32_pitch_016a",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "あめが腕を組み、スクリーンのデータ出典欄をじっと見つめた。技術者のシビアな思考の顔だ。",
          "speaker": "narrator"
        },
        {
          "id": "esp32_pitch_016b",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「……気になるポイントがふたつある。ひとつは、個人の工作センサーの精度と、NASAや気象庁の校正された観測値を同じ画面に載せたら、見る人がデータの信頼性を混同しないかってこと」",
          "speaker": "amane",
          "speakerLabel": "あめ"
        },
        {
          "id": "esp32_pitch_016c",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「あ……確かに。同じレイヤーに混ぜてプロットしたらノイズになりますね」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "esp32_pitch_016d",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「もうひとつ。同じ住宅街でも、日なたに置くか日陰のベランダに置くかで温度なんて数度ズレる。どこにどう置いたかのメタデータがない数字は、比較のしようがないよ。アイデアは最高。でもそのままじゃ展示には乗せられない」",
          "speaker": "amane",
          "speakerLabel": "あめ"
        },
        {
          "id": "esp32_pitch_016e",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "鋭い指摘にぐっと言葉が詰まる。けれど、否定された悔しさ配分は微塵もなかった。彼女の懸念は、さっきこのブースで散々見せてもらった「観測条件の厳密さ」そのものだったからだ。",
          "speaker": "narrator"
        },
        {
          "id": "esp32_pitch_016f",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "机の上のセンサー。条件さえ明記すれば、ただのブレは「意味のある差分」に変わるはずだ。",
          "speaker": "narrator"
        },
        {
          "id": "esp32_pitch_016g",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「……なら、公的なデータと個人のデータはレイヤーを完全に分けましょう。ピンを打つときに、測定時刻、機器の型番、設置環境――たとえば『地上高1.5m・直射日光なし』みたいなメタデータを必須で付与するんです」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "esp32_pitch_016h",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「値がズレていたら、誤差だと切り捨てずにメタデータを追う。天候の差なのか、設置場所のマイクロクライメイト（微気候）なのかを突き止められるようにする。比較できないから捨てるんじゃなくて、比較できる形で残すんです」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー"
        },
        {
          "id": "esp32_pitch_016i",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「……それ！ そのメタデータの持たせ方なら、比較の土台ができる。いいね」",
          "speaker": "amane",
          "speakerLabel": "あめ"
        },
        {
          "id": "esp32_pitch_017",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずがタブレットからスッと顔を上げた。"
        },
        {
          "id": "esp32_pitch_018",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「公的機関のグローバルなデータと、参加者が手元で観測したローカルなデータを、対比可能なレイヤーとして共存させるわけですわね」"
        },
        {
          "id": "esp32_pitch_019",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、その設計思想すごくクリア。そのまま仕様メモに残して」",
          "expression": "bright"
        },
        {
          "id": "esp32_pitch_020",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「もう追記してありますわ」"
        },
        {
          "id": "esp32_pitch_021",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「仕事が早い！」"
        },
        {
          "id": "esp32_pitch_new_004",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "みずが少し誇らしげに口元をほころばせ、あめもニッと笑う。ふたりの開発の会話の真ん中に自分のアイデアが据えられていることが、純粋に嬉しかった。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_021"
        },
        {
          "id": "esp32_pitch_024",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「プライバシーにも配慮して、正確な緯度経度じゃなく、メッシュ単位で大まかに丸めて位置を偽装することもできます」"
        },
        {
          "id": "esp32_pitch_025",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「Wi-Fiが瞬断しても、マイコン側でリングバッファに溜めておいて、再接続時にタイムスタンプ付きでまとめて同期させれば欠損も防げますし」"
        },
        {
          "id": "esp32_pitch_new_005",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "気づけば、見学者の感想ではなく、完全に開発ミーティングの熱気になっていた。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_025"
        },
        {
          "id": "esp32_pitch_028",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめのキーボードを叩く音が小気味よく響く。私が口にした要件が、そのままアーキテクチャの箇条書きに変換されていく。みずはその横から、必要なバリデーション条件を書き足していた。"
        },
        {
          "id": "esp32_pitch_new_006",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「それ、すごくいい。衛星の広域データと、机の上のデータをちゃんと切り分けて比較できるし、通信が切れたときのフォールバックも綺麗。条件さえ残せば、ただの誤差じゃなくて『その場所の生きた記録』になるしね」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "esp32_pitch_028"
        },
        {
          "id": "esp32_pitch_new_007",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "text": "「同じ町でも、日なたと日陰でどれほど差が出るか。その違いの理由までを可視化できれば、まさに身近な感覚器として機能しますわ」",
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
          "text": "「まずは1台、手持ちのパーツでPoC（概念実証）のモックを組んでみましょうか」"
        },
        {
          "id": "esp32_pitch_032",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「うん！ 最初のPoCで検証したい仮説をひとつに絞ろう。日陰と日なたの温度差にフォーカスすれば、必要なセンサーも最小限で済むし」"
        },
        {
          "id": "esp32_pitch_033",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめが画面に「1台でPoC」と大きく丸をつけ、期待に満ちた目を向けてくる。自分の部屋で埃をかぶっていた電子部品が、いま確かに他人のプロジェクトのコアと接続された。"
        },
        {
          "id": "esp32_pitch_034",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「このアイデア、このブースだけで終わらせるの絶対もったいない。本格的に実装しようよ」",
          "expression": "bright"
        },
        {
          "id": "esp32_pitch_035",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ええ。単なる数値の垂れ流しではなく、あとで比較可能なデータスキーマの設計から詰めましょう」",
          "expression": "smile"
        },
        {
          "id": "esp32_pitch_036",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「欲張って最初から機能を盛りすぎないで、まずは1台で疎通確認と描画テストね」"
        },
        {
          "id": "esp32_pitch_037",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「承知いたしましたわ。まずは手を動かして、動くものを見てからですわね」"
        },
        {
          "id": "esp32_pitch_new_008",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "課題の整理、スコープの切り出し、次のアクション。淀みなく決まっていくプロセスのなかで、私はもはや単なる見学者ではなくなっていた。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_037"
        },
        {
          "id": "esp32_pitch_039",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「本当に、この展示に組み込んでもいいんですか？」"
        },
        {
          "id": "esp32_pitch_040",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「いいに決まってるでしょ！ 変化を測って、条件を揃えて、次の観測をどうするか考える。それこそ私たちがGAIA SENSEWAREでやりたかったことのド真ん中だよ」"
        },
        {
          "id": "esp32_pitch_041",
          "sceneId": "esp32_pitch",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「衛星の視点だけでは捉えきれない、人間が暮らす地上の一点。その欠けていたピースを、青猫さんが持ってきてくださったのですから」"
        },
        {
          "id": "esp32_pitch_new_009",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "text": "みずはまっすぐに私を見てそう言った。あめの画面には、私たちの議論のログがしっかりと保存されている。",
          "speaker": "narrator",
          "cueFromStepId": "esp32_pitch_041"
        },
        {
          "id": "esp32_pitch_043",
          "sceneId": "esp32_pitch",
          "type": "narration",
          "speaker": "narrator",
          "text": "けれど、その仕様書のどこにもまだ私の名前は書かれていなかった。この続きを、どうしてもこの二人と一緒に作りたい――胸の奥で、強い衝動が形になり始めていた。"
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
          "text": "「展示終了まで、あと三十分となります」と場内アナウンスが響いた。隣のブースからは、段ボールをガムテープで留める乾いた音が聞こえてくる。"
        },
        {
          "id": "circle_invitation_002",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "スクリーンの表示が待機画面へ戻る。二人と一緒にプロトタイプを組む光景が一瞬頭をよぎった。けれど、連絡先も知らないままこのテントを出てしまえば、それでおしまいだ。来たとき以上の強烈な喪失感が押し寄せてくる。"
        },
        {
          "id": "circle_invitation_new_001",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "話を繋ぐための質問を探した。けれど、技術のこともコンセプトのことも、さっきの熱狂のなかで出し切ってしまっていた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_002"
        },
        {
          "id": "circle_invitation_004",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "明日になれば、今日ここで交わした言葉も、広大なネットの海へ押し流されてしまうかもしれない。アバターでもテキストでもない、目の前で笑い、真剣に議論してくれた二人の温度を、手放したくなかった。"
        },
        {
          "id": "circle_invitation_new_002",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "ほんの1時間前まで顔も知らなかった三人が、ひとつの基板を巡って同じ未来を覗き込んでいた。その時間を、ここで途切れさせたくない。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_004"
        },
        {
          "id": "circle_invitation_006",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「このシステム、学園祭が終わったあとも開発を続けるんですか？」"
        },
        {
          "id": "circle_invitation_007",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「もちろん。今日の展示で完成だなんて、これっぽっちも思ってないよ」"
        },
        {
          "id": "circle_invitation_008",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「地球は明日も変化を止めませんもの。人間がただ環境を壊すだけの存在でないのだとしたら、観測して、作り直す試みも終わらせるわけにはいきませんわ」"
        },
        {
          "id": "circle_invitation_new_003",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「……僕も、二人の開発に参加したいです。ものづくりを口実にしてるだけかもしれないけれど、画面越しじゃないところで、また二人と話がしたい」",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "cueFromStepId": "circle_invitation_008"
        },
        {
          "id": "circle_invitation_new_004",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "言ってしまった。断られるのが怖くて口を噤むくらいなら、カッコ悪くても踏み込んだほうがいい。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_008"
        },
        {
          "id": "circle_invitation_011",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「あ、いえ……家でリポジトリや出典のドキュメントも見直したいので、Webからアクセスできる環境があれば教えてほしいなと」"
        },
        {
          "id": "circle_invitation_012",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "急に我に返り、慌てて実務的なトーンを取り繕って言い訳を重ねる。二人は顔を見合わせた。"
        },
        {
          "id": "circle_invitation_013",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずがタブレットのカバーに指を添え、あめがその手元を見つめる。ほんの数秒の沈黙。断る理由を探しているのではなく、相手の覚悟を確かめ合っているような間だった。"
        },
        {
          "id": "circle_invitation_015",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「公開してるステージング環境ならあるよ。でも、一番面白い開発ブランチはまだローカルでしか動かしてないんだ」"
        },
        {
          "id": "circle_invitation_new_005",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめは視線を泳がせながら、タブレットの縁を爪先でコツコツと叩いた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_015"
        },
        {
          "id": "circle_invitation_017",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「開発の議論やコードレビューは、学内チャットの専用チャンネルで行っていますの」"
        },
        {
          "id": "circle_invitation_new_006",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずが机の引き出しに手を伸ばしかけ、ふと止める。こちらの出方を試すような、静かな視線だった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_017"
        },
        {
          "id": "circle_invitation_019",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "オンライン大学のチャットツール。これまで事務連絡を読むためだけの無機質なタイムラインだった場所が、急に熱を帯びたアトリエのように思えてくる。"
        },
        {
          "id": "circle_invitation_020",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「そのチャット……僕も入れてもらえませんか？」"
        },
        {
          "id": "circle_invitation_021",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "通路を資材運搬の台車がガラガラと通り過ぎていく。あめはすぐには答えなかった。"
        },
        {
          "id": "circle_invitation_022",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "彼女の眠たげだった瞳がスッと細まり、悪戯っぽく口元が持ち上がる。私の焦りも本気も、全部見透かしたような顔だった。"
        },
        {
          "id": "circle_invitation_023",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「ただの展示見学のつもりなら、そんな必死な顔で頼み込まないですよね」",
          "expression": "smile"
        },
        {
          "id": "circle_invitation_024",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずが目を丸くしてあめを見やり、すぐに納得したように微笑んだ。"
        },
        {
          "id": "circle_invitation_new_007",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "もう引き返せない。外から出来上がった作品を眺めるだけの観客席には、二度と戻りたくなかった。泥臭くハンダを吸い取り、エラーログを吐きながら作る側に回りたい。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_024"
        },
        {
          "id": "circle_invitation_026",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「僕にできることなら、何でもやりますから」"
        },
        {
          "id": "circle_invitation_027",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずの表情が柔らかくほどける。彼女はあめへ視線を送り、あめは静かに頷き返した。"
        },
        {
          "id": "circle_invitation_028",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "合図を受け取ったみずが、机の端のクリアケースから一枚のカードを取り出す。"
        },
        {
          "id": "circle_invitation_029",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "水彩で描かれた青い惑星のイラストと、『惑星の放課後』という手書き風のロゴ。みずはそのカードを指先で挟み、私の胸元へ差し出した。"
        },
        {
          "id": "circle_invitation_030",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「私たちのサークルは、このGAIA SENSEWAREを作りながら、それぞれの技術やフェチを持ち寄る場所です」"
        },
        {
          "id": "circle_invitation_031",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「放課後の部室のような場所ですわ。続きの設計も、すべてここで話し合っていますの」"
        },
        {
          "id": "circle_invitation_new_008",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "おっとりとした口調の奥に、確かな歓迎の響きがあった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_031"
        },
        {
          "id": "circle_invitation_new_009",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめも腕組みを解き、真っ直ぐこちらを見据えている。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_031"
        },
        {
          "id": "circle_invitation_034",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「さっきのESP32の構想、言い出しっぺがいないと実装進まないからね」"
        },
        {
          "id": "circle_invitation_035",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "ぶっきらぼうな言い回しのなかに、照れくさそうな期待が透けて見える。"
        },
        {
          "id": "circle_invitation_new_010",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "カードの縁を指先でなぞるみずの手元。冗談や気まぐれではなく、ふたりが対等な開発メンバーとして私を招き入れようとしているのが分かった。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_035"
        },
        {
          "id": "circle_invitation_038",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "遠くで鳴る閉会のチャイムと、プロジェクターの排気音。短い沈黙のなかで、迷いは完全に消えていた。"
        },
        {
          "id": "circle_invitation_039",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「喜んで。最後まで付き合わせてください」"
        },
        {
          "id": "circle_invitation_new_011",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめの肩からストンと力が抜けた。ふう、と小さく息を吐き、みずと顔を見合わせる。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_039"
        },
        {
          "id": "circle_invitation_040",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "ふたり同時に吹き出すように笑った。断られるかもしれないと不安だったのは、彼女たちも同じだったのだ。"
        },
        {
          "id": "circle_invitation_new_012",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずがカードを私の手元へ差し入れる。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_040"
        },
        {
          "id": "circle_invitation_043",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「では改めて。お客さまとしてではなく、同じ船に乗る開発仲間として、よろしくお願いいたしますわ」"
        },
        {
          "id": "circle_invitation_new_013",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "居場所って、最初から用意されているものじゃないんだと思う。\n不格好でも手を動かして、一緒に失敗して、少しずつ直していく。その作業の途中に、いつの間にかできているものなのだろう。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_043"
        },
        {
          "id": "circle_invitation_new_014",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "差し出された紙片を、両手でしっかりと受け取った。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_043"
        },
        {
          "id": "circle_invitation_046",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「こちらこそ、よろしくお願いします！」"
        },
        {
          "id": "circle_invitation_new_015",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめが満足そうに口端を吊り上げ、みずは嬉しそうにパチパチと小さく手を叩いた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_046"
        },
        {
          "id": "circle_invitation_048",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "カードの裏面には、サークルのポータルへ飛ぶQRコードが印字されていた。"
        },
        {
          "id": "circle_invitation_049",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "スマートフォンのカメラをかざすと、ブラウザが立ち上がり、認証画面がロードされる。"
        },
        {
          "id": "circle_invitation_050",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "『サークル：惑星の放課後 に参加しますか？』\n二人が息を呑んで私の手元を覗き込んでいる。"
        },
        {
          "id": "circle_invitation_051",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "迷わず『JOIN』をタップした。"
        },
        {
          "id": "circle_invitation_052",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "ピロン、と短い電子音が鳴り、画面がグリーンに切り替わる。"
        },
        {
          "id": "circle_invitation_new_016",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "その音を聞いて、あめが顔を跳ね上げた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_052"
        },
        {
          "id": "circle_invitation_054",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "目を丸くしたあと、くしゃっとした笑顔が広がっていく。今日会ってから、一番屈託のない表情だった。"
        },
        {
          "id": "circle_invitation_055",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「よし、ちゃんと参加された！」"
        },
        {
          "id": "circle_invitation_new_017",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "喜びを隠そうともせず、あめが私の顔を正面から見つめてくる。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_055"
        },
        {
          "id": "circle_invitation_new_018",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "みずも胸の前で手を合わせ、花が咲いたような笑顔を浮かべていた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_055"
        },
        {
          "id": "circle_invitation_058",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「本当に嬉しいですわ。飛び込んできてくださって、ありがとうございます」"
        },
        {
          "id": "circle_invitation_059",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「みず、ずっとソワソワしてたもんね」"
        },
        {
          "id": "circle_invitation_060",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「あめこそ、断られたらどうしようって顔をしていましたわよ」"
        },
        {
          "id": "circle_invitation_new_019",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「……う、うるさいな」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_new_020",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "照れ隠しにそっぽを向くあめと、それをからかうみず。気兼ねのないやり取りを見ているだけで、胸の奥がじんわりと温かくなる。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_new_021",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "自分でボタンを押したはずなのに、こんなに喜んでもらえるなんて思っていなかった。画面越しの孤独が、音を立てて崩れていく。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_060"
        },
        {
          "id": "circle_invitation_new_022",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「まあ、歓迎会は次の実験が無事に動いてからね」",
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
          "text": "「放課後は長いから、覚悟して付き合ってよね」",
          "speakerLabel": "あめ",
          "expression": "bright"
        },
        {
          "id": "circle_invitation_new_023",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "歓迎の言葉を受け止めながら、ふと視線を落とす。スマートフォンの画面には、サークルのメンバー一覧が表示されていた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_066"
        },
        {
          "id": "circle_invitation_068",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「現在のアクティブメンバーは、わたくしとあめ、それから今日は現地に来られなかった『saku』さんの三人ですの」"
        },
        {
          "id": "circle_invitation_new_024",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「sakuはシステム全体のアーキテクチャ設計と進行管理を見てくれてる人。プロデューサー兼リードエンジニアって感じかな」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_068"
        },
        {
          "id": "circle_invitation_new_025",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「GAIA SENSEWAREというプロジェクト名を掲げたのもsakuですの。サイエンスとアートをどう繋ぐか、いつも大きな視点で交通整理をしてくださいますわ」",
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
          "text": "「saku、今は海外に住んでるから今日はリアルで来られなかったんだよね」"
        },
        {
          "id": "circle_invitation_072",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "国境を越えてオンラインで繋がり、リアルの展示をここまで仕上げてしまう。通信制大学のフットワークの軽さに、改めて圧倒される。"
        },
        {
          "id": "circle_invitation_073",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "その時、手元の画面にプッシュ通知が滑り込んできた。"
        },
        {
          "id": "circle_invitation_074",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "『青猫 がチャンネルに参加しました』\nみずがその文字列を見つめ、ハッと息を呑む。"
        },
        {
          "id": "circle_invitation_075",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「青猫さん……とお呼びすればよろしいのかしら。とても綺麗なお名前ですわね」"
        },
        {
          "id": "circle_invitation_new_026",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「あ、みずズルい。先に言おうと思ってたのに」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_027",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「ふふ、早い者勝ちですわ」",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_028",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "あめは少し悔しそうにこちらをチラリと見た。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_029",
          "sceneId": "circle_invitation",
          "type": "dialogue",
          "text": "「……うん。すごく呼びやすくて、いいハンドルネームだと思う」",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_new_030",
          "sceneId": "circle_invitation",
          "type": "narration",
          "text": "そっぽを向いたあめの耳の先が、ほんのり赤くなっているのをみずは見逃さず、クスクスと笑っていた。",
          "speaker": "narrator",
          "cueFromStepId": "circle_invitation_075"
        },
        {
          "id": "circle_invitation_081",
          "sceneId": "circle_invitation",
          "type": "narration",
          "speaker": "narrator",
          "text": "ネットの海で記号として使ってきた自分のハンドルが、二人の声を通して血の通った名前になった。呼ばれた瞬間、世界との距離がぐっと縮まった気がした。"
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
          "text": "学内チャットのUIが開く。アイコンとテキストだけのフラットな画面。けれど、さっきまでの冷たいテキストログとはまるで違って見えた。"
        },
        {
          "id": "welcome_chat_new_001",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "トークルームの最下部に、赤い未読バッジが灯る。",
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
          "text": "二人に呼ばれたばかりの名前が、システムのログとして刻まれる。",
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
          "text": "みなさま、新しい仲間をご紹介しますわ。今日の展示ブースに来てくださった、青猫さんですの。"
        },
        {
          "id": "welcome_chat_007",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:07",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "ハードウェアとエッジ処理に強い人だよ！"
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
          "text": "画面を挟んでも、二人の声のトーンがそのまま再生されるようだった。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_008"
        },
        {
          "id": "welcome_chat_010",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "カーソルを点滅させながら、何度もメッセージを打ち直す。授業の質問フォーラム以外で、学内のチャットに発言するのはこれが初めてだった。"
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
          "text": "参加させていただきありがとうございます。ESP32のPoCとデータ連携からお手伝いさせてください。よろしくお願いします！\n🎉 3 🌍 2 🫶 2"
        },
        {
          "id": "welcome_chat_013",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "投稿した瞬間にリアクションの絵文字がポンポンと跳ねる。文字の向こうに確かに人がいるという実感が湧いてくる。"
        },
        {
          "id": "welcome_chat_new_005",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "数秒後、見慣れないアイコンからメンションが飛んできた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_013"
        },
        {
          "id": "welcome_chat_015",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "遠い海の向こうにいるという、sakuからのメッセージだった。"
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
          "text": "独特の浮遊感のある挨拶のあと、sakuは淀みなく本題へ移った。初対面でも、作るものさえあれば一瞬で仲間になれる。それがこのサークルの流儀らしかった。"
        },
        {
          "id": "welcome_chat_021",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:17",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "さっきブースで詰めた要件、スレッドに切り出したよ。"
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
          "text": "展示場で議論した、ESP32からGAIA SENSEWAREへのインジェスト構成案ですの。まずは1台でPoCを行い、タイムスタンプ・位置・機器・設置メタデータをパケットに含めますわ。",
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
          "text": "添付された構成図には、先ほど私が口頭で伝えたブロック図が、すでに綺麗なシーケンス図として清書されていた。",
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
          "text": "衛星のオープンデータと、青猫さんの手元のセンサーが拾う微気候を、同じGLSLのシェーダー上で重ねて描画してみたい。"
        },
        {
          "id": "welcome_chat_026",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:20",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "同じ街のなかでも、日なたのアスファルトと街路樹の日陰では熱の溜まり方が全然違う。その微細なテクスチャをすくい上げられる。"
        },
        {
          "id": "welcome_chat_027",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:20",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "パケットのヘッダに、センサー型番、校正日、設置高度、直射日光の有無をメタ情報として積もう。そうすれば後から別のノードと比較可能になる。"
        },
        {
          "id": "welcome_chat_028",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:21",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "saku、設計の話になると一瞬で仕様書作ってくるよね。"
        },
        {
          "id": "welcome_chat_029",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:21",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "設置場所の高さや日照条件が分からない生データは、後からノイズと区別がつかなくなるからね。"
        },
        {
          "id": "welcome_chat_030",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:21",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "完全同意。"
        },
        {
          "id": "welcome_chat_new_008",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "さっきまで自分の頭の中にしかなかった工作の断片が、鮮やかな設計図へと組み替えられていく。未完成を恥じる必要なんてない。条件さえ明記すれば、どんな工作も対等な観測点になれるのだ。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_030"
        },
        {
          "id": "welcome_chat_new_009",
          "sceneId": "welcome_chat",
          "type": "chat",
          "text": "saku、食いつき早すぎ。",
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
          "text": "では、まずミニマムな1台で検証いたしましょう。日なたと日陰の温度差の検出にフォーカスして、サンプリング周期を決めますの。"
        },
        {
          "id": "welcome_chat_new_010",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "自宅のパーツ棚を思い浮かべる。ブレッドボード、ジャンパワイヤ、BME280、ESP32開発ボード。揃えるべき道具が即座に浮かんできた。",
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
          "text": "サンプリングはまず60秒間隔でいこう。設置場所はあとで相談ね。"
        },
        {
          "id": "welcome_chat_036",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:23",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "通信断の際のローカルバッファと、再同期シーケンスのエッジ処理も仕様に含めましょう。"
        },
        {
          "id": "welcome_chat_037",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:23",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "了解。青猫さん、この仕様でファームウェア切れそう？"
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
          "text": "頼もしい！ 動いたら照度センサーもスタックしよう。"
        },
        {
          "id": "welcome_chat_040",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:25",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "実装の進捗は、# 惑星の放課後_センサー で共有してね。"
        },
        {
          "id": "welcome_chat_041",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "新設されたチャンネルを開く。まだ真っ新なタイムライン。けれど、最初の一行を書き込むことへの恐れは、もう綺麗さっぱり消え去っていた。"
        },
        {
          "id": "welcome_chat_new_011",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "目の前にいるあめとみず、遠い国にいるsaku。画面の向こうに、確かに同じ熱量でコードを紡ぐ仲間がいる。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_041"
        },
        {
          "id": "welcome_chat_new_012",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "テントの隙間から覗く秋の空はどこまでも青く、海風が心地よく吹き抜けていく。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_041"
        },
        {
          "id": "welcome_chat_044",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "朝は、誰にも見つからないように下を向いて歩いていた。けれど今は、自室の机でハンダ付けをやり直し、ビルドエラーを一緒に潰す時間が待ち遠しくてたまらない。"
        },
        {
          "id": "welcome_chat_045",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "最初はたった1台。けれどそれが10台、100台と増えていけば、世界中に散らばる学生たちの部屋から、足元の生々しい観測が届くようになる。"
        },
        {
          "id": "welcome_chat_new_013",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "剥き出しの基板それ自体は、ただの電子部品の塊だ。けれど観測の条件を残し、差分を読み解き、次のアクションへ繋げる人間がいて初めて、それは生きた感覚器になる。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_045"
        },
        {
          "id": "welcome_chat_047",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "会場の終了アナウンスが流れ、周囲のブースの照明が次々と落とされていく。"
        },
        {
          "id": "welcome_chat_new_014",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "チャットで決まったタスクを頭の中で反芻する。数字を集めること自体が目的じゃない。その数字から何を読み取り、自分たちの選択をどう変えていくか。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_047"
        },
        {
          "id": "welcome_chat_new_015",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "GAIA SENSEWAREが繋ぎ止めたのは、遠い星のデータだけじゃない。同じ星の上で、未来を面白がろうとする人間同士の意志だった。",
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
          "text": "チャットの通知音ではなく、すぐ真横から声が降ってきた。"
        },
        {
          "id": "welcome_chat_057",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "振り返ると、みずが少し悪戯っぽく微笑んでいる。"
        },
        {
          "id": "welcome_chat_058",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「リアルでお会いするときも、そのお名前でお呼びしてもよろしくて？」"
        },
        {
          "id": "welcome_chat_059",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「はい、もちろん」"
        },
        {
          "id": "welcome_chat_060",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「私も青猫さんって呼ぶね」"
        },
        {
          "id": "welcome_chat_061",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "あめは撤収作業の手を止めずに言った。顔は見えないけれど、声の調子で十分に伝わってくる。"
        },
        {
          "id": "welcome_chat_new_016",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "壮大な地球環境を語るより、その呼びかけに答えるほうが、ずっと胸が高鳴っていた。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_061"
        },
        {
          "id": "welcome_chat_new_017",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "センサーを繋ぎたい。コードを書きたい。そして、またこのふたりに会いたい。どれも偽りのない本音だった。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_061"
        },
        {
          "id": "welcome_chat_064",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「さて、完全撤収の時間です。メインプロジェクター落とすね」"
        },
        {
          "id": "welcome_chat_new_018",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "あめがキルスイッチを叩く。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_064"
        },
        {
          "id": "welcome_chat_066",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "巨大なファンの停止音とともに、投影されていた地球がゆっくりと闇に溶けていった。"
        },
        {
          "id": "welcome_chat_067",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "光を失ったスクリーンの表面に、並んで立つ私たちの姿がうっすらと反射する。目が合い、誰からともなく小さく笑った。"
        },
        {
          "id": "welcome_chat_069",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "みずがフライヤーをケースに収め、あめが太い電源ケーブルを8の字に巻き取っていく。私は足元にあった重い工具箱を両手で持ち上げた。"
        },
        {
          "id": "welcome_chat_070",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "amane",
          "speakerLabel": "あめ",
          "text": "「あ、それ結構重いですよ！」"
        },
        {
          "id": "welcome_chat_071",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "visitor",
          "speakerLabel": "プレイヤー",
          "text": "「大丈夫です、持てます」"
        },
        {
          "id": "welcome_chat_072",
          "sceneId": "welcome_chat",
          "type": "dialogue",
          "speaker": "mizuha",
          "speakerLabel": "みず",
          "text": "「ふふ、助かりますわ」"
        },
        {
          "id": "welcome_chat_073",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "もうお客様扱いされていない。その対等な雑さが、たまらなく心地よかった。"
        },
        {
          "id": "welcome_chat_new_019",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "三人でブースの幕をくぐり、夕暮れの広場へ出た。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_073"
        },
        {
          "id": "welcome_chat_075",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "海沿いのプロムナードは、茜色と群青のグラデーションに染まっていた。潮風が吹き抜け、撤収の喧騒のなかで大学のペナントがはためいている。"
        },
        {
          "id": "welcome_chat_076",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "人混みを縫って歩きながら、次の定例ミーティングの話をした。持ち寄るパーツも、データのフォーマットもまだ決まっていない。けれど、誰も話を切り上げようとしなかった。"
        },
        {
          "id": "welcome_chat_077",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "最初のプロトタイプは、きっとノイズだらけでエラーを吐くだろう。けれど、それを一緒にデバッグする仲間が、いま隣を歩いている。"
        },
        {
          "id": "welcome_chat_078",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "ポケットの中で、スマートフォンがトントンと短く震えた。"
        },
        {
          "id": "welcome_chat_new_020",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "機材箱を片手で抱え直し、画面を覗き込む。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_078"
        },
        {
          "id": "welcome_chat_new_021",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "sakuからの新しいチャットだった。",
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
          "text": "次に測りたい場所が決まったら教えて。"
        },
        {
          "id": "welcome_chat_082",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:42",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "たった1台の小さなノードから、まだ誰も見ていない地球の表情が立ち上がってくる。"
        },
        {
          "id": "welcome_chat_083",
          "sceneId": "welcome_chat",
          "type": "chat",
          "time": "10:42",
          "speaker": "sakuya",
          "speakerLabel": "saku",
          "text": "その差分を見て、次の観測点を選ぼう。"
        },
        {
          "id": "welcome_chat_084",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "そのシンプルな言葉が、逗子の浜辺と、遠い大陸と、私の自室の作業机をまっすぐに貫いていた。"
        },
        {
          "id": "welcome_chat_new_022",
          "sceneId": "welcome_chat",
          "type": "narration",
          "text": "知ることで、次の選択が変わる。一人きりで帰るはずだった私が、次はパーツを抱えてこの海へやってくる。その小さな選択が、世界の風景を塗り替えていく。",
          "speaker": "narrator",
          "cueFromStepId": "welcome_chat_084"
        },
        {
          "id": "welcome_chat_092",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "スマートフォンをポケットにしまう。顔を上げると、夕日を背負った二人が立ち止まり、こちらを振り返って待っていた。"
        },
        {
          "id": "welcome_chat_094",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "次にスクリーンを立ち上げるとき、そこには私たちが送った最初の1点が灯っているはずだ。私は胸を張って、二人の足取りに追いついた。"
        },
        {
          "id": "welcome_chat_095",
          "sceneId": "welcome_chat",
          "type": "narration",
          "speaker": "narrator",
          "text": "観測は、もう始まっている。私たちの放課後は、ここから続いていく。",
          "cueFromStepId": "welcome_chat_094"
        }
      ],
      "nextSceneId": null
    }
  ]
});
globalThis.GAIA_NOVEL_STORY_V6 = globalThis.GAIA_NOVEL_STORY;
