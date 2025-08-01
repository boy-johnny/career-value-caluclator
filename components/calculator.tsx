"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Wallet, FileText, History, Eye, Star } from "lucide-react"; // 添加新图标
import Link from "next/link"; // 导入Link组件用于导航
import { useLanguage } from "./LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { countryNames } from "./LanguageContext";
import { pppFactors, currencySymbols } from "@/libs/Factors";
import { HistoryItem, FormData, Result } from "@/types/calculator";

const SalaryCalculator = () => {
  // 获取语言上下文
  const { t, language } = useLanguage();

  // 添加客户端检测
  const [isBrowser, setIsBrowser] = useState(false);

  // 添加滚动位置保存的引用
  const scrollPositionRef = useRef(0);

  // 添加历史记录状态
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 在组件挂载时标记为浏览器环境
  useEffect(() => {
    setIsBrowser(true);

    // 在客户端环境中执行重定向
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (
        hostname !== "worthjob.zippland.com" &&
        hostname !== "localhost" &&
        !hostname.includes("127.0.0.1")
      ) {
        window.location.href =
          "https://worthjob.zippland.com" + window.location.pathname;
      }
    }
  }, []);

  // 添加用于创建分享图片的引用
  const shareResultsRef = useRef<HTMLDivElement>(null);

  // 状态管理 - 基础表单和选项
  const [formData, setFormData] = useState<FormData>({
    salary: "",
    nonChinaSalary: false,
    workDaysPerWeek: "5",
    wfhDaysPerWeek: "0",
    annualLeave: "5",
    paidSickLeave: "3",
    publicHolidays: "13",
    workHours: "10",
    commuteHours: "2",
    restTime: "2",
    cityFactor: "1.0",
    workEnvironment: "1.0",
    leadership: "1.0",
    teamwork: "1.0",
    homeTown: "no",
    degreeType: "bachelor",
    schoolType: "firstTier",
    bachelorType: "firstTier",
    workYears: "0",
    shuttle: "1.0",
    canteen: "1.0",
    jobStability: "private", // 新增：工作稳定度/类型
    education: "1.0",
    hasShuttle: false, // 确保这是一个明确的布尔值
    hasCanteen: false, // 确保这是一个明确的布尔值
  });

  const [showPPPInput, setShowPPPInput] = useState(false);
  // 修改为国家代码，默认为中国
  const [selectedCountry, setSelectedCountry] = useState<string>("TW");

  // 初始化时从localStorage加载国家设置
  useEffect(() => {
    // 从本地存储读取国家设置
    if (typeof window !== "undefined") {
      const savedCountry = localStorage.getItem("selectedCountry");
      if (savedCountry) {
        setSelectedCountry(savedCountry);
      }
    }
  }, []);

  // 当国家选择改变时保存到localStorage
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCountry", countryCode);
    }
  };

  const [result, setResult] = useState<Result | null>(null);
  const [showPPPList, setShowPPPList] = useState(false);
  const [assessment, setAssessment] = useState("");
  const [assessmentColor, setAssessmentColor] = useState("text-gray-500");
  const [visitorVisible, setVisitorVisible] = useState(false);

  // 添加检查document对象存在的逻辑
  useEffect(() => {
    // 确保在客户端环境中执行
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const savedHistory = localStorage.getItem("jobValueHistory");
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(
            savedHistory
          ) as Partial<HistoryItem>[];

          // 处理历史记录，为可能缺失的字段添加默认值
          const normalizedHistory: HistoryItem[] = parsedHistory.map(
            (item: Partial<HistoryItem>) => ({
              id: item.id || Date.now().toString(),
              timestamp: item.timestamp || Date.now(),
              value: item.value || "0",
              assessment: item.assessment || "rating_enter_salary",
              assessmentColor: item.assessmentColor || "text-gray-500",
              salary: item.salary || "",
              countryCode: item.countryCode || "CN",
              countryName: item.countryName || "中国",

              // 为缺失的分享页面字段添加默认值
              cityFactor: item.cityFactor || formData.cityFactor,
              workHours: item.workHours || formData.workHours,
              commuteHours: item.commuteHours || formData.commuteHours,
              restTime: item.restTime || formData.restTime,
              dailySalary: item.dailySalary || "0", // 简化，不使用函数
              workDaysPerYear: item.workDaysPerYear || "250", // 简化，使用默认值
              workDaysPerWeek: item.workDaysPerWeek || formData.workDaysPerWeek,
              wfhDaysPerWeek: item.wfhDaysPerWeek || formData.wfhDaysPerWeek,
              annualLeave: item.annualLeave || formData.annualLeave,
              paidSickLeave: item.paidSickLeave || formData.paidSickLeave,
              publicHolidays: item.publicHolidays || formData.publicHolidays,
              workEnvironment: item.workEnvironment || formData.workEnvironment,
              leadership: item.leadership || formData.leadership,
              teamwork: item.teamwork || formData.teamwork,
              degreeType: item.degreeType || formData.degreeType,
              schoolType: item.schoolType || formData.schoolType,
              education: item.education || formData.education,
              homeTown: item.homeTown || formData.homeTown,
              shuttle: item.shuttle || formData.shuttle,
              canteen: item.canteen || formData.canteen,
              workYears: item.workYears || formData.workYears,
              jobStability: item.jobStability || formData.jobStability,
              bachelorType: item.bachelorType || formData.bachelorType,
              // 确保 hasShuttle 和 hasCanteen 有合法的布尔值，即使历史记录中没有这些字段
              hasShuttle:
                typeof item.hasShuttle === "boolean" ? item.hasShuttle : false,
              hasCanteen:
                typeof item.hasCanteen === "boolean" ? item.hasCanteen : false,
            })
          );

          setHistory(normalizedHistory);
        } catch (e) {
          console.error("加载历史记录失败", e);
        }
      }
    }
  }, [formData]);

  // 监听访客统计加载
  useEffect(() => {
    // 延迟检查busuanzi是否已加载
    const timer = setTimeout(() => {
      const pv = document.getElementById("busuanzi_value_site_pv");
      const uv = document.getElementById("busuanzi_value_site_uv");

      if (pv && pv.innerText !== "") {
        // 直接在现有数字上加上1700000（原seeyoufarm统计数据）
        const currentCount = parseInt(pv.innerText, 10) || 0;
        pv.innerText = (currentCount + 1700000).toString();

        // 同时增加访客数的历史数据
        if (uv && uv.innerText !== "") {
          const currentUV = parseInt(uv.innerText, 10) || 0;
          uv.innerText = (currentUV + 250000).toString();
        }

        setVisitorVisible(true);
      } else {
        // 如果未加载，再次尝试
        const retryTimer = setTimeout(() => {
          const pv = document.getElementById("busuanzi_value_site_pv");
          const uv = document.getElementById("busuanzi_value_site_uv");

          if (pv && pv.innerText !== "") {
            // 直接在现有数字上加上1700000（原seeyoufarm统计数据）
            const currentCount = parseInt(pv.innerText, 10) || 0;
            pv.innerText = (currentCount + 1700000).toString();

            // 同时增加访客数的历史数据
            if (uv && uv.innerText !== "") {
              const currentUV = parseInt(uv.innerText, 10) || 0;
              uv.innerText = (currentUV + 1300000).toString();
            }

            setVisitorVisible(true);
          }
        }, 2000);
        return () => clearTimeout(retryTimer);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 添加滚动位置保存和恢复逻辑
  useEffect(() => {
    const handleBeforeStateChange = () => {
      // 保存当前滚动位置
      if (typeof window !== "undefined") {
        scrollPositionRef.current = window.scrollY;
      }
    };

    const handleAfterStateChange = () => {
      // 恢复滚动位置
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 0);
      }
    };

    // 添加到全局事件
    window.addEventListener("beforeStateChange", handleBeforeStateChange);
    window.addEventListener("afterStateChange", handleAfterStateChange);

    return () => {
      // 清理事件监听器
      window.removeEventListener("beforeStateChange", handleBeforeStateChange);
      window.removeEventListener("afterStateChange", handleAfterStateChange);
    };
  }, []);

  const calculateWorkingDays = useCallback(() => {
    const weeksPerYear = 52;
    const totalWorkDays = weeksPerYear * Number(formData.workDaysPerWeek); // 确保转换为数字
    const totalLeaves =
      Number(formData.annualLeave) +
      Number(formData.publicHolidays) +
      Number(formData.paidSickLeave) * 0.6; // 带薪病假按70%权重计算
    return Math.max(totalWorkDays - totalLeaves, 0);
  }, [
    formData.workDaysPerWeek,
    formData.annualLeave,
    formData.publicHolidays,
    formData.paidSickLeave,
  ]);

  const calculateDailySalary = useCallback(() => {
    if (!formData.salary) return 0;
    const workingDays = calculateWorkingDays();

    // 应用PPP转换因子标准化薪资
    // 如果选择了非中国地区，使用选定国家的PPP；否则使用中国默认值4.19
    const isNonChina = selectedCountry !== "CN";
    const pppFactor = isNonChina ? pppFactors[selectedCountry] || 4.19 : 4.19;
    const standardizedSalary = Number(formData.salary) * (4.19 / pppFactor);

    return standardizedSalary / workingDays; // 除 0 不管, Infinity(爽到爆炸)!
  }, [formData.salary, selectedCountry, calculateWorkingDays]);

  // 新增：获取显示用的日薪（转回原始货币）
  const getDisplaySalary = useCallback(() => {
    const dailySalaryInCNY = calculateDailySalary();
    const isNonChina = selectedCountry !== "CN";
    if (isNonChina) {
      // 非中国地区，转回本地货币
      const pppFactor = pppFactors[selectedCountry] || 4.19;
      return ((dailySalaryInCNY * pppFactor) / 4.19).toFixed(2);
    } else {
      return dailySalaryInCNY.toFixed(2);
    }
  }, [calculateDailySalary, selectedCountry]);

  const handleInputChange = useCallback(
    (name: string, value: string | boolean) => {
      // 触发自定义事件，保存滚动位置
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("beforeStateChange"));
      }

      // 直接设置值，不进行任何验证
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // 在状态更新后，触发恢复滚动位置事件
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("afterStateChange"));
        }
      }, 0);
    },
    []
  );

  const calculateValue = () => {
    if (!formData.salary) return 0;

    const dailySalary = calculateDailySalary();
    const workHours = Number(formData.workHours);
    const commuteHours = Number(formData.commuteHours);
    const restTime = Number(formData.restTime);

    // 确保正确转换为数字，使用parseFloat可以更可靠地处理字符串转数字
    const workDaysPerWeek = parseFloat(formData.workDaysPerWeek) || 5;

    // 允许wfhDaysPerWeek为空字符串，计算时才处理为0
    const wfhInput = formData.wfhDaysPerWeek.trim();
    const wfhDaysPerWeek =
      wfhInput === ""
        ? 0
        : Math.min(parseFloat(wfhInput) || 0, workDaysPerWeek);

    // 确保有办公室工作天数时才计算比例，否则设为0
    const officeDaysRatio =
      workDaysPerWeek > 0
        ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek
        : 0;

    // 在计算结果中添加一个小的日志输出，以便调试
    console.log("WFH计算:", {
      workDaysPerWeek,
      wfhDaysPerWeek,
      officeDaysRatio,
      effectiveCommute: commuteHours * officeDaysRatio,
    });

    // 班车系数只在勾选时使用，否则为1.0
    const shuttleFactor = formData.hasShuttle ? Number(formData.shuttle) : 1.0;
    const effectiveCommuteHours =
      commuteHours * officeDaysRatio * shuttleFactor;

    // 食堂系数只在勾选时使用，否则为1.0
    const canteenFactor = formData.hasCanteen ? Number(formData.canteen) : 1.0;

    // 工作环境因素，包含食堂和家乡因素
    const environmentFactor =
      Number(formData.workEnvironment) *
      Number(formData.leadership) *
      Number(formData.teamwork) *
      Number(formData.cityFactor) *
      canteenFactor;

    // 根据工作年限计算经验薪资倍数
    const workYears = Number(formData.workYears);
    let experienceSalaryMultiplier = 1.0;

    if (workYears === 0) {
      // 应届生：直接根据工作类型设定初始调整系数，反映稳定性/风险价值
      // 注意：这些系数在分母中，系数越小，最终价值越高
      if (formData.jobStability === "government") {
        experienceSalaryMultiplier = 0.8; // 体制内稳定性高，价值相对高
      } else if (formData.jobStability === "state") {
        experienceSalaryMultiplier = 0.9; // 央/国企较稳定，价值相对高
      } else if (formData.jobStability === "foreign") {
        experienceSalaryMultiplier = 0.95; // 外企，较为稳定
      } else if (formData.jobStability === "private") {
        experienceSalaryMultiplier = 1.0; // 私企作为基准
      } else if (formData.jobStability === "dispatch") {
        experienceSalaryMultiplier = 1.1; // 派遣社员风险高，价值相对低
      } else if (formData.jobStability === "freelance") {
        experienceSalaryMultiplier = 1.1; // 自由职业风险高，价值相对低
      }
    } else {
      // 非应届生：使用基于增长预期的模型

      // 基准薪资增长曲线（适用于私企）
      let baseSalaryMultiplier = 1.0;
      if (workYears === 1)
        baseSalaryMultiplier = 1.5; // 1年：1.50-2.00，取中间值
      else if (workYears <= 3)
        baseSalaryMultiplier = 2.2; // 2-3年：2.20-2.50，取中间值
      else if (workYears <= 5)
        baseSalaryMultiplier = 2.7; // 4-5年：2.70-3.00，取中间值
      else if (workYears <= 8)
        baseSalaryMultiplier = 3.2; // 6-8年：3.20-3.50，取中间值
      else if (workYears <= 10)
        baseSalaryMultiplier = 3.6; // 9-10年：3.60-3.80，取中间值
      else baseSalaryMultiplier = 3.9; // 11-13年：3.90-4.20，取中间值

      // 工作单位类型对涨薪幅度的影响系数
      let salaryGrowthFactor = 1.0; // 私企基准
      if (formData.jobStability === "foreign") {
        salaryGrowthFactor = 0.8; // 外企涨薪幅度为私企的80%
      } else if (formData.jobStability === "state") {
        salaryGrowthFactor = 0.4; // 央/国企涨薪幅度为私企的40%
      } else if (formData.jobStability === "government") {
        salaryGrowthFactor = 0.2; // 体制内涨薪幅度为私企的20%
      } else if (formData.jobStability === "dispatch") {
        salaryGrowthFactor = 1.2; // 派遣社员涨薪幅度为私企的120%（体现不稳定性）
      } else if (formData.jobStability === "freelance") {
        salaryGrowthFactor = 1.2; // 自由职业涨薪幅度为私企的120%（体现不稳定性）
      }

      // 根据公式: 1 + (对应幅度-1) * 工作单位系数，计算最终薪资倍数
      experienceSalaryMultiplier =
        1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor;
    }

    // 薪资满意度应该受到经验薪资倍数的影响
    // 相同薪资，对于高经验者来说价值更低，对应的计算公式需要考虑经验倍数
    return (
      (dailySalary * environmentFactor) /
      (35 *
        (workHours + effectiveCommuteHours - 0.5 * restTime) *
        Number(formData.education) *
        experienceSalaryMultiplier)
    );
  };

  const value = calculateValue();

  const getValueAssessment = useCallback(() => {
    if (!formData.salary)
      return { text: t("rating_enter_salary"), color: "text-gray-500" };
    if (value < 0.6)
      return { text: t("rating_terrible"), color: "text-pink-800" };
    if (value < 1.0) return { text: t("rating_poor"), color: "text-red-500" };
    if (value <= 1.8)
      return { text: t("rating_average"), color: "text-orange-500" };
    if (value <= 2.5) return { text: t("rating_good"), color: "text-blue-500" };
    if (value <= 3.2)
      return { text: t("rating_great"), color: "text-green-500" };
    if (value <= 4.0)
      return { text: t("rating_excellent"), color: "text-purple-500" };
    return { text: t("rating_perfect"), color: "text-yellow-400" };
  }, [formData.salary, value, t]);

  // 获取评级的翻译键，用于分享链接
  const getValueAssessmentKey = useCallback(() => {
    if (!formData.salary) return "rating_enter_salary";
    if (value < 0.6) return "rating_terrible";
    if (value < 1.0) return "rating_poor";
    if (value <= 1.8) return "rating_average";
    if (value <= 2.5) return "rating_good";
    if (value <= 3.2) return "rating_great";
    if (value <= 4.0) return "rating_excellent";
    return "rating_perfect";
  }, [formData.salary, value]);

  const RadioGroup = ({
    label,
    name,
    value,
    onChange,
    options,
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string | boolean) => void;
    options: Array<{ label: string; value: string }>;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        className={`grid ${
          language === "en" ? "grid-cols-3" : "grid-cols-4"
        } gap-2`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-2 rounded-md text-sm transition-colors
              ${
                value === option.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              }`}
            onClick={(e) => {
              e.preventDefault(); // 阻止默认行为
              e.stopPropagation(); // 阻止事件冒泡
              onChange(name, option.value);
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  // 根据学位类型和学校类型计算教育系数
  const calculateEducationFactor = useCallback(() => {
    const degreeType = formData.degreeType;
    const schoolType = formData.schoolType;
    const bachelorType = formData.bachelorType;

    // 使用更简单的方式计算系数，避免复杂的索引类型问题
    let factor = 1.0; // 默认值

    // 专科及以下固定为0.8
    if (degreeType === "belowBachelor") {
      factor = 0.8;
    }
    // 本科学历
    else if (degreeType === "bachelor") {
      if (schoolType === "secondTier") factor = 0.9; // 二本三本
      else if (schoolType === "firstTier") factor = 1.0; // 双非/QS100/USnews50
      else if (schoolType === "elite") factor = 1.2; // 985/211/QS30/USnews20
    }
    // 硕士学历 - 考虑本科背景
    else if (degreeType === "masters") {
      // 先获取本科背景的基础系数
      let bachelorBaseCoefficient = 0;
      if (bachelorType === "secondTier")
        bachelorBaseCoefficient = 0.9; // 二本三本
      else if (bachelorType === "firstTier")
        bachelorBaseCoefficient = 1.0; // 双非/QS100/USnews50
      else if (bachelorType === "elite") bachelorBaseCoefficient = 1.2; // 985/211/QS30/USnews20

      // 再计算硕士学校的加成系数
      let mastersBonus = 0;
      if (schoolType === "secondTier") mastersBonus = 0.4; // 二本三本硕士
      else if (schoolType === "firstTier")
        mastersBonus = 0.5; // 双非/QS100/USnews50硕士
      else if (schoolType === "elite") mastersBonus = 0.6; // 985/211/QS30/USnews20硕士

      // 最终学历系数 = 本科基础 + 硕士加成
      factor = bachelorBaseCoefficient + mastersBonus;
    }
    // 博士学历
    else if (degreeType === "phd") {
      if (schoolType === "secondTier") factor = 1.6; // 二本三本博士
      else if (schoolType === "firstTier")
        factor = 1.8; // 双非/QS100/USnews50博士
      else if (schoolType === "elite") factor = 2.0; // 985/211/QS30/USnews20博士
    }

    // 更新education字段
    if (formData.education !== String(factor)) {
      // 这里不使用handleInputChange以避免触发滚动保存/恢复逻辑
      setFormData((prev) => ({
        ...prev,
        education: String(factor),
      }));
    }

    return factor;
  }, [
    formData.degreeType,
    formData.schoolType,
    formData.bachelorType,
    formData.education,
  ]);

  // 在组件初始化和学历选择变化时计算教育系数
  useEffect(() => {
    calculateEducationFactor();
  }, [formData.degreeType, formData.schoolType, calculateEducationFactor]);

  // 获取当前选择的国家名称（根据语言）
  const getCountryName = useCallback(
    (countryCode: string) => {
      if (language === "en") {
        return countryNames.en[countryCode] || countryCode || "Unknown";
      }
      if (language === "ja") {
        return countryNames.ja[countryCode] || countryCode || "不明";
      }
      return countryNames.zh[countryCode] || countryCode || "未知";
    },
    [language]
  );

  // 保存当前记录到历史中
  const saveToHistory = useCallback(() => {
    if (!formData.salary || typeof window === "undefined") return;

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      value: value.toFixed(2),
      assessment: getValueAssessmentKey(), // 使用翻译键而不是已翻译的文本
      assessmentColor: getValueAssessment().color,
      salary: formData.salary,
      countryCode: selectedCountry,
      countryName: getCountryName(selectedCountry),

      // 添加所有需要在分享页面展示的字段
      cityFactor: formData.cityFactor,
      workHours: formData.workHours,
      commuteHours: formData.commuteHours,
      restTime: formData.restTime,
      dailySalary: getDisplaySalary(),
      workDaysPerYear: calculateWorkingDays().toString(),
      workDaysPerWeek: formData.workDaysPerWeek,
      wfhDaysPerWeek: formData.wfhDaysPerWeek,
      annualLeave: formData.annualLeave,
      paidSickLeave: formData.paidSickLeave,
      publicHolidays: formData.publicHolidays,
      workEnvironment: formData.workEnvironment,
      leadership: formData.leadership,
      teamwork: formData.teamwork,
      degreeType: formData.degreeType,
      schoolType: formData.schoolType,
      education: formData.education,
      homeTown: formData.homeTown,
      shuttle: formData.hasShuttle ? formData.shuttle : "1.0",
      canteen: formData.hasCanteen ? formData.canteen : "1.0",
      workYears: formData.workYears,
      jobStability: formData.jobStability,
      bachelorType: formData.bachelorType,
      hasShuttle: formData.hasShuttle,
      hasCanteen: formData.hasCanteen,
    };

    try {
      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)]; // 限制保存10条记录
      setHistory(updatedHistory);
      localStorage.setItem("jobValueHistory", JSON.stringify(updatedHistory));
      console.log("保存历史记录成功", newHistoryItem);
    } catch (e) {
      console.error("保存历史记录失败", e);
    }

    return newHistoryItem;
  }, [
    formData,
    value,
    getValueAssessmentKey,
    getValueAssessment,
    selectedCountry,
    history,
    getCountryName,
    calculateWorkingDays,
    getDisplaySalary,
    formData.hasShuttle,
    formData.hasCanteen,
  ]);

  // 删除单条历史记录
  const deleteHistoryItem = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation(); // 阻止事件冒泡
      e.preventDefault(); // 阻止默认行为

      try {
        const updatedHistory = history.filter((item) => item.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem("jobValueHistory", JSON.stringify(updatedHistory));
        console.log("删除历史记录成功", id);
      } catch (e) {
        console.error("删除历史记录失败", e);
      }
    },
    [history]
  );

  // 清空所有历史记录
  const clearAllHistory = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    e.preventDefault(); // 阻止默认行为

    try {
      setHistory([]);
      localStorage.removeItem("jobValueHistory");
      console.log("清空所有历史记录成功");
    } catch (e) {
      console.error("清空历史记录失败", e);
    }
  }, []);

  // 格式化日期
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // 获取当前选择国家的货币符号
  const getCurrencySymbol = useCallback((countryCode: string) => {
    return currencySymbols[countryCode] || "$"; // 如果没有找到对应货币符号，默认使用美元符号
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="mb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 py-2">
          {t("title")}
        </h1>

        <div className="mb-3">
          <a
            href="https://github.com/zippland/worth-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
          >
            <Star className="h-3.5 w-3.5" />
            {t("star_request")}
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">v6.2.1</p>
          {/* 仅在客户端渲染历史记录按钮 */}
          {isBrowser && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <History className="h-3.5 w-3.5" />
              {t("history")}
            </button>
          )}
        </div>

        {/* 历史记录列表 - 仅在客户端渲染 */}
        {isBrowser && showHistory && (
          <div className="relative z-10">
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-72 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
              <div className="p-3">
                <div className="flex justify-between items-center mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <History className="h-3.5 w-3.5 mr-1" />
                    {t("history")}
                  </h3>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <button
                        onClick={clearAllHistory}
                        className="text-xs text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t("clear_all")}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        setShowHistory(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {history.length > 0 ? (
                  <ul className="space-y-2">
                    {history.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-sm font-semibold ${item.assessmentColor}`}
                            >
                              {item.value}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                              {item.countryCode !== "CN" ? "$" : "¥"}
                              {item.salary}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // 阻止事件冒泡
                              e.preventDefault(); // 阻止默认行为

                              // 恢复历史记录中的值到当前表单
                              setFormData({
                                ...formData,
                                salary: item.salary,
                                cityFactor: item.cityFactor,
                                workHours: item.workHours,
                                commuteHours: item.commuteHours,
                                restTime: item.restTime,
                                workDaysPerWeek: item.workDaysPerWeek,
                                wfhDaysPerWeek: item.wfhDaysPerWeek,
                                annualLeave: item.annualLeave,
                                paidSickLeave: item.paidSickLeave,
                                publicHolidays: item.publicHolidays,
                                workEnvironment: item.workEnvironment,
                                leadership: item.leadership,
                                teamwork: item.teamwork,
                                degreeType: item.degreeType,
                                schoolType: item.schoolType,
                                education: item.education,
                                homeTown: item.homeTown,
                                shuttle: item.shuttle,
                                canteen: item.canteen,
                                workYears: item.workYears,
                                jobStability: item.jobStability,
                                bachelorType: item.bachelorType,
                                // 确保 hasShuttle 和 hasCanteen 有合法的布尔值
                                hasShuttle:
                                  typeof item.hasShuttle === "boolean"
                                    ? item.hasShuttle
                                    : false,
                                hasCanteen:
                                  typeof item.hasCanteen === "boolean"
                                    ? item.hasCanteen
                                    : false,
                              });

                              // 设置国家
                              handleCountryChange(item.countryCode);

                              // 关闭历史记录面板
                              setShowHistory(false);
                            }}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            title={t("restore_history")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                          <Link
                            href={{
                              pathname: "/share",
                              query: {
                                value: item.value,
                                assessment: item.assessment, // 传递翻译键而不是文本
                                assessmentColor: item.assessmentColor,
                                cityFactor: item.cityFactor,
                                workHours: item.workHours,
                                commuteHours: item.commuteHours,
                                restTime: item.restTime,
                                dailySalary: item.dailySalary,
                                isYuan:
                                  item.countryCode !== "CN" ? "false" : "true",
                                workDaysPerYear: item.workDaysPerYear,
                                workDaysPerWeek: item.workDaysPerWeek,
                                wfhDaysPerWeek: item.wfhDaysPerWeek,
                                annualLeave: item.annualLeave,
                                paidSickLeave: item.paidSickLeave,
                                publicHolidays: item.publicHolidays,
                                workEnvironment: item.workEnvironment,
                                leadership: item.leadership,
                                teamwork: item.teamwork,
                                degreeType: item.degreeType,
                                schoolType: item.schoolType,
                                education: item.education,
                                homeTown: item.homeTown,
                                shuttle: item.shuttle,
                                canteen: item.canteen,
                                workYears: item.workYears,
                                jobStability: item.jobStability,
                                bachelorType: item.bachelorType,
                                countryCode: item.countryCode,
                                countryName: getCountryName(item.countryCode),
                                hasShuttle: item.hasShuttle,
                                hasCanteen: item.hasCanteen,
                              },
                            }}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title={t("delete_history")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="text-gray-400 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto opacity-30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("no_history")}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {t("history_notice")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mb-2">
          <LanguageSwitcher />
        </div>

        {/* 访问统计 - 仅在客户端渲染 */}
        {isBrowser && (
          <div className="mt-1 text-xs text-gray-400 dark:text-gray-600 flex justify-center gap-4">
            <span
              id="busuanzi_container_site_pv"
              className={`transition-opacity duration-300 ${
                visitorVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("visits")}: <span id="busuanzi_value_site_pv"></span>
            </span>
            <span
              id="busuanzi_container_site_uv"
              className={`transition-opacity duration-300 ${
                visitorVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("visitors")}: <span id="busuanzi_value_site_uv"></span>
            </span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/30">
        <div className="p-6 space-y-8">
          {/* 薪资与工作时间 section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCountry !== "CN"
                  ? `${t("annual_salary")}(${getCurrencySymbol(
                      selectedCountry
                    )})`
                  : t("annual_salary_cny")}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Wallet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder={
                    selectedCountry !== "CN"
                      ? `${t("salary_placeholder")} ${getCurrencySymbol(
                          selectedCountry
                        )}`
                      : t("salary_placeholder_cny")
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("country_selection")}
                <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                  ?
                  <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                    {t("ppp_tooltip")}
                  </span>
                </span>
              </label>
              <select
                id="country"
                name="country"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {Object.keys(pppFactors)
                  .sort((a, b) => {
                    // 确保中国始终排在第一位
                    if (a === "CN") return -1;
                    if (b === "CN") return 1;
                    return new Intl.Collator(["zh", "ja", "en"]).compare(
                      getCountryName(a),
                      getCountryName(b)
                    );
                  })
                  .map((code) => (
                    <option key={code} value={code}>
                      {getCountryName(code)} ({pppFactors[code].toFixed(2)})
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("selected_ppp")}:{" "}
                {(pppFactors[selectedCountry] || 4.19).toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("work_days_per_week")}
                </label>
                <input
                  type="number"
                  value={formData.workDaysPerWeek}
                  onChange={(e) =>
                    handleInputChange("workDaysPerWeek", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("wfh_days_per_week")}
                  <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                    ?
                    <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                      {t("wfh_tooltip")}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.workDaysPerWeek}
                  step="1"
                  value={formData.wfhDaysPerWeek}
                  onChange={(e) =>
                    handleInputChange("wfhDaysPerWeek", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("annual_leave")}
                </label>
                <input
                  type="number"
                  value={formData.annualLeave}
                  onChange={(e) =>
                    handleInputChange("annualLeave", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("public_holidays")}
                </label>
                <input
                  type="number"
                  value={formData.publicHolidays}
                  onChange={(e) =>
                    handleInputChange("publicHolidays", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("paid_sick_leave")}
                </label>
                <input
                  type="number"
                  value={formData.paidSickLeave}
                  onChange={(e) =>
                    handleInputChange("paidSickLeave", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("work_hours")}
                  <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                    ?
                    <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                      {t("work_hours_tooltip")}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.workHours}
                  onChange={(e) =>
                    handleInputChange("workHours", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("commute_hours")}
                  <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                    ?
                    <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                      {t("commute_tooltip")}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.commuteHours}
                  onChange={(e) =>
                    handleInputChange("commuteHours", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("rest_time")}
                </label>
                <input
                  type="number"
                  value={formData.restTime}
                  onChange={(e) =>
                    handleInputChange("restTime", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

          {/* 环境系数 */}
          <div className="space-y-4">
            {/* 学历和工作年限 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("education_level")}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {t("degree_type")}
                    </label>
                    <select
                      value={formData.degreeType}
                      onChange={(e) =>
                        handleInputChange("degreeType", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="belowBachelor">
                        {t("below_bachelor")}
                      </option>
                      <option value="bachelor">{t("bachelor")}</option>
                      <option value="masters">{t("masters")}</option>
                      <option value="phd">{t("phd")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {t("school_type")}
                    </label>
                    <select
                      value={formData.schoolType}
                      onChange={(e) =>
                        handleInputChange("schoolType", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      disabled={formData.degreeType === "belowBachelor"}
                    >
                      <option value="secondTier">
                        {t("school_second_tier")}
                      </option>
                      {formData.degreeType === "bachelor" ? (
                        <>
                          <option value="firstTier">
                            {t("school_first_tier_bachelor")}
                          </option>
                          <option value="elite">
                            {t("school_elite_bachelor")}
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="firstTier">
                            {t("school_first_tier_higher")}
                          </option>
                          <option value="elite">
                            {t("school_elite_higher")}
                          </option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* 硕士显示本科背景选项 */}
                {formData.degreeType === "masters" && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {t("bachelor_background")}
                    </label>
                    <select
                      value={formData.bachelorType}
                      onChange={(e) =>
                        handleInputChange("bachelorType", e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="secondTier">
                        {t("school_second_tier")}
                      </option>
                      <option value="firstTier">
                        {t("school_first_tier_bachelor")}
                      </option>
                      <option value="elite">
                        {t("school_elite_bachelor")}
                      </option>
                    </select>
                  </div>
                )}
              </div>

              {/* 工作年限选择 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("work_years")}
                </label>
                <select
                  value={formData.workYears}
                  onChange={(e) =>
                    handleInputChange("workYears", e.target.value)
                  }
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="0">{t("fresh_graduate")}</option>
                  <option value="1">{t("years_1_3")}</option>
                  <option value="2">{t("years_3_5")}</option>
                  <option value="4">{t("years_5_8")}</option>
                  <option value="6">{t("years_8_10")}</option>
                  <option value="10">{t("years_10_12")}</option>
                  <option value="15">{t("years_above_12")}</option>
                </select>
              </div>
            </div>

            {/* 添加工作类型RadioGroup */}
            <RadioGroup
              label={t("job_stability")}
              name="jobStability"
              value={formData.jobStability}
              onChange={handleInputChange}
              options={[
                { label: t("job_government"), value: "government" },
                { label: t("job_state"), value: "state" },
                { label: t("job_foreign"), value: "foreign" },
                { label: t("job_private"), value: "private" },
                { label: t("job_dispatch"), value: "dispatch" },
                { label: t("job_freelance"), value: "freelance" },
              ]}
            />

            <RadioGroup
              label={t("work_environment")}
              name="workEnvironment"
              value={formData.workEnvironment}
              onChange={handleInputChange}
              options={[
                { label: t("env_remote"), value: "0.8" },
                { label: t("env_factory"), value: "0.9" },
                { label: t("env_normal"), value: "1.0" },
                { label: t("env_cbd"), value: "1.1" },
              ]}
            />

            <RadioGroup
              label={t("city_factor")}
              name="cityFactor"
              value={formData.cityFactor}
              onChange={handleInputChange}
              options={[
                { label: t("city_tier1"), value: "0.70" },
                { label: t("city_newtier1"), value: "0.80" },
                { label: t("city_tier2"), value: "1.0" },
                { label: t("city_tier3"), value: "1.10" },
                { label: t("city_tier4"), value: "1.25" },
                { label: t("city_county"), value: "1.40" },
                { label: t("city_town"), value: "1.50" },
              ]}
            />

            <RadioGroup
              label={t("hometown")}
              name="homeTown"
              value={formData.homeTown}
              onChange={handleInputChange}
              options={[
                { label: t("not_hometown"), value: "no" },
                { label: t("is_hometown"), value: "yes" },
              ]}
            />

            <RadioGroup
              label={t("leadership")}
              name="leadership"
              value={formData.leadership}
              onChange={handleInputChange}
              options={[
                { label: t("leader_bad"), value: "0.7" },
                { label: t("leader_strict"), value: "0.9" },
                { label: t("leader_normal"), value: "1.0" },
                { label: t("leader_good"), value: "1.1" },
                { label: t("leader_favorite"), value: "1.3" },
              ]}
            />

            <RadioGroup
              label={t("teamwork")}
              name="teamwork"
              value={formData.teamwork}
              onChange={handleInputChange}
              options={[
                { label: t("team_bad"), value: "0.9" },
                { label: t("team_normal"), value: "1.0" },
                { label: t("team_good"), value: "1.1" },
                { label: t("team_excellent"), value: "1.2" },
              ]}
            />

            {/* 班车和食堂选项作为加分项，加上勾选框控制 */}
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <input
                  id="hasShuttle"
                  type="checkbox"
                  checked={formData.hasShuttle === true}
                  onChange={(e) =>
                    handleInputChange("hasShuttle", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="hasShuttle"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("shuttle")}
                </label>
              </div>

              {formData.hasShuttle && (
                <RadioGroup
                  label=""
                  name="shuttle"
                  value={formData.shuttle}
                  onChange={handleInputChange}
                  options={[
                    { label: t("shuttle_none"), value: "1.0" },
                    { label: t("shuttle_inconvenient"), value: "0.9" },
                    { label: t("shuttle_convenient"), value: "0.7" },
                    { label: t("shuttle_direct"), value: "0.5" },
                  ]}
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <input
                  id="hasCanteen"
                  type="checkbox"
                  checked={formData.hasCanteen === true}
                  onChange={(e) =>
                    handleInputChange("hasCanteen", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="hasCanteen"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("canteen")}
                </label>
              </div>

              {formData.hasCanteen && (
                <RadioGroup
                  label=""
                  name="canteen"
                  value={formData.canteen}
                  onChange={handleInputChange}
                  options={[
                    { label: t("canteen_none"), value: "1.0" },
                    { label: t("canteen_average"), value: "1.05" },
                    { label: t("canteen_good"), value: "1.1" },
                    { label: t("canteen_excellent"), value: "1.15" },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 结果卡片优化 */}
      <div
        ref={shareResultsRef}
        className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-inner"
      >
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("working_days_per_year")}
            </div>
            <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
              {calculateWorkingDays()}
              {t("days_unit")}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("average_daily_salary")}
            </div>
            <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
              {getCurrencySymbol(selectedCountry)}
              {getDisplaySalary()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("job_value")}
            </div>
            <div
              className={`text-2xl font-semibold mt-1 ${
                getValueAssessment().color
              }`}
            >
              {value.toFixed(2)}
              <span className="text-base ml-2">
                ({getValueAssessment().text})
              </span>
            </div>
          </div>
        </div>

        {/* 修改分享按钮为链接到分享页面，并保存到历史 */}
        <div className="mt-6 flex justify-end">
          <Link
            href={{
              pathname: "/share",
              query: {
                value: value.toFixed(2),
                assessment: getValueAssessmentKey(),
                assessmentColor: getValueAssessment().color,
                cityFactor: formData.cityFactor,
                workHours: formData.workHours,
                commuteHours: formData.commuteHours,
                restTime: formData.restTime,
                dailySalary: getDisplaySalary(),
                isYuan: selectedCountry !== "CN" ? "false" : "true",
                workDaysPerYear: calculateWorkingDays().toString(),
                workDaysPerWeek: formData.workDaysPerWeek,
                wfhDaysPerWeek: formData.wfhDaysPerWeek,
                annualLeave: formData.annualLeave,
                paidSickLeave: formData.paidSickLeave,
                publicHolidays: formData.publicHolidays,
                workEnvironment: formData.workEnvironment,
                leadership: formData.leadership,
                teamwork: formData.teamwork,
                degreeType: formData.degreeType,
                schoolType: formData.schoolType,
                education: formData.education,
                homeTown: formData.homeTown,
                shuttle: formData.hasShuttle ? formData.shuttle : "1.0",
                canteen: formData.hasCanteen ? formData.canteen : "1.0",
                workYears: formData.workYears,
                jobStability: formData.jobStability,
                bachelorType: formData.bachelorType,
                countryCode: selectedCountry,
                countryName: getCountryName(selectedCountry),
                currencySymbol: getCurrencySymbol(selectedCountry),
                hasShuttle: formData.hasShuttle,
                hasCanteen: formData.hasCanteen,
              },
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                formData.salary
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
              }`}
            onClick={() => (formData.salary ? saveToHistory() : null)}
          >
            <FileText className="w-4 h-4" />
            {t("view_report")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
