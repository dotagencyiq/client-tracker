/* ============================================================
   DOT AGENCY — قاعدة بيانات العملاء
   ============================================================
   لإضافة عميل جديد: انسخ أي كائن أدناه وعدّل القيم.

   المفاتيح المتاحة:
   - name        : اسم العميل/البراند (كما سيظهر بالصفحة)
   - service     : اسم الخدمة/الباقة
   - activeStep  : رقم المرحلة الحالية (1 = أول خطوة بالـ roadmap
                   بملف index.html، وهكذا تصاعدياً حسب عدد
                   الخطوات الموجودة فعلياً بالصفحة)
   - isFinished  : true لإظهار شاشة "انتهى المشروع" وإخفاء
                   المتعقب نهائياً لهذا العميل
   ============================================================ */

const CLIENTS_DATABASE = {

    "client001": {
        name: "Ahmed Store",
        service: "3 Reels Package",
        activeStep: 3,
        isFinished: false
    },

    "client002": {
        name: "Sara Shop",
        service: "Social Media Identity",
        activeStep: 2,
        isFinished: false
    },

    // عميل منتهي مشروعه — ستظهر له شاشة الشكر تلقائياً
    "client003": {
        name: "Khalid Agency",
        service: "Motion Graphic Video",
        activeStep: 4,
        isFinished: true
    },

    "client004": {
        name: "Khalid Agency",
        service: "Motion Graphic Video",
        activeStep: 1,
        isFinished: false
    }

};

/* ============================================================
   تحقق تلقائي بسيط أثناء التطوير فقط
   ------------------------------------------------------------
   يفحص كل عميل بالقاعدة ويطبع تحذير بالـ Console لو فيه بيانات
   ناقصة أو غير منطقية (مثل activeStep نصي أو سالب)، بدل ما
   يظهر الخطأ بصمت بواجهة العميل. لا يوقف تنفيذ الصفحة أبداً.
   ============================================================ */
(function validateClientsDatabase(db) {
    Object.entries(db).forEach(([key, client]) => {
        const issues = [];

        if (!client.name || typeof client.name !== 'string') {
            issues.push('name مفقود أو غير نصّي');
        }
        if (!client.service || typeof client.service !== 'string') {
            issues.push('service مفقود أو غير نصّي');
        }
        if (typeof client.activeStep !== 'number' || client.activeStep < 1) {
            issues.push(`activeStep غير صالح (${client.activeStep})`);
        }
        if (typeof client.isFinished !== 'boolean') {
            issues.push('isFinished يجب أن يكون true أو false');
        }

        if (issues.length > 0) {
            console.warn(`[config.js] بيانات العميل "${key}" فيها ملاحظات:`, issues.join(' | '));
        }
    });
})(CLIENTS_DATABASE);