'use client';

import { useState } from 'react';
import { Modal, ToolHeader, ActionBtn, CloseBtn } from './shared';
import { L } from './labels';

const COMPLIANCE_GOALS = {
  rentFactory: {
    en: {
      verdict: 'maybe',
      verdictText: 'You CAN do this — but requirements depend on the activity and land type. Agricultural land MUST be converted first.',
      cnTrap: 'In China, land use change (土地用途变更) is a standard process with clear timelines. In Malaysia, it requires State Authority approval and can take 12-24 months with NO guarantee of success. Do NOT sign lease until conversion is confirmed.',
      summary: { licenses: '6 required + 2 recommended', time: '14-30 months (land conversion is bottleneck)', cost: 'RM60K - RM275K+' },
      required: [
        { name: 'Land Use Conversion', dept: 'Pejabat Tanah (Land Office)', detail: 'Convert agricultural → industrial under NLC Section 124. Must be done BEFORE any building or operations.', time: '12-24 months', cost: 'RM50K-200K premium', warn: 'May be rejected' },
        { name: 'DOE Environmental License', dept: 'Jabatan Alam Sekitar (DOE)', detail: 'Environmental Impact Assessment (EIA) required for manufacturing. Scheduled waste handling needs separate registration.', time: '3-6 months', cost: 'RM5K-50K (EIA)' },
        { name: 'Factory & Machinery Registration', dept: 'DOSH (Jabatan Keselamatan & Kesihatan)', detail: 'Register under Factories & Machinery Act 1967. Boiler/pressure vessel certs if applicable. OSHA compliance audit.', time: '1-3 months', cost: 'RM1K-5K' },
        { name: 'PBT Business License', dept: 'Majlis Perbandaran / Daerah', detail: 'Local council business premise license. Annual renewal. Must match approved land use.', time: '2-4 weeks', cost: 'RM200-2K/year' },
        { name: 'Fire Certificate (CF)', dept: 'Bomba (Fire & Rescue Dept)', detail: 'Fire safety cert for factory operations. Inspection of fire exits, extinguishers, suppression systems.', time: '2-6 weeks', cost: 'RM500-3K' },
        { name: 'Foreign Worker Permits', dept: 'Imigresen Malaysia + MOHR', detail: 'Apply via FWCMS system. Need: levy payment, SOCSO registration, workers\' housing compliance (Act 446). Quota approval from MOHR.', time: '2-6 months', cost: 'RM1.8K-2.5K/worker/year' },
      ],
      recommended: [
        { name: 'MIDA Manufacturing License', dept: 'MIDA (Investment Authority)', detail: 'If capital > RM2.5M or 75+ workers. Unlocks tax incentives (Pioneer Status / ITA). Strongly recommended for foreign companies.', time: '2-4 months', cost: 'Free to apply' },
        { name: 'Environmental Liability Insurance', dept: 'Any licensed insurer', detail: 'EQA 1974 holds landlord AND tenant liable. Insurance protects both parties from environmental claims and cleanup costs.', cost: 'RM3K-15K/year' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'BOLEH — tetapi bergantung pada aktiviti dan jenis tanah. Tanah pertanian MESTI ditukar dahulu.',
      cnTrap: 'Di China, tukar guna tanah (土地用途变更) proses standard dengan jangka masa jelas. Di Malaysia, ia perlu kelulusan Pihak Berkuasa Negeri dan boleh ambil 12-24 bulan TANPA jaminan. JANGAN tandatangan sewa sehingga penukaran disahkan.',
      summary: { licenses: '6 wajib + 2 disyorkan', time: '14-30 bulan (penukaran tanah adalah penghalang)', cost: 'RM60K - RM275K+' },
      required: [
        { name: 'Penukaran Guna Tanah', dept: 'Pejabat Tanah', detail: 'Tukar pertanian → perindustrian di bawah KTN Seksyen 124. Mesti dibuat SEBELUM sebarang pembinaan.', time: '12-24 bulan', cost: 'RM50K-200K premium', warn: 'Mungkin ditolak' },
        { name: 'Lesen Alam Sekitar DOE', dept: 'Jabatan Alam Sekitar (JAS)', detail: 'EIA diperlukan untuk pembuatan. Pengendalian sisa berjadual perlu pendaftaran berasingan.', time: '3-6 bulan', cost: 'RM5K-50K (EIA)' },
        { name: 'Pendaftaran Kilang & Jentera', dept: 'JKKP (DOSH)', detail: 'Daftar di bawah Akta Kilang & Jentera 1967. Sijil dandang/vesel tekanan jika berkenaan.', time: '1-3 bulan', cost: 'RM1K-5K' },
        { name: 'Lesen Perniagaan PBT', dept: 'Majlis Perbandaran / Daerah', detail: 'Lesen premis perniagaan pihak berkuasa tempatan. Pembaharuan tahunan.', time: '2-4 minggu', cost: 'RM200-2K/tahun' },
        { name: 'Sijil Bomba (CF)', dept: 'Bomba', detail: 'Sijil keselamatan kebakaran untuk operasi kilang.', time: '2-6 minggu', cost: 'RM500-3K' },
        { name: 'Permit Pekerja Asing', dept: 'Imigresen + MOHR', detail: 'Mohon melalui FWCMS. Perlu: bayaran levi, pendaftaran PERKESO, pematuhan perumahan (Akta 446).', time: '2-6 bulan', cost: 'RM1.8K-2.5K/pekerja/tahun' },
      ],
      recommended: [
        { name: 'Lesen Pembuatan MIDA', dept: 'MIDA', detail: 'Jika modal > RM2.5J atau 75+ pekerja. Buka insentif cukai.', time: '2-4 bulan', cost: 'Percuma' },
        { name: 'Insurans Liabiliti Alam Sekitar', dept: 'Penanggung insurans berlesen', detail: 'AKS 1974 menjadikan tuan rumah DAN penyewa bertanggungjawab.', cost: 'RM3K-15K/tahun' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '可以——但取决于活动类型和土地性质。农业用地必须先完成用途转换。',
      cnTrap: '在中国，土地用途变更是有明确时间表的标准流程。在马来西亚，需要州政府批准，可能需要12-24个月且不保证成功。在用途转换确认前，不要签租约。',
      summary: { licenses: '6项必需 + 2项建议', time: '14-30个月（土地转换是瓶颈）', cost: 'RM6万 - RM27.5万+' },
      required: [
        { name: '土地用途转换', dept: '土地局 (Pejabat Tanah)', detail: '根据《国家土地法》第124条将农业用地转为工业用地。必须在任何建设或运营之前完成。', time: '12-24个月', cost: 'RM5万-20万溢价', warn: '可能被拒绝' },
        { name: 'DOE环境许可证', dept: '环境局 (JAS)', detail: '制造业需要环境影响评估（EIA）。危险废物处理需单独注册。', time: '3-6个月', cost: 'RM5千-5万 (EIA)' },
        { name: '工厂与机械注册', dept: 'DOSH（职业安全与健康局）', detail: '根据《1967年工厂与机械法》注册。锅炉/压力容器需另行认证。', time: '1-3个月', cost: 'RM1千-5千' },
        { name: 'PBT营业执照', dept: '市/县议会', detail: '地方政府营业场所执照。需年度续期。必须符合已批准的土地用途。', time: '2-4周', cost: 'RM200-2千/年' },
        { name: '消防证书 (CF)', dept: '消防与救援局 (Bomba)', detail: '工厂运营所需的消防安全证书。', time: '2-6周', cost: 'RM500-3千' },
        { name: '外劳许可证', dept: '移民局 + 人力资源部', detail: '通过FWCMS系统申请。需要：人头税、SOCSO注册、工人住房合规（第446号法令）。', time: '2-6个月', cost: 'RM1.8千-2.5千/工人/年' },
      ],
      recommended: [
        { name: 'MIDA制造业许可证', dept: 'MIDA（投资促进局）', detail: '资本超过RM250万或75+工人时需要。可享受税收优惠。', time: '2-4个月', cost: '免费申请' },
        { name: '环境责任保险', dept: '任何持牌保险公司', detail: '《1974年环境质量法》规定房东和租户双方均有责任。保险保护双方。', cost: 'RM3千-1.5万/年' },
      ],
    },
  },
  rentHouse: {
    en: {
      verdict: 'yes',
      verdictText: 'Foreigners CAN rent residential property in Malaysia freely. No restrictions on tenancy — only on purchase.',
      cnTrap: 'In China, tenants have statutory right to terminate (解除权 Art. 563) and right of first refusal (优先购买权 Art. 726). Neither exists in Malaysia. Your deposit is your only leverage — protect it.',
      summary: { licenses: '0 licenses needed', time: '1-2 weeks', cost: 'RM3K-10K upfront (deposit + stamp duty)' },
      required: [
        { name: 'Valid Passport + Visa', dept: 'Imigresen Malaysia', detail: 'Must have valid pass (work permit, MM2H, student pass, etc.). Tourist visa technically allows short-term rental but not long-term tenancy.', time: 'Already have', cost: 'Varies' },
        { name: 'Tenancy Agreement (Stamped)', dept: 'LHDN (IRB) via MyTax', detail: 'Written agreement is essential. MUST be stamped within 30 days. Unstamped = cannot be used in court. Use SDSAS self-assessment from Jan 2026.', time: '1-2 weeks', cost: 'RM100-500 (stamp duty)' },
        { name: 'Security Deposit (2+1)', dept: 'Paid to landlord', detail: 'Standard: 2 months rent (security) + 0.5 month (utility deposit). Get receipts. Document everything with photos at check-in.', time: 'Upfront', cost: '2.5 months rent' },
      ],
      recommended: [
        { name: 'Use Veri.ai Evidence Vault', dept: 'Veri.ai Photo Proof tool', detail: 'SHA-256 hash your check-in photos. Creates court-ready evidence under Section 90A Evidence Act. Protects your deposit claim.', time: '10 minutes', cost: 'Free' },
        { name: 'Verify Landlord Ownership', dept: 'Pejabat Tanah (Land Office)', detail: 'Do a title search to confirm the person renting to you actually owns the property. Scams exist.', time: 'Same day', cost: 'RM50-100' },
      ],
    },
    bm: {
      verdict: 'yes',
      verdictText: 'Warga asing BOLEH menyewa hartanah kediaman di Malaysia dengan bebas. Tiada sekatan ke atas sewaan.',
      cnTrap: 'Di China, penyewa ada hak penamatan berkanun (解除权) dan hak pembelian pertama (优先购买权). Kedua-duanya TIADA di Malaysia. Deposit anda satu-satunya leverage — lindunginya.',
      summary: { licenses: '0 lesen diperlukan', time: '1-2 minggu', cost: 'RM3K-10K pendahuluan (deposit + duti setem)' },
      required: [
        { name: 'Pasport Sah + Visa', dept: 'Imigresen Malaysia', detail: 'Mesti ada pas sah. Visa pelancong membenarkan sewa jangka pendek sahaja.', time: 'Sudah ada', cost: 'Pelbagai' },
        { name: 'Perjanjian Sewa (Bersetem)', dept: 'LHDN melalui MyTax', detail: 'Perjanjian bertulis penting. MESTI disetem dalam 30 hari. Tanpa setem = tak boleh guna di mahkamah.', time: '1-2 minggu', cost: 'RM100-500 (duti setem)' },
        { name: 'Deposit Keselamatan (2+1)', dept: 'Bayar kepada tuan rumah', detail: 'Standard: 2 bulan sewa (keselamatan) + 0.5 bulan (deposit utiliti). Dapatkan resit.', time: 'Pendahuluan', cost: '2.5 bulan sewa' },
      ],
      recommended: [
        { name: 'Guna Veri.ai Bukti Foto', dept: 'Alat Bukti Foto Veri.ai', detail: 'Hash SHA-256 gambar masuk anda. Cipta bukti mahkamah di bawah Seksyen 90A Akta Keterangan.', time: '10 minit', cost: 'Percuma' },
        { name: 'Sahkan Pemilikan Tuan Rumah', dept: 'Pejabat Tanah', detail: 'Buat carian hakmilik untuk sahkan pemilik sebenar. Penipuan wujud.', time: 'Hari yang sama', cost: 'RM50-100' },
      ],
    },
    zh: {
      verdict: 'yes',
      verdictText: '外国人可以在马来西亚自由租赁住宅。租赁没有限制——只有购买有限制。',
      cnTrap: '在中国，租户有法定解除权（第563条）和优先购买权（第726条）。马来西亚都没有这些权利。你的押金是唯一的筹码——保护好它。',
      summary: { licenses: '不需要许可证', time: '1-2周', cost: 'RM3千-1万预付（押金+印花税）' },
      required: [
        { name: '有效护照 + 签证', dept: '马来西亚移民局', detail: '必须持有有效签证（工作准证、MM2H、学生签证等）。旅游签证仅允许短期租赁。', time: '已有', cost: '不等' },
        { name: '租约（已盖章）', dept: 'LHDN（税务局）通过MyTax', detail: '书面协议必不可少。必须在30天内盖章。未盖章=不能在法庭上使用。2026年1月起使用SDSAS自评系统。', time: '1-2周', cost: 'RM100-500（印花税）' },
        { name: '押金（2+1）', dept: '支付给房东', detail: '标准：2个月租金（押金）+ 0.5个月（水电押金）。索取收据。入住时拍照记录一切。', time: '预付', cost: '2.5个月租金' },
      ],
      recommended: [
        { name: '使用Veri.ai照片证明', dept: 'Veri.ai照片证明工具', detail: 'SHA-256哈希锁定入住照片。根据《证据法》第90A条创建法庭证据。保护您的押金索赔。', time: '10分钟', cost: '免费' },
        { name: '核实房东所有权', dept: '土地局', detail: '进行产权搜索，确认出租人确实拥有该房产。存在诈骗。', time: '当天', cost: 'RM50-100' },
      ],
    },
  },
  buyHouse: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreigners CAN buy — but minimum price threshold applies (varies by state). State Authority consent required.',
      cnTrap: 'No "定金 double return" (earnest money) in Malaysia — if you default, you simply lose your deposit. No 优先购买权 (right of first refusal) for tenants. No 质保期 warranty like China — developer warranty is only 24 months from VP.',
      summary: { licenses: '5 required + 2 recommended', time: '4-6 months', cost: 'RM35K-55K+ (excluding property price)' },
      required: [
        { name: 'Verify Minimum Price Threshold', dept: 'State Government', detail: 'Most states: RM1,000,000 min. Penang island: RM1,000,000. Penang mainland: RM500,000. Johor (Forest City): RM600,000. Property MUST be above threshold.', time: 'Before signing', cost: 'Free to check', warn: 'Below threshold = rejected' },
        { name: 'State Authority Consent', dept: 'Pejabat Tanah & Galian', detail: 'Apply via lawyer. Foreign ownership must be approved by State Authority under NLC. Non-strata titles are harder to get approved.', time: '3-6 months', cost: 'RM1K-3K (legal fees)' },
        { name: 'Stamp Duty on SPA', dept: 'LHDN (IRB) via MyTax', detail: 'Tiered: 1% (first RM100K), 2% (RM100K-500K), 3% (RM500K-1M), 4% (above RM1M). SDSAS self-assessment applies from 2026.', time: 'Within 30 days', cost: 'RM24,000+ (on RM1M)' },
        { name: 'Legal Fees & Disbursements', dept: 'Licensed Malaysian lawyer', detail: 'SPA legal fees (tiered scale), loan agreement fees (if financing), title transfer fees, registration fees.', time: 'Throughout process', cost: 'RM10K-25K total' },
        { name: 'RPGT Awareness', dept: 'LHDN (IRB)', detail: 'Real Property Gains Tax: foreigners pay 30% on gains (first 5 years), 10% (after year 5). File within 60 days of disposal.', time: 'On future sale', cost: '30% of profit if sold <5 years', warn: '30% tax if sold early' },
      ],
      recommended: [
        { name: 'Land Title Search', dept: 'Pejabat Tanah', detail: 'Verify: freehold/leasehold, caveats, charges, Malay Reserve status, encumbrances. CRITICAL — do before paying anything.', time: 'Same day', cost: 'RM50-100' },
        { name: 'Defect Inspection (Sub-sale)', dept: 'Licensed building inspector', detail: 'Developer warranty is only 24 months from VP (no 质保期 like China). For sub-sale, inspect BEFORE signing SPA.', time: '1-2 days', cost: 'RM500-1.5K' },
      ],
      timeline: [
        { step: 'Week 1-2: Sign SPA + pay 10% deposit', detail: 'Lawyer prepares SPA. You pay booking + deposit.' },
        { step: 'Month 1-3: State Authority consent', detail: 'Application submitted. Wait for approval. If rejected, SPA is void.' },
        { step: 'Month 3-4: Stamp duty + balance payment', detail: 'Pay stamp duty via SDSAS. Complete balance 90% (or bank loan disbursement).' },
        { step: 'Month 4-6: Title transfer registered', detail: 'Title transferred at Land Office. Keys handed over. Done!' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Warga asing BOLEH beli — tetapi ambang harga minimum dikenakan (berbeza mengikut negeri). Kelulusan Pihak Berkuasa Negeri diperlukan.',
      cnTrap: 'Tiada "pulangan berganda 定金" di Malaysia. Tiada 优先购买权 untuk penyewa. Waranti pemaju hanya 24 bulan dari VP.',
      summary: { licenses: '5 wajib + 2 disyorkan', time: '4-6 bulan', cost: 'RM35K-55K+ (tidak termasuk harga hartanah)' },
      required: [
        { name: 'Sahkan Ambang Harga Minimum', dept: 'Kerajaan Negeri', detail: 'Kebanyakan negeri: RM1,000,000 min. Pulau Pinang: RM1,000,000 (pulau), RM500,000 (tanah besar).', time: 'Sebelum tandatangan', cost: 'Percuma', warn: 'Di bawah ambang = ditolak' },
        { name: 'Kelulusan Pihak Berkuasa Negeri', dept: 'Pejabat Tanah & Galian', detail: 'Mohon melalui peguam. Pemilikan asing perlu kelulusan di bawah KTN.', time: '3-6 bulan', cost: 'RM1K-3K (yuran guaman)' },
        { name: 'Duti Setem SPA', dept: 'LHDN melalui MyTax', detail: 'Berperingkat: 1% (RM100K pertama), 2% (RM100K-500K), 3% (RM500K-1J), 4% (atas RM1J).', time: 'Dalam 30 hari', cost: 'RM24,000+ (pada RM1J)' },
        { name: 'Yuran Guaman', dept: 'Peguam berlesen Malaysia', detail: 'Yuran guaman SPA, yuran perjanjian pinjaman, yuran pemindahan hakmilik.', time: 'Sepanjang proses', cost: 'RM10K-25K jumlah' },
        { name: 'Kesedaran CKHT', dept: 'LHDN', detail: 'Cukai Keuntungan Harta Tanah: asing bayar 30% (5 tahun pertama), 10% (selepas 5 tahun).', time: 'Pada jualan masa depan', cost: '30% keuntungan jika jual <5 tahun', warn: 'Cukai 30% jika jual awal' },
      ],
      recommended: [
        { name: 'Carian Hakmilik Tanah', dept: 'Pejabat Tanah', detail: 'Sahkan: kekal/pajakan, kaveat, gadaian, status Simpanan Melayu. KRITIKAL.', time: 'Hari yang sama', cost: 'RM50-100' },
        { name: 'Pemeriksaan Kecacatan', dept: 'Pemeriksa bangunan berlesen', detail: 'Waranti pemaju hanya 24 bulan dari VP. Untuk sub-jualan, periksa SEBELUM SPA.', time: '1-2 hari', cost: 'RM500-1.5K' },
      ],
      timeline: [
        { step: 'Minggu 1-2: Tandatangan SPA + bayar 10% deposit', detail: 'Peguam sediakan SPA.' },
        { step: 'Bulan 1-3: Kelulusan Pihak Berkuasa Negeri', detail: 'Permohonan dihantar. Tunggu kelulusan.' },
        { step: 'Bulan 3-4: Duti setem + bayaran baki', detail: 'Bayar duti setem melalui SDSAS.' },
        { step: 'Bulan 4-6: Pemindahan hakmilik', detail: 'Hakmilik dipindahkan. Kunci diserahkan.' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国人可以购买——但各州有最低价格门槛。需要州政府批准。',
      cnTrap: '马来西亚没有"定金双倍返还"。没有优先购买权。开发商质保期仅24个月（从VP算起），不像中国的质保期制度。',
      summary: { licenses: '5项必需 + 2项建议', time: '4-6个月', cost: 'RM3.5万-5.5万+（不含房价）' },
      required: [
        { name: '核实最低价格门槛', dept: '州政府', detail: '大多数州：RM100万起。槟城岛：RM100万。槟城大陆：RM50万。房产必须超过门槛。', time: '签约前', cost: '免费查询', warn: '低于门槛=被拒' },
        { name: '州政府批准', dept: '土地及矿物局', detail: '通过律师申请。外国人所有权须获州政府批准。', time: '3-6个月', cost: 'RM1千-3千（律师费）' },
        { name: 'SPA印花税', dept: 'LHDN（税务局）通过MyTax', detail: '分级：1%（首RM10万）、2%（RM10万-50万）、3%（RM50万-100万）、4%（超过RM100万）。', time: '30天内', cost: 'RM2.4万+（RM100万房产）' },
        { name: '律师费及支出', dept: '马来西亚持牌律师', detail: 'SPA律师费、贷款协议费、产权转让费、登记费。', time: '全程', cost: 'RM1万-2.5万总计' },
        { name: 'RPGT（房产盈利税）', dept: 'LHDN（税务局）', detail: '外国人：5年内出售征30%，5年后征10%。处置后60天内申报。', time: '未来出售时', cost: '5年内出售利润的30%', warn: '提前出售税率30%' },
      ],
      recommended: [
        { name: '产权搜索', dept: '土地局', detail: '核实：永久/租赁产权、禁令、抵押、马来保留地状态。极其重要——付款前必做。', time: '当天', cost: 'RM50-100' },
        { name: '房屋缺陷检查', dept: '持牌建筑检查员', detail: '开发商质保仅24个月。二手房交易，签SPA前务必检查。', time: '1-2天', cost: 'RM500-1,500' },
      ],
      timeline: [
        { step: '第1-2周：签SPA + 付10%定金', detail: '律师准备SPA。支付订金和首付。' },
        { step: '第1-3月：州政府审批', detail: '提交申请。等待批准。若被拒，SPA作废。' },
        { step: '第3-4月：印花税 + 余款', detail: '通过SDSAS缴纳印花税。完成90%余款。' },
        { step: '第4-6月：产权过户登记', detail: '土地局完成产权过户。交钥匙。完成！' },
      ],
    },
  },
  buyLand: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreigners CAN buy land — but strict restrictions apply. Malay Reserved Land and NCR land are OFF LIMITS. State consent required.',
      cnTrap: 'In China, ALL land is state-owned and you only buy use rights (70/40/50 years). In Malaysia, FREEHOLD means you own it forever. But beware: "leasehold" does NOT auto-renew like China. Also Malay Reserved Land is a concept that does not exist in China — buying it as a foreigner is legally VOID.',
      summary: { licenses: '3 required + 2 recommended', time: '6-18 months', cost: 'RM50K-200K+ (excluding land price)' },
      required: [
        { name: 'Verify Land Status', dept: 'Pejabat Tanah', detail: 'CRITICAL: Check for Malay Reserved Land, NCR claims (Sabah/Sarawak), category (agriculture/building/industry), caveats, charges. Non-Malay purchase of Malay Reserved Land is VOID.', time: '1-3 days', cost: 'RM50-200', warn: 'Malay Reserved = CANNOT buy' },
        { name: 'State Authority Consent', dept: 'Pejabat Tanah & Galian', detail: 'All foreign land purchases require State Authority consent under NLC Section 433B. For transactions >RM20M, EPU (Economic Planning Unit) approval also needed.', time: '3-12 months', cost: 'RM5K-20K (legal + application)' },
        { name: 'Land Use Conversion (if needed)', dept: 'Pejabat Tanah', detail: 'If buying agricultural land for development/factory, must convert under NLC Section 124. Using agricultural land for non-agricultural purposes WITHOUT conversion = criminal offense.', time: '12-24 months', cost: 'RM50K-200K premium', warn: 'Criminal offense if used without conversion' },
      ],
      recommended: [
        { name: 'Survey & Boundary Check', dept: 'Licensed land surveyor (JUPEM)', detail: 'Verify actual boundaries match title. Encroachment issues are common especially for rural/agricultural land.', time: '2-4 weeks', cost: 'RM3K-10K' },
        { name: 'Environmental Assessment', dept: 'DOE / Environmental consultant', detail: 'If planning development: check flood zones, environmental sensitivity, scheduled waste history. Some land may have contamination from previous use.', time: '1-3 months', cost: 'RM5K-50K' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Warga asing BOLEH beli tanah — tetapi sekatan ketat dikenakan. Tanah Simpanan Melayu dan tanah NCR DILARANG.',
      cnTrap: 'Di China, SEMUA tanah milik negara (hak guna 70/40/50 tahun). Di Malaysia, KEKAL bermakna milik selama-lamanya. Tetapi "pajakan" TIDAK diperbaharui automatik. Tanah Simpanan Melayu = pembelian oleh bukan Melayu TERBATAL.',
      summary: { licenses: '3 wajib + 2 disyorkan', time: '6-18 bulan', cost: 'RM50K-200K+ (tidak termasuk harga tanah)' },
      required: [
        { name: 'Sahkan Status Tanah', dept: 'Pejabat Tanah', detail: 'KRITIKAL: Semak Tanah Simpanan Melayu, tuntutan NCR, kategori, kaveat. Pembelian Tanah Simpanan Melayu oleh bukan Melayu adalah TERBATAL.', time: '1-3 hari', cost: 'RM50-200', warn: 'Simpanan Melayu = TAK BOLEH beli' },
        { name: 'Kelulusan Pihak Berkuasa Negeri', dept: 'Pejabat Tanah & Galian', detail: 'Semua pembelian tanah asing perlu kelulusan di bawah KTN Seksyen 433B.', time: '3-12 bulan', cost: 'RM5K-20K' },
        { name: 'Penukaran Guna Tanah (jika perlu)', dept: 'Pejabat Tanah', detail: 'Jika beli tanah pertanian untuk pembangunan, mesti tukar di bawah KTN Seksyen 124. Tanpa penukaran = kesalahan jenayah.', time: '12-24 bulan', cost: 'RM50K-200K', warn: 'Kesalahan jenayah tanpa penukaran' },
      ],
      recommended: [
        { name: 'Ukur & Semakan Sempadan', dept: 'Juruukur berlesen (JUPEM)', detail: 'Sahkan sempadan sebenar padanan hakmilik. Isu pencerobohan biasa untuk tanah luar bandar.', time: '2-4 minggu', cost: 'RM3K-10K' },
        { name: 'Penilaian Alam Sekitar', dept: 'JAS / Perunding alam sekitar', detail: 'Jika merancang pembangunan: semak zon banjir, sensitiviti alam sekitar.', time: '1-3 bulan', cost: 'RM5K-50K' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国人可以买地——但限制严格。马来保留地和原住民习惯地（NCR）禁止购买。需州政府批准。',
      cnTrap: '在中国，所有土地国有（使用权70/40/50年）。在马来西亚，永久产权意味着永远拥有。但"租赁产权"不会像中国一样自动续期。马来保留地是中国不存在的概念——外国人购买在法律上无效。',
      summary: { licenses: '3项必需 + 2项建议', time: '6-18个月', cost: 'RM5万-20万+（不含地价）' },
      required: [
        { name: '核实土地状态', dept: '土地局', detail: '极重要：检查是否为马来保留地、NCR索赔、土地类别、禁令、抵押。非马来人购买马来保留地在法律上无效。', time: '1-3天', cost: 'RM50-200', warn: '马来保留地=不能购买' },
        { name: '州政府批准', dept: '土地及矿物局', detail: '所有外国人土地购买需根据《国家土地法》第433B条获得州政府批准。超过RM2000万的交易还需EPU批准。', time: '3-12个月', cost: 'RM5千-2万' },
        { name: '土地用途转换（如需要）', dept: '土地局', detail: '若购买农业用地用于开发/建厂，须根据第124条申请转换。未转换即用于非农业目的=刑事犯罪。', time: '12-24个月', cost: 'RM5万-20万溢价', warn: '未转换使用属刑事犯罪' },
      ],
      recommended: [
        { name: '测量与边界检查', dept: '持牌测量师 (JUPEM)', detail: '核实实际边界与产权一致。农村/农业用地的侵占问题很常见。', time: '2-4周', cost: 'RM3千-1万' },
        { name: '环境评估', dept: '环境局/环境顾问', detail: '若计划开发：检查洪水区、环境敏感度、历史废物。部分土地可能有前用户遗留污染。', time: '1-3个月', cost: 'RM5千-5万' },
      ],
    },
  },
  rentOffice: {
    en: {
      verdict: 'yes',
      verdictText: 'Foreigners CAN lease commercial space in Malaysia. Company registration (SSM or foreign branch) is typically required to operate.',
      cnTrap: 'In China, penalty clauses (违约金) are enforceable. In Malaysia, penalty clauses are VOID — only "liquidated damages" (genuine pre-estimate of loss) are valid. Also: "转让费" (key money) to outgoing tenant is NOT protected — landlord can refuse the assignment.',
      summary: { licenses: '3 required + 1 recommended', time: '1-3 months', cost: 'RM5K-30K upfront' },
      required: [
        { name: 'Company Registration', dept: 'SSM (Suruhanjaya Syarikat Malaysia)', detail: 'Register Sdn Bhd, branch office, or representative office. Foreign companies need SSM + Companies Commission approval.', time: '2-4 weeks', cost: 'RM1K-5K' },
        { name: 'Tenancy Agreement (Stamped)', dept: 'LHDN via MyTax', detail: 'Commercial leases: stamp within 30 days. Leases >3 years must be REGISTERED at Land Office to bind future owners.', time: '1-2 weeks', cost: 'RM500-5K (stamp duty)', warn: '>3 years? Register or risk losing lease if property sold' },
        { name: 'PBT Business License', dept: 'Majlis Perbandaran / Daerah', detail: 'Required for all commercial operations. Specific license category depends on business type. Annual renewal.', time: '2-4 weeks', cost: 'RM200-2K/year' },
      ],
      recommended: [
        { name: 'Fire Safety Certificate', dept: 'Bomba', detail: 'Required if premises exceed certain size or occupancy thresholds. Check with local Bomba office.', time: '2-4 weeks', cost: 'RM300-1K' },
      ],
    },
    bm: {
      verdict: 'yes',
      verdictText: 'Warga asing BOLEH menyewa ruang komersial di Malaysia. Pendaftaran syarikat (SSM atau cawangan asing) biasanya diperlukan.',
      cnTrap: 'Di China, klausa penalti (违约金) boleh dikuatkuasakan. Di Malaysia, klausa penalti TERBATAL. "转让费" (wang kunci) kepada penyewa lama TIDAK dilindungi.',
      summary: { licenses: '3 wajib + 1 disyorkan', time: '1-3 bulan', cost: 'RM5K-30K pendahuluan' },
      required: [
        { name: 'Pendaftaran Syarikat', dept: 'SSM', detail: 'Daftar Sdn Bhd, pejabat cawangan, atau pejabat wakil. Syarikat asing perlu kelulusan SSM.', time: '2-4 minggu', cost: 'RM1K-5K' },
        { name: 'Perjanjian Sewa (Bersetem)', dept: 'LHDN melalui MyTax', detail: 'Setem dalam 30 hari. Sewa >3 tahun MESTI didaftarkan di Pejabat Tanah.', time: '1-2 minggu', cost: 'RM500-5K', warn: '>3 tahun? Daftar atau risiko hilang sewa' },
        { name: 'Lesen Perniagaan PBT', dept: 'Majlis Perbandaran / Daerah', detail: 'Diperlukan untuk semua operasi komersial. Pembaharuan tahunan.', time: '2-4 minggu', cost: 'RM200-2K/tahun' },
      ],
      recommended: [
        { name: 'Sijil Keselamatan Kebakaran', dept: 'Bomba', detail: 'Diperlukan jika premis melebihi saiz atau ambang penghuni tertentu.', time: '2-4 minggu', cost: 'RM300-1K' },
      ],
    },
    zh: {
      verdict: 'yes',
      verdictText: '外国人可以在马来西亚租赁商业空间。通常需要公司注册（SSM或外国分公司）才能运营。',
      cnTrap: '在中国，违约金条款可强制执行。在马来西亚，惩罚性条款无效——只有"预定损害赔偿"有效。"转让费"（顶手费）给退租方不受保护——房东可拒绝转让。',
      summary: { licenses: '3项必需 + 1项建议', time: '1-3个月', cost: 'RM5千-3万预付' },
      required: [
        { name: '公司注册', dept: 'SSM（马来西亚公司委员会）', detail: '注册Sdn Bhd、分公司或代表处。外国公司需SSM批准。', time: '2-4周', cost: 'RM1千-5千' },
        { name: '租约（已盖章）', dept: 'LHDN通过MyTax', detail: '商业租赁：30天内盖章。超过3年的租赁必须在土地局登记。', time: '1-2周', cost: 'RM500-5千（印花税）', warn: '超3年？须登记否则房产出售时租约可能无效' },
        { name: 'PBT营业执照', dept: '市/县议会', detail: '所有商业运营必需。具体许可类别取决于业务类型。需年度续期。', time: '2-4周', cost: 'RM200-2千/年' },
      ],
      recommended: [
        { name: '消防安全证书', dept: '消防与救援局 (Bomba)', detail: '若场所超过一定面积或人数标准则需要。咨询当地消防局。', time: '2-4周', cost: 'RM300-1千' },
      ],
    },
  },
  openFnb: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreigners CAN open F&B in Malaysia — but it requires MULTIPLE licenses from different departments. Plan 3-6 months lead time.',
      cnTrap: 'In China, food business licensing is centralized through one authority (市场监督管理局). In Malaysia, you need SEPARATE licenses from PBT, MOH, Bomba, and possibly JAKIM (halal). Each has its own process and timeline. No single-window clearance.',
      summary: { licenses: '6 required + 2 recommended', time: '3-6 months', cost: 'RM10K-50K (licenses only)' },
      required: [
        { name: 'Company Registration', dept: 'SSM', detail: 'Register business entity. Foreign-owned F&B may need WRT (Wholesale & Retail Trade) license from KPDNHEP.', time: '2-4 weeks', cost: 'RM1K-5K' },
        { name: 'PBT Business Premise License', dept: 'Majlis Perbandaran / Daerah', detail: 'Food premise license from local council. Requires premises inspection. Zoning must allow F&B — not all "commercial" lots qualify.', time: '2-6 weeks', cost: 'RM300-3K/year', warn: 'Not all commercial zones allow F&B' },
        { name: 'Food Handler Certificate', dept: 'MOH (Kementerian Kesihatan)', detail: 'ALL food handlers must attend Typhoid Injection + Food Handler Course. Certificate valid 1 year. No exceptions.', time: '1-2 weeks', cost: 'RM50-100/person' },
        { name: 'Food Premise License', dept: 'MOH / Pejabat Kesihatan Daerah', detail: 'Separate from PBT license. Health inspection of kitchen, storage, waste disposal. Grade A/B/C displayed publicly.', time: '2-4 weeks', cost: 'RM200-500' },
        { name: 'Fire Certificate', dept: 'Bomba', detail: 'Mandatory for all F&B premises. Kitchen suppression system may be required for certain setups.', time: '2-4 weeks', cost: 'RM500-2K' },
        { name: 'Signboard License', dept: 'PBT', detail: 'Separate license for your restaurant signage. Size, placement, and illumination regulated by local council.', time: '1-2 weeks', cost: 'RM100-500/year' },
      ],
      recommended: [
        { name: 'Halal Certification', dept: 'JAKIM / JAIN', detail: 'Strongly recommended for wider market appeal. Muslim-majority country — halal cert significantly increases customer base.', time: '3-6 months', cost: 'RM1K-5K' },
        { name: 'Liquor License (if applicable)', dept: 'PBT + Customs', detail: 'If serving alcohol. ONLY granted in non-Muslim majority areas. Some states (Kelantan, Terengganu) = near impossible. Annual renewal + customs duty.', time: '1-3 months', cost: 'RM500-5K/year', warn: 'Some states prohibit alcohol entirely' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Warga asing BOLEH buka F&B di Malaysia — tetapi memerlukan PELBAGAI lesen dari jabatan berbeza. Rancang 3-6 bulan.',
      cnTrap: 'Di China, pelesenan F&B berpusat melalui satu pihak berkuasa. Di Malaysia, perlu lesen BERASINGAN dari PBT, KKM, Bomba, dan mungkin JAKIM (halal). Tiada kaunter sehenti.',
      summary: { licenses: '6 wajib + 2 disyorkan', time: '3-6 bulan', cost: 'RM10K-50K (lesen sahaja)' },
      required: [
        { name: 'Pendaftaran Syarikat', dept: 'SSM', detail: 'Daftar entiti perniagaan. F&B milik asing mungkin perlu lesen WRT dari KPDNHEP.', time: '2-4 minggu', cost: 'RM1K-5K' },
        { name: 'Lesen Premis PBT', dept: 'Majlis Perbandaran', detail: 'Lesen premis makanan. Perlu pemeriksaan. Bukan semua zon "komersial" boleh F&B.', time: '2-6 minggu', cost: 'RM300-3K/tahun', warn: 'Bukan semua zon komersial boleh F&B' },
        { name: 'Sijil Pengendali Makanan', dept: 'KKM', detail: 'SEMUA pengendali makanan perlu suntikan Tifoid + Kursus Pengendali Makanan.', time: '1-2 minggu', cost: 'RM50-100/orang' },
        { name: 'Lesen Premis Makanan', dept: 'KKM / Pejabat Kesihatan Daerah', detail: 'Berasingan dari PBT. Pemeriksaan kesihatan dapur, penyimpanan, buangan sisa.', time: '2-4 minggu', cost: 'RM200-500' },
        { name: 'Sijil Bomba', dept: 'Bomba', detail: 'Wajib untuk semua premis F&B. Sistem penindasan dapur mungkin diperlukan.', time: '2-4 minggu', cost: 'RM500-2K' },
        { name: 'Lesen Papan Tanda', dept: 'PBT', detail: 'Lesen berasingan untuk papan tanda restoran anda.', time: '1-2 minggu', cost: 'RM100-500/tahun' },
      ],
      recommended: [
        { name: 'Pensijilan Halal', dept: 'JAKIM / JAIN', detail: 'Sangat digalakkan. Negara majoriti Muslim — sijil halal meningkatkan pelanggan.', time: '3-6 bulan', cost: 'RM1K-5K' },
        { name: 'Lesen Arak (jika berkenaan)', dept: 'PBT + Kastam', detail: 'Jika hidang alkohol. HANYA di kawasan bukan majoriti Muslim. Sesetengah negeri = hampir mustahil.', time: '1-3 bulan', cost: 'RM500-5K/tahun', warn: 'Sesetengah negeri larang arak sepenuhnya' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国人可以在马来西亚开餐饮——但需要从多个部门获取多个许可证。提前规划3-6个月。',
      cnTrap: '在中国，食品经营许可通过市场监督管理局一个部门办理。在马来西亚，需要分别从PBT、卫生部、消防局，可能还有JAKIM（清真）获取许可。没有一站式服务。',
      summary: { licenses: '6项必需 + 2项建议', time: '3-6个月', cost: 'RM1万-5万（仅许可证）' },
      required: [
        { name: '公司注册', dept: 'SSM', detail: '注册商业实体。外资餐饮可能需要KPDNHEP的WRT执照。', time: '2-4周', cost: 'RM1千-5千' },
        { name: 'PBT营业场所执照', dept: '市/县议会', detail: '地方议会的食品场所执照。需场地检查。并非所有"商业"区都允许餐饮。', time: '2-6周', cost: 'RM300-3千/年', warn: '不是所有商业区都允许餐饮' },
        { name: '食品处理员证书', dept: '卫生部 (MOH)', detail: '所有食品处理员必须接种伤寒疫苗+完成食品处理课程。证书有效期1年。无例外。', time: '1-2周', cost: 'RM50-100/人' },
        { name: '食品场所许可证', dept: '卫生部/区卫生办公室', detail: '与PBT执照分开。厨房、储存、废物处理的卫生检查。等级A/B/C公开展示。', time: '2-4周', cost: 'RM200-500' },
        { name: '消防证书', dept: '消防与救援局 (Bomba)', detail: '所有餐饮场所必需。某些设置可能需要厨房灭火系统。', time: '2-4周', cost: 'RM500-2千' },
        { name: '招牌许可证', dept: 'PBT', detail: '餐厅招牌的单独许可证。尺寸、位置和照明由地方议会管理。', time: '1-2周', cost: 'RM100-500/年' },
      ],
      recommended: [
        { name: '清真认证', dept: 'JAKIM / JAIN', detail: '强烈建议。穆斯林占多数的国家——清真认证显著扩大客户群。', time: '3-6个月', cost: 'RM1千-5千' },
        { name: '酒类许可证（如适用）', dept: 'PBT + 海关', detail: '如供应酒精。仅限非穆斯林多数区域。部分州（吉兰丹、登嘉楼）几乎不可能。', time: '1-3个月', cost: 'RM500-5千/年', warn: '部分州完全禁酒' },
      ],
    },
  },
  setupFactory: {
    en: {
      verdict: 'maybe',
      verdictText: 'Foreign companies CAN set up factories in Malaysia — it\'s actively encouraged by MIDA. But the licensing process involves 8+ departments.',
      cnTrap: 'In China, factory setup in industrial zones (工业园区) is streamlined with government support. In Malaysia, you must separately approach MIDA, DOE, DOSH, PBT, Bomba, TNB, Imigresen, and SSM. There is NO single-window service. Hire a local compliance consultant.',
      summary: { licenses: '8 required + 2 recommended', time: '6-18 months', cost: 'RM100K-500K+ (setup compliance)' },
      required: [
        { name: 'MIDA Manufacturing License', dept: 'MIDA', detail: 'Required if capital ≥RM2.5M or ≥75 workers. Apply via InvestMalaysia portal. Can unlock Pioneer Status (tax holiday) or ITA.', time: '2-4 months', cost: 'Free to apply' },
        { name: 'SSM Company Registration', dept: 'SSM', detail: 'Register Malaysian entity (Sdn Bhd). Foreign ownership: up to 100% allowed in manufacturing (most sectors).', time: '2-4 weeks', cost: 'RM1K-5K' },
        { name: 'DOE Environmental License', dept: 'Jabatan Alam Sekitar', detail: 'EIA for prescribed activities. Written approval (WA) for non-prescribed. Scheduled waste registration if applicable.', time: '3-6 months', cost: 'RM10K-100K' },
        { name: 'Factory & Machinery Registration', dept: 'DOSH', detail: 'Register under FMA 1967. Certificate of Fitness for pressure vessels, hoists, cranes. OSHA compliance.', time: '1-3 months', cost: 'RM2K-10K' },
        { name: 'PBT Business License', dept: 'Majlis Perbandaran', detail: 'Business premise license. Factory must be in properly zoned industrial land.', time: '2-4 weeks', cost: 'RM500-5K/year' },
        { name: 'Fire Certificate', dept: 'Bomba', detail: 'Fire cert required. Factories storing chemicals need additional hazmat compliance.', time: '2-6 weeks', cost: 'RM1K-5K' },
        { name: 'TNB Industrial Power', dept: 'TNB (Tenaga Nasional)', detail: '3-phase industrial power application. High deposit required. May need substation for large factories.', time: '3-6 months', cost: 'RM50K-500K (deposit + installation)', warn: 'Long wait — apply FIRST' },
        { name: 'Foreign Worker Permits', dept: 'Imigresen + MOHR', detail: 'FWCMS application. Quota depends on sector and factory size. Workers housing compliance (Act 446) mandatory.', time: '2-6 months', cost: 'RM1.8K-2.5K/worker/year' },
      ],
      recommended: [
        { name: 'Environmental Liability Insurance', dept: 'Licensed insurer', detail: 'Landlord AND tenant are liable under EQA 1974. Covers cleanup costs, fines, third-party claims.', cost: 'RM5K-20K/year' },
        { name: 'Customs/FTZ Registration', dept: 'Royal Malaysian Customs', detail: 'If in Free Trade Zone or Licensed Manufacturing Warehouse. Tax exemptions on raw materials and machinery imports.', time: '1-3 months', cost: 'RM2K-10K' },
      ],
    },
    bm: {
      verdict: 'maybe',
      verdictText: 'Syarikat asing BOLEH tubuhkan kilang di Malaysia — digalakkan oleh MIDA. Tetapi melibatkan 8+ jabatan.',
      cnTrap: 'Di China, penubuhan kilang di zon perindustrian dipermudahkan. Di Malaysia, perlu mohon secara berasingan ke MIDA, JAS, JKKP, PBT, Bomba, TNB, Imigresen, dan SSM. TIADA kaunter sehenti.',
      summary: { licenses: '8 wajib + 2 disyorkan', time: '6-18 bulan', cost: 'RM100K-500K+' },
      required: [
        { name: 'Lesen Pembuatan MIDA', dept: 'MIDA', detail: 'Diperlukan jika modal ≥RM2.5J atau ≥75 pekerja. Mohon melalui InvestMalaysia.', time: '2-4 bulan', cost: 'Percuma' },
        { name: 'Pendaftaran Syarikat SSM', dept: 'SSM', detail: 'Daftar Sdn Bhd. Pemilikan asing sehingga 100% dibenarkan dalam pembuatan.', time: '2-4 minggu', cost: 'RM1K-5K' },
        { name: 'Lesen Alam Sekitar DOE', dept: 'JAS', detail: 'EIA untuk aktiviti yang ditetapkan. Pendaftaran sisa berjadual jika berkenaan.', time: '3-6 bulan', cost: 'RM10K-100K' },
        { name: 'Pendaftaran Kilang & Jentera', dept: 'JKKP', detail: 'Daftar di bawah AKJ 1967. Sijil Kesesuaian untuk vesel tekanan, kren.', time: '1-3 bulan', cost: 'RM2K-10K' },
        { name: 'Lesen Perniagaan PBT', dept: 'Majlis Perbandaran', detail: 'Kilang mesti di tanah perindustrian yang dizonkan.', time: '2-4 minggu', cost: 'RM500-5K/tahun' },
        { name: 'Sijil Bomba', dept: 'Bomba', detail: 'Kilang simpan bahan kimia perlu pematuhan hazmat tambahan.', time: '2-6 minggu', cost: 'RM1K-5K' },
        { name: 'Kuasa Industri TNB', dept: 'TNB', detail: 'Permohonan kuasa 3 fasa. Deposit tinggi. Mungkin perlu pencawang.', time: '3-6 bulan', cost: 'RM50K-500K', warn: 'Lama — mohon DULU' },
        { name: 'Permit Pekerja Asing', dept: 'Imigresen + MOHR', detail: 'Permohonan FWCMS. Pematuhan perumahan (Akta 446) wajib.', time: '2-6 bulan', cost: 'RM1.8K-2.5K/pekerja/tahun' },
      ],
      recommended: [
        { name: 'Insurans Liabiliti Alam Sekitar', dept: 'Penanggung insurans', detail: 'Tuan rumah DAN penyewa bertanggungjawab di bawah AKS 1974.', cost: 'RM5K-20K/tahun' },
        { name: 'Pendaftaran Kastam/ZPB', dept: 'Kastam DiRaja Malaysia', detail: 'Jika dalam Zon Perdagangan Bebas. Pengecualian cukai bahan mentah.', time: '1-3 bulan', cost: 'RM2K-10K' },
      ],
    },
    zh: {
      verdict: 'maybe',
      verdictText: '外国公司可以在马来西亚建厂——MIDA积极鼓励。但许可流程涉及8个以上部门。',
      cnTrap: '在中国，工业园区建厂流程精简且有政府支持。在马来西亚，需要分别向MIDA、环境局、DOSH、PBT、消防局、TNB、移民局和SSM申请。没有一站式服务。建议聘请本地合规顾问。',
      summary: { licenses: '8项必需 + 2项建议', time: '6-18个月', cost: 'RM10万-50万+（合规设置）' },
      required: [
        { name: 'MIDA制造业许可证', dept: 'MIDA', detail: '资本≥RM250万或≥75名工人时需要。通过InvestMalaysia门户申请。可享先锋地位税收优惠。', time: '2-4个月', cost: '免费申请' },
        { name: 'SSM公司注册', dept: 'SSM', detail: '注册马来西亚实体（Sdn Bhd）。制造业允许外资100%持股（大多数行业）。', time: '2-4周', cost: 'RM1千-5千' },
        { name: 'DOE环境许可证', dept: '环境局', detail: '规定活动需EIA。非规定活动需书面批准。危险废物需另行注册。', time: '3-6个月', cost: 'RM1万-10万' },
        { name: '工厂与机械注册', dept: 'DOSH', detail: '根据《1967年工厂与机械法》注册。压力容器、起重机需适用证书。', time: '1-3个月', cost: 'RM2千-1万' },
        { name: 'PBT营业执照', dept: '市议会', detail: '工厂必须在正确分区的工业用地上。', time: '2-4周', cost: 'RM500-5千/年' },
        { name: '消防证书', dept: '消防局', detail: '存储化学品的工厂需额外危险品合规。', time: '2-6周', cost: 'RM1千-5千' },
        { name: 'TNB工业电力', dept: 'TNB（国家能源）', detail: '三相工业电力申请。高额押金。大型工厂可能需要变电站。', time: '3-6个月', cost: 'RM5万-50万（押金+安装）', warn: '耗时长——优先申请' },
        { name: '外劳许可证', dept: '移民局 + 人力资源部', detail: 'FWCMS申请。配额取决于行业和工厂规模。工人住房合规（第446号法令）强制执行。', time: '2-6个月', cost: 'RM1.8千-2.5千/工人/年' },
      ],
      recommended: [
        { name: '环境责任保险', dept: '持牌保险公司', detail: '《1974年环境质量法》规定房东和租户双方均有责任。', cost: 'RM5千-2万/年' },
        { name: '海关/自贸区注册', dept: '皇家海关', detail: '若在自由贸易区或许可制造仓库内。原材料和机械进口免税。', time: '1-3个月', cost: 'RM2千-1万' },
      ],
    },
  },
};

function LegalBridge({ lang, onClose }) {
  const t = L[lang];
  const [goal, setGoal] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (idx) => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  const goals = [
    { section: t.bridgeRent, items: [
      { id: 'rentHouse', icon: '🏠', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', title: t.bridgeRentHouse, desc: t.bridgeRentHouseDesc },
      { id: 'rentOffice', icon: '🏢', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', title: t.bridgeRentOffice, desc: t.bridgeRentOfficeDesc },
      { id: 'rentFactory', icon: '🏭', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', title: t.bridgeRentFactory, desc: t.bridgeRentFactoryDesc },
    ]},
    { section: t.bridgeBuy, items: [
      { id: 'buyHouse', icon: '🏡', gradient: 'linear-gradient(135deg, #16a34a, #4ade80)', title: t.bridgeBuyHouse, desc: t.bridgeBuyHouseDesc },
      { id: 'buyLand', icon: '🌍', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', title: t.bridgeBuyLand, desc: t.bridgeBuyLandDesc },
    ]},
    { section: t.bridgeOperate, items: [
      { id: 'openFnb', icon: '🍜', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', title: t.bridgeOpenFnb, desc: t.bridgeOpenFnbDesc },
      { id: 'setupFactory', icon: '⚙️', gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)', title: t.bridgeSetupFactory, desc: t.bridgeSetupFactoryDesc },
    ]},
  ];

  // SCREEN 1: Goal picker
  if (!goal) {
    return (
      <Modal>
        <ToolHeader icon="⚖️" title={t.bridgeTitle} desc={t.bridgeDesc} onClose={onClose} />
        <p className="text-[13px] font-medium mb-1" style={{ color: '#334155' }}>{t.bridgePick}</p>
        <p className="text-[11px] mb-4" style={{ color: '#94a3b8' }}>{t.bridgePickSub}</p>
        {goals.map((group, gi) => (
          <div key={gi}>
            <div className="text-[10px] font-bold uppercase tracking-widest mt-4 mb-2" style={{ color: '#94a3b8' }}>{group.section}</div>
            {group.items.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)}
                className="w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-[14px] bg-white card-hover mb-2"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(15,23,42,0.03)' }}>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: g.gradient }}>
                  <span className="text-lg">{g.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold" style={{ color: '#1e293b' }}>{g.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>{g.desc}</div>
                </div>
                <span style={{ color: '#cbd5e1', fontSize: 14 }}>›</span>
              </button>
            ))}
          </div>
        ))}
        <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <span className="text-[9px]" style={{ color: '#94a3b8' }}>{t.bridgeNote}</span>
        </div>
      </Modal>
    );
  }

  // SCREEN 2: Compliance Roadmap
  const data = COMPLIANCE_GOALS[goal]?.[lang];
  if (!data) { setGoal(null); return null; }

  const verdictColor = data.verdict === 'yes' ? { bg: '#f0fdf4', border: '#bbf7d0', label: '#15803d', text: '#166534' }
    : data.verdict === 'no' ? { bg: '#fef2f2', border: '#fecaca', label: '#dc2626', text: '#991b1b' }
    : { bg: '#fffbeb', border: '#fde68a', label: '#92400e', text: '#78350f' };
  const verdictLabel = data.verdict === 'yes' ? t.bridgeVerdictYes : data.verdict === 'no' ? t.bridgeVerdictNo : t.bridgeVerdictMaybe;

  const downloadChecklist = () => {
    let text = `${t.bridgeTitle} — Compliance Checklist\n${'='.repeat(50)}\n\n`;
    text += `${verdictLabel}\n${data.verdictText}\n\n`;
    text += `--- ${t.bridgeRequired} ---\n`;
    data.required.forEach((item, i) => {
      text += `\n${i + 1}. ${item.name}\n   ${t.bridgeDept}: ${item.dept}\n   ${item.detail}\n`;
      if (item.time) text += `   ${t.bridgeTimeline}: ${item.time}\n`;
      if (item.cost) text += `   ${t.bridgeCost}: ${item.cost}\n`;
      if (item.warn) text += `   ⚠️ ${item.warn}\n`;
    });
    if (data.recommended?.length) {
      text += `\n--- ${t.bridgeRecommended} ---\n`;
      data.recommended.forEach((item, i) => {
        text += `\n${data.required.length + i + 1}. ${item.name}\n   ${t.bridgeDept}: ${item.dept}\n   ${item.detail}\n`;
        if (item.time) text += `   ${t.bridgeTimeline}: ${item.time}\n`;
        if (item.cost) text += `   ${t.bridgeCost}: ${item.cost}\n`;
      });
    }
    text += `\n--- Summary ---\n${t.bridgeTotalLicenses}: ${data.summary.licenses}\n${t.bridgeTotalTime}: ${data.summary.time}\n${t.bridgeTotalCost}: ${data.summary.cost}\n`;
    text += `\n${t.bridgeNote}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `find-ai-compliance-checklist.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal>
      <ToolHeader icon="⚖️" title={t.bridgeTitle} desc={t.bridgeDesc} onClose={() => setGoal(null)} />

      {/* Verdict */}
      <div className="rounded-[14px] p-4 mb-3" style={{ background: verdictColor.bg, border: `1px solid ${verdictColor.border}` }}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: verdictColor.label }}>
          {data.verdict === 'maybe' ? '⚠️' : data.verdict === 'yes' ? '✅' : '🚫'} {verdictLabel}
        </div>
        <p className="text-[12px] font-semibold leading-relaxed" style={{ color: verdictColor.text }}>{data.verdictText}</p>
      </div>

      {/* China Trap */}
      <div className="rounded-[14px] p-3.5 mb-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
        <div className="text-[10px] font-bold mb-1 flex items-center gap-1" style={{ color: '#991b1b' }}>🇨🇳 {t.bridgeCNTrap}</div>
        <p className="text-[11px] leading-relaxed" style={{ color: '#7f1d1d' }}>{data.cnTrap}</p>
      </div>

      {/* Required */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: '#dc2626', color: 'white' }}>{t.bridgeRequired}</span>
          <span className="text-[11px] font-semibold" style={{ color: '#334155' }}>{t.bridgeRequiredSub}</span>
        </div>
        {data.required.map((item, idx) => (
          <div key={idx} className="rounded-[10px] mb-1.5 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
            <button onClick={() => toggleExpand(`r${idx}`)} className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left" style={{ background: expanded[`r${idx}`] ? '#f8fafc' : 'white' }}>
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{idx + 1}</span>
              <div className="flex-1">
                <div className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>{item.name}</div>
                <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#3b82f6' }}>→ {item.dept}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ transform: expanded[`r${idx}`] ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0, marginTop: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {expanded[`r${idx}`] && (
              <div className="px-3 pb-3 fade-in">
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#475569' }}>{item.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.time && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#f1f5f9', color: '#475569' }}>⏱ {item.time}</span>}
                  {item.cost && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#eff6ff', color: '#2563eb' }}>💰 {item.cost}</span>}
                  {item.warn && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️ {item.warn}</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommended */}
      {data.recommended?.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: '#f59e0b', color: 'white' }}>{t.bridgeRecommended}</span>
            <span className="text-[11px] font-semibold" style={{ color: '#334155' }}>{t.bridgeRecommendedSub}</span>
          </div>
          {data.recommended.map((item, idx) => (
            <div key={idx} className="rounded-[10px] mb-1.5 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
              <button onClick={() => toggleExpand(`c${idx}`)} className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left" style={{ background: expanded[`c${idx}`] ? '#f8fafc' : 'white' }}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}>{data.required.length + idx + 1}</span>
                <div className="flex-1">
                  <div className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>{item.name}</div>
                  <div className="text-[10px] mt-0.5 font-medium" style={{ color: '#3b82f6' }}>→ {item.dept}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ transform: expanded[`c${idx}`] ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0, marginTop: 4 }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {expanded[`c${idx}`] && (
                <div className="px-3 pb-3 fade-in">
                  <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#475569' }}>{item.detail}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.time && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#f1f5f9', color: '#475569' }}>⏱ {item.time}</span>}
                    {item.cost && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#eff6ff', color: '#2563eb' }}>💰 {item.cost}</span>}
                    {item.warn && <span className="text-[9px] font-semibold px-2 py-1 rounded" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️ {item.warn}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Timeline (if available) */}
      {data.timeline && (
        <div className="mb-3">
          <div className="text-[11px] font-bold mb-2 flex items-center gap-1" style={{ color: '#334155' }}>📅 {t.bridgeTimeline2}</div>
          {data.timeline.map((item, idx) => (
            <div key={idx} className="flex gap-2.5 mb-0.5">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: idx === data.timeline.length - 1 ? '#16a34a' : idx === 0 ? '#3b82f6' : '#f59e0b' }} />
                {idx < data.timeline.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ background: '#e2e8f0' }} />}
              </div>
              <div className="pb-3">
                <div className="text-[11px] font-semibold" style={{ color: '#1e293b' }}>{item.step}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-[14px] p-4 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div className="flex justify-between mb-1.5"><span className="text-[11px]" style={{ color: '#64748b' }}>{t.bridgeTotalLicenses}</span><span className="text-[11px] font-bold" style={{ color: '#0f172a' }}>{data.summary.licenses}</span></div>
        <div className="flex justify-between mb-1.5"><span className="text-[11px]" style={{ color: '#64748b' }}>{t.bridgeTotalTime}</span><span className="text-[11px] font-bold" style={{ color: '#0f172a' }}>{data.summary.time}</span></div>
        <div className="flex justify-between"><span className="text-[11px]" style={{ color: '#64748b' }}>{t.bridgeTotalCost}</span><span className="text-[13px] font-bold" style={{ color: '#0f172a' }}>{data.summary.cost}</span></div>
      </div>

      {/* Actions */}
      <button onClick={downloadChecklist} className="w-full py-3 rounded-xl text-[12px] font-semibold text-white mb-2" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>📥 {t.bridgeDownload}</button>
      <button onClick={() => { setGoal(null); setExpanded({}); }} className="w-full py-2.5 rounded-xl text-[11px] font-medium" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>← {t.bridgeBack}</button>

      <div className="text-center mt-3"><span className="text-[9px]" style={{ color: '#94a3b8' }}>{t.bridgeNote}</span></div>
    </Modal>
  );
}

export default LegalBridge;
