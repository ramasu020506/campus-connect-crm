// Multi-Tenant SaaS Data Model with RBAC, Multi-Branch, and Custom Academic Structure

export const generateTenantId = () => `TNT-${Math.floor(10000 + Math.random() * 90000)}`;
export const generateUserId = () => `usr-${Math.floor(100 + Math.random() * 900)}`;
export const generateCourseId = () => `crs-${Math.floor(100 + Math.random() * 900)}`;
export const generateClassId = () => `cls-${Math.floor(100 + Math.random() * 900)}`;
export const generateGroupId = () => `grp-${Math.floor(100 + Math.random() * 900)}`;
export const generateLeadId = () => `CC-${Math.floor(1000 + Math.random() * 9000)}`;
export const generateBranchId = () => `branch-${Math.floor(10 + Math.random() * 90)}`;
export const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// 1. Tenants List (Supports auto-generated IDs when adding new tenants)
export const INITIAL_TENANTS = [
  {
    id: "TNT-84012",
    name: "EduGroup Global SaaS",
    code: "EDUGROUP",
    domain: "edugroup.campusconnect.io",
    tier: "Enterprise Multi-Org Plan",
    createdAt: "2026-01-15",
    contactEmail: "admin@edugroup.io",
  },
  {
    id: "TNT-52194",
    name: "Beacon University Consortium",
    code: "BEACON",
    domain: "beacon.campusconnect.io",
    tier: "Growth Multi-Campus Plan",
    createdAt: "2026-04-10",
    contactEmail: "registrar@beacon.edu",
  },
];

// 2. Role Definitions & Permissions
export const ROLE_DEFINITIONS = {
  super_admin: {
    key: "super_admin",
    label: "Super Admin",
    description: "Full global system access across all tenants, users, and branches",
    badgeClass: "badge-super-admin",
    color: "#7c3aed",
    bg: "#f5f3ff",
    canManageUsers: true,
    canManageTenants: true,
    canManageBranches: true,
    canManageClasses: true,
    canManageLeads: true,
  },
  tenant_admin: {
    key: "tenant_admin",
    label: "Tenant Admin",
    description: "Full administrative rights within tenant: users, passwords, branches, and leads",
    badgeClass: "badge-tenant-admin",
    color: "#2563eb",
    bg: "#eff6ff",
    canManageUsers: true,
    canManageTenants: false,
    canManageBranches: true,
    canManageClasses: true,
    canManageLeads: true,
  },
  branch_manager: {
    key: "branch_manager",
    label: "Branch Manager",
    description: "Supervises operations, batches, and lead pipelines for assigned branches",
    badgeClass: "badge-branch-manager",
    color: "#0891b2",
    bg: "#ecfeff",
    canManageUsers: false,
    canManageTenants: false,
    canManageBranches: false,
    canManageClasses: true,
    canManageLeads: true,
  },
  admissions_counselor: {
    key: "admissions_counselor",
    label: "Admissions Counselor",
    description: "Manages inquiries, applications, and admissions for assigned branches",
    badgeClass: "badge-counselor",
    color: "#16a34a",
    bg: "#f0fdf4",
    canManageUsers: false,
    canManageTenants: false,
    canManageBranches: false,
    canManageClasses: false,
    canManageLeads: true,
  },
  academic_staff: {
    key: "academic_staff",
    label: "Academic Staff / Faculty",
    description: "Views classes, student batches, and rosters for assigned branches",
    badgeClass: "badge-faculty",
    color: "#d97706",
    bg: "#fffbeb",
    canManageUsers: false,
    canManageTenants: false,
    canManageBranches: false,
    canManageClasses: false,
    canManageLeads: false,
  },
};

// 3. User Accounts with Roles, Branch Access, and Primary Branch
export const INITIAL_USERS = [
  {
    id: "usr-101",
    tenantId: "TNT-84012",
    name: "Dr. Dean Sterling",
    email: "dean.sterling@edugroup.io",
    role: "super_admin",
    password: "SuperAdmin@2026",
    phone: "+91 98765 00001",
    assignedBranchIds: ["branch-1", "branch-2", "branch-3", "branch-4", "branch-5", "branch-6"],
    primaryBranchId: "branch-1",
    status: "Active",
    lastLogin: "2026-11-18 09:30",
  },
  {
    id: "usr-102",
    tenantId: "TNT-84012",
    name: "Priya Patel",
    email: "priya.patel@edugroup.io",
    role: "tenant_admin",
    password: "Priya#Edu2026",
    phone: "+91 98765 00002",
    assignedBranchIds: ["branch-1", "branch-2", "branch-3"],
    primaryBranchId: "branch-1",
    status: "Active",
    lastLogin: "2026-11-18 08:45",
  },
  {
    id: "usr-103",
    tenantId: "TNT-84012",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@edugroup.io",
    role: "admissions_counselor",
    password: "Rajesh#Pass2026",
    phone: "+91 98765 00003",
    // Assigned to 3 branches: North Metro (A), South Tech Park (B), Downtown (C)
    assignedBranchIds: ["branch-1", "branch-2", "branch-3"],
    // PRIMARY BRANCH IS B (South Tech Park Campus) - works here by default!
    primaryBranchId: "branch-2",
    status: "Active",
    lastLogin: "2026-11-17 17:15",
  },
  {
    id: "usr-104",
    tenantId: "TNT-84012",
    name: "Ananya Sen",
    email: "ananya.sen@edugroup.io",
    role: "admissions_counselor",
    password: "Ananya#Secure2026",
    phone: "+91 98765 00004",
    // Assigned to North Metro Campus only
    assignedBranchIds: ["branch-1"],
    primaryBranchId: "branch-1",
    status: "Active",
    lastLogin: "2026-11-18 09:10",
  },
  {
    id: "usr-105",
    tenantId: "TNT-84012",
    name: "Vikram Malhotra",
    email: "vikram.m@edugroup.io",
    role: "branch_manager",
    password: "Vikram#Manager26",
    phone: "+91 98765 00005",
    assignedBranchIds: ["branch-2", "branch-3"],
    primaryBranchId: "branch-2",
    status: "Active",
    lastLogin: "2026-11-16 14:20",
  },
  {
    id: "usr-106",
    tenantId: "TNT-84012",
    name: "Prof. Arvind Rao",
    email: "arvind.rao@sxtech.edu",
    role: "academic_staff",
    password: "Faculty@Rao2026",
    phone: "+91 98765 00006",
    assignedBranchIds: ["branch-1"],
    primaryBranchId: "branch-1",
    status: "Active",
    lastLogin: "2026-11-15 11:00",
  },
];

// 4. Organizations and Branches
export const INITIAL_ORGANIZATIONS = [
  {
    id: "org-101",
    tenantId: "TNT-84012",
    name: "St. Xavier's Institute of Technology",
    code: "SXIT",
    type: "Higher Education / University",
    defaultBranchId: "branch-1",
    branches: [
      {
        id: "branch-1",
        name: "North Metro Campus",
        code: "NMC",
        isDefault: true,
        city: "Bangalore",
        address: "Outer Ring Road, Mahadevapura",
      },
      {
        id: "branch-2",
        name: "South Tech Park Campus",
        code: "STC",
        isDefault: false,
        city: "Bangalore",
        address: "Electronic City Phase 1",
      },
      {
        id: "branch-3",
        name: "Downtown City Center",
        code: "DCC",
        isDefault: false,
        city: "Bangalore",
        address: "MG Road, Central District",
      },
    ],
  },
  {
    id: "org-102",
    tenantId: "TNT-84012",
    name: "Horizon Global Academy",
    code: "HGA",
    type: "K-12 & Pre-University",
    defaultBranchId: "branch-4",
    branches: [
      {
        id: "branch-4",
        name: "Main Lakeside Campus",
        code: "MLC",
        isDefault: true,
        city: "Hyderabad",
        address: "Gachibowli Financial District",
      },
      {
        id: "branch-5",
        name: "East Hills Extension",
        code: "EHE",
        isDefault: false,
        city: "Hyderabad",
        address: "Uppal Science Corridor",
      },
    ],
  },
  {
    id: "org-103",
    tenantId: "TNT-84012",
    name: "Apex School of Business & Management",
    code: "ASBM",
    type: "Postgraduate & Executive Education",
    defaultBranchId: "branch-6",
    branches: [
      {
        id: "branch-6",
        name: "Executive Tower Campus",
        code: "ETC",
        isDefault: true,
        city: "Mumbai",
        address: "Bandra Kurla Complex (BKC)",
      },
    ],
  },
];

// 5. Customized Courses / Programs (Per Tenant)
export const INITIAL_COURSES = [
  {
    id: "crs-101",
    tenantId: "TNT-84012",
    name: "B.Tech Computer Science & Engineering",
    code: "BTECH-CSE",
    department: "School of Computing",
    degreeLevel: "Undergraduate (UG)",
    duration: "4 Years",
    description: "Core algorithms, AI architecture, cloud infrastructure, and software engineering",
  },
  {
    id: "crs-102",
    tenantId: "TNT-84012",
    name: "B.Tech Mechanical & Robotics Engineering",
    code: "BTECH-MECH",
    department: "Mechanical Sciences",
    degreeLevel: "Undergraduate (UG)",
    duration: "4 Years",
    description: "CAD/CAM modeling, mechatronics, industrial robotics, and thermodynamics",
  },
  {
    id: "crs-103",
    tenantId: "TNT-84012",
    name: "B.Sc Data Science & Artificial Intelligence",
    code: "BSC-DSAI",
    department: "Mathematical Sciences",
    degreeLevel: "Undergraduate (UG)",
    duration: "3 Years",
    description: "Statistical modeling, big data pipelines, deep learning, and predictive analytics",
  },
  {
    id: "crs-104",
    tenantId: "TNT-84012",
    name: "Grade 11 - Advanced STEM Track",
    code: "STEM-11",
    department: "Senior Secondary",
    degreeLevel: "K-12 / Pre-University",
    duration: "2 Years",
    description: "Cambridge International A-Levels curriculum focusing on Physics, Math, and CS",
  },
  {
    id: "crs-105",
    tenantId: "TNT-84012",
    name: "Executive MBA - Global Leadership",
    code: "EMBA-GL",
    department: "Executive Management",
    degreeLevel: "Postgraduate (PG)",
    duration: "1 Year",
    description: "Weekend executive immersion with global fintech residency",
  },
  // Tenant 2 Courses
  {
    id: "crs-201",
    tenantId: "TNT-52194",
    name: "B.B.A Digital Marketing & E-Commerce",
    code: "BBA-DME",
    department: "School of Business",
    degreeLevel: "Undergraduate (UG)",
    duration: "3 Years",
    description: "Omnichannel growth marketing, consumer analytics, and digital retail strategy",
  },
  {
    id: "crs-202",
    tenantId: "TNT-52194",
    name: "Master of Public Health (MPH)",
    code: "MPH-GH",
    department: "Health Sciences",
    degreeLevel: "Postgraduate (PG)",
    duration: "2 Years",
    description: "Global epidemiology, health administration, and health policy",
  },
];

// 6. Customized Classes & Batches (Linked to Course, Tenant & Branch)
export const INITIAL_CLASSES = [
  {
    id: "cls-1",
    tenantId: "TNT-84012",
    courseId: "crs-101",
    orgId: "org-101",
    branchId: "branch-1",
    name: "B.Tech CSE - 2026 Batch (Year 1)",
    code: "CSE-26-Y1",
    department: "Computer Science & Engineering",
    academicYear: "2026-2027",
    capacity: 120,
    enrolledCount: 42,
    classTeacher: "Dr. Arvind Rao",
    customFields: [
      { key: "Shift Timing", value: "Morning (08:30 AM - 02:30 PM)" },
      { key: "Lab Allocation", value: "Turing AI Lab - 302" },
      { key: "Specialization Track", value: "Artificial Intelligence & Cloud" },
      { key: "Fee Category", value: "Merit Tier 1" }
    ],
  },
  {
    id: "cls-2",
    tenantId: "TNT-84012",
    courseId: "crs-102",
    orgId: "org-101",
    branchId: "branch-1",
    name: "B.Tech Mechanical - 2026 Batch (Year 1)",
    code: "MECH-26-Y1",
    department: "Mechanical Engineering",
    academicYear: "2026-2027",
    capacity: 60,
    enrolledCount: 30,
    classTeacher: "Prof. S. Meenakshi",
    customFields: [
      { key: "Workshop Wing", value: "Robotics & CAD Wing B" },
      { key: "Industry Partner", value: "Bosch Tech Academy" },
      { key: "Safety Certification", value: "OSHA Level 2 Mandatory" }
    ],
  },
  {
    id: "cls-3",
    tenantId: "TNT-84012",
    courseId: "crs-103",
    orgId: "org-101",
    branchId: "branch-2",
    name: "B.Sc Data Science - 2026 Batch",
    code: "DS-26-B1",
    department: "Mathematical Sciences",
    academicYear: "2026-2027",
    capacity: 50,
    enrolledCount: 38,
    classTeacher: "Dr. K. Srinivas",
    customFields: [
      { key: "Cloud Credit Allowance", value: "$200 AWS Cloud Lab" },
      { key: "Project Mode", value: "Capstone Industry Project" }
    ],
  },
  {
    id: "cls-4",
    tenantId: "TNT-84012",
    courseId: "crs-104",
    orgId: "org-102",
    branchId: "branch-4",
    name: "Grade 11 - STEM Cohort 2026",
    code: "STEM-11-26",
    department: "Senior Secondary",
    academicYear: "2026-2027",
    capacity: 35,
    enrolledCount: 28,
    classTeacher: "Mrs. Radhika Gupta",
    customFields: [
      { key: "Curriculum Board", value: "Cambridge International (A-Levels)" },
      { key: "Mentor Assigned", value: "Dr. V. Raman" },
      { key: "Scholarship Quota", value: "5 Seats Reserved" }
    ],
  },
  {
    id: "cls-5",
    tenantId: "TNT-84012",
    courseId: "crs-105",
    orgId: "org-103",
    branchId: "branch-6",
    name: "Executive MBA - Cohort 14",
    code: "EMBA-14",
    department: "Executive Management",
    academicYear: "2026-2027",
    capacity: 40,
    enrolledCount: 35,
    classTeacher: "Dean Robert Sterling",
    customFields: [
      { key: "Delivery Format", value: "Hybrid Weekend Immersion" },
      { key: "Global Immersion Trip", value: "Singapore Fintech Hub" },
      { key: "Executive Coach", value: "Elena Vance (KPMG Alum)" }
    ],
  },
  // Tenant 2 Classes
  {
    id: "cls-201",
    tenantId: "TNT-52194",
    courseId: "crs-201",
    orgId: "org-201",
    branchId: "branch-201",
    name: "BBA 2026 Fall Batch",
    code: "BBA-26F",
    department: "Business School",
    academicYear: "2026-2027",
    capacity: 60,
    enrolledCount: 22,
    classTeacher: "Dr. Alicia Vance",
    customFields: [{ key: "Internship Track", value: "E-Commerce Incubator" }]
  },
  {
    id: "cls-202",
    tenantId: "TNT-52194",
    courseId: "crs-202",
    orgId: "org-201",
    branchId: "branch-201",
    name: "MPH Global Health Cohort 2026",
    code: "MPH-26",
    department: "Public Health",
    academicYear: "2026-2027",
    capacity: 45,
    enrolledCount: 19,
    classTeacher: "Dr. Samuel Okon",
    customFields: [{ key: "Field Clinic", value: "WHO Urban Initiative" }]
  }
];

// 7. Customized Sections & Groups (Linked to Class & Course)
export const GROUP_TYPES = [
  "Section",
  "Batch",
  "Group",
  "Lab Group",
  "Specialization Track"
];

export const INITIAL_GROUPS = [
  {
    id: "grp-1",
    tenantId: "TNT-84012",
    courseId: "crs-101",
    classId: "cls-1",
    name: "Section A (Morning AI Track)",
    code: "SEC-A",
    type: "Section",
    room: "Turing Hall 302",
    capacity: 60,
    enrolledCount: 24,
    faculty: "Prof. K. Raman",
    notes: "Focused on Foundation AI, Python & Algorithms",
  },
  {
    id: "grp-2",
    tenantId: "TNT-84012",
    courseId: "crs-101",
    classId: "cls-1",
    name: "Section B (Cloud & DevOps Track)",
    code: "SEC-B",
    type: "Section",
    room: "Ada Lovelace Hall 304",
    capacity: 60,
    enrolledCount: 18,
    faculty: "Dr. Arvind Rao",
    notes: "Focused on Distributed Systems and Kubernetes",
  },
  {
    id: "grp-3",
    tenantId: "TNT-84012",
    courseId: "crs-101",
    classId: "cls-1",
    name: "Lab Group Alpha (Robotics & IoT)",
    code: "LAB-ALPHA",
    type: "Lab Group",
    room: "Hardware & IoT Lab B",
    capacity: 30,
    enrolledCount: 15,
    faculty: "Er. Deepa Nair",
    notes: "Practical hardware interfacing and embedded C",
  },
  {
    id: "grp-4",
    tenantId: "TNT-84012",
    courseId: "crs-102",
    classId: "cls-2",
    name: "Section A1 (Bosch Industry Cohort)",
    code: "MECH-A1",
    type: "Batch",
    room: "Bosch Tech Academy Lab",
    capacity: 30,
    enrolledCount: 18,
    faculty: "Prof. S. Meenakshi",
    notes: "Direct industry mentorship with Bosch engineers",
  },
  {
    id: "grp-5",
    tenantId: "TNT-84012",
    courseId: "crs-103",
    classId: "cls-3",
    name: "Group G1 (Predictive Analytics Focus)",
    code: "DS-G1",
    type: "Group",
    room: "Math Modeling Lab 101",
    capacity: 25,
    enrolledCount: 20,
    faculty: "Dr. K. Srinivas",
    notes: "Advanced statistical modeling and R programming",
  },
  {
    id: "grp-6",
    tenantId: "TNT-84012",
    courseId: "crs-104",
    classId: "cls-4",
    name: "Section 11-A (Pre-Engineering Track)",
    code: "SEC-11A",
    type: "Section",
    room: "Newton Science Block 2",
    capacity: 20,
    enrolledCount: 16,
    faculty: "Mrs. Radhika Gupta",
    notes: "Intensive preparation for IIT-JEE & SAT",
  },
  {
    id: "grp-7",
    tenantId: "TNT-84012",
    courseId: "crs-105",
    classId: "cls-5",
    name: "Syndicate Group Alpha (Fintech Immersion)",
    code: "SYN-ALPHA",
    type: "Specialization Track",
    room: "Executive Boardroom B",
    capacity: 20,
    enrolledCount: 18,
    faculty: "Elena Vance",
    notes: "Cross-border capital markets and blockchain study",
  },
  // Tenant 2 Groups
  {
    id: "grp-201",
    tenantId: "TNT-52194",
    courseId: "crs-201",
    classId: "cls-201",
    name: "Section A (Growth Marketing)",
    code: "SEC-A",
    type: "Section",
    room: "Media Lab 2",
    capacity: 30,
    enrolledCount: 12,
    faculty: "Dr. Alicia Vance",
    notes: "Social and paid acquisition focus",
  },
  {
    id: "grp-202",
    tenantId: "TNT-52194",
    courseId: "crs-202",
    classId: "cls-202",
    name: "Field Practicum Cohort 1",
    code: "FPC-1",
    type: "Group",
    room: "Community Health Clinic",
    capacity: 25,
    enrolledCount: 10,
    faculty: "Dr. Samuel Okon",
    notes: "Community immunization project",
  },
];

// 8. Student Leads with Mandatory Address, Course, Class & Group Allocations
export const INITIAL_LEADS = [
  {
    id: "CC-1001",
    tenantId: "TNT-84012",
    orgId: "org-101",
    branchId: "branch-1",
    courseId: "crs-101",
    classId: "cls-1",
    groupId: "grp-1", // Marked to Section A (Morning AI Track)
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    course: "B.Tech Computer Science & Engineering",
    className: "B.Tech CSE - 2026 Batch (Year 1)",
    groupName: "Section A (Morning AI Track)",
    campus: "North Metro Campus",
    status: "Applied",
    priority: "High",
    // Address Details: Address is MANDATORY, Locality & Landmark are OPTIONAL
    address: "14/B, 3rd Cross, 5th Block", // Mandatory
    locality: "Koramangala",                // Optional
    landmark: "Opp. Forum Mall",            // Optional
    doorNo: "D.No. 402, Sai Heights",       // Optional
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560034",
    notes: "Interested in AI & Cloud computing specialization. Requested campus tour.",
    createdAt: "2026-11-12",
    assignedTo: "Rajesh Kumar",
  },
  {
    id: "CC-1002",
    tenantId: "TNT-84012",
    orgId: "org-101",
    branchId: "branch-2",
    courseId: "crs-103",
    classId: "cls-3",
    groupId: "grp-5", // Marked to Group G1 (Predictive Analytics)
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98450 12345",
    course: "B.Sc Data Science & Artificial Intelligence",
    className: "B.Sc Data Science - 2026 Batch",
    groupName: "Group G1 (Predictive Analytics Focus)",
    campus: "South Tech Park Campus",
    status: "Enrolled",
    priority: "Medium",
    address: "Hill View Apartments, Gandhi Nagar", // Mandatory
    locality: "Adyar",                             // Optional
    landmark: "Near Apollo Hospital",              // Optional
    doorNo: "Villa 12",                            // Optional
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600020",
    notes: "Fee structure cleared. Scholarship discount of 15% applied.",
    createdAt: "2026-11-14",
    assignedTo: "Rajesh Kumar",
  },
  {
    id: "CC-1003",
    tenantId: "TNT-84012",
    orgId: "org-101",
    branchId: "branch-1",
    courseId: "crs-102",
    classId: "cls-2",
    groupId: "grp-4", // Marked to Section A1 (Bosch Industry Cohort)
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@example.com",
    phone: "+91 97654 32109",
    course: "B.Tech Mechanical & Robotics Engineering",
    className: "B.Tech Mechanical - 2026 Batch (Year 1)",
    groupName: "Section A1 (Bosch Industry Cohort)",
    campus: "North Metro Campus",
    status: "Inquiry",
    priority: "High",
    address: "Plot 88, Green Meadows Colony", // Mandatory
    locality: "Baner",                        // Optional
    landmark: "Behind D-Mart",                // Optional
    doorNo: "",                               // Optional
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    notes: "Follow-up call scheduled for Friday regarding entrance test syllabus.",
    createdAt: "2026-11-16",
    assignedTo: "Ananya Sen",
  },
  {
    id: "CC-1004",
    tenantId: "TNT-84012",
    orgId: "org-102",
    branchId: "branch-4",
    courseId: "crs-104",
    classId: "cls-4",
    groupId: "grp-6", // Marked to Section 11-A (Pre-Engineering Track)
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "+91 99012 34567",
    course: "Grade 11 - Advanced STEM Track",
    className: "Grade 11 - STEM Cohort 2026",
    groupName: "Section 11-A (Pre-Engineering Track)",
    campus: "Main Lakeside Campus",
    status: "Contacted",
    priority: "Low",
    address: "Road No. 36, Jubilee Hills Main Rd", // Mandatory
    locality: "Jubilee Hills",                      // Optional
    landmark: "Near Peddamma Temple Metro",         // Optional
    doorNo: "D.No. 8-2-293",                       // Optional
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    notes: "Shared the portfolio review guidelines and faculty mentor profile.",
    createdAt: "2026-11-16",
    assignedTo: "Priya Patel",
  },
  {
    id: "CC-1005",
    tenantId: "TNT-84012",
    orgId: "org-103",
    branchId: "branch-6",
    courseId: "crs-105",
    classId: "cls-5",
    groupId: "grp-7", // Marked to Syndicate Group Alpha
    name: "Vikram Sengupta",
    email: "vikram.s@example.com",
    phone: "+91 98111 22334",
    course: "Executive MBA - Global Leadership",
    className: "Executive MBA - Cohort 14",
    groupName: "Syndicate Group Alpha (Fintech Immersion)",
    campus: "Executive Tower Campus",
    status: "Admitted",
    priority: "Medium",
    address: "Sector 14, Outer Ring Road", // Mandatory
    locality: "Rohini Sector 14",          // Optional
    landmark: "Near Japanese Park Gate 2", // Optional
    doorNo: "Flat 54-A",                   // Optional
    city: "New Delhi",
    state: "Delhi",
    pincode: "110085",
    notes: "Provisional admission letter issued. Awaiting original graduation certificates.",
    createdAt: "2026-11-17",
    assignedTo: "Priya Patel",
  },
];

export const STATUS_LIST = [
  "All Statuses",
  "Inquiry",
  "Contacted",
  "Applied",
  "Admitted",
  "Enrolled",
];
