document.addEventListener("DOMContentLoaded", () => {
    const trackerCard = document.querySelector('.tracker-card');
    if (!trackerCard) {
        console.error("عنصر .tracker-card غير موجود بالصفحة.");
        return;
    }

    // ------------------------------------------------------------
    // 1. استخراج معرّف العميل من رابط الصفحة
    //    يدعم كل من مسار المجلد (/clients/client001/) وquery string
    //    (index.html?client=client001) لمرونة أكبر مستقبلاً.
    // ------------------------------------------------------------
    function resolveClientKey() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('client');
        if (fromQuery) return fromQuery.trim();

        const pathSegments = window.location.pathname
            .split('/')
            .filter(s => s && s !== 'index.html');

        let key = pathSegments[pathSegments.length - 1] || "demo";

        // إذا انتهى الرابط باسم مجلد المشروع بالخطأ، خذ المجلد الأخير المناسب
        if (key === "client-tracker" && pathSegments.length > 1) {
            key = pathSegments[pathSegments.length - 2];
        }

        return key;
    }

    const clientKey = resolveClientKey();

    // ------------------------------------------------------------
    // 2. جلب بيانات العميل من ملف الـ Config
    // ------------------------------------------------------------
    const database = typeof CLIENTS_DATABASE !== 'undefined' ? CLIENTS_DATABASE : null;
    const clientData = database ? database[clientKey] : null;

    if (!database) {
        console.error("لم يتم العثور على CLIENTS_DATABASE. تأكد من ربط config.js قبل app.js.");
        showDataError();
        return;
    }

    if (!clientData) {
        console.error("لا توجد بيانات لهذا العميل بملف config.js. المفتاح المستخدم:", clientKey);
        showDataError();
        return;
    }

    // ------------------------------------------------------------
    // 3. التحقق من حالة إنهاء المشروع
    // ------------------------------------------------------------
    if (clientData.isFinished) {
        trackerCard.classList.add('project-finished');
        return;
    }

    // ------------------------------------------------------------
    // 4. تعبئة نصوص الصفحة ديناميكياً ببيانات العميل
    // ------------------------------------------------------------
    setTextIfExists('client-name', clientData.name || '—');
    setTextIfExists('client-service', clientData.service || '—');

    // ------------------------------------------------------------
    // 5. تحديث خطوات شريط التقدم (مع حماية من قيم activeStep الخاطئة)
    // ------------------------------------------------------------
    const steps = Array.from(document.querySelectorAll('.roadmap-step'));
    const totalSteps = steps.length;

    const rawStep = Number(clientData.activeStep);
    const safeStep = Number.isFinite(rawStep) ? rawStep : 1;
    const activeIndex = clamp(safeStep - 1, 0, totalSteps - 1);

    steps.forEach((step, index) => {
        const iconDiv = step.querySelector('.step-icon');

        step.classList.remove('completed', 'active', 'pending');

        if (index < activeIndex) {
            step.classList.add('completed');
            if (iconDiv) iconDiv.innerHTML = '✓';
        } else if (index === activeIndex) {
            step.classList.add('active');
            if (iconDiv) iconDiv.innerHTML = '•••';
        } else {
            step.classList.add('pending');
            if (iconDiv) iconDiv.innerHTML = '';
        }
    });

    // ------------------------------------------------------------
    // 6. تحديث النسب المئوية وشريط التقدم حركياً
    //    تُحسب النسب ديناميكياً بناءً على عدد الخطوات الفعلي
    //    بدل مصفوفة ثابتة مربوطة بأربع خطوات فقط.
    // ------------------------------------------------------------
    const targetPercent = totalSteps > 0
        ? Math.round(((activeIndex + 1) / totalSteps) * 100)
        : 0;

    const percentDisplay = document.getElementById('percent-display');
    if (percentDisplay) {
        percentDisplay.innerHTML = `${targetPercent}%<span>DONE</span>`;
    }

    const progressBar = document.getElementById('progress-bar-fill');
    const roadmapLineFill = document.getElementById('roadmap-line-fill');

    // نسبة امتلاء خط الـ roadmap: تتوقف عند مركز آخر خطوة مكتملة/نشطة
    const linePercent = totalSteps > 1
        ? Math.round((activeIndex / (totalSteps - 1)) * 100)
        : 0;

    requestAnimationFrame(() => {
        setTimeout(() => {
            if (progressBar) {
                progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                progressBar.style.width = `${targetPercent}%`;
            }
            if (roadmapLineFill) {
                roadmapLineFill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                roadmapLineFill.style.width = `${linePercent}%`;
            }
        }, 250);
    });

    // ------------------------------------------------------------
    // دوال مساعدة
    // ------------------------------------------------------------
    function setTextIfExists(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function showDataError() {
        trackerCard.classList.add('data-error');
    }
});