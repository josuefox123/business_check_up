/**
 * EXPORT TO EXCEL — FUND.lab Admin
 * Converts a 2D array (headers + rows) to a CSV-compatible .csv file
 * (Excel opens CSV natively). No external library needed.
 * Rule 8: No mock/hardcoded data — the caller provides the actual table data.
 */

/**
 * Exports data to a downloadable CSV file that Excel can open.
 * @param {string[][]} rows - 2D array of strings (first row = headers).
 * @param {string} filename - Output filename without extension.
 */
export function exportToExcel(rows, filename = 'export') {
  const BOM = '\uFEFF'; // UTF-8 BOM so Excel correctly decodes accented chars
  const csv = rows
    .map(row =>
      row
        .map(cell => {
          const val = cell == null ? '' : String(cell);
          // Wrap in quotes if contains comma, quote, or newline
          return /[",\n\r]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
        })
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
