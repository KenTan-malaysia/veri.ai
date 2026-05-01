'use client';

// v3.7.14 — /inbox — pending consent requests for the signed-in tenant.
// v3.7.15 — Two tabs (Inbox / Sent) so landlords can also track outbound
// requests + cancel pending ones. Lang toggle EN/BM/中文 throughout.
//
// UOB-pattern parallel:
//   Inbox tab  = "your bank app showing pending transactions to confirm"
//   Sent tab   = "transactions you initiated, waiting on the other party"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import PinPad from '../../../components/PinPad';
import { useAuth } from '../../../lib/useAuth';
import { useLang } from '../../../lib/useLang';
import { getBrowserClient, isSupabaseConfigured } from '../../../lib/supabase';
import {
  localInbox, localSent, localRespond, localCancel, computeApprovalHash,
} from '../../../lib/consentStore';
import {
  localPendingForLandlord, localRespondClaim, computeClaimApprovalHash,
  buildAgentToTenantWhatsApp, buildAgentForwardUrl,
} from '../../../lib/agentClaimStore';
import { clientVerifyPin, clientPinStatus } from '../../../lib/pin';
import { getAccessToken as getAnonAccessToken, clientAnonVerifyPin } from '../../../lib/anonPin';

const STR = {
  en: {
    eyebrow: 'Consent · PIN-confirm before we share',
    title: 'Your inbox',
    intro: 'Pending requests to reveal more of your identity to a landlord. You decide each one with your Veri PIN — like confirming a transaction in your bank app.',
    introSent: 'Requests you sent to tenants. Pending ones you can cancel.',
    tabInbox: 'Inbox',
    tabSent: 'Sent',
    demoBanner: '<strong>Demo mode.</strong> Reading from local browser storage. Cross-device sync activates when Supabase is fully connected. To test the full UOB-style flow today, open two tabs — one as landlord (creates request from /trust/[id]), one as tenant (this inbox).',
    loading: 'Loading requests…',
    emptyInbox: 'No pending requests',
    emptyInboxBody: 'When a landlord asks to see more of your identity, the request will appear here for you to PIN-approve.',
    emptySent: 'No requests sent yet',
    emptySentBody: 'When you click "Request more info" on a Trust Card, the request appears here so you can track its status.',
    pending: 'Pending',
    approved: 'Approved',
    declined: 'Declined',
    expired: 'Expired',
    cancelled: 'Cancelled',
    review: 'Review',
    cancel: 'Cancel',
    reviewSubtitle: 'Identity-reveal request',
    requesterFmt: '{name} wants {what}',
    propertyLabel: 'Property',
    reasonLabel: 'Reason',
    expiresLabel: 'Expires',
    tierChangeLabel: 'Tier change',
    cardLabel: 'Trust Card',
    sentToLabel: 'Sent to',
    requestedLabel: 'Requested',
    approvalHashLabel: 'Approval hash',
    approveBtn: 'Approve with PIN',
    declineBtn: 'Decline',
    closeBtn: 'Close',
    backBtn: 'Back',
    cancelBtn: 'Cancel request',
    confirmCancel: 'Cancel this request? The tenant won\'t see it anymore.',
    pinPadLabel: 'ENTER YOUR VERI PIN',
    pinExplain: "You'll enter your 6-digit Veri PIN to approve. This proves it was you, and the approval is logged with a Section 90A hash.",
    declineExplain: 'Optionally, share why. The landlord sees this — it can save back-and-forth.',
    declinePh: 'e.g. Not comfortable revealing yet — happy to discuss in person first',
    submitting: 'Submitting…',
    noPinBannerTitle: 'Set a PIN to approve',
    noPinBannerBody: 'You have pending requests but no PIN yet. Set a 6-digit PIN to approve identity reveals — like confirming a transaction in your bank app.',
    noPinBannerCta: 'Set up PIN',
    tabAgents: 'Agent claims',
    agentClaimsIntro: 'Property agents who want to represent your screening links. Approve with your PIN to give them a forward link they can send to tenants.',
    emptyAgents: 'No pending agent claims',
    emptyAgentsBody: 'When an agent opens one of your screening links and claims it, the request appears here for you to PIN-approve.',
    agentReject: 'Reject',
    agentApprove: 'Approve with PIN',
    agentRejectConfirm: 'Reject this agent claim?',
    agentToastApproved: 'Approved · {agent} can now forward the link · audit-logged',
    agentToastApprovedLocal: 'Approved · {agent} can now forward the link · stored locally',
    agentToastRejected: 'Rejected · agent notified',
    agentToastRejectedLocal: 'Rejected · stored locally',
    agentVerifiedBadge: 'BOVAEP-VERIFIED',
    agentUnverifiedBadge: 'UNVERIFIED FORWARDER',
    agentForwardLinkLabel: 'Forward link · share with tenant',
    agentForwardOpenWA: 'Open WhatsApp',
    agentForwardCopyLink: 'Copy link',
    agentForwardClose: 'Done',
    toastApproved: 'Approved · {tier} unlocked · audit-logged',
    toastApprovedLocal: 'Approved · {tier} unlocked · stored locally (demo mode)',
    toastDeclined: 'Declined · landlord notified · no identity revealed',
    toastDeclinedLocal: 'Declined · stored locally (demo mode)',
    toastCancelled: 'Request cancelled',
    errorWrongPin: 'Wrong PIN. {n} attempt(s) left.',
    errorLocked: 'Too many wrong attempts. Locked until {t}.',
    errorPinNotSet: "You haven't set a PIN yet. Set one at /settings/security first.",
    errorExpired: 'Could not approve — request may have expired. Reload the inbox.',
    errorGeneric: 'Could not approve. Try again.',
  },
  bm: {
    eyebrow: 'Persetujuan · Sahkan dengan PIN sebelum kami berkongsi',
    title: 'Peti masuk anda',
    intro: 'Permintaan menunggu untuk mendedahkan lebih banyak identiti anda kepada tuan tanah. Anda putuskan setiap satu dengan PIN Veri anda — seperti mengesahkan transaksi dalam aplikasi bank anda.',
    introSent: 'Permintaan yang anda hantar kepada penyewa. Yang menunggu boleh anda batalkan.',
    tabInbox: 'Peti Masuk',
    tabSent: 'Dihantar',
    demoBanner: '<strong>Mod demo.</strong> Membaca dari simpanan tempatan pelayar. Penyegerakan merentasi peranti aktif apabila Supabase disambung sepenuhnya. Untuk uji aliran UOB-style hari ini, buka dua tab — satu sebagai tuan tanah (cipta permintaan dari /trust/[id]), satu sebagai penyewa (peti masuk ini).',
    loading: 'Memuatkan permintaan…',
    emptyInbox: 'Tiada permintaan menunggu',
    emptyInboxBody: 'Apabila tuan tanah meminta untuk melihat lebih banyak identiti anda, permintaan itu akan muncul di sini untuk anda lulus dengan PIN.',
    emptySent: 'Belum ada permintaan dihantar',
    emptySentBody: 'Apabila anda klik "Minta maklumat lanjut" pada Trust Card, permintaan akan muncul di sini untuk anda jejaki statusnya.',
    pending: 'Menunggu',
    approved: 'Diluluskan',
    declined: 'Ditolak',
    expired: 'Tamat tempoh',
    cancelled: 'Dibatalkan',
    review: 'Semak',
    cancel: 'Batal',
    reviewSubtitle: 'Permintaan dedahan identiti',
    requesterFmt: '{name} mahukan {what}',
    propertyLabel: 'Hartanah',
    reasonLabel: 'Sebab',
    expiresLabel: 'Tamat tempoh',
    tierChangeLabel: 'Perubahan tier',
    cardLabel: 'Trust Card',
    sentToLabel: 'Dihantar kepada',
    requestedLabel: 'Diminta',
    approvalHashLabel: 'Cap pengesahan',
    approveBtn: 'Lulus dengan PIN',
    declineBtn: 'Tolak',
    closeBtn: 'Tutup',
    backBtn: 'Kembali',
    cancelBtn: 'Batalkan permintaan',
    confirmCancel: 'Batalkan permintaan ini? Penyewa tidak akan nampak lagi.',
    pinPadLabel: 'MASUKKAN PIN VERI ANDA',
    pinExplain: 'Anda akan masukkan PIN Veri 6-digit untuk meluluskan. Ini membuktikan ia adalah anda, dan kelulusan itu dilog dengan cap Seksyen 90A.',
    declineExplain: 'Pilihan, kongsi sebab. Tuan tanah akan nampak — ini boleh elakkan komunikasi berulang.',
    declinePh: 'cth. Belum selesa mendedahkan — boleh bincang secara peribadi dulu',
    submitting: 'Menghantar…',
    noPinBannerTitle: 'Tetapkan PIN untuk meluluskan',
    noPinBannerBody: 'Anda ada permintaan menunggu tetapi belum ada PIN. Tetapkan PIN 6-digit untuk meluluskan dedahan identiti — seperti mengesahkan transaksi dalam aplikasi bank anda.',
    noPinBannerCta: 'Tetapkan PIN',
    tabAgents: 'Tuntutan ejen',
    agentClaimsIntro: 'Ejen hartanah yang mahu mewakili pautan saringan anda. Luluskan dengan PIN anda untuk berikan mereka pautan ke hadapan untuk dihantar kepada penyewa.',
    emptyAgents: 'Tiada tuntutan ejen menunggu',
    emptyAgentsBody: 'Apabila ejen buka pautan saringan anda dan tuntut, permintaan akan muncul di sini untuk anda lulus dengan PIN.',
    agentReject: 'Tolak',
    agentApprove: 'Lulus dengan PIN',
    agentRejectConfirm: 'Tolak tuntutan ejen ini?',
    agentToastApproved: 'Diluluskan · {agent} kini boleh hantar pautan · log audit',
    agentToastApprovedLocal: 'Diluluskan · {agent} kini boleh hantar pautan · disimpan tempatan',
    agentToastRejected: 'Ditolak · ejen dimaklumkan',
    agentToastRejectedLocal: 'Ditolak · disimpan tempatan',
    agentVerifiedBadge: 'BOVAEP-DISAHKAN',
    agentUnverifiedBadge: 'PENGEDAR TIDAK DISAHKAN',
    agentForwardLinkLabel: 'Pautan ke hadapan · kongsi dengan penyewa',
    agentForwardOpenWA: 'Buka WhatsApp',
    agentForwardCopyLink: 'Salin pautan',
    agentForwardClose: 'Selesai',
    toastApproved: 'Diluluskan · {tier} dibuka · log audit',
    toastApprovedLocal: 'Diluluskan · {tier} dibuka · disimpan tempatan (mod demo)',
    toastDeclined: 'Ditolak · tuan tanah dimaklumkan · tiada identiti didedahkan',
    toastDeclinedLocal: 'Ditolak · disimpan tempatan (mod demo)',
    toastCancelled: 'Permintaan dibatalkan',
    errorWrongPin: 'PIN salah. Tinggal {n} cubaan.',
    errorLocked: 'Terlalu banyak cubaan salah. Disekat sehingga {t}.',
    errorPinNotSet: 'Anda belum tetapkan PIN. Tetapkan di /settings/security dahulu.',
    errorExpired: 'Tidak dapat luluskan — permintaan mungkin tamat tempoh. Muat semula peti masuk.',
    errorGeneric: 'Tidak dapat luluskan. Cuba lagi.',
  },
  zh: {
    eyebrow: '同意 · 共享前请用 PIN 确认',
    title: '您的收件箱',
    intro: '等待您批准向房东透露更多身份信息的请求。您用 Veri PIN 决定每一个——就像在银行应用中确认交易一样。',
    introSent: '您发送给租客的请求。等待中的可以取消。',
    tabInbox: '收件箱',
    tabSent: '已发送',
    demoBanner: '<strong>演示模式。</strong>从本地浏览器存储读取。Supabase 完全连接后跨设备同步即可启用。要立即测试完整的 UOB 风格流程，请打开两个标签页——一个作为房东（在 /trust/[id] 创建请求），一个作为租客（此收件箱）。',
    loading: '加载请求中……',
    emptyInbox: '暂无等待中的请求',
    emptyInboxBody: '当房东请求查看您更多身份信息时，请求会出现在此供您 PIN 批准。',
    emptySent: '尚未发送任何请求',
    emptySentBody: '当您在 Trust Card 上点击"请求更多信息"时，请求会显示在此供您追踪状态。',
    pending: '等待中',
    approved: '已批准',
    declined: '已拒绝',
    expired: '已过期',
    cancelled: '已取消',
    review: '审核',
    cancel: '取消',
    reviewSubtitle: '身份披露请求',
    requesterFmt: '{name} 想要您的{what}',
    propertyLabel: '房产',
    reasonLabel: '原因',
    expiresLabel: '到期',
    tierChangeLabel: '级别变化',
    cardLabel: 'Trust Card',
    sentToLabel: '发送至',
    requestedLabel: '请求于',
    approvalHashLabel: '批准哈希',
    approveBtn: '用 PIN 批准',
    declineBtn: '拒绝',
    closeBtn: '关闭',
    backBtn: '返回',
    cancelBtn: '取消请求',
    confirmCancel: '取消此请求？租客将不再看到。',
    pinPadLabel: '输入您的 VERI PIN',
    pinExplain: '您需要输入 6 位 Veri PIN 来批准。这证明是您本人操作，批准会以《1950 年证据法》第 90A 条哈希记录。',
    declineExplain: '可以选择说明原因。房东会看到——可以避免来回沟通。',
    declinePh: '例如：暂时不便透露 — 愿意当面先聊',
    submitting: '提交中……',
    noPinBannerTitle: '设置 PIN 以批准',
    noPinBannerBody: '您有等待中的请求，但尚未设置 PIN。设置 6 位 PIN 来批准身份披露——就像在银行应用中确认交易一样。',
    noPinBannerCta: '设置 PIN',
    tabAgents: '代理认领',
    agentClaimsIntro: '想要代表您筛查链接的房产代理。用您的 PIN 批准后，他们将获得可发送给租客的转发链接。',
    emptyAgents: '暂无等待中的代理认领',
    emptyAgentsBody: '当代理打开您的筛查链接并认领时，请求会显示在此供您 PIN 批准。',
    agentReject: '拒绝',
    agentApprove: '用 PIN 批准',
    agentRejectConfirm: '拒绝此代理认领？',
    agentToastApproved: '已批准 · {agent} 现在可以转发链接 · 已审计记录',
    agentToastApprovedLocal: '已批准 · {agent} 现在可以转发链接 · 本地存储',
    agentToastRejected: '已拒绝 · 已通知代理',
    agentToastRejectedLocal: '已拒绝 · 本地存储',
    agentVerifiedBadge: 'BOVAEP 已验证',
    agentUnverifiedBadge: '未验证转发者',
    agentForwardLinkLabel: '转发链接 · 与租客分享',
    agentForwardOpenWA: '打开 WhatsApp',
    agentForwardCopyLink: '复制链接',
    agentForwardClose: '完成',
    toastApproved: '已批准 · {tier} 已解锁 · 已审计记录',
    toastApprovedLocal: '已批准 · {tier} 已解锁 · 本地存储（演示模式）',
    toastDeclined: '已拒绝 · 已通知房东 · 未披露任何身份',
    toastDeclinedLocal: '已拒绝 · 本地存储（演示模式）',
    toastCancelled: '请求已取消',
    errorWrongPin: 'PIN 错误。还剩 {n} 次尝试。',
    errorLocked: '错误尝试次数过多。锁定至 {t}。',
    errorPinNotSet: '您还未设置 PIN。请先到 /settings/security 设置。',
    errorExpired: '无法批准——请求可能已过期。请刷新收件箱。',
    errorGeneric: '无法批准。请重试。',
  },
};

const TIER_LABELS = {
  en: {
    T1: 'Categorical info (age range, citizenship, occupation)',
    T2: 'First name',
    T3: 'Last name',
    T4: 'Phone, email, employer',
    T5: 'IC (signing-time only)',
  },
  bm: {
    T1: 'Maklumat kategori (julat umur, kewarganegaraan, pekerjaan)',
    T2: 'Nama pertama',
    T3: 'Nama keluarga',
    T4: 'Telefon, emel, majikan',
    T5: 'IC (hanya semasa menandatangani)',
  },
  zh: {
    T1: '类别信息（年龄段、国籍、职业）',
    T2: '名字',
    T3: '姓氏',
    T4: '电话、邮箱、雇主',
    T5: '身份证（仅签约时）',
  },
};

const TIER_SHORT = { T0: 'T0', T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T4', T5: 'T5' };

export default function InboxPage() {
  const { show } = useToast();
  const { user, configured, loading: authLoading } = useAuth();
  const { lang, cycle } = useLang();
  const t = STR[lang] || STR.en;

  const [tab, setTab] = useState('inbox');                  // 'inbox' | 'sent' | 'agents'
  const [inboxRequests, setInboxRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [agentClaims, setAgentClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [degraded, setDegraded] = useState(false);
  const [activeReq, setActiveReq] = useState(null);
  const [activeAgentClaim, setActiveAgentClaim] = useState(null);
  const [hasPin, setHasPin] = useState(true); // assume yes until checked

  useEffect(() => {
    setHasPin(clientPinStatus().hasPin);
  }, []);

  const reload = async () => {
    setLoading(true);
    let usedServer = false;

    if (configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const [inboxRes, sentRes] = await Promise.all([
            fetch('/api/consent/inbox', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('/api/consent/sent', { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          const inboxData = await inboxRes.json();
          const sentData = await sentRes.json();
          if (inboxData.ok || sentData.ok) {
            setInboxRequests(inboxData.ok ? (inboxData.requests || []) : []);
            setSentRequests(sentData.ok ? (sentData.requests || []) : []);
            setDegraded(!(inboxData.ok && sentData.ok));
            usedServer = inboxData.ok && sentData.ok;
          }
        }
      } catch (e) { /* fall through */ }
    }

    if (!usedServer) {
      setInboxRequests(localInbox());
      setSentRequests(localSent());
      setDegraded(true);
    }

    // v3.7.17 — agent_claims (landlord-side) — fetch in parallel paths
    let agentLoaded = false;
    if (configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/agent/claim/pending', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.ok) {
            setAgentClaims(data.claims || []);
            agentLoaded = true;
          }
        }
      } catch (e) { /* fall through */ }
    }
    if (!agentLoaded) {
      setAgentClaims(localPendingForLandlord());
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, configured, user]);

  const handleCancel = async (id) => {
    if (!window.confirm(t.confirmCancel)) return;
    let ok = false;
    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ requestId: id }),
          });
          const data = await res.json();
          if (data.ok) ok = true;
        }
      } catch (e) { /* fall through */ }
    }
    if (!ok) {
      const local = localCancel(id);
      ok = local.ok;
    }
    if (ok) {
      show.info(t.toastCancelled);
      reload();
    }
  };

  const showList =
    tab === 'inbox'  ? inboxRequests :
    tab === 'sent'   ? sentRequests  :
    /* agents */       agentClaims;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header + lang toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
            {t.eyebrow}
          </div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
              fontSize: 36,
              fontWeight: 400,
              color: 'var(--color-navy)',
              letterSpacing: '-0.015em',
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 6,
            }}
          >
            {t.title}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0, lineHeight: 1.55, maxWidth: 620 }}>
            {tab === 'inbox' ? t.intro : tab === 'sent' ? t.introSent : t.agentClaimsIntro}
          </p>
        </div>
        <button
          type="button"
          onClick={cycle}
          aria-label="Change language"
          style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
            background: 'var(--color-tea, #F3EFE4)', border: '1px solid var(--color-hairline)',
            color: 'var(--color-navy)', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {lang === 'en' ? 'BM' : lang === 'bm' ? '中文' : 'EN'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-hairline)', gap: 4, flexWrap: 'wrap' }}>
        <Tab active={tab === 'inbox'} onClick={() => setTab('inbox')}>
          {t.tabInbox} {inboxRequests.length > 0 && <span style={{ marginLeft: 6, padding: '1px 7px', borderRadius: 999, background: 'var(--color-warning-bg, #FEF3C7)', color: 'var(--color-warning-fg, #92400E)', fontSize: 10, fontWeight: 700 }}>{inboxRequests.length}</span>}
        </Tab>
        <Tab active={tab === 'sent'} onClick={() => setTab('sent')}>
          {t.tabSent} {sentRequests.filter((r) => r.status === 'pending').length > 0 && <span style={{ marginLeft: 6, padding: '1px 7px', borderRadius: 999, background: 'var(--color-tea, #F3EFE4)', color: 'var(--color-stone)', fontSize: 10, fontWeight: 700 }}>{sentRequests.filter((r) => r.status === 'pending').length}</span>}
        </Tab>
        <Tab active={tab === 'agents'} onClick={() => setTab('agents')}>
          {t.tabAgents} {agentClaims.length > 0 && <span style={{ marginLeft: 6, padding: '1px 7px', borderRadius: 999, background: 'var(--color-warning-bg, #FEF3C7)', color: 'var(--color-warning-fg, #92400E)', fontSize: 10, fontWeight: 700 }}>{agentClaims.length}</span>}
        </Tab>
      </div>

      {degraded && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--color-warning-bg, #FEF3C7)',
            border: '1px solid var(--color-warning-border, #F1D894)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12.5,
            color: 'var(--color-warning-fg, #92400E)',
            lineHeight: 1.55,
          }}
          dangerouslySetInnerHTML={{ __html: t.demoBanner }}
        />
      )}

      {!hasPin && tab === 'inbox' && inboxRequests.length > 0 && (
        <div
          style={{
            padding: '14px 16px',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>
              {t.noPinBannerTitle}
            </div>
            <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
              {t.noPinBannerBody}
            </div>
          </div>
          <Link
            href="/settings/security"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 999,
              background: '#92400E', color: '#fff', textDecoration: 'none',
              fontSize: 12.5, fontWeight: 600, flexShrink: 0,
            }}
          >
            {t.noPinBannerCta} →
          </Link>
        </div>
      )}

      {loading ? (
        <Card variant="surface" size="md" radius="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Spinner /> <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>{t.loading}</span>
          </div>
        </Card>
      ) : showList.length === 0 ? (
        <EmptyState t={t} tab={tab} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {showList.map((r) => (
            tab === 'inbox' ? (
              <InboxRow key={r.id} req={r} t={t} lang={lang} onOpen={() => setActiveReq(r)} />
            ) : tab === 'sent' ? (
              <SentRow key={r.id} req={r} t={t} lang={lang} onCancel={() => handleCancel(r.id)} />
            ) : (
              <AgentClaimRow key={r.id} claim={r} t={t} lang={lang} onOpen={() => setActiveAgentClaim(r)} />
            )
          ))}
        </div>
      )}

      {activeReq && (
        <ConsentDialog
          req={activeReq}
          onClose={() => setActiveReq(null)}
          onResponded={() => { setActiveReq(null); reload(); }}
          degraded={degraded}
          configured={configured}
          user={user}
          show={show}
          t={t}
          lang={lang}
        />
      )}

      {activeAgentClaim && (
        <AgentApproveDialog
          claim={activeAgentClaim}
          onClose={() => setActiveAgentClaim(null)}
          onResponded={() => { setActiveAgentClaim(null); reload(); }}
          degraded={degraded}
          configured={configured}
          user={user}
          show={show}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 18px',
        background: 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid var(--color-navy)' : '2px solid transparent',
        marginBottom: -1,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--color-navy)' : 'var(--color-slate)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {children}
    </button>
  );
}

function EmptyState({ t, tab }) {
  const icon = tab === 'inbox' ? '📭' : tab === 'sent' ? '📤' : '🤝';
  const title = tab === 'inbox' ? t.emptyInbox : tab === 'sent' ? t.emptySent : t.emptyAgents;
  const body  = tab === 'inbox' ? t.emptyInboxBody : tab === 'sent' ? t.emptySentBody : t.emptyAgentsBody;
  return (
    <Card variant="surface" size="lg" radius="lg">
      <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--color-slate)' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }} aria-hidden="true">{icon}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
          {title}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-slate)', margin: '0 auto', maxWidth: 360, lineHeight: 1.5 }}>
          {body}
        </p>
      </div>
    </Card>
  );
}

// ─── Agent claim row ──────────────────────────────────────────────────────
function AgentClaimRow({ claim, t, lang, onOpen }) {
  const created = claim.created_at ? new Date(claim.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
  const verified = !!claim.is_verified_agent;
  return (
    <Card variant="surface" size="md" radius="lg">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Badge tone="warning" size="sm" uppercase>{t.pending}</Badge>
            {verified ? (
              <span style={{
                padding: '2px 8px', fontSize: 9.5, fontWeight: 700,
                background: '#0F1E3F', color: '#fff', borderRadius: 999, letterSpacing: '0.08em',
              }}>{t.agentVerifiedBadge}</span>
            ) : (
              <span style={{
                padding: '2px 8px', fontSize: 9.5, fontWeight: 600,
                background: '#F3EFE4', color: '#5A6780', borderRadius: 999, letterSpacing: '0.08em',
                border: '1px solid #E7E1D2',
              }}>{t.agentUnverifiedBadge}</span>
            )}
            <span style={{ fontSize: 11, color: 'var(--color-stone)', fontFamily: 'var(--font-mono, monospace)' }}>
              {claim.report_id}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
            {claim.agent_name}
            {claim.agent_agency && <span style={{ color: 'var(--color-slate)', fontWeight: 400 }}> · {claim.agent_agency}</span>}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 2 }}>
            {claim.agent_email}
            {claim.agent_phone && <> · {claim.agent_phone}</>}
          </div>
          {claim.agent_bovaep && (
            <div style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 2, fontFamily: 'var(--font-mono, monospace)' }}>
              BOVAEP: {claim.agent_bovaep}
            </div>
          )}
          {claim.property_address && (
            <div style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 2 }}>
              {claim.property_address}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--color-stone)' }}>
            {t.requestedLabel} {created}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          style={{
            height: 38, padding: '0 16px', borderRadius: 999,
            background: 'var(--color-navy)', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {t.review}
        </button>
      </div>
    </Card>
  );
}

// ─── Agent approve dialog ─────────────────────────────────────────────────
function AgentApproveDialog({ claim, onClose, onResponded, degraded, configured, user, show, t, lang }) {
  const [stage, setStage] = useState('review');  // review | enterPin | rejecting | submitting | done
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [doneResult, setDoneResult] = useState(null); // { forwardToken, forwardUrl, whatsappUrl }

  const submitApprove = async (enteredPin) => {
    setStage('submitting');
    setError(null);

    let serverResult = null;

    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/agent/claim/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ claimId: claim.id, action: 'approve', pin: enteredPin }),
          });
          const data = await res.json();
          if (data.ok) {
            serverResult = { forwardToken: data.forwardToken };
          } else if (data.reason === 'wrong_pin') {
            setError(t.errorWrongPin.replace('{n}', data.attemptsLeft));
            setPin(''); setStage('enterPin'); return;
          } else if (data.reason === 'locked') {
            setError(t.errorLocked.replace('{t}', new Date(data.lockUntil).toLocaleTimeString()));
            setStage('review'); return;
          } else if (data.reason === 'pin_not_set') {
            setError(t.errorPinNotSet); setStage('review'); return;
          } else if (!data.degradedMode) {
            setError(data.message || t.errorGeneric); setStage('review'); return;
          }
        }
      } catch (e) { /* fall through */ }
    }

    if (!serverResult) {
      // Local fallback: verify PIN, generate hash, mark approved + write token
      try {
        const verify = await clientVerifyPin(enteredPin);
        if (!verify.ok) {
          if (verify.reason === 'locked') {
            setError(t.errorLocked.replace('{t}', new Date(verify.lockUntil).toLocaleTimeString()));
            setStage('review'); return;
          }
          if (verify.reason === 'notSet') {
            setError(t.errorPinNotSet); setStage('review'); return;
          }
          setError(t.errorWrongPin.replace('{n}', verify.attemptsLeft ?? '?'));
          setPin(''); setStage('enterPin'); return;
        }
        const approvalHash = await computeClaimApprovalHash(claim);
        const result = localRespondClaim(claim.id, { action: 'approve', approvalHash });
        if (!result.ok) { setError(t.errorGeneric); setStage('review'); return; }
        serverResult = { forwardToken: result.claim.forward_token };
      } catch (e) {
        console.error('local agent approve failed:', e);
        setError(t.errorGeneric); setStage('review'); return;
      }
    }

    const forwardUrl = buildAgentForwardUrl({ reportId: claim.report_id, forwardToken: serverResult.forwardToken });
    const whatsappUrl = buildAgentToTenantWhatsApp({
      reportId: claim.report_id,
      forwardToken: serverResult.forwardToken,
      propertyAddress: claim.property_address || '',
      tenantPhone: '',
      lang,
    });

    setDoneResult({ forwardToken: serverResult.forwardToken, forwardUrl, whatsappUrl });
    setStage('done');
    show.success((degraded ? t.agentToastApprovedLocal : t.agentToastApproved).replace('{agent}', claim.agent_name));
  };

  const submitReject = async () => {
    if (!window.confirm(t.agentRejectConfirm)) return;
    setStage('submitting');
    setError(null);

    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/agent/claim/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ claimId: claim.id, action: 'reject', rejectReason: rejectReason || undefined }),
          });
          const data = await res.json();
          if (data.ok) {
            show.info(t.agentToastRejected);
            onResponded();
            return;
          }
          if (!data.degradedMode) {
            setError(data.message || t.errorGeneric); setStage('review'); return;
          }
        }
      } catch (e) { /* fall through */ }
    }

    const result = localRespondClaim(claim.id, { action: 'reject', rejectReason });
    if (!result.ok) { setError(t.errorGeneric); setStage('review'); return; }
    show.info(t.agentToastRejectedLocal);
    onResponded();
  };

  const verified = !!claim.is_verified_agent;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,63,0.45)', zIndex: 50 }} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-approve-title"
        style={{
          position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(94vw, 540px)', maxHeight: '90vh', overflowY: 'auto',
          background: '#fff', borderRadius: 'var(--radius-xl, 18px)',
          boxShadow: '0 20px 60px rgba(15,30,63,0.30)', zIndex: 51,
          padding: '28px 26px 24px',
        }}
      >
        {stage === 'done' && doneResult ? (
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 999, background: '#F1F6EF', border: '1px solid #CFE1C7', fontSize: 11, fontWeight: 700, color: '#2F6B3E', marginBottom: 12 }}>
              ✓ {t.approved}
            </div>
            <h2
              id="agent-approve-title"
              style={{
                fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
                fontSize: 24, fontWeight: 400, color: 'var(--color-navy)',
                letterSpacing: '-0.015em', lineHeight: 1.18, margin: '0 0 14px',
              }}
            >
              {claim.agent_name} {verified && <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', background: '#0F1E3F', color: '#fff', borderRadius: 999, letterSpacing: '0.08em', verticalAlign: 'middle' }}>{t.agentVerifiedBadge}</span>}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-slate)', lineHeight: 1.55, marginTop: 0, marginBottom: 14 }}>
              {t.agentForwardLinkLabel}
            </p>
            <div style={{ background: 'var(--color-cream, #FAF8F3)', borderRadius: 12, padding: '12px 14px', marginBottom: 14, fontSize: 12, fontFamily: 'var(--font-mono, monospace)', color: 'var(--color-navy)', wordBreak: 'break-all' }}>
              {doneResult.forwardUrl}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={doneResult.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  height: 40, padding: '0 16px', borderRadius: 999,
                  background: '#25D366', color: '#fff', textDecoration: 'none',
                  fontSize: 13, fontWeight: 600,
                }}
              >
                📲 {t.agentForwardOpenWA}
              </a>
              <button
                type="button"
                onClick={async () => {
                  try { await navigator.clipboard?.writeText(doneResult.forwardUrl); } catch (e) {}
                }}
                style={ghostBtn}
              >
                {t.agentForwardCopyLink}
              </button>
              <button type="button" onClick={() => onResponded()} style={{ ...ghostBtn, border: 'none' }}>
                {t.agentForwardClose}
              </button>
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--color-stone)', fontStyle: 'italic', lineHeight: 1.5 }}>
              The agent's attribution is now baked into this URL via signed token. Tenant will see "Forwarded by {claim.agent_name}" when they open it.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
              {t.tabAgents}
            </div>
            <h2
              id="agent-approve-title"
              style={{
                fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
                fontSize: 24, fontWeight: 400, color: 'var(--color-navy)',
                letterSpacing: '-0.015em', lineHeight: 1.2, margin: '0 0 14px',
              }}
            >
              {claim.agent_name} wants to represent {claim.report_id}
            </h2>

            <div
              style={{
                background: 'var(--color-cream, #FAF8F3)', border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16,
                fontSize: 12.5, lineHeight: 1.6, color: 'var(--color-slate)',
              }}
            >
              <Row k="Email" v={claim.agent_email} />
              {claim.agent_phone && <Row k="Phone" v={claim.agent_phone} />}
              {claim.agent_agency && <Row k="Agency" v={claim.agent_agency} />}
              {claim.agent_bovaep ? (
                <Row k="BOVAEP" v={claim.agent_bovaep} mono />
              ) : (
                <Row k="BOVAEP" v="— (Unverified Forwarder)" italic />
              )}
              {claim.property_address && <Row k={t.propertyLabel} v={claim.property_address} />}
              <Row k={t.expiresLabel} v={claim.expires_at ? new Date(claim.expires_at).toLocaleString() : '—'} />
            </div>

            {stage === 'review' && (
              <>
                <div style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 16, lineHeight: 1.55 }}>
                  {t.pinExplain}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => { setStage('enterPin'); setError(null); setPin(''); }} style={primaryBtn}>
                    {t.agentApprove}
                  </button>
                  <button type="button" onClick={() => setStage('rejecting')} style={ghostBtn}>
                    {t.agentReject}
                  </button>
                  <button type="button" onClick={onClose} style={{ ...ghostBtn, border: 'none', color: 'var(--color-stone)' }}>
                    {t.closeBtn}
                  </button>
                </div>
                {error && (
                  <div role="alert" style={{ fontSize: 12.5, color: '#C13A3A', marginTop: 12, lineHeight: 1.5 }}>
                    {error}
                  </div>
                )}
              </>
            )}

            {stage === 'enterPin' && (
              <div>
                <PinPad value={pin} onChange={setPin} onComplete={submitApprove} error={error} labelHint={t.pinPadLabel} />
                <div style={{ marginTop: 16 }}>
                  <button type="button" onClick={() => { setStage('review'); setPin(''); setError(null); }} style={ghostBtn}>
                    {t.backBtn}
                  </button>
                </div>
              </div>
            )}

            {stage === 'rejecting' && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-slate)', marginBottom: 10, lineHeight: 1.5 }}>
                  {t.declineExplain}
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder={t.declinePh}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-cream, #FAF8F3)', border: '1px solid var(--color-hairline)',
                    color: 'var(--color-navy)', fontSize: 13, lineHeight: 1.5, fontFamily: 'inherit',
                    outline: 'none', resize: 'vertical', marginBottom: 16,
                  }}
                />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="button" onClick={submitReject} style={{ ...primaryBtn, background: '#C13A3A' }}>
                    {t.agentReject}
                  </button>
                  <button type="button" onClick={() => setStage('review')} style={ghostBtn}>
                    {t.backBtn}
                  </button>
                </div>
              </div>
            )}

            {stage === 'submitting' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0' }}>
                <Spinner /> <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>{t.submitting}</span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ─── Inbox row ────────────────────────────────────────────────────────────
function InboxRow({ req, t, lang, onOpen }) {
  const tierLabel = (TIER_LABELS[lang] || TIER_LABELS.en)[req.requested_tier] || req.requested_tier;
  const created = req.created_at ? new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
  return (
    <Card variant="surface" size="md" radius="lg">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Badge tone="warning" size="sm" uppercase>{t.pending}</Badge>
            <span style={{ fontSize: 11, color: 'var(--color-stone)', fontFamily: 'var(--font-mono, monospace)' }}>
              {req.report_id} · {TIER_SHORT[req.current_tier]} → {TIER_SHORT[req.requested_tier]}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
            {t.requesterFmt
              .replace('{name}', req.requester_display || (lang === 'bm' ? 'Seorang tuan tanah' : lang === 'zh' ? '一位房东' : 'A landlord'))
              .replace('{what}', tierLabel.toLowerCase())}
          </div>
          {req.property_address && (
            <div style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 4 }}>
              {t.propertyLabel}: {req.property_address}
            </div>
          )}
          {req.reason && (
            <div style={{ fontSize: 12, color: 'var(--color-slate)', fontStyle: 'italic', marginBottom: 4 }}>
              "{req.reason}"
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--color-stone)' }}>
            {t.requestedLabel} {created}
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          style={{
            height: 38, padding: '0 16px', borderRadius: 999,
            background: 'var(--color-navy)', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {t.review}
        </button>
      </div>
    </Card>
  );
}

// ─── Sent row ─────────────────────────────────────────────────────────────
function SentRow({ req, t, lang, onCancel }) {
  const tierLabel = (TIER_LABELS[lang] || TIER_LABELS.en)[req.requested_tier] || req.requested_tier;
  const created = req.created_at ? new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
  const statusTone = req.status === 'approved' ? 'success'
    : req.status === 'pending' ? 'warning'
    : req.status === 'cancelled' || req.status === 'expired' ? 'default'
    : 'danger';
  const statusLabel = t[req.status] || req.status;

  return (
    <Card variant="surface" size="md" radius="lg">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Badge tone={statusTone} size="sm" uppercase>{statusLabel}</Badge>
            <span style={{ fontSize: 11, color: 'var(--color-stone)', fontFamily: 'var(--font-mono, monospace)' }}>
              {req.report_id} · {TIER_SHORT[req.current_tier]} → {TIER_SHORT[req.requested_tier]}
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 4 }}>
            {tierLabel}
          </div>
          {req.target_email && (
            <div style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 2 }}>
              {t.sentToLabel}: {req.target_email}
            </div>
          )}
          {req.property_address && (
            <div style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 2 }}>
              {t.propertyLabel}: {req.property_address}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--color-stone)' }}>
            {t.requestedLabel} {created}
            {req.approval_hash && (
              <> · <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>{t.approvalHashLabel}: {req.approval_hash.slice(0, 12)}…</span></>
            )}
          </div>
        </div>
        {req.status === 'pending' && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 36, padding: '0 14px', borderRadius: 999,
              background: 'transparent', color: 'var(--color-slate)',
              border: '1px solid var(--color-hairline)',
              fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {t.cancelBtn}
          </button>
        )}
      </div>
    </Card>
  );
}

// ─── Consent review dialog (inbox-side, tenant approves) ──────────────────
function ConsentDialog({ req, onClose, onResponded, degraded, configured, user, show, t, lang }) {
  const [stage, setStage] = useState('review');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  // v3.7.18 — anon-target detection + access token hydration
  const isAnonTarget = !req.target_user_id && !!req.target_anon_id;
  const anonAccessToken = isAnonTarget ? getAnonAccessToken(req.target_anon_id) : '';

  const tierLabel = (TIER_LABELS[lang] || TIER_LABELS.en)[req.requested_tier] || req.requested_tier;

  const submitApprove = async (enteredPin) => {
    setStage('submitting');
    setError(null);

    // v3.7.18 — anon path: server with accessToken (no Bearer), local fallback via clientAnonVerifyPin
    if (isAnonTarget) {
      if (!anonAccessToken) {
        setError('Open this request via the access link in your /my-card email — we need your token to verify.');
        setStage('review'); return;
      }
      if (!degraded) {
        try {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: req.id, action: 'approve', pin: enteredPin, accessToken: anonAccessToken }),
          });
          const data = await res.json();
          if (data.ok) { show.success(t.toastApproved.replace('{tier}', req.requested_tier)); onResponded(); return; }
          if (data.reason === 'wrong_pin') { setError(t.errorWrongPin.replace('{n}', data.attemptsLeft)); setPin(''); setStage('enterPin'); return; }
          if (data.reason === 'locked') { setError(t.errorLocked.replace('{t}', new Date(data.lockUntil).toLocaleTimeString())); setStage('review'); return; }
          if (data.reason === 'pin_not_set') { setError(t.errorPinNotSet); setStage('review'); return; }
          if (data.error === 'invalid_token') { setError('Access token invalid — open the link from your email.'); setStage('review'); return; }
          if (!data.degradedMode) { setError(data.message || t.errorGeneric); setStage('review'); return; }
        } catch (e) { /* fall through to local */ }
      }
      // Local fallback
      try {
        const verify = await clientAnonVerifyPin(req.target_anon_id, enteredPin);
        if (!verify.ok) {
          if (verify.reason === 'locked') { setError(t.errorLocked.replace('{t}', new Date(verify.lockUntil).toLocaleTimeString())); setStage('review'); return; }
          if (verify.reason === 'notSet') { setError(t.errorPinNotSet); setStage('review'); return; }
          setError(t.errorWrongPin.replace('{n}', verify.attemptsLeft ?? '?')); setPin(''); setStage('enterPin'); return;
        }
        const approvalHash = await computeApprovalHash(req);
        const result = localRespond(req.id, { action: 'approve', approvalHash });
        if (!result.ok) { setError(t.errorExpired); setStage('review'); return; }
        show.success(t.toastApprovedLocal.replace('{tier}', req.requested_tier));
        onResponded();
      } catch (e) { console.error('local anon approve failed:', e); setError(t.errorGeneric); setStage('review'); }
      return;
    }

    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ requestId: req.id, action: 'approve', pin: enteredPin }),
          });
          const data = await res.json();
          if (data.ok) {
            show.success(t.toastApproved.replace('{tier}', req.requested_tier));
            onResponded();
            return;
          }
          if (data.reason === 'wrong_pin') {
            setError(t.errorWrongPin.replace('{n}', data.attemptsLeft));
            setPin(''); setStage('enterPin'); return;
          }
          if (data.reason === 'locked') {
            setError(t.errorLocked.replace('{t}', new Date(data.lockUntil).toLocaleTimeString()));
            setStage('review'); return;
          }
          if (data.reason === 'pin_not_set') {
            setError(t.errorPinNotSet); setStage('review'); return;
          }
          if (!data.degradedMode) { setError(data.message || t.errorGeneric); setStage('review'); return; }
        }
      } catch (e) { /* fall through */ }
    }

    try {
      const verify = await clientVerifyPin(enteredPin);
      if (!verify.ok) {
        if (verify.reason === 'locked') {
          setError(t.errorLocked.replace('{t}', new Date(verify.lockUntil).toLocaleTimeString()));
          setStage('review'); return;
        }
        if (verify.reason === 'notSet') { setError(t.errorPinNotSet); setStage('review'); return; }
        setError(t.errorWrongPin.replace('{n}', verify.attemptsLeft ?? '?'));
        setPin(''); setStage('enterPin'); return;
      }
      const approvalHash = await computeApprovalHash(req);
      const result = localRespond(req.id, { action: 'approve', approvalHash });
      if (!result.ok) { setError(t.errorExpired); setStage('review'); return; }
      show.success(t.toastApprovedLocal.replace('{tier}', req.requested_tier));
      onResponded();
    } catch (e) {
      console.error('local approve failed:', e);
      setError(t.errorGeneric); setStage('review');
    }
  };

  const submitDecline = async () => {
    setStage('submitting');
    setError(null);

    if (!degraded && configured && user) {
      try {
        const client = getBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const token = session?.access_token;
        if (token) {
          const res = await fetch('/api/consent/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ requestId: req.id, action: 'decline', declineReason: declineReason || undefined }),
          });
          const data = await res.json();
          if (data.ok) { show.info(t.toastDeclined); onResponded(); return; }
          if (!data.degradedMode) { setError(data.message || t.errorGeneric); setStage('review'); return; }
        }
      } catch (e) { /* fall through */ }
    }

    const result = localRespond(req.id, { action: 'decline', declineReason });
    if (!result.ok) { setError(t.errorGeneric); setStage('review'); return; }
    show.info(t.toastDeclinedLocal);
    onResponded();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,63,0.45)', zIndex: 50 }} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-dialog-title"
        style={{
          position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(94vw, 520px)', maxHeight: '88vh', overflowY: 'auto',
          background: '#fff', borderRadius: 'var(--radius-xl, 18px)',
          boxShadow: '0 20px 60px rgba(15,30,63,0.30)', zIndex: 51,
          padding: '28px 26px 24px',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>
          {t.reviewSubtitle}
        </div>
        <h2
          id="consent-dialog-title"
          style={{
            fontFamily: "'Instrument Serif', 'Iowan Old Style', Baskerville, serif",
            fontSize: 26, fontWeight: 400, color: 'var(--color-navy)',
            letterSpacing: '-0.015em', lineHeight: 1.15, margin: '0 0 14px',
          }}
        >
          {t.requesterFmt
            .replace('{name}', req.requester_display || (lang === 'bm' ? 'Seorang tuan tanah' : lang === 'zh' ? '一位房东' : 'A landlord'))
            .replace('{what}', tierLabel.toLowerCase())}
        </h2>

        <div
          style={{
            background: 'var(--color-cream, #FAF8F3)', border: '1px solid var(--color-hairline)',
            borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16,
            fontSize: 12.5, lineHeight: 1.6, color: 'var(--color-slate)',
          }}
        >
          <Row k={t.cardLabel} v={req.report_id} mono />
          <Row k={t.tierChangeLabel} v={`${TIER_SHORT[req.current_tier]} → ${TIER_SHORT[req.requested_tier]}`} mono />
          {req.property_address && <Row k={t.propertyLabel} v={req.property_address} />}
          {req.reason && <Row k={t.reasonLabel} v={`"${req.reason}"`} italic />}
          <Row k={t.expiresLabel} v={req.expires_at ? new Date(req.expires_at).toLocaleString() : '—'} />
        </div>

        {stage === 'review' && (
          <>
            <div style={{ fontSize: 12.5, color: 'var(--color-slate)', marginBottom: 16, lineHeight: 1.55 }}>
              {t.pinExplain}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => { setStage('enterPin'); setError(null); setPin(''); }} style={primaryBtn}>
                {t.approveBtn}
              </button>
              <button type="button" onClick={() => setStage('declining')} style={ghostBtn}>
                {t.declineBtn}
              </button>
              <button type="button" onClick={onClose} style={{ ...ghostBtn, border: 'none', color: 'var(--color-stone)' }}>
                {t.closeBtn}
              </button>
            </div>
            {error && (
              <div role="alert" style={{ fontSize: 12.5, color: '#C13A3A', marginTop: 12, lineHeight: 1.5 }}>
                {error}
              </div>
            )}
          </>
        )}

        {stage === 'enterPin' && (
          <div>
            <PinPad value={pin} onChange={setPin} onComplete={submitApprove} error={error} labelHint={t.pinPadLabel} />
            <div style={{ marginTop: 16 }}>
              <button type="button" onClick={() => { setStage('review'); setPin(''); setError(null); }} style={ghostBtn}>
                {t.backBtn}
              </button>
            </div>
          </div>
        )}

        {stage === 'declining' && (
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-slate)', marginBottom: 10, lineHeight: 1.5 }}>
              {t.declineExplain}
            </div>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value.slice(0, 500))}
              rows={3}
              placeholder={t.declinePh}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'var(--color-cream, #FAF8F3)', border: '1px solid var(--color-hairline)',
                color: 'var(--color-navy)', fontSize: 13, lineHeight: 1.5, fontFamily: 'inherit',
                outline: 'none', resize: 'vertical', marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" onClick={submitDecline} style={{ ...primaryBtn, background: '#C13A3A' }}>
                {t.cancelBtn}
              </button>
              <button type="button" onClick={() => setStage('review')} style={ghostBtn}>
                {t.backBtn}
              </button>
            </div>
          </div>
        )}

        {stage === 'submitting' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0' }}>
            <Spinner /> <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>{t.submitting}</span>
          </div>
        )}
      </div>
    </>
  );
}

function Row({ k, v, mono = false, italic = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
      <span style={{ fontSize: 10.5, color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.14em', minWidth: 80 }}>
        {k}
      </span>
      <span style={{
        fontSize: 12.5, color: 'var(--color-navy)',
        fontFamily: mono ? 'var(--font-mono, monospace)' : 'inherit',
        fontStyle: italic ? 'italic' : 'normal',
      }}>
        {v}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 18, height: 18, borderRadius: '50%',
        border: '2px solid var(--color-navy, #0F1E3F)', borderTopColor: 'transparent',
        animation: 'fa-inbox-spin 0.7s linear infinite', display: 'inline-block',
      }}
      aria-hidden="true"
    >
      <style jsx>{`@keyframes fa-inbox-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

const primaryBtn = {
  height: 42, padding: '0 18px', borderRadius: 999,
  background: 'var(--color-navy)', color: '#fff', border: 'none',
  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
};
const ghostBtn = {
  height: 38, padding: '0 14px', borderRadius: 999,
  background: 'transparent', color: 'var(--color-slate)',
  border: '1px solid var(--color-hairline)',
  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
};
