/**
 * Zero-API Google Calendar & iCalendar Generator
 * $0 investment, no API keys, works natively in any browser
 */

// Format Date string and Time Slot into standard YYYYMMDDTHHmmss
export function formatCalendarDates(dateStr, timeSlotStr) {
  let dateObj = new Date();
  
  if (dateStr && String(dateStr).match(/^\d{4}-\d{2}-\d{2}$/)) {
    const parts = String(dateStr).split('-');
    dateObj.setFullYear(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    // Default to tomorrow
    dateObj.setDate(dateObj.getDate() + 1);
  }

  let startHour = 11;
  let startMinute = 0;

  if (timeSlotStr) {
    const timeMatch = String(timeSlotStr).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const meridiem = timeMatch[3].toUpperCase();
      if (meridiem === 'PM' && h < 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      startHour = h;
      startMinute = m;
    }
  }

  dateObj.setHours(startHour, startMinute, 0, 0);
  const endObj = new Date(dateObj.getTime() + 60 * 60 * 1000); // 1-hour appointment

  const pad = (n) => String(n).padStart(2, '0');
  const formatIsoCal = (d) => 
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  return `${formatIsoCal(dateObj)}/${formatIsoCal(endObj)}`;
}

export function buildGoogleCalendarUrl({
  title = 'IRA Tax Consultation & Walkthrough',
  description = 'US Federal Form 1040 & State tax preparation consultation with IRA Tax Solutions.',
  location = 'Google Meet / Screen Share',
  dateStr = '',
  timeSlotStr = '',
  clientEmail = ''
}) {
  const dates = formatCalendarDates(dateStr, timeSlotStr);
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';

  const params = new URLSearchParams({
    text: title,
    dates: dates,
    details: description,
    location: location
  });

  if (clientEmail) {
    params.append('add', clientEmail);
  }

  return `${base}&${params.toString()}`;
}

export function downloadIcsFile({
  title = 'IRA Tax Consultation & Walkthrough',
  description = 'US Federal Form 1040 & State tax preparation consultation with IRA Tax Solutions.',
  location = 'Google Meet / Screen Share',
  dateStr = '',
  timeSlotStr = '',
  clientEmail = ''
}) {
  const dates = formatCalendarDates(dateStr, timeSlotStr);
  const [startDt, endDt] = dates.split('/');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IRA Tax Solutions//US Tax Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:ira-tax-${Date.now()}@irataxsolutions.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDt}`,
    `DTEND:${endDt}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    ...(clientEmail ? [`ATTENDEE;CN=Client:mailto:${clientEmail}`] : []),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `IRA_Tax_Consultation_${dateStr || 'Appointment'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
