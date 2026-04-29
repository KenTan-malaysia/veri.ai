"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { downloadXlsx } from '@/lib/excel';

const EMPTY = {
  project: '', area_state: '', property_type: '',
  enquiry_date: new Date().toISOString().slice(0, 10),
  move_in_date: '', name: '', contact_raw: '', budget_rm: '',
  furnished: '', rooms: '', remark: '', status: 'open',
};

const STATUS_BG = {
  open:    { bg: 'rgba(61,107,61,0.15)', c: 'var(--success)' },
  matched: { bg: 'rgba(61,107,61,0.15)',  c: 'var(--accent)' },
  closed:  { bg: 'var(--surface-2)',      c: 'var(--muted)' },
};

export default function EnquiriesPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const load = async () => {
    setLoading(true); setError('');
    const { data, error } = await supabase
      .from('tenant_enquiries').select('*')
      .order('enquiry_date', { ascending: false }).limit(500);
    if (error) setError(error.message);
    else setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (r) => {
    setForm({
      project: r.project || '', area_state: r.area_state || '',
      property_type: r.property_type || '',
      enquiry_date: r.enquiry_date || new Date().toISOString().slice(0,10),
      move_in_date: r.move_in_date || '', name: r.name || '',
      contact_raw: r.contact_raw || '', budget_rm: r.budget_rm || '',
      furnished: r.furnished || '', rooms: r.rooms || '',
      remark: r.remark || '', status: r.status || 'open',
    });
    setEditing(r);
  };

  const save = async () => {
    setSaving(true); setError('');
    const payload = {
      ...form,
      budget_rm: form.budget_rm ? Number(form.budget_rm) : null,
      move_in_date: form.move_in_date || null,
      enquiry_date: form.enquiry_date || null,
    };
    let err;
    if (editing === 'new') {
      const { data: { user } } = await supabase.auth.getUser();
      const r = await supabase.from('tenant_enquiries').insert({ ...payload, created_by: user?.id || null });
      err = r.error;
    } else {
      const r = await supabase.from('tenant_enquiries').update(payload).eq('id', editing.id);
      err = r.error;
    }
    if (err) setError(err.message);
    else { setEditing(null); await load(); }
    setSaving(false);
  };

  const del = async (r) => {
    if (!confirm(`Delete enquiry from ${r.name || 'this tenant'}?`)) return;
    const { error } = await supabase.from('tenant_enquiries').delete().eq('id', r.id);
    if (error) setError(error.message); else await load();
  };

  const setStatus = async (r, status) => {
    const { error } = await supabase.from('tenant_enquiries').update({ status }).eq('id', r.id);
    if (error) setError(error.message); else await load();
  };

  const filtered = items.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return (r.name || '').toLowerCase().includes(s)
        || (r.contact_raw || '').toLowerCase().includes(s)
        || (r.project || '').toLowerCase().includes(s)
        || (r.area_state || '').toLowerCase().includes(s);
  });

  const exportXlsx = () => downloadXlsx(
    filtered,
    [
      { label: 'Project', value: 'project' }, { label: 'Area / State', value: 'area_state' },
      { label: 'Property Type', value: 'property_type' }, { label: 'Enquiry Date', value: 'enquiry_date' },
      { label: 'Move-in Date', value: 'move_in_date' }, { label: 'Name', value: 'name' },
      { label: 'Contact', value: 'contact_raw' }, { label: 'Budget (RM)', value: 'budget_rm' },
      { label: 'Furnished', value: 'furnished' }, { label: 'Rooms', value: 'rooms' },
      { label: 'Status', value: 'status' }, { label: 'Remark', value: 'remark' },
    ],
    `Tenant_Enquiries_${new Date().toISOString().slice(0,10)}.xlsx`, 'Tenant Enquiry'
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search enquiries..."
          className="flex-1 text-[13px] py-2 px-3 rounded-lg focus:outline-none"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="text-[12px] py-2 px-2 rounded-lg"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="matched">Matched</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={exportXlsx} className="text-[12px] font-medium px-3 py-2 rounded-lg"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>Export</button>
        <button onClick={openNew} className="text-[12px] font-semibold px-4 py-2 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>+ New</button>
      </div>

      {error && <div className="m-4 p-3 text-[12px] rounded-lg"
        style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>{error}</div>}

      <div className="p-4 space-y-2 pb-24">
        {loading ? (
          <div className="text-center text-[12px] py-8" style={{ color: 'var(--muted)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[12px] py-12" style={{ color: 'var(--muted)' }}>
            {items.length === 0 ? 'No tenant enquiries yet. Tap + New.' : 'No matches.'}
          </div>
        ) : (
          filtered.map((r) => {
            const st = STATUS_BG[r.status] || STATUS_BG.open;
            return (
              <div key={r.id} className="rounded-[12px] p-3.5 card-hover"
                   style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                        {r.name || '(no name)'}
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                        style={{ background: st.bg, color: st.c }}>{r.status}</span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      {r.contact_raw || '—'} · {r.project || '—'} · {r.area_state || '—'}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.property_type && <Pill label={r.property_type} />}
                      {r.rooms && <Pill label={`${r.rooms} rm`} />}
                      {r.furnished && <Pill label={r.furnished} />}
                      {r.budget_rm && <Pill label={`Budget RM ${Number(r.budget_rm).toLocaleString()}`} accent />}
                      {r.move_in_date && <Pill label={`Move in ${r.move_in_date}`} cyan />}
                    </div>
                    {r.remark && <div className="text-[11px] mt-2 line-clamp-2" style={{ color: 'var(--muted)' }}>{r.remark}</div>}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <select value={r.status} onChange={(e) => setStatus(r, e.target.value)}
                      className="text-[10px] py-1 px-1.5 rounded"
                      style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                      <option value="open">Open</option><option value="matched">Matched</option><option value="closed">Closed</option>
                    </select>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(r)} className="text-[11px] px-2 py-1 rounded-md"
                        style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Edit</button>
                      <button onClick={() => del(r)} className="text-[11px] px-2 py-1 rounded-md"
                        style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>Del</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div className="text-center text-[10px] pt-2" style={{ color: 'var(--muted)' }}>{filtered.length} of {items.length}</div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-t-[20px] sm:rounded-[20px] p-5 max-h-[90vh] overflow-y-auto"
               style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {editing === 'new' ? 'New tenant enquiry' : 'Edit enquiry'}
              </h3>
              <button onClick={() => setEditing(null)} className="text-xl leading-none" style={{ color: 'var(--muted)' }}>×</button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <F label="Name *" span={2} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <F label="Contact" span={2} value={form.contact_raw} onChange={(v) => setForm({ ...form, contact_raw: v })} />
              <F label="Project wanted" span={2} value={form.project} onChange={(v) => setForm({ ...form, project: v })} />
              <F label="Area / State" value={form.area_state} onChange={(v) => setForm({ ...form, area_state: v })} />
              <F label="Property type" value={form.property_type} onChange={(v) => setForm({ ...form, property_type: v })} />
              <F label="Budget RM/mo" type="number" value={form.budget_rm} onChange={(v) => setForm({ ...form, budget_rm: v })} />
              <F label="Rooms" value={form.rooms} onChange={(v) => setForm({ ...form, rooms: v })} />
              <F label="Furnished" span={2} value={form.furnished} onChange={(v) => setForm({ ...form, furnished: v })} />
              <F label="Enquiry date" type="date" value={form.enquiry_date} onChange={(v) => setForm({ ...form, enquiry_date: v })} />
              <F label="Move-in date" type="date" value={form.move_in_date} onChange={(v) => setForm({ ...form, move_in_date: v })} />
              <div className="col-span-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--muted)' }}>Remark</span>
                <textarea rows={3} value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="w-full py-2 px-2.5 rounded-lg text-[13px] resize-none focus:outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}/>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--muted)' }}>Status</span>
                <div className="flex gap-2">
                  {['open','matched','closed'].map(s => (
                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                      className="flex-1 py-2 rounded-lg text-[12px] font-medium"
                      style={form.status===s
                        ? { background: 'rgba(255,126,95,0.15)', color: 'var(--primary)', border: '1px solid rgba(255,126,95,0.4)' }
                        : { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <div className="mt-3 p-2 text-[11px] rounded"
              style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--danger)' }}>{error}</div>}

            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Cancel</button>
              <button onClick={save} disabled={saving || !form.name}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ label, accent, warn, cyan }) {
  const style = accent
    ? { background: 'rgba(255,126,95,0.12)', color: 'var(--primary)', border: '1px solid rgba(255,126,95,0.3)' }
    : warn
    ? { background: 'rgba(251,191,36,0.12)', color: 'var(--warning)', border: '1px solid rgba(251,191,36,0.3)' }
    : cyan
    ? { background: 'rgba(61,107,61,0.12)', color: 'var(--accent)', border: '1px solid rgba(61,107,61,0.3)' }
    : { background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' };
  return <span className="text-[10px] px-2 py-0.5 rounded-full" style={style}>{label}</span>;
}

function F({ label, value, onChange, type = 'text', placeholder, span = 1 }) {
  return (
    <label className={`block ${span === 2 ? 'col-span-2' : ''}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--muted)' }}>{label}</span>
      <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full py-2 px-2.5 rounded-lg text-[13px] focus:outline-none"
        style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }} />
    </label>
  );
}
