# เว็บไซต์สโมสรนักศึกษา HST
## คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ ราชวิทยาลัยจุฬาภรณ์

เว็บไซต์ประชาสัมพันธ์ข่าวและบริการสำหรับนักศึกษา สร้างด้วย HTML / CSS / JavaScript แบบ Static — ไม่ต้องใช้ฐานข้อมูลหรือ backend สามารถนำไป deploy ได้ฟรีบน GitHub Pages, Netlify, หรือ Vercel

---

## โครงสร้างไฟล์

```
Website_smo.HST/
├── index.html          ← หน้าแรก (Home + ข่าวล่าสุด + กิจกรรม)
├── about.html          ← เกี่ยวกับสโมสร / โครงสร้าง / คณะกรรมการ
├── news.html           ← ข่าวสารและประกาศทั้งหมด (มี filter)
├── activities.html     ← กิจกรรม + ปฏิทินกิจกรรม
├── services.html       ← บริการนักศึกษา + Link เข้าระบบสถาบัน
├── contact.html        ← ติดต่อ + ช่องทางสำหรับนักศึกษา + แบบฟอร์ม
├── css/
│   └── style.css       ← สไตล์หลักของเว็บไซต์
├── js/
│   ├── main.js         ← เมนูมือถือ + สลับภาษา + กรองข่าว
│   └── calendar.js     ← ปฏิทินกิจกรรม
├── assets/             ← โฟลเดอร์สำหรับรูปภาพ/โลโก้ (ใส่เพิ่มได้)
└── README.md           ← ไฟล์นี้
```

---

## วิธีเปิดดูบนเครื่อง

ดับเบิลคลิก `index.html` เพื่อเปิดด้วย browser ได้ทันที — ไม่ต้องติดตั้งอะไรเพิ่ม

หากต้องการรันด้วย local server (แนะนำสำหรับการพัฒนา):

```bash
# ใช้ Python
cd Website_smo.HST
python -m http.server 8000
# เปิดที่ http://localhost:8000

# หรือใช้ Node
npx serve
```

---

## วิธีปรับแก้เนื้อหาที่ใช้บ่อย

### 1. เปลี่ยน "สีธีม" ของเว็บไซต์
แก้ที่ `css/style.css` ส่วน `:root` (บรรทัดต้นๆ)

```css
:root {
  --color-primary: #1d3557;       /* สี Navy หลัก */
  --color-secondary: #2d6a4f;     /* สี Green เข้ม */
  --color-accent: #52b788;        /* สี Green กลาง */
  --color-yellow: #ffd166;        /* สี Yellow */
  --color-yellow-soft: #fff8d6;   /* สี Yellow อ่อน */
  ...
}
```
แก้ค่าสี hex แล้วบันทึก ทั้งเว็บไซต์จะเปลี่ยนสีตามทันที

### 2. เพิ่ม / แก้ "ข่าว"
- เปิด `index.html` หรือ `news.html`
- มองหา `<article class="news-card">` แล้วก็อปปี้บล็อกนี้ทั้งก้อนไปวางต่อ
- แก้ `news-tag`, `news-date`, `news-title`, `news-excerpt`
- คงคู่ภาษา TH/EN ไว้ (`class="th"` กับ `class="en"`) เพื่อให้สลับภาษาได้

### 3. เพิ่ม / แก้ "กิจกรรมในปฏิทิน"
แก้ที่ `js/calendar.js` ที่ตัวแปร `EVENTS`

```js
const EVENTS = {
  "2026-05-18": {
    th: { title: "...", time: "09:00 - 16:00", place: "...", category: "..." },
    en: { title: "...", time: "09:00 - 16:00", place: "...", category: "..." }
  },
  // เพิ่มใหม่ตรงนี้
};
```

### 4. แก้ลิงก์ "บริการนักศึกษา" ให้ตรงกับ URL จริงของสถาบัน
เปิด `services.html` แก้ที่บล็อก `<div class="system-card">`:
- ในส่วน `<div class="system-url">https://...</div>`
- และ `<a href="https://..." target="_blank" ...>`

### 5. แก้ "ลิงก์ Social Media" / ช่องทางติดต่อ
ค้นหาใน HTML ทุกไฟล์ ตำแหน่ง `href="https://www.facebook.com/"` แล้วเปลี่ยนเป็น URL จริง — ตอนนี้ลิงก์ทั้งหมดเป็น `#` หรือลิงก์ตัวอย่าง

### 6. เปลี่ยน "โลโก้"
ตอนนี้เว็บใช้โลโก้จากไฟล์ `assets/logo-smo.png` หากต้องการเปลี่ยน:
- **วิธีง่ายที่สุด**: นำไฟล์โลโก้ใหม่มาแทนที่ `assets/logo-smo.png` (คงชื่อเดิม) — ทุกหน้าจะเปลี่ยนตามทันที
- **เปลี่ยนชื่อไฟล์**: แก้ `<img src="assets/logo-smo.png" ...>` ทุกหน้า HTML ให้ตรงกับชื่อไฟล์ใหม่
- **ใช้ตัวอักษรแทนรูป**: แทน `<img src="assets/logo-smo.png" alt="SMO Logo" class="logo-mark" />` ด้วย `<span class="logo-mark">SMO</span>`
- ขนาดของโลโก้แก้ที่ `css/style.css` ส่วน `.logo-mark { width: 56px; height: 56px; ... }`

### 7. เปลี่ยน "ชื่อสโมสร / คณะ"
ค้นหา "สโมสรนักศึกษา HST" และ "HST Student Association" ในทุกไฟล์ แล้วแทนที่

### 8. แบบฟอร์มติดต่อ (`contact.html`) ทำให้ส่งจริง
ตอนนี้แบบฟอร์มแสดง alert เป็น demo เท่านั้น สามารถเชื่อมต่อกับบริการฟรีได้:
- **Formspree** — ฟรี: เปลี่ยน `<form>` เป็น `<form action="https://formspree.io/f/YOUR_ID" method="POST">`
- **Google Forms** — ใช้ embed iframe หรือใช้ Google Apps Script
- **EmailJS** — เพิ่ม script จาก emailjs.com

---

## วิธีนำไปเผยแพร่ (Deploy)

### ทางเลือก A: GitHub Pages (ฟรี, ง่ายที่สุด)
1. สมัคร [GitHub](https://github.com/) (ถ้ายังไม่มี)
2. สร้าง repository ใหม่ ตั้งชื่อ `smo-hst` หรืออะไรก็ได้
3. Upload ไฟล์ทั้งหมดใน folder นี้ขึ้นไป
4. ไปที่ Settings → Pages → Source: Deploy from `main` branch / `/root`
5. กด Save → จะได้ URL เช่น `https://yourusername.github.io/smo-hst/`

### ทางเลือก B: Netlify (ฟรี, ง่ายมาก)
1. สมัคร [Netlify](https://app.netlify.com/)
2. ลาก folder `Website_smo.HST` ทั้ง folder เข้าไปวางที่ "Drag and drop your site folder here"
3. รอประมาณ 30 วินาที จะได้ URL เช่น `https://random-name.netlify.app/`
4. สามารถผูก domain ของตัวเองได้ฟรี

### ทางเลือก C: Vercel (ฟรี)
1. สมัคร [Vercel](https://vercel.com/)
2. Import จาก GitHub repository (ทำตามทางเลือก A ก่อน)
3. กด Deploy

### ทางเลือก D: Hosting ของสถาบัน
อัปโหลดไฟล์ทั้งหมดผ่าน FTP/cPanel ไปยัง public_html

---

## คุณสมบัติของเว็บไซต์

✓ **Responsive** — รองรับ มือถือ / แท็บเล็ต / desktop
✓ **2 ภาษา** — สลับได้ระหว่าง ไทย / English (จดจำการเลือกผ่าน localStorage)
✓ **ปฏิทินกิจกรรม** — เลือกเดือน/วัน เพื่อดูรายละเอียด
✓ **กรองข่าว** — แยกตามหมวดได้
✓ **ออกแบบให้แก้ไขง่าย** — มีตัวแปร CSS รวมศูนย์
✓ **SEO Ready** — มี meta tags
✓ **ไม่ต้องมี backend** — เป็น static เปิดได้ทุกที่

---

## เทคโนโลยีที่ใช้

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox)
- Vanilla JavaScript (ES6, ไม่ใช้ framework)
- [Font Awesome 6](https://fontawesome.com/) — ไอคอน (โหลดผ่าน CDN)
- [Google Fonts](https://fonts.google.com/) — Sarabun + Prompt (โหลดผ่าน CDN)

---

## License & Credit

เปิดใช้งานเป็น template สำหรับสโมสรนักศึกษา สามารถดัดแปลงและใช้งานได้ตามต้องการ

อ้างอิงรูปแบบ layout จาก:
- [มหาวิทยาลัยขอนแก่น](https://www.kku.ac.th/)
- [คณะแพทยศาสตร์ มข.](https://md.kku.ac.th/)

---

## ติดต่อ / สอบถาม
หากมีคำถามเกี่ยวกับการแก้ไขหรือเพิ่มฟีเจอร์ สามารถติดต่อทีมพัฒนาผ่านช่องทางที่ระบุในหน้า Contact ได้เลย
