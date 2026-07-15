const CLIENTS_DATABASE = {
    // العميل الأول
    "client001": {
        name: "Ahmed Store",
        service: "3 Reels Package",
        activeStep: 3,       // الرقم 1 أو 2 أو 3 أو 4 (حسب المرحلة الحالية)
        isFinished: false    // غيّرها إلى true عند انتهاء المشروع بالكامل لغلق الصفحة
    },

    // العميل الثاني (مثال لسهولة الإضافة مستقبلاً)
    "client002": {
        name: "Sara Shop",
        service: "Social Media Identity",
        activeStep: 2,
        isFinished: false
    },

    // عميل منتهي مشروعه
    "client003": {
        name: "Khalid Agency",
        service: "Motion Graphic Video",
        activeStep: 4,
        isFinished: true     // ستظهر له رسالة النهاية تلقائياً
    },
    "client004": {
        name: "Khalied Agency",
        service: "Moteeion Graphic Video",
        activeStep: 4,
        isFinished: true     // ستظهر له رسالة النهاية تلقائياً
    }
    
};