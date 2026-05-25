import type { Faculty, Class, AppData } from '../types';
import { days, timeSlots } from '../constants/scheduleConstants';

export function exportClassDocx(classId: string, data: AppData): void {
  const cls = data.classes.find((c) => c.id === classId);
  if (!cls || !data.schedule[cls.id])
    return alert('No schedule found for this class.');
  const html = buildClassScheduleHTML(cls, data);
  downloadDoc(html, `Schedule_${cls.name.replace(/[^a-zA-Z0-9]/g, '_')}.doc`);
}

export function exportAllDocx(data: AppData): void {
  if (!Object.keys(data.schedule).length)
    return alert('No schedules have been generated yet.');
  data.classes.forEach((cls) => {
    if (data.schedule[cls.id]) exportClassDocx(cls.id, data);
  });
}

export function exportFacultyDocx(facultyId: string, data: AppData): void {
  const faculty = data.faculty.find((f) => f.id === facultyId);
  if (!faculty) return alert('Faculty not found.');
  if (!Object.keys(data.schedule).length)
    return alert('No schedules have been generated yet.');
  const html = buildFacultyScheduleHTML(faculty, data);
  downloadDoc(
    html,
    `Faculty_Schedule_${faculty.name.replace(/[^a-zA-Z0-9]/g, '_')}.doc`
  );
}

export function exportAllFacultyDocx(data: AppData): void {
  if (!Object.keys(data.schedule).length)
    return alert('No schedules have been generated yet.');
  if (!data.faculty.length) return alert('No faculty members found.');
  data.faculty.forEach((f) => exportFacultyDocx(f.id, data));
}

function buildClassScheduleHTML(cls: Class, data: AppData): string {
  const adviser = data.faculty.find((f) => f.id === cls.adviserId);

  let rows = `<tr>
    <th style="background:#1A3D6B;color:#fff;padding:8px 10px;border:1px solid #1A3D6B;font-size:11pt;">TIME</th>
    ${days.map((d) => `<th style="background:#1A3D6B;color:#fff;padding:8px 10px;border:1px solid #1A3D6B;font-size:11pt;">${d.toUpperCase()}</th>`).join('')}
  </tr>`;

  timeSlots.forEach((slot) => {
    if (slot.period === 'break') {
      rows += `<tr>
        <td style="background:#FEF9C3;color:#92400E;font-weight:bold;padding:6px 10px;border:1px solid #AACFEE;font-size:10pt;">${slot.time}</td>
        <td colspan="5" style="background:#FEF9C3;color:#92400E;font-weight:bold;text-align:center;padding:6px;border:1px solid #AACFEE;font-size:10pt;">BREAK / RECESS</td>
      </tr>`;
      return;
    }

    rows += `<tr><td style="background:#EBF4FF;color:#1A3D6B;font-weight:bold;padding:6px 10px;border:1px solid #AACFEE;font-size:10pt;white-space:nowrap;">${slot.time}</td>`;

    days.forEach((day) => {
      const entry = data.schedule[cls.id]?.[day]?.[slot.time];
      if (!entry) { rows += `<td style="border:1px solid #AACFEE;padding:6px;"></td>`; return; }
      if (entry.isVacancy) {
        rows += `<td style="background:#FEE2E2;border:1px solid #AACFEE;padding:6px;text-align:center;color:#DC2626;font-weight:bold;font-style:italic;font-size:9pt;">VACANCY</td>`;
        return;
      }
      const subject = data.subjects.find((s) => s.id === entry.subjectId);
      const faculty = data.faculty.find((f) => f.id === entry.facultyId);
      const room    = data.rooms.find((r) => r.id === entry.roomId);
      const bg      = subject?.isPE ? '#DCFCE7' : subject?.isValues ? '#F3E8FF' : '#F0F7FF';
      rows += `<td style="background:${bg};border:1px solid #AACFEE;padding:6px 8px;text-align:center;vertical-align:middle;">
        <div style="font-weight:bold;color:#1A3D6B;font-size:10pt;">${subject?.code ?? '?'}</div>
        <div style="color:#2563EB;font-size:9pt;">${faculty?.name ?? '?'}</div>
        <div style="color:#6B7280;font-size:8.5pt;font-style:italic;">${room?.name ?? 'No Room'}</div>
      </td>`;
    });
    rows += `</tr>`;
  });

  return wrapWordHTML(
    `Schedule — ${cls.name}`,
    `<p style="text-align:center;font-size:15pt;font-weight:bold;color:#1A3D6B;margin-bottom:4px;">AGUTAY NATIONAL HIGH SCHOOL</p>
     <p style="text-align:center;font-size:11pt;color:#2563EB;margin-bottom:4px;">Senior High School — Class Schedule</p>
     <p style="text-align:center;font-size:12pt;font-weight:bold;color:#1A2A4A;margin-bottom:16px;">
       ${cls.name}${adviser ? ' &nbsp;|&nbsp; Adviser: ' + adviser.name : ''}
     </p>
     <table>${rows}</table>
     <p style="text-align:right;font-size:8.5pt;color:#9CA3AF;font-style:italic;margin-top:14px;">Generated: ${new Date().toLocaleDateString('en-PH')}</p>`
  );
}

function buildFacultyScheduleHTML(faculty: Faculty, data: AppData): string {
  let rows = `<tr>
    <th style="background:#0E4D6B;color:#fff;padding:8px 10px;border:1px solid #0E4D6B;font-size:11pt;">TIME</th>
    ${days.map((d) => `<th style="background:#0E4D6B;color:#fff;padding:8px 10px;border:1px solid #0E4D6B;font-size:11pt;">${d.toUpperCase()}</th>`).join('')}
  </tr>`;

  timeSlots.forEach((slot) => {
    if (slot.period === 'break') {
      rows += `<tr>
        <td style="background:#FEF9C3;color:#92400E;font-weight:bold;padding:6px 10px;border:1px solid #B0D0E8;font-size:10pt;">${slot.time}</td>
        <td colspan="5" style="background:#FEF9C3;color:#92400E;font-weight:bold;text-align:center;padding:6px;border:1px solid #B0D0E8;font-size:10pt;">BREAK / RECESS</td>
      </tr>`;
      return;
    }

    rows += `<tr><td style="background:#E0F2FE;color:#0E4D6B;font-weight:bold;padding:6px 10px;border:1px solid #B0D0E8;font-size:10pt;white-space:nowrap;">${slot.time}</td>`;

    days.forEach((day) => {
      let found: { entry: NonNullable<AppData['schedule'][string][string][string]>; cls: AppData['classes'][number] } | null = null;
      for (const cls of data.classes) {
        const entry = data.schedule[cls.id]?.[day]?.[slot.time];
        if (entry && !entry.isVacancy && entry.facultyId === faculty.id) {
          found = { entry, cls };
          break;
        }
      }
      if (!found) { rows += `<td style="border:1px solid #B0D0E8;padding:6px;"></td>`; return; }

      const { entry, cls } = found;
      const subject = data.subjects.find((s) => s.id === entry.subjectId);
      const room    = data.rooms.find((r) => r.id === entry.roomId);
      const bg      = subject?.isPE ? '#DCFCE7' : subject?.isValues ? '#F3E8FF' : '#EFF6FF';
      rows += `<td style="background:${bg};border:1px solid #B0D0E8;padding:6px 8px;text-align:center;vertical-align:middle;">
        <div style="font-weight:bold;color:#0E4D6B;font-size:10pt;">${subject?.code ?? '?'}</div>
        <div style="color:#0369A1;font-size:9pt;font-weight:600;">${cls.name}</div>
        <div style="color:#6B7280;font-size:8.5pt;font-style:italic;">${room?.name ?? 'No Room'}</div>
      </td>`;
    });
    rows += `</tr>`;
  });

  const typeLabel = faculty.type === 'adviser' ? 'Adviser' : 'Floating';
  return wrapWordHTML(
    `Faculty Schedule — ${faculty.name}`,
    `<p style="text-align:center;font-size:15pt;font-weight:bold;color:#0E4D6B;margin-bottom:4px;">AGUTAY NATIONAL HIGH SCHOOL</p>
     <p style="text-align:center;font-size:11pt;color:#0369A1;margin-bottom:4px;">Senior High School — Faculty Teaching Schedule</p>
     <p style="text-align:center;font-size:12pt;font-weight:bold;color:#1A2A4A;margin-bottom:4px;">${faculty.name}</p>
     <p style="text-align:center;font-size:10pt;color:#0369A1;margin-bottom:16px;">${typeLabel}</p>
     <table>${rows}</table>
     <p style="text-align:right;font-size:8.5pt;color:#9CA3AF;font-style:italic;margin-top:14px;">Generated: ${new Date().toLocaleDateString('en-PH')}</p>`
  );
}

function wrapWordHTML(title: string, bodyContent: string): string {
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
       xmlns:w="urn:schemas-microsoft-com:office:word"
       xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8"><title>${title}</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:Orientation>Landscape</w:Orientation></w:WordDocument></xml><![endif]-->
  <style>
    @page { size: landscape; margin: 0.75in; }
    body { font-family: Calibri, Arial, sans-serif; margin: 0; padding: 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { vertical-align: middle; }
    p { margin: 0 0 4px 0; }
  </style>
</head>
<body>${bodyContent}</body>
</html>`;
}

function downloadDoc(htmlContent: string, filename: string): void {
  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}