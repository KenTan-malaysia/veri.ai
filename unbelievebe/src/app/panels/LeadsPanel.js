"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { downloadXlsx } from '@/lib/excel';

const EMPTY = {
  landlord_name: '', contact_raw: '', project_condo: '', area_state: '',
  property_type: '', rooms: '', furnished: '', available_date: '',
  rental_price_rm: '', selling_price_rm: '', notes: '',
};

export default function LeadsPanel() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  const load = async () => {
    setLoading(true); setError('');
    const { data, error } = await supabase
      .from('landlord_leads').select('*')
      .order('created_at', { ascending: false }).limit(500);
    if (error) setError(error.message);
    else setLeads(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (l) => {
    setForm({
      landlord_name: l.landlord_name || '', contact_raw: l.contact_raw || '',
      project_condo: l.project_condo || '', area_state: l.area_state || '',
      property_type: l.property_type || '', rooms: l.rooms || '',
      furnished: l.furnished || '', available_date: l.available_date || '',
      rental_price_rm: l.rental_price_rm || '', selling_price_rm: l.selling_price_rm || '',
      notes: l.notes || '',
    });
    setEditing(l);
  };

  const save = async () => {
    setSaving(true); setError('');
    const payload = {
      ...form,
      rental_price_rm: form.rental_price_rm ? Number(form.rental_price_rm) : null,
      selling_price_rm: form.selling_price_rm ? Number(form.selling_price_rm) : null,
      available_date: form.available_date || null,
      captured_by: 'manual',
    };
    let err;
    if (editing === 'new') {
      const r = await supabase.from('landlord_leads').insert(payload); err = r.error;
    } else {
      const r = await supabase.from('landlord_leads').update(payload).eq('id', editing.id); err = r.error;
    }
    if (err) setError(err.message);
    else { setEditing(null); await load(); }
    setSaving(false);
  };

  const del = async (l) => {
    if (!confirm(`Delete lead for ${l.landlord_name || 'this landlord'}?`)) return;
    const { error } = await supabase.from('landlord_leads').delete().eq('id', l.id);
    if (error) setError(error.message); else await load();
  };

  const filtered = leads.filter(l => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (l.landlord_name || '').toLowerCase().includes(s)
        || (l.contact_raw || '').toLowerCase().includes(s)
        || (l.project_condo || '').toLowerCase().includes(s)
        || (l.area_state || '').toLowerCase().includes(s);
  });

  const exportXlsx = () => downloadXlsx(
    filtered,
    [
      { label: 'Date Captured',   value: 'date_captured' },
      { label: 'Landlord Name',   value: 'landlord_name' },
      { label: 'Contact',         value: 'contact_raw' },
      { label: 'Project / Condo', value: 'project_condo' },
      { label: 'Area / State',    value: 'area_state' },
      { label: 'Property Type',   value: 'property_type' },
      { label: 'Rooms',           value: 'rooms' },
      { label: 'Furnished',       value: 'furnished' },
      { label: 'Available Date',  value: 'available_date' },
      { label: 'Rental (RM)',     value: 'rental_price_rm' },
      { label: 'Selling (RM)',    value: 'selling_price_rm' },
      { label: 'Remark',          value: 'notes' },
    ],
    `Landlord_Leads_${new Date().toISOString().slice(0,10)}.xlsx`,
    'Lead Capture'
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b"
           style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search leads..."
          className="flex-1 text-[13px] py-2 px-3 rounded-lg focus:outline-none"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
        />
        <button onClick={exportXlsx}
          className="text-[12px] font-medium px-3 py-2 rounded-lg"
          style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          Export
        </button>
        <button onClick={openNew}
          className="text-[12px] font-semibold px-4 py-2 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' }}>
          + New
        </button>
      </div>

      {error && (
        <div className="m-4 p-3 text-[12px] rounded-lg"
             style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>
          {error}
        </div>
      )}

      <div className="p-4 space-y-2 pb-24">
        {loading ? (
          <div className="text-center text-[12px] py-8" style={{ color: 'var(--muted)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[12px] py-12" style={{ color: 'var(--muted)' }}>
            {leads.length === 0 ? 'No leads yet. Tap + New.' : 'No matches.'}
          </div>
        ) : (
          filtered.map((l) => (
            <div key={l.id} className="rounded-[12px] p-3.5 card-hover"
                 style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {l.landlord_name || '(no name)'}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                    {l.contact_raw || '—'} · {l.project_condo || '—'} · {l.area_state || '—'}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {l.property_type && <Pill label={l.property_type} />}
                    {l.rooms && <Pill label={`${l.rooms} rm`} />}
                    {l.furnished && <Pill label={l.furnished} />}
                    {l.rental_price_rm && <Pill label={`RM ${Number(l.rental_price_rm).toLocaleString()}/mo`} accent />}
                    {l.selling_price_rm && <Pill label={`Sell RM ${Number(l.selling_price_rm).toLocaleString()}`} warn />}
                    {l.available_date && <Pill label={`From ${l.available_date}`} cyan />}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(l)} className="text-[11px] px-2 py-1 rounded-md"
                    style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Edit</button>
                  <button onClick={() => del(l)} className="text-[11px] px-2 py-1 rounded-md"
                    style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }}>Del</button>
                </div>
              </div>
            </div>
          ))
        )}
        <div className="text-center text-[10px] pt-2" style={{ color: 'var(--muted)' }}>{filtered.length} of {leads.length}</div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-t-[20px] sm:rounded-[20px] p-5 max-h-[90vh] overflow-y-auto"
               style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {editing === 'new' ? 'New landlord lead' : 'Edit lead'}
              </h3>
              <button onClick={() => setEditing(null)} className="text-xl leading-none" style={{ color: 'var(--muted)' }}>×</button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Landlord name" span={2} value={form.landlord_name} onChange={(v) => setForm({ ...form, landlord_name: v })} />
              <Field label="Contact" span={2} value={form.contact_raw} onChange={(v) => setForm({ ...form, contact_raw: v })} placeholder="012-345 6789" />
              <Field label="Project / Condo" span={2} value={form.project_condo} onChange={(v) => setForm({ ...form, project_condo: v })} />
              <Field label="Area / State" value={form.area_state} onChange={(v) => setForm({ ...form, area_state: v })} />
              <Field label="Property type" value={form.property_type} onChange={(v) => setForm({ ...form, property_type: v })} placeholder="Condo / Landed" />
              <Field label="Rooms" value={form.rooms} onChange={(v) => setForm({ ...form, rooms: v })} />
              <Field label="Furnished" value={form.furnished} onChange={(v) => setForm({ ...form, furnished: v })} />
              <Field label="Available date" type="date" value={form.available_date} onChange={(v) => setForm({ ...form, available_date: v })} />
              <Field label="Rental RM/mo" type="number" value={form.rental_price_rm} onChange={(v) => setForm({ ...form, rental_price_rm: v })} />
              <Field label="Selling RM" type="number" span={2} value={form.selling_price_rm} onChange={(v) => setForm({ ...form, selling_price_rm: v })} />
              <Field label="Notes" span={2} value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
            </div>

            {error && <div className="mt-3 p-2 text-[11px] rounded"
              style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--danger)' }}>{error}</div>}

            <div className="flex gap-2 mt-5">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Cancel</button>
              <button onClick={save} disabled={saving || !form.landlord_name}
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

function Field({ label, value, onChange, type = 'text', placeholder, span = 1 }) {
  return (
    <label className={`block ${span === 2 ? 'col-span-2' : ''}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--muted)' }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 px-2.5 rounded-lg text-[13px] focus:outline-none"
        style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
      />
    </label>
  );
}
