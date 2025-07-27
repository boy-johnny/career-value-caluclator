"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 定义语言类型
export type Language = "zh" | "en" | "ja";

// 创建上下文接口
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// 创建默认上下文
const defaultContext: LanguageContextType = {
  language: "zh",
  setLanguage: () => {},
  t: (key: string) => key,
};

// 创建上下文
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// 国家名称映射
export const countryNames: Record<Language, Record<string, string>> = {
  zh: {
    AF: "阿富汗",
    AO: "安哥拉",
    AL: "阿尔巴尼亚",
    AR: "阿根廷",
    AM: "亚美尼亚",
    AG: "安提瓜和巴布达",
    AU: "澳大利亚",
    AT: "奥地利",
    AZ: "阿塞拜疆",
    BI: "布隆迪",
    BE: "比利时",
    BJ: "贝宁",
    BF: "布基纳法索",
    BD: "孟加拉国",
    BG: "保加利亚",
    BH: "巴林",
    BS: "巴哈马",
    BA: "波斯尼亚和黑塞哥维那",
    BY: "白俄罗斯",
    BZ: "伯利兹",
    BO: "玻利维亚",
    BR: "巴西",
    BB: "巴巴多斯",
    BN: "文莱达鲁萨兰国",
    BT: "不丹",
    BW: "博茨瓦纳",
    CF: "中非共和国",
    CA: "加拿大",
    CH: "瑞士",
    CL: "智利",
    CN: "中国",
    CI: "科特迪瓦",
    CM: "喀麦隆",
    CD: "刚果（金）",
    CG: "刚果（布）",
    CO: "哥伦比亚",
    KM: "科摩罗",
    CV: "佛得角",
    CR: "哥斯达黎加",
    CY: "塞浦路斯",
    CZ: "捷克共和国",
    DE: "德国",
    DJ: "吉布提",
    DM: "多米尼克",
    DK: "丹麦",
    DO: "多米尼加共和国",
    DZ: "阿尔及利亚",
    EC: "厄瓜多尔",
    EG: "阿拉伯埃及共和国",
    ES: "西班牙",
    EE: "爱沙尼亚",
    ET: "埃塞俄比亚",
    FI: "芬兰",
    FJ: "斐济",
    FR: "法国",
    GA: "加蓬",
    GB: "英国",
    GE: "格鲁吉亚",
    GH: "加纳",
    GN: "几内亚",
    GM: "冈比亚",
    GW: "几内亚比绍共和国",
    GQ: "赤道几内亚",
    GR: "希腊",
    GD: "格林纳达",
    GT: "危地马拉",
    GY: "圭亚那",
    HK: "香港特别行政区",
    HN: "洪都拉斯",
    HR: "克罗地亚",
    HT: "海地",
    HU: "匈牙利",
    ID: "印度尼西亚",
    IN: "印度",
    IE: "爱尔兰",
    IR: "伊朗伊斯兰共和国",
    IQ: "伊拉克",
    IS: "冰岛",
    IL: "以色列",
    IT: "意大利",
    JM: "牙买加",
    JO: "约旦",
    JP: "日本",
    KZ: "哈萨克斯坦",
    KE: "肯尼亚",
    KG: "吉尔吉斯斯坦",
    KH: "柬埔寨",
    KI: "基里巴斯",
    KN: "圣基茨和尼维斯",
    KR: "大韩民国",
    LA: "老挝",
    LB: "黎巴嫩",
    LR: "利比里亚",
    LY: "利比亚",
    LC: "圣卢西亚",
    LK: "斯里兰卡",
    LS: "莱索托",
    LT: "立陶宛",
    LU: "卢森堡",
    LV: "拉脱维亚",
    MO: "中国澳门特别行政区",
    MA: "摩洛哥",
    MD: "摩尔多瓦",
    MG: "马达加斯加",
    MV: "马尔代夫",
    MX: "墨西哥",
    MK: "北马其顿",
    ML: "马里",
    MT: "马耳他",
    MM: "缅甸",
    ME: "黑山",
    MN: "蒙古",
    MZ: "莫桑比克",
    MR: "毛里塔尼亚",
    MU: "毛里求斯",
    MW: "马拉维",
    MY: "马来西亚",
    NA: "纳米比亚",
    NE: "尼日尔",
    NG: "尼日利亚",
    NI: "尼加拉瓜",
    NL: "荷兰",
    NO: "挪威",
    NP: "尼泊尔",
    NZ: "新西兰",
    PK: "巴基斯坦",
    PA: "巴拿马",
    PE: "秘鲁",
    PH: "菲律宾",
    PG: "巴布亚新几内亚",
    PL: "波兰",
    PR: "波多黎各",
    PT: "葡萄牙",
    PY: "巴拉圭",
    PS: "约旦河西岸和加沙",
    QA: "卡塔尔",
    RO: "罗马尼亚",
    RU: "俄罗斯联邦",
    RW: "卢旺达",
    SA: "沙特阿拉伯",
    SD: "苏丹",
    SN: "塞内加尔",
    SG: "新加坡",
    SB: "所罗门群岛",
    SL: "塞拉利昂",
    SV: "萨尔瓦多",
    SO: "索马里",
    RS: "塞尔维亚",
    ST: "圣多美和普林西比",
    SR: "苏里南",
    SK: "斯洛伐克共和国",
    SI: "斯洛文尼亚",
    SE: "瑞典",
    SZ: "斯威士兰",
    SC: "塞舌尔",
    TC: "特克斯科斯群岛",
    TD: "乍得",
    TG: "多哥",
    TH: "泰国",
    TJ: "塔吉克斯坦",
    TL: "东帝汶",
    TT: "特立尼达和多巴哥",
    TN: "突尼斯",
    TR: "土耳其",
    TV: "图瓦卢",
    TW: "台湾",
    TZ: "坦桑尼亚",
    UG: "乌干达",
    UA: "乌克兰",
    UY: "乌拉圭",
    US: "美国",
    UZ: "乌兹别克斯坦",
    VC: "圣文森特和格林纳丁斯",
    VN: "越南",
    VU: "瓦努阿图",
    XK: "科索沃",
    ZA: "南非",
    ZM: "赞比亚",
    ZW: "津巴布韦",
  },
  en: {
    AF: "Afghanistan",
    AO: "Angola",
    AL: "Albania",
    AR: "Argentina",
    AM: "Armenia",
    AG: "Antigua and Barbuda",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BI: "Burundi",
    BE: "Belgium",
    BJ: "Benin",
    BF: "Burkina Faso",
    BD: "Bangladesh",
    BG: "Bulgaria",
    BH: "Bahrain",
    BS: "Bahamas",
    BA: "Bosnia and Herzegovina",
    BY: "Belarus",
    BZ: "Belize",
    BO: "Bolivia",
    BR: "Brazil",
    BB: "Barbados",
    BN: "Brunei Darussalam",
    BT: "Bhutan",
    BW: "Botswana",
    CF: "Central African Republic",
    CA: "Canada",
    CH: "Switzerland",
    CL: "Chile",
    CN: "China",
    CI: "Côte d'Ivoire",
    CM: "Cameroon",
    CD: "Congo (DRC)",
    CG: "Congo (Republic)",
    CO: "Colombia",
    KM: "Comoros",
    CV: "Cape Verde",
    CR: "Costa Rica",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DE: "Germany",
    DJ: "Djibouti",
    DM: "Dominica",
    DK: "Denmark",
    DO: "Dominican Republic",
    DZ: "Algeria",
    EC: "Ecuador",
    EG: "Egypt",
    ES: "Spain",
    EE: "Estonia",
    ET: "Ethiopia",
    FI: "Finland",
    FJ: "Fiji",
    FR: "France",
    GA: "Gabon",
    GB: "United Kingdom",
    GE: "Georgia",
    GH: "Ghana",
    GN: "Guinea",
    GM: "Gambia",
    GW: "Guinea-Bissau",
    GQ: "Equatorial Guinea",
    GR: "Greece",
    GD: "Grenada",
    GT: "Guatemala",
    GY: "Guyana",
    HK: "Hong Kong SAR",
    HN: "Honduras",
    HR: "Croatia",
    HT: "Haiti",
    HU: "Hungary",
    ID: "Indonesia",
    IN: "India",
    IE: "Ireland",
    IR: "Iran",
    IQ: "Iraq",
    IS: "Iceland",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JO: "Jordan",
    JP: "Japan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KG: "Kyrgyzstan",
    KH: "Cambodia",
    KI: "Kiribati",
    KN: "St. Kitts and Nevis",
    KR: "South Korea",
    LA: "Laos",
    LB: "Lebanon",
    LR: "Liberia",
    LY: "Libya",
    LC: "St. Lucia",
    LK: "Sri Lanka",
    LS: "Lesotho",
    LT: "Lithuania",
    LU: "Luxembourg",
    LV: "Latvia",
    MO: "Macao SAR",
    MA: "Morocco",
    MD: "Moldova",
    MG: "Madagascar",
    MV: "Maldives",
    MX: "Mexico",
    MK: "North Macedonia",
    ML: "Mali",
    MT: "Malta",
    MM: "Myanmar",
    ME: "Montenegro",
    MN: "Mongolia",
    MZ: "Mozambique",
    MR: "Mauritania",
    MU: "Mauritius",
    MW: "Malawi",
    MY: "Malaysia",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    NI: "Nicaragua",
    NL: "Netherlands",
    NO: "Norway",
    NP: "Nepal",
    NZ: "New Zealand",
    PK: "Pakistan",
    PA: "Panama",
    PE: "Peru",
    PH: "Philippines",
    PG: "Papua New Guinea",
    PL: "Poland",
    PR: "Puerto Rico",
    PT: "Portugal",
    PY: "Paraguay",
    PS: "West Bank and Gaza",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    RW: "Rwanda",
    SA: "Saudi Arabia",
    SD: "Sudan",
    SN: "Senegal",
    SG: "Singapore",
    SB: "Solomon Islands",
    SL: "Sierra Leone",
    SV: "El Salvador",
    SO: "Somalia",
    RS: "Serbia",
    ST: "São Tomé and Principe",
    SR: "Suriname",
    SK: "Slovak Republic",
    SI: "Slovenia",
    SE: "Sweden",
    SZ: "Eswatini",
    SC: "Seychelles",
    TC: "Turks and Caicos Islands",
    TD: "Chad",
    TG: "Togo",
    TH: "Thailand",
    TJ: "Tajikistan",
    TL: "Timor-Leste",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TV: "Tuvalu",
    TW: "Taiwan",
    TZ: "Tanzania",
    UG: "Uganda",
    UA: "Ukraine",
    UY: "Uruguay",
    US: "United States",
    UZ: "Uzbekistan",
    VC: "St. Vincent and the Grenadines",
    VN: "Vietnam",
    VU: "Vanuatu",
    XK: "Kosovo",
    ZA: "South Africa",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  },
  ja: {
    AF: "アフガニスタン",
    AL: "アルバニア",
    DZ: "アルジェリア",
    AO: "アンゴラ",
    AR: "アルゼンチン",
    AM: "アルメニア",
    AU: "オーストラリア",
    AT: "オーストリア",
    AZ: "アゼルバイジャン",
    BI: "ブルンジ",
    BE: "ベルギー",
    BJ: "ベナン",
    BF: "ブルキナファソ",
    BD: "バングラデシュ",
    BG: "ブルガリア",
    BH: "バーレーン",
    BS: "バハマ",
    BA: "ボスニア・ヘルツェゴビナ",
    BY: "ベラルーシ",
    BZ: "ベリーズ",
    BO: "ボリビア",
    BR: "ブラジル",
    BB: "バルバドス",
    BN: "ブルネイ",
    BT: "ブータン",
    BW: "ボツワナ",
    CF: "中央アフリカ共和国",
    CA: "カナダ",
    CH: "スイス",
    CL: "チリ",
    CN: "中国",
    CI: "コートジボワール",
    CM: "カメルーン",
    CD: "コンゴ民主共和国",
    CG: "コンゴ共和国",
    CO: "コロンビア",
    KM: "コモロ",
    CV: "カーボベルデ",
    CR: "コスタリカ",
    CY: "キプロス",
    CZ: "チェコ共和国",
    DE: "ドイツ",
    DJ: "ジブチ",
    DM: "ドミニカ国",
    DK: "デンマーク",
    DO: "ドミニカ共和国",
    EC: "エクアドル",
    EG: "エジプト",
    ES: "スペイン",
    EE: "エストニア",
    ET: "エチオピア",
    FI: "フィンランド",
    FJ: "フィジー",
    FR: "フランス",
    GA: "ガボン",
    GB: "イギリス",
    GE: "ジョージア",
    GH: "ガーナ",
    GN: "ギニア",
    GM: "ガンビア",
    GW: "ギニアビサウ",
    GQ: "赤道ギニア",
    GR: "ギリシャ",
    GD: "グレナダ",
    GT: "グアテマラ",
    GY: "ガイアナ",
    HK: "香港特別行政区",
    HN: "ホンジュラス",
    HR: "クロアチア",
    HT: "ハイチ",
    HU: "ハンガリー",
    ID: "インドネシア",
    IN: "インド",
    IE: "アイルランド",
    IR: "イラン",
    IQ: "イラク",
    IS: "アイスランド",
    IL: "イスラエル",
    IT: "イタリア",
    JM: "ジャマイカ",
    JO: "ヨルダン",
    JP: "日本",
    KZ: "カザフスタン",
    KE: "ケニア",
    KG: "キルギス",
    KH: "カンボジア",
    KI: "キリバス",
    KN: "セントクリストファー・ネイビス",
    KR: "韓国",
    LA: "ラオス",
    LB: "レバノン",
    LR: "リベリア",
    LY: "リビア",
    LC: "セントルシア",
    LK: "スリランカ",
    LS: "レソト",
    LT: "リトアニア",
    LU: "ルクセンブルク",
    LV: "ラトビア",
    MO: "マカオ特別行政区",
    MA: "モロッコ",
    MD: "モルドバ",
    MG: "マダガスカル",
    MV: "モルディブ",
    MX: "メキシコ",
    MK: "北マケドニア",
    ML: "マリ",
    MT: "マルタ",
    MM: "ミャンマー",
    ME: "モンテネグロ",
    MN: "モンゴル",
    MZ: "モザンビーク",
    MR: "モーリタニア",
    MU: "モーリシャス",
    MW: "マラウイ",
    MY: "マレーシア",
    NA: "ナミビア",
    NE: "ニジェール",
    NG: "ナイジェリア",
    NI: "ニカラグア",
    NL: "オランダ",
    NO: "ノルウェー",
    NP: "ネパール",
    NZ: "ニュージーランド",
    PK: "パキスタン",
    PA: "パナマ",
    PE: "ペルー",
    PH: "フィリピン",
    PG: "パプアニューギニア",
    PL: "ポーランド",
    PR: "プエルトリコ",
    PT: "ポルトガル",
    PY: "パラグアイ",
    PS: "パレスチナ",
    QA: "カタール",
    RO: "ルーマニア",
    RU: "ロシア",
    RW: "ルワンダ",
    SA: "サウジアラビア",
    SD: "スーダン",
    SN: "セネガル",
    SG: "シンガポール",
    SB: "ソロモン諸島",
    SL: "シエラレオネ",
    SV: "エルサルバドル",
    SO: "ソマリア",
    RS: "セルビア",
    ST: "サントメ・プリンシペ",
    SR: "スリナム",
    SK: "スロバキア",
    SI: "スロベジア",
    SE: "スウェーデン",
    SZ: "エスワティニ",
    SC: "セーシェル",
    TC: "タークス・カイコス諸島",
    TD: "チャド",
    TG: "トーゴ",
    TH: "タイ",
    TJ: "タジキスタン",
    TL: "東ティモール",
    TT: "トリニダード・トバゴ",
    TN: "チュニジア",
    TR: "トルコ",
    TV: "ツバル",
    TW: "台湾",
    TZ: "タンザニア",
    UG: "ウガンダ",
    UA: "ウクライナ",
    UY: "ウルグアイ",
    US: "アメリカ合衆国",
    UZ: "ウズベキスタン",
    VC: "セントビンセント・グレナディーン",
    VN: "ベトナム",
    VU: "バヌアツ",
    XK: "コソボ",
    ZA: "南アフリカ",
    ZM: "ザンビア",
    ZW: "ジンバブエ",
  },
};

// 翻译数据
const translations: Record<Language, Record<string, string>> = {
  zh: {
    // 标题和导航
    title: "這b班上得值不值·測算版",
    github: "GitHub",
    email: "Email",
    xiaohongshu: "小紅書",
    redirect_notice: "已自動跳轉，新網址無需科學上網",
    visits: "訪問量",
    visitors: "訪客數",
    star_request: "如果覺得好用，請給專案點個⭐Star吧！",
    history: "歷史記錄",
    no_history: "暫無歷史記錄",
    history_notice: "查看報告後將自動保存",
    delete_history: "刪除",
    clear_all: "清空全部",
    restore_history: "恢復此記錄",

    // 表單標籤
    annual_salary_cny: "年薪總包（元）",
    annual_salary_foreign: "年薪總包（當地貨幣）",
    annual_salary: "年薪總包",
    salary_placeholder_cny: "稅前年薪",
    salary_placeholder_foreign: "使用當地貨幣",
    salary_placeholder: "稅前年薪",
    non_china_salary: "非中國地區薪資",
    ppp_factor: "購買力平價(PPP)轉換因子",
    ppp_tooltip:
      "PPP轉換因子是將各國貨幣購買力標準化的指標。例如中國為4.19，表示1美元在美國的購買力等同於4.19元人民幣在中國的購買力。",
    ppp_placeholder: "請輸入購買力平價轉換因子",
    ppp_common_regions:
      "常見地區：中國大陸:4.19，日本:102.59，美國:1.00，新加坡:0.84",
    view_more: "查看更多",
    country_selection: "工作國家/地區",
    selected_ppp: "當前PPP值",
    work_days_per_week: "每週工作天數/d",
    wfh_days_per_week: "週WFH天數/d",
    wfh_tooltip:
      "WFH指居家辦公(Work From Home)，這裡填寫的是前面工作天數中有多少天是在家辦公的。",
    annual_leave: "年假天數/d",
    public_holidays: "法定假日/d",
    paid_sick_leave: "帶薪病假/d",
    work_hours: "總工時/h",
    work_hours_tooltip:
      "工時：是指「下班時間-上班時間」的總時間，包括吃飯、午休、加班等（不含通勤）。",
    commute_hours: "通勤/h",
    commute_tooltip:
      "通勤時長是指上下班往返的總時間，即家到公司和公司回家的時間總和。",
    rest_time: "休息&摸魚/h",

    // 環境係數
    job_stability: "職業穩定度",
    job_government: "政府/事業單位",
    job_state: "國企/大型企業",
    job_private: "私企/狼性文化",
    job_foreign: "外企/守法企業",
    job_dispatch: "勞務派遣/OD",
    job_freelance: "自由職業",
    work_environment: "工作環境",
    env_remote: "偏僻的工廠/工地/戶外",
    env_factory: "工廠/工地/戶外",
    env_normal: "普通環境",
    env_cbd: "CBD",
    city_factor: "所在城市（按生活成本選擇）",
    city_tier1: "一線城市",
    city_newtier1: "新一線",
    city_tier2: "二線城市",
    city_tier3: "三線城市",
    city_tier4: "四線城市",
    city_county: "縣城",
    city_town: "鄉鎮",
    hometown: "是否在家鄉工作",
    not_hometown: "不在家鄉",
    is_hometown: "在家鄉",
    leadership: "領導/老闆",
    leader_bad: "對我不爽",
    leader_strict: "管理嚴格",
    leader_normal: "中規中矩",
    leader_good: "善解人意",
    leader_favorite: "我是嫡系",
    teamwork: "同事環境",
    team_bad: "都是傻逼",
    team_normal: "萍水相逢",
    team_good: "和和睦睦",
    team_excellent: "私交甚好",
    shuttle: "班車服務（加分項）",
    shuttle_none: "無法抵達",
    shuttle_inconvenient: "班車不便",
    shuttle_convenient: "便利班車",
    shuttle_direct: "班車直達",
    canteen: "食堂情況（加分項）",
    canteen_none: "很難吃",
    canteen_average: "食堂一般",
    canteen_good: "食堂不錯",
    canteen_excellent: "食堂超讚",

    // 教育和工作經驗
    education_level: "個人學歷水平",
    degree_type: "學位類型",
    below_bachelor: "專科及以下",
    bachelor: "本科",
    masters: "碩士",
    phd: "博士",
    school_type: "學校類型",
    school_second_tier: "二本三本",
    school_first_tier_bachelor: "雙非/ QS200/ USnews80",
    school_elite_bachelor: "985211/ QS50/ USnews30",
    school_first_tier_higher: "雙非/ QS100/ USnews50",
    school_elite_higher: "985211/ QS30/ USnews20",
    bachelor_background: "本科背景",
    work_years: "工作年限",
    fresh_graduate: "應屆生",
    years_1_3: "1-3年",
    years_3_5: "3-5年",
    years_5_8: "5-8年",
    years_8_10: "8-10年",
    years_10_12: "10-12年",
    years_above_12: "12年以上",

    // 結果
    working_days_per_year: "年工作天數",
    days_unit: "天",
    average_daily_salary: "平均日薪",
    job_value: "工作性價比",
    view_report: "查看我的工作性價比報告",

    // ShareCard組件
    share_back_to_calculator: "返回計算器",
    share_your_job_worth_report: "你的工作性價比報告",
    share_job_worth_report: "工作性價比報告",
    share_custom_made: "由「這b班上得值不值·測算版」精心定制",
    share_generating: "生成中...",
    share_download_report: "下載報告",
    share_basic_info: "基礎資訊",
    share_work_city: "工作城市",
    share_is_hometown: "是否家鄉",
    share_yes: "是",
    share_no: "否",
    share_daily_salary: "日薪",
    share_day: "天",
    share_days: "天",
    share_work_hours_title: "工作時間",
    share_hours: "小時",
    share_daily_work_hours: "每天工作",
    share_daily_commute_hours: "每天通勤",
    share_rest_time: "午休與休息",
    share_weekly_work_days: "每週工作天數",
    share_remote_work: "遠端辦公",
    share_days_per_week: "天/週",
    share_shuttle_service: "班車服務",
    share_annual_leave: "年假",
    share_paid_sick_leave: "帶薪病假",
    share_days_per_year: "天/年",
    share_work_environment_title: "工作環境",
    share_office_environment: "辦公環境",
    share_leadership_relation: "領導關係",
    share_colleague_relationship: "同事關係",
    share_canteen_quality: "食堂情況",
    share_education_and_experience: "教育與工作經驗",
    share_highest_degree: "最高學歷",
    share_school_type_label: "學校類型",
    share_work_years_label: "工作年限",
    share_contract_type_label: "（穩定度）",
    share_final_assessment: "最終評估",
    share_low_value_assessment_1:
      "這份工作對你來說簡直是一場惡夢，每一天都是艱難的挑戰。",
    share_low_value_assessment_2:
      "這份工作讓你疲憊不堪，但或許是通往更好未來的必經之路。",
    share_medium_value_assessment_1:
      "這份工作平平淡淡，既沒有太多驚喜，也沒有太多失望。",
    share_medium_value_assessment_2:
      "這份工作給你帶來了不少成就感，是一份令人滿意的選擇。",
    share_high_value_assessment_1:
      "這份工作幾乎滿足了你的所有期望，每天都充滿幹勁。",
    share_high_value_assessment_2:
      "這份工作簡直是為你量身定做的，既有挑戰又有回報，令你心滿意足。",
    share_high_value_assessment_3:
      "恭喜你找到了人生中的理想工作，這樣的機會可遇不可求！",
    share_working_days_per_year: "年工作天數",

    share_hometown_comment:
      "在家鄉工作，讓你既能追求事業，又能照顧家人，平衡感滿滿。家的溫暖和熟悉的環境給你帶來額外的安全感和幸福感。",
    share_not_hometown_comment:
      "要照顧好自己，按時吃飯休息，你一個人去得那麼遠。",
    share_tier1andnewtier1_city_comment:
      "雖然生活成本較高，但豐富的機會和廣闊的平台能夠助你更快成長。",
    share_tier2and3_city_comment:
      "生活節奏雖然沒有一線城市那麼快，但依然提供了不錯的發展空間。這裡的生活壓力適中，讓你能找到工作與生活之間的平衡。",
    share_tier4andbelow_city_comment:
      "你享受著低成本高品質的生活。雖然機會相對較少，但悠閒的生活節奏和較低的壓力讓你能更從容地面對人生。",

    share_commute_short:
      "你的通勤時間很短，讓你每天都能多出寶貴的時間用於自我提升或休息。",
    share_commute_medium:
      "你的通勤時間適中，不會讓你感到太大壓力，也可以利用這段時間聽書或補覺。",
    share_commute_long:
      "你長時間的通勤佔用了大量寶貴時間，會對身心健康造成一定影響，建議考慮搬家或換工作以改善。",
    share_wfh_high:
      "而且你有大量居家辦公的機會，進一步減輕了通勤負擔，提高了工作生活品質。",
    share_wfh_medium: "你的部分居家辦公安排也為你節省了不少通勤時間。",
    share_shuttle_service_good:
      "公司提供的便利班車服務是一個不小的福利，讓你的通勤更輕鬆愉快。",

    share_cbd_environment:
      "在CBD的辦公環境既專業又現代化，提供了良好的職業形象和便利的工作條件。",
    share_factory_environment:
      "在工廠/戶外環境工作確實有些挑戰，但也培養了你的堅韌品質和適應能力。",
    share_normal_environment:
      "你的工作環境舒適適中，能滿足基本需求，為高效工作提供了足夠的保障。",
    share_leadership_excellent:
      "你享受著作為嫡系的優越待遇和發展機會，但也面臨著更高的期望和責任。",
    share_leadership_good:
      "你的領導能夠理解你的工作狀態並提供必要的支持，這在職場中非常難得。",
    share_leadership_normal: "你和領導各司其職，這種關係雖然普通但穩定可靠。",
    share_leadership_strict:
      "你領導的管理風格較為嚴格，這種嚴格雖然有時讓人壓力大，但也能促使你更加專業和自律。",
    share_leadership_bad:
      "你與領導之間的關係有些緊張，這種情況下要學會保持情緒穩定，專注於工作本身，同時提升自己的溝通技巧。",
    share_teamwork_excellent:
      "你與同事們建立了深厚的私人友誼，工作之餘還能互相支持和陪伴，這種關係讓職場生活更加充實和有意義。",
    share_teamwork_good:
      "團隊氛圍和諧友善，同事之間相互尊重和支持，這種積極的人際環境讓工作過程更加愉快和高效。",
    share_teamwork_normal:
      "與同事們相處和平但不過分親近，這種關係模式適合專注於工作的職場人士。",
    share_teamwork_bad:
      "同事關係略顯緊張，這種環境雖然不太舒適，但也鍛鍊了你的獨立工作能力和心理承受力。",

    share_workhours_balanced:
      "你的工作強度適中，有足夠的時間照顧個人生活，保持著良好的工作生活平衡。",
    share_workhours_long:
      "你的工作時間略長，但仍在可接受範圍內。注意合理安排休息時間，避免長期疲勞。",
    share_workhours_excessive:
      "你的工作時間過長，長期如此可能影響健康和生活品質。建議尋找方法提高效率或與上級商量調整工作安排。",
    share_rest_adequate:
      "你有充足的休息和午休時間，這有助於恢復精力，提高下午的工作效率。",
    share_rest_insufficient:
      "你的休息時間較少，記得定期起身活動，防止久坐帶來的健康問題。",
    share_leave_abundant:
      "豐富的年假讓你有充分的時間休整和旅行，這對維持長期工作動力非常重要。",
    share_leave_limited:
      "你的年假較少，可以考慮更有效地規劃和利用這些寶貴的休假時間。",

    share_phd_comment:
      "博士學歷是你職場的一張重要名片，為你打開了許多高端研究和專業崗位的大門。",
    share_masters_comment:
      "碩士學歷在當今就業市場仍有一定優勢，證明了你的學習能力和專業素養。",
    share_bachelor_comment:
      "本科學歷為你的職業生涯奠定了堅實基礎，結合實際經驗，你能在各個領域找到發展機會。",
    share_below_bachelor_comment:
      "專科及以下學歷雖然在某些領域可能面臨挑戰，但實踐經驗和專業技能同樣能幫你贏得認可。",
    share_fresh_graduate_comment:
      "作為應屆生，你充滿朝氣和學習熱情，有無限的可能性去探索和成長。",
    share_experienced_comment:
      "多年的工作經驗是你最寶貴的財富，讓你在職場中更加從容和自信。",
    share_mid_career_comment:
      "幾年的工作經驗讓你更加了解行業和自己的優勢，職業發展正處於上升期。",
    share_government_job_comment:
      "體制內的工作穩定性高，讓你無需過多擔憂失業風險，可以更從容地規劃未來。",
    share_private_job_comment:
      "私企的工作雖然有一定風險，但也提供了更多成長和收入提升的機會。",
    share_dispatch_job_comment:
      "勞務派遣的工作靈活度高，但穩定性較低。在享受短期便利的同時，應積極規劃長遠職業發展路徑。",
    share_freelance_job_comment:
      "自由職業提供了極高的靈活性和自主性，但也伴隨著收入不穩定和福利缺失的風險。需要具備較強的自我管理和市場開拓能力。",

    share_salary_high_cny:
      "你的日薪處於較高水準，財務狀況良好，能夠滿足日常生活和一定的休閒娛樂需求。",
    share_salary_medium_cny:
      "你的日薪處於中等水準，足以應對基本生活需求，但可能需要更細緻的預算規劃。",
    share_salary_low_cny:
      "你的日薪較低，可能需要精打細算來管理財務，同時尋找提升收入的機會。",
    share_salary_high_foreign:
      "你的日薪處於較高水準，財務狀況良好，能夠滿足日常生活和一定的休閒娛樂需求。",
    share_salary_medium_foreign:
      "你的日薪處於中等水準，足以應對基本生活需求，但可能需要更細緻的預算規劃。",
    share_salary_low_foreign:
      "你的日薪較低，可能需要精打細算來管理財務，同時尋找提升收入的機會。",
    share_high_cost_city:
      "在高生活成本的城市，你的薪資需要更精明地管理才能達到理想的生活品質。",
    share_low_cost_city:
      "在低生活成本的地區，你的薪資能夠帶來更高的生活品質和更多的儲蓄機會。",

    share_value_low:
      "雖然目前的工作性價比較低，但這可能是累積經驗的必經階段。記住每份工作都有其價值，努力汲取經驗，為下一步發展打好基礎。",
    share_value_medium:
      "你的工作性價比處於中等水準，有優點也有不足。可以專注於現有優勢，同時尋找提升不足方面的方法，讓工作體驗更加全面。",
    share_value_high:
      "恭喜你擁有高性價比的工作！這樣的機會難得，要珍惜現在的環境，繼續發揮自己的優勢，享受工作帶來的成就感和滿足感。",
    share_summary_advice: "綜合建議",

    // 評價
    rating_enter_salary: "請輸入年薪",
    rating_terrible: "慘絕人寰",
    rating_poor: "略慘",
    rating_average: "一般",
    rating_good: "還不錯",
    rating_great: "很爽",
    rating_excellent: "爽到爆炸",
    rating_perfect: "人生巔峰",
    share_country: "工作國家/地區",
  },
  en: {
    // Title and navigation
    title: "Is My Job Worth the Grind?",
    github: "GitHub",
    email: "Email",
    xiaohongshu: "Rednote",
    redirect_notice: "Automatically redirected, no VPN needed",
    visits: "Visits",
    visitors: "Visitors",
    star_request: "If you find this tool helpful, please give it a ⭐Star!",
    history: "History",
    no_history: "No history records",
    history_notice: "Records will be saved after viewing reports",
    delete_history: "Delete",
    clear_all: "Clear All",
    restore_history: "Restore this record",

    // Form labels
    annual_salary_cny: "Annual Salary (CNY)",
    annual_salary_foreign: "Annual Salary (Local Currency)",
    annual_salary: "Annual Salary",
    salary_placeholder_cny: "Pre-tax annual salary",
    salary_placeholder_foreign: "Use local currency",
    salary_placeholder: "Pre-tax annual salary",
    non_china_salary: "Non-China Salary",
    ppp_factor: "Purchasing Power Parity Factor",
    ppp_tooltip:
      "PPP factor standardizes purchasing power across countries. For example, China's 4.19 means that 1 USD in US has the same purchasing power as 4.19 CNY in China.",
    ppp_placeholder: "Enter PPP conversion factor",
    ppp_common_regions:
      "Common regions: China:4.19, Japan:102.59, US:1.00, Singapore:0.84",
    view_more: "View more",
    country_selection: "Work Country/Region",
    selected_ppp: "Current PPP value",
    work_days_per_week: "Workdays/week",
    wfh_days_per_week: "WFH days/week",
    wfh_tooltip:
      "WFH means Work From Home. Enter how many of your weekly workdays are spent working from home.",
    annual_leave: "Annual leave /d",
    public_holidays: "Public holidays",
    paid_sick_leave: "Paid sick days",
    work_hours: "Work hours /h",
    work_hours_tooltip:
      "Work hours: total time from start to end of workday, including meals, breaks, and overtime (excluding commute).",
    commute_hours: "Commute hours",
    commute_tooltip:
      "Commute time refers to the total round-trip time between home and office.",
    rest_time: "Breaks & slacking/h",

    // Environment factors
    job_stability: "Job Stability",
    job_government: "Government Position",
    job_state: "State-owned/Large Corp",
    job_foreign: "Foreign Company",
    job_private: "Private Company",
    job_dispatch: "Temp Agency Worker",
    job_freelance: "Freelancer",
    work_environment: "Work Environment",
    env_remote: "Remote Factory/ Site/ Outdoor",
    env_factory: "Factory/ Site/ Outdoor",
    env_normal: "Standard Office",
    env_cbd: "CBD Office",
    city_factor: "City (by Cost of Living)",
    city_tier1: "Major Metropolis",
    city_newtier1: "Emerging Major City",
    city_tier2: "Regional Center",
    city_tier3: "Medium-sized City",
    city_tier4: "Small City",
    city_county: "County",
    city_town: "Township",
    hometown: "Working in Hometown?",
    not_hometown: "Not Hometown",
    is_hometown: "In Hometown",
    leadership: "Manager/Boss",
    leader_bad: "Difficult Relationship",
    leader_strict: "Strict Management",
    leader_normal: "Professional & Neutral",
    leader_good: "Supportive Leadership",
    leader_favorite: "Inner Circle Member",
    teamwork: "Team Environment",
    team_bad: "Toxic Environment",
    team_normal: "Professional Colleagues",
    team_good: "Collaborative Team",
    team_excellent: "Close-knit Team",
    shuttle: "Shuttle Service (Bonus)",
    shuttle_none: "Inaccessible",
    shuttle_inconvenient: "Inconvenient Shuttle",
    shuttle_convenient: "Convenient Shuttle",
    shuttle_direct: "Direct Route Shuttle",
    canteen: "Canteen Quality (Bonus)",
    canteen_none: "Terrible Food",
    canteen_average: "Average Quality",
    canteen_good: "Good Quality",
    canteen_excellent: "Excellent Quality",

    // Education and work experience
    education_level: "Education Level",
    degree_type: "Degree Type",
    below_bachelor: "Below Bachelor's",
    bachelor: "Bachelor's",
    masters: "Master's",
    phd: "PhD",
    school_type: "University Type",
    school_second_tier: "Standard University",
    school_first_tier_bachelor: "Top University/QS200/USnews80",
    school_elite_bachelor: "Elite University/QS50/USnews30",
    school_first_tier_higher: "Top Grad School/QS100/USnews50",
    school_elite_higher: "Elite Grad School/QS30/USnews20",
    bachelor_background: "Bachelor Background",
    work_years: "Work Experience",
    fresh_graduate: "Fresh Graduate",
    years_1_3: "1-3 years",
    years_3_5: "3-5 years",
    years_5_8: "5-8 years",
    years_8_10: "8-10 years",
    years_10_12: "10-12 years",
    years_above_12: "12+ years",

    // Results
    working_days_per_year: "Working days/year",
    days_unit: "days",
    average_daily_salary: "Average daily salary",
    job_value: "Job Value Rating",
    view_report: "View my job worth report",

    // ShareCard Component
    share_back_to_calculator: "Back to Calculator",
    share_your_job_worth_report: "Your Job Worth Report",
    share_job_worth_report: "Job Worth Report",
    share_custom_made: 'Custom made by "Is My Job Worth It?"',
    share_generating: "Generating...",
    share_download_report: "Download Report",
    share_basic_info: "Basic Information",
    share_work_city: "Work City",
    share_is_hometown: "Hometown",
    share_yes: "Yes",
    share_no: "No",
    share_daily_salary: "Daily Salary",
    share_day: "day",
    share_days: "days",
    share_work_hours_title: "Work Hours",
    share_hours: "hours",
    share_daily_work_hours: "Daily Work",
    share_daily_commute_hours: "Daily Commute",
    share_rest_time: "Breaks & Rest",
    share_weekly_work_days: "Weekly Workdays",
    share_remote_work: "Remote Work",
    share_days_per_week: "days/week",
    share_shuttle_service: "Shuttle Service",
    share_annual_leave: "Annual Leave",
    share_paid_sick_leave: "Paid Sick Leave",
    share_days_per_year: "days/year",
    share_work_environment_title: "Work Environment",
    share_office_environment: "Office Environment",
    share_leadership_relation: "Leadership",
    share_colleague_relationship: "Colleague Relations",
    share_canteen_quality: "Canteen",
    share_education_and_experience: "Education & Experience",
    share_highest_degree: "Highest Degree",
    share_school_type_label: "School Type",
    share_work_years_label: "Work Years",
    share_contract_type_label: "Contract Type",
    share_final_assessment: "Final Assessment",
    share_low_value_assessment_1:
      "This job feels like a daily struggle, with challenges that outweigh the benefits.",
    share_low_value_assessment_2:
      "This job is quite demanding, but might be a stepping stone to better opportunities.",
    share_medium_value_assessment_1:
      "This job is balanced - not particularly exciting but stable and manageable.",
    share_medium_value_assessment_2:
      "This job offers good satisfaction and rewards that match your efforts.",
    share_high_value_assessment_1:
      "This job meets most of your expectations, providing meaningful work and fair compensation.",
    share_high_value_assessment_2:
      "This job seems tailor-made for you, offering both challenge and reward in perfect measure.",
    share_high_value_assessment_3:
      "You've found an exceptional job opportunity that offers extraordinary value and satisfaction!",
    share_working_days_per_year: "Working days/year",

    share_hometown_comment:
      "Working in your hometown allows you to build your career while maintaining family connections - a valuable balance that contributes to overall life satisfaction.",
    share_not_hometown_comment:
      "To take care of yourself, eat and rest on time, you're so far away by yourself.",
    share_tier1andnewtier1_city_comment:
      "While living costs are high in major metropolitan areas, the abundant opportunities and professional networks can accelerate your career growth.",
    share_tier2and3_city_comment:
      "These regional centers offer a good balance - decent career opportunities with more manageable living costs and work pressure compared to major cities.",
    share_tier4andbelow_city_comment:
      "You enjoy a good quality of life with lower living costs. While career opportunities may be more limited, the relaxed pace and lower pressure are significant advantages.",

    share_commute_short:
      "Your short commute time gives you more precious time each day for personal development or relaxation.",
    share_commute_medium:
      "Your moderate commute is manageable and can be used productively for reading or podcasts.",
    share_commute_long:
      "Your lengthy commute consumes significant time that affects work-life balance. Consider relocation or negotiating flexible arrangements if possible.",
    share_wfh_high:
      "Your substantial work-from-home arrangement significantly reduces commuting burden and improves quality of life.",
    share_wfh_medium:
      "Your partial work-from-home arrangement helps save valuable commuting time.",
    share_shuttle_service_good:
      "The company shuttle service is a valuable benefit that makes your commute more comfortable and stress-free.",

    share_cbd_environment:
      "The CBD office environment offers professional surroundings and convenient access to business services and networking opportunities.",
    share_factory_environment:
      "Working in an industrial or outdoor setting presents unique challenges but also develops resilience and practical problem-solving skills.",
    share_normal_environment:
      "Your work environment provides the standard amenities needed for productive work without unnecessary distractions.",
    share_leadership_excellent:
      "Being part of leadership's inner circle offers advantages in terms of opportunities and influence, though it comes with higher expectations.",
    share_leadership_good:
      "Your supportive leadership recognizes your contributions and provides the guidance needed for success - a valuable workplace asset.",
    share_leadership_normal:
      "Your professional relationship with leadership is straightforward and functional - clear expectations without unnecessary complications.",
    share_leadership_strict:
      "Working under strict management can be challenging but often develops discipline and attention to detail that serve you well professionally.",
    share_leadership_bad:
      "The tension with leadership creates challenges, requiring careful communication and focusing on deliverables rather than relationships.",
    share_teamwork_excellent:
      "The strong personal connections with colleagues creates a supportive network that enhances both work satisfaction and effectiveness.",
    share_teamwork_good:
      "Your collaborative team environment fosters mutual support and effective communication, making daily work more pleasant and productive.",
    share_teamwork_normal:
      "Maintaining professional but not overly personal relationships with colleagues allows you to focus on your work while having adequate support.",
    share_teamwork_bad:
      "The challenging team dynamics require adaptability and self-reliance, which can develop valuable independence and resilience.",

    share_workhours_balanced:
      "Your balanced work schedule allows sufficient time for personal life, contributing to sustainable long-term performance.",
    share_workhours_long:
      "Your extended work hours are manageable but require attention to maintaining energy and preventing burnout.",
    share_workhours_excessive:
      "Your work hours are unsustainably long and may impact wellbeing and performance over time. Consider discussing workload adjustments.",
    share_rest_adequate:
      "Your generous break time helps maintain energy levels and productivity throughout the workday.",
    share_rest_insufficient:
      "Your limited break time suggests a need for incorporating short movement breaks to maintain health and focus.",
    share_leave_abundant:
      "Your generous leave allowance provides ample time for rejuvenation and personal pursuits - essential for sustained motivation.",
    share_leave_limited:
      "With limited leave time, strategic planning of your days off becomes important for maximizing their restorative benefit.",

    share_phd_comment:
      "Your doctoral qualification opens doors to specialized positions and demonstrates advanced research and analytical capabilities.",
    share_masters_comment:
      "Your master's degree demonstrates advanced knowledge and commitment that remains valuable in today's competitive job market.",
    share_bachelor_comment:
      "Your bachelor's degree provides a solid foundation that, combined with practical experience, enables diverse career opportunities.",
    share_below_bachelor_comment:
      "While formal education below bachelor's level may present challenges in some fields, practical skills and experience can be equally valuable assets.",
    share_fresh_graduate_comment:
      "As a recent graduate, your fresh perspective and current knowledge are assets, balanced by the unlimited potential for growth and learning.",
    share_experienced_comment:
      "Your substantial work experience provides valuable context and judgment that enhance your effectiveness and confidence.",
    share_mid_career_comment:
      "With several years of experience, you understand both your industry and personal strengths, positioning you for strategic career development.",
    share_government_job_comment:
      "The stability of public sector employment reduces career uncertainty, allowing more confident long-term planning.",
    share_private_job_comment:
      "While private sector employment carries some uncertainty, it often provides accelerated growth and compensation opportunities.",
    share_dispatch_job_comment:
      "Temp agency work offers flexibility but less stability. While enjoying short-term convenience, actively planning your long-term career path is essential.",
    share_freelance_job_comment:
      "Freelancing offers exceptional flexibility and autonomy, but comes with income instability and lack of benefits. Strong self-management and marketing skills are essential.",

    share_salary_high_cny:
      "Your daily compensation is competitive, providing financial security and flexibility for both necessities and discretionary spending.",
    share_salary_medium_cny:
      "Your compensation meets basic needs comfortably but requires thoughtful budgeting for optimal financial health.",
    share_salary_low_cny:
      "Your current compensation level necessitates careful financial management while you explore opportunities for income growth.",
    share_salary_high_foreign:
      "Your daily compensation is competitive, providing financial security and flexibility for both necessities and discretionary spending.",
    share_salary_medium_foreign:
      "Your compensation meets basic needs comfortably but requires thoughtful budgeting for optimal financial health.",
    share_salary_low_foreign:
      "Your current compensation level necessitates careful financial management while you explore opportunities for income growth.",
    share_high_cost_city:
      "In a high-cost location, careful financial planning helps maximize the value of your compensation.",
    share_low_cost_city:
      "In a lower-cost area, your compensation provides enhanced purchasing power and potential for savings.",

    share_value_low:
      "While the current position shows limited value, it may provide necessary experience for future growth. Extract learning from every aspect while preparing for your next career move.",
    share_value_medium:
      "Your job offers balanced value with both strengths and areas for improvement. Focus on leveraging the positive aspects while developing strategies to address the challenges.",
    share_value_high:
      "You've found a high-value position worth maintaining and developing. Continue building on your strengths and appreciate the satisfaction this role provides.",
    share_summary_advice: "Overall Recommendation",

    // Ratings
    rating_enter_salary: "Please enter salary",
    rating_terrible: "Dismal",
    rating_poor: "Poor",
    rating_average: "Average",
    rating_good: "Good",
    rating_great: "Great",
    rating_excellent: "Excellent",
    rating_perfect: "Outstanding",
    share_country: "Work Country/Region",
  },
  ja: {
    // タイトルとナビゲーション
    title: "この仕事、正気でやれる？ブラック度診断",
    github: "GitHub",
    email: "Email",
    xiaohongshu: "小紅書(RED)",
    redirect_notice: "自動的にリダイレクトされました",
    visits: "アクセス数",
    visitors: "訪問者数",
    star_request: "役に立ったら⭐スターを付けてください！",
    history: "履歴",
    no_history: "履歴がありません",
    history_notice: "レポートを見た後、自動的に保存されます",
    delete_history: "削除",
    clear_all: "すべて削除",
    restore_history: "この記録を復元",

    // フォームラベル
    annual_salary_cny: "年収（元）",
    annual_salary_foreign: "年収（現地通貨）",
    annual_salary: "年収",
    salary_placeholder_cny: "税引前の年収",
    salary_placeholder_foreign: "現地通貨で入力",
    salary_placeholder: "額面年収",
    non_china_salary: "中国以外の給与",
    ppp_factor: "購買力平価(PPP)換算係数",
    ppp_tooltip:
      "PPP換算係数は各国の通貨の購買力を標準化する指標です。例えば、中国の4.19は、米国の1ドルが中国の4.19元と同等の購買力を持つことを意味します。",
    ppp_placeholder: "PPP換算係数を入力",
    ppp_common_regions:
      "主な地域：中国:4.19、日本:102.59、米国:1.00、シンガポール:0.84",
    view_more: "もっと見る",
    country_selection: "勤務国・地域",
    selected_ppp: "現在のPPP値",
    work_days_per_week: "週間勤務日数",
    wfh_days_per_week: "週間リモートワーク日数",
    wfh_tooltip:
      "リモートワーク・在宅勤務日数とは、週の勤務日のうち、何日間を自宅で勤務するかを指します。",
    annual_leave: "年次有給休暇",
    public_holidays: "祝日数",
    paid_sick_leave: "有給病休",
    work_hours: "一日あたりの勤務時間",
    work_hours_tooltip:
      "勤務時間：始業から終業までの時間（昼食、休憩、残業を含む、通勤時間は除く）",
    commute_hours: "通勤時間",
    commute_tooltip:
      "通勤時間とは、自宅と職場との往復に要する時間の合計を指します。",
    rest_time: "休憩＆サボり時間",

    // 環境係数
    job_stability: "雇用形態（安定性）",
    job_government: "公務員・準公務員",
    job_state: "大企業・終身雇用",
    job_foreign: "外資系企業",
    job_private: "一般企業",
    job_dispatch: "派遣社員",
    job_freelance: "フリーランス",
    work_environment: "職場環境",
    env_remote: "僻地の工場・現場・屋外",
    env_factory: "工場・現場・屋外",
    env_normal: "一般的なオフィス",
    env_cbd: "都心の高級オフィス",
    city_factor: "勤務地（生活コストによる）",
    city_tier1: "都心3区",
    city_newtier1: "都内",
    city_tier2: "大阪・横浜・名古屋・福岡市中心部",
    city_tier3: "地方都市の県庁所在地",
    city_tier4: "地方都市",
    city_county: "小都市",
    city_town: "田舎",
    hometown: "地元で働いていますか",
    not_hometown: "地元ではない",
    is_hometown: "地元である",
    leadership: "上司・経営者との関係",
    leader_bad: "嫌われている",
    leader_strict: "厳しい管理される",
    leader_normal: "普通の関係",
    leader_good: "理解し合えている",
    leader_favorite: "気に入られている",
    teamwork: "職場の人間関係",
    team_bad: "最悪な環境",
    team_normal: "事務的な関係",
    team_good: "協力的な環境",
    team_excellent: "仲の良い職場",
    shuttle: "送迎バス（加点項目）",
    shuttle_none: "アクセス不便",
    shuttle_inconvenient: "不便なバス",
    shuttle_convenient: "便利なバス",
    shuttle_direct: "直行便あり",
    canteen: "社員食堂（加点項目）",
    canteen_none: "非常にまずい",
    canteen_average: "普通",
    canteen_good: "美味しい",
    canteen_excellent: "非常に美味しい",

    // 教育と経験
    education_level: "学歴",
    degree_type: "学位タイプ",
    below_bachelor: "短大・専門学校以下",
    bachelor: "学士（大学卒）",
    masters: "修士",
    phd: "博士",
    school_type: "大学タイプ",
    school_second_tier: "一般大学",
    school_first_tier_bachelor: "MARCH・関関同立・QS200位",
    school_elite_bachelor: "東大・京大・早慶・QS50位",
    school_first_tier_higher: "国公立大学院・QS100位",
    school_elite_higher: "東大・京大大学院・QS30位",
    bachelor_background: "学部背景",
    work_years: "勤務年数",
    fresh_graduate: "新卒",
    years_1_3: "1-3年",
    years_3_5: "3-5年",
    years_5_8: "5-8年",
    years_8_10: "8-10年",
    years_10_12: "10-12年",
    years_above_12: "12年以上",

    // 結果
    working_days_per_year: "年間勤務日数",
    days_unit: "日",
    average_daily_salary: "1日あたりの給与",
    job_value: "仕事の価値",
    view_report: "診断レポートを見る",

    // ShareCardコンポーネント
    share_back_to_calculator: "計算機に戻る",
    share_your_job_worth_report: "あなたの仕事価値レポート",
    share_job_worth_report: "仕事価値レポート",
    share_custom_made: "「この仕事、正気でやれる？ブラック度診断」による分析",
    share_generating: "生成中...",
    share_download_report: "レポートをダウンロード",
    share_basic_info: "基本情報",
    share_work_city: "勤務地",
    share_is_hometown: "地元",
    share_yes: "はい",
    share_no: "いいえ",
    share_daily_salary: "日給",
    share_day: "日",
    share_days: "日",
    share_work_hours_title: "勤務時間",
    share_hours: "時間",
    share_daily_work_hours: "1日の勤務時間",
    share_daily_commute_hours: "1日の通勤時間",
    share_rest_time: "休憩時間",
    share_weekly_work_days: "週の勤務日数",
    share_remote_work: "リモートワーク",
    share_days_per_week: "日/週",
    share_shuttle_service: "送迎バス",
    share_annual_leave: "年次有給休暇",
    share_paid_sick_leave: "有給病気休暇",
    share_days_per_year: "日/年",
    share_work_environment_title: "職場環境",
    share_office_environment: "オフィス環境",
    share_leadership_relation: "上司との関係",
    share_colleague_relationship: "同僚との関係",
    share_canteen_quality: "社員食堂",
    share_education_and_experience: "学歴と経験",
    share_highest_degree: "最終学歴",
    share_school_type_label: "大学タイプ",
    share_work_years_label: "勤務年数",
    share_contract_type_label: "雇用形態",
    share_final_assessment: "総合評価",
    share_low_value_assessment_1:
      "この仕事はあなたにとって日々が苦痛で、まさにブラック企業の特徴を持っています。",
    share_low_value_assessment_2:
      "この仕事は非常に厳しいですが、より良い将来へのステップになるかもしれません。",
    share_medium_value_assessment_1:
      "この仕事は普通で、特に素晴らしいわけでも悪いわけでもありません。",
    share_medium_value_assessment_2:
      "この仕事はそこそこ満足感を与えてくれる、悪くない選択です。",
    share_high_value_assessment_1:
      "この仕事はあなたの期待のほとんどを満たし、やりがいを感じられます。",
    share_high_value_assessment_2:
      "この仕事はあなたにぴったりで、チャレンジと報酬のバランスが取れています。",
    share_high_value_assessment_3:
      "理想的な仕事を見つけましたね！このような機会は滅多にありません！",
    share_working_days_per_year: "年間勤務日数",

    share_hometown_comment:
      "あなたの故郷で働くことで、キャリアを構築しながら家族とのつながりを維持することができます - これは総合的な生活満足度に貢献する貴重なバランスです。",
    share_not_hometown_comment:
      "自分の面倒をしっかり見て、定時に食事と休息を取るように。あなたは一人でとても遠くまで来ました。",
    share_tier1andnewtier1_city_comment:
      "大都市圏の中心部は家賃が非常に高いエリアですが、キャリア機会も多く、プロフェッショナルなネットワーク形成には最適な環境です。",
    share_tier2and3_city_comment:
      "地方の中核都市は、適度な生活コストと仕事の機会のバランスが取れたエリアです。",
    share_tier4andbelow_city_comment:
      "地方都市では家賃など生活コストが低く、ゆとりある生活が送れます。仕事の機会は限られますが、ストレスの少ない環境は魅力的です。",

    share_commute_short:
      "通勤時間が短いため、自己啓発やリラックスのための貴重な時間が確保できています。",
    share_commute_medium:
      "適度な通勤時間は負担にならず、オーディオブックや音楽を楽しむ時間として活用できます。",
    share_commute_long:
      "長時間の通勤は貴重な時間を消費し、心身の健康に影響を与える可能性があります。可能であれば引越しや在宅勤務の検討をおすすめします。",
    share_wfh_high:
      "リモートワークの機会が多いため、通勤の負担が大幅に軽減され、生活の質が向上しています。",
    share_wfh_medium:
      "部分的なリモートワークにより、通勤時間を節約できています。",
    share_shuttle_service_good:
      "会社の送迎バスは価値ある福利厚生で、通勤をより快適にしています。",

    share_cbd_environment:
      "都心のオフィス環境は専門的かつ近代的で、ビジネスサービスやネットワーキングの機会へのアクセスが容易です。",
    share_factory_environment:
      "工場や屋外での勤務は独自の課題がありますが、耐久力と実践的な問題解決能力も育てています。",
    share_normal_environment:
      "職場環境は基本的な設備が整っており、生産的に仕事ができる条件が揃っています。",
    share_leadership_excellent:
      "上司の信頼を得ていることで、多くのチャンスと影響力を持つことができますが、同時に高い期待に応える責任も伴います。",
    share_leadership_good:
      "理解のある上司はあなたの貢献を認め、成功に必要な指導を提供してくれます - これは職場での貴重な財産です。",
    share_leadership_normal:
      "上司との関係は明快で機能的であり、余計な複雑さなく明確な期待が示されています。",
    share_leadership_strict:
      "厳格な管理下で働くことは挑戦的ですが、職業人としての規律と細部への注意力を養うことができます。",
    share_leadership_bad:
      "上司との緊張関係は課題をもたらし、慎重なコミュニケーションと人間関係よりも成果物に焦点を当てる必要があります。",
    share_teamwork_excellent:
      "同僚との強い個人的なつながりは、仕事の満足度と効率性を高める支援ネットワークを作り出しています。",
    share_teamwork_good:
      "協力的なチーム環境は相互サポートと効果的なコミュニケーションを促進し、日々の仕事をより快適で生産的にします。",
    share_teamwork_normal:
      "同僚と専門的でありながら過度に個人的ではない関係を維持することで、十分なサポートを受けながら仕事に集中できます。",
    share_teamwork_bad:
      "困難なチームダイナミクスには適応力と自立性が求められ、これが貴重な独立性と回復力を育てることがあります。",

    share_workhours_balanced:
      "バランスの取れた勤務スケジュールは、個人生活のための十分な時間を確保し、長期的な持続可能なパフォーマンスに貢献します。",
    share_workhours_long:
      "長時間の勤務は管理可能ですが、エネルギーを維持し燃え尽き症候群を防ぐための注意が必要です。",
    share_workhours_excessive:
      "持続不可能なほど長い勤務時間は、長期的に健康とパフォーマンスに影響を与える可能性があります。業務量の調整について話し合うことを検討してください。",
    share_rest_adequate:
      "十分な休憩時間は、一日を通してエネルギーレベルと生産性を維持するのに役立ちます。",
    share_rest_insufficient:
      "限られた休憩時間は、健康と集中力を維持するために短い運動休憩を取り入れる必要性を示唆しています。",
    share_leave_abundant:
      "充実した休暇制度は、リフレッシュと個人的な追求のための十分な時間を提供し、持続的なモチベーションに不可欠です。",
    share_leave_limited:
      "限られた休暇時間では、その回復効果を最大化するために休日の戦略的な計画が重要になります。",

    share_phd_comment:
      "博士号の資格は専門的なポジションへの道を開き、高度な研究と分析能力を証明します。",
    share_masters_comment:
      "修士号は高度な知識と献身を示し、今日の競争の激しい就職市場で価値ある資格です。",
    share_bachelor_comment:
      "学士号は堅実な基盤を提供し、実践的な経験と組み合わせることで、多様なキャリア機会を可能にします。",
    share_below_bachelor_comment:
      "学士未満の正式な教育は一部の分野で課題をもたらす可能性がありますが、実践的なスキルと経験は同様に価値ある資産となります。",
    share_fresh_graduate_comment:
      "新卒者として、あなたの新鮮な視点と最新の知識は資産であり、成長と学習のための無限の可能性とバランスを取ることができます。",
    share_experienced_comment:
      "豊富な職務経験は、あなたの効果と自信を高める貴重な文脈と判断力を提供します。",
    share_mid_career_comment:
      "数年の経験を持つあなたは、業界と個人の強みの両方を理解し、戦略的なキャリア開発の準備ができています。",
    share_government_job_comment:
      "公共部門の雇用の安定性はキャリアの不確実性を軽減し、より自信を持って長期的な計画を立てることができます。",
    share_private_job_comment:
      "民間部門の雇用にはある程度の不確実性がありますが、多くの場合、加速された成長と報酬の機会を提供します。",
    share_dispatch_job_comment:
      "派遣社員としての働き方は柔軟性がある一方で、雇用の安定性は低めです。短期的な利便性を享受しながらも、長期的なキャリアパスを積極的に計画することが重要です。",
    share_freelance_job_comment:
      "フリーランスとして働くことで高い自由度と自律性を得られますが、収入の不安定さや福利厚生の欠如というリスクも伴います。自己管理能力とマーケティングスキルが重要になります。",

    share_salary_high_cny:
      "日給が競争力があり、必需品と自由裁量の支出の両方に対して財政的安定性と柔軟性を提供します。",
    share_salary_medium_cny:
      "給与は基本的なニーズを快適に満たしていますが、最適な財政状態のために思慮深い予算計画が必要です。",
    share_salary_low_cny:
      "現在の給与水準では、収入増加の機会を探りながら、慎重な財務管理が必要です。",
    share_salary_high_foreign:
      "日給が競争力があり、必需品と自由裁量の支出の両方に対して財政的安定性と柔軟性を提供します。",
    share_salary_medium_foreign:
      "給与は基本的なニーズを快適に満たしていますが、最適な財政状態のために思慮深い予算計画が必要です。",
    share_salary_low_foreign:
      "現在の給与水準では、収入増加の機会を探りながら、慎重な財務管理が必要です。",
    share_high_cost_city:
      "生活費の高い地域では、慎重な財務計画が報酬の価値を最大化するのに役立ちます。",
    share_low_cost_city:
      "生活費の低い地域では、給与がより高い購買力と貯蓄の可能性をもたらします。",

    share_value_low:
      "現在の仕事の価値は限られているかもしれませんが、将来の成長に必要な経験を提供するかもしれません。次のキャリアステップの準備をしながら、すべての側面から学びを得ることが大切です。",
    share_value_medium:
      "あなたの仕事は長所と改善すべき点の両方があるバランスのとれた価値を提供しています。ポジティブな側面を活かしながら、課題に対処するための戦略を立てましょう。",
    share_value_high:
      "維持・発展させる価値のある高価値の職場を見つけました。あなたの強みを引き続き伸ばし、この役割が提供する満足感を大切にしましょう。",
    share_summary_advice: "総合的なアドバイス",

    // 評価
    rating_enter_salary: "給与を入力してください",
    rating_terrible: "最悪",
    rating_poor: "悪い",
    rating_average: "普通",
    rating_good: "良い",
    rating_great: "素晴らしい",
    rating_excellent: "非常に優れている",
    rating_perfect: "理想的",
    share_country: "勤務国・地域",
  },
};

// 提供上下文的组件
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 从本地存储初始化语言，默认为中文
  const [language, setLanguageState] = useState<Language>("zh");

  // 首次渲染时检查本地存储的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (
      savedLanguage &&
      (savedLanguage === "zh" ||
        savedLanguage === "en" ||
        savedLanguage === "ja")
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // 设置语言并保存到本地存储
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用上下文的钩子
export const useLanguage = () => useContext(LanguageContext);
