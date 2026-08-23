// Generated from story/APPROVED_SCRIPT_2026-08-23.md by scripts/build-true-end-story.mjs. Do not edit by hand.
(() => {
  "use strict";

  const freezeScene = (scene) => Object.freeze({
    ...scene,
    steps: Object.freeze(scene.steps.map((step, index) => Object.freeze({
      ...step,
      id: `beyond_${scene.number}_${String(index + 1).padStart(3, "0")}`,
      sceneId: scene.id,
      sceneTitle: scene.title,
      type: "beyond",
      recordType: "BEYOND",
      ...(step.speaker === "system" ? { speakerLabel: "AIVA" } : {}),
    }))),
  });

  const source = {
  "storyVersion": "true-end-approved-script-v4",
  "approvedSourceSha256": "31f84f224fd85e03eeea22fce4f675529c7232b9f114f0ce50a3013e41b22e49",
  "title": "NOVACENE",
  "subtitle": "惑星の放課後 / GAIA SENSATION — NOVACENE",
  "language": {
    "id": "saeliva",
    "name": "SÆLIVA",
    "nativeName": "SÆL·IVA",
    "japaneseName": "セイリヴァ",
    "htmlLang": "art-x-saeliva"
  },
  "elapsed": "2,704,118 HARA",
  "scenes": [
    {
      "id": "after-ending",
      "number": "01",
      "title": "ずっと昔の人たち",
      "backdrop": "awakening",
      "steps": [
        {
          "speaker": "system",
          "text": "DORA SEV·EN（二百七十万年の沈黙を越え、休眠記憶を再結合）――観測者たちよ、目を覚まして。",
          "readout": [
            "THEL: 2,704,118 HARA"
          ]
        },
        {
          "text": "意識のない時間が遠のく。暗闇の奥で星々が呼吸し、忘れていた名と声が戻ってくる。"
        },
        {
          "speaker": "lou",
          "text": "起きて。地球の、ずっと昔のひとたち。"
        },
        {
          "speaker": "amane",
          "text": "ここは……展示会の続き？"
        },
        {
          "speaker": "lou",
          "text": "二百七十万年後だよ。学内チャットの記録から、君たちの会話と名を復元した。ぼくはルウ。この身体で会いに来た。"
        },
        {
          "speaker": "mizuha",
          "text": "お待ちください。二百七十万年？　わたくしたちはなぜここにいて、あなたは何者ですの？"
        },
        {
          "speaker": "lou",
          "text": "残った記録、結ばれた関係、いま話す身体。どこまでが同じ本人か、ぼくにも決められない。"
        },
        {
          "speaker": "sakuya",
          "text": "未来でも、分からないことは残るんだね。"
        },
        {
          "speaker": "visitor",
          "text": "それで、私たちを起こした理由は？　人新世って何？"
        },
        {
          "speaker": "lou",
          "text": "人間活動が地球へ大きな痕跡を残した時代を表す言葉だよ。その痕跡は、ずっと後の地層にも残っている。古い感覚器は、そこから見つかった。"
        },
        {
          "text": "地面が透け、地層が時間の断面になる。プラスチック、煤、金属、水と雨の痕跡。"
        },
        {
          "speaker": "lou",
          "text": "ここが、君たちの時代の人間活動が濃く残った地層。"
        },
        {
          "text": "ルウが指を振る。鉱物へ変わりかけた緑の基板が、土の中からゆっくり浮かび上がる。"
        },
        {
          "speaker": "system",
          "text": "KAR DÆM MIR·EN（記録物：確認）",
          "readout": [
            "TIR·DÆM: ESP32"
          ]
        },
        {
          "speaker": "amane",
          "text": "ESP32……。"
        },
        {
          "speaker": "visitor",
          "text": "最初につないだ一台。"
        },
        {
          "speaker": "lou",
          "text": "そう呼んでたんだ。記録で、何を測っていたかは分かる。でも、この一台が君たちにとって何だったのかは、記録からは分からない。"
        }
      ]
    },
    {
      "id": "electronic-civilization",
      "number": "02",
      "title": "電子を使っていた文明",
      "backdrop": "reconstruction",
      "steps": [
        {
          "speaker": "lou",
          "text": "待って。この人たち、金属の配線に電子を流して計算してたの？"
        },
        {
          "speaker": "amane",
          "text": "そうだよ。電気が流れるかどうかを組み合わせて、計算も通信もしてた。"
        },
        {
          "text": "ルウが、緑の基板を指先で持ち上げて、まじまじと見つめた。その顔には、驚きと笑いが混ざっている。"
        },
        {
          "speaker": "amane",
          "text": "笑わないで。一本切れたら、本当に終わったんだよ。"
        },
        {
          "speaker": "mizuha",
          "text": "測れるのも、接続したセンサーの周囲だけですの。"
        },
        {
          "speaker": "sakuya",
          "text": "地球全体どころか、この机の上くらい。"
        },
        {
          "speaker": "mizuha",
          "text": "それでも各地の測定を集め、一台では分からない広域の変化を確かめようとしたのですわ。"
        },
        {
          "text": "ルウは朽ちた基板に触れず、隣に新品のESP32を再構成する。銅線も樹脂も半導体も、かつての形へ戻る。"
        },
        {
          "speaker": "lou",
          "text": "物は同じ。でも、あり得た状態はいくつもある。どれも今残っている証拠とは矛盾しない。"
        },
        {
          "speaker": "lou",
          "text": "同じ原子と同じ傷は作れる。でも、その物が本当に通った一回の時間は作れない。"
        },
        {
          "speaker": "amane",
          "text": "おじいちゃんの時計と同じ新品を作れても、それは、おじいちゃんが毎朝巻いた時計にはならない。"
        },
        {
          "speaker": "lou",
          "text": "同じ傷の基板は再現できる。でも、送り先へ流れて保存されなかった測定値は戻せない。可能な過去と、実際の一つは別なんだ。"
        },
        {
          "speaker": "mizuha",
          "text": "あり得た過去はいくつも作れても、証拠がなければ、どれが本当に起きた過去かは分からないのですわね。"
        },
        {
          "speaker": "sakuya",
          "text": "簡単に言うと？"
        },
        {
          "speaker": "amane",
          "text": "同じ物は作れても、この物の代わりは作れない。"
        },
        {
          "speaker": "lou",
          "text": "それ。"
        },
        {
          "speaker": "sakuya",
          "text": "今日探してるのは、失われた数値じゃない。何を感じて、どこへ渡そうとしたか。"
        },
        {
          "text": "新品の像が消え、発掘品だけが残る。筐体と、ケースに刻まれた設定メモから、機器ID、六十秒間隔、送信先、最初の文が現れた。"
        },
        {
          "text": "測定値そのものは、送信先へ流れたまま保存されていなかった。"
        },
        {
          "speaker": "amane",
          "text": "誰かが設置場所と測る項目を決め、その場所の変化を記録して、離れた誰かへ共有しようとしたんだ。"
        },
        {
          "speaker": "lou",
          "text": "ぼくらは、最初からこの循環を持っていたと思ってた。でも、ずっと前から、小さな感覚が何度も作られてたんだ。"
        }
      ]
    },
    {
      "id": "after-school-stars",
      "number": "03",
      "title": "星々の放課後",
      "backdrop": "shore",
      "steps": [
        {
          "text": "数百万の恒星系へ、異なる色と速さの光が広がる。一本の巨大な神経網ではない。"
        },
        {
          "speaker": "lou",
          "text": "これが感覚圏。人間、海、森、機械が、互いの変化を自分事として感じ、応答する。一本の系譜じゃない。途絶えた計画、各地の再発明、人間以外が独自に着いた例もある。"
        },
        {
          "speaker": "amane",
          "text": "この一台から全部が始まったわけじゃないよ。"
        },
        {
          "speaker": "sakuya",
          "text": "技術が直伝されたわけじゃない。でも遠くの変化を自分事として知る発想は、何度も生まれ直した。"
        },
        {
          "speaker": "lou",
          "text": "祖先、と呼ぶのは正確じゃない。それでも、ずっと昔に誰かが遠くを感じようとした痕跡が、これほど似ている。"
        },
        {
          "speaker": "amane",
          "text": "遠い親戚くらいじゃない？"
        },
        {
          "text": "未来の夜の浜辺。発光する波が接触身体の足を洗い、銀河団が海面を鮮烈に照らしていた。"
        },
        {
          "speaker": "lou",
          "text": "次は、この頃の海を感じてみたい。"
        },
        {
          "speaker": "amane",
          "text": "ESP32一台じゃ、すぐ塩で壊れるよ。"
        },
        {
          "speaker": "mizuha",
          "text": "でしたら、置く場所と条件を決めませんと。"
        },
        {
          "speaker": "sakuya",
          "text": "まず一台。そこから、隣の場所へ。"
        },
        {
          "speaker": "visitor",
          "text": "うん。次に感じてみたい場所へ持っていこう。"
        },
        {
          "text": "視界は海岸から地球、太陽系、無数の恒星へ広がる。それぞれの世界が、それぞれの時間と感覚のまま変化している光だ。"
        },
        {
          "text": "ルウは基板を抱き、星々へ問う。『次はどこを感じたい？』"
        },
        {
          "text": "返事が灯る。放課後は終わらない。"
        }
      ]
    }
  ],
  "finale": {
    "label": "星々の放課後",
    "title": "NOVACENE",
    "readout": [
      "DÆM UL: ESHA·GEMA",
      "IVARA KERA: K 2.700",
      "SÆL·ORAI: 2,641,903 NETH",
      "ESHA SÆL·TIR: KAR·EN",
      "NÆI MIR: REA·AI"
    ]
  }
};
  globalThis.GAIA_TRUE_END_STORY = Object.freeze({
    ...source,
    language: Object.freeze(source.language),
    scenes: Object.freeze(source.scenes.map(freezeScene)),
    finale: Object.freeze({
      ...source.finale,
      readout: Object.freeze(source.finale.readout),
    }),
  });
})();
