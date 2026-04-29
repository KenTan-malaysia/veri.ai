'use client';

import { useState } from 'react';
import { Modal, ToolHeader, RMInput, ActionBtn, CloseBtn } from './shared';
import { L } from './labels';

export default function EvidenceVault({ lang, onClose }) {
  const t = L[lang];
  const [photos, setPhotos] = useState([]);
  const [property, setProperty] = useState({ address: '', unit: '', type: '' });
  const [processing, setProcessing] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const hashFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setProcessing(true);
    const newPhotos = [];
    for (const file of files) {
      const hash = await hashFile(file);
      const timestamp = new Date().toISOString();
      const preview = URL.createObjectURL(file);
      newPhotos.push({ name: file.name, size: file.size, hash, timestamp, preview, type: file.type });
    }
    setPhotos(prev => [...prev, ...newPhotos]);
    setProcessing(false);
  };

  const removePhoto = (idx) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
    setCertificate(null);
  };

  const generateCertificate = () => {
    if (!photos.length || !property.address) return;
    const certData = {
      id: 'CERT-' + Date.now().toString(36).toUpperCase(),
      generatedAt: new Date().toISOString(),
      property: { ...property },
      photos: photos.map(p => ({ name: p.name, hash: p.hash, timestamp: p.timestamp, size: p.size })),
      totalPhotos: photos.length,
    };
    setCertificate(certData);
  };

  const downloadCertificate = () => {
    if (!certificate) return;
    const d = certificate;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Section 90A Certificate - ${d.id}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px}
.header h1{font-size:22px;letter-spacing:1px;margin-bottom:5px}.header h2{font-size:14px;color:#555;font-weight:normal}
.badge{display:inline-block;padding:4px 16px;border:2px solid #b45309;color:#b45309;font-size:11px;font-weight:bold;letter-spacing:2px;margin-top:10px;border-radius:3px}
.section{margin-bottom:25px}.section h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#555;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
.field{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.field .label{color:#777}.field .value{font-weight:bold;text-align:right;max-width:60%;word-break:break-all}
.photo-table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
.photo-table th{background:#f5f5f5;padding:8px;text-align:left;border:1px solid #ddd;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
.photo-table td{padding:8px;border:1px solid #ddd;font-family:monospace;font-size:11px;word-break:break-all}
.legal{background:#fefce8;border:1px solid #fde68a;border-radius:6px;padding:16px;margin-top:30px;font-size:12px}
.legal h3{color:#92400e;margin-bottom:8px;font-size:13px}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999}
@media print{body{padding:20px}.legal{break-inside:avoid}}</style></head>
<body>
<div class="header"><h1>CERTIFICATE OF AUTHENTICITY</h1><h2>Digital Evidence — Property Inventory Record</h2><div class="badge">SECTION 90A COMPLIANT</div></div>
<div class="section"><h3>Certificate Details</h3>
<div class="field"><span class="label">Certificate ID</span><span class="value">${d.id}</span></div>
<div class="field"><span class="label">Generated</span><span class="value">${new Date(d.generatedAt).toLocaleString('en-MY')}</span></div>
<div class="field"><span class="label">Total Evidence Items</span><span class="value">${d.totalPhotos}</span></div>
<div class="field"><span class="label">Hash Algorithm</span><span class="value">SHA-256</span></div></div>
<div class="section"><h3>Property Information</h3>
<div class="field"><span class="label">Address</span><span class="value">${d.property.address}</span></div>
${d.property.unit ? `<div class="field"><span class="label">Unit</span><span class="value">${d.property.unit}</span></div>` : ''}
${d.property.type ? `<div class="field"><span class="label">Type</span><span class="value">${d.property.type}</span></div>` : ''}</div>
<div class="section"><h3>Evidence Registry</h3>
<table class="photo-table"><thead><tr><th>#</th><th>File Name</th><th>SHA-256 Hash</th><th>Timestamp (UTC)</th><th>Size</th></tr></thead>
<tbody>${d.photos.map((p, i) => `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.hash}</td><td>${p.timestamp}</td><td>${(p.size / 1024).toFixed(1)} KB</td></tr>`).join('')}</tbody></table></div>
<div class="legal"><h3>Legal Notice — Evidence Act 1950, Section 90A</h3>
<p>This certificate is produced in compliance with Section 90A of the Evidence Act 1950 (Malaysia). Each digital photograph listed above has been individually processed through the SHA-256 cryptographic hash algorithm at the time of upload. The hash value serves as a unique digital fingerprint — any modification to the original file, however minor, will produce a different hash value, thereby proving tampering.</p>
<p style="margin-top:8px">This document is intended to accompany the original digital photographs as supporting evidence of their authenticity and integrity in any legal proceedings, tribunal hearing, or dispute resolution process in Malaysia.</p>
<p style="margin-top:8px"><strong>Important:</strong> This certificate must be presented together with the original unmodified digital photographs. The party relying on this evidence should retain the original files in unmodified form.</p></div>
<div class="footer"><p>Generated by Veri.ai — Malaysian PropTech Compliance Platform</p><p>This is a computer-generated document. No signature is required.</p></div>
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Section90A-Certificate-${d.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal>
      <ToolHeader icon="🔒" title={t.vaultTitle} desc={t.vaultDesc} onClose={onClose} />

      {/* Property details */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.vaultAddress}</label>
          <input type="text" value={property.address} onChange={(e) => { setProperty(p => ({ ...p, address: e.target.value })); setCertificate(null); }}
            placeholder={t.vaultAddressHint} className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.vaultUnit}</label>
            <input type="text" value={property.unit} onChange={(e) => { setProperty(p => ({ ...p, unit: e.target.value })); setCertificate(null); }}
              placeholder="A-12-03" className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.vaultType}</label>
            <select value={property.type} onChange={(e) => { setProperty(p => ({ ...p, type: e.target.value })); setCertificate(null); }}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400 bg-white">
              <option value="">{t.vaultSelectType}</option>
              <option value="Check-in">{t.vaultCheckIn}</option>
              <option value="Check-out">{t.vaultCheckOut}</option>
              <option value="Damage Report">{t.vaultDamage}</option>
              <option value="General">{t.vaultGeneral}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Photo upload */}
      <div className="mb-4">
        <label className="w-full flex flex-col items-center gap-2.5 py-8 rounded-[14px] border-2 border-dashed border-sky-200 bg-sky-50 cursor-pointer hover:bg-sky-100 active:bg-sky-150 transition">
          <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <span className="text-[14px] font-semibold text-sky-700">{t.vaultUpload}</span>
          <span className="text-[11px] text-sky-500 text-center px-4 leading-relaxed">{t.vaultUploadHint}</span>
          <input type="file" accept="image/*" multiple capture="environment" onChange={handlePhotos} className="hidden" />
        </label>
      </div>

      {processing && (
        <div className="text-center py-3">
          <div className="inline-block w-5 h-5 border-2 border-sky-300 border-t-sky-600 rounded-full animate-spin" />
          <p className="text-[11px] text-gray-500 mt-2">{t.vaultHashing}</p>
        </div>
      )}

      {/* Photo list */}
      {photos.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{t.vaultPhotos} ({photos.length})</div>
          {photos.map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <img src={p.preview} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-gray-800 truncate">{p.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[10px] text-green-600 font-medium">{t.vaultVerified}</span>
                </div>
                <div className="text-[10px] text-gray-400">{new Date(p.timestamp).toLocaleString()}</div>
              </div>
              <button onClick={() => removePhoto(i)} className="text-gray-300 hover:text-red-500 p-1 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Generate certificate */}
      <div className="mb-2">
        <ActionBtn onClick={generateCertificate} disabled={!photos.length || !property.address} label={t.vaultGenerate} />
      </div>

      {/* Certificate result */}
      {certificate && (
        <div className="mt-3 space-y-3 fade-in">
          <div className="p-4 rounded-[14px] bg-green-50 border border-green-200 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="text-[15px] font-bold text-green-800 mb-1">{t.vaultVerified}</div>
            <div className="text-[12px] text-green-700 mb-3">{certificate.totalPhotos} {t.vaultPhotos.toLowerCase()}</div>
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">{t.vaultCertId}: {certificate.id}</span>
            </div>
          </div>

          <button onClick={downloadCertificate}
            className="w-full py-3 rounded-xl text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t.vaultDownload}
          </button>

          <div className="p-3 rounded-[12px] bg-amber-50 border border-amber-100">
            <p className="text-[11px] text-amber-800">{t.vaultLegalNote}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
