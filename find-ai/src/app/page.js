'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Landing from './landing';
import ErrorBoundary from '../components/ErrorBoundary';
import CNMYTrustLink from '../components/tools/CNMYTrustLink';
import MYCompanyCheck from '../components/tools/MYCompanyCheck';
import { L } from '../components/tools/labels';

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
  },
};

// Logo — navy/blue gradient
const Logo = ({ size = 32 }) => (
  <div className="flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size, minWidth: size, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', borderRadius: size * 0.32 }}>
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
// ToolsIcon removed — Stage 1 uses direct scoring cards
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

// Helpers
const load = (key, fb) => {
  if (typeof window === 'undefined') return fb;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; }
};
const save = (key, v) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en');
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCN, setShowCN] = useState(false);
  const [showMY, setShowMY] = useState(false);
  const [profile, setProfile] = useState({ role: '', state: '', type: '', rent: '' });
  const [hasSavedChat, setHasSavedChat] = useState(false);
  const [ready, setReady] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [copied, setCopied] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => {
    setLang(load('fi_lang', 'en'));
    setProfile(load('fi_profile', { role: '', state: '', type: '', rent: '' }));
    if (load('fi_messages', []).length > 0) setHasSavedChat(true);
    setReady(true);
  }, []);

  useEffect(() => { if (ready) save('fi_lang', lang); }, [lang, ready]);
  useEffect(() => {
    if (ready && messages.length > 0) {
      const real = messages.filter(m => m.content !== '');
      if (real.length > 0) save('fi_messages', real);
    }
  }, [messages, ready]);
  useEffect(() => { if (ready) save('fi_profile', profile); }, [profile, ready]);

  // Auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
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

  const profileCtx = () => {
    const p = profile;
    if (!p.role && !p.state && !p.type && !p.rent) return '';
    let c = 'USER PROFILE: ';
    if (p.role) c += `Role: ${p.role}. `;
    if (p.state) c += `Property in ${p.state}. `;
    if (p.type) c += `Type: ${p.type}. `;
    if (p.rent) c += `Monthly rent: RM${p.rent}. `;
    return c.trim();
  };

  // Generate smart follow-up suggestions from AI response
  const genFollowUps = useCallback((userQ, aiAnswer) => {
    const q = userQ.toLowerCase();
    const a = aiAnswer.toLowerCase();
    const picks = [];

    // Topic-based follow-up mapping
    const followUpMap = {
      en: {
        deposit: ['How do I write a demand letter for my deposit?', 'What counts as normal wear and tear?', 'Can I take this to tribunal?'],
        rent: ['Can I use Distress Act to seize belongings?', 'How to write a Letter of Demand?', "What if tenant runs away owing rent?"],
        evict: ['How long does court eviction take?', 'Can I claim damages after eviction?', 'What if tenant refuses to leave after notice?'],
        stamp: ['What penalty if I stamp late?', 'Can unstamped agreement be used in court?', 'How to stamp via MyTax portal?'],
        repair: ['Can I deduct repair costs from rent?', 'What if the issue is common property?', 'How to document defects properly?'],
        buy: ['How much stamp duty will I pay?', 'What if my loan gets rejected?', 'How to do a land search?'],
        subsale: ['What is the 3+1 completion timeline?', 'How to protect my earnest deposit?', 'What does the lawyer handle?'],
        loan: ['What margin of finance can I get?', 'Conventional vs Islamic financing?', "What's the lock-in penalty?"],
        auction: ['What risks should I check before bidding?', 'LACA vs Non-LACA — what\'s the difference?', 'Can I get financing for lelong property?'],
        foreign: ['What is the minimum price in my state?', 'How much RPGT will I pay?', 'How long does state consent take?'],
        defect: ['How to file at Homebuyer Tribunal?', 'What if developer goes bankrupt?', 'Can I claim LAD for late delivery?'],
        strata: ['How to file at Strata Tribunal?', 'Can MC charge me extra?', 'What are my AGM voting rights?'],
        agent: ['How to verify if agent is registered?', 'How much commission should I pay?', 'Can I deal directly without agent?'],
        inherit: ['Do I need to pay stamp duty on inheritance?', 'Joint tenancy vs tenancy in common?', 'How to apply for Letter of Administration?'],
      },
      bm: {
        deposit: ['Macam mana tulis surat tuntutan deposit?', 'Apa kira lusuh biasa?', 'Boleh bawa ke tribunal?'],
        rent: ['Boleh guna Akta Distres untuk rampas barang?', 'Macam mana tulis surat tuntutan?', 'Kalau penyewa lari?'],
        evict: ['Berapa lama proses mahkamah?', 'Boleh tuntut ganti rugi selepas usir?', 'Kalau penyewa enggan keluar?'],
        default: ['Berapa duti setem untuk perjanjian sewa?', 'Apa hak saya sebagai tuan rumah?', 'Macam mana nak beli rumah subsale?'],
      },
      zh: {
        deposit: ['怎么写押金催款信？', '什么算正常磨损？', '可以去消费者法庭吗？'],
        rent: ['可以扣押租客物品吗？', '怎么写催款函？', '租客跑了怎么办？'],
        default: ['租约印花税怎么算？', '我有什么权利？', '买二手房流程是什么？'],
      },
    };

    const langMap = followUpMap[lang] || followUpMap.en;

    // Match topic from question + answer
    const topics = ['deposit', 'rent', 'evict', 'stamp', 'repair', 'buy', 'subsale', 'loan', 'auction', 'foreign', 'defect', 'strata', 'agent', 'inherit'];
    const matched = topics.find(t => q.includes(t) || a.includes(t));

    if (matched && langMap[matched]) {
      picks.push(...langMap[matched]);
    } else if (langMap.default) {
      picks.push(...langMap.default);
    } else {
      // Fallback English
      const fallbacks = followUpMap.en;
      const fallbackMatch = topics.find(t => q.includes(t) || a.includes(t));
      if (fallbackMatch && fallbacks[fallbackMatch]) picks.push(...fallbacks[fallbackMatch]);
      else picks.push('How much stamp duty do I need to pay?', 'What are my rights as a tenant?', 'How to buy subsale property?');
    }

    // Filter out the question they just asked (fuzzy)
    const filtered = picks.filter(p => {
      const norm = p.toLowerCase().replace(/[?!.,]/g, '');
      const qNorm = q.replace(/[?!.,]/g, '');
      return !norm.includes(qNorm) && !qNorm.includes(norm);
    });

    setSuggestions(filtered.slice(0, 3));
  }, [lang]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const all = [...messages, userMsg];
    setMessages([...all, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: all, profileContext: profileCtx() }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages([...all, { role: 'assistant', content: `Error: ${err.error}` }]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              full += JSON.parse(line.slice(6)).text;
              setMessages([...all, { role: 'assistant', content: full }]);
            } catch {}
          }
        }
      }

      // Generate follow-up suggestions after response complete
      if (full) genFollowUps(text.trim(), full);

    } catch (err) {
      const isOffline = !navigator.onLine;
      const errorMsg = isOffline
        ? (lang === 'en' ? '📡 You appear to be offline. Check your internet connection and try again.'
          : lang === 'bm' ? '📡 Anda kelihatan di luar talian. Semak sambungan internet anda.'
          : '📡 您似乎已离线。请检查网络连接后重试。')
        : (lang === 'en' ? '⚠️ Connection error. Please try again.'
          : lang === 'bm' ? '⚠️ Ralat sambungan. Sila cuba lagi.'
          : '⚠️ 连接错误。请重试。');
      setMessages([...all, { role: 'assistant', content: errorMsg }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }, [messages, loading, profile, genFollowUps]);

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

  const clearChat = () => { setMessages([]); save('fi_messages', []); setHasSavedChat(false); setSuggestions([]); };
  const loadChat = () => { setMessages(load('fi_messages', [])); setHasSavedChat(false); setShowChat(true); };

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
    sp.role ? setShowChat(true) : setShowProfile(true);
  };

  const fmt = (text) => {
    let h = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    // Clean up raw markdown that leaks through
    h = h.replace(/<br\/>---<br\/>/g, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0"/>');
    h = h.replace(/<br\/>-{3,}<br\/>/g, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0"/>');
    h = h.replace(/##\s+(.*?)(?=<br\/>|$)/g, '<div style="font-size:14px;font-weight:700;color:#0f172a;margin:14px 0 6px">$1</div>');

    // ⚡ Legal Bridge — red/blue split card
    h = h.replace(
      /⚡(.*?)(?=<br\/><br\/>|<br\/>⚖️|<br\/>✅|$)/gs,
      (match) => {
        const content = match.replace(/^⚡\s*/, '');
        return `<div style="margin:10px 0;padding:12px 14px;background:linear-gradient(135deg,#fef2f2,#eff6ff);border:1px solid #e2e8f0;border-left:3px solid #dc2626;border-right:3px solid #2563eb;border-radius:12px">
          <div style="font-size:10px;font-weight:700;letter-spacing:0.5px;color:#64748b;margin-bottom:6px">⚡ LEGAL BRIDGE</div>
          <div style="font-size:12px;line-height:1.6;color:#334155">${content}</div></div>`;
      }
    );

    // ⚖️ Law citation — subtle blue tag
    h = h.replace(
      /⚖️\s*(.*?)(?=<br\/>|$)/g,
      (_, content) => `<div style="margin:8px 0;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px">
        <span style="font-size:12px">⚖️</span><span style="font-size:12px;color:#1e40af;font-weight:500">${content}</span></div>`
    );

    // ✅ Action steps — with bold title
    h = h.replace(
      /✅\s*<strong>(.*?)<\/strong>(.*?)(?=<br\/><br\/>|<br\/>🚫|<br\/>💰|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|$)/gs,
      (_, title, steps) => {
        const items = [];
        const parts = steps.split(/<br\/>/);
        for (const p of parts) {
          const m = p.match(/^\s*(\d+)\.\s*(.*)/);
          if (m) items.push({ num: m[1], text: m[2] });
          else if (items.length > 0 && p.trim()) items[items.length - 1].text += ' ' + p.trim();
        }
        const stepsHtml = items.map(it =>
          `<div style="display:flex;gap:8px;align-items:flex-start;margin-top:6px">
            <span style="min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;background:#f0fdf4;color:#16a34a;font-size:10px;font-weight:700;border-radius:6px;border:1px solid #bbf7d0;flex-shrink:0">${it.num}</span>
            <span style="font-size:12px;color:#334155;line-height:1.5">${it.text}</span></div>`
        ).join('');
        return `<div style="margin:10px 0;padding:12px 14px;background:#f8fdf8;border:1px solid #dcfce7;border-radius:12px">
          <div style="font-size:12px;font-weight:700;color:#166534;margin-bottom:4px">✅ ${title}</div>${stepsHtml}</div>`;
      }
    );

    // ✅ without bold title
    h = h.replace(
      /✅\s*(?!<strong>)(.*?)(?=<br\/><br\/>|<br\/>🚫|<br\/>💰|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|$)/gs,
      (_, steps) => {
        if (steps.trim().length < 3) return `✅ ${steps}`;
        const items = [];
        const parts = steps.split(/<br\/>/);
        let firstLine = '';
        for (const p of parts) {
          const m = p.match(/^\s*(\d+)\.\s*(.*)/);
          if (m) items.push({ num: m[1], text: m[2] });
          else if (items.length > 0 && p.trim()) items[items.length - 1].text += ' ' + p.trim();
          else if (!firstLine && p.trim()) firstLine = p.trim();
        }
        const titleHtml = firstLine ? `<div style="font-size:12px;font-weight:700;color:#166534;margin-bottom:4px">✅ ${firstLine}</div>` : '';
        const stepsHtml = items.map(it =>
          `<div style="display:flex;gap:8px;align-items:flex-start;margin-top:6px">
            <span style="min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;background:#f0fdf4;color:#16a34a;font-size:10px;font-weight:700;border-radius:6px;border:1px solid #bbf7d0;flex-shrink:0">${it.num}</span>
            <span style="font-size:12px;color:#334155;line-height:1.5">${it.text}</span></div>`
        ).join('');
        return `<div style="margin:10px 0;padding:12px 14px;background:#f8fdf8;border:1px solid #dcfce7;border-radius:12px">${titleHtml}${stepsHtml}</div>`;
      }
    );

    // 🚫 Warning — red accent
    h = h.replace(
      /🚫\s*(.*?)(?=<br\/>|$)/g,
      (_, content) => `<div style="margin:8px 0;padding:8px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;display:flex;align-items:center;gap:6px">
        <span style="font-size:12px">🚫</span><span style="font-size:12px;color:#991b1b;font-weight:500">${content}</span></div>`
    );

    // 💰 Cost — amber tag (handle multiline)
    h = h.replace(
      /💰\s*<strong>(.*?)<\/strong>(.*?)(?=<br\/><br\/>|<br\/>🚫|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|<br\/>✅|$)/gs,
      (_, title, body) => {
        const lines = body.split(/<br\/>/).filter(l => l.trim()).map(l =>
          `<div style="font-size:12px;color:#92400e;margin-top:3px">• ${l.replace(/^-\s*/, '').trim()}</div>`
        ).join('');
        return `<div style="margin:8px 0;padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px">
          <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:2px">💰 ${title}</div>${lines}</div>`;
      }
    );
    // 💰 single line fallback
    h = h.replace(
      /💰\s*(.*?)(?=<br\/>|$)/g,
      (_, content) => `<div style="margin:8px 0;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px">
        <span style="font-size:12px">💰</span><span style="font-size:12px;color:#92400e;font-weight:500">${content}</span></div>`
    );

    // 📋 Clause blocks — safe rendering without inline onclick
    h = h.replace(
      /📋\s*(?:<strong>)?(.*?)(?:<\/strong>)?:?\s*<br\/>(?:```)?<br\/>([\s\S]*?)(?:```|(?=<br\/><br\/>)|$)/gs,
      (_, title, clause) => {
        const displayClause = clause.replace(/&gt;\s?/g, '').replace(/```/g, '').trim();
        return `<div style="margin:10px 0;padding:14px;background:linear-gradient(135deg,#f1f5f9,#f8fafc);border:1px solid #e2e8f0;border-left:3px solid #3b82f6;border-radius:12px">
          <div style="display:flex;align-items:center;margin-bottom:8px">
            <span style="font-size:11px;font-weight:700;color:#1e293b">📋 ${title || 'Clause'}</span>
          </div>
          <div class="clause-text" style="font-size:12px;color:#334155;line-height:1.7;padding:10px 12px;background:rgba(255,255,255,0.7);border-radius:8px">${displayClause}</div></div>`;
      }
    );

    // 📋 old-style with > quotes
    h = h.replace(
      /📋\s*(?:<strong>)?(.*?)(?:<\/strong>)?.*?<br\/>(&gt;.*?)(?=<br\/><br\/>|$)/gs,
      (_, title, clause) => {
        return `<div style="margin:10px 0;padding:14px;background:linear-gradient(135deg,#f1f5f9,#f8fafc);border:1px solid #e2e8f0;border-left:3px solid #3b82f6;border-radius:12px">
          <div style="display:flex;align-items:center;margin-bottom:8px">
            <span style="font-size:11px;font-weight:700;color:#1e293b">📋 ${title || 'Clause'}</span>
          </div>
          <div class="clause-text" style="font-size:12px;color:#334155;line-height:1.7;padding:10px 12px;background:rgba(255,255,255,0.7);border-radius:8px">${clause.replace(/&gt;\s?/g,'')}</div></div>`;
      }
    );

    // 🔒 Verified — green confidence badge
    h = h.replace(
      /🔒\s*(.*?)(?=<br\/>|$)/g,
      (_, content) => `<div style="margin:10px 0;padding:10px 14px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;border-radius:12px;display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:8px;background:#22c55e;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-size:14px;color:white">🛡️</span></div>
        <div><span style="font-size:11px;font-weight:700;color:#166534;letter-spacing:0.02em">VERIFIED</span>
          <div style="font-size:12px;color:#15803d;margin-top:1px;font-weight:500">${content}</div></div></div>`
    );

    // ⚠️ General guidance — yellow confidence badge
    h = h.replace(
      /⚠️\s*(.*?)(?=<br\/>|$)/g,
      (_, content) => `<div style="margin:10px 0;padding:10px 14px;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:12px;display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:8px;background:#f59e0b;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-size:14px;color:white">⚠️</span></div>
        <div><span style="font-size:11px;font-weight:700;color:#92400e;letter-spacing:0.02em">GENERAL GUIDANCE</span>
          <div style="font-size:12px;color:#b45309;margin-top:1px;font-weight:500">${content}</div></div></div>`
    );

    // 🔴 Needs professional advice — red confidence badge
    h = h.replace(
      /🔴\s*(.*?)(?=<br\/>|$)/g,
      (_, content) => `<div style="margin:10px 0;padding:10px 14px;background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5;border-radius:12px;display:flex;align-items:center;gap:8px">
        <div style="width:28px;height:28px;border-radius:8px;background:#ef4444;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-size:14px;color:white">⚖️</span></div>
        <div><span style="font-size:11px;font-weight:700;color:#991b1b;letter-spacing:0.02em">CONSULT A LAWYER</span>
          <div style="font-size:12px;color:#dc2626;margin-top:1px;font-weight:500">${content}</div></div></div>`
    );

    // Clean up any remaining dash-only list items (- text)
    h = h.replace(/<br\/>\s*-\s+/g, '<br/>• ');

    return h;
  };

  if (!ready) return null;

  // Landing
  if (!showChat && !showProfile)
    return <Landing onStart={startChat} lang={lang} setLang={setLang} hasSavedChat={hasSavedChat} onContinueChat={loadChat} />;

  // Profile — banking-app onboarding
  if (showProfile) {
    const t = UI[lang];
    const roleIcons = { landlord: '🏠', tenant: '🔑', buyer: '🛒' };
    const typeIcons = { condo: '🏢', landed: '🏡', shop: '🏪' };
    return (
      <div className="flex flex-col min-h-screen" style={{ background: '#0f172a' }}>
        {/* Top section — navy with branding */}
        <div className="flex flex-col items-center pt-14 pb-8 px-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h2 className="text-[22px] font-bold mb-1.5 text-white" style={{ letterSpacing: '-0.02em' }}>{t.profileTitle}</h2>
          <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.profileDesc}</p>
        </div>

        {/* Bottom card — white, rounded top */}
        <div className="flex-1 bg-white px-6 pt-8 pb-6" style={{ borderRadius: '28px 28px 0 0' }}>
          <div className="max-w-sm mx-auto space-y-6">
            {/* Role — icon cards */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileRole}</label>
              <div className="flex gap-2.5">
                {['landlord','tenant','buyer'].map(r => (
                  <button key={r} onClick={() => setProfile({...profile, role: r})}
                    className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl text-[12px] font-semibold transition-all active:scale-95"
                    style={profile.role === r
                      ? { background: '#0f172a', color: '#fff', boxShadow: '0 4px 16px rgba(15,23,42,0.25)' }
                      : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                    }>
                    <span className="text-xl">{roleIcons[r]}</span>
                    {t.roles[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* State — clean select */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileState}</label>
              <select value={profile.state} onChange={(e) => setProfile({...profile, state: e.target.value})}
                className="w-full py-3.5 px-4 rounded-xl text-[14px] font-medium focus:outline-none transition appearance-none"
                style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: profile.state ? '#0f172a' : '#94a3b8' }}>
                <option value="">—</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Property type — icon cards */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest mb-3 block" style={{ color: '#94a3b8' }}>{t.profileType}</label>
              <div className="flex gap-2.5">
                {['condo','landed','shop'].map(tp => (
                  <button key={tp} onClick={() => setProfile({...profile, type: tp})}
                    className="flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl text-[12px] font-semibold transition-all active:scale-95"
                    style={profile.type === tp
                      ? { background: '#0f172a', color: '#fff', boxShadow: '0 4px 16px rgba(15,23,42,0.25)' }
                      : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
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
                  placeholder="2,500" className="w-full py-3.5 pl-12 pr-4 rounded-xl text-[14px] font-medium focus:outline-none transition"
                  style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }} />
              </div>
            </div>
          </div>

          {/* Actions — pinned to bottom */}
          <div className="flex gap-3 mt-8 max-w-sm mx-auto">
            <button onClick={() => { setShowProfile(false); setShowChat(true); }}
              className="flex-1 py-4 rounded-xl text-[13px] font-semibold transition active:scale-[0.98]"
              style={{ color: '#94a3b8' }}>{t.profileSkip}</button>
            <button onClick={() => { save('fi_profile', profile); setShowProfile(false); setShowChat(true); }}
              className="flex-[2] py-4 rounded-xl text-[14px] font-bold text-white transition active:scale-[0.98]"
              style={{ background: '#0f172a', boxShadow: '0 4px 16px rgba(15,23,42,0.3)' }}>{t.profileSave}</button>
          </div>
        </div>
      </div>
    );
  }

  // Chat
  const t = UI[lang];
  const tl = L[lang]; // tool labels for card titles
  const has = messages.length > 0;
  const hasP = profile.role || profile.state;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white" style={{ background: '#ffffff' }}>
      {/* Header — banking-app premium */}
      <header className="no-print glass-header header-safe sticky top-0 z-10 flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(226,232,240,0.8)' }}>
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div>
            <h1 className="text-[15px] font-bold leading-tight" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>{t.title}</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: loading ? '#3b82f6' : '#10b981', animation: loading ? 'pulseRing 1.5s infinite' : 'none' }} />
              <span className="text-[10px] font-medium" style={{ color: '#94a3b8' }}>{loading ? t.analyzing : has ? t.subtitleActive : t.subtitle}</span>
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
          /* Empty state — Stage 1: Chat + Company Scoring */
          <div className="flex flex-col h-full">
            {/* Welcome */}
            <div className="mt-4 mb-6 card-up">
              <div className="text-center">
                <h2 className="text-[22px] font-bold mb-2.5" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{t.welcomeTitle}</h2>
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
              </div>
            </div>

            {/* ===== COMPANY SCORING CARDS — Main Feature ===== */}
            <div className="card-up delay-1 mb-5">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2.5 pl-1" style={{ color: '#cbd5e1' }}>
                {lang === 'en' ? 'Company Verification' : lang === 'bm' ? 'Pengesahan Syarikat' : '公司验证'}
              </div>
              <div className="flex gap-2.5">
                {/* MY Company Check */}
                <button onClick={() => setShowMY(true)}
                  className="flex-1 flex flex-col items-center gap-2 py-5 px-3 rounded-2xl check-card"
                  style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', boxShadow: '0 4px 20px rgba(15,23,42,0.25)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="text-xl">🇲🇾</span>
                  </div>
                  <div className="text-center">
                    <div className="text-[13px] font-bold text-white">{tl.myCardTitle}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{tl.myCardDesc}</div>
                  </div>
                  {/* Mini traffic light indicator */}
                  <div className="flex gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: '#16a34a' }} />
                  </div>
                </button>

                {/* CN Company Check */}
                <button onClick={() => setShowCN(true)}
                  className="flex-1 flex flex-col items-center gap-2 py-5 px-3 rounded-2xl check-card"
                  style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)', boxShadow: '0 4px 20px rgba(220,38,38,0.2)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="text-xl">🇨🇳</span>
                  </div>
                  <div className="text-center">
                    <div className="text-[13px] font-bold text-white">{tl.cnCardTitle}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{tl.cnCardDesc}</div>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#fca5a5' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: '#fde68a' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: '#86efac' }} />
                  </div>
                </button>
              </div>
            </div>

            {/* ===== Q&A STARTER QUESTIONS ===== */}
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
          /* Messages — banking-clean spacing */
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-group flex ${msg.role === 'user' ? 'justify-end' : 'gap-2'} msg-in`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 mt-1">
                    <Logo size={26} />
                  </div>
                )}
                <div className={msg.role === 'assistant' ? 'max-w-[calc(100%-38px)]' : 'max-w-[82%]'}>
                  <div className={`text-[13.5px] leading-[1.65] ${
                    msg.role === 'user'
                      ? 'px-4 py-3 text-white rounded-[20px_20px_4px_20px]'
                      : `bot-msg bg-white px-4 py-3.5 rounded-[4px_20px_20px_20px]${loading && i === messages.length - 1 && msg.role === 'assistant' ? ' streaming' : ''}`
                  }`}
                    style={msg.role === 'user'
                      ? { background: '#0f172a' }
                      : { boxShadow: '0 1px 4px rgba(15,23,42,0.03)', color: '#334155', border: '1px solid #edf0f4' }
                    }
                    dangerouslySetInnerHTML={{ __html: fmt(msg.content) }}
                  />
                  {msg.role === 'assistant' && msg.content && (
                    <div className="msg-actions flex items-center gap-1 mt-1.5 pl-0.5">
                      <button onClick={() => copyMsg(msg.content)} className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg transition active:scale-95 hover:bg-slate-50" style={{ color: '#94a3b8' }}><CopyIcon /> Copy</button>
                      <button onClick={() => shareWA(msg.content)} className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg transition active:scale-95 hover:bg-slate-50" style={{ color: '#94a3b8' }}><ShareIcon /> Share</button>
                      <button onClick={handleSave} className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg transition active:scale-95 hover:bg-slate-50" style={{ color: '#94a3b8' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-2 msg-in">
                <div className="flex-shrink-0 mt-1"><Logo size={26} /></div>
                <div className="bg-white px-5 py-3.5 rounded-[4px_20px_20px_20px]" style={{ boxShadow: '0 1px 4px rgba(15,23,42,0.03)', border: '1px solid #edf0f4' }}>
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full typing-dot" style={{ background: '#3b82f6' }} />
                    <div className="w-1.5 h-1.5 rounded-full typing-dot" style={{ background: '#3b82f6' }} />
                    <div className="w-1.5 h-1.5 rounded-full typing-dot" style={{ background: '#3b82f6' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Smart follow-up suggestions */}
            {!loading && suggestions.length > 0 && (
              <div className="fade-in mt-3 pl-[34px]">
                <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: '#cbd5e1' }}>{t.followUps}</div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => { setSuggestions([]); sendMessage(s); }}
                      className="text-[11px] px-3 py-2 rounded-xl font-medium transition-all active:scale-95 hover:shadow-sm"
                      style={{ background: 'white', color: '#475569', border: '1px solid #e2e8f0' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input — banking-app elevated bar */}
      <div className="no-print input-elevated px-4 pt-2.5 pb-2 input-safe" style={{ borderTop: '1px solid rgba(226,232,240,0.6)' }}>
        <div className="input-area flex items-end gap-1 rounded-2xl px-3.5 pr-1.5 py-1 bg-white transition"
          style={{ border: '1.5px solid #e2e8f0' }}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={listening ? t.placeholderListening : (has ? t.placeholderActive : t.placeholder)}
            rows={1} className="flex-1 resize-none bg-transparent text-[14px] focus:outline-none py-2.5"
            style={{ color: '#1e293b', maxHeight: '100px', lineHeight: '1.5' }}
            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }}
          />
          {/* Company check shortcuts — visible when chatting */}
          {has && (
            <div className="flex gap-0.5">
              <button onClick={() => setShowMY(true)} className="touch-target rounded-lg flex items-center justify-center transition active:scale-90" title={tl.myCardTitle}>
                <span className="text-[14px]">🇲🇾</span>
              </button>
              <button onClick={() => setShowCN(true)} className="touch-target rounded-lg flex items-center justify-center transition active:scale-90" title={tl.cnCardTitle}>
                <span className="text-[14px]">🇨🇳</span>
              </button>
            </div>
          )}
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
            style={{ background: input.trim() ? '#0f172a' : '#e2e8f0' }}>
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

      {/* Copy toast */}
      {copied && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 fade-in">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white shadow-lg"
            style={{ background: '#0f172a' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            {t.copied}
          </div>
        </div>
      )}

      {showMY && <ErrorBoundary fallbackMessage="Tool crashed. Tap Try Again."><MYCompanyCheck lang={lang} onClose={() => setShowMY(false)} /></ErrorBoundary>}
      {showCN && <ErrorBoundary fallbackMessage="Tool crashed. Tap Try Again."><CNMYTrustLink lang={lang} onClose={() => setShowCN(false)} /></ErrorBoundary>}
    </div>
  );
}
