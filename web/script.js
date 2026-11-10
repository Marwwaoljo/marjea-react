const $ = (selector, root = document) => root.querySelector(selector);
const page = $('#page-content');
const state = {
  lang: localStorage.getItem('marjea.lang') || 'ar',
  dark: localStorage.getItem('marjea.theme') === 'dark',
};

const dictionary = {
  ar: {how:'كيف يعمل مَرْجِع',plans:'الخطط',technical:'التوثيق التقني',signin:'دخول الجهات',home:'الرئيسية',faq:'الأسئلة الشائعة',contact:'تواصل معنا',footerDesc:'منصة سعودية لحوكمة المعلومات ومقارنة الادعاءات بالمراجع المعتمدة وتوثيق الاختلافات لدعم المراجعة البشرية.',siteLinks:'روابط الموقع',manualOnly:'الإدخال يدوي والمراجعة بشرية'},
  en: {how:'How MARJEA works',plans:'Plans',technical:'Technical documentation',signin:'Institution sign in',home:'Home',faq:'FAQ',contact:'Contact us',footerDesc:'A Saudi information-governance platform for comparing claims with approved references and documenting differences to support human review.',siteLinks:'Navigation',manualOnly:'Manual input · Human review'},
};

const homeTemplate = () => `
  <section class="marjea-hero" aria-labelledby="landing-title" dir="${state.lang==='ar'?'rtl':'ltr'}">
    <div class="marjea-hero__media" aria-hidden="true"><picture class="marjea-hero__picture"><source type="image/webp" srcset="/assets/media/home/riyadh-hero-approved.webp"><img class="marjea-hero__image" src="/assets/media/home/riyadh-hero-approved.png" alt="" fetchpriority="high"></picture></div><div class="marjea-hero__overlay" aria-hidden="true"></div>
    <div class="marjea-hero__content"><span class="marjea-hero__eyebrow">${state.lang==='ar'?'حوكمة المعلومات':'INFORMATION GOVERNANCE'}</span><h1 id="landing-title">${state.lang==='ar'?'من المرجع الرسمي، نكتشف أول انحراف':'From the official reference, we detect the first deviation'}</h1><p>${state.lang==='ar'?'منصة سعودية لحوكمة المعلومات ومقارنة الادعاءات بالمراجع المعتمدة وتوثيق الاختلافات لدعم المراجعة البشرية':'A Saudi information-governance platform for comparing claims with approved references and documenting differences to support human review'}</p><nav class="marjea-hero__actions" aria-label="${state.lang==='ar'?'روابط الصفحة الرئيسية':'Homepage actions'}"><a class="marjea-btn-primary" href="/workspace">${state.lang==='ar'?'استكشف مساحة العمل':'Explore the workspace'} ↗</a><a class="marjea-btn-secondary" href="#workflow">${state.lang==='ar'?'كيف يعمل مَرْجِع':'How MARJEA works'} ↓</a></nav><a class="marjea-hero__demo-link" href="/ofuq-demo">${state.lang==='ar'?'جرّب نموذج أُفُق التفاعلي · ببيانات محاكاة':'Try the interactive OFUQ model · simulated data'} ←</a></div>
  </section>
  <section class="editorial-section marjea-section marjea-section--light" id="problem"><div class="container"><div class="problem-v2"><span class="section-kicker">${state.lang==='ar'?'التحدي':'THE CHALLENGE'}</span><h2 class="problem-v2__title">${state.lang==='ar'?'المعلومة الرسمية لا تختفي، بل تتغيّر أثناء تداولها':'Official information does not disappear. It changes as it spreads.'}</h2><p class="problem-v2__lead">${state.lang==='ar'?'تنشر الجهة معلومة دقيقة، ثم يعيد آخرون نشرها بعد تغيير عنصر واحد: المنطقة، أو الموعد، أو الجهة المصدرة. ومع الانتشار تصبح النسخة المتغيّرة هي ما يعرفه الناس.':'An institution publishes accurate information. Others repost it with one element changed — the region, date, or issuing body.'}</p><ul class="problem-v2__cards"><li class="problem-v2__card"><h3>${state.lang==='ar'?'تحوّر جغرافي':'Geographic shift'}</h3><dl class="problem-v2__row"><dt>${state.lang==='ar'?'الرسمي':'Official'}</dt><dd>${state.lang==='ar'?'الخدمة متاحة في منطقة الرياض':'Service available in Riyadh region'}</dd></dl><dl class="problem-v2__row"><dt>${state.lang==='ar'?'المتداول':'Circulating'}</dt><dd>${state.lang==='ar'?'الخدمة متاحة في جميع المناطق':'Service available in <mark>all regions</mark>'}</dd></dl></li><li class="problem-v2__card"><h3>${state.lang==='ar'?'تحوّر زمني':'Time shift'}</h3><dl class="problem-v2__row"><dt>${state.lang==='ar'?'الرسمي':'Official'}</dt><dd>${state.lang==='ar'?'يبدأ التسجيل في 10 أكتوبر':'Registration opens October 10'}</dd></dl><dl class="problem-v2__row"><dt>${state.lang==='ar'?'المتداول':'Circulating'}</dt><dd>${state.lang==='ar'?'يبدأ التسجيل اليوم':'Registration opens <mark>today</mark>'}</dd></dl></li><li class="problem-v2__card"><h3>${state.lang==='ar'?'تحوّر في النسبة':'Attribution shift'}</h3><dl class="problem-v2__row"><dt>${state.lang==='ar'?'الرسمي':'Official'}</dt><dd>${state.lang==='ar'?'أعلنت الهيئة عن الخدمة':'The Authority announced the service'}</dd></dl><dl class="problem-v2__row"><dt>${state.lang==='ar'?'المتداول':'Circulating'}</dt><dd>${state.lang==='ar'?'أعلنت الوزارة عن الخدمة':'The <mark>Ministry</mark> announced the service'}</dd></dl></li></ul><p class="problem-v2__caption">${state.lang==='ar'?'أمثلة توضيحية':'Illustrative examples'}</p><p class="problem-v2__closing">${state.lang==='ar'?'مَرْجِع يكتشف هذا التحوّر مبكرًا، ويضع الدليل أمام المختص ليقرر.':'MARJEA surfaces the difference and puts evidence in front of the reviewer.'}</p></div></div></section>
  <section class="editorial-section" id="workflow"><div class="container"><div class="section-heading"><span class="section-kicker">${state.lang==='ar'?'منهجية العمل':'WORKFLOW'}</span><h2 class="section-title">${state.lang==='ar'?'سجل واضح. مراجعة مسؤولة.':'A clear record. Accountable review.'}</h2><p class="section-lead">${state.lang==='ar'?'تبدأ المنظومة من مرجع رسمي تسجله الجهة، ثم تقارن به المحتوى الذي يقدمه المستخدم، وتوثق الاختلافات ليتخذ المختص قراره.':'The workflow starts with an official reference recorded by the institution, compares user-submitted content, and documents differences for human review.'}</p></div><div class="workflow-grid"><article class="workflow-step"><h3>${state.lang==='ar'?'أنشئ مساحة الجهة':'Create an institution space'}</h3><p>${state.lang==='ar'?'سجّل المؤسسة وفريقها ضمن مساحة مستقلة.':'Register the institution and its team in a separate workspace.'}</p></article><article class="workflow-step"><h3>${state.lang==='ar'?'دوّن مرجعاً رسمياً':'Record an official reference'}</h3><p>${state.lang==='ar'?'أضف بيانات المرجع ومصدره وسجله.':'Add the reference details and source.'}</p></article><article class="workflow-step"><h3>${state.lang==='ar'?'قدّم محتوى يدوياً':'Submit content manually'}</h3><p>${state.lang==='ar'?'أدخل مقتطفاً أو رابطاً بنفسك دون بث مباشر.':'Submit a snippet or link manually; no live feed.'}</p></article><article class="workflow-step"><h3>${state.lang==='ar'?'راجع واتخذ القرار':'Review and decide'}</h3><p>${state.lang==='ar'?'تُوثق المسودات والقرارات بيد مراجع بشري.':'Drafts and decisions remain under human responsibility.'}</p></article></div></div></section>
  <section class="editorial-section"><div class="container"><div class="section-heading"><span class="section-kicker">${state.lang==='ar'?'قدرات المنصة':'PLATFORM CAPABILITIES'}</span><h2 class="section-title">${state.lang==='ar'?'حوكمة المعلومات من الإدخال إلى القرار':'Information governance from input to decision'}</h2></div><div class="feature-grid"><article class="feature-card"><h3>${state.lang==='ar'?'مرجعيات موثقة':'Reference registry'}</h3><p>${state.lang==='ar'?'مساحة منظمة لتسجيل المراجع الرسمية ومعلوماتها ومصادرها.':'A structured space for official references, metadata, and sources.'}</p></article><article class="feature-card"><h3>${state.lang==='ar'?'مقارنة الادعاءات':'Claim comparison'}</h3><p>${state.lang==='ar'?'إظهار مواضع الاختلاف بين المرجع والمحتوى المقدم.':'Highlight differences between references and submitted content.'}</p></article><article class="feature-card"><h3>${state.lang==='ar'?'مراجعة بشرية':'Human review'}</h3><p>${state.lang==='ar'?'لا يصدر النظام حكماً نهائياً ولا يستبدل قرار المختص.':'The system does not issue final judgments or replace reviewers.'}</p></article></div></div></section>
  <section class="editorial-section"><div class="container"><div class="risk-panel"><div><span class="section-kicker">${state.lang==='ar'?'رؤية المخاطر':'RISK INTELLIGENCE'}</span><h2 class="section-title">${state.lang==='ar'?'افهم سياق المعلومة قبل اتخاذ القرار':'Understand the context before deciding'}</h2><p>${state.lang==='ar'?'تساعد الخرائط والتمثيلات البصرية على قراءة السياق الجغرافي والمعلوماتي ضمن السجلات المتاحة، دون ادعاء رصد شامل أو تحقق تلقائي.':'Visual context helps reviewers understand geographic and informational context without claiming comprehensive monitoring or automatic verification.'}</p></div><img class="risk-map" src="/assets/media/home/saudi-risk-map.jpg" alt="${state.lang==='ar'?'خريطة توضيحية للمخاطر':'Illustrative risk map'}" loading="lazy"></div></div></section>
  <section class="editorial-section"><div class="container"><div class="section-heading"><span class="section-kicker">${state.lang==='ar'?'حلول مترابطة':'CONNECTED SOLUTIONS'}</span><h2 class="section-title">${state.lang==='ar'?'كل خطوة لها سجل ومسؤول':'Every step has a record and an owner'}</h2></div><div class="feature-grid"><article class="feature-card"><h3>${state.lang==='ar'?'إدارة الحالات':'Case management'}</h3><p>${state.lang==='ar'?'إنشاء الحالات وربطها بالأدلة ومتابعة مراحلها.':'Create cases, attach evidence, and follow their progress.'}</p></article><article class="feature-card"><h3>${state.lang==='ar'?'إدارة الفريق':'Team management'}</h3><p>${state.lang==='ar'?'دعوات أعضاء وصلاحيات مرتبطة بالجهة.':'Member invitations and institution-scoped permissions.'}</p></article><article class="feature-card"><h3>${state.lang==='ar'?'سجل التدقيق':'Audit trail'}</h3><p>${state.lang==='ar'?'توثيق الإجراءات والقرارات ضمن حدود الصلاحيات.':'Record actions and decisions within permission boundaries.'}</p></article></div></div></section>
  <section class="editorial-section"><div class="container"><div class="section-heading"><span class="section-kicker">${state.lang==='ar'?'الحوكمة والمسؤولية':'GOVERNANCE'}</span><h2 class="section-title">${state.lang==='ar'?'الذكاء الاصطناعي مساعد، والقرار للإنسان':'AI assists. People decide.'}</h2><p class="section-lead">${state.lang==='ar'?'قد يساعد التحليل الدلالي في تنظيم أوجه التشابه والاختلاف، لكنه لا يثبت الحقيقة ولا يتخذ قرار اعتماد أو تصعيد بصورة مستقلة.':'Semantic analysis can help organize similarities and differences, but it does not establish truth or independently approve or escalate a case.'}</p></div><div class="governance-list"><div class="governance-item">${state.lang==='ar'?'المراجع تسجلها الجهة وتبقى مسؤولة عن مصدرها.':'Institutions own the references they record.'}</div><div class="governance-item">${state.lang==='ar'?'المحتوى يقدم يدوياً ولا يوجد موجز مباشر في المرحلة الحالية.':'Content is submitted manually; no live feed in this phase.'}</div><div class="governance-item">${state.lang==='ar'?'التحليل لا يحل محل التحقق والمراجعة البشرية.':'Analysis does not replace verification and human review.'}</div><div class="governance-item">${state.lang==='ar'?'كل إجراء حساس يخضع للصلاحيات والضوابط.':'Sensitive actions remain subject to permissions and safeguards.'}</div></div></div></section>
  <section class="editorial-section"><div class="container"><div class="section-heading"><span class="section-kicker">${state.lang==='ar'?'حالة المنصة':'PLATFORM STATUS'}</span><h2 class="section-title">${state.lang==='ar'?'نطاق المرحلة الحالية':'Current phase scope'}</h2></div><div class="status-box" id="public-status"><span>${state.lang==='ar'?'جاري تحميل حالة المنصة…':'Loading platform status…'}</span></div></div></section>
  <section class="editorial-section" id="faq"><div class="container"><div class="section-heading"><span class="section-kicker">FAQ</span><h2 class="section-title">${state.lang==='ar'?'أسئلة شائعة':'Frequently asked questions'}</h2></div><div class="faq-list"><details class="faq-item"><summary>${state.lang==='ar'?'هل تقوم مَرْجِع برصد المنصات تلقائياً؟':'Does MARJEA automatically monitor platforms?'}</summary><p>${state.lang==='ar'?'لا. نطاق المرحلة الحالية يعتمد على إدخال المراجع والمحتوى يدوياً، ولا يوجد بث مباشر أو رصد آلي مفعّل.':'No. The current phase uses manually entered references and submitted content; live feeds and automated monitoring are not enabled.'}</p></details><details class="faq-item"><summary>${state.lang==='ar'?'هل يتخذ الذكاء الاصطناعي القرار النهائي؟':'Does AI make the final decision?'}</summary><p>${state.lang==='ar'?'لا. يساعد التحليل في تنظيم الأدلة، بينما يبقى القرار النهائي للمراجع البشري المخوّل.':'No. Analysis helps organize evidence; the final decision belongs to an authorized human reviewer.'}</p></details><details class="faq-item"><summary>${state.lang==='ar'?'هل بيانات كل جهة منفصلة؟':'Is each institution data isolated?'}</summary><p>${state.lang==='ar'?'تعتمد المنصة على صلاحيات مرتبطة بالجهة وضوابط وصول على الخادم وقاعدة البيانات.':'The platform uses institution-scoped permissions and server/database access controls.'}</p></details></div></div></section>
  <section class="editorial-section"><div class="container"><div class="final-cta"><h2>${state.lang==='ar'?'ابدأ ببناء سجل معلومات واضح':'Start building a clear information record'}</h2><p>${state.lang==='ar'?'أنشئ مساحة مؤسستك وابدأ بتوثيق المراجع وتنظيم المراجعة.':'Create your institution workspace and begin recording references and organizing reviews.'}</p><a class="cta-link" href="/sign-in">${state.lang==='ar'?'الدخول إلى مَرْجِع':'Enter MARJEA'} ↗</a></div></div></section>`;

const routeCopy = {
  '/plans': ['الخطط','بداية عملية بحدود صريحة','توضح الخطط نطاق المرحلة الحالية: إنشاء الجهات والأعضاء، وتسجيل المراجع والمحتوى يدوياً، وإنشاء الحالات ومراجعتها بشرياً.'],
  '/technical': ['التوثيق التقني','البنية التقنية ومبادئ الحماية','تعتمد مَرْجِع على خادم API للتحقق من الهوية والصلاحيات، وقاعدة PostgreSQL مع عزل بيانات الجهات، وتكاملات مستقلة لخدمات الهوية والتحليل والإشعارات.'],
  '/competition-showcase': ['عرض المنصة','مَرْجِع لحوكمة المعلومات','عرض تعريفي يوضح رحلة المرجع والمحتوى والمقارنة والمراجعة البشرية.'],
  '/presentation': ['العرض التعريفي','منهجية مَرْجِع','تبدأ الرحلة بتسجيل المرجع الرسمي، ثم إدخال المحتوى، ثم تنظيم الفروقات والأدلة لعرضها على المراجع المختص.'],
  '/ofuq-demo': ['نموذج أُفُق التفاعلي','بيانات محاكاة','هذه مساحة عرض توضيحية ببيانات تجريبية فقط، ولا تمثل بيانات جهات حقيقية أو قرارات تشغيلية.'],
  '/afaq': ['آفاق','مساحة عرض آفاق','بوابة العرض التعريفي لخدمات آفاق.'],
  '/afaq/presentation': ['عرض آفاق','العرض التعريفي','محتوى العرض التعريفي لآفاق.'],
  '/not-found': ['الصفحة غير موجودة','تعذر العثور على الصفحة','تحقق من الرابط أو عُد إلى الصفحة الرئيسية.'],
};
const privateRoutes = new Set(['/auth/continue','/workspace','/dashboard','/marjea/home','/platform/institution-reviews','/individual','/individual/profile','/account','/account/setup','/onboarding','/analyze','/login','/afaq/workspace']);
const knownRoutes = ['/plans','/technical','/competition-showcase','/presentation','/ofuq-demo','/afaq','/afaq/presentation','/afaq/workspace','/workspace','/dashboard','/marjea/home','/platform/institution-reviews','/individual/profile','/individual','/account/setup','/account','/onboarding','/analyze','/login','/sign-in','/sign-up','/member-invitation/sign-up','/member-invitation','/auth/continue'];

function pageCard(title, subtitle, body, actions='') { return `<section class="page-frame"><article class="page-card"><span class="section-kicker">MARJEA · ${state.lang==='ar'?'مَرْجِع':'INFORMATION GOVERNANCE'}</span><h1>${title}</h1><h2>${subtitle}</h2><p>${body}</p>${actions}<p class="page-notice">${state.lang==='ar'?'هذه النسخة الأمامية قيد التحويل التدريجي. لم يتم تفعيل أي إجراء حساس في الواجهة المستقلة قبل ربطه والتحقق منه على الخادم.':'This frontend is being migrated incrementally. Sensitive actions remain disabled until connected to and authorized by the server.'}</p></article></section>`; }

function renderRoute() {
  const path = location.pathname.replace(/\/$/,'') || '/';
  $('#site-footer').hidden = false;
  $('#site-header').hidden = false;
  if (path === '/') { page.innerHTML = homeTemplate(); loadPublicStatus(); return; }
  if (privateRoutes.has(path) || path.startsWith('/workspace/')) {
    const title = path.startsWith('/workspace') ? 'مساحة عمل الجهة' : path === '/individual' ? 'مساحة الفرد' : path === '/platform/institution-reviews' ? 'مراجعات الجهات' : 'مساحة مَرْجِع';
    page.innerHTML = pageCard(title, 'يلزم التحقق من الحساب والصلاحية', 'هذه الصفحة لا تعرض بيانات الجهة أو الفرد من المتصفح مباشرة. بعد إكمال ربط Clerk بالواجهة، سيُطلب إثبات الجلسة، ثم يتحقق الخادم من نوع الحساب والجهة والعضوية والدور قبل إرجاع البيانات.', `<div class="page-actions"><a href="/sign-in">تسجيل الدخول</a><a href="/account">إنشاء حساب</a></div>`);
    return;
  }
  if (path === '/sign-in' || path === '/sign-up' || path === '/afaq/sign-in' || path === '/afaq/sign-up' || path === '/member-invitation' || path === '/member-invitation/sign-up') {
    const signup = path.includes('sign-up');
    page.innerHTML = pageCard(path.startsWith('/member-invitation')?'دعوة عضو':(signup?'إنشاء حساب':'تسجيل الدخول'), signup?'إنشاء حساب موثّق':'الدخول الآمن', 'سيتم ربط هذه الشاشة بـ Clerk باستخدام مفاتيح النشر العامة فقط. سيبقى التحقق من البريد الإلكتروني والهاتف ونوع الحساب على التدفقات الحالية، ويُنفّذ التحقق من الصلاحيات على الخادم.', `<div class="page-actions"><a href="/technical">متطلبات المصادقة</a><a href="/">العودة للرئيسية</a></div>`);
    return;
  }
  const content = routeCopy[path] || (path.startsWith('/afaq') ? ['آفاق','بوابة آفاق','صفحة ضمن منظومة العرض.'] : null);
  if (content) { page.innerHTML = pageCard(...content, `<div class="page-actions"><a href="/">الرئيسية</a><a href="/sign-in">دخول الجهات</a></div>`); return; }
  page.innerHTML = pageCard('الصفحة غير موجودة','تعذر العثور على الصفحة','تحقق من الرابط ثم حاول مرة أخرى.', '<div class="page-actions"><a href="/">العودة للرئيسية</a></div>');
}

async function loadPublicStatus() {
  const box = $('#public-status'); if (!box) return;
  try {
    const response = await fetch('/api/v1/public/status', { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error('status unavailable');
    const data = await response.json();
    const ar = state.lang === 'ar';
    const label = value => value ? (ar?'مفعّل':'Enabled') : (ar?'غير مفعّل':'Not enabled');
    box.innerHTML = `<span>${ar?'المراجع':'References'}: <strong>${data.officialReferenceAdapter === 'manual_entry_only' ? (ar?'إدخال يدوي':'Manual entry') : '—'}</strong></span><span>${ar?'المحتوى':'Content'}: <strong>${data.circulatingContentAdapter === 'manual_submission_only' ? (ar?'تقديم يدوي':'Manual submission') : '—'}</strong></span><span>${ar?'المراقبة الآلية':'Automated monitoring'}: <strong>${label(data.automatedMonitoringConfigured)}</strong></span><span>${ar?'النشر الخارجي':'External publishing'}: <strong>${label(data.externalPublishingEnabled)}</strong></span>`;
  } catch { box.textContent = state.lang==='ar'?'تعذر تحميل حالة المنصة حالياً.':'Platform status is currently unavailable.'; }
}
function applyChrome() {
  document.documentElement.lang = state.lang; document.documentElement.dir = state.lang==='ar'?'rtl':'ltr';
  document.documentElement.classList.toggle('dark',state.dark);
  localStorage.setItem('marjea.lang',state.lang); localStorage.setItem('marjea.theme',state.dark?'dark':'light');
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const key=el.dataset.i18n; if(dictionary[state.lang][key]) el.textContent=dictionary[state.lang][key]; });
  $('#lang-toggle').textContent=state.lang==='ar'?'EN':'عربي'; $('#theme-toggle').textContent=state.dark?'☀':'◐';
}

$('#lang-toggle').addEventListener('click',()=>{state.lang=state.lang==='ar'?'en':'ar';applyChrome();renderRoute();});
$('#theme-toggle').addEventListener('click',()=>{state.dark=!state.dark;applyChrome();});
const marjeaSideDrawer = document.querySelector('#mobile-nav');
const marjeaSideDrawerButton = document.querySelector('#mobile-menu-button');
const marjeaSideDrawerBackdrop = document.querySelector('#drawer-backdrop');

function setDrawerOpen(open) {
  if (!marjeaSideDrawer || !marjeaSideDrawerButton || !marjeaSideDrawerBackdrop) return;

  marjeaSideDrawer.hidden = !open;
  marjeaSideDrawerBackdrop.hidden = !open;

  requestAnimationFrame(() => {
    marjeaSideDrawer.classList.toggle('is-open', open);
  });

  marjeaSideDrawer.setAttribute('aria-hidden', String(!open));
  marjeaSideDrawerButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('drawer-open', open);
}

marjeaSideDrawerButton?.addEventListener('click', () => {
  setDrawerOpen(marjeaSideDrawer.hidden);
});

document.querySelector('#drawer-close')?.addEventListener('click', () => {
  setDrawerOpen(false);
});

marjeaSideDrawerBackdrop?.addEventListener('click', () => {
  setDrawerOpen(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setDrawerOpen(false);
});
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="/"]');if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const url=new URL(link.href,location.origin);if(url.origin!==location.origin)return;event.preventDefault();history.pushState({},'',url.pathname+url.search+url.hash);$('#mobile-nav').hidden=true;renderRoute();if(url.hash)setTimeout(()=>document.querySelector(url.hash)?.scrollIntoView({behavior:'smooth'}),30);else window.scrollTo(0,0);});
window.addEventListener('popstate',renderRoute);
$('#year').textContent=new Date().getFullYear();
applyChrome();renderRoute();

// MARJEA side drawer controls
const drawer = document.getElementById('mobile-nav');
const drawerButton = document.getElementById('mobile-menu-button');

function closeMarjeaDrawer() {
  if (!drawer || !drawerButton) return;
  drawer.hidden = true;
  drawerButton.setAttribute('aria-expanded', 'false');
  drawerButton.setAttribute('aria-label', 'فتح القائمة');
}

drawer?.addEventListener('click', event => {
  if (event.target.closest('[data-close-drawer]')) closeMarjeaDrawer();
});

drawer?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMarjeaDrawer);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && drawer && !drawer.hidden) {
    closeMarjeaDrawer();
    drawerButton?.focus();
  }
});
