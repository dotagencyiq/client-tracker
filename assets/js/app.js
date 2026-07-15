document.addEventListener("DOMContentLoaded", () => {
    // 1. معرفة اسم العميل من رابط الصفحة بطريقة مرنة ومضمونة على GitHub
    const pathSegments = window.location.pathname.split('/').filter(s => s && s !== 'index.html');
    
    // جلب آخر عنصر في المسار (الذي يجب أن يكون معرف العميل مثل client004)
    let clientKey = pathSegments[pathSegments.length - 1] || "demo";
    
    // إذا انتهى الرابط بـ client-tracker بالخطأ، خذ المجلد الأخير المناسب
    if (clientKey === "client-tracker" && pathSegments.length > 1) {
        clientKey = pathSegments[pathSegments.length - 2];
    }

    // 2. جلب بيانات العميل من ملف الـ Config
    const clientData = CLIENTS_DATABASE[clientKey];

    const trackerCard = document.querySelector('.tracker-card');
    if (!trackerCard || !clientData) {
        console.error("Client data not found in config.js for key:", clientKey);
        return;
    }

    // 3. التحقق من حالة إنهاء المشروع
    if (clientData.isFinished) {
        trackerCard.classList.add('project-finished');
        return; // توقف هنا واعرض صفحة النهاية
    }

    // 4. تعبئة نصوص الصفحة ديناميكياً ببيانات العميل
    document.getElementById('client-name').textContent = clientData.name;
    document.getElementById('client-service').textContent = clientData.service;

    // 5. تحديث خطوات شريط التقدم
    const steps = Array.from(document.querySelectorAll('.roadmap-step'));
    const totalSteps = steps.length;
    const activeIndex = clientData.activeStep - 1; // تحويل الرقم لفهرس برمجي (0, 1, 2, 3)

    steps.forEach((step, index) => {
        const iconDiv = step.querySelector('.step-icon');
        
        // إزالة الحالات السابقة لتجنب التضارب
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

    // 6. تحديث النسب المئوية وشريط التقدم حركياً
    const percentages = [25, 50, 75, 100];
    const targetPercent = activeIndex >= 0 ? percentages[activeIndex] : 0;

    const percentDisplay = document.getElementById('percent-display');
    if (percentDisplay) {
        percentDisplay.innerHTML = `${targetPercent}%<span>DONE</span>`;
    }

    const progressBar = document.getElementById('progress-bar-fill');
    const roadmapLineFill = document.getElementById('roadmap-line-fill');

    setTimeout(() => {
        if (progressBar) {
            progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            progressBar.style.width = `${targetPercent}%`;
        }
        if (roadmapLineFill) {
            roadmapLineFill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            const lineSteps = [0, 33, 66, 100];
            const linePercent = activeIndex >= 0 ? lineSteps[activeIndex] : 0;
            roadmapLineFill.style.width = `${linePercent}%`;
        }
    }, 250);
});