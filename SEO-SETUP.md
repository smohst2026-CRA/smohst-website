# คู่มือทำให้เว็บค้นเจอใน Google
**เว็บ:** https://smohst69.netlify.app/

## สิ่งที่เพิ่มในเว็บแล้ว (เสร็จแล้ว ไม่ต้องทำเอง)

- `sitemap.xml` — รายชื่อหน้าทั้งหมด (อยู่ที่ https://smohst69.netlify.app/sitemap.xml)
- `robots.txt` — บอก Google ว่าให้เก็บข้อมูลและไปอ่าน sitemap
- `meta description` ทุกหน้า (ภาษาไทย) — Google จะใช้แสดงใต้ผลค้นหา
- `Open Graph tags` — เวลาแชร์ลิงก์ใน LINE/Facebook/IG จะมีภาพและคำอธิบายขึ้นมา
- `canonical link` — บอก Google ว่า URL ไหนเป็น URL หลักของแต่ละหน้า

> **อย่าลืม push/deploy เว็บใหม่บน Netlify** (ลาก/วางโฟลเดอร์เข้าไปอีกครั้ง หรือ git push) เพื่อให้ไฟล์ใหม่อัปเดตขึ้น

---

## ขั้นตอนที่ต้องทำเอง (~15 นาที)

### 1. Submit เว็บใน Google Search Console (สำคัญสุด)

1. เข้า https://search.google.com/search-console
2. ลงชื่อด้วยบัญชี Google ของสโมสร (แนะนำใช้ smohst2026@gmail.com)
3. คลิก **"เพิ่มพร็อพเพอร์ตี้" (Add property)**
4. เลือก **"คำนำหน้า URL" (URL prefix)**
5. ใส่ `https://smohst69.netlify.app/` แล้วกด **"ดำเนินการต่อ"**
6. **ยืนยันความเป็นเจ้าของ:** เลือกวิธี **"HTML tag"** — Google จะให้โค้ดประมาณนี้:
   ```
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXX" />
   ```
   - คัดลอกบรรทัดนี้
   - เปิด `index.html` แล้วแปะไว้ใน `<head>` (ใต้บรรทัด `<title>...</title>`)
   - บันทึก แล้ว deploy ขึ้น Netlify
   - กลับไปที่ Search Console แล้วกด **"ยืนยัน"**
7. เมื่อยืนยันสำเร็จแล้ว ในเมนูซ้ายไปที่ **"Sitemaps"**
8. ในช่อง "เพิ่ม Sitemap ใหม่" ใส่: `sitemap.xml` แล้วกด **ส่ง**

หลังจากนี้ Google จะเริ่มเก็บข้อมูลภายใน 1-3 วัน และผลค้นหาจะเริ่มขึ้นภายใน 1-2 สัปดาห์

### 2. ขอ index ด่วน (URL Inspection)

ใน Search Console เมนู **"URL Inspection"**:
- ใส่ `https://smohst69.netlify.app/` กด Enter
- รอ Google ตรวจ (~30 วินาที)
- กด **"ขอจัดทำดัชนี" (Request indexing)**
- ทำซ้ำกับแต่ละหน้า: `/about`, `/activities`, `/services`, `/contact`, `/news`

### 3. ขอลิงก์จากเว็บคณะ (สำคัญต่อ ranking)

ติดต่อ IT คณะ หรือผู้ดูแล hst.cra.ac.th ขอให้เพิ่มลิงก์เว็บสโมสรไว้ในหน้า:
- เมนูบนของเว็บคณะ
- หน้า "นักศึกษา" หรือ "กิจการนักศึกษา"
- เพจ Facebook คณะ

ลิงก์ที่มาจากเว็บคณะ (.ac.th) จะช่วยให้ Google ให้น้ำหนักเว็บนี้สูงขึ้นมาก

### 4. (ทางเลือก) Bing Webmaster Tools

ถ้าอยากให้ค้นเจอใน Bing/Edge/Yahoo ด้วย:
1. เข้า https://www.bing.com/webmasters
2. นำเข้าจาก Google Search Console ได้เลย (กดปุ่ม Import) — ใช้เวลา 1 นาที

---

## ตรวจสอบว่าค้นเจอแล้วหรือยัง

ลองค้นใน Google:
```
site:smohst69.netlify.app
```

- ถ้ามีผลขึ้น = Google เก็บข้อมูลแล้ว
- ถ้ายังไม่ขึ้น = รอ 3-7 วันหลัง submit, หรือทำขั้นตอนที่ 2 (ขอ index ด่วน)

ลองคำค้นจริง:
- "สโมสรนักศึกษา HST"
- "สโมสรนักศึกษา ราชวิทยาลัยจุฬาภรณ์"
- "SMO HST"

---

## ปรับ ranking ในระยะยาว

1. **อัปเดตเนื้อหาบ่อยๆ** — Google ชอบเว็บที่ active เช่น โพสต์ข่าว/กิจกรรมใหม่ทุก 1-2 สัปดาห์
2. **ใส่รูปกิจกรรมจริง** แทน placeholder ในหน้า news/activities เมื่อมีรูปจากงานจริง
3. **ขอ subdomain จากคณะ** (เช่น smo.hst.cra.ac.th) — domain .ac.th จะ rank ดีกว่า netlify.app มาก เพราะเป็นโดเมนสถาบันการศึกษาที่ Google เชื่อถือ
4. **ลิงก์จาก social media** — เพจ Facebook, IG, TikTok ของสโมสรควรมีลิงก์เว็บใน bio

---

## ปัญหาที่อาจเจอ

**Q: Submit แล้ว แต่ Google ยังไม่ขึ้นผล**
- ตอบ: ปกติใช้เวลา 3-14 วัน ใจเย็นๆ ตรวจ Search Console ว่ามี error ไหม

**Q: ผลค้นหาขึ้นเว็บอื่น (เช่น Facebook สโมสร) แทนเว็บนี้**
- ตอบ: ปกติช่วงแรก เพราะเพจ Facebook มี domain authority สูงกว่า ให้สร้าง backlink ตามข้อ 3 และเวลาผ่านไป ranking จะดีขึ้น

**Q: เปลี่ยน domain เป็น .ac.th ได้ไหม**
- ตอบ: ได้ ต้องติดต่อ IT คณะ/สถาบัน ขอ subdomain แล้วชี้ DNS มาที่ Netlify
