// src/lib/chatFormat.js
// Shared renderer for assistant messages — used by both the full chat page
// (src/app/page.js) and the PeekChat dock (src/components/PeekChat.js) so
// both surfaces render the icon-based callout framework identically.
//
// T15 (2026-04-23) — regex fix: when the model emits a blank line between a
// ✅ title and the numbered steps (common in Chinese/BM responses), the old
// terminator `<br/><br/>` cut the match short and left the steps rendering
// OUTSIDE the green callout. The lookaheads below now tolerate one blank
// line when the next content is a numbered step, dash, bullet, or
// "label: value" row, so list content stays visually contained inside the
// callout's coloured column. Same treatment applied to 💰.

// Format AI output into rich interactive cards
export function fmt(text) {
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

  // T15 — keep numbered list items inside the ✅ callout even when the model
  // emitted a blank line before the list (\n\n1. … → <br/><br/>1. …).
  // Lookahead tolerates an optional blank line when next content is a
  // numbered step, so the green container visually contains its own steps.
  h = h.replace(
    /✅\s*<strong>(.*?)<\/strong>(.*?)(?=<br\/><br\/>(?!(?:\s|<br\/>)*\d+\.)|<br\/>🚫|<br\/>💰|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|$)/gs,
    (_, title, steps) => renderChecklist(title, steps)
  );
  h = h.replace(
    /✅\s*(?!<strong>)(.*?)(?=<br\/><br\/>(?!(?:\s|<br\/>)*\d+\.)|<br\/>🚫|<br\/>💰|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|$)/gs,
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
  // T15 — same blank-line tolerance as ✅: keep numeric / dash / bullet /
  // "label: value" rows inside the yellow callout even if the model
  // inserts a blank line after the title.
  h = h.replace(
    /💰\s*<strong>(.*?)<\/strong>(.*?)(?=<br\/><br\/>(?!(?:\s|<br\/>)*(?:\d+\.|[-•]|[^<]+?:))|<br\/>🚫|<br\/>📋|<br\/>⚠️|<br\/>🔒|<br\/>🔴|<br\/>✅|$)/gs,
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
}

// Default export for convenience in both places.
export default fmt;
