/* معرض الإبداع المدرسي — تطبيق ثابت بحفظ محلي (localStorage) */
(function(){
"use strict";
const LS = { works:"vmx_works_v1", cats:"vmx_cats_v1", settings:"vmx_settings_v1", auth:"vmx_auth_v1", session:"vmx_session_v1", certs:"vmx_certs_v1" };
const LIMITS = { image:10*1024*1024, pdf:20*1024*1024, video:100*1024*1024, cover:5*1024*1024 };
const TYPE_LABEL = { image:"🖼️ صورة / تصميم", pdf:"📕 ملف PDF", video:"🎬 فيديو", link:"🔗 رابط خارجي" };
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function svgCover(emoji, c1, c2, label){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='600' height='400' fill='url(#g)'/><text x='300' y='190' font-size='110' text-anchor='middle'>${emoji}</text><text x='300' y='300' font-size='34' font-weight='bold' text-anchor='middle' fill='white' font-family='sans-serif'>${label}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function seedCats(){ return ["تصاميم رقمية","عروض تقديمية","قصص ومطالعة","فيديو تعليمي","مشاريع تقنية","وسائل تعليمية","إبداع حر"]; }
function seedWorks(){
  return [
    { id:uid(), section:"teachers", type:"image", title:"لوحة الحروف التفاعلية", owner:"أ. نورة (توضيحي)", grade:"تخصص لغة عربية", category:"وسائل تعليمية", desc:"وسيلة تعليمية ملونة لتعليم الحروف بالصور والألوان لطالبات الصف الأول.", cover:svgCover("🔤","#0ea5a0","#16a34a","الحروف"), file:null, link:"", published:true, featured:true, allowDownload:true, order:1, createdAt:Date.now()-700000 },
    { id:uid(), section:"teachers", type:"pdf", title:"دليل الأنشطة الصفية", owner:"أ. سارة (توضيحي)", grade:"تخصص علوم", category:"عروض تقديمية", desc:"ملف PDF يضم 10 أنشطة صفية جاهزة للطباعة والتطبيق.", cover:svgCover("📕","#0ea5a0","#0b857f","دليل الأنشطة"), file:null, link:"", published:true, featured:true, allowDownload:true, order:2, createdAt:Date.now()-600000 },
    { id:uid(), section:"teachers", type:"link", title:"عرض درس الكسور التفاعلي", owner:"أ.ريم (توضيحي)", grade:"تخصص رياضيات", category:"عروض تقديمية", desc:"عرض تقديمي تفاعلي لشرح الكسور بالصور والأمثلة.", cover:svgCover("📊","#c9a227","#0ea5a0","درس الكسور"), file:null, link:"https://example.com", published:true, featured:false, allowDownload:false, order:3, createdAt:Date.now()-500000 },
    { id:uid(), section:"students", type:"image", title:"رسمتي الرقمية: حديقتي", owner:"ليان (توضيحي)", grade:"الصف الثالث", category:"تصاميم رقمية", desc:"رسم رقمي لحديقة مليئة بالأزهار والفراشات بألوان مشرقة.", cover:svgCover("🌸","#5eead4","#16a34a","حديقتي"), file:null, link:"", published:true, featured:true, allowDownload:true, order:4, createdAt:Date.now()-400000 },
    { id:uid(), section:"students", type:"video", title:"تجربتي: زراعة الفاصوليا", owner:"جود (توضيحي)", grade:"الصف الثاني", category:"فيديو تعليمي", desc:"فيديو قصير يوثق مراحل نمو نبتة الفاصوليا يومًا بيوم.", cover:svgCover("🌱","#16a34a","#0ea5a0","تجربة الزراعة"), file:null, link:"", published:true, featured:false, allowDownload:false, order:5, createdAt:Date.now()-300000 },
    { id:uid(), section:"students", type:"link", title:"قصتي: القطة لولو", owner:"سلمى (توضيحي)", grade:"الصف الأول", category:"قصص ومطالعة", desc:"قصة رقمية قصيرة من تأليف ورسوم الطالبة عن قطتها لولو.", cover:svgCover("🐱","#c9a227","#f59e0b","القطة لولو"), file:null, link:"https://example.com", published:true, featured:true, allowDownload:false, order:6, createdAt:Date.now()-200000 },
    { id:uid(), section:"students", type:"image", title:"مسودة غير منشورة (مثال)", owner:"طالبة (توضيحي)", grade:"الصف الرابع", category:"إبداع حر", desc:"هذا مثال على مسودة مخفية عن الزوار ولا يراها إلا المسؤول.", cover:svgCover("📝","#94a3b8","#64748b","مسودة"), file:null, link:"", published:false, featured:false, allowDownload:true, order:7, createdAt:Date.now()-100000 }
  ];
}
function seedSettings(){ return { school:"مدرسة النموذجية الابتدائية", gallery:"معرض الإبداع المدرسي", welcome:"أهلاً بكم في مساحتنا المشرقة لعرض إبداعات المعلمات والطلاب الرقمية — تصاميم، عروض، فيديو والمزيد.", logo:"🎨", privacy:"first", primary:"#0ea5a0", gold:"#c9a227" }; }

function uid(){ return "w"+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function load(k, fb){ try{ const v = localStorage.getItem(k); if(v==null){ return fb; } return JSON.parse(v); }catch(e){ return fb; } }
function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ toast("مساحة التخزين ممتلئة — احذفي أعمالًا أو ملفات كبيرة","err"); return false; } }

let works = load(LS.works, null);
let cats = load(LS.cats, null);
let settings = load(LS.settings, null);
if(!works){ works = seedWorks(); save(LS.works, works); }
if(!cats){ cats = seedCats(); save(LS.cats, cats); }
if(!settings){ settings = seedSettings(); save(LS.settings, settings); }

async function sha256(str){ const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("vmx::"+str)); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join(""); }
function isLogged(){ return sessionStorage.getItem(LS.session)==="1"; }

/* ---------- toast ---------- */
function toast(msg, kind){
  const w = $("#toastWrap"); const t = document.createElement("div");
  t.className = "toast " + (kind||""); t.textContent = msg; w.appendChild(t);
  setTimeout(()=>{ t.style.opacity="0"; setTimeout(()=>t.remove(),300); }, 2600);
}

/* ---------- privacy ---------- */
function displayOwner(w){
  if(w.section==="teachers") return w.owner;
  const mode = settings.privacy || "first";
  if(mode==="hidden") return "طالبة مشاركة";
  if(mode==="first"){ return String(w.owner||"").split(/[\s(]/)[0] || "طالبة"; }
  return w.owner;
}

/* ---------- navigation ---------- */
let currentView = "home", currentSection = "teachers", currentList = [], currentIndex = 0;
function nav(view, section){
  currentView = view;
  ["home","gallery","admin-auth","admin"].forEach(v=>$("#view-"+v).classList.add("hidden"));
  $$(".nav-link").forEach(b=>b.classList.remove("active"));
  $("#mobileNav").classList.add("hidden");
  if(view==="home"){ $("#view-home").classList.remove("hidden"); renderHome(); }
  if(view==="gallery"){ currentSection = section||currentSection; $("#view-gallery").classList.remove("hidden"); renderGallery(); }
  if(view==="admin-auth"){
    if(isLogged()){ nav("admin"); return; }
    $("#view-admin-auth").classList.remove("hidden");
    const hasAuth = !!load(LS.auth,null);
    $("#setupBox").classList.toggle("hidden", hasAuth);
    $("#loginBox").classList.toggle("hidden", !hasAuth);
  }
  if(view==="admin"){
    if(!isLogged()){ nav("admin-auth"); return; }
    $("#view-admin").classList.remove("hidden"); renderAdmin();
  }
  const map = { home:"home", gallery:currentSection, "admin-auth":"admin", admin:"admin" };
  $$(`[data-nav]`).forEach(b=>{ if(b.dataset.nav===(map[view]||view)) b.classList.add("active"); });
  window.scrollTo({top:0, behavior:"smooth"});
}
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-nav]");
  if(b){ nav(b.dataset.nav==="teachers"||b.dataset.nav==="students"?"gallery":b.dataset.nav, b.dataset.nav); }
});
$("#menuBtn").addEventListener("click", ()=>$("#mobileNav").classList.toggle("hidden"));

/* ---------- home ---------- */
function published(sec){ return works.filter(w=>w.section===sec&&w.published).sort((a,b)=>(a.order||0)-(b.order||0)); }
function renderHome(){
  $("#brandSchool").textContent = settings.school;
  $("#brandGallery").textContent = settings.gallery;
  $("#brandLogo").textContent = settings.logo||"🎨";
  $("#heroSchool").textContent = "🏫 " + settings.school;
  $("#heroTitle").textContent = settings.gallery;
  $("#heroWelcome").textContent = settings.welcome;
  $("#footText").textContent = settings.gallery + " — " + settings.school;
  document.documentElement.style.setProperty("--primary", settings.primary||"#0ea5a0");
  document.documentElement.style.setProperty("--gold", settings.gold||"#c9a227");
  document.title = settings.gallery + " | " + settings.school;
  const t = published("teachers"), s = published("students");
  const f = works.filter(w=>w.published&&w.featured).sort((a,b)=>(a.order||0)-(b.order||0));
  $("#statTeachers").textContent = t.length; $("#statStudents").textContent = s.length; $("#statFeatured").textContent = f.length;
  $("#countTeachers").textContent = t.length; $("#countStudents").textContent = s.length;
  const g = $("#featuredGrid"); g.innerHTML = "";
  if(!f.length){ g.innerHTML = `<div class="empty"><div class="empty-icon">⭐</div><h3>لا توجد أعمال مميزة بعد</h3><p class="muted">يمكن للمسؤول تمييز أعمال لتظهر هنا.</p></div>`; return; }
  f.slice(0,6).forEach(w=>g.appendChild(workCard(w)));
}

/* ---------- cards ---------- */
function coverHTML(w){
  const src = w.cover || w.file;
  if(w.type==="image" && (w.file||w.cover)) return `<div class="work-cover"><img loading="lazy" src="${src}" alt=""></div>`;
  if(w.cover) return `<div class="work-cover"><img loading="lazy" src="${w.cover}" alt=""></div>`;
  const em = { image:"🖼️", pdf:"📕", video:"🎬", link:"🔗" }[w.type];
  return `<div class="work-cover">${em}</div>`;
}
function workCard(w){
  const el = document.createElement("button");
  el.className = "work-card";
  el.innerHTML = `${coverHTML(w)}<span class="type-tag" style="display:none"></span>
    <div class="work-body"><h3>${esc(w.title)}</h3>
    <p class="work-owner">${w.section==="teachers"?"👩‍🏫 ":"🧑‍🎓 "}${esc(displayOwner(w))}</p>
    <div class="work-meta"><span class="chip">${esc(TYPE_LABEL[w.type]||"")}</span>${w.category?`<span class="chip gold">${esc(w.category)}</span>`:""}${w.grade?`<span class="chip">${esc(w.grade)}</span>`:""}</div></div>`;
  const tag = document.createElement("span"); tag.className="type-tag";
  el.querySelector(".work-cover").appendChild(tag); tag.textContent = (TYPE_LABEL[w.type]||"").split(" ")[0]+" "+(TYPE_LABEL[w.type]||"").split(" ").slice(1).join(" ");
  tag.style.cssText = "position:absolute;top:10px;right:10px;background:rgba(255,255,255,.94);border-radius:999px;padding:3px 12px;font-size:12px;font-weight:800";
  if(w.featured){ const f=document.createElement("span"); f.className="feat"; f.textContent="⭐ مميز"; el.querySelector(".work-cover").appendChild(f); }
  el.addEventListener("click", ()=>openDetail(w.id));
  return el;
}
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

/* ---------- gallery ---------- */
function fillFilters(){
  const ft = $("#filterType");
  ft.innerHTML = `<option value="">كل الأنواع</option><option value="image">🖼️ صور</option><option value="pdf">📕 PDF</option><option value="video">🎬 فيديو</option><option value="link">🔗 روابط</option>`;
  const fc = $("#filterCat");
  fc.innerHTML = `<option value="">كل التصنيفات</option>` + cats.map(c=>`<option>${esc(c)}</option>`).join("");
  const fg = $("#filterGrade");
  if(currentSection==="teachers"){ fg.innerHTML = `<option value="">كل التخصصات</option>` + uniqGrades("teachers").map(g=>`<option>${esc(g)}</option>`).join(""); }
  else { fg.innerHTML = `<option value="">كل الصفوف</option>` + uniqGrades("students").map(g=>`<option>${esc(g)}</option>`).join(""); }
}
function uniqGrades(sec){
  const s = new Set();
  works.filter(w=>w.section===sec&&w.published&&w.grade).forEach(w=>s.add(w.grade));
  return Array.from(s);
}
function renderGallery(){
  const isT = currentSection==="teachers";
  $("#galleryKicker").textContent = isT ? "👩‍🏫 إبداعات المعلمات" : "🧑‍🎓 إبداعات الطلاب";
  $("#galleryTitle").textContent = isT ? "معرض إبداعات المعلمات" : "معرض إبداعات الطلاب";
  $("#galleryDesc").textContent = isT ? "وسائل تعليمية وتصاميم ومشاريع من معلماتنا المبدعات." : "أعمال رقمية من طلابنا الصغار نفخر بها.";
  fillFilters();
  ["searchInput","filterType","filterCat","filterGrade"].forEach(id=>{ const el=$("#"+id); if(el&&!el.dataset.bound){ el.dataset.bound="1"; el.addEventListener("input", drawGallery); el.addEventListener("change", drawGallery); } });
  drawGallery();
}
function drawGallery(){
  const q = ($("#searchInput").value||"").trim();
  const ty = $("#filterType").value, ca = $("#filterCat").value, gr = $("#filterGrade").value;
  let list = published(currentSection);
  if(q) list = list.filter(w=>(w.title+" "+w.owner).includes(q));
  if(ty) list = list.filter(w=>w.type===ty);
  if(ca) list = list.filter(w=>w.category===ca);
  if(gr) list = list.filter(w=>w.grade===gr);
  currentList = list.map(w=>w.id);
  const g = $("#galleryGrid"); g.innerHTML = "";
  list.forEach(w=>g.appendChild(workCard(w)));
  $("#galleryEmpty").classList.toggle("hidden", list.length>0);
}
$("#clearFilters").addEventListener("click", ()=>{ $("#searchInput").value=""; $("#filterType").value=""; $("#filterCat").value=""; $("#filterGrade").value=""; drawGallery(); });

/* ---------- detail modal ---------- */
function openDetail(id){
  const w = works.find(x=>x.id===id); if(!w) return;
  currentIndex = Math.max(0, currentList.indexOf(id));
  $("#modalTitle").textContent = w.title;
  $("#modalOwner").textContent = (w.section==="teachers"?"👩‍🏫 ":"🧑‍🎓 ") + displayOwner(w) + (w.grade? " • "+w.grade : "");
  $("#modalDesc").textContent = w.desc||"";
  $("#modalBadges").innerHTML = `<span class="chip">${esc(TYPE_LABEL[w.type]||"")}</span>${w.category?`<span class="chip gold">${esc(w.category)}</span>`:""}${w.featured?`<span class="chip gold">⭐ مميز</span>`:""}`;
  const m = $("#modalMedia"); m.innerHTML = "";
  const openBtn = $("#modalOpen"), dlBtn = $("#modalDownload");
  openBtn.classList.add("hidden"); dlBtn.classList.add("hidden");
  if(w.type==="image" && (w.file||w.cover)){ const im=document.createElement("img"); im.src=w.file||w.cover; im.alt=w.title; m.appendChild(im); }
  else if(w.type==="video" && w.file){ const v=document.createElement("video"); v.src=w.file; v.controls=true; m.appendChild(v); }
  else if(w.type==="video" && w.cover){ const im=document.createElement("img"); im.src=w.cover; m.appendChild(im); }
  else if(w.type==="pdf" && w.file){ const f=document.createElement("iframe"); f.src=w.file; m.appendChild(f); }
  else if(w.cover){ const im=document.createElement("img"); im.src=w.cover; m.appendChild(im); }
  else { m.textContent = {image:"🖼️",pdf:"📕",video:"🎬",link:"🔗"}[w.type]||"🎨"; }
  if(w.type==="link" && w.link){ openBtn.classList.remove("hidden"); openBtn.href=w.link; openBtn.textContent="🔗 فتح الرابط الخارجي"; }
  else if(w.link && w.type!=="link"){ openBtn.classList.remove("hidden"); openBtn.href=w.link; }
  const dlSrc = w.file || (w.type==="link"?null:w.cover);
  if(w.allowDownload && dlSrc && w.type!=="link"){ dlBtn.classList.remove("hidden"); dlBtn.href=dlSrc; dlBtn.download = w.title; }
  if(w.allowDownload && w.type==="link" && w.cover){ dlBtn.classList.remove("hidden"); dlBtn.href=w.cover; dlBtn.download=w.title+"-cover"; }
  $("#detailModal").classList.remove("hidden");
  document.body.style.overflow="hidden";
}
function stepDetail(d){
  if(!currentList.length) return;
  currentIndex = (currentIndex + d + currentList.length) % currentList.length;
  openDetail(currentList[currentIndex]);
  // keep index correct (openDetail resets from list position)
}
$("#modalClose").addEventListener("click", closeModal);
$("#detailModal").addEventListener("click", e=>{ if(e.target.id==="detailModal") closeModal(); });
$("#prevWork").addEventListener("click", ()=>stepDetail(-1));
$("#nextWork").addEventListener("click", ()=>stepDetail(1));
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ closeModal(); $("#confirmModal").classList.add("hidden"); } });
function closeModal(){ $("#detailModal").classList.add("hidden"); document.body.style.overflow=""; $("#modalMedia").innerHTML=""; }

/* ---------- auth ---------- */
$("#setupBtn").addEventListener("click", async ()=>{
  const u = $("#setupUser").value.trim(), p = $("#setupPass").value, p2 = $("#setupPass2").value;
  if(u.length<3) return toast("اسم المستخدم 3 أحرف على الأقل","err");
  if(p.length<8) return toast("كلمة المرور 8 أحرف على الأقل","err");
  if(p!==p2) return toast("تأكيد كلمة المرور غير متطابق","err");
  save(LS.auth, { user:u, hash:await sha256(u+"::"+p) });
  sessionStorage.setItem(LS.session,"1");
  toast("تم إنشاء الحساب بنجاح","ok"); nav("admin");
});
$("#loginBtn").addEventListener("click", async ()=>{
  const a = load(LS.auth,null); if(!a) return nav("admin-auth");
  const u = $("#loginUser").value.trim(), p = $("#loginPass").value;
  if(u===a.user && (await sha256(u+"::"+p))===a.hash){ sessionStorage.setItem(LS.session,"1"); toast("مرحبًا بك","ok"); nav("admin"); }
  else toast("بيانات الدخول غير صحيحة","err");
});
$("#logoutBtn").addEventListener("click", ()=>{ sessionStorage.removeItem(LS.session); toast("تم تسجيل الخروج"); nav("home"); });

/* ---------- admin ---------- */
let pendingDeleteId = null;
$$(".tab").forEach(t=>t.addEventListener("click", ()=>{
  $$(".tab").forEach(x=>x.classList.remove("active")); t.classList.add("active");
  ["works","editor","cats","featured","settings","security","certs"].forEach(k=>$("#tab-"+k).classList.toggle("hidden", k!==t.dataset.tab));
}));
function renderAdmin(){
  const a = load(LS.auth,null);
  $("#adminHello").textContent = "مرحبًا " + (a?a.user:"") + " — جميع التعديلات تُحفظ على هذا الجهاز";
  refreshCatSelect(); drawWorksTable(); drawCats(); drawOrder(); fillSettings(); drawCertAdmin();
}
function refreshCatSelect(){
  $("#fCategory").innerHTML = cats.map(c=>`<option>${esc(c)}</option>`).join("") || `<option value="">بدون تصنيف</option>`;
}
function drawWorksTable(){
  const sec = $("#adminFilterSection").value, st = $("#adminFilterStatus").value, q = ($("#adminSearch").value||"").trim();
  let list = works.slice().sort((a,b)=>(a.order||0)-(b.order||0));
  if(sec) list=list.filter(w=>w.section===sec);
  if(st==="published") list=list.filter(w=>w.published);
  if(st==="draft") list=list.filter(w=>!w.published);
  if(q) list=list.filter(w=>(w.title+w.owner).includes(q));
  const tb = $("#worksTable tbody"); tb.innerHTML="";
  if(!list.length){ tb.innerHTML=`<tr><td colspan="6" style="text-align:center;color:var(--muted)">لا توجد أعمال مطابقة</td></tr>`; return; }
  list.forEach(w=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><b>${esc(w.title)}</b><br><small class="muted">${esc(displayOwner(w))} • ${esc(w.category||"")}</small></td>
      <td>${w.section==="teachers"?"👩‍🏫 معلمات":"🧑‍🎓 طلاب"}</td>
      <td>${esc(TYPE_LABEL[w.type]||"")}</td>
      <td><span class="badge ${w.published?"pub":"draft"}">${w.published?"منشور":"مسودة"}</span></td>
      <td>${w.featured?"⭐":"—"}</td><td></td>`;
    const acts = tr.lastElementChild; acts.className="row-actions"; acts.style.display="flex";
    const mk=(t,fn,cls)=>{ const b=document.createElement("button"); b.className="btn btn-sm "+(cls||"btn-ghost"); b.textContent=t; b.addEventListener("click",fn); acts.appendChild(b); };
    mk("👁️ عرض", ()=>{ currentList = published(w.section).map(x=>x.id); if(!w.published) currentList=[w.id]; openDetail(w.id); });
    mk("✏️ تعديل", ()=>editWork(w.id));
    mk(w.published?"🙈 إخفاء":"🚀 نشر", ()=>{ w.published=!w.published; save(LS.works,works); drawWorksTable(); drawOrder(); toast(w.published?"تم نشر العمل":"تم إخفاؤه كمسودة","ok"); });
    mk("⭐", ()=>{ w.featured=!w.featured; save(LS.works,works); drawWorksTable(); drawOrder(); toast(w.featured?"أصبح مميزًا":"أُزيل من المميزة","ok"); });
    mk("🗑️ حذف", ()=>{ pendingDeleteId=w.id; $("#confirmText").textContent=`حذف "${w.title}" نهائيًا؟ لا يمكن التراجع.`; $("#confirmModal").classList.remove("hidden"); }, "btn-danger");
    tb.appendChild(tr);
  });
}
["adminFilterSection","adminFilterStatus"].forEach(id=>$("#"+id).addEventListener("change", drawWorksTable));
$("#adminSearch").addEventListener("input", drawWorksTable);
$("#confirmNo").addEventListener("click", ()=>{ $("#confirmModal").classList.add("hidden"); pendingDeleteId=null; });
$("#confirmYes").addEventListener("click", ()=>{
  if(pendingDeleteId==="__ALL__"){ works=[]; }
  else { works = works.filter(w=>w.id!==pendingDeleteId); }
  save(LS.works,works);
  $("#confirmModal").classList.add("hidden"); pendingDeleteId=null;
  drawWorksTable(); drawOrder(); toast("تم الحذف","ok");
});

/* editor */
const fileToDataURL = file => new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
function updateFileHint(){
  const t = $("#fType").value;
  $("#fileHint").textContent = t==="image" ? `الصور المسموحة: JPG/PNG/WEBP/GIF حتى ${LIMITS.image/1048576}MB` : t==="pdf" ? `ملفات PDF حتى ${LIMITS.pdf/1048576}MB` : t==="video" ? `فيديو MP4/WEBM حتى ${LIMITS.video/1048576}MB` : "أدخلي الرابط الخارجي بدل الملف";
  $("#linkBox").classList.toggle("hidden", t!=="link");
  $("#fFile").required = (t!=="link");
  $("#gradeLabel").textContent = $("#fSection").value==="teachers" ? "التخصص" : "الصف الدراسي";
  updatePreview();
}
$("#fType").addEventListener("change", updateFileHint);
$("#fSection").addEventListener("change", updateFileHint);
["fTitle","fOwner","fGrade","fDesc","fCategory","fLink"].forEach(id=>$("#"+id).addEventListener("input", updatePreview));
function updatePreview(){
  const box = $("#livePreview");
  const title = $("#fTitle").value||"عنوان العمل";
  const cov = box.dataset.cover || "";
  const type = $("#fType").value;
  box.dataset.title = title;
  if(type==="link"){ box.innerHTML = (cov?`<img src="${cov}">`:"🔗") + `<div><b>${esc(title)}</b><br><small class="muted">${esc($("#fLink").value||"رابط خارجي")}</small></div>`; }
  else if(box.dataset.file && type!=="link"){
    if(type==="image") box.innerHTML = `<img src="${box.dataset.file}">`;
    else if(type==="video") box.innerHTML = `<video src="${box.dataset.file}" controls></video>`;
    else if(type==="pdf") box.innerHTML = `<iframe src="${box.dataset.file}" style="width:100%;height:220px;border:none"></iframe>`;
  } else if(cov){ box.innerHTML = `<img src="${cov}"><div><b>${esc(title)}</b></div>`; }
  else box.innerHTML = `<span class="muted">اختاري ملفًا أو غلافًا لعرض المعاينة</span>`;
}
$("#fFile").addEventListener("change", async e=>{
  const f = e.target.files[0]; if(!f) return;
  const type = $("#fType").value;
  const lim = LIMITS[type]||LIMITS.image;
  const okExt = type==="image" ? /^image\//.test(f.type) : type==="pdf" ? f.type==="application/pdf" : type==="video" ? /^video\//.test(f.type) : true;
  if(!okExt){ toast("نوع الملف غير مناسب لنوع العمل المختار","err"); e.target.value=""; return; }
  if(f.size>lim){ toast(`حجم الملف كبير — الحد ${(lim/1048576)}MB`,"err"); e.target.value=""; return; }
  const bar = $("#uploadProgress"); bar.classList.remove("hidden");
  const p = bar.querySelector(".bar"); p.style.width="30%";
  try{ const url = await fileToDataURL(f); p.style.width="100%"; $("#livePreview").dataset.file = url; $("#livePreview").dataset.filename=f.name; updatePreview(); toast("تم تجهيز الملف للمعاينة","ok"); }
  catch(err){ toast("تعذر قراءة الملف","err"); }
  setTimeout(()=>bar.classList.add("hidden"), 600);
});
$("#fCover").addEventListener("change", async e=>{
  const f = e.target.files[0]; if(!f) return;
  if(!/^image\//.test(f.type)){ toast("الغلاف يجب أن يكون صورة","err"); return; }
  if(f.size>LIMITS.cover){ toast("صورة الغلاف كبيرة — الحد 5MB","err"); return; }
  $("#livePreview").dataset.cover = await fileToDataURL(f); updatePreview();
});
function editWork(id){
  const w = works.find(x=>x.id===id); if(!w) return;
  $$(".tab").forEach(x=>x.classList.toggle("active", x.dataset.tab==="editor"));
  ["works","cats","featured","settings","security"].forEach(k=>$("#tab-"+k).classList.add("hidden"));
  $("#tab-editor").classList.remove("hidden");
  $("#fId").value=w.id; $("#fTitle").value=w.title; $("#fOwner").value=w.owner;
  $("#fSection").value=w.section; $("#fType").value=w.type; $("#fGrade").value=w.grade||"";
  refreshCatSelect(); $("#fCategory").value=w.category||cats[0]||"";
  $("#fDesc").value=w.desc||""; $("#fPublished").checked=!!w.published;
  $("#fFeatured").checked=!!w.featured; $("#fDownload").checked=w.allowDownload!==false;
  $("#fLink").value=w.link||"";
  const box=$("#livePreview"); box.dataset.file=w.file||""; box.dataset.cover=w.cover||"";
  updateFileHint(); window.scrollTo({top:0,behavior:"smooth"});
}
$("#resetFormBtn").addEventListener("click", ()=>{ $("#workForm").reset(); $("#fId").value=""; const b=$("#livePreview"); b.dataset.file=""; b.dataset.cover=""; updateFileHint(); });
$("#workForm").addEventListener("submit", e=>{
  e.preventDefault();
  const title=$("#fTitle").value.trim(), owner=$("#fOwner").value.trim(), type=$("#fType").value;
  if(!title||!owner) return toast("أكملي العنوان واسم صاحب العمل","err");
  const box=$("#livePreview");
  const file = box.dataset.file||"", cover = box.dataset.cover||"";
  const link = $("#fLink").value.trim();
  if(type==="link" && !/^https?:\/\//i.test(link)) return toast("أدخلي رابطًا خارجيًا يبدأ بـ http","err");
  if(type!=="link" && !file){
    const id=$("#fId").value; const old = id? works.find(w=>w.id===id):null;
    if(!old || !old.file) return toast("اختاري ملف العمل أولًا","err");
  }
  const id = $("#fId").value || uid();
  const old = works.find(w=>w.id===id);
  const rec = { id, section:$("#fSection").value, type, title, owner, grade:$("#fGrade").value.trim(), category:$("#fCategory").value, desc:$("#fDesc").value.trim(), published:$("#fPublished").checked, featured:$("#fFeatured").checked, allowDownload:$("#fDownload").checked, file:file||(old?old.file:null), cover:cover||(old?old.cover:null), link:type==="link"?link:(link||(old?old.link:"")), order: old? (old.order||0) : (Math.max(0,...works.map(w=>w.order||0))+1), createdAt: old? old.createdAt : Date.now() };
  if(id && old){ Object.assign(old, rec); } else works.push(rec);
  if(!save(LS.works, works)) return;
  toast("💾 تم حفظ العمل بنجاح","ok");
  $("#workForm").reset(); $("#fId").value=""; box.dataset.file=""; box.dataset.cover=""; updateFileHint();
  drawWorksTable(); drawOrder();
  $$(".tab").forEach(x=>x.classList.toggle("active", x.dataset.tab==="works"));
  $("#tab-editor").classList.add("hidden"); $("#tab-works").classList.remove("hidden");
});

/* cats */
function drawCats(){
  const el=$("#catList"); el.innerHTML="";
  cats.forEach((c,i)=>{
    const s=document.createElement("span"); s.className="chip";
    s.innerHTML=`${esc(c)} <button title="حذف">✕</button>`;
    s.querySelector("button").addEventListener("click", ()=>{
      if(works.some(w=>w.category===c)) return toast("التصنيف مستخدم في أعمال — غيّريها أولًا","err");
      cats.splice(i,1); save(LS.cats,cats); refreshCatSelect(); drawCats(); toast("تم حذف التصنيف","ok");
    });
    el.appendChild(s);
  });
}
$("#addCatBtn").addEventListener("click", ()=>{
  const v=$("#newCat").value.trim(); if(!v) return;
  if(cats.includes(v)) return toast("التصنيف موجود مسبقًا","err");
  cats.push(v); save(LS.cats,cats); $("#newCat").value=""; refreshCatSelect(); drawCats(); fillFilters(); toast("تمت إضافة التصنيف","ok");
});

/* order */
function drawOrder(){
  const el=$("#orderList"); el.innerHTML="";
  works.slice().sort((a,b)=>(a.order||0)-(b.order||0)).forEach(w=>{
    const d=document.createElement("div"); d.className="order-item";
    d.innerHTML=`<span>${w.featured?"⭐":"▫️"}</span><span class="grow"><b>${esc(w.title)}</b><br><small class="muted">${w.section==="teachers"?"معلمات":"طلاب"} • ${w.published?"منشور":"مسودة"}</small></span>`;
    const up=document.createElement("button"); up.textContent="▲"; up.title="تقديم";
    const dn=document.createElement("button"); dn.textContent="▼"; dn.title="تأخير";
    up.addEventListener("click", ()=>moveOrder(w.id,-1)); dn.addEventListener("click", ()=>moveOrder(w.id,1));
    d.appendChild(up); d.appendChild(dn); el.appendChild(d);
  });
}
function moveOrder(id, dir){
  const arr = works.slice().sort((a,b)=>(a.order||0)-(b.order||0));
  const i = arr.findIndex(w=>w.id===id), j = i+dir;
  if(i<0||j<0||j>=arr.length) return;
  const a=arr[i], b=arr[j]; const t=a.order; a.order=b.order; b.order=t;
  save(LS.works,works); drawOrder(); drawWorksTable();
}

/* settings */
function fillSettings(){
  $("#sSchool").value=settings.school; $("#sGallery").value=settings.gallery;
  $("#sWelcome").value=settings.welcome; $("#sLogo").value=settings.logo||"";
  $("#sPrivacy").value=settings.privacy||"first";
  $("#sPrimary").value=settings.primary||"#0ea5a0"; $("#sGold").value=settings.gold||"#c9a227";
  $("#secUser").value=(load(LS.auth,null)||{}).user||"";
}
$("#saveSettingsBtn").addEventListener("click", ()=>{
  settings = { school:$("#sSchool").value.trim()||settings.school, gallery:$("#sGallery").value.trim()||settings.gallery, welcome:$("#sWelcome").value.trim(), logo:$("#sLogo").value.trim()||"🎨", privacy:$("#sPrivacy").value, primary:$("#sPrimary").value, gold:$("#sGold").value };
  save(LS.settings,settings); renderHome(); toast("تم حفظ الإعدادات","ok");
});
$("#reseedBtn").addEventListener("click", ()=>{ works=seedWorks(); cats=seedCats(); save(LS.works,works); save(LS.cats,cats); drawWorksTable(); drawOrder(); drawCats(); refreshCatSelect(); toast("تمت استعادة البيانات التوضيحية","ok"); });
$("#wipeBtn").addEventListener("click", ()=>{ pendingDeleteId="__ALL__"; $("#confirmText").textContent="حذف كل الأعمال نهائيًا؟"; $("#confirmModal").classList.remove("hidden"); });
$("#changePassBtn").addEventListener("click", async ()=>{
  const a=load(LS.auth,null); if(!a) return;
  const nu=$("#secUser").value.trim()||a.user, old=$("#secOld").value, nw=$("#secNew").value;
  if((await sha256(a.user+"::"+old))!==a.hash) return toast("كلمة المرور الحالية غير صحيحة","err");
  if(nw.length<8) return toast("الجديدة 8 أحرف على الأقل","err");
  save(LS.auth,{user:nu,hash:await sha256(nu+"::"+nw)});
  $("#secOld").value=""; $("#secNew").value=""; toast("تم تحديث بيانات الدخول","ok");
});

  /* certificates admin */
  let certs = load(LS.certs, []);
  function certSave(){ return save(LS.certs, certs); }
  function certCode(){ return "CREAT-"+new Date().getFullYear()+"-"+Math.random().toString(36).toUpperCase().slice(2,6); }
  function drawCertAdmin(){
    const tb = $("#adminCertListTable"); if(!tb) return;
    tb.innerHTML="";
    if(!certs.length){ tb.innerHTML=`<tr><td colspan="6" style="text-align:center;color:var(--muted)">لا توجد شهادات بعد</td></tr>`; return; }
    certs.slice().reverse().forEach(c=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${esc(c.workTitle||"")}</td><td>${esc(c.participantName)}</td><td>${c.section==="teachers"?"👩‍🏫 معلمات":"🧑‍🎓 طلاب"}</td><td style="font-family:monospace;font-size:12px">${esc(c.code)}</td><td>${esc(c.date||"")}</td><td></td>`;
      const acts = tr.lastElementChild; acts.style.display="flex"; acts.style.gap="6px";
      const mk=(t,fn,cls)=>{ const b=document.createElement("button"); b.className="btn btn-sm "+(cls||"btn-ghost"); b.textContent=t; b.addEventListener("click",fn); acts.appendChild(b); };
      mk("🗑️", ()=>{ certs=certs.filter(x=>x.id!==c.id); certSave(); drawCertAdmin(); toast("تم حذف الشهادة","ok"); }, "btn-danger");
      tb.appendChild(tr);
    });
  }
  $("#adminCertCreate").addEventListener("click", ()=>{
    const workId = $("#adminCertWorkId").value.trim();
    const name = $("#adminCertName").value.trim();
    const date = $("#adminCertDate").value;
    const message = $("#adminCertMessage").value.trim();
    if(!workId||!name||!date) return toast("أكملي معرف العمل واسم المشاركة والتاريخ","err");
    const w = works.find(x=>x.id===workId);
    if(!w) return toast("المWork غير موجود","err");
    if(!w.published) return toast("يجب أن يكون العمل منشورًا أولاً قبل إنشاء الشهادة","err");
    if(certs.some(c=>c.workId===workId)) return toast("هناك شهادة صادرة بالفعل لهذا العمل","err");
    const cert = {
      id: "c"+Date.now().toString(36)+Math.random().toString(36).slice(2,4),
      code: certCode(),
      workId: workId,
      participantName: name,
      workTitle: w.title,
      schoolName: settings.school,
      galleryName: settings.gallery,
      date: date,
      message: message || "تقديرًا لمشاركتكِ الإبداعية في معرض الإبداع المدرسي.",
      section: w.section,
      approvedAt: Date.now(),
      downloads: 0,
      views: 0
    };
    certs.push(cert);
    if(!certSave()) return;
    toast("تم إنشاء الشهادة — الرمز: "+cert.code,"ok");
    $("#adminCertWorkId").value=""; $("#adminCertName").value=""; $("#adminCertDate").value=""; $("#adminCertMessage").value="";
    drawCertAdmin();
  });
  $("#adminCertRefresh").addEventListener("click", drawCertAdmin);
  $("#adminCertDate").value = new Date().toISOString().split("T")[0];

  /* PWA install popup */
  const installPopup = $("#installPopup");
  const installBtn = $("#installBtn");
  const installLater = $("#installLater");
  const installClose = $("#installClose");
  let deferredInstallPrompt = null;

  function isStandalone(){
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  if(!isStandalone() && installPopup){
    window.addEventListener("beforeinstallprompt", (e)=>{
      e.preventDefault();
      deferredInstallPrompt = e;
      setTimeout(()=>{ installPopup.classList.add("open"); }, 1500);
    });
  }

  function closeInstallPopup(){ if(installPopup) installPopup.classList.remove("open"); }
  if(installClose) installClose.addEventListener("click", closeInstallPopup);
  if(installLater) installLater.addEventListener("click", closeInstallPopup);

  if(installBtn){
    installBtn.addEventListener("click", async ()=>{
      if(deferredInstallPrompt){
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if(outcome === "accepted"){ toast("تمت إضافة التطبيق إلى شاشتك الرئيسية","ok"); }
        deferredInstallPrompt = null;
        closeInstallPopup();
      } else {
        toast("من قائمة المتصفح اختاري 'إضافة إلى الشاشة الرئيسية'","ok");
        closeInstallPopup();
      }
    });
  }

  /* init */
  updateFileHint();
  nav("home");
})();
