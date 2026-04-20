'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import Landing from './landing';
import ErrorBoundary from '../components/ErrorBoundary';

const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Penang', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu', 'KL', 'Putrajaya', 'Labuan',
];

const UI = {
  en: {
    title: 'Find.ai',
    subtitle: 'Your property advisor',
    subtitleActive: 'Thinking with you',
    welcomeTitle: "What's your property situation?",
    welcomeDesc: "Describe it in your own words — I'll find the law, steps to take, and a clause for your agreement.",
    welcomeReturning: "Welcome back! Your profile is loaded.",
    placeholder: 'Describe your situation...',
    placeholderActive: 'Ask a follow-up...',
    placeholderListening: 'Listening...',
    send: 'Send',
    disclaimer: 'AI guidance based on Malaysian law — not a substitute for legal counsel',
    privacy: 'Conversations stay on your device',
    langToggle: 'BM',
    analyzing: 'Analyzing...',
    commonSituations: 'Try asking about',
    voiceHint: 'Tap mic to speak in any language',
    profileTitle: 'Quick setup',
    profileDesc: 'So I can give you the right answers',
    profileRole: 'I am a...',
    profileState: 'Property state',
    profileType: 'Property type',
    profileRent: 'Monthly rent (RM)',
    profileSkip: 'Skip for now',
    profileSave: 'Continue',
    profileEdit: 'Edit profile',
    roles: { landlord: 'Landlord', tenant: 'Tenant', buyer: 'Buyer' },
    types: { condo: 'Condo / Apt', landed: 'Landed', shop: 'Commercial' },
    previousChat: 'You have a previous conversation',
    continueChat: 'Continue',
    newChat: 'New Chat',
    tools: 'Tools',
    questions: {
      landlord: [
        { icon: '💸', title: "Tenant didn't pay rent", sub: 'Demand letter & legal steps', text: "My tenant hasn't paid rent for 2 months. What are my legal options?" },
        { icon: '🚪', title: 'How to evict legally', sub: 'Step-by-step process', text: "How do I legally evict my tenant?" },
        { icon: '📄', title: 'Stamp duty on tenancy', sub: 'Calculate & file correctly', text: "How much stamp duty do I need to pay for a RM2,500/month tenancy agreement?" },
        { icon: '🛡️', title: 'Protect my property', sub: 'Clauses every landlord needs', text: "What clauses should I include in my tenancy agreement to protect myself?" },
      ],
      tenant: [
        { icon: '🔒', title: 'Deposit not returned', sub: 'Your rights & evidence needed', text: "My landlord won't return my deposit. It's been 3 weeks since I moved out. What can I do?" },
        { icon: '🔧', title: 'Who pays for repairs?', sub: 'Landlord vs tenant duties', text: "There's a ceiling leak in my rental. Who is responsible — landlord or tenant?" },
        { icon: '📈', title: 'Landlord raising rent', sub: 'Can they do that mid-lease?', text: "My landlord wants to increase rent mid-lease. Is that legal?" },
        { icon: '🚪', title: 'End lease early', sub: 'Penalties & notice period', text: "I need to break my lease early. What happens to my deposit?" },
      ],
      buyer: [
        { icon: '🏠', title: 'Buying subsale property', sub: 'Full process step by step', text: "I want to buy a secondhand condo. What's the full process?" },
        { icon: '🔨', title: 'Developer defects', sub: 'Claim within DLP period', text: "My new house has defects. The developer is not fixing them. What can I do?" },
        { icon: '🌍', title: 'Foreign buyer rules', sub: 'Thresholds & restrictions', text: "I'm a foreigner. Can I buy property in Malaysia? What are the restrictions?" },
        { icon: '⚖️', title: 'Auction property risks', sub: 'Lelong dos and don\'ts', text: "Is it safe to buy a lelong property? What should I watch out for?" },
      ],
      default: [
        { icon: '💸', title: "Tenant didn't pay rent", sub: 'Demand letter & legal steps', text: "My tenant hasn't paid rent. What can I do?" },
        { icon: '🔒', title: 'Deposit not returned', sub: 'Your rights & evidence needed', text: "My landlord won't return my deposit. What can I do?" },
        { icon: '🏠', title: 'Buying subsale property', sub: 'Full process step by step', text: "I want to buy a secondhand condo. What's the full process?" },
        { icon: '🔧', title: 'Who pays for repairs?', sub: 'Landlord vs tenant duties', text: "Who is responsible for repairs — landlord or tenant?" },
      ],
    },
    copied: 'Copied!',
    saved: 'Chat saved!',
    followUps: 'Related questions',
    installTitle: 'Add to Home Screen',
    installDesc: 'Get the full app experience',
    installBtn: 'Install',
    installDismiss: 'Not now',
    feedbackThanks: 'Thanks for your feedback!',
  },
  bm: {
    title: 'Find.ai',
    subtitle: 'Penasihat hartanah anda',
    subtitleActive: 'Sedang membantu anda',
    welcomeTitle: 'Apa situasi hartanah anda?',
    welcomeDesc: 'Ceritakan — saya akan cari undang-undang, langkah tindakan, dan klausa untuk perjanjian anda.',
    welcomeReturning: 'Selamat kembali! Profil anda telah dimuat.',
    placeholder: 'Ceritakan situasi anda...',
    placeholderActive: 'Tanya soalan susulan...',
    placeholderListening: 'Mendengar...',
    send: 'Hantar',
    disclaimer: 'Panduan AI berdasarkan undang-undang Malaysia — bukan pengganti nasihat guaman',
    privacy: 'Perbualan kekal dalam peranti anda',
    langToggle: '中文',
    analyzing: 'Menganalisis...',
    commonSituations: 'Cuba tanya tentang',
    voiceHint: 'Ketik mikrofon untuk bercakap',
    profileTitle: 'Persediaan pantas',
    profileDesc: 'Supaya saya beri jawapan yang tepat',
    profileRole: 'Saya adalah...',
    profileState: 'Negeri hartanah',
    profileType: 'Jenis hartanah',
    profileRent: 'Sewa bulanan (RM)',
    profileSkip: 'Langkau',
    profileSave: 'Teruskan',
    profileEdit: 'Edit profil',
    roles: { landlord: 'Tuan Rumah', tenant: 'Penyewa', buyer: 'Pembeli' },
    types: { condo: 'Kondo / Apt', landed: 'Rumah', shop: 'Komersial' },
    previousChat: 'Anda ada perbualan sebelum ini',
    continueChat: 'Teruskan',
    newChat: 'Chat Baru',
    tools: 'Alat',
    questions: {
      landlord: [
        { icon: '💸', title: 'Penyewa tak bayar sewa', sub: 'Surat tuntutan & langkah undang-undang', text: 'Penyewa tak bayar sewa 2 bulan, apa boleh buat?' },
        { icon: '🚪', title: 'Cara usir penyewa', sub: 'Proses langkah demi langkah', text: 'Macam mana nak usir penyewa secara sah?' },
        { icon: '📄', title: 'Duti setem penyewaan', sub: 'Kira & failkan dengan betul', text: 'Berapa duti setem untuk perjanjian sewa RM2,500 sebulan?' },
        { icon: '🛡️', title: 'Lindungi hartanah saya', sub: 'Klausa penting untuk tuan rumah', text: 'Apa klausa yang perlu ada dalam perjanjian sewa untuk lindungi saya?' },
      ],
      tenant: [
        { icon: '🔒', title: 'Deposit tak dipulangkan', sub: 'Hak anda & bukti diperlukan', text: 'Tuan rumah tak pulangkan deposit saya dah 3 minggu. Apa boleh buat?' },
        { icon: '🔧', title: 'Siapa bayar pembaikan?', sub: 'Tugas tuan rumah vs penyewa', text: 'Siling bocor di rumah sewa. Siapa bertanggungjawab?' },
        { icon: '📈', title: 'Sewa naik harga', sub: 'Boleh ke naikkan tengah kontrak?', text: 'Tuan rumah nak naikkan sewa tengah kontrak. Sah ke?' },
        { icon: '🚪', title: 'Tamat kontrak awal', sub: 'Penalti & tempoh notis', text: 'Saya nak tamatkan sewa awal. Apa jadi deposit saya?' },
      ],
      buyer: [
        { icon: '🏠', title: 'Beli rumah subsale', sub: 'Proses penuh langkah demi langkah', text: 'Saya nak beli kondo secondhand. Apa prosesnya?' },
        { icon: '🔨', title: 'Kecacatan developer', sub: 'Tuntut dalam tempoh DLP', text: 'Rumah baru ada kecacatan. Developer tak nak baiki. Apa boleh buat?' },
        { icon: '🌍', title: 'Pembeli asing', sub: 'Had minimum & sekatan', text: 'Boleh ke orang asing beli hartanah di Malaysia?' },
        { icon: '⚖️', title: 'Risiko lelong', sub: 'Perkara perlu tahu', text: 'Selamat ke beli rumah lelong? Apa risiko?' },
      ],
      default: [
        { icon: '💸', title: 'Penyewa tak bayar sewa', sub: 'Surat tuntutan & langkah undang-undang', text: 'Penyewa tak bayar sewa, apa boleh buat?' },
        { icon: '🔒', title: 'Deposit tak dipulangkan', sub: 'Hak anda & bukti diperlukan', text: 'Tuan rumah simpan deposit saya, boleh ke?' },
        { icon: '🏠', title: 'Beli rumah subsale', sub: 'Proses penuh langkah demi langkah', text: 'Saya nak beli kondo secondhand. Apa prosesnya?' },
        { icon: '🔧', title: 'Siapa bayar pembaikan?', sub: 'Tugas tuan rumah vs penyewa', text: 'Siapa bertanggungjawab untuk pembaikan?' },
      ],
    },
    copied: 'Disalin!',
    saved: 'Chat disimpan!',
    followUps: 'Soalan berkaitan',
    installTitle: 'Tambah ke Skrin Utama',
    installDesc: 'Pengalaman penuh aplikasi',
    installBtn: 'Pasang',
    installDismiss: 'Nanti',
    feedbackThanks: 'Terima kasih atas maklum balas!',
  },
  zh: {
    title: 'Find.ai',
    subtitle: '您的房产顾问',
    subtitleActive: '正在为您分析',
    welcomeTitle: '您的房产情况是什么？',
    welcomeDesc: '用您自己的话描述 — 我会为您找到法律依据、行动步骤和协议条款。',
    welcomeReturning: '欢迎回来！您的资料已加载。',
    placeholder: '描述您的情况...',
    placeholderActive: '继续提问...',
    placeholderListening: '正在聆听...',
    send: '发送',
    disclaimer: '基于马来西亚法律的AI指导 — 不能替代专业法律意见',
    privacy: '对话保留在您的设备上',
    langToggle: 'EN',
    analyzing: '分析中...',
    commonSituations: '试试问这些',
    voiceHint: '点击麦克风用任何语言提问',
    profileTitle: '快速设置',
    profileDesc: '帮助我给您准确的建议',
    profileRole: '我是...',
    profileState: '房产所在州',
    profileType: '房产类型',
    profileRent: '月租金 (RM)',
    profileSkip: '跳过',
    profileSave: '继续',
    profileEdit: '编辑资料',
    roles: { landlord: '房东', tenant: '租客', buyer: '买家' },
    types: { condo: '公寓', landed: '排屋', shop: '商铺' },
    previousChat: '您有之前的对话',
    continueChat: '继续',
    newChat: '新对话',
    tools: '工具',
    questions: {
      landlord: [
        { icon: '💸', title: '租客拖欠租金', sub: '催款信和法律步骤', text: '租客已经2个月没付租金了，我该怎么办？' },
        { icon: '🚪', title: '如何合法驱逐', sub: '分步骤流程', text: '怎样合法地驱逐租客？' },
        { icon: '📄', title: '租约印花税', sub: '计算和申报', text: '月租RM2,500的租约需要交多少印花税？' },
        { icon: '🛡️', title: '保护我的房产', sub: '房东必备条款', text: '租约里应该加什么条款来保护自己？' },
      ],
      tenant: [
        { icon: '🔒', title: '押金不退还', sub: '您的权利和所需证据', text: '搬走3周了房东还不退押金，我该怎么办？' },
        { icon: '🔧', title: '维修费谁出？', sub: '房东vs租客责任', text: '出租屋天花板漏水，谁负责维修？' },
        { icon: '📈', title: '房东涨租金', sub: '合同期内能涨吗？', text: '房东要在合同期内涨租金，合法吗？' },
        { icon: '🚪', title: '提前退租', sub: '违约金和押金', text: '我想提前退租，押金会怎样？' },
      ],
      buyer: [
        { icon: '🏠', title: '买二手房', sub: '完整流程步骤', text: '我想买一套二手公寓，流程是什么？' },
        { icon: '🔨', title: '开发商质量问题', sub: 'DLP期内索赔', text: '新房有质量问题开发商不修，我该怎么办？' },
        { icon: '🌍', title: '外国人买房', sub: '门槛和限制', text: '外国人能在马来西亚买房吗？有什么限制？' },
        { icon: '⚖️', title: '拍卖房风险', sub: '注意事项', text: '买拍卖房安全吗？要注意什么？' },
      ],
      default: [
        { icon: '💸', title: '租客拖欠租金', sub: '催款信和法律步骤', text: '租客没付租金，我该怎么办？' },
        { icon: '🔒', title: '押金不退还', sub: '您的权利和所需证据', text: '房东扣住我的押金不退，合法吗？' },
        { icon: '🏠', title: '买二手房', sub: '完整流程步骤', text: '我想买一套二手公寓，流程是什么？' },
        { icon: '🔧', title: '维修费谁出？', sub: '房东vs租客责任', text: '维修费应该由谁承担？' },
      ],
    },
    copied: '已复制!',
    saved: '对话已保存!',
    followUps: '相关问题',
    installTitle: '添加到主屏幕',
    installDesc: '获得完整应用体验',
    installBtn: '安装',
    installDismiss: '以后再说',
    feedbackThanks: '感谢您的反馈！',
  },
};

// Logo — clean dark gradient
const Logo = ({ size = 32 }) => (
  <div className="flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size, minWidth: size, background: 'linear-gradient(135deg, #0f172a, #334155)', borderRadius: size * 0.32, boxShadow: '0 2px 8px rgba(15,23,42,0.12)' }}>
    <span className="text-white font-bold" style={{ fontSize: size * 0.38 }}>F</span>
  </div>
);

// Icons
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);
const NewChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
);
const ThumbUpIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
  </svg>
);
const ThumbDownIcon = ({ filled }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
  </svg>
);

// Format AI output into rich interactive cards
const fmt = (text) => {
  if (!text) return '';
  let h = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  h = h.replace(/<br\/>---<br\/>/g, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:14px 0"/>');
  h = h.replace(/<br\/>-{3,}<br\/>/g, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:14px 0"/>');
  h = h.replace(/##\s+(.*?)(?=<br\/>|$)/g, '<div style="font-size:14px;font-weight:700;color:#0f172a;margin:16px 0 8px;letter-spacing:-0.01em">$1</div>');

  // ⚡ Legal Bridge — animated gradient card
  h = h.replace(
    /⚡(.*?)(?=<br\/><br\/>|<br\/>⚖️|<br\/>✅|$)/gs,
    (match) => {
      const content = match.replace(/^⚡\s*/, '');
      return `<div class="rich-card" style="margin:12px 0;padding:14px 16px;background:linear-gradient(135deg,#fef2f2,#eff6ff);border:1px solid #e2e8f0;border-left:3px solid #dc2626;border-right:3px solid #2563eb;border-radius:14px;position:relative;overflow:hidden">
        <div style="position:absolute;top:0;right:0;width:60px;height:60px;background:radial-gradient(circle,rgba(59,130,246,0.06),transparent);border-radius:0 14px 0 60px"></div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
          <span style="font-size:14px">⚡</span>
          <span style="font-size:10px;font-weight:700;letter-spacing:0.5px;color:#64748b;text-transform:uppercase">Legal Bridge</span>
        </div>
        <div style="font-size:12.5px;line-height:1.65;color:#334155">${content}</div></div>`;
    }
  );

  // ⚖️ Law citation — expandable tag with glow
  h = h.replace(
    /⚖️\s*(.*?)(?=<br\/>|$)/g,
    (_, content) => `<div class="rich-card law-card" style="margin:10px 0;padding:10px 14px;background:linear-gradient(135deg,#eff6ff,#f0f7ff);border:1px solid #bfdbfe;border-radius:12px;position:relative;overflow:hidden;cursor:default">
      <div style="position:absolute;top:-10px;right:-10px;width:40px;height:40px;background:radial-gradient(circle,rgba(59,130,246,0.08),transparent);border-radius:50%"></div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#3b82f6,#60a5fa);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(59,130,246,0.2)">
          <span style="font-size:13px">⚖️</span>
        </div>
        <div>
          <div style="font-size:9px;font-weight:700;color:#93c5fd;letter-spacing:0.5px;text-transform:uppercase">Legal Basis</div>
          <div style="font-size:12.5px;color:#1e40af;font-weight:600;line-height:1.4;margin-top:1px">${content}</div>
        </div>
      </div></div>`
  );

  // ✅ Action steps — interactive checklist with progress bar
  const renderChecklist = (title, steps) => {
    const items = [];
    const parts = steps.split(/<br\/>/);
    for (const p of parts) {
      const m = p.match(/^\s*(\d+)\.\s*(.*)/);
      if (m) items.push({ num: m[1], text: m[2] });
      else if (items.length > 0 && p.trim()) items[items.length - 1].text += ' ' + p.trim();
    }
    if (items.length === 0) return `<div class="rich-card" style="margin:10px 0;padding:14px;background:linear-gradient(135deg,#f0fdf4,#f8fdf8);border:1px solid #bbf7d0;border-radius:14px"><div style="font-size:12.5px;font-weight:700;color:#166534">✅ ${title || steps}</div></div>`;

    // Progress bar
    const progressHtml = `<div style="width:100%;height:3px;background:#dcfce7;border-radius:2px;margin:8px 0 4px;overflow:hidden">
      <div class="checklist-progress" style="width:0%;height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);border-radius:2px;transition:width 0.4s ease"></div></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:9px;font-weight:600;color:#86efac;letter-spacing:0.3px">0 of ${items.length} done</span>
      </div>`;

    const stepsHtml = items.map((it, idx) =>
      `<label class="checklist-item" style="display:flex;gap:10px;align-items:flex-start;margin-top:8px;padding:8px 10px;border-radius:10px;cursor:pointer;transition:all 0.15s ease;border:1px solid transparent" onmouseover="this.style.background='rgba(34,197,94,0.04)';this.style.borderColor='#dcfce7'" onmouseout="this.style.background='transparent';this.style.borderColor='transparent'">
        <input type="checkbox" class="step-check" data-total="${items.length}" style="display:none" onchange="
          var card=this.closest('.checklist-card');
          var checks=card.querySelectorAll('.step-check');
          var done=0;checks.forEach(function(c){if(c.checked)done++});
          var bar=card.querySelector('.checklist-progress');
          bar.style.width=(done/${items.length}*100)+'%';
          card.querySelector('.check-count').textContent=done+' of ${items.length} done';
          var circle=this.parentElement.querySelector('.check-circle');
          if(this.checked){circle.style.background='#22c55e';circle.style.borderColor='#22c55e';circle.innerHTML='<svg width=10 height=10 viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;white&quot; stroke-width=&quot;3&quot;><polyline points=&quot;20 6 9 17 4 12&quot;/></svg>';this.parentElement.querySelector('.step-text').style.textDecoration='line-through';this.parentElement.querySelector('.step-text').style.color='#94a3b8'}
          else{circle.style.background='#f0fdf4';circle.style.borderColor='#bbf7d0';circle.innerHTML='<span style=&quot;font-size:9px;font-weight:700;color:#16a34a&quot;>${it.num}</span>';this.parentElement.querySelector('.step-text').style.textDecoration='none';this.parentElement.querySelector('.step-text').style.color='#334155'}
        "/>
        <div class="check-circle" style="min-width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;flex-shrink:0;transition:all 0.2s ease">
          <span style="font-size:9px;font-weight:700;color:#16a34a">${it.num}</span>
        </div>
        <span class="step-text" style="font-size:12.5px;color:#334155;line-height:1.55;transition:all 0.2s ease">${it.text}</span>
      </label>`
    ).join('');

    return `<div class="rich-card checklist-card" style="margin:12px 0;padding:16px;background:linear-gradient(135deg,#f0fdf4,#f8fdf8);border:1px solid #bbf7d0;border-radius:14px;position:relative;overflow:hidden">
      <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:radial-gradient(circle,rgba(34,197,94,0.06),transparent);border-radius:50%"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px">
        <div style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#22c55e,#4ade80);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(34,197,94,0.2)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span style="font-size:12.5px;font-weight:700;color:#166534">${title || 'Action Steps'}</span>
        <span style="margin-left:auto;font-size:9px;padding:3px 8px;background:#dcfce7;color:#166534;border-radius:6px;font-weight:600">${items.length} steps</span>
      </div>
      ${progressHtml.replace('0 of', '<span class="check-count">0 of')}
      ${stepsHtml}</div>`;
  };

  h = h.replace(
    /✅\s*<strong>(.*?)<\/strong>(.*?)(?=<br\/><br\/>|<br\/>🚫|<br\/>💰|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|$)/gs,
    (_, title, steps) => renderChecklist(title, steps)
  );
  h = h.replace(
    /✅\s*(?!<strong>)(.*?)(?=<br\/><br\/>|<br\/>🚫|<br\/>💰|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|$)/gs,
    (_, steps) => {
      if (steps.trim().length < 3) return `✅ ${steps}`;
      const parts = steps.split(/<br\/>/);
      let firstLine = '';
      let hasNumbers = false;
      for (const p of parts) { if (p.match(/^\s*\d+\.\s/)) hasNumbers = true; else if (!firstLine && p.trim()) firstLine = p.trim(); }
      return hasNumbers ? renderChecklist(firstLine, steps) : `<div class="rich-card" style="margin:10px 0;padding:14px;background:linear-gradient(135deg,#f0fdf4,#f8fdf8);border:1px solid #bbf7d0;border-radius:14px"><div style="font-size:12.5px;font-weight:700;color:#166534;margin-bottom:4px">✅ ${steps}</div></div>`;
    }
  );

  // 🚫 Warning — pulsing alert card
  h = h.replace(
    /🚫\s*(.*?)(?=<br\/>|$)/g,
    (_, content) => `<div class="rich-card" style="margin:10px 0;padding:11px 14px;background:linear-gradient(135deg,#fef2f2,#fff5f5);border:1px solid #fecaca;border-radius:12px;display:flex;align-items:center;gap:10px;position:relative;overflow:hidden">
      <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ef4444,#f87171)"></div>
      <div style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#ef4444,#f87171);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(239,68,68,0.2)">
        <span style="font-size:12px;color:white;font-weight:700">!</span>
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;color:#fca5a5;letter-spacing:0.5px;text-transform:uppercase">Warning</div>
        <div style="font-size:12.5px;color:#991b1b;font-weight:500;line-height:1.45;margin-top:1px">${content}</div>
      </div></div>`
  );

  // 💰 Cost — card with amount highlight
  h = h.replace(
    /💰\s*<strong>(.*?)<\/strong>(.*?)(?=<br\/><br\/>|<br\/>🚫|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|<br\/>✅|$)/gs,
    (_, title, body) => {
      const lines = body.split(/<br\/>/).filter(l => l.trim());
      const rowsHtml = lines.map(l => {
        const clean = l.replace(/^-\s*/, '').trim();
        // Try to detect "label: value" or "label — value" patterns for table display
        const colonMatch = clean.match(/^(.+?):\s*(.+)$/);
        const dashMatch = clean.match(/^(.+?)\s*[—–-]\s*(RM[\d,.]+.*)$/i);
        if (colonMatch) return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(251,191,36,0.15)"><span style="font-size:12px;color:#92400e">${colonMatch[1].trim()}</span><span style="font-size:12px;font-weight:700;color:#78350f;font-variant-numeric:tabular-nums">${colonMatch[2].trim()}</span></div>`;
        if (dashMatch) return `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(251,191,36,0.15)"><span style="font-size:12px;color:#92400e">${dashMatch[1].trim()}</span><span style="font-size:12px;font-weight:700;color:#78350f;font-variant-numeric:tabular-nums">${dashMatch[2].trim()}</span></div>`;
        return `<div style="font-size:12px;color:#92400e;padding:4px 0">• ${clean}</div>`;
      }).join('');
      return `<div class="rich-card" style="margin:12px 0;padding:16px;background:linear-gradient(135deg,#fffbeb,#fefce8);border:1px solid #fde68a;border-radius:14px;position:relative;overflow:hidden">
        <div style="position:absolute;top:-15px;right:-15px;width:60px;height:60px;background:radial-gradient(circle,rgba(245,158,11,0.08),transparent);border-radius:50%"></div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 6px rgba(245,158,11,0.2)">
            <span style="font-size:12px">💰</span>
          </div>
          <span style="font-size:12.5px;font-weight:700;color:#92400e">${title}</span>
        </div>
        <div style="background:rgba(255,255,255,0.5);border-radius:10px;padding:8px 12px">${rowsHtml}</div></div>`;
    }
  );
  // 💰 single line
  h = h.replace(
    /💰\s*(.*?)(?=<br\/>|$)/g,
    (_, content) => {
      // Highlight RM amounts
      const highlighted = content.replace(/(RM[\d,.]+)/g, '<span style="font-weight:700;color:#78350f;background:rgba(251,191,36,0.15);padding:1px 5px;border-radius:4px">$1</span>');
      return `<div class="rich-card" style="margin:10px 0;display:flex;align-items:center;gap:8px;padding:10px 14px;background:linear-gradient(135deg,#fffbeb,#fefce8);border:1px solid #fde68a;border-radius:12px">
        <span style="font-size:14px">💰</span><span style="font-size:12.5px;color:#92400e;font-weight:500">${highlighted}</span></div>`;
    }
  );

  // 📋 Clause — copy-ready card with action
  h = h.replace(
    /📋\s*(?:<strong>)?(.*?)(?:<\/strong>)?:?\s*<br\/>(?:```)?<br\/>([\s\S]*?)(?:```|(?=<br\/><br\/>)|$)/gs,
    (_, title, clause) => {
      const displayClause = clause.replace(/&gt;\s?/g, '').replace(/```/g, '').trim();
      return `<div class="rich-card clause-card" style="margin:12px 0;padding:16px;background:linear-gradient(135deg,#f0f4ff,#f8fafc);border:1px solid #dbeafe;border-left:3px solid #3b82f6;border-radius:14px;position:relative;overflow:hidden">
        <div style="position:absolute;top:-15px;right:-15px;width:60px;height:60px;background:radial-gradient(circle,rgba(59,130,246,0.06),transparent);border-radius:50%"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#3b82f6,#60a5fa);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(59,130,246,0.2)">
              <span style="font-size:11px">📋</span>
            </div>
            <span style="font-size:12px;font-weight:700;color:#1e293b">${title || 'Clause'}</span>
          </div>
          <span style="font-size:9px;padding:3px 8px;background:#dbeafe;color:#1d4ed8;border-radius:6px;font-weight:600;cursor:pointer" onclick="var t=this.parentElement.parentElement.querySelector('.clause-content');navigator.clipboard.writeText(t.innerText);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)">Copy</span>
        </div>
        <div class="clause-content" style="font-size:12.5px;color:#334155;line-height:1.7;padding:12px 14px;background:rgba(255,255,255,0.7);border-radius:10px;border:1px dashed #cbd5e1;font-style:italic">${displayClause}</div></div>`;
    }
  );

  // 📋 old-style
  h = h.replace(
    /📋\s*(?:<strong>)?(.*?)(?:<\/strong>)?.*?<br\/>(&gt;.*?)(?=<br\/><br\/>|$)/gs,
    (_, title, clause) => {
      return `<div class="rich-card clause-card" style="margin:12px 0;padding:16px;background:linear-gradient(135deg,#f0f4ff,#f8fafc);border:1px solid #dbeafe;border-left:3px solid #3b82f6;border-radius:14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <div style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#3b82f6,#60a5fa);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(59,130,246,0.2)">
            <span style="font-size:11px">📋</span>
          </div>
          <span style="font-size:12px;font-weight:700;color:#1e293b">${title || 'Clause'}</span>
        </div>
        <div class="clause-content" style="font-size:12.5px;color:#334155;line-height:1.7;padding:12px 14px;background:rgba(255,255,255,0.7);border-radius:10px;border:1px dashed #cbd5e1;font-style:italic">${clause.replace(/&gt;\s?/g,'')}</div></div>`;
    }
  );

  // 🔒 Verified — premium badge with shield
  h = h.replace(
    /🔒\s*(.*?)(?=<br\/>|$)/g,
    (_, content) => `<div class="rich-card" style="margin:12px 0;padding:12px 16px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:14px;display:flex;align-items:center;gap:10px;position:relative;overflow:hidden">
      <div style="position:absolute;right:12px;top:50%;transform:translateY(-50%);width:40px;height:40px;background:radial-gradient(circle,rgba(34,197,94,0.08),transparent);border-radius:50%"></div>
      <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#22c55e,#4ade80);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(34,197,94,0.25)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;color:#4ade80;letter-spacing:0.5px;text-transform:uppercase">Verified Source</div>
        <div style="font-size:12.5px;color:#15803d;margin-top:2px;font-weight:600;line-height:1.4">${content}</div>
      </div></div>`
  );

  // ⚠️ General guidance
  h = h.replace(
    /⚠️\s*(.*?)(?=<br\/>|$)/g,
    (_, content) => `<div class="rich-card" style="margin:12px 0;padding:12px 16px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:14px;display:flex;align-items:center;gap:10px;position:relative;overflow:hidden">
      <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(245,158,11,0.25)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;color:#fbbf24;letter-spacing:0.5px;text-transform:uppercase">General Guidance</div>
        <div style="font-size:12.5px;color:#b45309;margin-top:2px;font-weight:500;line-height:1.4">${content}</div>
      </div></div>`
  );

  // 🔴 Consult lawyer
  h = h.replace(
    /🔴\s*(.*?)(?=<br\/>|$)/g,
    (_, content) => `<div class="rich-card" style="margin:12px 0;padding:12px 16px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5;border-radius:14px;display:flex;align-items:center;gap:10px;position:relative;overflow:hidden">
      <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ef4444,#dc2626)"></div>
      <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#ef4444,#f87171);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(239,68,68,0.25)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;color:#fca5a5;letter-spacing:0.5px;text-transform:uppercase">Consult a Lawyer</div>
        <div style="font-size:12.5px;color:#dc2626;margin-top:2px;font-weight:500;line-height:1.4">${content}</div>
      </div></div>`
  );

  h = h.replace(/<br\/>\s*-\s+/g, '<br/>• ');
  return h;
};

// Memoized message bubble with feedback
const MessageBubble = memo(function MessageBubble({ id, content, role, isStreaming, isError, streamRef: sRef, onCopy, onShare, onSave, onRetry, onFeedback, feedback }) {
  const html = useMemo(() => fmt(content), [content]);
  const timeStr = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
  }, []);

  return (
    <>
      <div
        ref={sRef || null}
        className={`text-[13.5px] leading-[1.7] ${
          role === 'user'
            ? 'px-4 py-3 text-white rounded-[20px_20px_4px_20px]'
            : `bot-msg px-4 py-3.5 rounded-[4px_20px_20px_20px]${isStreaming ? ' streaming' : ''}`
        }`}
        style={role === 'user'
          ? { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 2px 12px rgba(15,23,42,0.12), 0 1px 3px rgba(15,23,42,0.08)' }
          : isError
            ? { boxShadow: '0 1px 6px rgba(15,23,42,0.04)', color: '#991b1b', background: '#fef2f2', border: '1px solid #fecaca' }
            : { background: '#ffffff', boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.02)', color: '#334155', border: '1px solid #f0f2f5' }
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {isError && onRetry && (
        <button onClick={onRetry}
          className="flex items-center gap-1.5 text-[11px] font-semibold mt-2 px-4 py-2 rounded-xl transition active:scale-95"
          style={{ background: '#0f172a', color: '#fff' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Retry
        </button>
      )}
      {role === 'assistant' && content && !isError && (
        <div className="msg-actions flex items-center gap-0 mt-1.5 pl-0.5">
          {/* Feedback buttons */}
          <button onClick={() => onFeedback && onFeedback(id, 'up')}
            className={`feedback-btn flex items-center gap-1 text-[11px] min-h-[44px] px-2.5 py-2 rounded-lg transition active:scale-95 ${feedback === 'up' ? 'active-up' : ''}`}
            style={{ color: '#cbd5e1' }}>
            <ThumbUpIcon filled={feedback === 'up'} />
          </button>
          <button onClick={() => onFeedback && onFeedback(id, 'down')}
            className={`feedback-btn flex items-center gap-1 text-[11px] min-h-[44px] px-2.5 py-2 rounded-lg transition active:scale-95 ${feedback === 'down' ? 'active-down' : ''}`}
            style={{ color: '#cbd5e1' }}>
            <ThumbDownIcon filled={feedback === 'down'} />
          </button>
          <div style={{ width: 1, height: 14, background: '#e2e8f0', margin: '0 2px' }} />
          <button onClick={onCopy} className="flex items-center gap-1 text-[11px] min-h-[44px] px-2.5 py-2 rounded-lg transition active:scale-95 hover:bg-slate-50" style={{ color: '#94a3b8' }}><CopyIcon /></button>
          <button onClick={onShare} className="flex items-center gap-1 text-[11px] min-h-[44px] px-2.5 py-2 rounded-lg transition active:scale-95 hover:bg-slate-50" style={{ color: '#94a3b8' }}><ShareIcon /></button>
          <button onClick={onSave} className="flex items-center gap-1 text-[11px] min-h-[44px] px-2.5 py-2 rounded-lg transition active:scale-95 hover:bg-slate-50" style={{ color: '#94a3b8' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </button>
        </div>
      )}
      {/* Timestamp */}
      {content && !isStreaming && <div className="msg-time">{timeStr}</div>}
    </>
  );
});

// Helpers
const load = (key, fb) => {
  if (typeof window === 'undefined') return fb;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; }
};
const save = (key, v) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
};

// Conversation memory
const MEMORY_THRESHOLD = 8;
const RECENT_KEEP = 6;

function buildConversationMemory(messages) {
  if (messages.length <= MEMORY_THRESHOLD) return { memory: null, recentMessages: messages };
  const older = messages.slice(0, messages.length - RECENT_KEEP);
  const recent = messages.slice(messages.length - RECENT_KEEP);
  const topics = [];
  for (let i = 0; i < older.length; i++) {
    const msg = older[i];
    if (msg.role === 'user') {
      const q = msg.content.trim();
      const short = q.length > 100 ? q.substring(0, 100) + '...' : q;
      topics.push(`• User asked: "${short}"`);
    } else if (msg.role === 'assistant') {
      const lines = msg.content.split('\n').filter(l => l.trim());
      const firstLine = lines[0]?.trim();
      if (firstLine) {
        const short = firstLine.length > 120 ? firstLine.substring(0, 120) + '...' : firstLine;
        topics.push(`  → Answer: ${short}`);
      }
      const laws = msg.content.match(/⚖️\s*(.+?)(?:\n|$)/g);
      if (laws) laws.forEach(l => topics.push(`  → ${l.trim()}`));
    }
  }
  return { memory: topics.join('\n'), recentMessages: recent };
}

// Chat history helpers
const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const getChatTitle = (messages) => {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'New conversation';
  const text = firstUser.content.replace(/[*#]/g, '').trim();
  return text.length > 50 ? text.substring(0, 50) + '...' : text;
};

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en');
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({ role: '', state: '', type: '', rent: '' });
  const [hasSavedChat, setHasSavedChat] = useState(false);
  const [ready, setReady] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [copied, setCopied] = useState(false);
  const [lastFailedMsg, setLastFailedMsg] = useState(null);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  // Chat history state
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const recRef = useRef(null);
  const streamRef = useRef(null);
  const streamContentRef = useRef('');

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = load('fi_install_dismissed', false);
      if (!dismissed) setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const dismissInstall = () => {
    setShowInstallBanner(false);
    save('fi_install_dismissed', true);
  };

  useEffect(() => {
    setLang(load('fi_lang', 'en'));
    setProfile(load('fi_profile', { role: '', state: '', type: '', rent: '' }));
    setFeedbackMap(load('fi_feedback', {}));
    setChatHistory(load('fi_chat_history', []));
    if (load('fi_messages', []).length > 0) setHasSavedChat(true);
    setReady(true);
  }, []);

  useEffect(() => { if (ready) save('fi_lang', lang); }, [lang, ready]);
  useEffect(() => {
    if (ready && messages.length > 0) {
      const real = messages.filter(m => m.content !== '');
      if (real.length > 0) {
        save('fi_messages', real);
        // Auto-save to chat history
        if (activeChatId) {
          setChatHistory(prev => {
            const updated = prev.map(ch =>
              ch.id === activeChatId
                ? { ...ch, messages: real, title: getChatTitle(real), updatedAt: Date.now() }
                : ch
            );
            save('fi_chat_history', updated);
            return updated;
          });
        }
      }
    }
  }, [messages, ready, activeChatId]);
  useEffect(() => { if (ready) save('fi_profile', profile); }, [profile, ready]);

  // Sticky-to-bottom: only auto-scroll when user is already near the bottom.
  // No flag, no event listeners — we check live position each time.
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    // Within 200px of bottom = "at bottom, stick". Otherwise leave user where they are.
    if (dist < 200) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  // Speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.continuous = false;
      r.interimResults = true;
      r.lang = lang === 'bm' ? 'ms-MY' : lang === 'zh' ? 'zh-CN' : 'en-MY';
      r.onresult = (e) => {
        let t = '';
        for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
        setInput(t);
      };
      r.onend = () => setListening(false);
      r.onerror = () => setListening(false);
      recRef.current = r;
    }
  }, [lang]);

  const toggleVoice = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); setListening(false); }
    else { setInput(''); recRef.current.start(); setListening(true); }
  };

  // Smart context engine — builds rich context for AI
  const buildSmartContext = useCallback(() => {
    const p = profile;
    let ctx = '';

    // Basic profile
    if (p.role || p.state || p.type || p.rent) {
      ctx += 'USER PROFILE: ';
      if (p.role) ctx += `Role: ${p.role}. `;
      if (p.state) ctx += `Property in ${p.state}. `;
      if (p.type) ctx += `Type: ${p.type}. `;
      if (p.rent) ctx += `Monthly rent: RM${p.rent}. `;
    }

    // Time awareness
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    ctx += `\nCurrent time: ${timeOfDay}. `;

    // Session intelligence — what topics they care about
    const topicHistory = load('fi_topic_history', {});
    const topTopics = Object.entries(topicHistory)
      .sort(([,a],[,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => `${topic} (${count}x)`);
    if (topTopics.length > 0) {
      ctx += `\nUser's frequent topics: ${topTopics.join(', ')}. Tailor answers to their recurring concerns.`;
    }

    // Session count
    const sessionCount = load('fi_session_count', 0);
    if (sessionCount > 1) {
      ctx += `\nReturning user (session #${sessionCount}). They know the basics — skip introductory info, go deeper.`;
    }

    // Feedback intelligence
    const stats = load('fi_feedback_stats', null);
    if (stats && (stats.up + stats.down) >= 3) {
      const ratio = stats.up / (stats.up + stats.down);
      if (ratio < 0.6) ctx += '\nUser feedback: answers need to be MORE practical and specific. Less theory, more actionable steps.';
      else if (ratio > 0.8) ctx += '\nUser feedback: current answer style is well-received. Keep the same depth and tone.';
      const badTopics = Object.entries(stats.topics || {}).filter(([_, v]) => v.down > v.up).map(([k]) => k);
      if (badTopics.length > 0) ctx += ` Improve answers about: ${badTopics.join(', ')}.`;
    }

    return ctx.trim();
  }, [profile]);

  // Track topics from user messages for learning
  const trackTopic = useCallback((userMsg) => {
    const topicKeywords = {
      'deposit': ['deposit', 'wang cagaran', '押金', 'refund'],
      'eviction': ['evict', 'usir', '驱逐', 'kick out', 'remove tenant'],
      'rent default': ['not paid', 'tak bayar', '拖欠', 'default', 'arrears'],
      'stamp duty': ['stamp duty', 'duti setem', '印花税', 'stamping'],
      'repairs': ['repair', 'fix', 'pembaikan', '维修', 'leak', 'bocor', 'damage'],
      'rent increase': ['increase', 'raise', 'naik', '涨', 'hike'],
      'subletting': ['sublet', 'sewa kecil', '转租'],
      'agreement': ['agreement', 'contract', 'perjanjian', '协议', 'clause', 'tenancy'],
      'buying': ['buy', 'purchase', 'beli', '买', 'subsale', 'lelong'],
      'tax': ['tax', 'cukai', '税', 'LHDN', 'RPGT', 'income'],
    };
    const lower = userMsg.toLowerCase();
    const history = load('fi_topic_history', {});
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        history[topic] = (history[topic] || 0) + 1;
      }
    }
    save('fi_topic_history', history);
  }, []);

  const parseFollowUps = useCallback((content) => {
    const match = content.match(/\[FOLLOWUPS\]\n?([\s\S]*?)\[\/FOLLOWUPS\]/);
    if (!match) return { cleanContent: content, followUps: [] };
    const cleanContent = content.replace(/\[FOLLOWUPS\][\s\S]*?\[\/FOLLOWUPS\]/, '').trim();
    const followUps = match[1].split('\n').map(l => l.trim()).filter(l => l.length > 0).slice(0, 3);
    return { cleanContent, followUps };
  }, []);

  // Feedback handler — self-improving
  const handleFeedback = useCallback((msgId, type) => {
    setFeedbackMap(prev => {
      const next = { ...prev };
      // Toggle: if already selected, remove it
      if (next[msgId] === type) {
        delete next[msgId];
      } else {
        next[msgId] = type;
      }
      save('fi_feedback', next);

      // Track aggregate stats for self-improving
      const stats = load('fi_feedback_stats', { up: 0, down: 0, topics: {} });
      if (type === 'up') stats.up++;
      else stats.down++;

      // Track which topics get good/bad feedback
      const msg = messages.find((m, i) => `msg-${i}` === msgId);
      if (msg) {
        const topicMatch = msg.content.match(/⚖️\s*(.*?)(?:\n|$)/);
        if (topicMatch) {
          const topic = topicMatch[1].trim().substring(0, 60);
          if (!stats.topics[topic]) stats.topics[topic] = { up: 0, down: 0 };
          stats.topics[topic][type]++;
        }
      }
      save('fi_feedback_stats', stats);

      return next;
    });
    setShowFeedbackToast(true);
    setTimeout(() => setShowFeedbackToast(false), 1500);
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const all = [...messages, userMsg];
    setMessages(all);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    const { memory, recentMessages } = buildConversationMemory(all);

    // Track topic for learning + increment session
    trackTopic(text.trim());
    const sc = load('fi_session_count', 0);
    if (messages.length === 0) {
      save('fi_session_count', sc + 1);
      // Create new chat in history on first message
      if (activeChatId) {
        const newChat = { id: activeChatId, title: text.trim().substring(0, 50), messages: [], createdAt: Date.now(), updatedAt: Date.now() };
        setChatHistory(prev => {
          const updated = [newChat, ...prev.filter(ch => ch.id !== activeChatId)];
          save('fi_chat_history', updated);
          return updated;
        });
      }
    }

    // Build smart context (profile + time + topic intelligence + feedback)
    const smartCtx = buildSmartContext();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          profileContext: smartCtx,
          conversationMemory: memory,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        const errorMsg = lang === 'en' ? `⚠️ ${err.error || 'Server error'}. Tap retry to try again.`
          : lang === 'bm' ? `⚠️ ${err.error || 'Ralat pelayan'}. Tekan cuba semula.`
          : `⚠️ ${err.error || '服务器错误'}。点击重试。`;
        setMessages([...all, { role: 'assistant', content: errorMsg, isError: true }]);
        setLastFailedMsg(text.trim());
        setLoading(false);
        return;
      }

      setMessages([...all, { role: 'assistant', content: '' }]);
      streamContentRef.current = '';
      await new Promise(r => requestAnimationFrame(r));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let rafPending = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              streamContentRef.current += JSON.parse(line.slice(6)).text;
              if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                  if (streamRef.current) {
                    const display = streamContentRef.current.replace(/\[FOLLOWUPS\][\s\S]*?(\[\/FOLLOWUPS\]|$)/, '');
                    streamRef.current.innerHTML = fmt(display);
                    // Stick-to-bottom on the SAME frame as the paint — no jitter.
                    const el = chatRef.current;
                    if (el) {
                      const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
                      if (dist < 200) el.scrollTop = el.scrollHeight;
                    }
                  }
                  rafPending = false;
                });
              }
            } catch {}
          }
        }
      }

      if (streamRef.current) {
        streamRef.current.innerHTML = fmt(streamContentRef.current);
      }

      const rawContent = streamContentRef.current;
      const { cleanContent, followUps } = parseFollowUps(rawContent);
      setMessages([...all, { role: 'assistant', content: cleanContent }]);
      streamContentRef.current = '';
      if (followUps.length > 0) setSuggestions(followUps);
      setLastFailedMsg(null);

    } catch (err) {
      const isOffline = !navigator.onLine;
      const errorMsg = isOffline
        ? (lang === 'en' ? '📡 You appear to be offline. Check your internet connection and try again.'
          : lang === 'bm' ? '📡 Anda kelihatan di luar talian. Semak sambungan internet anda.'
          : '📡 您似乎已离线。请检查网络连接后重试。')
        : (lang === 'en' ? '⚠️ Something went wrong. Tap retry to try again.'
          : lang === 'bm' ? '⚠️ Sesuatu tidak kena. Tekan cuba semula.'
          : '⚠️ 出了点问题。点击重试。');
      setMessages([...all, { role: 'assistant', content: errorMsg, isError: true }]);
      setLastFailedMsg(text.trim());
    }
    setLoading(false);
    inputRef.current?.focus();
  }, [messages, loading, profile, parseFollowUps, lang, buildSmartContext, trackTopic, activeChatId]);

  const handleRetry = useCallback(() => {
    if (!lastFailedMsg || loading) return;
    const withoutError = messages.filter(m => !m.isError);
    const withoutLastUser = withoutError.slice(0, -1);
    setMessages(withoutLastUser);
    setLastFailedMsg(null);
    setTimeout(() => sendMessage(lastFailedMsg), 50);
  }, [lastFailedMsg, loading, messages, sendMessage]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleSave = () => {
    const content = messages.map(m => {
      const who = m.role === 'user' ? 'You' : 'Find.ai';
      return `<div style="margin-bottom:20px"><strong>${who}:</strong><div style="margin-top:6px;white-space:pre-wrap">${m.content}</div></div>`;
    }).join('<hr style="border:none;border-top:1px solid #eee;margin:16px 0">');
    const html = `<html><head><title>Find.ai Chat ${new Date().toISOString().slice(0,10)}</title>
      <style>body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#333;font-size:14px;line-height:1.6}h1{font-size:18px}p.sub{color:#888;font-size:12px}</style></head>
      <body><h1>Find.ai — Malaysian Property Advisor</h1><p class="sub">${new Date().toLocaleDateString('en-MY',{dateStyle:'full'})}</p><hr>${content}
      <p class="sub" style="margin-top:30px">AI guidance — not a substitute for professional legal counsel</p></body></html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `find-ai-chat-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
  };

  const startNewChat = useCallback(() => {
    // Save current chat to history before starting new one
    if (messages.length > 0 && activeChatId) {
      const real = messages.filter(m => m.content !== '');
      if (real.length > 0) {
        setChatHistory(prev => {
          const exists = prev.find(ch => ch.id === activeChatId);
          let updated;
          if (exists) {
            updated = prev.map(ch => ch.id === activeChatId ? { ...ch, messages: real, title: getChatTitle(real), updatedAt: Date.now() } : ch);
          } else {
            updated = [{ id: activeChatId, title: getChatTitle(real), messages: real, createdAt: Date.now(), updatedAt: Date.now() }, ...prev];
          }
          save('fi_chat_history', updated);
          return updated;
        });
      }
    }
    const newId = generateChatId();
    setActiveChatId(newId);
    setMessages([]);
    save('fi_messages', []);
    setSuggestions([]);
    setLastFailedMsg(null);
    setShowSidebar(false);
  }, [messages, activeChatId]);

  const loadHistoryChat = useCallback((chatId) => {
    const chat = chatHistory.find(ch => ch.id === chatId);
    if (!chat) return;
    // Save current first
    if (messages.length > 0 && activeChatId && activeChatId !== chatId) {
      const real = messages.filter(m => m.content !== '');
      if (real.length > 0) {
        setChatHistory(prev => {
          const updated = prev.map(ch => ch.id === activeChatId ? { ...ch, messages: real, title: getChatTitle(real), updatedAt: Date.now() } : ch);
          save('fi_chat_history', updated);
          return updated;
        });
      }
    }
    setActiveChatId(chatId);
    setMessages(chat.messages);
    save('fi_messages', chat.messages);
    setSuggestions([]);
    setShowSidebar(false);
  }, [chatHistory, messages, activeChatId]);

  const deleteHistoryChat = useCallback((chatId) => {
    setChatHistory(prev => {
      const updated = prev.filter(ch => ch.id !== chatId);
      save('fi_chat_history', updated);
      return updated;
    });
    if (activeChatId === chatId) {
      setMessages([]);
      save('fi_messages', []);
      setActiveChatId(generateChatId());
    }
  }, [activeChatId]);

  const clearChat = () => { startNewChat(); setHasSavedChat(false); };
  const loadChat = () => {
    const saved = load('fi_messages', []);
    const newId = generateChatId();
    setActiveChatId(newId);
    setMessages(saved);
    setHasSavedChat(false);
    setShowChat(true);
    // Add to history if not already there
    if (saved.length > 0) {
      setChatHistory(prev => {
        const updated = [{ id: newId, title: getChatTitle(saved), messages: saved, createdAt: Date.now(), updatedAt: Date.now() }, ...prev];
        save('fi_chat_history', updated);
        return updated;
      });
    }
  };

  const shareWA = (text) => {
    const clean = text.replace(/\*\*/g, '*').replace(/<[^>]*>/g, '').substring(0, 2000);
    window.open(`https://wa.me/?text=${encodeURIComponent(`From Find.ai:\n\n${clean}\n\nhttps://find-ai-lovat.vercel.app`)}`, '_blank');
  };

  const copyMsg = (text) => {
    const clean = text.replace(/\*\*/g, '').replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startChat = () => {
    const sp = load('fi_profile', { role: '', state: '', type: '', rent: '' });
    if (!activeChatId) setActiveChatId(generateChatId());
    sp.role ? setShowChat(true) : setShowProfile(true);
  };

  if (!ready) return null;

  // Landing
  if (!showChat && !showProfile)
    return <Landing onStart={startChat} lang={lang} setLang={setLang} hasSavedChat={hasSavedChat} onContinueChat={loadChat} />;

  // Profile — Clean White onboarding
  if (showProfile) {
    const t = UI[lang];
    const roleIcons = { landlord: '🏠', tenant: '🔑', buyer: '🛒' };
    const typeIcons = { condo: '🏢', landed: '🏡', shop: '🏪' };
    return (
      <div className="flex flex-col min-h-screen" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
        {/* Top section — clean with branding */}
        <div className="flex flex-col items-center pt-14 pb-8 px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #0f172a, #334155)', boxShadow: '0 4px 16px rgba(15,23,42,0.15)' }}>
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h2 className="text-[22px] font-bold mb-1.5" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{t.profileTitle}</h2>
          <p className="text-[13px]" style={{ color: '#94a3b8' }}>{t.profileDesc}</p>
        </div>

        {/* Form card */}
        <div className="flex-1 px-6 pt-2 pb-6">
          <div className="max-w-sm mx-auto space-y-6">
            {/* Role */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileRole}</label>
              <div className="flex gap-2.5">
                {['landlord','tenant','buyer'].map(r => (
                  <button key={r} onClick={() => setProfile({...profile, role: r})}
                    className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl text-[12px] font-semibold transition-all active:scale-95"
                    style={profile.role === r
                      ? { background: '#0f172a', color: '#fff', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }
                      : { background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }
                    }>
                    <span className="text-xl">{roleIcons[r]}</span>
                    {t.roles[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileState}</label>
              <select value={profile.state} onChange={(e) => setProfile({...profile, state: e.target.value})}
                className="w-full py-3.5 px-4 rounded-xl text-[16px] font-medium focus:outline-none transition appearance-none min-h-[48px]"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: profile.state ? '#0f172a' : '#94a3b8' }}>
                <option value="">—</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Property type */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileType}</label>
              <div className="flex gap-2.5">
                {['condo','landed','shop'].map(tp => (
                  <button key={tp} onClick={() => setProfile({...profile, type: tp})}
                    className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl text-[12px] font-semibold transition-all active:scale-95"
                    style={profile.type === tp
                      ? { background: '#0f172a', color: '#fff', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }
                      : { background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }
                    }>
                    <span className="text-xl">{typeIcons[tp]}</span>
                    {t.types[tp]}
                  </button>
                ))}
              </div>
            </div>

            {/* Rent */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileRent}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold" style={{ color: '#94a3b8' }}>RM</span>
                <input type="number" value={profile.rent} onChange={(e) => setProfile({...profile, rent: e.target.value})}
                  placeholder="2,500" className="w-full py-3.5 pl-12 pr-4 rounded-xl text-[16px] font-medium focus:outline-none transition min-h-[48px]"
                  style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 max-w-sm mx-auto">
            <button onClick={() => { setShowProfile(false); setShowChat(true); }}
              className="flex-1 py-4 rounded-xl text-[13px] font-semibold transition active:scale-[0.98]"
              style={{ color: '#94a3b8' }}>{t.profileSkip}</button>
            <button onClick={() => { save('fi_profile', profile); setShowProfile(false); setShowChat(true); }}
              className="flex-[2] py-4 rounded-xl text-[14px] font-bold text-white transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>{t.profileSave}</button>
          </div>
        </div>
      </div>
    );
  }

  // Chat
  const t = UI[lang];
  const has = messages.length > 0;
  const hasP = profile.role || profile.state;

  // Smart greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile.role ? t.roles[profile.role] : '';
    if (lang === 'en') {
      const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      return name ? `${greeting}, ${name}` : greeting;
    }
    if (lang === 'bm') {
      const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat petang' : 'Selamat malam';
      return name ? `${greeting}, ${name}` : greeting;
    }
    const greeting = hour < 12 ? '早上好' : hour < 17 ? '下午好' : '晚上好';
    return name ? `${greeting}，${name}` : greeting;
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto relative" style={{ background: '#ffffff' }}>
      {/* Sidebar overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex" style={{ maxWidth: '32rem', margin: '0 auto' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 sidebar-backdrop" onClick={() => setShowSidebar(false)} />
          {/* Sidebar panel */}
          <div className="relative w-[280px] h-full bg-white sidebar-slide flex flex-col" style={{ boxShadow: '4px 0 24px rgba(15,23,42,0.1)' }}>
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
              <div className="flex items-center gap-2.5">
                <Logo size={26} />
                <span className="text-[14px] font-bold" style={{ color: '#0f172a' }}>{lang === 'en' ? 'Conversations' : lang === 'bm' ? 'Perbualan' : '对话'}</span>
              </div>
              <button onClick={() => setShowSidebar(false)} className="touch-target rounded-xl transition active:scale-95" style={{ color: '#94a3b8' }}>
                <CloseIcon />
              </button>
            </div>
            {/* Search */}
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <SearchIcon />
                <input type="text" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder={lang === 'en' ? 'Search chats...' : lang === 'bm' ? 'Cari perbualan...' : '搜索对话...'}
                  className="flex-1 text-[12px] bg-transparent focus:outline-none" style={{ color: '#334155' }} />
              </div>
            </div>
            {/* New chat button */}
            <div className="px-3 pb-2">
              <button onClick={startNewChat}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold transition active:scale-[0.98]"
                style={{ background: '#0f172a', color: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.15)' }}>
                <NewChatIcon />{lang === 'en' ? 'New Chat' : lang === 'bm' ? 'Chat Baru' : '新对话'}
              </button>
            </div>
            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {chatHistory.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-[28px] mb-2">💬</div>
                  <div className="text-[12px] font-medium" style={{ color: '#94a3b8' }}>
                    {lang === 'en' ? 'No conversations yet' : lang === 'bm' ? 'Belum ada perbualan' : '暂无对话'}
                  </div>
                </div>
              ) : (
                chatHistory
                  .filter(ch => !historySearch || ch.title.toLowerCase().includes(historySearch.toLowerCase()))
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map(ch => (
                    <div key={ch.id}
                      className="group flex items-center gap-2 px-3 py-2.5 rounded-xl mb-0.5 transition-all cursor-pointer history-item"
                      style={{ background: ch.id === activeChatId ? '#f1f5f9' : 'transparent' }}
                      onClick={() => loadHistoryChat(ch.id)}>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium truncate" style={{ color: ch.id === activeChatId ? '#0f172a' : '#475569' }}>
                          {ch.title}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                          {ch.messages?.length || 0} {lang === 'en' ? 'messages' : lang === 'bm' ? 'mesej' : '条消息'}
                          {' · '}
                          {new Date(ch.updatedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'bm' ? 'ms-MY' : 'en-MY', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteHistoryChat(ch.id); }}
                        className="opacity-0 group-hover:opacity-100 touch-target rounded-lg transition active:scale-90"
                        style={{ color: '#cbd5e1' }}>
                        <TrashIcon />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header — frosted glass */}
      <header className="no-print glass-header header-safe sticky top-0 z-10 flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
        <div className="flex items-center gap-2.5">
          {/* History sidebar toggle */}
          <button onClick={() => setShowSidebar(true)} className="touch-target rounded-xl transition active:scale-95 -ml-1" style={{ color: '#64748b' }}>
            <HistoryIcon />
          </button>
          <div className="flex items-center gap-2.5">
            <Logo size={30} />
            <div>
              <h1 className="text-[15px] font-bold leading-tight" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>{t.title}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: loading ? '#3b82f6' : '#10b981', animation: loading ? 'pulseRing 1.5s infinite' : 'none' }} />
                <span className="text-[10px] font-medium" style={{ color: '#94a3b8' }}>{loading ? t.analyzing : has ? t.subtitleActive : t.subtitle}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setLang(lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en')}
            className="touch-target text-[11px] px-3 py-1.5 rounded-xl font-semibold transition active:scale-95"
            style={{ background: '#f1f5f9', color: '#64748b' }}>{t.langToggle}</button>
          {has && (
            <>
              <button onClick={handleSave} className="touch-target rounded-xl transition active:scale-95" style={{ color: '#94a3b8' }} title="Save chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </button>
              <button onClick={clearChat} className="touch-target rounded-xl transition active:scale-95" style={{ color: '#94a3b8' }} title={t.newChat}>
                <NewChatIcon />
              </button>
            </>
          )}
          {hasP && (
            <button onClick={() => setShowProfile(true)} className="touch-target rounded-xl transition active:scale-95" style={{ color: '#94a3b8' }} title={t.profileEdit}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div ref={chatRef} className="chat-area flex-1 overflow-y-auto px-4 py-5" style={{ background: has ? '#f8fafc' : 'white' }}>
        {!has ? (
          <div className="flex flex-col h-full">
            {/* Welcome — premium hero */}
            <div className="mt-6 mb-6 card-up">
              <div className="text-center">
                {/* Animated logo */}
                <div className="flex justify-center mb-4 scale-in">
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.18), 0 2px 8px rgba(15,23,42,0.1)' }}>
                    <span className="text-white font-bold text-2xl">F</span>
                  </div>
                </div>
                <h2 className="text-[24px] font-bold mb-2" style={{ color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                  <span className="greeting-wave">👋</span> {getGreeting()}
                </h2>
                <p className="text-[13px] leading-relaxed max-w-[280px] mx-auto" style={{ color: '#94a3b8' }}>
                  {hasP ? t.welcomeReturning : t.welcomeDesc}
                </p>
                {hasP && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {profile.role && <span className="text-[10px] px-3 py-1.5 rounded-full font-semibold" style={{ background: '#0f172a', color: '#fff' }}>{t.roles[profile.role]}</span>}
                    {profile.state && <span className="text-[10px] px-3 py-1.5 rounded-full font-medium" style={{ background: '#f1f5f9', color: '#475569' }}>{profile.state}</span>}
                    {profile.type && <span className="text-[10px] px-3 py-1.5 rounded-full font-medium" style={{ background: '#f1f5f9', color: '#475569' }}>{t.types[profile.type]}</span>}
                    {profile.rent && <span className="text-[10px] px-3 py-1.5 rounded-full font-medium" style={{ background: '#f1f5f9', color: '#475569' }}>RM{profile.rent}/mo</span>}
                  </div>
                )}
                {/* Powered by badge */}
                <div className="flex justify-center mt-3 fade-in delay-2">
                  <span className="text-[9px] px-3 py-1 rounded-full font-medium" style={{ background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                    Powered by Claude Haiku 4.5
                  </span>
                </div>
              </div>
            </div>

            {/* Starter Questions */}
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2.5 pl-1 card-up delay-2" style={{ color: '#cbd5e1' }}>{t.commonSituations}</div>
            <div className="space-y-2">
              {(t.questions[profile.role] || t.questions.default).map((q, i) => (
                <button key={i} onClick={() => sendMessage(q.text)}
                  className={`card-up delay-${i+2} starter-card w-full flex items-center gap-3.5 text-left px-4 py-3.5 rounded-2xl bg-white`}
                  style={{ border: '1px solid #e2e8f0' }}>
                  <span className="text-xl flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: '#f8fafc' }}>{q.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold" style={{ color: '#0f172a' }}>{q.title}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>{q.sub}</div>
                  </div>
                  <svg className="flex-shrink-0 ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Date separator */}
            <div className="flex items-center justify-center py-1 fade-in">
              <span className="text-[10px] font-medium px-3 py-1 rounded-full" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                {new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'bm' ? 'ms-MY' : 'en-MY', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            {messages.map((msg, i) => {
              const isLastAssistant = loading && i === messages.length - 1 && msg.role === 'assistant';
              const msgId = `msg-${i}`;
              return (
                <div key={i} className={`msg-group flex ${msg.role === 'user' ? 'justify-end' : 'gap-2.5'} msg-in`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mt-1">
                      <Logo size={28} />
                    </div>
                  )}
                  <div className={msg.role === 'assistant' ? 'max-w-[calc(100%-42px)]' : 'max-w-[80%]'}>
                    <MessageBubble
                      id={msgId}
                      content={msg.content}
                      role={msg.role}
                      isStreaming={isLastAssistant}
                      isError={msg.isError}
                      streamRef={isLastAssistant ? streamRef : null}
                      onCopy={() => copyMsg(msg.content)}
                      onShare={() => shareWA(msg.content)}
                      onSave={handleSave}
                      onRetry={msg.isError ? handleRetry : null}
                      onFeedback={handleFeedback}
                      feedback={feedbackMap[msgId]}
                    />
                  </div>
                </div>
              );
            })}

            {/* Thinking indicator — premium animated */}
            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-2.5 msg-in">
                <div className="flex-shrink-0 mt-1"><Logo size={28} /></div>
                <div className="flex-1 max-w-[280px]">
                  <div className="bg-white px-4 py-3.5 rounded-[4px_18px_18px_18px]" style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid #edf0f4' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }} />
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }} />
                        <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }} />
                      </div>
                      <span className="text-[11px] font-semibold thinking-fade" style={{ color: '#94a3b8' }}>
                        {lang === 'en' ? 'Finding the law...' : lang === 'bm' ? 'Mencari undang-undang...' : '查找法律依据...'}
                      </span>
                    </div>
                    {/* Animated progress bar */}
                    <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: '#f1f5f9', overflow: 'hidden' }}>
                      <div className="thinking-bar" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up suggestions */}
            {!loading && suggestions.length > 0 && (
              <div className="fade-in mt-3 pl-[34px]">
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#cbd5e1' }}>{t.followUps}</div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => { setSuggestions([]); sendMessage(s); }}
                      className="follow-chip text-[11px] px-3.5 py-2 rounded-xl font-medium transition-all active:scale-95"
                      style={{ background: 'white', color: '#475569', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="no-print input-elevated px-4 pt-3 pb-2.5 input-safe">
        <div className="input-area flex items-end gap-1 rounded-2xl px-3.5 pr-1.5 py-1 bg-white transition"
          style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(15,23,42,0.03)' }}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={listening ? t.placeholderListening : (has ? t.placeholderActive : t.placeholder)}
            rows={1} className="flex-1 resize-none bg-transparent text-[16px] focus:outline-none py-2.5"
            style={{ color: '#1e293b', maxHeight: '100px', lineHeight: '1.5' }}
            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
          />
          {recRef.current !== undefined && (
            <button onClick={toggleVoice} disabled={loading}
              className={`touch-target rounded-xl flex items-center justify-center transition active:scale-90 ${
                listening ? 'bg-red-500 text-white pulse-ring' : ''
              } disabled:opacity-40`}
              style={!listening ? { color: '#94a3b8' } : {}}>
              <MicIcon />
            </button>
          )}
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="touch-target rounded-xl flex items-center justify-center disabled:opacity-30 transition active:scale-90"
            style={{ background: input.trim() ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#e2e8f0', borderRadius: '12px' }}>
            <SendIcon />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-1.5 pb-0.5">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p className="text-[9px] font-medium" style={{ color: '#d1d5db' }}>{t.privacy}</p>
        </div>
      </div>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="install-banner fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-50">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white" style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.12), 0 0 0 1px rgba(226,232,240,0.5)' }}>
            <Logo size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{t.installTitle}</div>
              <div className="text-[11px]" style={{ color: '#94a3b8' }}>{t.installDesc}</div>
            </div>
            <button onClick={handleInstall}
              className="px-4 py-2 rounded-xl text-[12px] font-bold text-white transition active:scale-95"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>{t.installBtn}</button>
            <button onClick={dismissInstall} className="text-[11px] font-medium px-2" style={{ color: '#94a3b8' }}>{t.installDismiss}</button>
          </div>
        </div>
      )}

      {/* Copy toast */}
      {copied && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 toast-in">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white shadow-lg"
            style={{ background: '#0f172a' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {t.copied}
          </div>
        </div>
      )}

      {/* Feedback toast */}
      {showFeedbackToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 toast-in">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white shadow-lg"
            style={{ background: '#0f172a' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {t.feedbackThanks}
          </div>
        </div>
      )}

    </div>
  );
}
