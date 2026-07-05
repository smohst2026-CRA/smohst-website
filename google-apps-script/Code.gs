/**
 * SMO HST — Contact Form Backend (Google Apps Script)
 * ----------------------------------------------------
 * รับข้อมูลจากฟอร์มในเว็บไซต์สโมสรนักศึกษา HST
 * - บันทึกลง Google Sheet ที่ผูกกับสคริปต์นี้
 * - ส่งอีเมลแจ้งเตือนไปยังอีเมลของสโมสร
 *
 * วิธี Deploy: ดูไฟล์ SETUP.md ในโฟลเดอร์เดียวกัน
 */

// ===== การตั้งค่า =====
const NOTIFY_EMAIL = 'smohst2026@gmail.com';   // อีเมลที่จะได้รับแจ้งเตือนเมื่อมีคนส่งฟอร์ม
const SHEET_NAME = 'Submissions';              // ชื่อ Sheet (tab) ที่จะเก็บข้อมูล
const SEND_EMAIL_NOTIFICATION = true;          // ถ้าไม่ต้องการอีเมล ให้เปลี่ยนเป็น false

// ===== Entry point: รับ POST request =====
function doPost(e) {
  try {
    // อ่านข้อมูลจาก request (รองรับทั้ง JSON และ form-urlencoded)
    // หมายเหตุ: ฝั่ง client ส่งเป็น text/plain เพื่อเลี่ยง CORS preflight
    // จึงต้องลอง parse JSON ก่อนเสมอ ไม่ว่า Content-Type จะเป็นอะไร
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (_) {
        // ถ้า parse JSON ไม่ได้ ลอง fallback ไปใช้ form parameters
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // ป้องกัน spam: ถ้ามี honeypot field ถูกกรอก ให้ ignore เงียบๆ
    if (data.website && data.website.length > 0) {
      return jsonResponse({ ok: true, ignored: true });
    }

    // ตรวจสอบว่าเป็นการส่งแบบไม่ระบุตัวตนหรือไม่
    const isAnonymous = (data.anonymous === true || data.anonymous === 'true');

    // Validate ข้อมูลขั้นต่ำ
    // - ทุกการส่งต้องมี subject + message
    // - ถ้าไม่ใช่ anonymous ต้องมี name + email
    if (!data.subject || !data.message) {
      return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400);
    }
    if (!isAnonymous && (!data.name || !data.email)) {
      return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400);
    }

    // บันทึกลง Sheet
    const row = saveToSheet(data);

    // ส่งอีเมลแจ้งเตือน
    if (SEND_EMAIL_NOTIFICATION) {
      try {
        sendNotificationEmail(data, row);
      } catch (emailErr) {
        // อีเมลส่งไม่สำเร็จไม่ควรทำให้ฟอร์มล้มเหลว — log ไว้พอ
        console.error('Email send failed:', emailErr);
      }
    }

    return jsonResponse({ ok: true, row: row });

  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

// ===== GET handler: ใช้สำหรับทดสอบว่า Web App ออนไลน์อยู่ =====
function doGet(e) {
  return jsonResponse({
    ok: true,
    service: 'SMO HST Contact Form',
    message: 'This endpoint accepts POST requests only.'
  });
}

// ===== บันทึกข้อมูลลง Google Sheet =====
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  const isAnonymous = (data.anonymous === true || data.anonymous === 'true');

  // ถ้ายังไม่มี sheet ให้สร้างใหม่ + ใส่ header
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'โหมด',                    // ใหม่: ระบุว่าเป็น anonymous หรือไม่
      'ชื่อ-นามสกุล',
      'รหัสนักศึกษา',
      'Email',
      'เบอร์โทร',
      'หัวข้อ',
      'ข้อความ',
      'IP / Browser',
      'สถานะ'
    ]);
    sheet.getRange(1, 1, 1, 10)
      .setFontWeight('bold')
      .setBackground('#0c3b2e')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  // map รหัสหัวข้อ → ภาษาไทย
  const subjectMap = {
    general:   'สอบถามทั่วไป',
    academic:  'ปัญหาด้านวิชาการ',
    welfare:   'สวัสดิการนักศึกษา',
    activity:  'เสนอกิจกรรม',
    complaint: 'ร้องเรียน',
    other:     'อื่นๆ'
  };
  const subjectText = subjectMap[data.subject] || data.subject;

  const timestamp = new Date();
  const newRow = [
    timestamp,
    isAnonymous ? '🔒 ไม่ระบุตัวตน' : 'ทั่วไป',
    isAnonymous ? '—' : (data.name || ''),
    isAnonymous ? '—' : (data.studentId || ''),
    isAnonymous ? '—' : (data.email || ''),
    isAnonymous ? '—' : (data.phone || ''),
    subjectText,
    data.message || '',
    data.userAgent || '',
    'ใหม่'
  ];

  sheet.appendRow(newRow);
  const rowNum = sheet.getLastRow();

  // ถ้าเป็น anonymous ทำเครื่องหมายเป็นสีแถวเพื่อให้สังเกตได้ง่าย
  if (isAnonymous) {
    sheet.getRange(rowNum, 1, 1, 10).setBackground('#fef3c7');
  }

  return rowNum;
}

// ===== ส่งอีเมลแจ้งเตือน =====
function sendNotificationEmail(data, rowNumber) {
  const subjectMap = {
    general:   'สอบถามทั่วไป',
    academic:  'ปัญหาด้านวิชาการ',
    welfare:   'สวัสดิการนักศึกษา',
    activity:  'เสนอกิจกรรม',
    complaint: 'ร้องเรียน',
    other:     'อื่นๆ'
  };
  const subjectText = subjectMap[data.subject] || data.subject;
  const isAnonymous = (data.anonymous === true || data.anonymous === 'true');

  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  // Banner: สีเปลี่ยนตามโหมด
  const bannerBg = isAnonymous ? '#92400e' : '#0c3b2e';
  const bannerIcon = isAnonymous ? '🔒' : '✉️';
  const modeLabel = isAnonymous
    ? '<span style="display:inline-block;background:rgba(255,255,255,0.22);padding:2px 10px;border-radius:999px;font-size:12px;margin-left:8px;">ไม่ระบุตัวตน · Anonymous</span>'
    : '';

  // สำหรับโหมดไม่ระบุตัวตน — ไม่แสดงข้อมูลส่วนตัว + ไม่มีปุ่ม reply
  const identityRows = isAnonymous
    ? `<tr><td colspan="2" style="padding:16px;background:#fffbeb;border-left:4px solid #f59e0b;font-size:13.5px;color:#78350f;">
         <b>🔒 ข้อความนี้ถูกส่งแบบไม่ระบุตัวตน</b><br>
         <span style="opacity:.9;">ผู้ส่งไม่ได้ระบุชื่อ อีเมล หรือเบอร์โทร — ไม่สามารถติดต่อกลับได้</span>
       </td></tr>`
    : `<tr><td style="padding:10px 16px;background:#f9fafb;width:140px;"><b>ชื่อ-นามสกุล</b></td>
            <td style="padding:10px 16px;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:10px 16px;background:#f9fafb;"><b>รหัสนักศึกษา</b></td>
            <td style="padding:10px 16px;">${escapeHtml(data.studentId || '-')}</td></tr>
        <tr><td style="padding:10px 16px;background:#f9fafb;"><b>Email</b></td>
            <td style="padding:10px 16px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:10px 16px;background:#f9fafb;"><b>เบอร์โทร</b></td>
            <td style="padding:10px 16px;">${escapeHtml(data.phone || '-')}</td></tr>`;

  const replyButton = isAnonymous
    ? ''
    : `<a href="mailto:${escapeHtml(data.email)}?subject=Re:%20${encodeURIComponent(subjectText)}"
         style="display:inline-block;background:#fff;color:#0c3b2e;border:1px solid #0c3b2e;text-decoration:none;padding:8px 16px;border-radius:6px;margin-left:8px;">
         ตอบกลับทางอีเมล
       </a>`;

  const htmlBody = `
    <div style="font-family:'Segoe UI',Tahoma,sans-serif;max-width:640px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:${bannerBg};color:#fff;padding:18px 24px;">
        <h2 style="margin:0;font-size:18px;">${bannerIcon} มีข้อความใหม่จากเว็บไซต์สโมสร${modeLabel}</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:.85;">SMO HST Contact Form</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${identityRows}
        <tr><td style="padding:10px 16px;background:#f9fafb;width:140px;"><b>หัวข้อ</b></td>
            <td style="padding:10px 16px;"><b>${escapeHtml(subjectText)}</b></td></tr>
        <tr><td style="padding:10px 16px;background:#f9fafb;vertical-align:top;"><b>ข้อความ</b></td>
            <td style="padding:10px 16px;white-space:pre-wrap;">${escapeHtml(data.message)}</td></tr>
      </table>
      <div style="padding:16px 24px;background:#fef9c3;border-top:1px solid #e5e7eb;font-size:13px;">
        <a href="${sheetUrl}" style="display:inline-block;background:#0c3b2e;color:#fff;text-decoration:none;padding:8px 16px;border-radius:6px;">
          เปิด Google Sheet (แถวที่ ${rowNumber})
        </a>
        ${replyButton}
      </div>
      <div style="padding:12px 24px;background:#f3f4f6;color:#6b7280;font-size:12px;text-align:center;">
        ส่งโดยอัตโนมัติจากเว็บไซต์ สโมสรนักศึกษา HST
      </div>
    </div>
  `;

  // เตรียมพารามิเตอร์อีเมล (ถ้า anonymous — ไม่ตั้ง replyTo)
  const mailOptions = {
    to: NOTIFY_EMAIL,
    subject: isAnonymous
      ? `[SMO HST · 🔒 ไม่ระบุตัวตน] ${subjectText}`
      : `[SMO HST] ${subjectText} — จาก ${data.name}`,
    htmlBody: htmlBody
  };
  if (!isAnonymous && data.email) {
    mailOptions.replyTo = data.email;
  }

  MailApp.sendEmail(mailOptions);
}

// ===== Utilities =====
function jsonResponse(obj, statusCode) {
  // หมายเหตุ: Apps Script Web App ไม่รองรับการตั้ง status code โดยตรง
  // แต่ client สามารถเช็คจาก field "ok" ใน JSON ได้
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===== Test function: รันเพื่อทดสอบใน Apps Script editor =====
function testSubmit() {
  const fakeEvent = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        name: 'นายทดสอบ ระบบ',
        studentId: '6712345',
        email: 'test@example.com',
        phone: '081-234-5678',
        subject: 'general',
        message: 'นี่คือข้อความทดสอบ ระบบทำงานปกติหรือไม่'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}

// ===== Test function: ทดสอบโหมดไม่ระบุตัวตน =====
function testSubmitAnonymous() {
  const fakeEvent = {
    postData: {
      type: 'application/json',
      contents: JSON.stringify({
        anonymous: true,
        name: '',
        studentId: '',
        email: '',
        phone: '',
        subject: 'complaint',
        message: 'นี่คือข้อความทดสอบโหมดไม่ระบุตัวตน (Anonymous Mode)'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
