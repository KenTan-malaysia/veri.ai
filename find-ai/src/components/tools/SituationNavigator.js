'use client';

import { useState } from 'react';
import { Modal, ToolHeader, ActionBtn, CloseBtn } from './shared';
import { L } from './labels';

const SITUATIONS = {
  en: {
    rentDefault: {
      title: 'Rent Default',
      law: 'Distress Act 1951 + Contracts Act 1950',
      timeline: '2-8 weeks depending on action taken',
      cost: 'RM50-500 (court fees) or RM0 (negotiation)',
      steps: [
        { title: 'Send written reminder (Day 1-7)', action: 'Send WhatsApp/letter to tenant. Keep a record. Polite but firm — "Your rent of RM[X] was due on [date]."', warning: 'Don\'t threaten. Don\'t mention eviction yet.' },
        { title: 'Issue formal demand letter (Day 8-14)', action: 'Send a Letter of Demand (LOD) via registered mail or hand-deliver with witness. State the amount, deadline (14 days), and that legal action will follow.', warning: 'Must be in writing. WhatsApp alone may not be sufficient for court.' },
        { title: 'File at Magistrate Court (Day 15-30)', action: 'If unpaid, file Form 198 at Magistrate Court. Filing fee: ~RM50. You can do this without a lawyer for claims under RM5,000.', warning: 'You must have the signed tenancy agreement and proof of demand letter.' },
        { title: 'Distress application (Alternative)', action: 'Under Distress Act 1951, apply for a distress warrant to seize tenant\'s movable property as security for unpaid rent.', warning: 'This is a legal process — you CANNOT seize property yourself. Only a bailiff can do this.' },
      ],
      document: `LETTER OF DEMAND

Date: [DATE]
To: [TENANT NAME]
Address: [PROPERTY ADDRESS]

RE: DEMAND FOR PAYMENT OF OUTSTANDING RENTAL

Dear Sir/Madam,

I refer to the Tenancy Agreement dated [DATE] for the property at [ADDRESS].

I hereby demand payment of the outstanding rental sum of RM[AMOUNT] being rent due for the month(s) of [MONTHS], within FOURTEEN (14) days from the date of this letter.

TAKE NOTICE that if payment is not received within the stipulated period, I shall proceed to take legal action against you without further notice, and you shall be liable for all costs incurred.

Yours faithfully,
[LANDLORD NAME]
[IC NUMBER]
[CONTACT NUMBER]`,
    },
    deposit: {
      title: 'Deposit Dispute',
      law: 'Contracts Act 1950 + Specific Relief Act 1950',
      timeline: '2-12 weeks',
      cost: 'RM0 (negotiation) to RM2,000 (tribunal/court)',
      steps: [
        { title: 'Document everything (Immediately)', action: 'Take photos/videos of property condition at check-out. Compare with check-in inventory. Use Veri.ai Photo Proof tool to hash and timestamp evidence.', warning: 'Without evidence, it becomes your word against theirs.' },
        { title: 'Request itemized deduction list (Day 1-7)', action: 'Ask landlord/tenant for a written breakdown of all deductions with receipts. Reasonable deductions: actual damage beyond normal wear & tear, unpaid utilities, cleaning if excessively dirty.', warning: 'Landlord CANNOT deduct for normal wear & tear (faded paint, minor scuffs).' },
        { title: 'Send demand letter (Day 8-21)', action: 'If deposit not returned or deductions unfair, send a formal Letter of Demand. State the amount owed and give 14 days to respond.', warning: 'Keep all communication in writing (email/letter). Verbal promises don\'t hold up.' },
        { title: 'File at Tribunal/Court (Day 22+)', action: 'File at Tribunal for Consumer Claims (under RM50,000) or Magistrate Court. Bring: tenancy agreement, check-in/out photos, demand letter, receipts.', warning: 'Tribunal is faster and cheaper than court. You don\'t need a lawyer.' },
      ],
      document: `LETTER OF DEMAND — RETURN OF SECURITY DEPOSIT

Date: [DATE]
To: [LANDLORD/TENANT NAME]
Address: [ADDRESS]

RE: DEMAND FOR RETURN OF SECURITY DEPOSIT

Dear Sir/Madam,

I refer to the Tenancy Agreement dated [DATE] for the property at [ADDRESS], which expired/was terminated on [END DATE].

The security deposit of RM[AMOUNT] was paid at the commencement of the tenancy. The property was returned in good condition, subject to reasonable wear and tear, on [CHECK-OUT DATE].

I hereby demand the full return of the security deposit of RM[AMOUNT] within FOURTEEN (14) days from the date of this letter.

Should payment not be received within the stipulated period, I shall file a claim at the Tribunal for Consumer Claims / Magistrate Court without further notice.

Yours faithfully,
[YOUR NAME]
[IC NUMBER]
[CONTACT NUMBER]`,
    },
    eviction: {
      title: 'Eviction Process',
      law: 'Specific Relief Act 1950 + Distress Act 1951',
      timeline: '1-6 months (legal process)',
      cost: 'RM500-5,000+ (legal fees + court)',
      steps: [
        { title: 'Serve written notice (Month 1)', action: 'Send formal notice to vacate. If lease expired: reasonable notice (typically 1-2 months). If breach: notice period per agreement (usually 14-30 days). Send via registered mail + keep a copy.', warning: 'NEVER change locks, cut utilities, or remove tenant belongings. This is ILLEGAL self-help eviction and you can be sued.' },
        { title: 'File for possession order (Month 2)', action: 'If tenant refuses to leave, file an application for a Possession Order at the High Court under the Specific Relief Act 1950. You will need a lawyer for this.', warning: 'This is NOT a Magistrate Court matter. Eviction orders come from High Court.' },
        { title: 'Court hearing (Month 2-4)', action: 'Attend court hearing. Bring: tenancy agreement, proof of breach/expiry, notice to vacate sent, evidence of non-payment (if applicable).', warning: 'The court may give the tenant time to vacate (usually 14-30 days from order).' },
        { title: 'Writ of Possession (Month 4-6)', action: 'If tenant still refuses to leave after court order, apply for a Writ of Possession. A court bailiff will physically remove the tenant and their belongings.', warning: 'Only the bailiff can remove the tenant. You cannot do this yourself even with a court order.' },
      ],
      document: `NOTICE TO VACATE

Date: [DATE]
To: [TENANT NAME]
Property: [PROPERTY ADDRESS]

RE: NOTICE TO VACATE PREMISES

Dear Sir/Madam,

I refer to the Tenancy Agreement dated [DATE] for the above property.

[CHOOSE ONE:]
☐ The tenancy agreement expired on [DATE] and will not be renewed.
☐ You are in breach of Clause [X] of the Tenancy Agreement, specifically: [DESCRIBE BREACH].

You are hereby given [30] days' notice to vacate the premises by [VACATE DATE].

Please ensure the property is returned in the same condition as at commencement, subject to reasonable wear and tear, and all keys are returned.

Failure to vacate by the above date will result in legal proceedings being commenced against you without further notice.

Yours faithfully,
[LANDLORD NAME]
[IC NUMBER]
[CONTACT NUMBER]`,
    },
  },
  bm: {
    rentDefault: {
      title: 'Sewa Tertunggak',
      law: 'Akta Distres 1951 + Akta Kontrak 1950',
      timeline: '2-8 minggu bergantung tindakan',
      cost: 'RM50-500 (fi mahkamah) atau RM0 (rundingan)',
      steps: [
        { title: 'Hantar peringatan bertulis (Hari 1-7)', action: 'Hantar WhatsApp/surat. Simpan rekod. Sopan tapi tegas.', warning: 'Jangan ugut. Jangan sebut pengusiran lagi.' },
        { title: 'Keluarkan surat tuntutan rasmi (Hari 8-14)', action: 'Hantar Surat Tuntutan melalui pos berdaftar. Nyatakan jumlah, tarikh akhir (14 hari), dan tindakan undang-undang.', warning: 'Mesti bertulis. WhatsApp sahaja mungkin tidak cukup untuk mahkamah.' },
        { title: 'Failkan di Mahkamah Majistret (Hari 15-30)', action: 'Failkan Borang 198. Fi: ~RM50. Boleh tanpa peguam untuk tuntutan bawah RM5,000.', warning: 'Mesti ada perjanjian sewa dan bukti surat tuntutan.' },
        { title: 'Permohonan distres (Alternatif)', action: 'Di bawah Akta Distres 1951, mohon waran distres untuk rampas harta alih penyewa.', warning: 'Hanya bailif boleh buat ini. Anda TIDAK BOLEH rampas sendiri.' },
      ],
      document: `SURAT TUNTUTAN

Tarikh: [TARIKH]
Kepada: [NAMA PENYEWA]
Alamat: [ALAMAT HARTANAH]

PER: TUNTUTAN BAYARAN SEWA TERTUNGGAK

Tuan/Puan,

Saya merujuk kepada Perjanjian Sewa bertarikh [TARIKH] untuk hartanah di [ALAMAT].

Dengan ini saya menuntut bayaran sewa tertunggak sebanyak RM[JUMLAH] untuk bulan [BULAN], dalam tempoh EMPAT BELAS (14) hari dari tarikh surat ini.

AMBIL PERHATIAN bahawa jika bayaran tidak diterima, saya akan mengambil tindakan undang-undang tanpa notis lanjut.

Yang benar,
[NAMA TUAN RUMAH]
[NO IC]
[NO TELEFON]`,
    },
    deposit: {
      title: 'Pertikaian Deposit',
      law: 'Akta Kontrak 1950 + Akta Relief Spesifik 1950',
      timeline: '2-12 minggu',
      cost: 'RM0 (rundingan) hingga RM2,000 (tribunal/mahkamah)',
      steps: [
        { title: 'Dokumentasi (Segera)', action: 'Ambil gambar/video keadaan hartanah. Bandingkan dengan inventori masuk. Guna alat Bukti Foto Veri.ai.', warning: 'Tanpa bukti, jadi cakap lawan cakap.' },
        { title: 'Minta senarai potongan (Hari 1-7)', action: 'Minta senarai bertulis semua potongan dengan resit.', warning: 'Tuan rumah TIDAK BOLEH potong untuk haus & lusuh biasa.' },
        { title: 'Hantar surat tuntutan (Hari 8-21)', action: 'Hantar Surat Tuntutan rasmi. Nyatakan jumlah dan beri 14 hari.', warning: 'Simpan semua komunikasi bertulis.' },
        { title: 'Failkan di Tribunal (Hari 22+)', action: 'Failkan di Tribunal Tuntutan Pengguna (bawah RM50,000). Bawa: perjanjian, gambar, surat tuntutan.', warning: 'Tribunal lebih cepat dan murah. Tidak perlu peguam.' },
      ],
      document: `SURAT TUNTUTAN — PULANGAN DEPOSIT

Tarikh: [TARIKH]
Kepada: [NAMA]
Alamat: [ALAMAT]

PER: TUNTUTAN PULANGAN DEPOSIT KESELAMATAN

Tuan/Puan,

Saya merujuk Perjanjian Sewa bertarikh [TARIKH] untuk hartanah di [ALAMAT], yang tamat pada [TARIKH TAMAT].

Deposit keselamatan sebanyak RM[JUMLAH] telah dibayar. Hartanah dipulangkan dalam keadaan baik pada [TARIKH KELUAR].

Dengan ini saya menuntut pulangan penuh deposit RM[JUMLAH] dalam EMPAT BELAS (14) hari.

Yang benar,
[NAMA ANDA]
[NO IC]`,
    },
    eviction: {
      title: 'Proses Pengusiran',
      law: 'Akta Relief Spesifik 1950 + Akta Distres 1951',
      timeline: '1-6 bulan (proses undang-undang)',
      cost: 'RM500-5,000+ (fi guaman + mahkamah)',
      steps: [
        { title: 'Hantar notis bertulis (Bulan 1)', action: 'Hantar notis rasmi untuk mengosongkan. Tempoh notis mengikut perjanjian (biasanya 14-30 hari).', warning: 'JANGAN tukar kunci, potong bekalan, atau buang barang penyewa. Ini HARAM.' },
        { title: 'Failkan perintah milikan (Bulan 2)', action: 'Failkan permohonan Perintah Milikan di Mahkamah Tinggi. Perlu peguam.', warning: 'Ini bukan perkara Mahkamah Majistret.' },
        { title: 'Perbicaraan (Bulan 2-4)', action: 'Hadiri perbicaraan. Bawa perjanjian, bukti pelanggaran, notis yang dihantar.', warning: 'Mahkamah mungkin beri penyewa masa untuk keluar.' },
        { title: 'Writ Milikan (Bulan 4-6)', action: 'Jika penyewa masih enggan keluar, mohon Writ Milikan. Bailif akan usir penyewa.', warning: 'Hanya bailif boleh usir. Anda tidak boleh buat sendiri.' },
      ],
      document: `NOTIS MENGOSONGKAN

Tarikh: [TARIKH]
Kepada: [NAMA PENYEWA]
Hartanah: [ALAMAT]

PER: NOTIS MENGOSONGKAN PREMIS

Tuan/Puan,

Saya merujuk Perjanjian Sewa bertarikh [TARIKH].

Anda diberi notis [30] hari untuk mengosongkan premis sebelum [TARIKH KOSONG].

Kegagalan mengosongkan akan menyebabkan tindakan undang-undang tanpa notis lanjut.

Yang benar,
[NAMA TUAN RUMAH]
[NO IC]`,
    },
  },
  zh: {
    rentDefault: {
      title: '租金拖欠',
      law: '1951年扣押法 + 1950年合同法',
      timeline: '2-8周，取决于采取的行动',
      cost: 'RM50-500（法院费）或 RM0（协商）',
      steps: [
        { title: '发送书面提醒（第1-7天）', action: '发送WhatsApp/信函给租客。保留记录。礼貌但坚定。', warning: '不要威胁，暂不提驱逐。' },
        { title: '发出正式催款函（第8-14天）', action: '通过挂号信发送催款函。说明金额、截止日期（14天）和将采取法律行动。', warning: '必须书面。仅WhatsApp可能不够法庭使用。' },
        { title: '向推事庭提交（第15-30天）', action: '提交198表格。费用约RM50。RM5,000以下可自行申请。', warning: '须有签署的租约和催款函证明。' },
        { title: '扣押申请（替代方案）', action: '根据1951年扣押法，申请扣押令扣押租客动产作为欠租担保。', warning: '只有法警可以执行。您不能自行扣押。' },
      ],
      document: `催款函

日期：[日期]
致：[租客姓名]
地址：[物业地址]

主题：要求支付拖欠租金

先生/女士：

本人参照[日期]签订的租赁协议，物业位于[地址]。

特此要求您在本函日期起十四（14）天内支付拖欠租金RM[金额]，涵盖[月份]的租金。

如未在规定期限内收到付款，本人将采取法律行动，届时您将承担所有相关费用。

此致
[房东姓名]
[身份证号]
[联系电话]`,
    },
    deposit: {
      title: '押金纠纷',
      law: '1950年合同法 + 1950年特定救济法',
      timeline: '2-12周',
      cost: 'RM0（协商）至 RM2,000（仲裁/法院）',
      steps: [
        { title: '记录一切（立即）', action: '拍摄退房时物业状况照片/视频。与入住清单对比。使用Veri.ai照片证明工具。', warning: '没有证据就是口说无凭。' },
        { title: '要求详细扣除清单（第1-7天）', action: '要求书面列出所有扣除项及收据。', warning: '房东不能扣除正常磨损（褪色油漆、轻微划痕）。' },
        { title: '发送催款函（第8-21天）', action: '发送正式催款函。说明金额，给14天回复。', warning: '保留所有书面通信。' },
        { title: '向仲裁庭/法院提交（第22天+）', action: '向消费者索赔仲裁庭提交（RM50,000以下）。带上：租约、照片、催款函。', warning: '仲裁庭比法院更快更便宜，不需要律师。' },
      ],
      document: `催款函 — 退还押金

日期：[日期]
致：[姓名]
地址：[地址]

主题：要求退还押金

先生/女士：

本人参照[日期]的租赁协议，物业位于[地址]，已于[终止日期]终止。

押金RM[金额]已于租赁开始时支付。物业已于[退房日期]以良好状态归还。

特此要求在本函日期起十四（14）天内全额退还押金RM[金额]。

此致
[您的姓名]
[身份证号]`,
    },
    eviction: {
      title: '驱逐流程',
      law: '1950年特定救济法 + 1951年扣押法',
      timeline: '1-6个月（法律程序）',
      cost: 'RM500-5,000+（律师费+法院费）',
      steps: [
        { title: '发送书面通知（第1个月）', action: '发送正式搬迁通知。通知期按协议（通常14-30天）。通过挂号信发送。', warning: '绝对不要换锁、断水断电或搬走租客物品。这是非法的。' },
        { title: '申请占有令（第2个月）', action: '向高等法院申请占有令。需要律师。', warning: '这不是推事庭的事项。' },
        { title: '法庭审理（第2-4个月）', action: '出席审理。带上：租约、违约证据、发出的通知。', warning: '法院可能给租客时间搬迁。' },
        { title: '占有令执行（第4-6个月）', action: '如租客仍拒绝搬离，申请执行占有令。法警将强制搬迁。', warning: '只有法警可以执行，即使有法院命令您也不能自行驱逐。' },
      ],
      document: `搬迁通知

日期：[日期]
致：[租客姓名]
物业：[物业地址]

主题：搬迁通知

先生/女士：

本人参照[日期]的租赁协议。

特此给予[30]天通知，请于[搬迁日期]前腾出物业。

逾期未搬将导致法律诉讼，届时不再另行通知。

此致
[房东姓名]
[身份证号]`,
    },
  },
};

function SituationNavigator({ lang, onClose }) {
  const t = L[lang];
  const sits = SITUATIONS[lang];
  const [active, setActive] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyDoc = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!active) {
    return (
      <Modal>
        <ToolHeader icon="🧭" title={t.navTitle} desc={t.navDesc} onClose={onClose} />
        <p className="text-[13px] font-medium mb-4" style={{ color: '#334155' }}>{t.navPick}</p>
        <div className="space-y-2.5">
          {[
            { id: 'rentDefault', icon: '💸', title: t.navRentDefault, desc: t.navRentDefaultDesc },
            { id: 'deposit', icon: '🔒', title: t.navDeposit, desc: t.navDepositDesc },
            { id: 'eviction', icon: '🚪', title: t.navEviction, desc: t.navEvictionDesc },
          ].map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className="w-full flex items-center gap-3 text-left px-4 py-4 rounded-[14px] bg-white card-hover"
              style={{ border: '1px solid #e2e8f0' }}>
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="text-[14px] font-semibold" style={{ color: '#1e293b' }}>{s.title}</div>
                <div className="text-[11px]" style={{ color: '#94a3b8' }}>{s.desc}</div>
              </div>
              <svg className="ml-auto flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </Modal>
    );
  }

  const sit = sits[active];

  return (
    <Modal>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setActive(null)} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#3b82f6' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          {t.navBack}
        </button>
        <CloseBtn onClick={onClose} />
      </div>

      <h3 className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>{sit.title}</h3>

      {/* Info bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>⚖️ {sit.law}</span>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>⏱ {sit.timeline}</span>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>💰 {sit.cost}</span>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-5">
        {sit.steps.map((step, i) => (
          <div key={i} className="rounded-[14px] overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#f8fafc' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white"
                style={{ background: '#0f172a' }}>{i + 1}</div>
              <span className="text-[13px] font-semibold" style={{ color: '#1e293b' }}>{step.title}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{t.navAction}</div>
                <p className="text-[12px] leading-relaxed" style={{ color: '#334155' }}>{step.action}</p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                <p className="text-[11px]" style={{ color: '#92400e' }}>⚠️ {step.warning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document template */}
      <div className="rounded-[14px] overflow-hidden mb-3" style={{ border: '1px solid #e2e8f0' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#f8fafc' }}>
          <span className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>📄 {t.navDocument}</span>
          <button onClick={() => copyDoc(sit.document)}
            className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition"
            style={copied
              ? { background: '#0f172a', color: 'white' }
              : { background: 'white', border: '1px solid #e2e8f0', color: '#334155' }
            }>{copied ? '✓ Copied!' : t.navCopyDoc}</button>
        </div>
        <div className="px-4 py-3">
          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: '#475569' }}>{sit.document}</pre>
        </div>
      </div>
    </Modal>
  );
}

export default SituationNavigator;
