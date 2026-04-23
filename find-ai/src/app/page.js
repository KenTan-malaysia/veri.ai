'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import Landing from './landing';
import ErrorBoundary from '../components/ErrorBoundary';
import { CaseMemoryModal, buildCaseMemoryContext, emptyMemory, hasPdpaConsent } from './caseMemory';
import StampDutyCalc from '../components/tools/StampDutyCalc';
import TenantScreen from '../components/tools/TenantScreen';
import TenantRegister from '../components/tools/TenantRegister';
import ScansHistory, { collectScans } from '../components/ScansHistory';
import { L as toolLabels } from '../components/tools/labels';
import PeekChat from '../components/PeekChat';
import { fmt } from '../lib/chatFormat';

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
    voiceHint: 'Tap mic · hold for push-to-talk · speak in any language',
    voiceDenied: 'Microphone blocked. Enable it in your browser settings.',
    voiceNoHardware: 'No microphone found on this device.',
    voiceTypeInstead: 'Having trouble? Tap the text box and type instead.',
    voiceSwitchingLang: 'Switching to English…',
    voiceHoldHint: 'Release to send',
    profileTitle: 'Quick setup',
    profileDesc: 'So I can give you the right answers',
    profileRole: 'I am a...',
    profileState: 'Property state',
    profileType: 'Property type',
    profileRent: 'Monthly rent (RM)',
    profileSkip: 'Skip for now',
    profileSave: 'Continue',
    profileEdit: 'Edit profile',
    profileV1Badge: 'v1 · Landlords first',
    profileV1Hint: "We're starting with landlord tools. Tenant & buyer support coming soon.",
    comingSoon: 'Coming soon',
    roles: { landlord: 'Landlord', tenant: 'Tenant', buyer: 'Buyer' },
    types: { condo: 'Condo / Apt', landed: 'Landed', shop: 'Commercial', industrial: 'Industrial', land: 'Land' },
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
    voiceHint: 'Ketik mikrofon · tekan & tahan untuk bercakap · sebarang bahasa',
    voiceDenied: 'Mikrofon disekat. Aktifkan dalam tetapan pelayar anda.',
    voiceNoHardware: 'Tiada mikrofon pada peranti ini.',
    voiceTypeInstead: 'Ada masalah? Sentuh kotak teks dan taip sahaja.',
    voiceSwitchingLang: 'Menukar ke Bahasa Inggeris…',
    voiceHoldHint: 'Lepas untuk hantar',
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
    profileV1Badge: 'v1 · Tuan rumah dulu',
    profileV1Hint: 'Kami mula dengan alat untuk tuan rumah. Sokongan penyewa & pembeli akan datang.',
    comingSoon: 'Akan datang',
    roles: { landlord: 'Tuan Rumah', tenant: 'Penyewa', buyer: 'Pembeli' },
    types: { condo: 'Kondo / Apt', landed: 'Rumah', shop: 'Komersial', industrial: 'Industri', land: 'Tanah' },
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
    voiceHint: '点击麦克风 · 长按说话 · 任意语言',
    voiceDenied: '麦克风被阻止。请在浏览器设置中启用。',
    voiceNoHardware: '此设备没有麦克风。',
    voiceTypeInstead: '遇到问题？点击文字框手动输入即可。',
    voiceSwitchingLang: '切换到英文…',
    voiceHoldHint: '松开发送',
    profileTitle: '快速设置',
    profileDesc: '帮助我给您准确的建议',
    profileRole: '我是...',
    profileState: '房产所在州',
    profileType: '房产类型',
    profileRent: '月租金 (RM)',
    profileSkip: '跳过',
    profileSave: '继续',
    profileEdit: '编辑资料',
    profileV1Badge: 'v1 · 房东优先',
    profileV1Hint: '我们首先为房东推出工具。租客和买家功能即将推出。',
    comingSoon: '即将推出',
    roles: { landlord: '房东', tenant: '租客', buyer: '买家' },
    types: { condo: '公寓', landed: '排屋', shop: '商铺', industrial: '工业', land: '地皮' },
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

// fmt() now lives in src/lib/chatFormat.js — imported above and shared with
// PeekChat so the full chat page and the ambient dock render the icon
// callout framework identically. T15 (2026-04-23).


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
  // Case-file memory (per-chat; extends chatHistory item shape)
  const [showCaseMemory, setShowCaseMemory] = useState(false);
  // Phase 1 tools (stamp duty + screen wired; audit to follow)
  const [showStampTool, setShowStampTool] = useState(false);
  const [showScreenTool, setShowScreenTool] = useState(false);
  const [showTenantRegister, setShowTenantRegister] = useState(false);
  // v9.6 T12 — "Your scans" history view. Surfaces every saved Payment
  // Discipline Scan across all cases so the landlord can compare prospects
  // before signing + re-export any scan's PDF.
  const [showScansHistory, setShowScansHistory] = useState(false);
  // v9.3 — track whether the user opened the current tool FROM Landing.
  // If yes, closing the tool should return them to Landing (not the chat
  // page that we had to briefly flip on so the modal could mount).
  // Fixes Ken's "everything forces me into chat" complaint.
  const [landingToTool, setLandingToTool] = useState(false);
  // Voice state (Option C)
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState(null);        // 'denied' | 'nohardware' | null
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);   // 0..1 for waveform
  const [voiceFailCount, setVoiceFailCount] = useState(0);   // no-speech fails → show hint after 2
  const [voiceHoldMode, setVoiceHoldMode] = useState(false); // push-to-talk active
  const [voiceFallbackNote, setVoiceFallbackNote] = useState(null); // 'switching-en' message flash
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const recRef = useRef(null);
  const streamRef = useRef(null);
  const streamContentRef = useRef('');
  // Voice (Option C UX)
  const voiceSilenceRef = useRef(null);      // setTimeout for 1.5s auto-send
  const voiceBaseInputRef = useRef('');      // preserve typed text before voice starts
  const audioContextRef = useRef(null);      // Web Audio API
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const rafRef = useRef(null);               // requestAnimationFrame
  const holdTimerRef = useRef(null);         // long-press detection (300ms)
  const voiceLangRef = useRef(null);         // active recognition lang (for fallback)
  const voiceUserStoppedRef = useRef(false); // distinguish manual-stop from silence-end
  const voiceAutoSendRef = useRef(true);     // whether to auto-send on silence
  const voiceMaxRef = useRef(null);          // 45s hard watchdog — force-stop if engine hangs

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
    const history = load('fi_chat_history', []);
    setChatHistory(history);
    // Restore activeChatId so case memory (property nickname, tenant, tax dates)
    // survives a refresh. Validate against history to avoid dangling IDs.
    const savedActiveId = load('fi_active_chat_id', null);
    if (savedActiveId && history.some(ch => ch.id === savedActiveId)) {
      setActiveChatId(savedActiveId);
      const activeEntry = history.find(ch => ch.id === savedActiveId);
      if (activeEntry?.messages?.length) setMessages(activeEntry.messages);
    }
    // BUGFIX: also treat modern fi_chat_history as a "saved chat" source so the
    // "Continue last case" button still appears for users whose data never lived
    // in the legacy fi_messages store.
    const hasLegacyMessages = load('fi_messages', []).length > 0;
    const hasModernHistory = history.length > 0;
    if (hasLegacyMessages || hasModernHistory) setHasSavedChat(true);
    setReady(true);
  }, []);

  useEffect(() => { if (ready) save('fi_lang', lang); }, [lang, ready]);
  useEffect(() => { if (ready && activeChatId) save('fi_active_chat_id', activeChatId); }, [activeChatId, ready]);
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

  // ─── VOICE (Option C — Malaysian UX) ───────────────────────────────────
  // Supports: code-switch fallback (en-US), auto-send on 1.5s silence, continuous mode,
  // permission-denied toast, hold-to-talk long-press, real-time waveform amplitude.

  // Detect iOS Safari (WKWebView counts too) — needed because continuous SpeechRecognition
  // is unreliable on iOS; onend fires silently and restart loops hang.
  const isIOSRef = useRef(typeof navigator !== 'undefined' && (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ));

  const primaryLangCode = useCallback((l) => {
    // BCP-47 locales. en-MY is NOT a real Web Speech locale (Chrome falls back silently
    // to en-US, Safari rejects). Use en-US and let the Rojak fallback do the rest.
    if (l === 'bm') return 'ms-MY';
    if (l === 'zh') return 'zh-CN';
    return 'en-US';
  }, []);

  // Initialize recognition instance when UI lang changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceSupported(false);
      return;
    }
    setVoiceSupported(true);

    const buildRec = (langCode) => {
      const r = new SR();
      // iOS Safari: continuous mode causes onend without results + freezes on restart.
      // Use single-utterance mode on iOS; auto-restart on non-iOS only.
      r.continuous = !isIOSRef.current;
      r.interimResults = true;
      r.lang = langCode;
      r.onresult = (e) => {
        let interim = '';
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interim += res[0].transcript;
        }
        // Append voice to whatever user already typed — never wipe
        const base = voiceBaseInputRef.current;
        const spacer = base && !base.endsWith(' ') ? ' ' : '';
        const combined = (base + spacer + finalText + interim).trim();
        setInput(combined);
        // If this result included finalized text, commit it as new base
        if (finalText) voiceBaseInputRef.current = (base + spacer + finalText).trim();
        // Note: silence-timer is now reset from the audio analyser loop based on real
        // audio amplitude (handles natural pauses). We also reset here on any result
        // event as a belt-and-braces for devices with no amplitude data.
        resetSilenceTimer();
      };
      r.onend = () => {
        // On iOS, continuous=false means onend fires after each utterance.
        // Don't restart — let user tap again if they want more. Prevents freeze loops.
        if (isIOSRef.current) {
          setListening(false);
          cleanupAudio();
          return;
        }
        // Desktop/Android: continuous mode can drop; auto-restart if user hasn't stopped.
        if (!voiceUserStoppedRef.current && listening) {
          try { r.start(); return; } catch (_) { /* already started or blocked */ }
        }
        setListening(false);
        cleanupAudio();
      };
      r.onerror = (e) => {
        const err = e?.error || '';
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setVoiceError('denied');
          stopVoice(true);
          return;
        }
        if (err === 'audio-capture') {
          setVoiceError('nohardware');
          stopVoice(true);
          return;
        }
        if (err === 'no-speech') {
          // User was silent. Increment fail count. After 2 fails → show "type instead" hint.
          setVoiceFailCount((n) => n + 1);
          // If primary lang is ms-MY/zh-CN and we got nothing, retry in en-US (Rojak fallback)
          const currentLang = voiceLangRef.current;
          if (currentLang && currentLang !== 'en-US') {
            setVoiceFallbackNote('switching-en');
            setTimeout(() => setVoiceFallbackNote(null), 2500);
            voiceLangRef.current = 'en-US';
            try {
              r.lang = 'en-US';
              r.start();
              return;
            } catch (_) { /* fallthrough */ }
          }
        }
        setListening(false);
        cleanupAudio();
      };
      return r;
    };

    const langCode = primaryLangCode(lang);
    voiceLangRef.current = langCode;
    recRef.current = buildRec(langCode);

    return () => {
      try { recRef.current?.stop(); } catch (_) {}
      recRef.current = null;
    };
  }, [lang, primaryLangCode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Silence-timer helper — auto-sends after SILENCE_MS of no speech.
  // Per-language tuning: BM/ZH speakers often pause longer for thinking.
  const SILENCE_MS_BY_LANG = { en: 2000, bm: 2500, zh: 2500 };
  const resetSilenceTimer = () => {
    if (voiceSilenceRef.current) clearTimeout(voiceSilenceRef.current);
    const delay = SILENCE_MS_BY_LANG[lang] || 2200;
    voiceSilenceRef.current = setTimeout(() => {
      const final = voiceBaseInputRef.current;
      if (final && voiceAutoSendRef.current) {
        stopVoice(false);
        sendMessage(final);
      }
    }, delay);
  };

  // Audio analyser for waveform amplitude (0..1). Also drives silence detection:
  // when real audio is present (amplitude above threshold), we reset the silence timer
  // so natural pauses mid-sentence don't trigger premature auto-send.
  const VOICE_THRESHOLD = 0.08; // above this = real speech (tuned for mobile mic noise)
  const startAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i];
        const avg = sum / buf.length / 255; // 0..1
        const boosted = Math.min(1, avg * 2.2);
        setVoiceAmplitude(boosted); // idle breath ≈ 0.1, loud speech ≈ 1
        // Reset silence timer whenever real audio is detected — handles natural
        // mid-sentence pauses (BM/ZH speakers often pause 1-2s to think).
        if (boosted > VOICE_THRESHOLD) resetSilenceTimer();
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (err) {
      // getUserMedia denied — still attempt recognition (Chrome sometimes separates permissions)
      if (err && (err.name === 'NotAllowedError' || err.name === 'SecurityError')) {
        setVoiceError('denied');
      } else if (err && err.name === 'NotFoundError') {
        setVoiceError('nohardware');
      }
    }
  };

  const cleanupAudio = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (analyserRef.current) { try { analyserRef.current.disconnect(); } catch (_) {} analyserRef.current = null; }
    if (audioContextRef.current) { try { audioContextRef.current.close(); } catch (_) {} audioContextRef.current = null; }
    if (mediaStreamRef.current) {
      try { mediaStreamRef.current.getTracks().forEach(t => t.stop()); } catch (_) {}
      mediaStreamRef.current = null;
    }
    setVoiceAmplitude(0);
  };

  const startVoice = async () => {
    if (!recRef.current) return;
    setVoiceError(null);
    setVoiceFallbackNote(null);
    voiceBaseInputRef.current = input; // preserve whatever user already typed
    voiceUserStoppedRef.current = false;
    voiceLangRef.current = primaryLangCode(lang);
    try { recRef.current.lang = voiceLangRef.current; } catch (_) {}
    try {
      recRef.current.start();
      setListening(true);
      startAudioAnalyser();
      // Arm silence timer immediately so a totally-silent session still auto-stops.
      resetSilenceTimer();
      // 45s hard watchdog — if the engine hangs (iOS Safari sometimes stalls), force-stop
      // and send whatever we captured. Prevents the "freezes mid-sentence" symptom.
      if (voiceMaxRef.current) clearTimeout(voiceMaxRef.current);
      voiceMaxRef.current = setTimeout(() => {
        const captured = voiceBaseInputRef.current;
        stopVoice(false);
        if (captured && voiceAutoSendRef.current) sendMessage(captured);
      }, 45000);
    } catch (_) {
      // Already started — ignore
    }
  };

  const stopVoice = (manual = true) => {
    if (manual) voiceUserStoppedRef.current = true;
    if (voiceSilenceRef.current) { clearTimeout(voiceSilenceRef.current); voiceSilenceRef.current = null; }
    if (voiceMaxRef.current) { clearTimeout(voiceMaxRef.current); voiceMaxRef.current = null; }
    try { recRef.current?.stop(); } catch (_) {}
    setListening(false);
    cleanupAudio();
  };

  // Tap toggle (short press)
  const toggleVoice = () => {
    if (!voiceSupported) return;
    if (listening) stopVoice(true);
    else { voiceAutoSendRef.current = true; startVoice(); }
  };

  // Long-press hold-to-talk
  const handleVoicePressStart = (e) => {
    if (!voiceSupported || loading) return;
    // Don't preventDefault — let click still fire for short presses
    holdTimerRef.current = setTimeout(() => {
      // Entered hold mode
      setVoiceHoldMode(true);
      voiceAutoSendRef.current = false; // hold mode sends on release, not on silence
      startVoice();
    }, 300);
  };

  const handleVoicePressEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (voiceHoldMode) {
      // Release → send what we captured
      const captured = voiceBaseInputRef.current || input;
      setVoiceHoldMode(false);
      stopVoice(true);
      if (captured && captured.trim()) {
        setTimeout(() => sendMessage(captured), 200); // tiny delay so onresult can finalize
      }
    }
  };

  // Auto-dismiss voice error toast after 5s
  useEffect(() => {
    if (!voiceError) return;
    const id = setTimeout(() => setVoiceError(null), 5000);
    return () => clearTimeout(id);
  }, [voiceError]);

  // Reset fail count when user successfully types or starts a new chat
  useEffect(() => {
    if (input && voiceFailCount > 0) setVoiceFailCount(0);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ── Case-file memory helpers ────────────────────────────────────────
  // Active chat's memory + case type (derived from chatHistory).
  const activeChatEntry = useMemo(
    () => chatHistory.find(ch => ch.id === activeChatId) || null,
    [chatHistory, activeChatId]
  );
  const activeMemory   = activeChatEntry?.memory   || emptyMemory();
  const activeCaseType = activeChatEntry?.caseType || 'general';

  // Persist memory edits into the active chat entry (creating it if needed).
  const saveCaseMemory = useCallback((nextMemory, nextCaseType) => {
    if (!activeChatId) return;
    setChatHistory(prev => {
      const exists = prev.find(ch => ch.id === activeChatId);
      let updated;
      if (exists) {
        updated = prev.map(ch =>
          ch.id === activeChatId
            ? { ...ch, memory: nextMemory, caseType: nextCaseType, updatedAt: Date.now() }
            : ch
        );
      } else {
        // No messages yet — seed an empty entry so memory survives.
        updated = [{
          id: activeChatId,
          title: nextMemory?.property?.nickname || '',
          messages: [],
          memory: nextMemory,
          caseType: nextCaseType,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }, ...prev];
      }
      save('fi_chat_history', updated);
      return updated;
    });
    setShowCaseMemory(false);
  }, [activeChatId]);

  const clearCaseMemory = useCallback(() => {
    if (!activeChatId) { setShowCaseMemory(false); return; }
    setChatHistory(prev => {
      const updated = prev.map(ch =>
        ch.id === activeChatId
          ? { ...ch, memory: emptyMemory(), updatedAt: Date.now() }
          : ch
      );
      save('fi_chat_history', updated);
      return updated;
    });
    setShowCaseMemory(false);
  }, [activeChatId]);

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
      // Create (or refresh) chat-history entry for this case on first message.
      // IMPORTANT: preserve any memory/caseType the user already saved.
      if (activeChatId) {
        setChatHistory(prev => {
          const existing = prev.find(ch => ch.id === activeChatId);
          const entry = {
            id: activeChatId,
            title: text.trim().substring(0, 50),
            messages: [],
            memory:   existing?.memory   || activeMemory,
            caseType: existing?.caseType || activeCaseType,
            createdAt: existing?.createdAt || Date.now(),
            updatedAt: Date.now(),
          };
          const updated = [entry, ...prev.filter(ch => ch.id !== activeChatId)];
          save('fi_chat_history', updated);
          return updated;
        });
      }
    }

    // Build smart context (profile + time + topic intelligence + feedback)
    const smartCtx = buildSmartContext();

    try {
      // Compile per-case memory into a compact context string (respects PDPA consent).
      const caseCtx = buildCaseMemoryContext(activeMemory, { tenantConsent: hasPdpaConsent('tenantData') });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          profileContext: smartCtx,
          conversationMemory: memory,
          caseMemory: caseCtx || undefined,
          caseType: activeCaseType,
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
  }, [messages, loading, profile, parseFollowUps, lang, buildSmartContext, trackTopic, activeChatId, activeMemory, activeCaseType]);

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
    // Prefer resuming the most recent chat entry (preserves memory/caseType).
    // Fall back to the orphaned fi_messages only if no history exists.
    const history = load('fi_chat_history', []);
    if (history.length > 0) {
      const latest = history[0];
      setActiveChatId(latest.id);
      setMessages(latest.messages || []);
      setHasSavedChat(false);
      setShowChat(true);
      setShowSidebar(false);
      return;
    }
    const saved = load('fi_messages', []);
    const newId = generateChatId();
    setActiveChatId(newId);
    setMessages(saved);
    setHasSavedChat(false);
    setShowChat(true);
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
    // v1: auto-default role to landlord (we only ship landlord tools for now)
    if (!sp.role) {
      const seeded = { ...sp, role: 'landlord' };
      setProfile(seeded);
      setShowProfile(true);
    } else {
      setShowChat(true);
    }
  };

  // v8: Chat (tile 04) skips the profile gate — it's pure Q&A, no landlord-identified PDF.
  const openChatDirect = () => {
    if (!activeChatId) setActiveChatId(generateChatId());
    setShowChat(true);
  };

  // v9.1: Screen/Stamp tiles open their tool modal directly. Role auto-seeds to landlord (v1 default).
  const seedLandlordRole = () => {
    const sp = load('fi_profile', { role: '', state: '', type: '', rent: '' });
    if (!sp.role) {
      const seeded = { ...sp, role: 'landlord' };
      setProfile(seeded);
      save('fi_profile', seeded);
    }
  };
  // BUGFIX: setShowChat(true) is required — the tool modal JSX lives inside the
  // chat render branch. Without it, the Landing branch keeps rendering and the
  // modal never mounts, so taps on Screen/Stamp tiles look dead.
  const openScreenDirect = () => {
    if (!activeChatId) setActiveChatId(generateChatId());
    seedLandlordRole();
    setLandingToTool(true);
    setShowChat(true);
    setShowScreenTool(true);
  };
  const openStampDirect = () => {
    if (!activeChatId) setActiveChatId(generateChatId());
    seedLandlordRole();
    setLandingToTool(true);
    setShowChat(true);
    setShowStampTool(true);
  };

  // v9.6 T12 — open the "Your scans" history view. Unlike the tool modals,
  // this one stays on Landing (doesn't flip showChat) because it's not a
  // tool — it's a meta view of all prior scans.
  const openScansDirect = () => { setShowScansHistory(true); };

  // Close tool + return to wherever the user came from.
  // If they launched the tool from Landing, they go back to Landing.
  // If they launched it from inside chat, they stay in chat.
  const closeToolSmart = (setter) => {
    setter(false);
    if (landingToTool) {
      setShowChat(false);
      setLandingToTool(false);
    }
  };

  // v9.3 PeekChat escalation — user taps "Open full chat →" inside the peek.
  // Bring them to the full chat page, close any tool underneath. If they
  // came from Landing, keep the Landing-to-chat flag cleared since they're
  // now explicitly asking for full chat.
  const openFullChatFromPeek = () => {
    setShowScreenTool(false);
    setShowStampTool(false);
    setLandingToTool(false);
    setShowChat(true);
  };

  if (!ready) return null;

  // v9.3 — PeekChat renders from EVERY top-level branch (Landing, Profile, Chat).
  // It's a persistent dock at the bottom of the viewport — chat follows the
  // user everywhere instead of being a destination they have to navigate to.
  // Defining the node once keeps the three return sites DRY.
  //
  // Context label tells the peek header which screen the user is currently on,
  // so Claude's answer can be framed appropriately ("while you're in Stamp
  // Duty…"). On the full chat page we pass undefined so the peek just says
  // "Ask Find.ai" — because you're already there.
  const peekContext = showStampTool
    ? (lang === 'en' ? 'Stamp Duty'       : lang === 'bm' ? 'Duti Setem'        : '印花税')
    : showScreenTool
      ? (lang === 'en' ? 'Tenant Screening' : lang === 'bm' ? 'Saringan Penyewa' : '租客审查')
      : !showChat
        ? (lang === 'en' ? 'Home'            : lang === 'bm' ? 'Laman Utama'      : '首页')
        : undefined;

  // Last 3 messages for the peek's "Recent" preview strip.
  // Falls back to the most-recently-updated chat in history if the current
  // chat is empty (common case: user on Landing, never chatted before or
  // started a fresh case).
  const latestPriorChat = chatHistory.length > 0
    ? [...chatHistory].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0]
    : null;
  const peekRecentHistory = latestPriorChat?.messages || [];

  // Hide the peek dock during full-screen modals where it would collide with
  // tool-internal inputs or keyboards (Profile onboarding, Case Memory editor,
  // Tenant Register wizard, sidebar overlay).
  const peekHidden = showProfile || showCaseMemory || showTenantRegister || showSidebar;

  const peekChatNode = (
    <PeekChat
      lang={lang}
      messages={messages}
      recentHistory={peekRecentHistory}
      activeMemory={activeMemory}
      profile={profile}
      caseType={activeCaseType}
      context={peekContext}
      hidden={peekHidden}
      onOpenFull={openFullChatFromPeek}
    />
  );

  // Landing
  if (!showChat && !showProfile) {
    // v9.6 T12 — count of saved Payment Discipline Scans, used to gate the
    // "Your scans" chip on Landing. Zero = no chip (keeps first-run Welcome
    // clean; no dead button for users who haven't scanned anyone yet).
    const scansCount = collectScans(chatHistory).length;
    return (
      <>
        <Landing
          onStart={startChat}
          onOpenChat={openChatDirect}
          onOpenScreen={openScreenDirect}
          onOpenStamp={openStampDirect}
          onOpenScans={openScansDirect}
          scansCount={scansCount}
          lang={lang}
          setLang={setLang}
          hasSavedChat={hasSavedChat}
          onContinueChat={loadChat}
        />
        {peekChatNode}
        {showScansHistory && (
          <ScansHistory
            open={showScansHistory}
            lang={lang}
            chatHistory={chatHistory}
            onClose={() => setShowScansHistory(false)}
          />
        )}
      </>
    );
  }

  // Profile — Bento onboarding (v1: landlord-first)
  if (showProfile) {
    const t = UI[lang];
    const roleIcons = { landlord: '🏠', tenant: '🔑', buyer: '🛒' };
    const typeTiles = [
      { key: 'condo', icon: '🏢', bg: '#dbeafe', ink: '#1e40af' },
      { key: 'landed', icon: '🏡', bg: '#d1fae5', ink: '#065f46' },
      { key: 'shop', icon: '🏪', bg: '#fef3c7', ink: '#92400e' },
      { key: 'industrial', icon: '🏭', bg: '#fee2e2', ink: '#991b1b' },
      { key: 'land', icon: '🏞️', bg: '#ede9fe', ink: '#5b21b6' },
    ];
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #f1f4f8 100%)' }}>
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
          <button onClick={() => { setShowProfile(false); }}
            className="flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-lg transition active:scale-95"
            style={{ color: '#64748b' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            {lang === 'en' ? 'Back' : lang === 'bm' ? 'Kembali' : '返回'}
          </button>
          <button onClick={() => setLang(lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en')}
            className="text-[11px] px-3.5 py-1.5 rounded-full font-semibold transition active:scale-95"
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
            {t.langToggle}
          </button>
        </header>

        {/* Bento grid */}
        <div className="px-4 pb-28 max-w-lg mx-auto space-y-3">

          {/* Hero dark tile — greeting */}
          <div className="rounded-[24px] p-6 text-white card-up"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 4px 20px rgba(15,23,42,0.08)' }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ background: 'rgba(16,185,129,0.18)', color: '#6ee7b7' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
              {t.profileV1Badge}
            </div>
            <h2 className="text-[26px] font-bold mb-2 leading-[1.1]" style={{ letterSpacing: '-0.03em' }}>{t.profileTitle}</h2>
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.profileDesc}</p>
          </div>

          {/* Role — Landlord locked tile */}
          <div className="card-up delay-1">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2 pl-1" style={{ color: '#94a3b8' }}>{t.profileRole}</div>
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.18)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: 'rgba(255,255,255,0.12)' }}>
                {roleIcons.landlord}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white">{t.roles.landlord}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.profileV1Hint}</div>
              </div>
            </div>
            {/* Coming soon roles */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['tenant', 'buyer'].map(r => (
                <div key={r} className="rounded-2xl p-3 flex items-center gap-2.5 relative overflow-hidden"
                  style={{ background: 'white', border: '1px dashed #cbd5e1', opacity: 0.6 }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: '#f1f5f9' }}>
                    {roleIcons[r]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold" style={{ color: '#475569' }}>{t.roles[r]}</div>
                    <div className="text-[9px]" style={{ color: '#94a3b8' }}>{t.comingSoon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State — bento select */}
          <div className="card-up delay-2">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2 pl-1" style={{ color: '#94a3b8' }}>{t.profileState}</div>
            <div className="rounded-2xl p-3 relative" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ede9fe' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <select value={profile.state} onChange={(e) => setProfile({...profile, state: e.target.value})}
                  className="flex-1 bg-transparent text-[14px] font-semibold focus:outline-none appearance-none py-2 pr-6 min-h-[40px]"
                  style={{ color: profile.state ? '#0f172a' : '#94a3b8' }}>
                  <option value="">{lang === 'en' ? 'Select state...' : lang === 'bm' ? 'Pilih negeri...' : '选择州属...'}</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" className="absolute right-4 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Property type — pastel bento tiles */}
          <div className="card-up delay-3">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2 pl-1" style={{ color: '#94a3b8' }}>{t.profileType}</div>
            <div className="grid grid-cols-3 gap-2.5">
              {typeTiles.map(tp => {
                const active = profile.type === tp.key;
                return (
                  <button key={tp.key} onClick={() => setProfile({...profile, type: tp.key})}
                    className="rounded-2xl p-4 transition active:scale-[0.96] flex flex-col items-center gap-2"
                    style={active
                      ? { background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }
                      : { background: tp.bg }
                    }>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: active ? 'rgba(255,255,255,0.12)' : 'white' }}>{tp.icon}</div>
                    <span className="text-[11px] font-bold" style={{ color: active ? '#fff' : tp.ink, letterSpacing: '-0.01em' }}>{t.types[tp.key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rent — bento input */}
          <div className="card-up delay-4">
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2 pl-1" style={{ color: '#94a3b8' }}>{t.profileRent}</div>
            <div className="rounded-2xl p-3" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15,23,42,0.03)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#d1fae5' }}>
                  <span className="text-[13px] font-black" style={{ color: '#065f46' }}>RM</span>
                </div>
                <input type="number" value={profile.rent} onChange={(e) => setProfile({...profile, rent: e.target.value})}
                  placeholder="2,500"
                  className="flex-1 bg-transparent text-[16px] font-bold focus:outline-none py-2 min-h-[40px]"
                  style={{ color: '#0f172a' }} />
                <span className="text-[10px] font-semibold pr-1" style={{ color: '#94a3b8' }}>/ {lang === 'en' ? 'month' : lang === 'bm' ? 'bulan' : '月'}</span>
              </div>
            </div>
          </div>

          {/* Disclaimer chip */}
          <div className="rounded-2xl p-3.5 flex items-center gap-2.5 card-up delay-5"
            style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f59e0b' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold leading-tight" style={{ color: '#78350f' }}>
                {lang === 'en' ? 'Support tool only — not legal advice' : lang === 'bm' ? 'Alat sokongan sahaja — bukan nasihat guaman' : '仅为辅助工具 — 非法律意见'}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom actions */}
        <div className="fixed bottom-0 left-0 right-0 z-20" style={{ background: 'linear-gradient(180deg, rgba(241,244,248,0) 0%, #f1f4f8 40%)' }}>
          <div className="max-w-lg mx-auto px-4 pt-5 pb-5">
            <div className="flex gap-2.5">
              <button onClick={() => { setShowProfile(false); setShowChat(true); }}
                className="flex-1 py-3.5 rounded-2xl text-[13px] font-semibold transition active:scale-[0.98]"
                style={{ background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }}>{t.profileSkip}</button>
              <button onClick={() => { save('fi_profile', { ...profile, role: 'landlord' }); setShowProfile(false); setShowChat(true); }}
                className="flex-[2] py-3.5 rounded-2xl text-[14px] font-bold text-white transition active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>{t.profileSave} →</button>
            </div>
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
      {/* Case-file memory editor (per-chat) */}
      <CaseMemoryModal
        open={showCaseMemory}
        lang={lang}
        memory={activeMemory}
        caseType={activeCaseType}
        onSave={saveCaseMemory}
        onClose={() => setShowCaseMemory(false)}
        onClear={clearCaseMemory}
      />

      {/* Phase 1 — SDSAS 2026 Stamp Duty Calculator (TOOL 3)
          v9.3: no more Ask chip — the persistent PeekChat dock at the bottom
          of the viewport handles all side-questions. Closing this tool uses
          closeToolSmart so users who launched from Landing return to Landing
          (not the chat page). */}
      {showStampTool && (
        <StampDutyCalc
          lang={lang}
          onClose={() => closeToolSmart(setShowStampTool)}
          activeMemory={activeMemory}
          onSaveMemory={(nextMemory) => saveCaseMemory(nextMemory, activeCaseType)}
          profileLandlord={profile.role === 'landlord' ? t.roles.landlord : ''}
          property={activeMemory?.property?.nickname || activeMemory?.property?.address || ''}
        />
      )}

      {/* Phase 1 — Payment Discipline Scan (TOOL 1) */}
      {showScreenTool && (
        <TenantScreen
          lang={lang}
          onClose={() => closeToolSmart(setShowScreenTool)}
          activeMemory={activeMemory}
          onSaveMemory={(nextMemory) => saveCaseMemory(nextMemory, activeCaseType)}
          profileLandlord={profile.role === 'landlord' ? t.roles.landlord : ''}
          property={activeMemory?.property?.nickname || activeMemory?.property?.address || ''}
        />
      )}

      {/* v9.3 Persistent Chat Dock — collapsed bar at bottom, expands into a
          peek pane on tap. Replaces the v9.2 modal ChatDrawer. */}
      {peekChatNode}

      {/* Path D — Tenant Pre-Registration (reusable trust profile) */}
      {showTenantRegister && (
        <TenantRegister
          lang={lang}
          onClose={() => setShowTenantRegister(false)}
        />
      )}

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
            {/* Chat list — bento cards */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
              {chatHistory.length === 0 ? (
                <div className="rounded-2xl p-6 text-center mt-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: 'white', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
                    <span className="text-xl">💬</span>
                  </div>
                  <div className="text-[12px] font-semibold" style={{ color: '#475569' }}>
                    {lang === 'en' ? 'No conversations yet' : lang === 'bm' ? 'Belum ada perbualan' : '暂无对话'}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: '#94a3b8' }}>
                    {lang === 'en' ? 'Your chats will appear here' : lang === 'bm' ? 'Chat anda akan muncul di sini' : '您的对话将显示在此'}
                  </div>
                </div>
              ) : (
                chatHistory
                  .filter(ch => !historySearch || ch.title.toLowerCase().includes(historySearch.toLowerCase()))
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((ch, idx) => {
                    const tileColors = [
                      { bg: '#dbeafe', ink: '#1e40af' },
                      { bg: '#fef3c7', ink: '#92400e' },
                      { bg: '#fee2e2', ink: '#991b1b' },
                      { bg: '#ede9fe', ink: '#5b21b6' },
                      { bg: '#d1fae5', ink: '#065f46' },
                    ];
                    const color = tileColors[idx % 5];
                    const isActive = ch.id === activeChatId;
                    return (
                      <div key={ch.id}
                        className="group rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition active:scale-[0.98] history-item"
                        style={{
                          background: isActive ? '#0f172a' : 'white',
                          border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                          boxShadow: isActive ? '0 4px 16px rgba(15,23,42,0.18)' : '0 1px 2px rgba(15,23,42,0.03)',
                        }}
                        onClick={() => loadHistoryChat(ch.id)}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isActive ? 'rgba(255,255,255,0.12)' : color.bg }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : color.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-bold truncate leading-tight" style={{ color: isActive ? '#fff' : '#0f172a' }}>
                            {ch.title}
                          </div>
                          <div className="text-[10px] mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>
                            {ch.messages?.length || 0} {lang === 'en' ? 'messages' : lang === 'bm' ? 'mesej' : '条消息'}
                            {' · '}
                            {new Date(ch.updatedAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'bm' ? 'ms-MY' : 'en-MY', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteHistoryChat(ch.id); }}
                          className="opacity-0 group-hover:opacity-100 touch-target rounded-lg transition active:scale-90 flex-shrink-0"
                          style={{ color: isActive ? 'rgba(255,255,255,0.5)' : '#cbd5e1' }}>
                          <TrashIcon />
                        </button>
                      </div>
                    );
                  })
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
          {/* Case memory — opens the per-case memory editor */}
          <button
            onClick={() => setShowCaseMemory(true)}
            className="touch-target rounded-xl transition active:scale-95 relative"
            style={{ color: '#94a3b8' }}
            title={lang === 'en' ? 'Case memory' : lang === 'bm' ? 'Memori kes' : '案件记忆'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="9" x2="15" y1="13" y2="13"/>
              <line x1="9" x2="15" y1="17" y2="17"/>
            </svg>
            {(activeChatEntry?.memory && (
              activeChatEntry.memory.property?.nickname ||
              activeChatEntry.memory.property?.address ||
              (activeChatEntry.memory.disputes || []).length > 0 ||
              activeChatEntry.memory.taxDates?.lastStampDate ||
              activeChatEntry.memory.tenant?.name
            )) && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
            )}
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div ref={chatRef} className="chat-area flex-1 overflow-y-auto px-4 py-4" style={{ background: has ? '#FAF8F3' : '#FAF8F3' }}>
        {!has ? (
          <div className="flex flex-col items-center justify-center pb-8 pt-8 min-h-[60vh] fade-in">
            {/* v9.1 — Minimal chat empty state. Chat is tile 04, not the homepage. */}
            <div className="text-center max-w-sm px-5">
              <div className="mb-5 flex justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 L20 5 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V5 Z" fill="#0F1E3F"/>
                  <path d="M8.5 12 L11 14.5 L15.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <h2 className="text-[26px] font-black leading-tight mb-3" style={{ color: '#0F1E3F', letterSpacing: '-0.04em' }}>
                {lang === 'en' ? 'Ask anything.' : lang === 'bm' ? 'Tanya apa sahaja.' : '随便问。'}
              </h2>
              <p className="text-[13.5px] leading-relaxed" style={{ color: '#3F4E6B' }}>
                {lang === 'en'
                  ? 'Malaysian property law — Sabah to Sarawak, deposit disputes, stamp duty, strata, edge cases.'
                  : lang === 'bm'
                    ? 'Undang-undang harta Malaysia — Sabah ke Sarawak, pertikaian deposit, duti setem, strata, kes khas.'
                    : '马来西亚房产法律 — 沙巴到砂拉越、押金、印花税、分层、特殊情况。'}
              </p>
            </div>

            {/* Starter pills — low-friction, one tap to start */}
            <div className="mt-7 flex flex-wrap gap-2 justify-center max-w-sm px-3">
              {(t.questions[profile.role] || t.questions.default).slice(0, 4).map((q, i) => (
                <button key={i} onClick={() => sendMessage(q.text)}
                  className="text-[12px] font-semibold px-3.5 py-2 rounded-full transition active:scale-95 hover:shadow-sm"
                  style={{ background: '#F3EFE4', color: '#0F1E3F', border: '1px solid #E7E1D2' }}>
                  {q.title}
                </button>
              ))}
            </div>

            {/* Tiny privacy + disclaimer strip */}
            <div className="mt-10 text-center px-6">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9A9484" strokeWidth="2.5" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: '#9A9484' }}>
                  {lang === 'en' ? 'Private · On your device' : lang === 'bm' ? 'Peribadi · Pada peranti' : '私密 · 保留在您的设备'}
                </span>
              </div>
              <div className="text-[9.5px] italic" style={{ color: '#9A9484' }}>
                {lang === 'en' ? '* Support tool only — not legal advice.' : lang === 'bm' ? '* Alat sokongan sahaja — bukan nasihat guaman.' : '* 仅为辅助工具 — 非法律意见。'}
              </div>
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
      <div className="no-print input-elevated px-4 pt-3 pb-2.5 input-safe relative">

        {/* Voice error toast (auto-dismisses after 5s) */}
        {voiceError && (
          <div className="absolute left-4 right-4 -top-12 rounded-2xl px-4 py-3 flex items-start gap-2.5 fade-in"
            style={{ background: '#fee2e2', border: '1px solid #fecaca', boxShadow: '0 4px 16px rgba(220,38,38,0.15)', zIndex: 30 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div className="text-[11px] font-medium leading-snug" style={{ color: '#991b1b' }}>
              {voiceError === 'denied' ? t.voiceDenied : t.voiceNoHardware}
            </div>
          </div>
        )}

        {/* Fallback lang note (e.g. "Switching to English…") */}
        {voiceFallbackNote && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-9 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 fade-in"
            style={{ background: '#fef3c7', border: '1px solid #fde68a', boxShadow: '0 2px 8px rgba(146,64,14,0.12)', zIndex: 30 }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#92400e' }}>{t.voiceSwitchingLang}</span>
          </div>
        )}

        {/* "Having trouble? Type instead" hint after 2 consecutive no-speech fails */}
        {voiceFailCount >= 2 && !listening && !voiceError && (
          <div className="mb-2 rounded-xl px-3 py-2 flex items-center gap-2 fade-in"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/>
            </svg>
            <span className="text-[11px] font-medium" style={{ color: '#475569' }}>{t.voiceTypeInstead}</span>
          </div>
        )}

        <div className="input-area flex items-end gap-1 rounded-2xl px-3.5 pr-1.5 py-1 bg-white transition"
          style={{ border: listening ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.08), 0 1px 4px rgba(15,23,42,0.03)' : '0 1px 4px rgba(15,23,42,0.03)' }}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={listening ? (voiceHoldMode ? t.voiceHoldHint : t.placeholderListening) : (has ? t.placeholderActive : t.placeholder)}
            rows={1} className="flex-1 resize-none bg-transparent text-[16px] focus:outline-none py-2.5"
            style={{ color: '#1e293b', maxHeight: '100px', lineHeight: '1.5' }}
            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
          />
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              onMouseDown={handleVoicePressStart}
              onMouseUp={handleVoicePressEnd}
              onMouseLeave={handleVoicePressEnd}
              onTouchStart={handleVoicePressStart}
              onTouchEnd={handleVoicePressEnd}
              onTouchCancel={handleVoicePressEnd}
              onContextMenu={(e) => e.preventDefault()}
              disabled={loading}
              aria-label={listening ? 'Stop recording' : 'Start voice input'}
              className={`touch-target rounded-xl flex items-center justify-center transition active:scale-90 relative overflow-hidden disabled:opacity-40 ${
                listening ? 'text-white' : ''
              }`}
              style={{
                color: listening ? 'white' : '#94a3b8',
                background: listening
                  ? `radial-gradient(circle, rgba(239,68,68,${0.9 + voiceAmplitude * 0.1}) 0%, rgba(220,38,38,1) 100%)`
                  : 'transparent',
                transform: listening ? `scale(${1 + voiceAmplitude * 0.25})` : 'scale(1)',
                boxShadow: listening ? `0 0 0 ${4 + voiceAmplitude * 12}px rgba(239,68,68,${0.25 - voiceAmplitude * 0.15})` : 'none',
                transition: 'transform 80ms ease-out, box-shadow 80ms ease-out, background 120ms',
              }}>
              {listening ? (
                // Waveform bars when recording — 5 bars scaled by amplitude
                <div className="flex items-center gap-[2px] h-5">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const phase = (voiceAmplitude + i * 0.17) % 1;
                    const h = 20 + phase * 60 + voiceAmplitude * 40;
                    return (
                      <span key={i} style={{
                        width: '2.5px',
                        height: `${Math.min(20, h / 5)}px`,
                        background: 'white',
                        borderRadius: '2px',
                        transition: 'height 60ms ease-out',
                      }} />
                    );
                  })}
                </div>
              ) : (
                <MicIcon />
              )}
            </button>
          )}
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="touch-target rounded-xl flex items-center justify-center disabled:opacity-30 transition active:scale-90"
            style={{ background: input.trim() ? 'linear-gradient(135deg, #0f172a, #1e293b)' : '#e2e8f0', borderRadius: '12px' }}>
            <SendIcon />
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 mt-1.5 pb-0.5">
          <div className="flex items-center gap-1">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p className="text-[9px] font-medium" style={{ color: '#d1d5db' }}>{t.privacy}</p>
          </div>
          <span className="text-[9px]" style={{ color: '#e5e7eb' }}>·</span>
          <div className="flex items-center gap-1">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
            <p className="text-[9px] font-semibold" style={{ color: '#b45309' }}>
              {lang === 'en' ? 'Support only — consult a lawyer' : lang === 'bm' ? 'Sokongan sahaja — rujuk peguam' : '仅为辅助 — 请咨询律师'}
            </p>
          </div>
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
