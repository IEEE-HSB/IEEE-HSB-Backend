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
    MANAGE_ANNOUNCEMENTS: 'announcements:manage',

    MANAGE_EVENTS: 'events:manage',

    MANAGE_GALLERY: 'gallery:manage',

    VIEW_LEADERBOARD: 'leaderboard:view',

    TAKE_QUIZ: 'quiz:take',
    MANAGE_QUIZ: 'quiz:manage',

    VIEW_ALL_USERS: 'users:view_all',
    MANAGE_USER_STATUS: 'users:manage_status',
};



const participantPermissions = [
    PERMISSIONS.VIEW_LEADERBOARD,
    PERMISSIONS.TAKE_QUIZ
];

// 2. المتطوع (بيورث من المشارك)
const volunteerPermissions = [
    ...participantPermissions
];

// 3. الدايركتور (بيورث من المتطوع + صلاحياته)
const directorPermissions = [
    ...volunteerPermissions,
    PERMISSIONS.MANAGE_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_GALLERY,
    PERMISSIONS.MANAGE_USER_STATUS
];

// 4. الشيربيرسون (بيورث من الدايركتور + صلاحياته)
const chairpersonPermissions = [
    ...directorPermissions,
    PERMISSIONS.VIEW_ALL_USERS
];

// 5. التجميع النهائي للمصفوفة
const ROLE_PERMISSIONS = {
    [USER_ROLES.PARTICIPANT]: participantPermissions,
    [USER_ROLES.VOLUNTEER]: volunteerPermissions,
    [USER_ROLES.DIRECTOR]: directorPermissions,
    [USER_ROLES.CHAIRPERSON]: chairpersonPermissions,
    [USER_ROLES.ADMIN]: ['ALL_ACCESS']
};

export { USER_ROLES, PERMISSIONS, ROLE_PERMISSIONS };

