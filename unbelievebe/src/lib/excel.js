"use client";
import * as XLSX from 'xlsx';

export function downloadXlsx(rows, headers, filename, sheetName = 'Data') {
  const aoa = [headers.map(h => h.label)];
  for (const r of rows) {
    aoa.push(headers.map(h => {
      const v = typeof h.value === 'function' ? h.value(r) : r[h.value];
      if (v === null || v === undefined) return '';
      return v;
    }));
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}
