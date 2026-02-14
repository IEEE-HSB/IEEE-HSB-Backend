// 1. تعريف الأدوار (زي ما هي عندك)
const USER_ROLES = Object.freeze({
    PARTICIPANT: "participant",
    VOLUNTEER: "volunteer",
    DIRECTOR: "director",
    CHAIRPERSON: "chairperson",
    ADMIN: "admin",
});

// 2. تعريف الصلاحيات (Action Based Permissions)
// هنا بنترجم كل Endpoint لـ "فعل"
const PERMISSIONS = {
    // Announcements
    MANAGE_ANNOUNCEMENTS: 'announcements:manage', // Create, Update, Delete

    // Chapters & Committees
    CREATE_CHAPTER: 'chapters:create',            // Admin only
    CREATE_COMMITTEE: 'committees:create',        // Chair & Admin

    // Events
    MANAGE_EVENTS: 'events:manage',               // Create, Update, Delete

    // Gallery
    MANAGE_GALLERY: 'gallery:manage',             // Create, Delete

    // Leaderboard
    VIEW_LEADERBOARD: 'leaderboard:view',         // Access leaderboard

    // Quiz
    TAKE_QUIZ: 'quiz:take',                       // Start & Submit (Users)
    MANAGE_QUIZ: 'quiz:manage',                   // Create, Update, Delete (Admins/Chairs)

    // Users
    VIEW_ALL_USERS: 'users:view_all',
    MANAGE_USER_STATUS: 'users:manage_status',    // Update States
};

// 3. توزيع الصلاحيات (Role Inheritance Matrix)
const ROLE_PERMISSIONS = {
    
    // المشارك: بيشوف الليدربورد ويمتحن كويزات
    [USER_ROLES.PARTICIPANT]: [
        PERMISSIONS.VIEW_LEADERBOARD,
        PERMISSIONS.TAKE_QUIZ
    ],

    // المتطوع: بياخد صلاحيات المشارك + ممكن حاجات زيادة مستقبلاً
    [USER_ROLES.VOLUNTEER]: [
        PERMISSIONS.VIEW_LEADERBOARD,
        PERMISSIONS.TAKE_QUIZ,
        // ممكن نضفله هنا صلاحيات تنظيمية لو احتاجنا
    ],

    // الدايركتور: بياخد صلاحيات المتطوع + إدارة الايفنتات والجلري والإعلانات
    [USER_ROLES.DIRECTOR]: [
        PERMISSIONS.VIEW_LEADERBOARD,
        PERMISSIONS.TAKE_QUIZ,
        PERMISSIONS.MANAGE_ANNOUNCEMENTS,
        PERMISSIONS.MANAGE_EVENTS,
        PERMISSIONS.MANAGE_GALLERY,
        PERMISSIONS.MANAGE_USER_STATUS // يقدر يغير حالة الأعضاء اللي تحته
    ],

    // الشيربيرسون: بياخد صلاحيات الدايركتور + إدارة اللجان والكويزات
    [USER_ROLES.CHAIRPERSON]: [
        PERMISSIONS.MANAGE_ANNOUNCEMENTS,
        PERMISSIONS.MANAGE_EVENTS,
        PERMISSIONS.MANAGE_GALLERY,
        PERMISSIONS.MANAGE_USER_STATUS,
        PERMISSIONS.CREATE_COMMITTEE,  // خاص بالشير
        PERMISSIONS.MANAGE_QUIZ,       // يقدر يحط كويزات
        PERMISSIONS.VIEW_ALL_USERS     // يشوف كل اليوزرز
    ],

    // الأدمن: بياخد كل حاجة + إنشاء الشابترز
    [USER_ROLES.ADMIN]: [
        'ALL_ACCESS'
    ]
};

export { USER_ROLES, PERMISSIONS, ROLE_PERMISSIONS };