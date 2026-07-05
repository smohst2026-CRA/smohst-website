# คู่มือตั้งค่าระบบรับข้อความผ่าน Google Apps Script

> ใช้เวลาประมาณ **10–15 นาที** ทำครั้งเดียวจบ ไม่ต้องเสียค่าใช้จ่าย

ระบบนี้จะทำให้ฟอร์ม "ส่งข้อความ/ร้องเรียน" ในเว็บไซต์สโมสรนักศึกษา:
1. **บันทึกข้อมูล**ทุกข้อความลง Google Sheet โดยอัตโนมัติ
2. **ส่งอีเมลแจ้งเตือน** ไปยัง `smohst2026@gmail.com` ทันทีที่มีคนกดส่ง
3. รองรับการตอบกลับผ่าน "Reply" ในอีเมลได้เลย (Reply-To = อีเมลผู้ส่ง)

---

## ขั้นตอนที่ 1: สร้าง Google Sheet ใหม่

1. เปิด https://sheets.google.com (ล็อกอินด้วยบัญชี Google ของสโมสร เช่น `smohst2026@gmail.com`)
2. กดปุ่ม **+ Blank** เพื่อสร้าง spreadsheet ใหม่
3. ตั้งชื่อไฟล์ เช่น `SMO HST – Contact Form Submissions`
4. **ไม่ต้องสร้าง column header** — สคริปต์จะสร้างให้เองอัตโนมัติเมื่อมีข้อความเข้ามาครั้งแรก

---

## ขั้นตอนที่ 2: เปิด Apps Script และวางโค้ด

1. ใน Google Sheet ที่เพิ่งสร้าง คลิกเมนูบาร์: **Extensions** → **Apps Script**
2. หน้าต่าง Apps Script จะเปิดขึ้นมาใหม่ พร้อมไฟล์ `Code.gs` เปล่าๆ
3. **ลบโค้ดที่มีอยู่ทั้งหมด** ในไฟล์นั้น
4. เปิดไฟล์ `Code.gs` ที่อยู่ในโฟลเดอร์นี้ (`google-apps-script/Code.gs`) **คัดลอกทั้งหมด**
5. **วาง**ลงใน Apps Script editor
6. กดปุ่ม **บันทึก** (รูปแผ่นดิสก์ หรือ `Ctrl+S`)
7. ระบบจะถามชื่อโปรเจกต์ ตั้งชื่อว่า `SMO Contact Backend` แล้วกด OK

---

## ขั้นตอนที่ 3: ทดสอบสคริปต์ (Optional แต่แนะนำ)

1. ใน Apps Script editor ตรง dropdown ด้านบนซ้าย (ที่เขียนว่า `doPost`) **เลือก `testSubmit`**
2. กดปุ่ม **Run** (▶)
3. ครั้งแรกระบบจะถาม **Authorization**:
   - กด **Review permissions**
   - เลือกบัญชี Google ของสโมสร
   - หากเห็นหน้า "Google hasn't verified this app" ให้กด **Advanced** → **Go to SMO Contact Backend (unsafe)** (ปลอดภัย — เป็นสคริปต์ของคุณเอง)
   - กด **Allow**
4. รอสักครู่ ระบบจะรัน `testSubmit()`
5. กลับไปดู Google Sheet → ควรเห็นแถวข้อมูลทดสอบเพิ่มขึ้นมา
6. เช็คอีเมล `smohst2026@gmail.com` → ควรได้รับอีเมลแจ้งเตือนข้อความทดสอบ

> ✅ ถ้าทั้งสองอย่างเกิดขึ้น = ระบบทำงานได้ ไปขั้นตอนถัดไปได้เลย

---

## ขั้นตอนที่ 4: Deploy เป็น Web App

1. ใน Apps Script editor มุมขวาบน กด **Deploy** → **New deployment**
2. กดไอคอนเฟือง ⚙ ข้างคำว่า "Select type" → เลือก **Web app**
3. กรอกข้อมูลการ Deploy:

   | ฟิลด์ | ค่าที่ต้องเลือก |
   |------|----------------|
   | **Description** | `SMO Contact Form v1` |
   | **Execute as** | **Me (smohst2026@gmail.com)** |
   | **Who has access** | **Anyone** ⚠ สำคัญมาก |

4. กด **Deploy**
5. ระบบจะแสดง **Web app URL** หน้าตาประมาณนี้:
   ```
   https://script.google.com/macros/s/AKfycby.................../exec
   ```
6. **คัดลอก URL นี้** เก็บไว้
7. กด **Done**

---

## ขั้นตอนที่ 5: นำ URL ไปใส่ในเว็บไซต์

1. เปิดไฟล์ `contact.html` ในโฟลเดอร์เว็บ
2. หา code ใกล้ๆ ท้ายไฟล์ที่เขียนว่า:
   ```javascript
   const CONTACT_FORM_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. **แทนที่** `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` ด้วย URL จากขั้นตอนที่ 4
   ตัวอย่างหลังแก้:
   ```javascript
   const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. บันทึกไฟล์
5. อัปโหลดไฟล์ขึ้นเซิร์ฟเวอร์เว็บไซต์ (หรือ refresh หากใช้ host แบบ auto-deploy)

---

## ขั้นตอนที่ 6: ทดสอบจริง

1. เปิดเว็บไซต์ → ไปหน้า **ส่งข้อความ/ร้องเรียน**
2. กรอกข้อมูลทดสอบ → กด **ส่งข้อความ**
3. ควรเห็นข้อความเขียว **"✓ ขอบคุณ! เราได้รับข้อความของคุณแล้ว..."**
4. เช็ค Google Sheet → ควรมีแถวใหม่
5. เช็คอีเมล `smohst2026@gmail.com` → ควรได้รับอีเมลแจ้งเตือน

🎉 **เสร็จสิ้น!**

---

## การจัดการข้อความที่เข้ามา

### ดูข้อความทั้งหมด
- เปิด Google Sheet ที่ Bookmark ไว้
- คอลัมน์ "สถานะ" จะเริ่มต้นด้วย "ใหม่" — เปลี่ยนเป็น "อ่านแล้ว", "ตอบแล้ว", "ปิดเรื่อง" ได้ตามต้องการ

### ตอบกลับผู้ส่ง
- ในอีเมลแจ้งเตือน กด **Reply** ได้เลย — ระบบตั้ง Reply-To ให้เป็นอีเมลผู้ส่งโดยอัตโนมัติ
- หรือกดปุ่ม "ตอบกลับทางอีเมล" ในตัวอีเมลแจ้งเตือน

### กรองตามหัวข้อ (เช่น เฉพาะเรื่องร้องเรียน)
- ใน Google Sheet เลือกแถวที่ 1 → Data → Create a filter
- กดไอคอน filter ที่คอลัมน์ "หัวข้อ" → เลือกเฉพาะ "ร้องเรียน"

---

## ปัญหาที่อาจเจอ & วิธีแก้

### 🔴 หน้าเว็บแสดง "Form endpoint not configured"
→ ยังไม่ได้แก้ `CONTACT_FORM_ENDPOINT` ใน contact.html (ขั้นตอนที่ 5)

### 🔴 ส่งฟอร์มแล้วได้ error
- เช็คว่า **Who has access** ตอน Deploy ตั้งเป็น **Anyone** หรือไม่
- หากแก้แล้วต้อง **Deploy → Manage deployments → ✏ → Version: New version → Deploy** ใหม่

### 🔴 ไม่ได้รับอีเมลแจ้งเตือน
- เช็ค Spam folder
- เช็คใน Apps Script editor: **Executions** (เมนูซ้าย) → ดูว่ามี error หรือไม่
- Apps Script มี quota ส่งอีเมลฟรี 100 ฉบับ/วัน (เพียงพอเหลือเฟือ)

### 🟡 ต้องการเปลี่ยนอีเมลที่รับแจ้งเตือน
- แก้ใน `Code.gs` บรรทัด:
  ```javascript
  const NOTIFY_EMAIL = 'smohst2026@gmail.com';
  ```
- บันทึก → Deploy → Manage deployments → ✏ → Version: New version → Deploy

### 🟡 ต้องการให้ไม่ส่งอีเมล (เก็บแค่ใน Sheet)
- แก้ใน `Code.gs`:
  ```javascript
  const SEND_EMAIL_NOTIFICATION = false;
  ```

---

## ความปลอดภัย & Privacy

- ✅ ข้อมูลผู้ส่งจะถูกเก็บใน Google Sheet ของสโมสรเท่านั้น Anthropic/Google ไม่นำไปใช้
- ✅ มีระบบ **honeypot anti-spam** ป้องกันบอทแล้วในตัว
- ✅ URL ของ Web App ถูกออกแบบให้รับเฉพาะ POST request ผู้ที่เห็น URL จะเห็นเพียงข้อความ "endpoint accepts POST requests only"
- ⚠ ถ้ารู้สึกว่าฟอร์มถูก spam มากเกินไป สามารถเพิ่ม Google reCAPTCHA ภายหลังได้

---

## ติดต่อสอบถาม

หากติดขัดในขั้นตอนใด สามารถถาม Claude ในเซสชันนี้ต่อได้เลย หรือดู transcript ของการสนทนานี้
