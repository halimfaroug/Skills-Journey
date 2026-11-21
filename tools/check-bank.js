// فحص آلي لبنك الأسئلة والواجهة: يُشغَّل في GitHub Actions مع كل تحديث.
// node tools/check-bank.js  → يخرج برمز 1 عند وجود أي خطأ.
const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.join(__dirname,"..");const errors=[],warn=[];
const ctx={window:{}};vm.createContext(ctx);
const files=fs.readdirSync(path.join(root,"data")).filter(f=>/^g\d+\.js$/.test(f)).sort((a,b)=>parseInt(a.slice(1))-parseInt(b.slice(1)));
for(const f of files){try{vm.runInContext(fs.readFileSync(path.join(root,"data",f),"utf8"),ctx,{filename:f})}catch(e){errors.push(`${f}: لا يمكن قراءة الملف (${e.message})`)}}
const D=ctx.window.SJ_DATA||[];if(!D.length)errors.push("لا توجد بيانات");
const ids=new Set(),lids=new Set();let nQ=0,nL=0;
const strip=t=>String(t||"").replace(/[ً-ْـ⁦-⁩]/g,"").replace(/\s+/g," ").trim();
for(const g of D)for(const s of g.subjects)for(const p of s.parts)for(const c of p.chapters)for(const l of c.lessons){
  nL++;if(lids.has(l.id))errors.push(`درس مكرر: ${l.id}`);lids.add(l.id);
  if(!l.t)errors.push(`درس بلا عنوان: ${l.id}`);if(!l.q||!l.q.length)errors.push(`درس بلا أسئلة: ${l.id}`);
  (l.q||[]).forEach((q,i)=>{nQ++;const where=`${l.id}#${i} (${q.id})`;
    if(ids.has(q.id))errors.push(`معرّف سؤال مكرر: ${where}`);ids.add(q.id);
    if(!strip(q.prompt))errors.push(`سؤال بلا نص: ${where}`);
    if(!Array.isArray(q.options)||q.options.length<2)errors.push(`أقل من خيارين: ${where}`);
    const oids=(q.options||[]).map(o=>o.id);if(new Set(oids).size!==oids.length)errors.push(`معرّف خيار مكرر: ${where}`);
    if(!oids.includes(q.correctOptionId))errors.push(`الإجابة المعتمدة ليست من الخيارات: ${where}`);
    const txt=(q.options||[]).map(o=>String(o.text).trim());if(new Set(txt).size!==txt.length)errors.push(`خياران متطابقان: ${where}`);
    if(txt.some(t=>!t))errors.push(`خيار فارغ: ${where}`);
  });
}
// الواجهة: نص برمجي سليم، ولا صيغ خطاب مؤنثة أو مذكرة موجّهة للطالب
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach((src,i)=>{try{new vm.Script(src,{filename:`index.html script ${i+1}`})}catch(e){errors.push(`خطأ في نص البرنامج ${i+1}: ${e.message}`)}});
const ui=scripts.join("\n");
const gendered=["اختاري","أجيبي","ابدئي","أكملي","اضغطي","انطلقي","حدّدي","أحسنتِ","أنتِ","لكِ","لديكِ","تحتاجين","تريدين","طالب أم طالبة"];
gendered.forEach(w=>{if(ui.includes(w))errors.push(`صيغة خطاب غير محايدة في الواجهة: «${w}»`)});
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
files.forEach(f=>{if(!sw.includes(`./data/${f}`))errors.push(`sw.js لا يخزّن data/${f} للعمل دون اتصال`)});
(html.match(/<script src="([^"]+)"/g)||[]).forEach(t=>{const f=t.match(/src="([^"]+)"/)[1];if(!/^https?:/.test(f)&&!fs.existsSync(path.join(root,f)))errors.push(`ملف مفقود: ${f}`)});
console.log(`الصفوف: ${D.map(g=>g.g).join("، ")} · الدروس: ${nL} · الأسئلة: ${nQ}`);
if(errors.length){console.error(`❌ ${errors.length} خطأ:`);errors.slice(0,200).forEach(e=>console.error(" - "+e));process.exit(1)}
console.log("✅ لا أخطاء");
