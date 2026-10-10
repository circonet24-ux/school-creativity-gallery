# متطلبات الربط الخلفي (لتفعيل التخزين الدائم متعدد الأجهزة + أمان الخادم)

النسخة الحالية تعمل بتخزين محلي فقط. لجعل المعرض حقيقيًا متعدد الأجهزة، يلزم أحد الخيارين — **لا توجد وظائف تجريبية مقدمة على أنها مكتملة**: البحث/الفلاتر/المعاينة/اللوحة تعمل محليًا، أما المشاركة عبر الأجهزة فتحتاج الربط أدناه.

## الخيار 1: Supabase (موصى به — مجاني ومناسب للمدارس)

1. أنشئي مشروعًا في https://supabase.com
2. أنشئي جدول `works` بالأعمدة:
   `id uuid PK, section text, type text, title text, owner text, grade text, category text, description text, file_url text, cover_url text, link text, published bool, featured bool, allow_download bool, sort_order int, created_at timestamptz`
3. جدولا `categories (id, name)` و `settings (key, value)` + جدول `admins` (استخدمي Supabase Auth بدل كلمات مرور يدوية).
4. Storage: أنشئي Bucket باسم `works` (عام للقراءة) و `covers` — ارفعي الملفات إليه واحفظي روابطها في `file_url/cover_url`.
5. سياسات RLS:
   - القراءة العامة: `published = true` فقط.
   - الكتابة/التعديل/الحذف: للمستخدمين المسجلين بدور `admin` فقط.
   - حدود: تحققي من `mime-type` والحجم (صور 10MB، PDF 20MB، فيديو 100MB) عبر سياسات الـ Storage.
6. في الواجهة: استبدلي طبقة `localStorage` في `assets/app.js` باستدعاءات Supabase JS (`@supabase/supabase-js`) — دوال `load/save` الحالية معزولة لتسهيل الاستبدال.

## الخيار 2: خادم Node + SQLite (استضافة ذاتية)

- `express + multer + bcrypt + jsonwebtoken + better-sqlite3`
- endpoints مقترحة: `POST /api/login` — `GET /api/works?section=` (منشور فقط) — `GET/POST/PUT/DELETE /api/admin/works` (بتوكن) — `GET/PUT /api/admin/settings` — `CRUD /api/admin/categories`
- تحقق على الخادم من: التوكن، نوع الملف (MIME)، الحجم، تعقيم أسماء الملفات، وعدم إرجاع أي بيانات تواصل للطلاب.
- ارفعي مجلد التطبيق على أي استضافة (Render / Railway / VPS) مع مجلد `uploads` دائم.

## ملاحظات الخصوصية عند الربط

- لا تخزني أي بيانات تواصل أو معلومات شخصية للطلاب — الاسم الأول أو الاسم المستعار يكفي.
- فعّلي خيار `allowDownload=false` للأعمال الحساسة.
- غيّري كلمة المرور الافتراضية فور الإنشاء وفعّلي المصادقة الثنائية لحساب Supabase.
