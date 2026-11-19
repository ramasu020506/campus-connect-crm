import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  X,
  Building2,
  Phone,
  Mail,
  AlertCircle,
  Copy,
  ChevronDown,
  Star,
  Layers,
  Sparkles,
  BookOpen,
  School,
  CheckCircle2,
  Settings,
  ArrowRight,
  ShieldAlert,
  Key,
  Lock,
  UserPlus,
  Shield,
  RefreshCw,
  LogOut,
  Check,
  ExternalLink,
  Info,
  Layers3,
  Bookmark,
  Calendar,
  Compass,
  FolderTree,
  Upload,
  FileSpreadsheet,
  Activity,
  Clock,
  Sliders,
  Smartphone,
  MessageSquare,
  MessageCircle,
  Send,
  Share2,
  QrCode,
  AlertTriangle,
  UserX,
  HelpCircle,
  DollarSign,
  TrendingDown,
  UserMinus,
  CheckCircle
} from 'lucide-react';
import {
  INITIAL_TENANTS,
  ROLE_DEFINITIONS,
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_COURSES,
  INITIAL_CLASSES,
  INITIAL_GROUPS,
  GROUP_TYPES,
  INITIAL_LEADS,
  INITIAL_DROP_REASONS,
  LEAD_SOURCES,
  INITIAL_BRANCH_ACTIVITIES,
  STATUS_LIST,
  ATTEND_STATUS_LIST,
  generateTenantId,
  generateUserId,
  generateCourseId,
  generateClassId,
  generateGroupId,
  generateLeadId,
  generateBranchId,
  generatePassword,
} from './mockData';
import './App.css';

export default function App() {
  // ----------------------------------------------------
  // 1. Persistent State: Tenants, Users, Current User
  // ----------------------------------------------------
  const [tenants, setTenants] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_tenants_v5');
      return saved ? JSON.parse(saved) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [activeTenantId, setActiveTenantId] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_active_tenant_id_v5');
      return saved || INITIAL_TENANTS[0]?.id || 'TNT-84012';
    } catch {
      return INITIAL_TENANTS[0]?.id || 'TNT-84012';
    }
  });

  const activeTenant = useMemo(() => {
    return tenants.find((t) => t.id === activeTenantId) || tenants[0];
  }, [tenants, activeTenantId]);

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_users_v5');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Logged-in User (default: Rajesh Kumar usr-103: Default Branch B, Optional Branches A & C, Multi-Group)
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_current_user_id_v5');
      return saved || 'usr-103';
    } catch {
      return 'usr-103';
    }
  });

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const currentUserRole = useMemo(() => {
    return ROLE_DEFINITIONS[currentUser?.role] || ROLE_DEFINITIONS.admissions_counselor;
  }, [currentUser]);

  // Organizations & Branches
  const [organizations, setOrganizations] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_organizations_v5');
      return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
    } catch {
      return INITIAL_ORGANIZATIONS;
    }
  });

  // ----------------------------------------------------
  // 2. Customized Academic Hierarchy (Courses, Classes, Groups)
  // ----------------------------------------------------
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_courses_v5');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_classes_v5');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_groups_v5');
      return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    } catch {
      return INITIAL_GROUPS;
    }
  });

  // Leads
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_leads_v5');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // Configurable Drop / Lost Reasons (Tenant Admin Customizable)
  const [dropReasons, setDropReasons] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_drop_reasons_v5');
      return saved ? JSON.parse(saved) : INITIAL_DROP_REASONS;
    } catch {
      return INITIAL_DROP_REASONS;
    }
  });

  // Branch Operations & Activities Stream (Multi-Branch activity tracking)
  const [branchActivities, setBranchActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_activities_v5');
      return saved ? JSON.parse(saved) : INITIAL_BRANCH_ACTIVITIES;
    } catch {
      return INITIAL_BRANCH_ACTIVITIES;
    }
  });

  // Address & Attendance Field Configuration Options
  const [addressConfig, setAddressConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_address_config_v5');
      return saved
        ? JSON.parse(saved)
        : {
            isAddressMandatory: true, // Street Address is strictly mandatory
            isAreaOptional: true,     // Locality / Area is optional
            isLandmarkOptional: true, // Landmark is optional
            isAttendAddressMandatory: true, // Option to mark Attend Address as mandatory
            isAttendStatusMandatory: true,  // Option to mark Attend Status as mandatory
          };
    } catch {
      return {
        isAddressMandatory: true,
        isAreaOptional: true,
        isLandmarkOptional: true,
        isAttendAddressMandatory: true,
        isAttendStatusMandatory: true,
      };
    }
  });

  // Mobile App Mode State (PRV Staff Mobile View)
  const [isMobileViewMode, setIsMobileViewMode] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('leads'); // 'leads' | 'add' | 'inbound' | 'drop_stats' | 'profile'
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  // Inbound Leads & Area-based Allocation State
  const [inboundAreaFilter, setInboundAreaFilter] = useState('ALL');
  const [selectedInboundLead, setSelectedInboundLead] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetAssigneeId, setTargetAssigneeId] = useState('');

  // Drop Lead Modal State
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [leadToDrop, setLeadToDrop] = useState(null);
  const [dropForm, setDropForm] = useState({
    reasonCode: 'HIGH_FEE_STRUCTURE',
    remarks: '',
  });

  // Tenant Admin Drop Reason Management Modal State
  const [isDropConfigModalOpen, setIsDropConfigModalOpen] = useState(false);
  const [newDropReason, setNewDropReason] = useState({
    name: '',
    category: 'Financial',
    description: '',
  });

  // Direct Communication Modals State
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppTargetLead, setWhatsAppTargetLead] = useState(null);
  const [whatsAppTemplateId, setWhatsAppTemplateId] = useState('intro');
  const [whatsAppCustomText, setWhatsAppCustomText] = useState('');

  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  const [callTargetLead, setCallTargetLead] = useState(null);
  const [callOutcome, setCallOutcome] = useState('Connected - Parent Interested');
  const [callNote, setCallNote] = useState('');

  // Real-time Duplicate Alert State
  const [duplicateAlert, setDuplicateAlert] = useState(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cc_saas_tenants_v5', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('cc_saas_active_tenant_id_v5', activeTenantId);
  }, [activeTenantId]);

  useEffect(() => {
    localStorage.setItem('cc_saas_users_v5', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cc_saas_current_user_id_v5', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('cc_saas_organizations_v5', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('cc_saas_courses_v5', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('cc_saas_classes_v5', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('cc_saas_groups_v5', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('cc_saas_leads_v5', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('cc_saas_drop_reasons_v5', JSON.stringify(dropReasons));
  }, [dropReasons]);

  useEffect(() => {
    localStorage.setItem('cc_saas_activities_v5', JSON.stringify(branchActivities));
  }, [branchActivities]);

  useEffect(() => {
    localStorage.setItem('cc_saas_address_config_v5', JSON.stringify(addressConfig));
  }, [addressConfig]);

  // If logged in as Teacher or PRVO, auto-switch to Mobile View on mount or role change
  useEffect(() => {
    if (currentUser?.role === 'teacher' || currentUser?.role === 'prvo') {
      setIsMobileViewMode(true);
    }
  }, [currentUserId, currentUser?.role]);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // 3. Multi-Branch & Compulsory Default Branch Access Logic
  // ----------------------------------------------------
  const allBranches = useMemo(() => {
    const list = [];
    organizations.forEach((org) => {
      org.branches?.forEach((b) => {
        list.push({
          ...b,
          orgId: org.id,
          orgName: org.name,
          orgCode: org.code,
        });
      });
    });
    return list;
  }, [organizations]);

  // Branches assigned to the current logged-in user
  const userAllowedBranches = useMemo(() => {
    if (currentUser?.role === 'super_admin') {
      return allBranches;
    }
    const assignedIds = currentUser?.assignedBranchIds || [];
    return allBranches.filter((b) => assignedIds.includes(b.id));
  }, [allBranches, currentUser]);

  // Compulsory Default Branch of the user (e.g. Branch B)
  const userPrimaryBranch = useMemo(() => {
    return allBranches.find((b) => b.id === currentUser?.primaryBranchId) || userAllowedBranches[0] || allBranches[0];
  }, [allBranches, userAllowedBranches, currentUser]);

  // Optional Branches assigned to the user (e.g. Branches A & C)
  const userOptionalBranches = useMemo(() => {
    return userAllowedBranches.filter((b) => b.id !== currentUser?.primaryBranchId);
  }, [userAllowedBranches, currentUser]);

  // Active Branch: Strictly defaults to user's COMPULSORY DEFAULT branch on login / CRM open / user change
  const [activeBranchId, setActiveBranchId] = useState(() => {
    const primary = currentUser?.primaryBranchId;
    if (primary && userAllowedBranches.some((b) => b.id === primary)) {
      return primary;
    }
    return userAllowedBranches[0]?.id || 'branch-2';
  });

  // When current user changes or CRM opens, automatically switch active branch to that user's compulsory Default Branch
  useEffect(() => {
    if (currentUser) {
      const primary = currentUser.primaryBranchId;
      if (primary && userAllowedBranches.some((b) => b.id === primary)) {
        setActiveBranchId(primary);
      } else if (userAllowedBranches.length > 0) {
        setActiveBranchId(userAllowedBranches[0].id);
      }
    }
  }, [currentUserId, currentUser, userAllowedBranches]);

  const activeBranch = useMemo(() => {
    return allBranches.find((b) => b.id === activeBranchId) || userAllowedBranches[0] || allBranches[0];
  }, [allBranches, userAllowedBranches, activeBranchId]);

  const activeOrg = useMemo(() => {
    if (!activeBranch) return organizations[0];
    return organizations.find((o) => o.id === activeBranch.orgId) || organizations[0];
  }, [organizations, activeBranch]);

  const isCurrentActivePrimary = activeBranch?.id === currentUser?.primaryBranchId;

  // Dropdown States
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const branchDropdownRef = useRef(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target)) {
        setIsBranchDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBranch = (branchId) => {
    setActiveBranchId(branchId);
    setIsBranchDropdownOpen(false);
    const targetBranch = allBranches.find((b) => b.id === branchId);
    showToast(`Switched active branch to "${targetBranch?.name}".`);
  };

  const handleResetToPrimaryBranch = () => {
    if (currentUser?.primaryBranchId) {
      setActiveBranchId(currentUser.primaryBranchId);
      showToast(`Switched back to your Primary Branch: ${userPrimaryBranch?.name}`);
    }
  };

  const handleSwitchUser = (user) => {
    setCurrentUserId(user.id);
    setIsUserMenuOpen(false);
    const primary = allBranches.find((b) => b.id === user.primaryBranchId);
    showToast(`Logged in as ${user.name} (${ROLE_DEFINITIONS[user.role]?.label || user.role}). Primary Branch: ${primary?.name || 'Assigned Branch'}.`);
  };

  // ----------------------------------------------------
  // 4. Filtered Academic Elements for Active Tenant & Branch
  // ----------------------------------------------------
  const tenantCourses = useMemo(() => {
    return courses.filter((c) => c.tenantId === activeTenantId);
  }, [courses, activeTenantId]);

  const tenantClasses = useMemo(() => {
    return classes.filter((c) => c.tenantId === activeTenantId);
  }, [classes, activeTenantId]);

  const activeBranchClasses = useMemo(() => {
    return tenantClasses.filter((c) => c.branchId === activeBranchId);
  }, [tenantClasses, activeBranchId]);

  const tenantGroups = useMemo(() => {
    return groups.filter((g) => g.tenantId === activeTenantId);
  }, [groups, activeTenantId]);

  // ----------------------------------------------------
  // 5. Navigation Tabs
  // ----------------------------------------------------
  // 'leads' | 'academic' | 'organizations' | 'users' | 'tenants'
  const [activeTab, setActiveTab] = useState('leads');

  // Academic Sub-Tab: 'courses' | 'classes' | 'groups'
  const [academicSubTab, setAcademicSubTab] = useState('courses');

  const canManageUsers = currentUserRole.canManageUsers;
  const canManageTenants = currentUserRole.canManageTenants || currentUser.role === 'tenant_admin';

  // ----------------------------------------------------
  // 6. Student Leads Management (Course, Class & Group Allocation + Mandatory Address)
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [filterByBranch, setFilterByBranch] = useState(true);

  const isSoleOwnerMode = currentUser?.role === 'teacher' || currentUser?.role === 'prvo';

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Sole Lead Ownership Restriction:
      // When logged in as Teacher or PRVO, they can ONLY access leads they own!
      if (isSoleOwnerMode) {
        if (lead.ownerId !== currentUser.id && lead.assignedTo !== currentUser.name) {
          return false;
        }
      } else {
        // Normal counselors / branch staff / admins: filter by active branch
        if (filterByBranch && lead.branchId && lead.branchId !== activeBranchId) {
          return false;
        }
      }

      const matchesSearch =
        searchQuery === '' ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.parentPhone?.includes(searchQuery) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.landmark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.doorNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.attendAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.attendStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.ownerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.dropReason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.groupName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter;
      const matchesCourse = courseFilter === 'All Courses' || lead.courseId === courseFilter;
      const matchesClass = classFilter === 'All Classes' || lead.classId === classFilter;
      const matchesGroup = groupFilter === 'All Groups' || lead.groupId === groupFilter;

      return matchesSearch && matchesStatus && matchesCourse && matchesClass && matchesGroup;
    });
  }, [leads, searchQuery, statusFilter, courseFilter, classFilter, groupFilter, filterByBranch, activeBranchId, isSoleOwnerMode, currentUser]);

  // Unassigned Inbound Leads (for Manual Assignment per Area)
  const unassignedInboundLeads = useMemo(() => {
    return leads.filter((l) => (!l.ownerId || l.assignedTo === 'Unassigned') && l.status !== 'Lost');
  }, [leads]);

  // Filtered Inbound Leads by Area
  const filteredInboundLeads = useMemo(() => {
    if (inboundAreaFilter === 'ALL') return unassignedInboundLeads;
    return unassignedInboundLeads.filter((l) => (l.locality || '').toLowerCase() === inboundAreaFilter.toLowerCase());
  }, [unassignedInboundLeads, inboundAreaFilter]);

  // Distinct Areas with unassigned leads
  const inboundDistinctAreas = useMemo(() => {
    const set = new Set();
    unassignedInboundLeads.forEach((l) => {
      if (l.locality) set.add(l.locality);
    });
    return Array.from(set);
  }, [unassignedInboundLeads]);

  // Dropped Leads with reasons
  const droppedLeads = useMemo(() => {
    return leads.filter((l) => l.status === 'Lost');
  }, [leads]);

  // Drop Reasons statistics breakdown
  const dropReasonsStats = useMemo(() => {
    const stats = {};
    dropReasons.forEach((dr) => {
      stats[dr.name] = 0;
    });
    droppedLeads.forEach((l) => {
      const rName = l.dropReason || 'Other / Not Specified';
      stats[rName] = (stats[rName] || 0) + 1;
    });
    return stats;
  }, [dropReasons, droppedLeads]);

  // Multi-Factor Duplicate Lead Detection Engine
  const checkDuplicateLead = (leadInput, existingList = leads, currentLeadId = null) => {
    if (!leadInput) return { isDuplicate: false };

    const cleanPhone = (p) => (p || '').toString().replace(/[^0-9]/g, '').slice(-10);
    const cleanStr = (s) => (s || '').toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const inName = cleanStr(leadInput.name);
    const inParent = cleanStr(leadInput.parentName);
    const inPhone = cleanPhone(leadInput.phone);
    const inParentPhone = cleanPhone(leadInput.parentPhone);
    const inAddress = cleanStr(leadInput.address);
    const inDoorNo = cleanStr(leadInput.doorNo);

    for (const ex of existingList) {
      if (currentLeadId && ex.id === currentLeadId) continue;

      const matchedReasons = [];

      // 1. Mobile Number Check
      const exPhone = cleanPhone(ex.phone);
      const exParentPhone = cleanPhone(ex.parentPhone);

      const phoneMatch =
        (inPhone && (inPhone === exPhone || (exParentPhone && inPhone === exParentPhone))) ||
        (inParentPhone && ((exPhone && inParentPhone === exPhone) || (exParentPhone && inParentPhone === exParentPhone)));

      if (phoneMatch) {
        matchedReasons.push(`Mobile Number: ${leadInput.phone || leadInput.parentPhone}`);
      }

      // 2. Student Name Check
      const exName = cleanStr(ex.name);
      if (inName && exName && inName.length >= 3 && exName.length >= 3) {
        if (inName === exName) {
          matchedReasons.push(`Student Name: "${ex.name}"`);
        }
      }

      // 3. Parent Name Check
      const exParent = cleanStr(ex.parentName);
      if (inParent && exParent && inParent.length >= 3 && exParent.length >= 3) {
        if (inParent === exParent) {
          matchedReasons.push(`Parent Name: "${ex.parentName}"`);
        }
      }

      // 4. Door / Flat Number Check
      const exDoor = cleanStr(ex.doorNo);
      if (inDoorNo && exDoor && inDoorNo === exDoor) {
        matchedReasons.push(`Door / Flat No: "${ex.doorNo}"`);
      }

      // 5. Street Address Check
      const exAddr = cleanStr(ex.address);
      if (inAddress && exAddr && inAddress.length >= 6 && exAddr.length >= 6) {
        if (inAddress === exAddr || inAddress.includes(exAddr) || exAddr.includes(inAddress)) {
          matchedReasons.push(`Street Address: "${ex.address}"`);
        }
      }

      if (matchedReasons.length > 0) {
        return {
          isDuplicate: true,
          existingLead: ex,
          matchedReasons,
          ownerId: ex.ownerId,
          ownerName: ex.ownerName || ex.assignedTo || 'Another Staff Member',
          campus: ex.campus || activeBranch?.name,
        };
      }
    }

    return { isDuplicate: false };
  };

  // Lead Modal, Detail & Import States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeLead, setActiveLead] = useState(null);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [leadFormErrors, setLeadFormErrors] = useState({});
  const [isAddressConfigOpen, setIsAddressConfigOpen] = useState(false);

  // Leads View Mode: 'table' (Lead records) | 'activities' (Branch Activities & Supervision)
  const [leadsViewMode, setLeadsViewMode] = useState('table');

  // Lead Bulk CSV Import Engine
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [importParsedRows, setImportParsedRows] = useState([]);
  const [importSelectedTab, setImportSelectedTab] = useState('paste'); // 'paste' | 'file'
  const [importFileName, setImportFileName] = useState('');

  // Branch Activities Filtered for Active Branch
  const activeBranchActivities = useMemo(() => {
    return branchActivities.filter(
      (act) => act.tenantId === activeTenantId && (!act.branchId || act.branchId === activeBranchId)
    );
  }, [branchActivities, activeTenantId, activeBranchId]);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    type: 'counseling_followup',
    statusBadge: 'Attended',
  });

  const emptyLeadForm = {
    name: '',
    parentName: '',
    parentPhone: '',
    email: '',
    phone: '',
    source: 'Walk-in',
    courseId: '',
    classId: '',
    groupId: '',
    status: 'Inquiry',
    priority: 'Medium',
    // Address Details: Address is MANDATORY; Locality & Landmark are OPTIONAL
    address: '',
    locality: '',
    landmark: '',
    doorNo: '',
    attendAddress: '',
    attendStatus: 'Attended',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    notes: '',
  };

  const [leadForm, setLeadForm] = useState(emptyLeadForm);

  // Available classes for selected course in lead form
  const leadFormAvailableClasses = useMemo(() => {
    if (!leadForm.courseId) return activeBranchClasses;
    return tenantClasses.filter(
      (c) => c.courseId === leadForm.courseId && (c.branchId === activeBranchId || !c.branchId)
    );
  }, [tenantClasses, leadForm.courseId, activeBranchId, activeBranchClasses]);

  // Available groups for selected class in lead form
  const leadFormAvailableGroups = useMemo(() => {
    if (!leadForm.classId) return tenantGroups;
    return tenantGroups.filter((g) => g.classId === leadForm.classId);
  }, [tenantGroups, leadForm.classId]);

  const handleOpenNewLead = () => {
    setIsEditingLead(false);
    const initialCourse = tenantCourses[0];
    const initialClasses = tenantClasses.filter((c) => c.courseId === initialCourse?.id);
    const initialClass = initialClasses[0] || activeBranchClasses[0] || tenantClasses[0];
    const initialGroups = tenantGroups.filter((g) => g.classId === initialClass?.id);

    setLeadForm({
      ...emptyLeadForm,
      source: isSoleOwnerMode ? 'Teacher PRV Mobile App' : 'Walk-in',
      courseId: initialCourse?.id || '',
      classId: initialClass?.id || '',
      groupId: initialGroups[0]?.id || '',
      city: activeBranch?.city || 'Bangalore',
      attendAddress: `${activeBranch?.name || 'Main Campus'} - Admissions Center`,
      attendStatus: 'Attended',
    });
    setDuplicateAlert(null);
    setLeadFormErrors({});
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setIsEditingLead(true);
    setActiveLead(lead);
    setLeadForm({
      ...lead,
      parentName: lead.parentName || '',
      parentPhone: lead.parentPhone || '',
      source: lead.source || 'Walk-in',
      courseId: lead.courseId || '',
      classId: lead.classId || '',
      groupId: lead.groupId || '',
      locality: lead.locality || lead.area || '',
      doorNo: lead.doorNo || '',
      landmark: lead.landmark || '',
      attendAddress: lead.attendAddress || '',
      attendStatus: lead.attendStatus || 'Attended',
    });
    setDuplicateAlert(null);
    setLeadFormErrors({});
    setIsLeadModalOpen(true);
  };

  // When Course changes in Lead Form, dynamically update Class and Group
  const handleLeadCourseChange = (newCourseId) => {
    const matchingClasses = tenantClasses.filter((c) => c.courseId === newCourseId);
    const firstClass = matchingClasses[0] || null;
    const matchingGroups = firstClass ? tenantGroups.filter((g) => g.classId === firstClass.id) : [];

    setLeadForm({
      ...leadForm,
      courseId: newCourseId,
      classId: firstClass?.id || '',
      groupId: matchingGroups[0]?.id || '',
    });
  };

  // When Class changes in Lead Form, dynamically update Group
  const handleLeadClassChange = (newClassId) => {
    const matchingGroups = tenantGroups.filter((g) => g.classId === newClassId);
    setLeadForm({
      ...leadForm,
      classId: newClassId,
      groupId: matchingGroups[0]?.id || '',
    });
  };

  const handleSaveLead = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const errors = {};

    if (!leadForm.name?.trim()) errors.name = 'Student Name is required.';
    if (!leadForm.parentName?.trim()) errors.parentName = 'Parent / Guardian Name is required.';
    if (!leadForm.parentPhone?.trim() && !leadForm.phone?.trim()) {
      errors.parentPhone = 'Parent Mobile Number is required.';
    }
    if (!leadForm.email?.trim()) errors.email = 'Email address is required.';
    if (!leadForm.courseId) errors.courseId = 'Please select a Course / Program.';

    // MANDATORY ADDRESS VALIDATION: Address is strictly mandatory
    if (!leadForm.address?.trim()) {
      errors.address = 'Street / Residential Address is a mandatory required field.';
    }

    // Configurable Attend Address option: Mandatory if toggle active
    if (addressConfig.isAttendAddressMandatory && !leadForm.attendAddress?.trim()) {
      errors.attendAddress = 'Attend Address is marked as a mandatory field. Please enter attendance location.';
    }

    // Configurable Attend Status option: Mandatory if toggle active
    if (addressConfig.isAttendStatusMandatory && !leadForm.attendStatus?.trim()) {
      errors.attendStatus = 'Attend status is marked as a mandatory field. Please select candidate attendance.';
    }

    if (Object.keys(errors).length > 0) {
      setLeadFormErrors(errors);
      showToast('⚠️ Please fill in all required fields, including the mandatory Address and Parent information.');
      return;
    }

    // MULTI-FACTOR DUPLICATE CHECK (Student Name, Parent Name, Mobile, Address, Door No)
    const dupCheck = checkDuplicateLead(leadForm, leads, isEditingLead ? activeLead?.id : null);
    if (dupCheck.isDuplicate) {
      setDuplicateAlert(dupCheck);
      showToast(`⚠️ DUPLICATE DETECTED! Matched existing lead owned by ${dupCheck.ownerName}.`);
      return;
    }

    const assignedCourse = tenantCourses.find((c) => c.id === leadForm.courseId);
    const assignedClass = tenantClasses.find((c) => c.id === leadForm.classId);
    const assignedGroup = tenantGroups.find((g) => g.id === leadForm.groupId);

    if (isEditingLead && activeLead) {
      const updated = leads.map((l) =>
        l.id === activeLead.id
          ? {
              ...l,
              ...leadForm,
              phone: leadForm.phone || leadForm.parentPhone,
              parentPhone: leadForm.parentPhone || leadForm.phone,
              course: assignedCourse ? assignedCourse.name : l.course,
              className: assignedClass ? assignedClass.name : l.className,
              groupName: assignedGroup ? assignedGroup.name : l.groupName,
            }
          : l
      );
      setLeads(updated);
      showToast(`Lead "${leadForm.name}" updated successfully.`);
    } else {
      // Sole Lead Ownership Rule:
      // When any teacher or staff enters the lead, they are the sole owner
      const isSole = isSoleOwnerMode || currentUser.role === 'counselor';
      const ownerId = isSole ? currentUser.id : null;
      const ownerName = isSole ? currentUser.name : 'Unassigned';

      const newLead = {
        ...leadForm,
        id: generateLeadId(),
        tenantId: activeTenantId,
        orgId: activeOrg?.id || 'org-101',
        branchId: activeBranchId,
        campus: activeBranch?.name,
        phone: leadForm.phone || leadForm.parentPhone,
        parentPhone: leadForm.parentPhone || leadForm.phone,
        course: assignedCourse?.name || 'Unassigned Course',
        className: assignedClass?.name || 'Unassigned Class',
        groupName: assignedGroup?.name || 'Unassigned Group',
        createdAt: new Date().toISOString().split('T')[0],
        ownerId,
        ownerName,
        assignedTo: ownerName,
        source: leadForm.source || (isSoleOwnerMode ? 'Teacher PRV Mobile App' : 'Walk-in'),
        communicationLogs: [
          {
            id: `log-${Date.now()}`,
            type: 'system',
            content: `Lead created by ${currentUser.name} as Sole Owner via ${leadForm.source || (isSoleOwnerMode ? 'Teacher PRV Mobile App' : 'Walk-in')}.`,
            timestamp: new Date().toISOString(),
            staffName: currentUser.name,
          },
        ],
      };
      setLeads([newLead, ...leads]);
      showToast(`✅ New lead created for "${leadForm.name}". Sole Owner: ${ownerName}.`);
    }

    setDuplicateAlert(null);
    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = (id, name) => {
    if (window.confirm(`Are you sure you want to delete lead for ${name}?`)) {
      setLeads(leads.filter((l) => l.id !== id));
      showToast(`Lead "${name}" deleted.`);
    }
  };

  const handleCopyAddress = (lead) => {
    const parts = [
      lead.doorNo ? `Door/Flat: ${lead.doorNo}` : null,
      lead.address ? `Residential Address (Mandatory): ${lead.address}` : null,
      lead.locality ? `Area/Locality (Optional): ${lead.locality}` : null,
      lead.landmark ? `Landmark (Optional): ${lead.landmark}` : null,
      lead.attendAddress ? `Attend Address: ${lead.attendAddress}` : null,
      lead.attendStatus ? `Attend Status: ${lead.attendStatus}` : null,
      [lead.city, lead.state, lead.pincode].filter(Boolean).join(', '),
    ].filter(Boolean);

    navigator.clipboard.writeText(parts.join('\n'));
    showToast(`Copied address details for ${lead.name} to clipboard.`);
  };

  // ----------------------------------------------------
  // Direct Phone & Messaging Engagement (Call, SMS, WhatsApp)
  // ----------------------------------------------------
  const handleOpenWhatsApp = (lead) => {
    setWhatsAppTargetLead(lead);
    setWhatsAppTemplateId('intro');
    const pName = lead.parentName || 'Parent / Guardian';
    const sName = lead.name;
    const cName = lead.course || 'academic program';
    const bName = activeBranch?.name || 'Main Campus';
    setWhatsAppCustomText(
      `Hello ${pName}, greetings from ${activeTenant?.name || 'CampusConnect'} (${bName}). We received your inquiry regarding admission for ${sName} in ${cName}. We would be delighted to schedule a campus tour or discuss our curriculum and scholarship opportunities. Please let us know a convenient time to connect!`
    );
    setIsWhatsAppModalOpen(true);
  };

  const handleSelectWhatsAppTemplate = (templateKey) => {
    setWhatsAppTemplateId(templateKey);
    const pName = whatsAppTargetLead?.parentName || 'Parent / Guardian';
    const sName = whatsAppTargetLead?.name || 'the student';
    const cName = whatsAppTargetLead?.course || 'our program';
    const bName = activeBranch?.name || 'Main Campus';

    if (templateKey === 'intro') {
      setWhatsAppCustomText(
        `Hello ${pName}, greetings from ${activeTenant?.name || 'CampusConnect'} (${bName}). We received your inquiry regarding admission for ${sName} in ${cName}. We would be delighted to schedule a campus tour or discuss our curriculum and scholarship opportunities. Please let us know a convenient time to connect!`
      );
    } else if (templateKey === 'visit') {
      setWhatsAppCustomText(
        `Dear ${pName}, we cordially invite you and ${sName} to visit our ${bName} campus this week for an interactive counseling session and lab tour. You will get to meet our faculty and explore our facilities. Would tomorrow 11:00 AM work for you?`
      );
    } else if (templateKey === 'fee_scholarship') {
      setWhatsAppCustomText(
        `Dear ${pName}, regarding your inquiry for ${sName} in ${cName}: We have attractive merit-based scholarships up to 40% and flexible term-wise fee installment options. Would you like us to share the detailed fee breakdown over WhatsApp or email?`
      );
    } else if (templateKey === 'docs') {
      setWhatsAppCustomText(
        `Dear ${pName}, reminder regarding admission processing for ${sName}: Kindly share copies of the previous mark sheet and ID proof to confirm seat provisional reservation for the 2026-2027 academic session.`
      );
    }
  };

  const handleSendWhatsApp = () => {
    if (!whatsAppTargetLead) return;
    const phone = whatsAppTargetLead.parentPhone || whatsAppTargetLead.phone;
    if (!phone) {
      showToast('⚠️ No phone number available for this contact.');
      return;
    }
    const cleanNum = phone.replace(/[^0-9]/g, '');
    const fullNum = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    const url = `https://wa.me/${fullNum}?text=${encodeURIComponent(whatsAppCustomText)}`;
    window.open(url, '_blank');

    // Append to communication timeline
    const newLog = {
      id: `log-${Date.now()}`,
      type: 'whatsapp',
      content: whatsAppCustomText,
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
    };

    setLeads(
      leads.map((l) =>
        l.id === whatsAppTargetLead.id
          ? {
              ...l,
              communicationLogs: [newLog, ...(l.communicationLogs || [])],
            }
          : l
      )
    );

    showToast(`🟢 WhatsApp conversation initiated with ${whatsAppTargetLead.parentName || whatsAppTargetLead.name} and logged.`);
    setIsWhatsAppModalOpen(false);
  };

  const handleOpenCall = (lead) => {
    setCallTargetLead(lead);
    setCallOutcome('Connected - Parent Interested');
    setCallNote('');
    setIsCallLogModalOpen(true);

    const phone = lead.parentPhone || lead.phone;
    if (phone) {
      window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
    }
  };

  const handleSaveCallLog = () => {
    if (!callTargetLead) return;
    const newLog = {
      id: `log-${Date.now()}`,
      type: 'call',
      outcome: callOutcome,
      content: callNote || `Call completed with parent. Outcome: ${callOutcome}`,
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
    };

    setLeads(
      leads.map((l) =>
        l.id === callTargetLead.id
          ? {
              ...l,
              communicationLogs: [newLog, ...(l.communicationLogs || [])],
            }
          : l
      )
    );

    showToast(`📞 Call record logged for ${callTargetLead.name}.`);
    setIsCallLogModalOpen(false);
  };

  const handleOpenSMS = (lead) => {
    const phone = lead.parentPhone || lead.phone;
    if (!phone) {
      showToast('⚠️ No phone number available.');
      return;
    }
    const body = `Hello ${lead.parentName || 'Parent'}, thank you for contacting ${activeTenant?.name || 'CampusConnect'}. Regarding admission for ${lead.name}, please contact us at +91 80 4123 4567.`;
    window.location.href = `sms:${phone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(body)}`;

    const newLog = {
      id: `log-${Date.now()}`,
      type: 'sms',
      content: `SMS sent: "${body}"`,
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
    };

    setLeads(
      leads.map((l) =>
        l.id === lead.id
          ? {
              ...l,
              communicationLogs: [newLog, ...(l.communicationLogs || [])],
            }
          : l
      )
    );

    showToast(`💬 SMS initiated to ${phone}.`);
  };

  // ----------------------------------------------------
  // Drop of Leads Handlers (Configurable Reasons)
  // ----------------------------------------------------
  const handleOpenDropModal = (lead) => {
    setLeadToDrop(lead);
    setDropForm({
      reasonCode: dropReasons[0]?.name || 'Not Interested',
      remarks: '',
    });
    setIsDropModalOpen(true);
  };

  const handleConfirmDrop = () => {
    if (!leadToDrop) return;
    const selectedReasonObj = dropReasons.find((r) => r.name === dropForm.reasonCode || r.code === dropForm.reasonCode);
    const reasonName = selectedReasonObj ? selectedReasonObj.name : dropForm.reasonCode;

    const newLog = {
      id: `log-${Date.now()}`,
      type: 'drop',
      content: `Lead marked as Dropped / Lost. Reason: "${reasonName}". Remarks: "${dropForm.remarks || 'None'}"`,
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
    };

    setLeads(
      leads.map((l) =>
        l.id === leadToDrop.id
          ? {
              ...l,
              status: 'Lost',
              dropReason: reasonName,
              dropRemarks: dropForm.remarks,
              droppedAt: new Date().toISOString(),
              droppedBy: currentUser.name,
              communicationLogs: [newLog, ...(l.communicationLogs || [])],
            }
          : l
      )
    );

    showToast(`❌ Lead "${leadToDrop.name}" marked as Dropped (${reasonName}).`);
    setIsDropModalOpen(false);
  };

  const handleSaveNewDropReason = (e) => {
    e.preventDefault();
    if (!newDropReason.name?.trim()) {
      showToast('⚠️ Drop reason name is required.');
      return;
    }

    const code = newDropReason.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const newReason = {
      id: `dr-${Date.now().toString().slice(-4)}`,
      code,
      name: newDropReason.name.trim(),
      category: newDropReason.category || 'General',
      description: newDropReason.description.trim() || 'Custom drop reason added by Tenant Admin.',
    };

    setDropReasons([...dropReasons, newReason]);
    setNewDropReason({ name: '', category: 'Financial', description: '' });
    showToast(`✅ Custom drop reason "${newReason.name}" added to tenant configuration.`);
  };

  const handleDeleteDropReason = (id, name) => {
    if (dropReasons.length <= 1) {
      showToast('⚠️ At least one drop reason must remain configured.');
      return;
    }
    if (window.confirm(`Delete drop reason "${name}"?`)) {
      setDropReasons(dropReasons.filter((r) => r.id !== id));
      showToast(`Drop reason "${name}" deleted.`);
    }
  };

  // ----------------------------------------------------
  // Manual Inbound Lead Area Assignment Handlers
  // ----------------------------------------------------
  const handleOpenAssignModal = (lead) => {
    setSelectedInboundLead(lead);
    // Suggest staff matching this lead's area or branch
    const matchedStaff = users.find(
      (u) =>
        (u.role === 'teacher' || u.role === 'prvo' || u.role === 'counselor') &&
        u.assignedBranchIds?.includes(lead.branchId || activeBranchId)
    );
    setTargetAssigneeId(matchedStaff?.id || users[0]?.id || '');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedInboundLead || !targetAssigneeId) return;
    const targetUser = users.find((u) => u.id === targetAssigneeId);
    if (!targetUser) return;

    const newLog = {
      id: `log-${Date.now()}`,
      type: 'assignment',
      content: `Lead manually assigned by area (${selectedInboundLead.locality || 'General'}) to ${targetUser.name} (${ROLE_DEFINITIONS[targetUser.role]?.label || targetUser.role}) as Sole Owner.`,
      timestamp: new Date().toISOString(),
      staffName: currentUser.name,
    };

    setLeads(
      leads.map((l) =>
        l.id === selectedInboundLead.id
          ? {
              ...l,
              ownerId: targetUser.id,
              ownerName: targetUser.name,
              assignedTo: targetUser.name,
              communicationLogs: [newLog, ...(l.communicationLogs || [])],
            }
          : l
      )
    );

    showToast(`✅ Assigned lead "${selectedInboundLead.name}" to ${targetUser.name} as Sole Owner.`);
    setIsAssignModalOpen(false);
  };

  const handleBulkAssignByArea = (areaName, assigneeUserId) => {
    if (!assigneeUserId) return;
    const targetUser = users.find((u) => u.id === assigneeUserId);
    if (!targetUser) return;

    let count = 0;
    const updated = leads.map((l) => {
      if ((!l.ownerId || l.assignedTo === 'Unassigned') && l.status !== 'Lost' && (l.locality || '').toLowerCase() === areaName.toLowerCase()) {
        count++;
        const newLog = {
          id: `log-${Date.now()}-${l.id}`,
          type: 'assignment',
          content: `Bulk area assignment for "${areaName}" to ${targetUser.name} as Sole Owner.`,
          timestamp: new Date().toISOString(),
          staffName: currentUser.name,
        };
        return {
          ...l,
          ownerId: targetUser.id,
          ownerName: targetUser.name,
          assignedTo: targetUser.name,
          communicationLogs: [newLog, ...(l.communicationLogs || [])],
        };
      }
      return l;
    });

    setLeads(updated);
    showToast(`✅ Assigned all ${count} unassigned leads in area "${areaName}" to ${targetUser.name}.`);
  };

  // CSV Parsing Engine for Lead Import (with Multi-factor Duplicate Detection)
  const parseCSV = (csvText) => {
    if (!csvText || !csvText.trim()) return [];
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
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
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const name = rowObj.name || rowObj.studentname || rowObj.fullname || values[0] || '';
      const parentName = rowObj.parentname || rowObj.parent || rowObj.fathername || rowObj.mothername || values[1] || '';
      const parentPhone = rowObj.parentphone || rowObj.parentmobile || values[2] || '';
      const email = rowObj.email || rowObj.emailaddress || values[3] || '';
      const phone = rowObj.phone || rowObj.phonenumber || rowObj.mobile || parentPhone || values[4] || '';
      const courseName = rowObj.course || rowObj.program || rowObj.coursename || values[5] || '';
      const className = rowObj.class || rowObj.batch || rowObj.classname || values[6] || '';
      const groupName = rowObj.group || rowObj.section || rowObj.groupname || values[7] || '';
      const address = rowObj.address || rowObj.street || rowObj.residentialaddress || values[8] || '';
      const doorNo = rowObj.doorno || rowObj.door || rowObj.flat || rowObj.flatno || values[9] || '';
      const locality = rowObj.area || rowObj.locality || values[10] || '';
      const landmark = rowObj.landmark || values[11] || '';
      const attendAddress = rowObj.attendaddress || rowObj.attendanceaddress || values[12] || '';
      const attendStatus = rowObj.attendstatus || rowObj.attend || rowObj.attendance || values[13] || 'Attended';
      const city = rowObj.city || values[14] || activeBranch?.city || 'Bangalore';
      const state = rowObj.state || values[15] || 'Karnataka';
      const pincode = rowObj.pincode || rowObj.zip || values[16] || '';

      const errors = [];
      if (!name.trim()) errors.push('Student Name is required');
      if (!email.trim()) errors.push('Email is required');
      // Street Address is strictly MANDATORY
      if (!address.trim()) errors.push('Street Address is missing (Address is mandatory)');
      // Area and Landmark are OPTIONAL (no errors if missing)
      // Attend Address mandatory check if toggle is enabled:
      if (addressConfig.isAttendAddressMandatory && !attendAddress.trim()) {
        errors.push('Attend Address is marked mandatory');
      }
      // Attend Status mandatory check if toggle is enabled:
      if (addressConfig.isAttendStatusMandatory && !attendStatus.trim()) {
        errors.push('Attend status is marked mandatory');
      }

      // Check duplicates against existing leads
      const candidateDup = checkDuplicateLead(
        { name, parentName, phone, parentPhone, address, doorNo },
        leads
      );
      if (candidateDup.isDuplicate) {
        errors.push(`Duplicate: Matches ${candidateDup.matchedReasons.join(', ')} (Sole Owner: ${candidateDup.ownerName})`);
      }

      rows.push({
        rawIndex: i,
        name,
        parentName,
        parentPhone,
        email,
        phone,
        courseName,
        className,
        groupName,
        address,
        locality,
        landmark,
        doorNo,
        attendAddress,
        attendStatus,
        city,
        state,
        pincode,
        isValid: errors.length === 0,
        errors,
      });
    }

    return rows;
  };

  const handleImportCsvChange = (text) => {
    setImportCsvText(text);
    const parsed = parseCSV(text);
    setImportParsedRows(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setImportCsvText(content);
        const parsed = parseCSV(content);
        setImportParsedRows(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCSV = () => {
    const sample =
`Name,ParentName,ParentPhone,Email,Phone,Course,Class,Group,Address,DoorNo,Area,Landmark,AttendAddress,AttendStatus,City,State,Pincode
Aarav Sharma,Sunil Sharma,+91 98765 11111,aarav.sample@example.com,+91 98765 11111,B.Tech Computer Science & Engineering,B.Tech CSE - 2026 Batch (Year 1),Section A (Morning AI Track),"14/B, 3rd Cross, 5th Block",Flat 14/B,Koramangala,Opp. Forum Mall,"North Metro Campus - Room 101",Attended,Bangalore,Karnataka,560034
Meera Iyer,Venkatesh Iyer,+91 98765 22222,meera.sample@example.com,+91 98765 22222,B.Sc Data Science & Artificial Intelligence,B.Sc Data Science - 2026 Batch,Group G1 (Predictive Analytics Focus),"Flat 204, Green Heights",Flat 204,Indiranagar,Near Metro Station,"South Tech Park Campus - Desk 4",Attended,Bangalore,Karnataka,560038
Karan Verma,Rajesh Verma,+91 98765 33333,karan.sample@example.com,+91 98765 33333,B.Tech Mechanical & Robotics Engineering,B.Tech Mechanical - 2026 Batch (Year 1),Section A1 (Bosch Industry Cohort),"Plot 45, Science Park Road",Plot 45,HSR Layout,Behind BDA Complex,"North Metro Campus - Robotics Lab",Scheduled,Bangalore,Karnataka,560102`;

    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campus_connect_leads_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded sample leads CSV template.');
  };

  const handleLoadDemoCSV = () => {
    const sampleText =
`Name,ParentName,ParentPhone,Email,Phone,Course,Class,Group,Address,DoorNo,Area,Landmark,AttendAddress,AttendStatus,City,State,Pincode
Aditya Nair,Prakash Nair,+91 98765 44444,aditya.nair@sample.io,+91 98765 44444,B.Tech Computer Science & Engineering,B.Tech CSE - 2026 Batch (Year 1),Section A (Morning AI Track),"42, Palm Avenue, 2nd Main",No. 42,Jayanagar,Near City Library,"South Tech Park Campus - Block B",Attended,Bangalore,Karnataka,560011
Divya Menon,Sreedharan Menon,+91 98765 55555,divya.m@sample.io,+91 98765 55555,B.Sc Data Science & Artificial Intelligence,B.Sc Data Science - 2026 Batch,Group G1 (Predictive Analytics Focus),"Villa 8, Orchid Woods",Villa 8,Whitefield,Opp. ITPL,"South Tech Park Campus - Lab 3",Attended,Bangalore,Karnataka,560066
Suresh Babu,Gopala Babu,+91 98765 66666,suresh.b@sample.io,+91 98765 66666,B.Tech Mechanical & Robotics Engineering,B.Tech Mechanical - 2026 Batch (Year 1),Section A1 (Bosch Industry Cohort),"12/1, Ring Road Industrial Area",12/1,Peenya,Near Toll Gate,"North Metro Campus - Tech Wing",Scheduled,Bangalore,Karnataka,560058
Missing Address Test,Unknown Parent,+91 98765 77777,noaddress@sample.io,+91 98765 77777,B.Tech Computer Science & Engineering,B.Tech CSE - 2026 Batch (Year 1),Section A (Morning AI Track),"",,Koramangala,Opp. Mall,"",Not Attended,Bangalore,Karnataka,560034`;

    setImportCsvText(sampleText);
    const parsed = parseCSV(sampleText);
    setImportParsedRows(parsed);
    showToast('Loaded demo CSV (3 valid leads with mandatory address + 1 invalid lead without address).');
  };

  const handleExecuteImport = () => {
    const validRows = importParsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      showToast('⚠️ No valid leads to import. Please ensure the mandatory Address is entered.');
      return;
    }

    const newLeads = validRows.map((r) => {
      const matchedCourse = tenantCourses.find(
        (c) => c.name.toLowerCase() === r.courseName?.toLowerCase() || c.code?.toLowerCase() === r.courseName?.toLowerCase()
      ) || tenantCourses[0];

      const matchedClass = tenantClasses.find(
        (c) => c.name.toLowerCase() === r.className?.toLowerCase() || c.code?.toLowerCase() === r.className?.toLowerCase()
      ) || tenantClasses.filter((c) => c.courseId === matchedCourse?.id)[0] || tenantClasses[0];

      const matchedGroup = tenantGroups.find(
        (g) => g.name.toLowerCase() === r.groupName?.toLowerCase() || g.code?.toLowerCase() === r.groupName?.toLowerCase()
      ) || tenantGroups.filter((g) => g.classId === matchedClass?.id)[0] || tenantGroups[0];

      return {
        id: generateLeadId(),
        tenantId: activeTenantId,
        orgId: activeOrg?.id || 'org-101',
        branchId: activeBranchId,
        campus: activeBranch?.name,
        name: r.name,
        parentName: r.parentName || 'Parent / Guardian',
        parentPhone: r.parentPhone || r.phone,
        email: r.email,
        phone: r.phone || r.parentPhone,
        status: 'Inquiry',
        priority: 'Medium',
        courseId: matchedCourse?.id || '',
        classId: matchedClass?.id || '',
        groupId: matchedGroup?.id || '',
        course: matchedCourse?.name || r.courseName || 'General Program',
        className: matchedClass?.name || r.className || 'Batch 2026',
        groupName: matchedGroup?.name || r.groupName || 'Section A',
        // Address Details
        address: r.address, // Mandatory
        locality: r.locality, // Optional Area
        landmark: r.landmark, // Optional Landmark
        doorNo: r.doorNo || '',
        attendAddress: r.attendAddress || `${activeBranch?.name} - Admissions Reception`,
        attendStatus: r.attendStatus || 'Attended',
        city: r.city,
        state: r.state,
        pincode: r.pincode,
        notes: `Imported via Bulk CSV on ${new Date().toISOString().split('T')[0]}. Area: ${r.locality || 'General'}. Pending manual area assignment.`,
        createdAt: new Date().toISOString().split('T')[0],
        source: 'Bulk File Upload',
        ownerId: null, // Unassigned: added manually per area of the lead
        ownerName: 'Unassigned',
        assignedTo: 'Unassigned',
        communicationLogs: [
          {
            id: `log-${Date.now()}-${r.rawIndex}`,
            type: 'system',
            content: `Imported via Bulk File Upload. Assigned area: "${r.locality || 'General Area'}". Pending manual allocation.`,
            timestamp: new Date().toISOString(),
            staffName: currentUser.name,
          },
        ],
      };
    });

    setLeads([...newLeads, ...leads]);
    showToast(`✅ Successfully imported ${validRows.length} student leads into Inbound Queue!`);
    setIsImportModalOpen(false);
    setImportCsvText('');
    setImportParsedRows([]);
  };

  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!activityForm.title?.trim()) {
      showToast('⚠️ Activity Title is required.');
      return;
    }
    const newAct = {
      id: `act-${Date.now().toString().slice(-4)}`,
      tenantId: activeTenantId,
      branchId: activeBranchId,
      ...activityForm,
      user: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setBranchActivities([newAct, ...branchActivities]);
    showToast(`New activity logged for branch "${activeBranch?.name}".`);
    setIsActivityModalOpen(false);
    setActivityForm({ title: '', description: '', type: 'counseling_followup', statusBadge: 'Attended' });
  };

  // ----------------------------------------------------
  // 7. Academic Customization Modals (Courses, Classes, Groups)
  // ----------------------------------------------------
  // Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [activeCourseObj, setActiveCourseObj] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    department: '',
    degreeLevel: 'Undergraduate (UG)',
    duration: '4 Years',
    description: '',
  });

  const handleOpenAddCourse = () => {
    setIsEditingCourse(false);
    setCourseForm({
      name: '',
      code: '',
      department: '',
      degreeLevel: 'Undergraduate (UG)',
      duration: '4 Years',
      description: '',
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (crs) => {
    setIsEditingCourse(true);
    setActiveCourseObj(crs);
    setCourseForm({ ...crs });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseForm.name?.trim() || !courseForm.code?.trim()) {
      showToast('⚠️ Course Name and Code are required.');
      return;
    }

    if (isEditingCourse && activeCourseObj) {
      setCourses(
        courses.map((c) => (c.id === activeCourseObj.id ? { ...c, ...courseForm } : c))
      );
      showToast(`Course "${courseForm.name}" updated.`);
    } else {
      const newCourse = {
        ...courseForm,
        id: generateCourseId(),
        tenantId: activeTenantId,
      };
      setCourses([...courses, newCourse]);
      showToast(`New course "${newCourse.name}" created for ${activeTenant.name}.`);
    }
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (id, name) => {
    if (window.confirm(`Delete course "${name}"? This may affect linked classes and leads.`)) {
      setCourses(courses.filter((c) => c.id !== id));
      showToast(`Course "${name}" deleted.`);
    }
  };

  // Class Modal
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [activeClassObj, setActiveClassObj] = useState(null);
  const [classForm, setClassForm] = useState({
    courseId: '',
    branchId: '',
    name: '',
    code: '',
    department: '',
    academicYear: '2026-2027',
    capacity: 60,
    enrolledCount: 0,
    classTeacher: '',
    customFields: [{ key: 'Shift Timing', value: 'Morning (08:30 AM - 02:30 PM)' }],
  });

  const handleOpenCreateClass = () => {
    setIsEditingClass(false);
    setClassForm({
      courseId: tenantCourses[0]?.id || '',
      branchId: activeBranchId,
      name: '',
      code: '',
      department: '',
      academicYear: '2026-2027',
      capacity: 60,
      enrolledCount: 0,
      classTeacher: '',
      customFields: [{ key: 'Shift Timing', value: 'Morning (08:30 AM - 02:30 PM)' }],
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls) => {
    setIsEditingClass(true);
    setActiveClassObj(cls);
    setClassForm({
      ...cls,
      customFields: cls.customFields || [],
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!classForm.name?.trim() || !classForm.code?.trim()) {
      showToast('⚠️ Class Name and Code are required.');
      return;
    }

    if (isEditingClass && activeClassObj) {
      setClasses(
        classes.map((c) => (c.id === activeClassObj.id ? { ...c, ...classForm } : c))
      );
      showToast(`Class "${classForm.name}" updated.`);
    } else {
      const newClass = {
        ...classForm,
        id: generateClassId(),
        tenantId: activeTenantId,
        orgId: activeOrg?.id || 'org-101',
        branchId: classForm.branchId || activeBranchId,
      };
      setClasses([...classes, newClass]);
      showToast(`Customized class "${classForm.name}" created for ${activeBranch?.name}.`);
    }

    setIsClassModalOpen(false);
  };

  const handleDeleteClass = (id, name) => {
    if (window.confirm(`Delete class "${name}"?`)) {
      setClasses(classes.filter((c) => c.id !== id));
      showToast(`Class "${name}" deleted.`);
    }
  };

  // Group / Section Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [activeGroupObj, setActiveGroupObj] = useState(null);
  const [groupForm, setGroupForm] = useState({
    classId: '',
    courseId: '',
    name: '',
    code: '',
    type: 'Section',
    room: '',
    capacity: 30,
    faculty: '',
    notes: '',
  });

  const handleOpenAddGroup = () => {
    setIsEditingGroup(false);
    const defClass = activeBranchClasses[0] || tenantClasses[0];
    setGroupForm({
      classId: defClass?.id || '',
      courseId: defClass?.courseId || tenantCourses[0]?.id || '',
      name: '',
      code: '',
      type: 'Section',
      room: '',
      capacity: 30,
      faculty: '',
      notes: '',
    });
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (grp) => {
    setIsEditingGroup(true);
    setActiveGroupObj(grp);
    setGroupForm({ ...grp });
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = (e) => {
    e.preventDefault();
    if (!groupForm.name?.trim() || !groupForm.code?.trim() || !groupForm.classId) {
      showToast('⚠️ Group Name, Code, and Linked Class are required.');
      return;
    }

    const linkedClass = tenantClasses.find((c) => c.id === groupForm.classId);

    if (isEditingGroup && activeGroupObj) {
      setGroups(
        groups.map((g) =>
          g.id === activeGroupObj.id
            ? { ...g, ...groupForm, courseId: linkedClass?.courseId || g.courseId }
            : g
        )
      );
      showToast(`Group / Section "${groupForm.name}" updated.`);
    } else {
      const newGroup = {
        ...groupForm,
        id: generateGroupId(),
        tenantId: activeTenantId,
        courseId: linkedClass?.courseId || '',
        enrolledCount: 0,
      };
      setGroups([...groups, newGroup]);
      showToast(`New ${groupForm.type} "${newGroup.name}" created.`);
    }

    setIsGroupModalOpen(false);
  };

  const handleDeleteGroup = (id, name) => {
    if (window.confirm(`Delete group/section "${name}"?`)) {
      setGroups(groups.filter((g) => g.id !== id));
      showToast(`Group "${name}" deleted.`);
    }
  };

  // ----------------------------------------------------
  // 8. User Management & Role Assignment
  // ----------------------------------------------------
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTargetUser, setPasswordTargetUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);

  const emptyUserForm = {
    name: '',
    email: '',
    phone: '',
    role: 'admissions_counselor',
    password: '',
    assignedGroupIds: [], // Single or multiple groups
    assignedBranchIds: [activeBranchId],
    primaryBranchId: activeBranchId, // Compulsory Default Branch
    status: 'Active',
  };

  const [userForm, setUserForm] = useState(emptyUserForm);
  const [userFormErrors, setUserFormErrors] = useState({});

  const handleOpenAddUser = () => {
    setIsEditingUser(false);
    setSelectedUserToEdit(null);
    setUserForm({
      ...emptyUserForm,
      password: generatePassword(),
      assignedGroupIds: tenantGroups[0] ? [tenantGroups[0].id] : [],
      assignedBranchIds: [activeBranchId],
      primaryBranchId: activeBranchId,
    });
    setUserFormErrors({});
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setIsEditingUser(true);
    setSelectedUserToEdit(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: user.password || '',
      assignedGroupIds: user.assignedGroupIds || [],
      assignedBranchIds: user.assignedBranchIds || [],
      primaryBranchId: user.primaryBranchId || user.assignedBranchIds?.[0] || activeBranchId,
      status: user.status || 'Active',
    });
    setUserFormErrors({});
    setIsUserModalOpen(true);
  };

  // Assign or toggle single/multiple groups for user
  const handleToggleGroupAssignment = (groupId) => {
    const currentList = userForm.assignedGroupIds || [];
    if (currentList.includes(groupId)) {
      setUserForm({
        ...userForm,
        assignedGroupIds: currentList.filter((id) => id !== groupId),
      });
    } else {
      setUserForm({
        ...userForm,
        assignedGroupIds: [...currentList, groupId],
      });
    }
  };

  const handleSelectAllGroups = () => {
    setUserForm({
      ...userForm,
      assignedGroupIds: tenantGroups.map((g) => g.id),
    });
  };

  const handleClearAllGroups = () => {
    setUserForm({
      ...userForm,
      assignedGroupIds: [],
    });
  };

  const handleToggleBranchAssignment = (branchId) => {
    const currentList = userForm.assignedBranchIds || [];
    let updatedList;
    if (currentList.includes(branchId)) {
      if (currentList.length === 1) {
        showToast('⚠️ A user must have at least one assigned branch.');
        return;
      }
      updatedList = currentList.filter((id) => id !== branchId);
      let newPrimary = userForm.primaryBranchId;
      if (newPrimary === branchId) {
        newPrimary = updatedList[0];
      }
      setUserForm({
        ...userForm,
        assignedBranchIds: updatedList,
        primaryBranchId: newPrimary,
      });
    } else {
      updatedList = [...currentList, branchId];
      setUserForm({
        ...userForm,
        assignedBranchIds: updatedList,
      });
    }
  };

  // Set the compulsory default branch (home location)
  const handleSelectPrimaryBranch = (branchId) => {
    let updatedAssigned = userForm.assignedBranchIds || [];
    if (!updatedAssigned.includes(branchId)) {
      updatedAssigned = [...updatedAssigned, branchId];
    }
    setUserForm({
      ...userForm,
      assignedBranchIds: updatedAssigned,
      primaryBranchId: branchId,
    });
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const errors = {};

    if (!userForm.name?.trim()) errors.name = 'User Name is required.';
    if (!userForm.email?.trim()) errors.email = 'Email is required.';
    if (!isEditingUser && !userForm.password?.trim()) errors.password = 'Initial Password is required.';
    if (!userForm.assignedBranchIds || userForm.assignedBranchIds.length === 0) {
      errors.branches = 'Assign at least one branch for this user.';
    }
    // Compulsory Default Branch validation
    if (!userForm.primaryBranchId || !userForm.assignedBranchIds?.includes(userForm.primaryBranchId)) {
      errors.primaryBranch = 'A compulsory default branch must be designated for this user.';
    }

    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    const defaultBranchName = allBranches.find((b) => b.id === userForm.primaryBranchId)?.name || 'Default Branch';

    if (isEditingUser && selectedUserToEdit) {
      const updated = users.map((u) =>
        u.id === selectedUserToEdit.id ? { ...u, ...userForm } : u
      );
      setUsers(updated);
      showToast(`User "${userForm.name}" updated with compulsory default branch: ${defaultBranchName} and ${userForm.assignedGroupIds?.length || 0} groups.`);
    } else {
      const newUser = {
        ...userForm,
        id: generateUserId(),
        tenantId: activeTenantId,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
      };
      setUsers([newUser, ...users]);
      showToast(`New user "${userForm.name}" added with compulsory default branch: ${defaultBranchName}.`);
    }

    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (user) => {
    if (user.id === currentUserId) {
      showToast('⚠️ You cannot delete the currently logged-in user.');
      return;
    }
    if (window.confirm(`Delete user "${user.name}"?`)) {
      setUsers(users.filter((u) => u.id !== user.id));
      showToast(`User "${user.name}" removed.`);
    }
  };

  const handleOpenPasswordModal = (user) => {
    setPasswordTargetUser(user);
    setNewPasswordInput(generatePassword());
    setShowPasswordText(true);
    setIsPasswordModalOpen(true);
  };

  const handleSaveNewPassword = (e) => {
    e.preventDefault();
    if (!newPasswordInput?.trim()) {
      showToast('⚠️ Password cannot be blank.');
      return;
    }

    setUsers(
      users.map((u) =>
        u.id === passwordTargetUser.id ? { ...u, password: newPasswordInput } : u
      )
    );
    showToast(`Password successfully updated for ${passwordTargetUser.name}.`);
    setIsPasswordModalOpen(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        userSearchQuery === '' ||
        u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.phone?.includes(userSearchQuery);

      const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearchQuery, userRoleFilter]);

  // ----------------------------------------------------
  // 9. Tenant Management & Auto-Generated Tenant ID
  // ----------------------------------------------------
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [tenantForm, setTenantForm] = useState({
    id: generateTenantId(),
    name: '',
    code: '',
    domain: '',
    tier: 'Enterprise Multi-Org Plan',
    contactEmail: '',
  });

  const handleOpenAddTenant = () => {
    setTenantForm({
      id: generateTenantId(),
      name: '',
      code: '',
      domain: '',
      tier: 'Enterprise Multi-Org Plan',
      contactEmail: '',
    });
    setIsTenantModalOpen(true);
  };

  const handleRegenerateTenantId = () => {
    setTenantForm((prev) => ({
      ...prev,
      id: generateTenantId(),
    }));
    showToast('Auto-generated a fresh Tenant ID.');
  };

  const handleSaveTenant = (e) => {
    e.preventDefault();
    if (!tenantForm.name?.trim()) {
      showToast('⚠️ Tenant Name is required.');
      return;
    }

    const tenantId = tenantForm.id || generateTenantId();
    const newTenant = {
      ...tenantForm,
      id: tenantId,
      createdAt: new Date().toISOString().split('T')[0],
      domain: tenantForm.domain || `${tenantForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.campusconnect.io`,
    };

    // Auto-provision 3 branches for this new tenant organization:
    // Branch A, Branch B (Default), Branch C
    const branchAId = `branch-${Date.now().toString().slice(-4)}-a`;
    const branchBId = `branch-${Date.now().toString().slice(-4)}-b`;
    const branchCId = `branch-${Date.now().toString().slice(-4)}-c`;
    const orgId = `org-${Date.now().toString().slice(-4)}`;

    const newOrg = {
      id: orgId,
      tenantId: tenantId,
      name: `${tenantForm.name} Educational System`,
      code: tenantForm.code || 'EDU',
      type: 'Higher Education / University',
      defaultBranchId: branchBId,
      branches: [
        {
          id: branchAId,
          name: 'Branch A - North Metro Campus',
          code: 'BRA',
          isDefault: false,
          city: 'Bangalore',
          address: 'Outer Ring Road, North Corridor',
        },
        {
          id: branchBId,
          name: 'Branch B - South Tech Park Campus',
          code: 'BRB',
          isDefault: true, // Compulsory Default Branch
          city: 'Bangalore',
          address: 'Electronic City, Tech Park Sector 1',
        },
        {
          id: branchCId,
          name: 'Branch C - Downtown City Center',
          code: 'BRC',
          isDefault: false,
          city: 'Bangalore',
          address: 'Central Business District, MG Road',
        },
      ],
    };

    // Auto-provision Courses, Classes & Groups
    const crs1Id = `crs-${Date.now().toString().slice(-4)}-1`;
    const crs2Id = `crs-${Date.now().toString().slice(-4)}-2`;
    const newCourses = [
      {
        id: crs1Id,
        tenantId: tenantId,
        name: 'B.Tech Computer Science & AI',
        code: `${tenantForm.code || 'CS'}-101`,
        department: 'School of Computing',
        degreeLevel: 'Undergraduate (UG)',
        duration: '4 Years',
        description: 'Core computing, machine learning, and cloud architecture',
      },
      {
        id: crs2Id,
        tenantId: tenantId,
        name: 'B.B.A Digital Business & Analytics',
        code: `${tenantForm.code || 'BBA'}-102`,
        department: 'School of Management',
        degreeLevel: 'Undergraduate (UG)',
        duration: '3 Years',
        description: 'Digital commerce, product management, and business intelligence',
      },
    ];

    const cls1Id = `cls-${Date.now().toString().slice(-4)}-1`;
    const cls2Id = `cls-${Date.now().toString().slice(-4)}-2`;
    const newClasses = [
      {
        id: cls1Id,
        tenantId: tenantId,
        courseId: crs1Id,
        orgId: orgId,
        branchId: branchBId,
        name: 'B.Tech CSE 2026 Batch',
        code: 'CSE-26',
        department: 'Computer Science',
        academicYear: '2026-2027',
        capacity: 60,
        enrolledCount: 0,
        classTeacher: 'Dean Academic',
      },
      {
        id: cls2Id,
        tenantId: tenantId,
        courseId: crs2Id,
        orgId: orgId,
        branchId: branchAId,
        name: 'BBA 2026 Batch',
        code: 'BBA-26',
        department: 'Business Management',
        academicYear: '2026-2027',
        capacity: 50,
        enrolledCount: 0,
        classTeacher: 'Prof. Management',
      },
    ];

    const grp1Id = `grp-${Date.now().toString().slice(-4)}-1`;
    const grp2Id = `grp-${Date.now().toString().slice(-4)}-2`;
    const grp3Id = `grp-${Date.now().toString().slice(-4)}-3`;
    const newGroups = [
      {
        id: grp1Id,
        tenantId: tenantId,
        courseId: crs1Id,
        classId: cls1Id,
        name: 'Section A (Morning AI Track)',
        code: 'SEC-A',
        type: 'Section',
        room: 'Hall 101',
        capacity: 30,
        enrolledCount: 0,
      },
      {
        id: grp2Id,
        tenantId: tenantId,
        courseId: crs1Id,
        classId: cls1Id,
        name: 'Lab Group Alpha (Robotics)',
        code: 'LAB-A',
        type: 'Lab Group',
        room: 'Lab 2',
        capacity: 25,
        enrolledCount: 0,
      },
      {
        id: grp3Id,
        tenantId: tenantId,
        courseId: crs2Id,
        classId: cls2Id,
        name: 'Syndicate Group 1',
        code: 'SYN-1',
        type: 'Specialization Track',
        room: 'Seminar Room 3',
        capacity: 25,
        enrolledCount: 0,
      },
    ];

    // Auto-provision initial Tenant Admin user with:
    // Compulsory Default Branch: Branch B (branchBId)
    // Optional Accessible Branches: Branch A (branchAId), Branch C (branchCId)
    // Assigned Groups: [grp1Id, grp2Id, grp3Id] (Multiple groups!)
    const adminUserId = generateUserId();
    const newAdminUser = {
      id: adminUserId,
      tenantId: tenantId,
      name: `${tenantForm.name} Admin`,
      email: tenantForm.contactEmail || `admin@${tenantForm.code ? tenantForm.code.toLowerCase() : 'campus'}.io`,
      role: 'tenant_admin',
      password: generatePassword(),
      phone: '+91 98765 00099',
      assignedBranchIds: [branchAId, branchBId, branchCId],
      primaryBranchId: branchBId, // Compulsory Default Branch B
      assignedGroupIds: [grp1Id, grp2Id, grp3Id], // Multiple groups assigned!
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };

    setTenants([...tenants, newTenant]);
    setOrganizations([...organizations, newOrg]);
    setCourses([...courses, ...newCourses]);
    setClasses([...classes, ...newClasses]);
    setGroups([...groups, ...newGroups]);
    setUsers([...users, newAdminUser]);
    setActiveTenantId(newTenant.id);
    setCurrentUserId(adminUserId);
    setActiveBranchId(branchBId);
    showToast(`Tenant "${newTenant.name}" created with 3 branches (A, B, C), academic groups, and Tenant Admin user!`);
    setIsTenantModalOpen(false);
  };

  // ----------------------------------------------------
  // 10. Organizations Management
  // ----------------------------------------------------
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedOrgForBranch, setSelectedOrgForBranch] = useState(null);

  const [orgForm, setOrgForm] = useState({
    name: '',
    code: '',
    type: 'Higher Education / University',
    branchName: 'Main Campus',
    branchCity: 'Bangalore',
    branchAddress: 'Tech Boulevard',
  });

  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    isDefault: false,
  });

  const handleCreateOrg = (e) => {
    e.preventDefault();
    if (!orgForm.name?.trim()) {
      showToast('⚠️ Organization name is required.');
      return;
    }

    const orgId = `org-${Date.now().toString().slice(-4)}`;
    const branchId = generateBranchId();

    const newOrg = {
      id: orgId,
      tenantId: activeTenantId,
      name: orgForm.name,
      code: orgForm.code || orgForm.name.slice(0, 4).toUpperCase(),
      type: orgForm.type,
      defaultBranchId: branchId,
      branches: [
        {
          id: branchId,
          name: orgForm.branchName || 'Main Campus',
          code: `${orgForm.code || 'BR'}-01`,
          isDefault: true,
          city: orgForm.branchCity || 'Bangalore',
          address: orgForm.branchAddress || 'Main Road',
        },
      ],
    };

    setOrganizations([...organizations, newOrg]);
    showToast(`Organization "${newOrg.name}" created.`);
    setIsOrgModalOpen(false);
  };

  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!branchForm.name?.trim() || !selectedOrgForBranch) {
      showToast('⚠️ Branch name is required.');
      return;
    }

    const newBranchId = generateBranchId();
    const newBranch = {
      id: newBranchId,
      name: branchForm.name,
      code: branchForm.code || `BR-${Math.floor(100 + Math.random() * 900)}`,
      isDefault: false,
      city: branchForm.city || 'Bangalore',
      address: branchForm.address || 'Campus Road',
    };

    const updatedOrgs = organizations.map((org) => {
      if (org.id === selectedOrgForBranch.id) {
        return {
          ...org,
          branches: [...org.branches, newBranch],
        };
      }
      return org;
    });

    setOrganizations(updatedOrgs);
    showToast(`New branch "${newBranch.name}" added.`);
    setIsBranchModalOpen(false);
  };

  // ----------------------------------------------------
  // Render Main Layout
  // ----------------------------------------------------
  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRV TEACHER MOBILE SMARTPHONE APPLICATION VIEW */}
      {/* ======================================================== */}
      {isMobileViewMode ? (
        <div className="mobile-app-wrapper" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px' }}>
          {/* Top Switch Bar */}
          <div className="mobile-app-top-switch-bar" style={{ width: '100%', maxWidth: 440, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffffff' }}>
              <Smartphone size={20} color="#60a5fa" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>CampusConnect PRV Mobile</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Teacher & Field Coordinator App</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsPwaModalOpen(true)}
                style={{ background: '#334155', color: '#ffffff', border: '1px solid #475569', fontSize: '0.75rem' }}
              >
                <Download size={13} /> Install APK
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsMobileViewMode(false)}
                style={{ background: '#2563eb', color: '#ffffff', fontSize: '0.75rem' }}
              >
                🖥️ Desktop CRM
              </button>
            </div>
          </div>

          {/* Smartphone Hardware Frame */}
          <div className="mobile-phone-device">
            {/* Phone Notch & Status Bar */}
            <div className="mobile-status-bar">
              <span>9:41</span>
              <div className="mobile-notch"></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile App Header */}
            <div className="mobile-phone-header">
              <div>
                <div className="mobile-app-title">
                  <GraduationCap size={18} />
                  <span>{activeTenant?.name || 'CampusConnect'}</span>
                </div>
                <div className="mobile-app-sub">
                  {currentUser.name} • {ROLE_DEFINITIONS[currentUser.role]?.label || currentUser.role}
                </div>
              </div>

              {/* Branch Selector Pill */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#1d4ed8', border: '1px solid #3b82f6', borderRadius: 12, padding: '3px 8px', fontSize: '0.675rem', fontWeight: 700, color: '#ffffff' }}>
                  ★ {userPrimaryBranch?.name}
                </span>
              </div>
            </div>

            {/* Mobile Tab Content */}
            <div className="mobile-phone-content">
              {/* TAB 1: MY LEADS (SOLE OWNERSHIP ENFORCED) */}
              {mobileActiveTab === 'leads' && (
                <>
                  <div className="mobile-sole-owner-banner">
                    <Shield size={16} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Sole Lead Ownership:</strong> Showing leads created by or assigned to you ({currentUser.name}). Other staff cannot access your leads.
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      My Student Leads ({filteredLeads.filter(l => l.ownerId === currentUser.id || l.assignedTo === currentUser.name || !isSoleOwnerMode).length})
                    </h3>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setMobileActiveTab('add')}
                      style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    >
                      <Plus size={13} /> Fast Add
                    </button>
                  </div>

                  {filteredLeads.filter(l => l.ownerId === currentUser.id || l.assignedTo === currentUser.name || !isSoleOwnerMode).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 14px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', color: '#64748b' }}>
                      <Users size={32} color="#cbd5e1" style={{ marginBottom: 8 }} />
                      <p style={{ margin: '0 0 10px', fontSize: '0.85rem' }}>No student leads owned by you yet.</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setMobileActiveTab('add')}
                      >
                        <Plus size={14} /> Enter First Lead
                      </button>
                    </div>
                  ) : (
                    filteredLeads
                      .filter(l => l.ownerId === currentUser.id || l.assignedTo === currentUser.name || !isSoleOwnerMode)
                      .map((lead) => (
                        <div key={lead.id} className="mobile-card">
                          <div className="mobile-card-header">
                            <div>
                              <div className="mobile-student-name">{lead.name}</div>
                              <div className="mobile-parent-line">
                                👨‍👩‍👦 Parent: <strong>{lead.parentName || 'Parent / Guardian'}</strong>
                              </div>
                            </div>
                            <span className={`status-badge status-${(lead.status || 'inquiry').toLowerCase()}`} style={{ fontSize: '0.675rem' }}>
                              {lead.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                            🎓 {lead.course} • {lead.className}
                          </div>

                          <div className="mobile-address-line">
                            <MapPin size={12} color="#dc2626" style={{ flexShrink: 0 }} />
                            <span>{lead.address} {lead.locality ? `(${lead.locality})` : ''}</span>
                          </div>

                          {lead.dropReason && (
                            <div style={{ fontSize: '0.725rem', color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>
                              Drop Reason: {lead.dropReason}
                            </div>
                          )}

                          {/* Mobile Touch Action Buttons: Call, SMS, WhatsApp, Drop */}
                          <div className="mobile-touch-actions">
                            <button
                              className="btn-m-action btn-m-call"
                              onClick={() => handleOpenCall(lead)}
                              title="Call Parent Phone"
                            >
                              <Phone size={14} />
                              <span>Call</span>
                            </button>

                            <button
                              className="btn-m-action btn-m-sms"
                              onClick={() => handleOpenSMS(lead)}
                              title="Send SMS"
                            >
                              <MessageCircle size={14} />
                              <span>SMS</span>
                            </button>

                            <button
                              className="btn-m-action btn-m-wa"
                              onClick={() => handleOpenWhatsApp(lead)}
                              title="Send WhatsApp Message"
                            >
                              <MessageSquare size={14} />
                              <span>WhatsApp</span>
                            </button>

                            {lead.status !== 'Lost' && (
                              <button
                                className="btn-m-action btn-m-drop"
                                onClick={() => handleOpenDropModal(lead)}
                                title="Mark as Dropped"
                              >
                                <UserX size={14} />
                                <span>Drop</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </>
              )}

              {/* TAB 2: FAST ADD LEAD (WITH LIVE 5-FACTOR DUPLICATE CHECK) */}
              {mobileActiveTab === 'add' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Fast Lead Entry (Sole Owner: {currentUser.name})
                    </h3>
                  </div>

                  {/* DUPLICATE WARNING IN MOBILE */}
                  {duplicateAlert && duplicateAlert.isDuplicate && (
                    <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: 8, padding: 10, fontSize: '0.75rem', color: '#991b1b' }}>
                      <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, color: '#dc2626' }}>
                        <AlertTriangle size={14} /> DUPLICATE DETECTED
                      </div>
                      <div style={{ marginTop: 2 }}>
                        Matches lead <strong>{duplicateAlert.existingLead?.name}</strong> owned by <strong>{duplicateAlert.ownerName}</strong>.
                      </div>
                      <div style={{ marginTop: 2, fontWeight: 600 }}>
                        Matched: {duplicateAlert.matchedReasons?.join(', ')}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSaveLead} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Student Name <span className="req-star">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Student name"
                        value={leadForm.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = { ...leadForm, name: val };
                          setLeadForm(next);
                          const dup = checkDuplicateLead(next, leads);
                          if (dup.isDuplicate) setDuplicateAlert(dup);
                          else if (duplicateAlert) setDuplicateAlert(null);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Parent / Guardian Name <span className="req-star">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Parent name"
                        value={leadForm.parentName}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = { ...leadForm, parentName: val };
                          setLeadForm(next);
                          const dup = checkDuplicateLead(next, leads);
                          if (dup.isDuplicate) setDuplicateAlert(dup);
                          else if (duplicateAlert) setDuplicateAlert(null);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Parent Mobile Number <span className="req-star">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="+91 98765 11111"
                        value={leadForm.parentPhone}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = { ...leadForm, parentPhone: val };
                          setLeadForm(next);
                          const dup = checkDuplicateLead(next, leads);
                          if (dup.isDuplicate) setDuplicateAlert(dup);
                          else if (duplicateAlert) setDuplicateAlert(null);
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Student Email <span className="req-star">*</span></label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="student@example.com"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Course / Program <span className="req-star">*</span></label>
                      <select
                        className="form-select"
                        value={leadForm.courseId}
                        onChange={(e) => handleLeadCourseChange(e.target.value)}
                      >
                        <option value="">-- Select Course --</option>
                        {tenantCourses.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>
                        Street Address <span className="req-star">* Mandatory</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="House / Street Address (Mandatory)"
                        value={leadForm.address}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = { ...leadForm, address: val };
                          setLeadForm(next);
                          const dup = checkDuplicateLead(next, leads);
                          if (dup.isDuplicate) setDuplicateAlert(dup);
                          else if (duplicateAlert) setDuplicateAlert(null);
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Area / Locality</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Koramangala"
                          value={leadForm.locality}
                          onChange={(e) => setLeadForm({ ...leadForm, locality: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Door / Flat No</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 14/B"
                          value={leadForm.doorNo}
                          onChange={(e) => {
                            const val = e.target.value;
                            const next = { ...leadForm, doorNo: val };
                            setLeadForm(next);
                            const dup = checkDuplicateLead(next, leads);
                            if (dup.isDuplicate) setDuplicateAlert(dup);
                            else if (duplicateAlert) setDuplicateAlert(null);
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ marginTop: 8, padding: '10px 14px', width: '100%', fontWeight: 700 }}
                    >
                      💾 Register Lead (You are Sole Owner)
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: INBOUND AREA QUEUE */}
              {mobileActiveTab === 'inbound' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Inbound Queue ({unassignedInboundLeads.length})
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    Leads captured via Walk-ins, WhatsApp & Ads pending manual assignment per area.
                  </p>

                  {unassignedInboundLeads.map((lead) => (
                    <div key={lead.id} className="mobile-card">
                      <div className="mobile-card-header">
                        <div>
                          <div className="mobile-student-name">{lead.name}</div>
                          <div className="mobile-parent-line">Parent: {lead.parentName}</div>
                        </div>
                        <span className="source-badge-chip">{lead.source}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>
                        📍 Area: <strong>{lead.locality || 'General'}</strong>
                      </div>
                      <div className="mobile-address-line">{lead.address}</div>

                      <div className="mobile-touch-actions">
                        <button
                          className="btn-m-action btn-m-call"
                          onClick={() => handleOpenCall(lead)}
                        >
                          <Phone size={13} />
                          <span>Call</span>
                        </button>
                        <button
                          className="btn-m-action btn-m-wa"
                          onClick={() => handleOpenWhatsApp(lead)}
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          className="btn-m-action"
                          style={{ background: '#2563eb', color: '#ffffff' }}
                          onClick={() => {
                            setLeads(
                              leads.map((l) =>
                                l.id === lead.id
                                  ? { ...l, ownerId: currentUser.id, ownerName: currentUser.name, assignedTo: currentUser.name }
                                  : l
                              )
                            );
                            showToast(`Claimed lead "${lead.name}" as Sole Owner!`);
                          }}
                        >
                          <UserCheck size={13} />
                          <span>Claim Lead</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: DROP STATS & REASONS */}
              {mobileActiveTab === 'drop_stats' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Drop Reasons ({droppedLeads.length} Drops)
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {dropReasons.map((dr) => {
                      const count = dropReasonsStats[dr.name] || 0;
                      return (
                        <div key={dr.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{dr.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{dr.description}</div>
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: count > 0 ? '#dc2626' : '#94a3b8' }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: STAFF PROFILE & BRANCHES */}
              {mobileActiveTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ background: '#ffffff', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: '50%', background: currentUserRole.color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '1.2rem', fontWeight: 800 }}>
                      {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <h4 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 800 }}>{currentUser.name}</h4>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{ROLE_DEFINITIONS[currentUser.role]?.label || currentUser.role}</div>
                  </div>

                  <div style={{ background: '#ffffff', borderRadius: 12, padding: 12, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Branch Presence:</div>
                    <div>★ <strong>Compulsory Default Branch:</strong> {userPrimaryBranch?.name} (Physical Presence)</div>
                    {userOptionalBranches.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        🏢 <strong>Optional Supervised Branches:</strong> {userOptionalBranches.map(b => b.name).join(', ')}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsPwaModalOpen(true)}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '10px 14px' }}
                  >
                    <Download size={14} /> Download Mobile App (APK / PWA)
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => setIsMobileViewMode(false)}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '10px 14px' }}
                  >
                    Switch to Full Desktop CRM View
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Bottom Dock Navigation Bar */}
            <div className="mobile-bottom-nav">
              <button
                className={`mobile-nav-btn ${mobileActiveTab === 'leads' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('leads')}
              >
                <Users size={16} />
                <span>My Leads</span>
              </button>

              <button
                className={`mobile-nav-btn ${mobileActiveTab === 'add' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('add')}
              >
                <Plus size={16} />
                <span>Fast Add</span>
              </button>

              <button
                className={`mobile-nav-btn ${mobileActiveTab === 'inbound' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('inbound')}
              >
                <Upload size={16} />
                <span>Inbound</span>
              </button>

              <button
                className={`mobile-nav-btn ${mobileActiveTab === 'drop_stats' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('drop_stats')}
              >
                <TrendingDown size={16} />
                <span>Drop Stats</span>
              </button>

              <button
                className={`mobile-nav-btn ${mobileActiveTab === 'profile' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('profile')}
              >
                <UserCheck size={16} />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* 1. SaaS Tenant Header Bar */}
      <div className="tenant-bar">
        <div className="tenant-left">
          <span className="tenant-tag" title="Auto-Generated Tenant ID">
            <School size={13} />
            Tenant: <strong>{activeTenant.name}</strong>
          </span>
          <span className="tenant-id-pill" title="Auto-generated Tenant Unique ID">
            ID: <code>{activeTenant.id}</code>
          </span>
          <span className="tenant-fixed-notice">
            Plan: {activeTenant.tier}
          </span>
        </div>

        <div className="tenant-right">
          <div className="tenant-switcher-group">
            <select
              className="tenant-select"
              value={activeTenantId}
              onChange={(e) => {
                setActiveTenantId(e.target.value);
                showToast(`Switched active tenant to ${tenants.find((t) => t.id === e.target.value)?.name}`);
              }}
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>

            {canManageTenants && (
              <button
                className="btn-add-tenant-pill"
                onClick={handleOpenAddTenant}
                title="Add a new tenant (Tenant ID will be auto-generated)"
              >
                <Plus size={12} /> Add Tenant (Auto-ID)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main App Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="brand-title">
                Campus Connect SaaS
                <span className="brand-badge">Multi-Tenant CRM</span>
              </div>
              <div className="brand-subtitle">
                {activeOrg?.name} • {activeTenant?.name}
              </div>
            </div>
          </div>

          {/* Active Branch Selector (Restricted to User's Assigned Branches) */}
          <div className="branch-selector-wrapper" ref={branchDropdownRef}>
            <button
              className="branch-selector-btn"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              title="Click to switch active branch context and check branch activities"
            >
              <Building2 size={18} color="#2563eb" />
              <div className="branch-active-label">
                <span className="branch-active-org">{activeOrg?.name}</span>
                <span className="branch-active-name">
                  {activeBranch?.name}
                  {isCurrentActivePrimary ? (
                    <span className="primary-star-badge" title="Your compulsory Default Branch (Home Location)">
                      ★ Default Branch
                    </span>
                  ) : (
                    <span className="optional-branch-badge" title="Checking activities of an Optional Branch">
                      🏢 Optional Branch (Checking Activities)
                    </span>
                  )}
                </span>
              </div>
              <ChevronDown size={16} color="#64748b" />
            </button>

            {isBranchDropdownOpen && (
              <div className="branch-dropdown-menu">
                <div className="dropdown-header-note">
                  <div><strong>Your Assigned Branches:</strong></div>
                  <div style={{ marginTop: 4, fontSize: '0.74rem', color: '#64748b' }}>
                    ★ <strong>Default Branch:</strong> Physical presence ({userPrimaryBranch?.name}). Opens by default on CRM launch.
                  </div>
                  <div style={{ marginTop: 2, fontSize: '0.74rem', color: '#64748b' }}>
                    🏢 <strong>Optional Branches:</strong> Select to check leads, batches & activities of those branches.
                  </div>
                </div>

                {/* Default Branch Section */}
                {userPrimaryBranch && (
                  <div className="dropdown-branch-section">
                    <div className="dropdown-section-header">
                      <Star size={12} fill="#eab308" color="#ca8a04" />
                      <span>Compulsory Default Branch (Home Presence)</span>
                    </div>
                    <button
                      className={`dropdown-branch-item default-branch-item ${activeBranchId === userPrimaryBranch.id ? 'is-active' : ''}`}
                      onClick={() => handleSelectBranch(userPrimaryBranch.id)}
                    >
                      <div>
                        <div className="branch-item-name">
                          {userPrimaryBranch.name}
                          <span className="primary-star-badge">★ Default Branch</span>
                        </div>
                        <div className="branch-item-city">
                          {userPrimaryBranch.orgName} • {userPrimaryBranch.city} (Physical Presence)
                        </div>
                      </div>
                      {activeBranchId === userPrimaryBranch.id && <CheckCircle2 size={16} color="#2563eb" />}
                    </button>
                  </div>
                )}

                {/* Optional Branches Section */}
                {userOptionalBranches.length > 0 && (
                  <div className="dropdown-branch-section" style={{ marginTop: 8 }}>
                    <div className="dropdown-section-header">
                      <Building2 size={12} color="#0891b2" />
                      <span>Optional Branches ({userOptionalBranches.length} Supervised)</span>
                    </div>
                    {userOptionalBranches.map((b) => {
                      const isActive = b.id === activeBranchId;
                      return (
                        <button
                          key={b.id}
                          className={`dropdown-branch-item optional-branch-item ${isActive ? 'is-active' : ''}`}
                          onClick={() => handleSelectBranch(b.id)}
                        >
                          <div>
                            <div className="branch-item-name">
                              {b.name}
                              <span className="optional-pill-tag">Optional Branch</span>
                            </div>
                            <div className="branch-item-city">
                              {b.orgName} • {b.city} (Select to check activities)
                            </div>
                          </div>
                          {isActive && <CheckCircle2 size={16} color="#2563eb" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher Simulator */}
          <div className="user-profile-wrapper" ref={userMenuRef}>
            <button
              className="user-profile-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title="Current logged-in user profile & role switcher"
            >
              <div className="user-avatar-circle" style={{ backgroundColor: currentUserRole.color }}>
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="user-info-text">
                <div className="user-name-line">
                  <strong>{currentUser.name}</strong>
                  <span className={`user-role-chip ${currentUserRole.badgeClass}`}>
                    {currentUserRole.label}
                  </span>
                </div>
                <div className="user-branch-line">
                  Primary: <strong>{userPrimaryBranch?.name || 'None'}</strong>
                  {userAllowedBranches.length > 1 && (
                    <span className="user-branch-count"> (+{userAllowedBranches.length - 1} more)</span>
                  )}
                </div>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {/* User Switcher Dropdown */}
            {isUserMenuOpen && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-menu-title">Logged in as:</div>
                  <div className="user-menu-name">{currentUser.name}</div>
                  <div className="user-menu-email">{currentUser.email}</div>
                  <div className="user-menu-role-tag">
                    Role: <strong>{currentUserRole.label}</strong>
                  </div>
                  <div className="user-menu-primary-info">
                    ★ Primary Work Location: <strong>{userPrimaryBranch?.name || 'Not assigned'}</strong>
                  </div>
                </div>

                <div className="user-menu-switch-title">
                  <span>Switch User (Test Roles & Branch Scenarios):</span>
                </div>

                <div className="user-menu-list">
                  {users.map((u) => {
                    const uRole = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.admissions_counselor;
                    const uPrimary = allBranches.find((b) => b.id === u.primaryBranchId);
                    const isSelected = u.id === currentUserId;

                    return (
                      <button
                        key={u.id}
                        className={`user-menu-item ${isSelected ? 'active-user' : ''}`}
                        onClick={() => handleSwitchUser(u)}
                      >
                        <div className="user-menu-item-left">
                          <div
                            className="user-avatar-mini"
                            style={{ backgroundColor: uRole.color }}
                          >
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="user-item-name">
                              {u.name} {isSelected && <span className="current-user-tag">(You)</span>}
                            </div>
                            <div className="user-item-meta">
                              <span className={`user-role-badge-small ${uRole.badgeClass}`}>
                                {uRole.label}
                              </span>
                              <span>• Primary: {uPrimary?.name || 'Branch'}</span>
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check size={16} color="#2563eb" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Teacher / PRV Mobile App Launcher & PWA Download Button */}
          <div className="mobile-app-launcher-btns" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-sm btn-mobile-launch"
              onClick={() => setIsMobileViewMode(true)}
              title="Launch PRV Staff & Teacher Mobile Smartphone App"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', padding: '7px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
            >
              <Smartphone size={15} />
              <span>📱 PRV Mobile App</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPwaModalOpen(true)}
              title="Download PRV Mobile App APK or Install PWA"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 6, cursor: 'pointer' }}
            >
              <Download size={14} />
              <span>Get App</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Navigation Tabs */}
      <nav className="app-nav-tabs">
        <div className="tabs-inner">
          <button
            className={`nav-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            <Users size={16} />
            <span>Admissions & Leads</span>
          </button>

          {/* DEDICATED ACADEMIC STRUCTURE HUB: COURSES, CLASSES & GROUPS */}
          <button
            className={`nav-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            <FolderTree size={16} />
            <span>Courses, Classes & Groups</span>
            <span className="tab-count-pill">{tenantCourses.length} Courses</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'organizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('organizations')}
          >
            <Building2 size={16} />
            <span>Organizations & Campuses</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Shield size={16} />
            <span>User & Role Management</span>
            {!canManageUsers && <span className="tab-lock-pill">Admin Only</span>}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'tenants' ? 'active' : ''}`}
            onClick={() => setActiveTab('tenants')}
          >
            <School size={16} />
            <span>Tenants Directory</span>
          </button>
        </div>
      </nav>

      {/* 4. Active Branch vs Compulsory Default Branch Context Banner */}
      <div className="context-banner">
        <div className="context-banner-info">
          <span>
            📍 <strong>Active Branch:</strong> {activeBranch?.name} ({activeOrg?.name})
          </span>
          <span>•</span>
          <span>
            ★ <strong>Your Compulsory Default Branch:</strong> {userPrimaryBranch?.name || 'Not set'} (Home Physical Location)
          </span>
          {!isCurrentActivePrimary ? (
            <span className="non-primary-alert">
              (Viewing activities of Optional Branch: <strong>{activeBranch?.name}</strong> • Physical presence remains in <strong>{userPrimaryBranch?.name}</strong>)
            </span>
          ) : (
            <span className="primary-status-alert" style={{ color: '#15803d', fontWeight: 600 }}>
              (Default Work Location on CRM open)
            </span>
          )}
        </div>

        {!isCurrentActivePrimary && userPrimaryBranch && (
          <button className="btn-reset-default" onClick={handleResetToPrimaryBranch} title="Return to your physical home branch">
            <Star size={13} fill="#166534" /> Return to Default Branch ({userPrimaryBranch.name})
          </button>
        )}
      </div>

      {/* 5. Main Content Area */}
      <main className="main-content">
        {/* ======================================================== */}
        {/* TAB 1: ADMISSIONS & LEADS (MARKED TO COURSE, CLASS & GROUP) */}
        {/* ======================================================== */}
        {activeTab === 'leads' && (
          <>
            {/* KPI Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-info">
                  <h4>Total Leads</h4>
                  <div className="metric-value">{filteredLeads.length}</div>
                </div>
                <div className="metric-icon-wrap metric-blue">
                  <Users size={22} />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-info">
                  <h4>Courses Available</h4>
                  <div className="metric-value">{tenantCourses.length}</div>
                </div>
                <div className="metric-icon-wrap metric-purple">
                  <Bookmark size={22} />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-info">
                  <h4>Branch Classes</h4>
                  <div className="metric-value">{activeBranchClasses.length}</div>
                </div>
                <div className="metric-icon-wrap metric-amber">
                  <BookOpen size={22} />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-info">
                  <h4>Sections & Groups</h4>
                  <div className="metric-value">{tenantGroups.length}</div>
                </div>
                <div className="metric-icon-wrap metric-emerald">
                  <Layers3 size={22} />
                </div>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="controls-card">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search student, course, group, mandatory address, locality, landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters-group">
                <label style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterByBranch}
                    onChange={(e) => setFilterByBranch(e.target.checked)}
                  />
                  <span>Only {activeBranch?.name}</span>
                </label>

                {/* Filter by Course */}
                <select
                  className="select-filter"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="All Courses">All Courses</option>
                  {tenantCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>

                {/* Filter by Class */}
                <select
                  className="select-filter"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="All Classes">All Classes</option>
                  {tenantClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>

                {/* Filter by Group */}
                <select
                  className="select-filter"
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                >
                  <option value="All Groups">All Groups / Sections</option>
                  {tenantGroups.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {grp.name} ({grp.type})
                    </option>
                  ))}
                </select>

                <select
                  className="select-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_LIST.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                <button className="btn btn-secondary" onClick={() => setIsImportModalOpen(true)} title="Bulk Import Student Leads via CSV">
                  <Upload size={16} /> Import Leads (CSV)
                </button>
                <button className="btn btn-primary" onClick={handleOpenNewLead}>
                  <Plus size={16} /> Add Student Lead
                </button>
              </div>
            </div>

            {/* View Mode Toggle Bar: Leads Directory vs Inbound & Area vs Dropped vs Branch Activities */}
            <div className="leads-view-mode-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  className={`view-mode-tab-btn ${leadsViewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setLeadsViewMode('table')}
                >
                  <Layers size={15} /> Leads Directory ({filteredLeads.length})
                </button>
                <button
                  className={`view-mode-tab-btn ${leadsViewMode === 'inbound' ? 'active' : ''}`}
                  onClick={() => setLeadsViewMode('inbound')}
                >
                  <Upload size={15} /> 📥 Inbound & Area Allocation ({unassignedInboundLeads.length})
                </button>
                <button
                  className={`view-mode-tab-btn ${leadsViewMode === 'dropped' ? 'active' : ''}`}
                  onClick={() => setLeadsViewMode('dropped')}
                >
                  <UserX size={15} /> ❌ Dropped Leads & Reasons ({droppedLeads.length})
                </button>
                <button
                  className={`view-mode-tab-btn ${leadsViewMode === 'activities' ? 'active' : ''}`}
                  onClick={() => setLeadsViewMode('activities')}
                >
                  <Activity size={15} /> Branch Activities ({activeBranchActivities.length})
                </button>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsDropConfigModalOpen(true)}
                  title="Configure Custom Drop Reasons for Tenant"
                >
                  <Settings size={14} /> Drop Reasons Config
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsMobileViewMode(true)}
                  title="Launch PRV Staff & Teacher Mobile Smartphone App"
                >
                  <Smartphone size={14} /> Open PRV Mobile App
                </button>
              </div>
            </div>

            {/* VIEW 1: INBOUND LEADS & AREA-BASED MANUAL ALLOCATION */}
            {leadsViewMode === 'inbound' && (
              <div className="inbound-queue-container" style={{ marginTop: 14 }}>
                <div className="inbound-queue-header" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📥 Inbound Leads & Area-Based Manual Allocation</span>
                        <span className="table-count-badge">{unassignedInboundLeads.length} Unassigned Leads</span>
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                        Leads acquired through Walk-ins, WhatsApp Inquiries, Google Ads, Meta Ads, and Bulk File Uploads.
                        Leads are grouped by Area (<code>locality</code>) and manually assigned to staff/teachers in charge of that area as Sole Owner.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setIsImportModalOpen(true)}>
                        <Upload size={14} /> Bulk Upload Leads File (CSV)
                      </button>
                    </div>
                  </div>

                  {/* Area Filtering Pills */}
                  <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Filter by Lead Area:</span>
                    <button
                      className={`area-filter-chip ${inboundAreaFilter === 'ALL' ? 'active' : ''}`}
                      onClick={() => setInboundAreaFilter('ALL')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        background: inboundAreaFilter === 'ALL' ? '#2563eb' : '#f8fafc',
                        color: inboundAreaFilter === 'ALL' ? '#ffffff' : '#334155',
                      }}
                    >
                      All Areas ({unassignedInboundLeads.length})
                    </button>
                    {inboundDistinctAreas.map((areaName) => {
                      const count = unassignedInboundLeads.filter((l) => (l.locality || '').toLowerCase() === areaName.toLowerCase()).length;
                      const isSel = inboundAreaFilter.toLowerCase() === areaName.toLowerCase();
                      return (
                        <button
                          key={areaName}
                          className={`area-filter-chip ${isSel ? 'active' : ''}`}
                          onClick={() => setInboundAreaFilter(areaName)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 20,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: '1px solid #cbd5e1',
                            cursor: 'pointer',
                            background: isSel ? '#2563eb' : '#f8fafc',
                            color: isSel ? '#ffffff' : '#334155',
                          }}
                        >
                          📍 {areaName} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Bulk Area Assignment Action Bar */}
                  {inboundAreaFilter !== 'ALL' && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ fontSize: '0.825rem', color: '#1e40af' }}>
                        Assign all <strong>{filteredInboundLeads.length} unassigned leads</strong> in <strong>"{inboundAreaFilter}"</strong> to an area coordinator:
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <select
                          id="bulkAreaAssigneeSelect"
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.8rem', minWidth: 200 }}
                          defaultValue=""
                        >
                          <option value="" disabled>-- Select Staff / Teacher --</option>
                          {users
                            .filter((u) => u.role === 'teacher' || u.role === 'prvo' || u.role === 'counselor')
                            .map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.name} ({ROLE_DEFINITIONS[u.role]?.label || u.role})
                              </option>
                            ))}
                        </select>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            const sel = document.getElementById('bulkAreaAssigneeSelect');
                            if (sel && sel.value) {
                              handleBulkAssignByArea(inboundAreaFilter, sel.value);
                            } else {
                              showToast('⚠️ Please select a staff member first.');
                            }
                          }}
                        >
                          Assign All to Staff
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inbound Leads Table */}
                <div className="table-card">
                  <div className="table-wrapper">
                    <table className="crm-table">
                      <thead>
                        <tr>
                          <th>Lead ID & Source</th>
                          <th>Student & Parent</th>
                          <th>Contact Details</th>
                          <th>Area (Locality) & Address</th>
                          <th>Course Inquiry</th>
                          <th>Allocation Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInboundLeads.length === 0 ? (
                          <tr>
                            <td colSpan="6">
                              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                <CheckCircle2 size={32} color="#16a34a" style={{ marginBottom: 8 }} />
                                <p>All inbound leads in this category have been assigned to sole owners!</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredInboundLeads.map((lead) => (
                            <tr key={lead.id}>
                              <td>
                                <strong style={{ color: '#2563eb' }}>{lead.id}</strong>
                                <div>
                                  <span className="source-badge-chip" style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 600 }}>
                                    {lead.source || 'Walk-in'}
                                  </span>
                                </div>
                              </td>

                              <td>
                                <div className="student-name">{lead.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                                  Parent: <strong>{lead.parentName || 'Parent / Guardian'}</strong>
                                </div>
                              </td>

                              <td>
                                <div className="student-contact">📱 {lead.parentPhone || lead.phone}</div>
                                <div className="student-contact">✉️ {lead.email}</div>
                              </td>

                              <td>
                                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                                  📍 Area: <span style={{ color: '#2563eb' }}>{lead.locality || 'General'}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                                  {lead.doorNo ? `Door: ${lead.doorNo}, ` : ''}{lead.address}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                  Campus: {lead.campus || activeBranch?.name}
                                </div>
                              </td>

                              <td>
                                <div className="lead-course-badge" style={{ fontSize: '0.75rem' }}>
                                  🎓 {lead.course || 'General Program'}
                                </div>
                              </td>

                              <td>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <button
                                    className="btn-contact-call btn-icon"
                                    onClick={() => handleOpenCall(lead)}
                                    title="Call Parent"
                                    style={{ color: '#16a34a' }}
                                  >
                                    <Phone size={15} />
                                  </button>
                                  <button
                                    className="btn-contact-wa btn-icon"
                                    onClick={() => handleOpenWhatsApp(lead)}
                                    title="WhatsApp Parent"
                                    style={{ color: '#22c55e' }}
                                  >
                                    <MessageSquare size={15} />
                                  </button>
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleOpenAssignModal(lead)}
                                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                  >
                                    Assign Sole Owner
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: DROPPED LEADS & REASONS BREAKDOWN */}
            {leadsViewMode === 'dropped' && (
              <div className="dropped-leads-container" style={{ marginTop: 14 }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <UserX size={20} color="#dc2626" />
                        <span>Dropped Leads Registry & Drop Reasons Analytics</span>
                        <span className="table-count-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                          {droppedLeads.length} Total Dropped
                        </span>
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                        Leads that did not convert into admissions (fee structure, previous school retention, affordability, etc.).
                        Configured and managed by the Tenant Admin as per organizational requirements.
                      </p>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={() => setIsDropConfigModalOpen(true)}>
                      <Settings size={14} /> + Add / Configure Drop Reasons
                    </button>
                  </div>

                  {/* Drop Reasons Analytics Grid */}
                  <div className="drop-analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginTop: 16 }}>
                    {dropReasons.map((dr) => {
                      const count = dropReasonsStats[dr.name] || 0;
                      const pct = droppedLeads.length > 0 ? ((count / droppedLeads.length) * 100).toFixed(0) : 0;
                      return (
                        <div key={dr.id} className="drop-reason-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                              {dr.category || 'Reason'}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: count > 0 ? '#dc2626' : '#94a3b8' }}>
                              {pct}%
                            </span>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                            {dr.name}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{dr.description}</span>
                            <strong style={{ fontSize: '1.05rem', color: '#dc2626' }}>{count}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dropped Leads Table */}
                <div className="table-card">
                  <div className="table-wrapper">
                    <table className="crm-table">
                      <thead>
                        <tr>
                          <th>Lead ID</th>
                          <th>Student & Parent</th>
                          <th>Contact Details</th>
                          <th>Drop Reason & Remarks</th>
                          <th>Dropped By / Date</th>
                          <th>Re-engagement Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {droppedLeads.length === 0 ? (
                          <tr>
                            <td colSpan="6">
                              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                <CheckCircle size={32} color="#16a34a" style={{ marginBottom: 8 }} />
                                <p>No leads currently marked as dropped.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          droppedLeads.map((lead) => (
                            <tr key={lead.id}>
                              <td>
                                <strong style={{ color: '#64748b' }}>{lead.id}</strong>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{lead.campus}</div>
                              </td>

                              <td>
                                <div className="student-name" style={{ textDecoration: 'line-through', color: '#64748b' }}>
                                  {lead.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  Parent: {lead.parentName || 'Parent / Guardian'}
                                </div>
                              </td>

                              <td>
                                <div className="student-contact">📱 {lead.parentPhone || lead.phone}</div>
                                <div className="student-contact">✉️ {lead.email}</div>
                              </td>

                              <td>
                                <span className="status-badge" style={{ background: '#fee2e2', color: '#991b1b', fontWeight: 700 }}>
                                  ❌ {lead.dropReason || 'Dropped'}
                                </span>
                                {lead.dropRemarks && (
                                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4, fontStyle: 'italic' }}>
                                    "{lead.dropRemarks}"
                                  </div>
                                )}
                              </td>

                              <td>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{lead.droppedBy || lead.assignedTo || 'Counselor'}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{lead.droppedAt || lead.createdAt}</div>
                              </td>

                              <td>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <button
                                    className="btn-icon"
                                    onClick={() => handleOpenCall(lead)}
                                    title="Call Parent for Follow-up / Fee Discount"
                                    style={{ color: '#16a34a' }}
                                  >
                                    <Phone size={15} />
                                  </button>
                                  <button
                                    className="btn-icon"
                                    onClick={() => handleOpenWhatsApp(lead)}
                                    title="WhatsApp Parent with Scholarship Offer"
                                    style={{ color: '#22c55e' }}
                                  >
                                    <MessageSquare size={15} />
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                      setLeads(
                                        leads.map((l) =>
                                          l.id === lead.id
                                            ? { ...l, status: 'Inquiry', dropReason: null, dropRemarks: null }
                                            : l
                                        )
                                      );
                                      showToast(`Lead "${lead.name}" reactivated back to Inquiry pipeline.`);
                                    }}
                                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                                  >
                                    Reactivate
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: BRANCH ACTIVITIES & SUPERVISION VIEW */}
            {leadsViewMode === 'activities' && (
              <div className="table-card branch-activities-card">
                <div className="table-header-bar">
                  <div className="table-title">
                    <Activity size={18} color="#2563eb" />
                    <span>Branch Activities Stream: {activeBranch?.name}</span>
                    <span className="table-count-badge">{activeBranchActivities.length} activities</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Physical Home: <strong>{userPrimaryBranch?.name}</strong>
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsActivityModalOpen(true)}
                    >
                      <Plus size={14} /> Log Branch Activity / Note
                    </button>
                  </div>
                </div>

                <div className="branch-activity-intro">
                  <div className="activity-branch-kpi-banner">
                    <div>
                      <div className="kpi-banner-title">Branch Overview: {activeBranch?.name} ({activeBranch?.code})</div>
                      <div className="kpi-banner-sub">
                        📍 {activeBranch?.address}, {activeBranch?.city} • {activeOrg?.name}
                      </div>
                    </div>
                    <div className="kpi-banner-stats">
                      <div className="kpi-pill">Total Leads: <strong>{filteredLeads.length}</strong></div>
                      <div className="kpi-pill">Active Batches: <strong>{activeBranchClasses.length}</strong></div>
                      <div className="kpi-pill">Recent Logs: <strong>{activeBranchActivities.length}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="activity-timeline-list">
                  {activeBranchActivities.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                      <AlertCircle size={32} color="#cbd5e1" style={{ marginBottom: 8 }} />
                      <p>No recent activity logs recorded for {activeBranch?.name}.</p>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 10 }}
                        onClick={() => setIsActivityModalOpen(true)}
                      >
                        <Plus size={14} /> Log First Activity for this Branch
                      </button>
                    </div>
                  ) : (
                    activeBranchActivities.map((act) => (
                      <div key={act.id} className="activity-timeline-item">
                        <div className="activity-icon-bubble">
                          <CheckCircle2 size={16} color="#2563eb" />
                        </div>
                        <div className="activity-content-box">
                          <div className="activity-top-row">
                            <h4 className="activity-title">{act.title}</h4>
                            <div className="activity-time-chip">
                              <Clock size={12} /> {act.timestamp}
                            </div>
                          </div>
                          <p className="activity-desc">{act.description}</p>
                          <div className="activity-footer-row">
                            <span className="activity-user-tag">Logged by: <strong>{act.user}</strong></span>
                            {act.statusBadge && (
                              <span className={`status-badge status-${act.statusBadge.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                {act.statusBadge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* VIEW 4: LEADS ROSTER TABLE VIEW */}
            {leadsViewMode === 'table' && (
              <div className="table-card">
                <div className="table-header-bar">
                  <div className="table-title">
                    <Layers size={18} />
                    <span>Student Leads Roster</span>
                    <span className="table-count-badge">{filteredLeads.length} leads</span>
                    {isSoleOwnerMode && (
                      <span className="sole-owner-indicator" style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 12, fontSize: '0.725rem', fontWeight: 700 }}>
                        🔒 Sole Ownership: Showing only leads owned by {currentUser.name}
                      </span>
                    )}
                  </div>
                  <div className="address-requirement-indicator" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>
                      <span className="mandatory-dot">•</span> <strong>Street Address: Mandatory (*)</strong> | Area & Landmark: Optional
                    </span>
                    <button
                      className="btn-address-rules-toggle"
                      onClick={() => setIsAddressConfigOpen(!isAddressConfigOpen)}
                      title="View Address & Attendance Mandatory Field Options"
                    >
                      <Settings size={13} /> Attend Options {addressConfig.isAttendAddressMandatory && '• Attend Address Req'}
                    </button>
                  </div>
                </div>

                {/* Inline Address & Attendance Configuration Popover */}
                {isAddressConfigOpen && (
                  <div className="address-options-inline-panel">
                    <div className="address-options-title">
                      <Settings size={15} color="#2563eb" />
                      <strong>Address & Attendance Field Validation Options</strong>
                      <button className="btn-close-mini" onClick={() => setIsAddressConfigOpen(false)}>
                        <X size={14} />
                      </button>
                    </div>
                    <div className="address-options-grid">
                      <label className="address-option-item locked-option">
                        <input type="checkbox" checked={true} disabled={true} />
                        <div>
                          <div className="opt-label-bold">Street Address: Mandatory Required Field (*)</div>
                          <div className="opt-label-desc">Strictly enforced in lead entry and lead import forms.</div>
                        </div>
                      </label>

                      <label className="address-option-item locked-option">
                        <input type="checkbox" checked={false} disabled={true} />
                        <div>
                          <div className="opt-label-bold">Area / Locality & Landmark: Optional</div>
                          <div className="opt-label-desc">Optional secondary fields; not required for saving or import.</div>
                        </div>
                      </label>

                      <label className="address-option-item">
                        <input
                          type="checkbox"
                          checked={addressConfig.isAttendAddressMandatory}
                          onChange={(e) =>
                            setAddressConfig({ ...addressConfig, isAttendAddressMandatory: e.target.checked })
                          }
                        />
                        <div>
                          <div className="opt-label-bold">Mark Attend Address as Mandatory Field</div>
                          <div className="opt-label-desc">When checked, candidate's attend address must be provided in lead entry & import.</div>
                        </div>
                      </label>

                      <label className="address-option-item">
                        <input
                          type="checkbox"
                          checked={addressConfig.isAttendStatusMandatory}
                          onChange={(e) =>
                            setAddressConfig({ ...addressConfig, isAttendStatusMandatory: e.target.checked })
                          }
                        />
                        <div>
                          <div className="opt-label-bold">Mark Attend Status as Mandatory Field</div>
                          <div className="opt-label-desc">When checked, candidate attendance confirmation is mandatory.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="table-wrapper">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Lead ID</th>
                        <th>Student & Parent Contact</th>
                        <th>Sole Owner</th>
                        {/* ACADEMIC ALLOCATION: COURSE, CLASS & SECTION / GROUP */}
                        <th style={{ minWidth: 200 }}>
                          Program & Group Allocation
                          <span className="address-header-subtitle">
                            Course → Class / Batch → Section / Group
                          </span>
                        </th>
                        {/* MANDATORY ADDRESS DETAILS */}
                        <th className="address-col-header">
                          Address & Attendance Details
                          <span className="address-header-subtitle">
                            Mandatory Address* • Area (Opt) • Landmark (Opt) • Attend Address
                          </span>
                        </th>
                        <th>Status</th>
                        <th>Direct Contact & Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan="7">
                            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                              <AlertCircle size={36} color="#cbd5e1" style={{ marginBottom: 10 }} />
                              <p>No student leads found matching current branch or filters.</p>
                              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setIsImportModalOpen(true)}
                                >
                                  <Upload size={14} /> Import Leads via CSV
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={handleOpenNewLead}
                                >
                                  <Plus size={14} /> Add First Lead to {activeBranch?.name}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const matchedCourse = tenantCourses.find((c) => c.id === lead.courseId);
                          const matchedClass = tenantClasses.find((c) => c.id === lead.classId);
                          const matchedGroup = tenantGroups.find((g) => g.id === lead.groupId);

                          return (
                            <tr key={lead.id}>
                              <td>
                                <strong style={{ color: '#2563eb' }}>{lead.id}</strong>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                  {lead.campus || activeBranch?.name}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2 }}>
                                  Source: {lead.source || 'Walk-in'}
                                </div>
                              </td>

                              <td>
                                <div className="student-name">{lead.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: 2 }}>
                                  Parent: <strong>{lead.parentName || 'Parent / Guardian'}</strong>
                                </div>
                                <div className="student-contact" style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                                  <span>📱 {lead.parentPhone || lead.phone}</span>
                                </div>
                                <div className="student-contact">{lead.email}</div>
                              </td>

                              <td>
                                <div className="owner-pill-sole" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '3px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#1e40af' }}>
                                  <Shield size={12} color="#2563eb" />
                                  <span>{lead.ownerName || lead.assignedTo || 'Unassigned'}</span>
                                </div>
                              </td>

                              {/* Academic Program, Class & Section / Group Allocation */}
                              <td>
                                <div className="academic-allocation-box">
                                  <div className="lead-course-badge" title="Course / Program">
                                    🎓 {matchedCourse ? matchedCourse.name : lead.course}
                                  </div>
                                  <div className="lead-class-pill" title="Class / Batch">
                                    📚 {matchedClass ? matchedClass.name : lead.className || 'Class'}
                                  </div>
                                  {matchedGroup ? (
                                    <div className="lead-group-pill" title={`Type: ${matchedGroup.type}`}>
                                      👥 {matchedGroup.name}
                                      <span className="group-type-tag">{matchedGroup.type}</span>
                                    </div>
                                  ) : (
                                    <div className="lead-group-pill" style={{ opacity: 0.7 }}>
                                      👥 {lead.groupName || 'General Group'}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Address Details Column with Mandatory Street Address, Optional Area/Landmark, and Attend Address */}
                              <td className="address-cell">
                                <div className="address-main">
                                  <MapPin size={13} color="#dc2626" style={{ flexShrink: 0 }} />
                                  <span className="address-text-bold">
                                    {lead.address || <em style={{ color: '#ef4444' }}>Address Missing</em>}
                                  </span>
                                  <span className="mandatory-star" title="Mandatory Address Field">*</span>
                                </div>

                                <div className="address-sub-details">
                                  {lead.locality && (
                                    <span className="chip-locality" title="Locality / Area (Optional)">
                                      Area: {lead.locality}
                                    </span>
                                  )}
                                  {lead.landmark && (
                                    <span className="chip-landmark" title="Landmark (Optional)">
                                      📍 Landmark: {lead.landmark}
                                    </span>
                                  )}
                                  {lead.doorNo && (
                                    <span className="chip-door" title="Door / Flat No (Optional)">
                                      Door: {lead.doorNo}
                                    </span>
                                  )}
                                </div>

                                {/* Attend Address & Attend Status */}
                                <div className="address-attend-box">
                                  {lead.attendAddress ? (
                                    <div className="chip-attend-address" title="Attended / Verification Address">
                                      🏢 Attend: {lead.attendAddress}
                                    </div>
                                  ) : addressConfig.isAttendAddressMandatory ? (
                                    <div className="chip-attend-missing">⚠️ Attend Address Missing</div>
                                  ) : null}

                                  {lead.attendStatus && (
                                    <span className={`attend-status-pill status-${lead.attendStatus.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                      ✓ Attend: {lead.attendStatus}
                                    </span>
                                  )}
                                </div>

                                {(lead.city || lead.state || lead.pincode) && (
                                  <div className="tag-city">
                                    {[lead.city, lead.state, lead.pincode].filter(Boolean).join(', ')}
                                  </div>
                                )}
                              </td>

                            <td>
                              <span className={`status-badge status-${lead.status?.toLowerCase()}`}>
                                <span className="status-dot"></span>
                                {lead.status}
                              </span>
                              {lead.dropReason && (
                                <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 600, marginTop: 4 }}>
                                  Drop: {lead.dropReason}
                                </div>
                              )}
                            </td>

                            <td>
                              {/* Direct Phone / Contact Actions */}
                              <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                                <button
                                  className="btn-icon"
                                  title="Call Parent directly"
                                  onClick={() => handleOpenCall(lead)}
                                  style={{ color: '#16a34a' }}
                                >
                                  <Phone size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Send SMS to Parent"
                                  onClick={() => handleOpenSMS(lead)}
                                  style={{ color: '#2563eb' }}
                                >
                                  <MessageCircle size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Open WhatsApp chat with Parent"
                                  onClick={() => handleOpenWhatsApp(lead)}
                                  style={{ color: '#22c55e' }}
                                >
                                  <MessageSquare size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Mark Lead as Dropped / Lost (With Reason)"
                                  onClick={() => handleOpenDropModal(lead)}
                                  style={{ color: '#dc2626' }}
                                >
                                  <UserX size={15} />
                                </button>
                              </div>

                              {/* Record Actions */}
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  className="btn-icon"
                                  title="View Full Profile, Allocation & Timeline"
                                  onClick={() => {
                                    setActiveLead(lead);
                                    setIsDetailOpen(true);
                                  }}
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Edit Lead"
                                  onClick={() => handleOpenEditLead(lead)}
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Copy Full Address"
                                  onClick={() => handleCopyAddress(lead)}
                                >
                                  <Copy size={14} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Delete Lead"
                                  onClick={() => handleDeleteLead(lead.id, lead.name)}
                                  style={{ color: '#ef4444' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ACADEMIC HUB (COURSES, CLASSES, SECTIONS & GROUPS) */}
        {/* ======================================================== */}
        {activeTab === 'academic' && (
          <div>
            <div className="academic-hub-header">
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  Academic Structure & Customization ({activeTenant.name})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
                  Customize the courses, classes, sections, and groups for this tenant. Leads can be assigned to any combination.
                </p>
              </div>

              <div className="academic-header-actions">
                {academicSubTab === 'courses' && (
                  <button className="btn btn-primary" onClick={handleOpenAddCourse}>
                    <Plus size={16} /> Add New Course
                  </button>
                )}
                {academicSubTab === 'classes' && (
                  <button className="btn btn-primary" onClick={handleOpenCreateClass}>
                    <Plus size={16} /> Add Class / Batch
                  </button>
                )}
                {academicSubTab === 'groups' && (
                  <button className="btn btn-primary" onClick={handleOpenAddGroup}>
                    <Plus size={16} /> Add Section / Group
                  </button>
                )}
              </div>
            </div>

            {/* Academic Sub-Tab Navigation */}
            <div className="academic-subtabs">
              <button
                className={`academic-subtab-btn ${academicSubTab === 'courses' ? 'active-subtab' : ''}`}
                onClick={() => setAcademicSubTab('courses')}
              >
                <Bookmark size={15} />
                <span>Courses & Programs ({tenantCourses.length})</span>
              </button>

              <button
                className={`academic-subtab-btn ${academicSubTab === 'classes' ? 'active-subtab' : ''}`}
                onClick={() => setAcademicSubTab('classes')}
              >
                <BookOpen size={15} />
                <span>Classes & Batches ({tenantClasses.length})</span>
              </button>

              <button
                className={`academic-subtab-btn ${academicSubTab === 'groups' ? 'active-subtab' : ''}`}
                onClick={() => setAcademicSubTab('groups')}
              >
                <Layers3 size={15} />
                <span>Sections & Groups ({tenantGroups.length})</span>
              </button>
            </div>

            {/* SUB-VIEW 1: COURSES & PROGRAMS */}
            {academicSubTab === 'courses' && (
              <div className="academic-content-card">
                <div className="academic-grid">
                  {tenantCourses.map((crs) => {
                    const linkedClasses = tenantClasses.filter((c) => c.courseId === crs.id);
                    const linkedGroups = tenantGroups.filter((g) => g.courseId === crs.id);

                    return (
                      <div key={crs.id} className="academic-item-card">
                        <div className="item-card-top">
                          <div>
                            <span className="code-pill-blue">{crs.code}</span>
                            <span className="badge-degree-level">{crs.degreeLevel}</span>
                            <h3 className="item-title">{crs.name}</h3>
                            <div className="item-sub">{crs.department} • {crs.duration}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon" onClick={() => handleOpenEditCourse(crs)} title="Edit Course">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon" onClick={() => handleDeleteCourse(crs.id, crs.name)} title="Delete Course" style={{ color: '#ef4444' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {crs.description && (
                          <p className="item-desc">{crs.description}</p>
                        )}

                        <div className="item-stats-bar">
                          <span>Classes: <strong>{linkedClasses.length}</strong></span>
                          <span>Sections / Groups: <strong>{linkedGroups.length}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: CLASSES & BATCHES */}
            {academicSubTab === 'classes' && (
              <div className="academic-content-card">
                <div className="academic-grid">
                  {tenantClasses.map((cls) => {
                    const parentCourse = tenantCourses.find((c) => c.id === cls.courseId);
                    const branchObj = allBranches.find((b) => b.id === cls.branchId);
                    const linkedGroups = tenantGroups.filter((g) => g.classId === cls.id);

                    return (
                      <div key={cls.id} className="academic-item-card">
                        <div className="item-card-top">
                          <div>
                            <span className="code-pill-blue">{cls.code}</span>
                            {parentCourse && (
                              <span className="badge-parent-link">
                                🎓 {parentCourse.code}
                              </span>
                            )}
                            <h3 className="item-title">{cls.name}</h3>
                            <div className="item-sub">
                              {branchObj ? branchObj.name : 'All Campuses'} • AY {cls.academicYear}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon" onClick={() => handleOpenEditClass(cls)} title="Edit Class">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon" onClick={() => handleDeleteClass(cls.id, cls.name)} title="Delete Class" style={{ color: '#ef4444' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="class-capacity-section" style={{ margin: '10px 0' }}>
                          <div className="capacity-labels">
                            <span>Capacity: <strong>{cls.capacity} seats</strong></span>
                            <span>Enrolled: <strong>{cls.enrolledCount || 0}</strong></span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${Math.min(100, ((cls.enrolledCount || 0) / cls.capacity) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        {cls.classTeacher && (
                          <div className="item-teacher-line">
                            Mentor: <strong>{cls.classTeacher}</strong>
                          </div>
                        )}

                        <div className="linked-groups-preview">
                          <span className="linked-title">Sections / Groups ({linkedGroups.length}):</span>
                          <div className="linked-tags-wrap">
                            {linkedGroups.map((g) => (
                              <span key={g.id} className="tag-group-mini">
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: SECTIONS & GROUPS */}
            {academicSubTab === 'groups' && (
              <div className="academic-content-card">
                <div className="academic-grid">
                  {tenantGroups.map((grp) => {
                    const parentClass = tenantClasses.find((c) => c.id === grp.classId);
                    const parentCourse = tenantCourses.find((c) => c.id === grp.courseId);

                    return (
                      <div key={grp.id} className="academic-item-card">
                        <div className="item-card-top">
                          <div>
                            <span className="code-pill-blue">{grp.code}</span>
                            <span className="badge-group-type">{grp.type}</span>
                            <h3 className="item-title">{grp.name}</h3>
                            <div className="item-sub">
                              {parentClass ? `Class: ${parentClass.name}` : ''}
                              {parentCourse ? ` (${parentCourse.code})` : ''}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon" onClick={() => handleOpenEditGroup(grp)} title="Edit Group">
                              <Edit2 size={14} />
                            </button>
                            <button className="btn-icon" onClick={() => handleDeleteGroup(grp.id, grp.name)} title="Delete Group" style={{ color: '#ef4444' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="group-detail-meta">
                          {grp.room && (
                            <div>📍 Room / Hall: <strong>{grp.room}</strong></div>
                          )}
                          {grp.faculty && (
                            <div>👨‍🏫 Instructor: <strong>{grp.faculty}</strong></div>
                          )}
                          <div>👥 Target Capacity: <strong>{grp.capacity} students</strong></div>
                        </div>

                        {grp.notes && (
                          <p className="item-desc" style={{ marginTop: 8 }}>{grp.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ORGANIZATIONS & CAMPUSES */}
        {/* ======================================================== */}
        {activeTab === 'organizations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Organizations & Campuses ({activeTenant.name})
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Manage multi-campus structures. Each organization has a designated default branch.
                </p>
              </div>

              {canManageUsers && (
                <button className="btn btn-primary" onClick={() => setIsOrgModalOpen(true)}>
                  <Plus size={16} /> Add New Organization
                </button>
              )}
            </div>

            <div className="orgs-list">
              {organizations.map((org) => (
                <div key={org.id} className="org-card">
                  <div className="org-card-header">
                    <div>
                      <span className="org-code-pill">{org.code}</span>
                      <h3 className="org-title">{org.name}</h3>
                      <div className="org-type">{org.type}</div>
                    </div>

                    {canManageUsers && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedOrgForBranch(org);
                          setBranchForm({
                            name: '',
                            code: '',
                            city: 'Bangalore',
                            address: '',
                            isDefault: false,
                          });
                          setIsBranchModalOpen(true);
                        }}
                      >
                        <Plus size={14} /> Add Branch
                      </button>
                    )}
                  </div>

                  <div className="branches-grid">
                    {org.branches.map((b) => {
                      const isDefault = b.id === org.defaultBranchId;
                      const isActive = b.id === activeBranchId;
                      const isPrimary = b.id === currentUser?.primaryBranchId;

                      return (
                        <div
                          key={b.id}
                          className={`branch-item-card ${isActive ? 'active-branch-card' : ''}`}
                        >
                          <div className="branch-card-top">
                            <h4 className="branch-card-name">
                              {b.name}
                              {isDefault && (
                                <span className="default-star-badge" title="Organization Default Branch">
                                  ★ Default
                                </span>
                              )}
                              {isPrimary && (
                                <span className="primary-star-badge" title="Your Primary Work Branch">
                                  ★ Your Primary
                                </span>
                              )}
                            </h4>
                            <span className="branch-code-badge">{b.code}</span>
                          </div>

                          <div className="branch-card-city">
                            <MapPin size={13} color="#64748b" />
                            <span>{b.city}</span>
                          </div>

                          <div className="branch-card-address">{b.address}</div>

                          <div className="branch-card-footer">
                            {isActive ? (
                              <span className="badge-currently-active">✓ Currently Active</span>
                            ) : (
                              <button
                                className="btn-switch-branch"
                                onClick={() => handleSelectBranch(b.id)}
                              >
                                Switch to this Branch
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: USER & ROLE MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div>
            {!canManageUsers ? (
              <div className="access-denied-card">
                <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: 16 }} />
                <h3>Restricted Access: Tenant Admin or Super Admin Only</h3>
                <p>
                  You are currently logged in as <strong>{currentUser.name}</strong> ({currentUserRole.label}).
                  Only users with <strong>Super Admin</strong> or <strong>Tenant Admin</strong> roles have permission to manage users, passwords, and role assignments.
                </p>
                <div style={{ marginTop: 20 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const adminUser = users.find((u) => u.role === 'tenant_admin' || u.role === 'super_admin');
                      if (adminUser) handleSwitchUser(adminUser);
                    }}
                  >
                    Switch to Tenant Admin (Priya Patel)
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      User & Role Management ({activeTenant.name})
                    </h2>
                    <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                      Add users, assign roles, create & change passwords, assign multi-branch permissions, and designate the Primary Branch.
                    </p>
                  </div>

                  <button className="btn btn-primary" onClick={handleOpenAddUser}>
                    <UserPlus size={16} /> Add New User
                  </button>
                </div>

                <div className="controls-card" style={{ marginBottom: 20 }}>
                  <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search users by name, email, phone..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="filters-group">
                    <select
                      className="select-filter"
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                    >
                      <option value="ALL">All Roles</option>
                      {Object.keys(ROLE_DEFINITIONS).map((k) => (
                        <option key={k} value={k}>
                          {ROLE_DEFINITIONS[k].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="table-card">
                  <div className="table-header-bar">
                    <div className="table-title">
                      <Shield size={18} />
                      <span>Tenant Users Roster</span>
                      <span className="table-count-badge">{filteredUsers.length} users</span>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="crm-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Branch Access & Compulsory Default Branch</th>
                          <th>Assigned Groups (Single / Multiple)</th>
                          <th>Status</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => {
                          const rDef = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.admissions_counselor;
                          const primaryBranchObj = allBranches.find((b) => b.id === u.primaryBranchId);

                          return (
                            <tr key={u.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div
                                    className="user-avatar-mini"
                                    style={{ backgroundColor: rDef.color }}
                                  >
                                    {u.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .slice(0, 2)}
                                  </div>
                                  <div>
                                    <div className="student-name">
                                      {u.name}
                                      {u.id === currentUserId && (
                                        <span className="current-user-tag" style={{ marginLeft: 6 }}>
                                          (Active Session)
                                        </span>
                                      )}
                                    </div>
                                    <div className="student-contact">{u.email}</div>
                                    <div className="student-contact">{u.phone}</div>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <span className={`user-role-chip ${rDef.badgeClass}`}>
                                  {rDef.label}
                                </span>
                                <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: 4 }}>
                                  {rDef.description}
                                </div>
                              </td>

                              <td>
                                <div className="user-primary-branch-box">
                                  <span className="primary-label">★ Compulsory Default Branch:</span>
                                  <strong>{primaryBranchObj ? primaryBranchObj.name : <span style={{ color: '#ef4444' }}>Not Designated</span>}</strong>
                                  <span className="presence-tag" title="Compulsory default branch where physical presence is based">Physical Presence</span>
                                </div>

                                <div className="assigned-branches-tags">
                                  <span className="assigned-label">Optional Supervised Branches:</span>
                                  {u.role === 'super_admin' ? (
                                    <span className="tag-all-branches">All System Branches (Super Admin)</span>
                                  ) : (
                                    (() => {
                                      const optionalBranches = (u.assignedBranchIds || []).filter((bId) => bId !== u.primaryBranchId);
                                      if (optionalBranches.length === 0) {
                                        return <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>None (Default Branch Only)</span>;
                                      }
                                      return optionalBranches.map((bId) => {
                                        const bObj = allBranches.find((b) => b.id === bId);
                                        return (
                                          <span
                                            key={bId}
                                            className="branch-pill-tag optional-pill"
                                            title="Optional Supervised Branch (Activities Monitored)"
                                          >
                                            🏢 {bObj ? bObj.name : bId}
                                          </span>
                                        );
                                      });
                                    })()
                                  )}
                                </div>
                              </td>

                              <td>
                                <div className="user-groups-container">
                                  {u.role === 'super_admin' ? (
                                    <span className="tag-all-branches">All Tenant Groups (Super Admin)</span>
                                  ) : (u.assignedGroupIds && u.assignedGroupIds.length > 0) ? (
                                    <div className="groups-badge-list">
                                      <div className="group-count-tag">
                                        {u.assignedGroupIds.length === 1 ? '1 Single Group' : `${u.assignedGroupIds.length} Groups Assigned`}:
                                      </div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                        {u.assignedGroupIds.map((gId) => {
                                          const grp = tenantGroups.find((g) => g.id === gId);
                                          return (
                                            <span
                                              key={gId}
                                              className="group-pill-badge"
                                              title={`Type: ${grp?.type || 'General'} | Code: ${grp?.code || gId}`}
                                            >
                                              👥 {grp ? grp.name : gId}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                      No groups assigned
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td>
                                <span className="status-badge status-enrolled">
                                  <span className="status-dot"></span>
                                  {u.status || 'Active'}
                                </span>
                              </td>

                              <td>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                  {u.lastLogin || 'Never'}
                                </div>
                              </td>

                              <td>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button
                                    className="btn-icon"
                                    title="Edit User & Branch Roles"
                                    onClick={() => handleOpenEditUser(u)}
                                  >
                                    <Edit2 size={15} />
                                  </button>
                                  <button
                                    className="btn-icon"
                                    title="Change / Reset Password"
                                    onClick={() => handleOpenPasswordModal(u)}
                                  >
                                    <Key size={15} color="#2563eb" />
                                  </button>
                                  <button
                                    className="btn-icon"
                                    title="Delete User"
                                    onClick={() => handleDeleteUser(u)}
                                    style={{ color: '#ef4444' }}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: TENANTS DIRECTORY */}
        {/* ======================================================== */}
        {activeTab === 'tenants' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Multi-Tenant Directory
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Each tenant has its own isolated courses, classes, groups, users, and leads.
                </p>
              </div>

              {canManageTenants && (
                <button className="btn btn-primary" onClick={handleOpenAddTenant}>
                  <Plus size={16} /> Add New Tenant (Auto-ID)
                </button>
              )}
            </div>

            <div className="tenants-grid">
              {tenants.map((t) => {
                const isCurrent = t.id === activeTenantId;
                const tenantUsers = users.filter((u) => u.tenantId === t.id);
                const tCourses = courses.filter((c) => c.tenantId === t.id);
                const tClasses = classes.filter((c) => c.tenantId === t.id);

                return (
                  <div key={t.id} className={`tenant-card ${isCurrent ? 'current-tenant-card' : ''}`}>
                    <div className="tenant-card-top">
                      <div>
                        <span className="tenant-id-badge">
                          Tenant ID: <strong>{t.id}</strong> (Auto-Generated)
                        </span>
                        <h3 className="tenant-card-name">{t.name}</h3>
                        <div className="tenant-domain">{t.domain}</div>
                      </div>
                      {isCurrent && (
                        <span className="badge-currently-active">Active Session</span>
                      )}
                    </div>

                    <div className="tenant-card-details">
                      <div>Plan: <strong>{t.tier}</strong></div>
                      <div>Custom Courses: <strong>{tCourses.length}</strong></div>
                      <div>Custom Classes: <strong>{tClasses.length}</strong></div>
                      <div>Registered Users: <strong>{tenantUsers.length}</strong></div>
                      <div>Created: {t.createdAt}</div>
                    </div>

                    <div className="tenant-card-actions">
                      {!isCurrent ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setActiveTenantId(t.id);
                            showToast(`Switched active tenant to ${t.name}`);
                          }}
                        >
                          Switch to this Tenant
                        </button>
                      ) : (
                        <button className="btn btn-secondary btn-sm" disabled>
                          Currently In This Tenant
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      </>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT LEAD (COURSE, CLASS & GROUP ALLOCATION + MANDATORY ADDRESS + 5-FACTOR DUPLICATE CHECK) */}
      {/* ======================================================== */}
      {isLeadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <Users size={18} color="#2563eb" />
                <span>{isEditingLead ? 'Edit Student Lead' : 'Add New Student Lead'}</span>
              </div>
              <button className="btn-close" onClick={() => setIsLeadModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="modal-body">
              {/* LIVE MULTI-FACTOR DUPLICATE WARNING BANNER */}
              {duplicateAlert && duplicateAlert.isDuplicate && (
                <div className="duplicate-alert-banner" style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontWeight: 700, fontSize: '0.95rem' }}>
                    <AlertTriangle size={18} />
                    <span>DUPLICATE LEAD DETECTED — SINGLE OWNERSHIP RULE ENFORCED</span>
                  </div>
                  <p style={{ margin: '6px 0 10px', fontSize: '0.825rem', color: '#991b1b' }}>
                    A student lead with matching credentials already exists in the institution database.
                    Under CampusConnect single ownership rules, <strong>for every lead there will be only ONE owner</strong>.
                  </p>
                  <div style={{ background: '#ffffff', borderRadius: 6, padding: '10px 12px', border: '1px solid #fecaca', fontSize: '0.8rem' }}>
                    <div>Existing Lead: <strong>{duplicateAlert.existingLead?.name}</strong> (ID: <code>{duplicateAlert.existingLead?.id}</code>)</div>
                    <div style={{ marginTop: 4 }}>
                      Current Sole Owner: <strong style={{ color: '#2563eb' }}>{duplicateAlert.ownerName}</strong> ({duplicateAlert.campus || 'Assigned Branch'})
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Matched Fields:</span>
                      {duplicateAlert.matchedReasons?.map((r, idx) => (
                        <span key={idx} className="matched-field-chip" style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDuplicateAlert(null)}>
                      Dismiss Alert
                    </button>
                  </div>
                </div>
              )}

              {/* Basic Student Information */}
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Student Full Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${leadFormErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Rahul Sharma"
                    value={leadForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = { ...leadForm, name: val };
                      setLeadForm(next);
                      const dup = checkDuplicateLead(next, leads, isEditingLead ? activeLead?.id : null);
                      if (dup.isDuplicate) setDuplicateAlert(dup);
                      else if (duplicateAlert) setDuplicateAlert(null);
                    }}
                  />
                  {leadFormErrors.name && (
                    <span className="error-text">{leadFormErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="req-star">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input ${leadFormErrors.email ? 'input-error' : ''}`}
                    placeholder="student@example.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  />
                  {leadFormErrors.email && (
                    <span className="error-text">{leadFormErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Student Mobile Number
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={leadForm.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = { ...leadForm, phone: val };
                      setLeadForm(next);
                      const dup = checkDuplicateLead(next, leads, isEditingLead ? activeLead?.id : null);
                      if (dup.isDuplicate) setDuplicateAlert(dup);
                      else if (duplicateAlert) setDuplicateAlert(null);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pipeline Status</label>
                  <select
                    className="form-select"
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                  >
                    {STATUS_LIST.filter((s) => s !== 'All Statuses').map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Parent & Acquisition Details */}
              <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>👨‍👩‍👦 Parent Contact & Acquisition Source</span>
                  <span className="optional-badge" style={{ fontSize: '0.7rem' }}>Enables Direct Phone, SMS & WhatsApp Outreach</span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Parent / Guardian Name <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${leadFormErrors.parentName ? 'input-error' : ''}`}
                      placeholder="e.g. Ramesh Sharma"
                      value={leadForm.parentName}
                      onChange={(e) => {
                        const val = e.target.value;
                        const next = { ...leadForm, parentName: val };
                        setLeadForm(next);
                        const dup = checkDuplicateLead(next, leads, isEditingLead ? activeLead?.id : null);
                        if (dup.isDuplicate) setDuplicateAlert(dup);
                        else if (duplicateAlert) setDuplicateAlert(null);
                      }}
                    />
                    {leadFormErrors.parentName && (
                      <span className="error-text">{leadFormErrors.parentName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Parent Mobile Number <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${leadFormErrors.parentPhone ? 'input-error' : ''}`}
                      placeholder="+91 98765 11111"
                      value={leadForm.parentPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        const next = { ...leadForm, parentPhone: val };
                        setLeadForm(next);
                        const dup = checkDuplicateLead(next, leads, isEditingLead ? activeLead?.id : null);
                        if (dup.isDuplicate) setDuplicateAlert(dup);
                        else if (duplicateAlert) setDuplicateAlert(null);
                      }}
                    />
                    {leadFormErrors.parentPhone && (
                      <span className="error-text">{leadFormErrors.parentPhone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Acquisition Source</label>
                    <select
                      className="form-select"
                      value={leadForm.source}
                      onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    >
                      {LEAD_SOURCES.map((src) => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* DEDICATED ACADEMIC ALLOCATION: COURSE, CLASS & GROUP */}
              <div className="academic-form-box" style={{ marginTop: 14 }}>
                <div className="academic-form-box-header">
                  <FolderTree size={16} color="#2563eb" />
                  <div>
                    <h4 className="academic-box-title">
                      Academic Program, Class & Section Allocation
                    </h4>
                    <p className="academic-box-desc">
                      Assign this student to the tenant's customized Course, Class/Batch, and Section or Group.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  {/* 1. Course Selection */}
                  <div className="form-group">
                    <label className="form-label">
                      Course / Program <span className="req-star">*</span>
                    </label>
                    <select
                      className={`form-select ${leadFormErrors.courseId ? 'input-error' : ''}`}
                      value={leadForm.courseId}
                      onChange={(e) => handleLeadCourseChange(e.target.value)}
                    >
                      <option value="">-- Select Course --</option>
                      {tenantCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                    {leadFormErrors.courseId && (
                      <span className="error-text">{leadFormErrors.courseId}</span>
                    )}
                  </div>

                  {/* 2. Class / Batch Selection */}
                  <div className="form-group">
                    <label className="form-label">
                      Class / Batch
                    </label>
                    <select
                      className="form-select"
                      value={leadForm.classId}
                      onChange={(e) => handleLeadClassChange(e.target.value)}
                    >
                      <option value="">-- Select Class / Batch --</option>
                      {leadFormAvailableClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Section / Group Selection */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">
                        Section / Group / Lab Batch
                      </label>
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={() => {
                          setIsGroupModalOpen(true);
                          setIsLeadModalOpen(false);
                        }}
                      >
                        + Create New Group
                      </button>
                    </div>

                    <select
                      className="form-select"
                      value={leadForm.groupId}
                      onChange={(e) => setLeadForm({ ...leadForm, groupId: e.target.value })}
                    >
                      <option value="">-- Select Section or Group --</option>
                      {leadFormAvailableGroups.map((grp) => (
                        <option key={grp.id} value={grp.id}>
                          {grp.name} [{grp.type}] {grp.room ? `• ${grp.room}` : ''}
                        </option>
                      ))}
                    </select>
                    <span className="input-hint">
                      Enables tracking student allocation to specific shifts, batches, or specialized lab groups.
                    </span>
                  </div>
                </div>
              </div>

              {/* DEDICATED MANDATORY ADDRESS & ATTENDANCE SECTION */}
              <div className="address-form-box">
                <div className="address-section-header">
                  <MapPin size={16} color="#dc2626" />
                  <div>
                    <h4 className="address-section-title">
                      Student Residential & Attendance Address
                      <span className="address-mandatory-tag">Street Address is Mandatory *</span>
                    </h4>
                    <p className="address-section-desc">
                      Street address is strictly mandatory (*). Locality/Area, Landmark, and Door No are optional.
                    </p>
                  </div>
                </div>

                {/* Policy Configuration Options directly inside the Lead Entry Form */}
                <div className="address-options-inline-panel">
                  <div className="options-panel-title">
                    <Sliders size={13} />
                    <span>Attendance & Verification Policy Rules:</span>
                  </div>
                  <div className="options-checkboxes-row">
                    <label className="checkbox-setting-label">
                      <input
                        type="checkbox"
                        checked={addressConfig.isAttendAddressMandatory}
                        onChange={(e) =>
                          setAddressConfig({ ...addressConfig, isAttendAddressMandatory: e.target.checked })
                        }
                      />
                      <span>Mark <strong>Attend Address</strong> as a Mandatory Field</span>
                    </label>

                    <label className="checkbox-setting-label">
                      <input
                        type="checkbox"
                        checked={addressConfig.isAttendStatusMandatory}
                        onChange={(e) =>
                          setAddressConfig({ ...addressConfig, isAttendStatusMandatory: e.target.checked })
                        }
                      />
                      <span>Mark <strong>Attend Status</strong> as a Mandatory Field</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label address-mandatory-label">
                    <span>Street / House Address</span>
                    <span className="req-pill-bold">Mandatory Required Field *</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input mandatory-address-input ${leadFormErrors.address ? 'input-error' : ''}`}
                    placeholder="Enter street name, road, building / house address (e.g. 14/B, 3rd Main Road, Indiranagar)"
                    value={leadForm.address}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = { ...leadForm, address: val };
                      setLeadForm(next);
                      const dup = checkDuplicateLead(next, leads, isEditingLead ? activeLead?.id : null);
                      if (dup.isDuplicate) setDuplicateAlert(dup);
                      else if (duplicateAlert) setDuplicateAlert(null);
                    }}
                  />
                  {leadFormErrors.address ? (
                    <span className="error-text" style={{ fontWeight: 600 }}>
                      ⚠️ {leadFormErrors.address}
                    </span>
                  ) : (
                    <span className="input-hint">
                      * This address field is mandatory for admission documentation and student verification.
                    </span>
                  )}
                </div>

                <div className="form-grid" style={{ marginTop: 10 }}>
                  <div className="form-group">
                    <label className="form-label">
                      Locality / Area <span className="optional-badge">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Indiranagar Stage 2 / Koramangala"
                      value={leadForm.locality}
                      onChange={(e) => setLeadForm({ ...leadForm, locality: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Landmark <span className="optional-badge">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Near Metro Station / Opp. Forum Mall"
                      value={leadForm.landmark}
                      onChange={(e) => setLeadForm({ ...leadForm, landmark: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Door / Flat No <span className="optional-badge">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Flat 302, Sai Residency"
                      value={leadForm.doorNo}
                      onChange={(e) => {
                        const val = e.target.value;
                        const next = { ...leadForm, doorNo: val };
                        setLeadForm(next);
                        const dup = checkDuplicateLead(next, leads, isEditingLead ? activeLead?.id : null);
                        if (dup.isDuplicate) setDuplicateAlert(dup);
                        else if (duplicateAlert) setDuplicateAlert(null);
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={leadForm.city}
                      onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={leadForm.state}
                      onChange={(e) => setLeadForm({ ...leadForm, state: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 560034"
                      value={leadForm.pincode}
                      onChange={(e) => setLeadForm({ ...leadForm, pincode: e.target.value })}
                    />
                  </div>
                </div>

                {/* Attend Address & Attend Status Entry Fields */}
                <div className="attend-fields-box" style={{ marginTop: 14, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🏢 Attendance & Verification Details</span>
                      {addressConfig.isAttendAddressMandatory && (
                        <span className="req-pill-bold">Attend Address Mandatory *</span>
                      )}
                      {addressConfig.isAttendStatusMandatory && (
                        <span className="req-pill-bold">Attend Status Mandatory *</span>
                      )}
                    </div>
                    {leadForm.address && (
                      <button
                        type="button"
                        className="btn-link-action"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setLeadForm({ ...leadForm, attendAddress: leadForm.address })}
                      >
                        📋 Copy Street Address to Attend Address
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Attend Address (Verification / Campus Location)
                        {addressConfig.isAttendAddressMandatory ? (
                          <span className="req-star"> *</span>
                        ) : (
                          <span className="optional-badge"> (Optional)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        className={`form-input ${leadFormErrors.attendAddress ? 'input-error' : ''}`}
                        placeholder={`e.g. ${activeBranch?.name || 'Main Campus'} - Admissions Desk or Room 101`}
                        value={leadForm.attendAddress}
                        onChange={(e) => setLeadForm({ ...leadForm, attendAddress: e.target.value })}
                      />
                      {leadFormErrors.attendAddress && (
                        <span className="error-text">⚠️ {leadFormErrors.attendAddress}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Attend Status (Candidate Attendance)
                        {addressConfig.isAttendStatusMandatory ? (
                          <span className="req-star"> *</span>
                        ) : (
                          <span className="optional-badge"> (Optional)</span>
                        )}
                      </label>
                      <select
                        className={`form-select ${leadFormErrors.attendStatus ? 'input-error' : ''}`}
                        value={leadForm.attendStatus}
                        onChange={(e) => setLeadForm({ ...leadForm, attendStatus: e.target.value })}
                      >
                        {ATTEND_STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {leadFormErrors.attendStatus && (
                        <span className="error-text">⚠️ {leadFormErrors.attendStatus}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 14 }}>
                <label className="form-label">Counselor Notes / Remarks</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Student interest, scholarship queries, follow-up dates..."
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsLeadModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingLead ? 'Save Changes' : 'Create Student Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: LEAD DETAIL DRAWER (ACADEMIC, ADDRESS, SOLE OWNER & COMMUNICATION TIMELINE) */}
      {/* ======================================================== */}
      {isDetailOpen && activeLead && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <UserCheck size={18} color="#2563eb" />
                <span>Student Profile & Timeline: {activeLead.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsDetailOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Dropped status notice banner */}
              {activeLead.status === 'Lost' && (
                <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#991b1b', fontWeight: 800 }}>
                    <UserX size={16} />
                    <span>LEAD DROPPED / ARCHIVED</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: '0.825rem', color: '#7f1d1d' }}>
                    Reason: <strong>{activeLead.dropReason || 'Not Specified'}</strong>
                    {activeLead.dropRemarks && <span> — "{activeLead.dropRemarks}"</span>}
                  </div>
                  <div style={{ marginTop: 2, fontSize: '0.725rem', color: '#991b1b' }}>
                    Marked dropped by {activeLead.droppedBy || 'Staff'} on {activeLead.droppedAt || activeLead.createdAt}
                  </div>
                </div>
              )}

              {/* Direct Outreach Action Bar */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Direct Phone Outreach to Parent:
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-sm btn-contact-call"
                    onClick={() => handleOpenCall(activeLead)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '5px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <Phone size={14} /> Call Parent
                  </button>
                  <button
                    className="btn btn-sm btn-contact-sms"
                    onClick={() => handleOpenSMS(activeLead)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #93c5fd', padding: '5px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <MessageCircle size={14} /> SMS
                  </button>
                  <button
                    className="btn btn-sm btn-contact-wa"
                    onClick={() => handleOpenWhatsApp(activeLead)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#22c55e', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </button>
                  {activeLead.status !== 'Lost' && (
                    <button
                      className="btn btn-sm btn-contact-drop"
                      onClick={() => handleOpenDropModal(activeLead)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '5px 10px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                    >
                      <UserX size={14} /> Drop Lead
                    </button>
                  )}
                </div>
              </div>

              {/* Student & Parent Details Card */}
              <div className="lead-detail-card">
                <div className="detail-row">
                  <span className="detail-label">Lead ID:</span>
                  <strong>{activeLead.id}</strong>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Parent / Guardian:</span>
                  <strong>{activeLead.parentName || 'Parent / Guardian'}</strong>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Parent Phone:</span>
                  <strong>{activeLead.parentPhone || activeLead.phone}</strong>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Student Email:</span>
                  <span>{activeLead.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Lead Source:</span>
                  <span className="source-badge-chip">{activeLead.source || 'Walk-in'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Sole Owner:</span>
                  <strong style={{ color: '#2563eb' }}>{activeLead.ownerName || activeLead.assignedTo || 'Unassigned'}</strong>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Campus Branch:</span>
                  <span>{activeLead.campus || activeBranch?.name}</span>
                </div>
              </div>

              {/* Academic Allocation Box */}
              <div className="lead-detail-academic-box">
                <div className="academic-detail-title">
                  <FolderTree size={16} color="#2563eb" />
                  <strong>Academic & Group Allocation</strong>
                </div>

                <div className="detail-academic-row">
                  <span className="detail-label">Course / Program:</span>
                  <strong>{activeLead.course}</strong>
                </div>

                <div className="detail-academic-row">
                  <span className="detail-label">Class / Batch:</span>
                  <span>{activeLead.className || 'General Batch'}</span>
                </div>

                <div className="detail-academic-row">
                  <span className="detail-label">Section / Group:</span>
                  <span className="badge-group-allocated">
                    👥 {activeLead.groupName || 'Unassigned Group'}
                  </span>
                </div>
              </div>

              {/* Full Address & Attendance Breakdown */}
              <div className="lead-detail-address-box">
                <div className="address-detail-title">
                  <MapPin size={16} color="#dc2626" />
                  <strong>Residential & Verification Address Details</strong>
                </div>

                <div className="detail-address-line">
                  <span className="address-key">Mandatory Street Address:</span>
                  <span className="address-val-bold">{activeLead.address || <span style={{ color: '#ef4444' }}>Not Provided</span>}</span>
                </div>

                {activeLead.locality && (
                  <div className="detail-address-line">
                    <span className="address-key">Locality / Area (Optional):</span>
                    <span className="address-val">{activeLead.locality}</span>
                  </div>
                )}

                {activeLead.landmark && (
                  <div className="detail-address-line">
                    <span className="address-key">Landmark (Optional):</span>
                    <span className="address-val">📍 {activeLead.landmark}</span>
                  </div>
                )}

                {activeLead.doorNo && (
                  <div className="detail-address-line">
                    <span className="address-key">Door / Flat No (Optional):</span>
                    <span className="address-val">{activeLead.doorNo}</span>
                  </div>
                )}

                {/* Attend Address & Attend Status */}
                <div className="detail-address-line" style={{ marginTop: 8, padding: '8px 10px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <span className="address-key">🏢 Attend Address:</span>
                  <span className="address-val-bold">{activeLead.attendAddress || <em style={{ color: '#94a3b8' }}>Not Recorded</em>}</span>
                </div>

                <div className="detail-address-line" style={{ padding: '6px 10px' }}>
                  <span className="address-key">✓ Attend Status:</span>
                  <span className={`attend-status-pill status-${(activeLead.attendStatus || 'Attended').toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    {activeLead.attendStatus || 'Attended'}
                  </span>
                </div>

                <div className="detail-address-line">
                  <span className="address-key">City, State, Pincode:</span>
                  <span className="address-val">
                    {[activeLead.city, activeLead.state, activeLead.pincode].filter(Boolean).join(', ')}
                  </span>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 12, width: '100%', display: 'flex', justifyContent: 'center', gap: 6 }}
                  onClick={() => handleCopyAddress(activeLead)}
                >
                  <Copy size={14} /> Copy Formatted Address
                </button>
              </div>

              {/* Live Communication Timeline */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={15} color="#2563eb" />
                  <span>Communication History & Outreach Timeline</span>
                  <span className="table-count-badge">{(activeLead.communicationLogs || []).length} logs</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                  {(!activeLead.communicationLogs || activeLead.communicationLogs.length === 0) ? (
                    <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8, textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                      No communications logged yet. Use Call, SMS or WhatsApp to reach the parent.
                    </div>
                  ) : (
                    activeLead.communicationLogs.map((log) => (
                      <div key={log.id} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                        <div style={{ marginTop: 2 }}>
                          {log.type === 'call' && <Phone size={15} color="#16a34a" />}
                          {log.type === 'whatsapp' && <MessageSquare size={15} color="#22c55e" />}
                          {log.type === 'sms' && <MessageCircle size={15} color="#2563eb" />}
                          {log.type === 'drop' && <UserX size={15} color="#dc2626" />}
                          {log.type === 'assignment' && <UserCheck size={15} color="#8b5cf6" />}
                          {log.type === 'system' && <Info size={15} color="#64748b" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>{log.type.toUpperCase()}</strong>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.timestamp?.replace('T', ' ').slice(0, 16)}</span>
                          </div>
                          {log.outcome && (
                            <div style={{ fontWeight: 600, color: '#15803d', marginTop: 2 }}>Outcome: {log.outcome}</div>
                          )}
                          <p style={{ margin: '3px 0 0', color: '#334155' }}>{log.content}</p>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>By: {log.staffName}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setIsDetailOpen(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEditLead(activeLead);
                }}
              >
                <Edit2 size={14} /> Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2A: WHATSAPP COMPOSER MODAL */}
      {/* ======================================================== */}
      {isWhatsAppModalOpen && whatsAppTargetLead && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header" style={{ background: '#22c55e', color: '#ffffff' }}>
              <div className="modal-title" style={{ color: '#ffffff' }}>
                <MessageSquare size={18} />
                <span>WhatsApp Parent: {whatsAppTargetLead.parentName || whatsAppTargetLead.name}</span>
              </div>
              <button className="btn-close" style={{ color: '#ffffff' }} onClick={() => setIsWhatsAppModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '8px 12px', background: '#dcfce7', borderRadius: 6, fontSize: '0.8rem', color: '#166534' }}>
                <span>Recipient Number: <strong>{whatsAppTargetLead.parentPhone || whatsAppTargetLead.phone}</strong></span>
                <span>Student: <strong>{whatsAppTargetLead.name}</strong></span>
              </div>

              {/* Template selector chips */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Choose Admission Template:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${whatsAppTemplateId === 'intro' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSelectWhatsAppTemplate('intro')}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    👋 1. Initial Admission Inquiry Follow-up
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${whatsAppTemplateId === 'visit' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSelectWhatsAppTemplate('visit')}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    🏫 2. Campus Tour & Counseling Invitation
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${whatsAppTemplateId === 'fee_scholarship' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSelectWhatsAppTemplate('fee_scholarship')}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    💰 3. Scholarship & Fee Installment Breakdown
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${whatsAppTemplateId === 'docs' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSelectWhatsAppTemplate('docs')}
                    style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    📄 4. Document Verification Reminder
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Message Preview & Personalization:</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={whatsAppCustomText}
                  onChange={(e) => setWhatsAppCustomText(e.target.value)}
                  placeholder="Type WhatsApp message..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsWhatsAppModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSendWhatsApp}
                style={{ background: '#22c55e', borderColor: '#16a34a', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Send size={14} /> Send WhatsApp & Record Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2B: PHONE CALL LOGGER MODAL */}
      {/* ======================================================== */}
      {isCallLogModalOpen && callTargetLead && (
        <div className="modal-dialog-wrapper modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Phone size={18} color="#16a34a" />
                <span>Log Phone Call: {callTargetLead.parentName || callTargetLead.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsCallLogModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 6, marginBottom: 12, fontSize: '0.825rem' }}>
                <div>Student: <strong>{callTargetLead.name}</strong> • Phone: <strong>{callTargetLead.parentPhone || callTargetLead.phone}</strong></div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 2 }}>Campus: {callTargetLead.campus || activeBranch?.name}</div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Call Outcome / Status:</label>
                <select
                  className="form-select"
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                >
                  <option value="Connected - Parent Interested">Connected - Parent Interested (Wants Campus Tour)</option>
                  <option value="Connected - Fee Inquiry">Connected - Inquired about Fee Structure</option>
                  <option value="Connected - Follow-up Requested">Connected - Asked to Call Back Later</option>
                  <option value="Ringing - No Answer">Ringing - No Answer</option>
                  <option value="Busy / Line Engaged">Busy / Line Engaged</option>
                  <option value="Switched Off / Not Reachable">Switched Off / Not Reachable</option>
                  <option value="Not Interested / Dropped">Not Interested / Dropped</option>
                </select>
              </div>

              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Discussion Notes / Remarks:</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  placeholder="Record parent feedback, fee objections, school preference, next follow-up date..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsCallLogModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveCallLog}>
                Save Call Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2C: MARK LEAD AS DROPPED / LOST */}
      {/* ======================================================== */}
      {isDropModalOpen && leadToDrop && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header" style={{ background: '#fee2e2' }}>
              <div className="modal-title" style={{ color: '#991b1b' }}>
                <UserX size={18} color="#dc2626" />
                <span>Mark Lead as Dropped: {leadToDrop.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsDropModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
                Marking this lead as Dropped will archive it from active counseling queues into the Dropped Leads Registry.
                Please record the specific reason to help institutional analytics.
              </p>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Drop Reason <span className="req-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={dropForm.reasonCode}
                  onChange={(e) => setDropForm({ ...dropForm, reasonCode: e.target.value })}
                >
                  {dropReasons.map((dr) => (
                    <option key={dr.id} value={dr.name}>
                      {dr.name} ({dr.category || 'General'})
                    </option>
                  ))}
                </select>
                <span className="input-hint">
                  Customizable by Tenant Admin under Drop Reasons Configuration.
                </span>
              </div>

              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Detailed Remarks / Parent Feedback:
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={dropForm.remarks}
                  onChange={(e) => setDropForm({ ...dropForm, remarks: e.target.value })}
                  placeholder="e.g. Parent requested a 50% discount which exceeded authorized scholarship limit; decided to retain child at National Public School."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDropModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmDrop}
                style={{ background: '#dc2626', borderColor: '#b91c1c' }}
              >
                Confirm Drop Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2D: TENANT ADMIN DROP REASONS CONFIGURATION */}
      {/* ======================================================== */}
      {isDropConfigModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <Settings size={18} color="#2563eb" />
                <span>Tenant Drop Reasons Configuration ({activeTenant.name})</span>
              </div>
              <button className="btn-close" onClick={() => setIsDropConfigModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 14 }}>
                As Tenant Admin, you can add and manage the reasons why candidate leads drop out of your admission pipeline.
                These options will appear in all staff drop modals and drop analytics reports.
              </p>

              {/* Add New Drop Reason Form */}
              <form onSubmit={handleSaveNewDropReason} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                  + Add New Drop Reason
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Drop Reason Name <span className="req-star">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. High Fee Structure / Cannot Afford"
                      value={newDropReason.name}
                      onChange={(e) => setNewDropReason({ ...newDropReason, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newDropReason.category}
                      onChange={(e) => setNewDropReason({ ...newDropReason, category: e.target.value })}
                    >
                      <option value="Financial">Financial / Pricing</option>
                      <option value="Academic">Academic / Curriculum</option>
                      <option value="Logistics">Logistics / Distance</option>
                      <option value="Competitor">Competitor / Other School</option>
                      <option value="Personal">Personal / Relocation</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Description / Guidance for Staff</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Explain when staff should select this reason..."
                      value={newDropReason.description}
                      onChange={(e) => setNewDropReason({ ...newDropReason, description: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Add Drop Reason
                  </button>
                </div>
              </form>

              {/* Configured Drop Reasons List */}
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                Current Configured Drop Reasons ({dropReasons.length}):
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 250, overflowY: 'auto' }}>
                {dropReasons.map((dr) => {
                  const leadCount = dropReasonsStats[dr.name] || 0;
                  return (
                    <div key={dr.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>{dr.name}</span>
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#f1f5f9', borderRadius: 4, color: '#475569' }}>
                            {dr.category || 'General'}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626' }}>
                            ({leadCount} dropped leads)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                          {dr.description}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-icon"
                        title="Delete drop reason"
                        onClick={() => handleDeleteDropReason(dr.id, dr.name)}
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDropConfigModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2E: MANUAL INBOUND LEAD AREA ASSIGNMENT */}
      {/* ======================================================== */}
      {isAssignModalOpen && selectedInboundLead && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <UserCheck size={18} color="#2563eb" />
                <span>Manual Lead Assignment by Area: {selectedInboundLead.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsAssignModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ padding: '10px 14px', background: '#eff6ff', borderRadius: 8, marginBottom: 14, border: '1px solid #bfdbfe', fontSize: '0.825rem' }}>
                <div>Student: <strong>{selectedInboundLead.name}</strong> • Parent: <strong>{selectedInboundLead.parentName || 'Parent / Guardian'}</strong></div>
                <div style={{ marginTop: 4 }}>
                  📍 Assigned Area: <strong style={{ color: '#1d4ed8' }}>{selectedInboundLead.locality || 'General Area'}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Address: {selectedInboundLead.address}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  Source: <strong>{selectedInboundLead.source || 'Walk-in'}</strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Select Staff / Teacher / PRVO for this Area <span className="req-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={targetAssigneeId}
                  onChange={(e) => setTargetAssigneeId(e.target.value)}
                >
                  <option value="" disabled>-- Select Staff Member --</option>
                  {users
                    .filter((u) => u.role === 'teacher' || u.role === 'prvo' || u.role === 'counselor')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {ROLE_DEFINITIONS[u.role]?.label || u.role} ({allBranches.find(b => b.id === u.primaryBranchId)?.name || 'Campus'})
                      </option>
                    ))}
                </select>
                <span className="input-hint">
                  Under strict single ownership policy, <strong>only this staff member will be the sole owner</strong> and will be able to access and manage this lead.
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmAssign}
                disabled={!targetAssigneeId}
              >
                Assign as Sole Owner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2F: DOWNLOAD MOBILE APP (APK / PWA SIMULATION) */}
      {/* ======================================================== */}
      {isPwaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header" style={{ background: '#1e40af', color: '#ffffff' }}>
              <div className="modal-title" style={{ color: '#ffffff' }}>
                <Smartphone size={18} />
                <span>Download CampusConnect PRV Mobile App</span>
              </div>
              <button className="btn-close" style={{ color: '#ffffff' }} onClick={() => setIsPwaModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: 'center', padding: '20px 16px' }}>
              <div style={{ display: 'inline-flex', padding: 14, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 16, marginBottom: 12 }}>
                <QrCode size={120} color="#0f172a" />
              </div>

              <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                CampusConnect Staff & Teacher PRV App (v2.4.0)
              </h4>
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b', lineHeight: 1.4 }}>
                For teachers, PRVs, and field coordinators. Download the Android APK or install the Progressive Web App (PWA) directly to your smartphone.
              </p>

              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    showToast('⬇️ Downloading CampusConnect-PRV-v2.4.0.apk (18.4 MB)...');
                    setTimeout(() => {
                      showToast('✅ Download Complete! Tap to install APK on your mobile device.');
                    }, 1200);
                  }}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '10px 14px' }}
                >
                  <Download size={16} /> Download Android APK (.apk)
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsPwaModalOpen(false);
                    setIsMobileViewMode(true);
                    showToast('📲 Opened Mobile App View! You can test all PRV mobile features.');
                  }}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '10px 14px' }}
                >
                  <Smartphone size={16} /> Launch Interactive Mobile App View
                </button>
              </div>

              <div style={{ marginTop: 16, textAlign: 'left', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Mobile App Features:</div>
                <div>• <strong>Sole Lead Ownership:</strong> Teachers can only view & edit their own student leads.</div>
                <div>• <strong>Multi-Factor Duplicate Engine:</strong> Instant duplicate warning by student name, parent name, mobile, address, or door no.</div>
                <div>• <strong>Direct Phone Engagement:</strong> Instant Call, SMS, and WhatsApp to parents.</div>
                <div>• <strong>Inbound & Area Queue:</strong> Claim or manage unassigned leads per locality/area.</div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsPwaModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT COURSE */}
      {/* ======================================================== */}
      {isCourseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Bookmark size={18} color="#2563eb" />
                <span>{isEditingCourse ? 'Edit Course' : `Add Course to ${activeTenant.name}`}</span>
              </div>
              <button className="btn-close" onClick={() => setIsCourseModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="modal-body">
              <div className="form-group">
                <label className="form-label">Course / Program Name <span className="req-star">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Course Code <span className="req-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. BTECH-CSE"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Degree Level</label>
                  <select
                    className="form-select"
                    value={courseForm.degreeLevel}
                    onChange={(e) => setCourseForm({ ...courseForm, degreeLevel: e.target.value })}
                  >
                    <option value="Undergraduate (UG)">Undergraduate (UG)</option>
                    <option value="Postgraduate (PG)">Postgraduate (PG)</option>
                    <option value="K-12 / Pre-University">K-12 / Pre-University</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Executive Education">Executive Education</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Department / School</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. School of Computing"
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 4 Years"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Course Overview / Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Brief curriculum description..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCourseModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD / EDIT CLASS / BATCH */}
      {/* ======================================================== */}
      {isClassModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <BookOpen size={18} color="#2563eb" />
                <span>{isEditingClass ? 'Edit Class' : `Add Class / Batch to ${activeTenant.name}`}</span>
              </div>
              <button className="btn-close" onClick={() => setIsClassModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Select Parent Course <span className="req-star">*</span></label>
                  <select
                    className="form-select"
                    value={classForm.courseId}
                    onChange={(e) => setClassForm({ ...classForm, courseId: e.target.value })}
                  >
                    {tenantCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Branch</label>
                  <select
                    className="form-select"
                    value={classForm.branchId}
                    onChange={(e) => setClassForm({ ...classForm, branchId: e.target.value })}
                  >
                    {allBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.orgName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Class / Batch Name <span className="req-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CSE 2026-2030 Batch (Year 1)"
                    value={classForm.name}
                    onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Class Code <span className="req-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CSE-26-Y1"
                    value={classForm.code}
                    onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="2026-2027"
                    value={classForm.academicYear}
                    onChange={(e) => setClassForm({ ...classForm, academicYear: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Student Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={classForm.capacity}
                    onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Class Mentor / Faculty</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. Arvind Rao"
                    value={classForm.classTeacher}
                    onChange={(e) => setClassForm({ ...classForm, classTeacher: e.target.value })}
                  />
                </div>
              </div>

              {/* Dynamic Customizable Attributes */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Customizable Attributes:
                  </label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      setClassForm({
                        ...classForm,
                        customFields: [...(classForm.customFields || []), { key: '', value: '' }],
                      })
                    }
                  >
                    <Plus size={12} /> Add Field
                  </button>
                </div>

                {(classForm.customFields || []).map((cf, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Attribute Name (e.g. Shift, Lab Slot)"
                      value={cf.key}
                      onChange={(e) => {
                        const updated = [...classForm.customFields];
                        updated[idx].key = e.target.value;
                        setClassForm({ ...classForm, customFields: updated });
                      }}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Value (e.g. Morning, Room 302)"
                      value={cf.value}
                      onChange={(e) => {
                        const updated = [...classForm.customFields];
                        updated[idx].value = e.target.value;
                        setClassForm({ ...classForm, customFields: updated });
                      }}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: '#ef4444' }}
                      onClick={() => {
                        const updated = classForm.customFields.filter((_, i) => i !== idx);
                        setClassForm({ ...classForm, customFields: updated });
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsClassModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD / EDIT SECTION OR GROUP */}
      {/* ======================================================== */}
      {isGroupModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Layers3 size={18} color="#2563eb" />
                <span>{isEditingGroup ? 'Edit Section / Group' : `Add Section or Group (${activeTenant.name})`}</span>
              </div>
              <button className="btn-close" onClick={() => setIsGroupModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="modal-body">
              <div className="form-group">
                <label className="form-label">Link to Class / Batch <span className="req-star">*</span></label>
                <select
                  className="form-select"
                  value={groupForm.classId}
                  onChange={(e) => setGroupForm({ ...groupForm, classId: e.target.value })}
                >
                  <option value="">-- Select Class --</option>
                  {tenantClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Section / Group Name <span className="req-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Section A (Morning AI Track)"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Group Code <span className="req-star">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SEC-A"
                    value={groupForm.code}
                    onChange={(e) => setGroupForm({ ...groupForm, code: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Group Classification Type</label>
                  <select
                    className="form-select"
                    value={groupForm.type}
                    onChange={(e) => setGroupForm({ ...groupForm, type: e.target.value })}
                  >
                    {GROUP_TYPES.map((gt) => (
                      <option key={gt} value={gt}>{gt}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Group Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={groupForm.capacity}
                    onChange={(e) => setGroupForm({ ...groupForm, capacity: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Room / Lab Hall</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Turing Hall 302"
                    value={groupForm.room}
                    onChange={(e) => setGroupForm({ ...groupForm, room: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instructor / In-Charge</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Prof. K. Raman"
                    value={groupForm.faculty}
                    onChange={(e) => setGroupForm({ ...groupForm, faculty: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Track Specialization</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Specialization focus, lab requirements, timings..."
                  value={groupForm.notes}
                  onChange={(e) => setGroupForm({ ...groupForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsGroupModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingGroup ? 'Update Group' : 'Create Group / Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD / EDIT USER */}
      {/* ======================================================== */}
      {isUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-header">
              <div className="modal-title">
                <Shield size={18} color="#2563eb" />
                <span>{isEditingUser ? `Edit User: ${selectedUserToEdit?.name}` : 'Add New User & Assign Roles'}</span>
              </div>
              <button className="btn-close" onClick={() => setIsUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${userFormErrors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Rajesh Kumar"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  />
                  {userFormErrors.name && (
                    <span className="error-text">{userFormErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="req-star">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input ${userFormErrors.email ? 'input-error' : ''}`}
                    placeholder="user@edugroup.io"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  />
                  {userFormErrors.email && (
                    <span className="error-text">{userFormErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 98765 00000"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Assigned Role <span className="req-star">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    {Object.keys(ROLE_DEFINITIONS).map((rKey) => (
                      <option key={rKey} value={rKey}>
                        {ROLE_DEFINITIONS[rKey].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!isEditingUser && (
                <div className="user-password-section">
                  <div className="form-group">
                    <label className="form-label">
                      Initial Password <span className="req-star">*</span>
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        className={`form-input ${userFormErrors.password ? 'input-error' : ''}`}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setUserForm({ ...userForm, password: generatePassword() })}
                        title="Generate random secure password"
                      >
                        <RefreshCw size={14} /> Generate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Groups Assignment: Single or Multiple Groups */}
              <div className="user-groups-assignment-box" style={{ marginTop: 16 }}>
                <div className="group-assignment-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers3 size={16} color="#2563eb" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.925rem', fontWeight: 600 }}>
                        Academic Student Groups Assignment (Single or Multiple Groups)
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                        Assign this user to a single group or multiple student groups, sections, or lab tracks across the tenant.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleSelectAllGroups}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleClearAllGroups}
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="user-groups-grid" style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8, maxHeight: 180, overflowY: 'auto', padding: 4 }}>
                  {tenantGroups.map((grp) => {
                    const isSelected = userForm.assignedGroupIds?.includes(grp.id);
                    const parentClass = tenantClasses.find((c) => c.id === grp.classId);

                    return (
                      <div
                        key={grp.id}
                        className={`group-selection-card ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleToggleGroupAssignment(grp.id)}
                        style={{
                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          padding: '8px 10px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ marginTop: 3, cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                            {grp.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <span className="group-type-badge-sm" style={{ background: '#e0e7ff', color: '#3730a3', padding: '1px 5px', borderRadius: 4, fontWeight: 500 }}>
                              {grp.type}
                            </span>
                            <span>{parentClass ? parentClass.code : grp.code}</span>
                            {grp.room && <span>• {grp.room}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    Selected: <strong>{userForm.assignedGroupIds?.length || 0}</strong> {userForm.assignedGroupIds?.length === 1 ? 'group' : 'groups'}
                  </span>
                  <span>Allows user to mentor and manage student leads across assigned groups.</span>
                </div>
              </div>

              {/* Multi-Branch Assignment with Compulsory Default Branch */}
              <div className="user-branch-assignment-box" style={{ marginTop: 16 }}>
                <div className="branch-assignment-title">
                  <Building2 size={16} color="#2563eb" />
                  <div>
                    <h4>Multi-Branch Access & Compulsory Default Branch Designation</h4>
                    <p>
                      A user must have a <strong>Compulsory Default Branch</strong> (where their physical presence is located and which loads by default on CRM launch). Any additional branches selected are <strong>Optional Supervised Branches</strong>, allowing the user to view and monitor activities of those branches.
                    </p>
                  </div>
                </div>

                {/* Scenario Example Callout */}
                <div className="branch-scenario-callout" style={{ margin: '10px 0', padding: '10px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: '0.775rem', color: '#166534', lineHeight: 1.4 }}>
                  <strong>💡 Multi-Branch Work Scenario:</strong> For an employee working in <strong>Branch B</strong> (physical presence only in Branch B) who also looks after activities of <strong>Branch A and Branch C</strong>: Select <strong>Branch B as the Compulsory Default Branch</strong>, and check <strong>Branch A & Branch C as Optional Accessible Branches</strong>. Upon login, the CRM will always default to Branch B, with Branch A and C available in the dropdown to check their activities.
                </div>

                {userFormErrors.branches && (
                  <div className="error-text" style={{ marginBottom: 8, fontWeight: 600 }}>
                    ⚠️ {userFormErrors.branches}
                  </div>
                )}
                {userFormErrors.primaryBranch && (
                  <div className="error-text" style={{ marginBottom: 8, fontWeight: 600 }}>
                    ⚠️ {userFormErrors.primaryBranch}
                  </div>
                )}

                <div className="branch-selection-table">
                  <div className="branch-selection-header">
                    <span>Assign Branch Access</span>
                    <span>Compulsory Default Branch (Physical Presence)</span>
                  </div>

                  {allBranches.map((b) => {
                    const isAssigned = userForm.assignedBranchIds?.includes(b.id);
                    const isPrimary = userForm.primaryBranchId === b.id;

                    return (
                      <div
                        key={b.id}
                        className={`branch-selection-row ${isAssigned ? 'assigned-row' : ''} ${isPrimary ? 'primary-row' : ''}`}
                      >
                        <label className="branch-checkbox-label">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => handleToggleBranchAssignment(b.id)}
                          />
                          <div>
                            <div className="branch-row-name">
                              {b.name}
                              {isPrimary && (
                                <span className="presence-tag-badge" style={{ marginLeft: 6, fontSize: '0.7rem', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                                  ★ Default (Home)
                                </span>
                              )}
                              {isAssigned && !isPrimary && (
                                <span className="optional-tag-badge" style={{ marginLeft: 6, fontSize: '0.7rem', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4 }}>
                                  🏢 Optional Supervised
                                </span>
                              )}
                            </div>
                            <div className="branch-row-sub">{b.orgName} • {b.city}</div>
                          </div>
                        </label>

                        <div className="primary-radio-cell">
                          <label className="primary-radio-label">
                            <input
                              type="radio"
                              name="primaryBranchRadio"
                              disabled={!isAssigned}
                              checked={isPrimary}
                              onChange={() => handleSelectPrimaryBranch(b.id)}
                            />
                            <span className={isPrimary ? 'radio-text-bold' : ''}>
                              {isPrimary ? '★ Compulsory Default Branch (Physical Presence)' : 'Set as Compulsory Default'}
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingUser ? 'Update User & Permissions' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: CHANGE PASSWORD */}
      {/* ======================================================== */}
      {isPasswordModalOpen && passwordTargetUser && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Key size={18} color="#2563eb" />
                <span>Change Password: {passwordTargetUser.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsPasswordModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewPassword} className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 14 }}>
                Set a new password for <strong>{passwordTargetUser.name}</strong> ({passwordTargetUser.email}).
              </p>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    className="form-input"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setNewPasswordInput(generatePassword())}
                    title="Generate secure password"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showPasswordText}
                    onChange={(e) => setShowPasswordText(e.target.checked)}
                  />
                  <span>Show password text</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 8: ADD TENANT (AUTO-GENERATED TENANT ID) */}
      {/* ======================================================== */}
      {isTenantModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <School size={18} color="#2563eb" />
                <span>Add Institutional Tenant (Auto-Generated ID)</span>
              </div>
              <button className="btn-close" onClick={() => setIsTenantModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTenant} className="modal-body">
              <div className="tenant-id-generator-box">
                <div className="tenant-id-label">
                  <span>Tenant ID (Auto-Generated by System):</span>
                  <button
                    type="button"
                    className="btn-regenerate-id"
                    onClick={handleRegenerateTenantId}
                  >
                    <RefreshCw size={12} /> Regenerate ID
                  </button>
                </div>
                <div className="tenant-id-display">
                  <code>{tenantForm.id}</code>
                  <span className="auto-gen-badge">Auto-Generated</span>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 14 }}>
                <label className="form-label">
                  Tenant Organization Name <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apex Global University System"
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tenant Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. AGUS"
                  value={tenantForm.code}
                  onChange={(e) => setTenantForm({ ...tenantForm, code: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Custom Subdomain</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. apex.campusconnect.io"
                  value={tenantForm.domain}
                  onChange={(e) => setTenantForm({ ...tenantForm, domain: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SaaS Subscription Plan</label>
                <select
                  className="form-select"
                  value={tenantForm.tier}
                  onChange={(e) => setTenantForm({ ...tenantForm, tier: e.target.value })}
                >
                  <option value="Enterprise Multi-Org Plan">Enterprise Multi-Org Plan</option>
                  <option value="Growth Multi-Campus Plan">Growth Multi-Campus Plan</option>
                  <option value="Standard Academic Plan">Standard Academic Plan</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsTenantModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Tenant with Auto-ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 9: ADD ORGANIZATION */}
      {/* ======================================================== */}
      {isOrgModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Building2 size={18} color="#2563eb" />
                <span>Add Organization to {activeTenant.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsOrgModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="modal-body">
              <div className="form-group">
                <label className="form-label">Organization Name <span className="req-star">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Xavier Institute of Sciences"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institution Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. XIS"
                  value={orgForm.code}
                  onChange={(e) => setOrgForm({ ...orgForm, code: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization Type</label>
                <select
                  className="form-select"
                  value={orgForm.type}
                  onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
                >
                  <option value="Higher Education / University">Higher Education / University</option>
                  <option value="K-12 & Pre-University">K-12 & Pre-University</option>
                  <option value="Postgraduate & Executive Education">Postgraduate & Executive Education</option>
                </select>
              </div>

              <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                  Default Branch Details:
                </div>
                <div className="form-group">
                  <label className="form-label">Default Branch Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={orgForm.branchName}
                    onChange={(e) => setOrgForm({ ...orgForm, branchName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={orgForm.branchCity}
                    onChange={(e) => setOrgForm({ ...orgForm, branchCity: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsOrgModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 10: ADD BRANCH */}
      {/* ======================================================== */}
      {isBranchModalOpen && selectedOrgForBranch && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Building2 size={18} color="#2563eb" />
                <span>Add Branch to {selectedOrgForBranch.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsBranchModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddBranch} className="modal-body">
              <div className="form-group">
                <label className="form-label">Branch Name <span className="req-star">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. East Valley Campus"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Branch Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. EVC-02"
                  value={branchForm.code}
                  onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bangalore"
                  value={branchForm.city}
                  onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Phase 2, Ring Road"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsBranchModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 11: BULK IMPORT LEADS (CSV ENGINE) */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-xl">
            <div className="modal-header">
              <div className="modal-title">
                <FileSpreadsheet size={18} color="#2563eb" />
                <span>Bulk Import Student Leads (CSV Engine) - {activeBranch?.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsImportModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {/* Address & Attendance Policy Configuration Banner */}
              <div className="import-rules-banner" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      📋 Lead Entry & Import Address Rules
                    </h4>
                    <ul style={{ margin: '6px 0 0 18px', padding: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                      <li><strong>Street Address is strictly MANDATORY (*)</strong>: Every imported lead row must have a valid street address.</li>
                      <li><strong>Locality / Area & Landmark are strictly OPTIONAL</strong>: Can be provided or left empty without error.</li>
                      <li>Rows with missing mandatory fields are flagged in red and excluded until corrected.</li>
                    </ul>
                  </div>

                  {/* Mandatory Options Toggles */}
                  <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      ⚙️ Import Field Enforcement Options:
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.775rem', cursor: 'pointer', marginBottom: 4 }}>
                      <input
                        type="checkbox"
                        checked={addressConfig.isAttendAddressMandatory}
                        onChange={(e) => {
                          const updated = { ...addressConfig, isAttendAddressMandatory: e.target.checked };
                          setAddressConfig(updated);
                          if (importCsvText) setImportParsedRows(parseCSV(importCsvText, updated));
                        }}
                      />
                      <span>Mark <strong>Attend Address</strong> as a Mandatory Field</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.775rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={addressConfig.isAttendStatusMandatory}
                        onChange={(e) => {
                          const updated = { ...addressConfig, isAttendStatusMandatory: e.target.checked };
                          setAddressConfig(updated);
                          if (importCsvText) setImportParsedRows(parseCSV(importCsvText, updated));
                        }}
                      />
                      <span>Mark <strong>Attend Status</strong> as a Mandatory Field</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Import Tab Controls & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${importSelectedTab === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setImportSelectedTab('paste')}
                  >
                    📝 Paste CSV Data
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${importSelectedTab === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setImportSelectedTab('file')}
                  >
                    📂 Upload .CSV File
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleDownloadSampleCSV}
                    title="Download pre-formatted CSV template"
                  >
                    📥 Download CSV Template
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleLoadDemoCSV}
                    title="Load sample CSV with mandatory and optional fields"
                  >
                    ⚡ Load Demo CSV
                  </button>
                </div>
              </div>

              {/* Paste or Upload Area */}
              {importSelectedTab === 'paste' ? (
                <div className="form-group">
                  <textarea
                    className="form-textarea"
                    rows={6}
                    style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                    placeholder="Paste CSV rows here: Name,Email,Phone,Course,Class,Group,Address,Area,Landmark,AttendAddress,AttendStatus,City,State,Pincode"
                    value={importCsvText}
                    onChange={(e) => handleImportCsvChange(e.target.value)}
                  />
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: 4 }}>
                    Tip: Headers must include: <code>Name, Email, Phone, Address</code>. Area and Landmark columns are optional.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: '2px dashed #93c5fd',
                    borderRadius: 8,
                    padding: 24,
                    textAlign: 'center',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    marginBottom: 14,
                  }}
                  onClick={() => document.getElementById('csvFileInput')?.click()}
                >
                  <Upload size={28} color="#2563eb" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                    Click to browse and upload CSV file
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                    Supports standard .csv format with Address column
                  </div>
                  {importFileName && (
                    <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                      Selected File: {importFileName}
                    </div>
                  )}
                  <input
                    id="csvFileInput"
                    type="file"
                    accept=".csv,text/csv"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {/* Validation Preview Table */}
              {importParsedRows.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>
                      Live Validation Preview ({importParsedRows.length} rows detected)
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: '0.775rem' }}>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>
                        ✅ {importParsedRows.filter((r) => r.isValid).length} Valid
                      </span>
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>
                        ❌ {importParsedRows.filter((r) => !r.isValid).length} Errors
                      </span>
                    </div>
                  </div>

                  <div className="table-wrapper" style={{ maxHeight: 240, overflowY: 'auto' }}>
                    <table className="crm-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Status</th>
                          <th>Student Name</th>
                          <th>Mandatory Address *</th>
                          <th>Area (Optional)</th>
                          <th>Landmark (Optional)</th>
                          <th>Attend Address</th>
                          <th>Attend Status</th>
                          <th>Validation Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importParsedRows.map((r, idx) => (
                          <tr key={idx} style={{ background: r.isValid ? '#ffffff' : '#fef2f2' }}>
                            <td>{r.rawIndex || idx + 1}</td>
                            <td>
                              {r.isValid ? (
                                <span className="status-badge status-enrolled" style={{ fontSize: '0.7rem' }}>
                                  ✓ Valid
                                </span>
                              ) : (
                                <span className="status-badge status-lost" style={{ fontSize: '0.7rem' }}>
                                  ⚠️ Error
                                </span>
                              )}
                            </td>
                            <td>
                              <strong>{r.name || '<Empty Name>'}</strong>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.email}</div>
                            </td>
                            <td>
                              {r.address ? (
                                <span style={{ color: '#0f172a', fontWeight: 500 }}>{r.address}</span>
                              ) : (
                                <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ Missing (Mandatory)</span>
                              )}
                            </td>
                            <td>{r.locality || <em style={{ color: '#94a3b8' }}>None</em>}</td>
                            <td>{r.landmark || <em style={{ color: '#94a3b8' }}>None</em>}</td>
                            <td>
                              {r.attendAddress ? (
                                <span>{r.attendAddress}</span>
                              ) : addressConfig.isAttendAddressMandatory ? (
                                <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ Required</span>
                              ) : (
                                <em style={{ color: '#94a3b8' }}>Default ({activeBranch?.name})</em>
                              )}
                            </td>
                            <td>
                              {r.attendStatus ? (
                                <span className={`attend-status-pill status-${r.attendStatus.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                                  {r.attendStatus}
                                </span>
                              ) : (
                                <em style={{ color: '#94a3b8' }}>Attended</em>
                              )}
                            </td>
                            <td>
                              {r.isValid ? (
                                <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>Ready to Import</span>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
                                  {r.errors.join(', ')}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Importing into: <strong>{activeBranch?.name}</strong> ({activeOrg?.name})
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={importParsedRows.filter((r) => r.isValid).length === 0}
                  onClick={handleExecuteImport}
                >
                  Import {importParsedRows.filter((r) => r.isValid).length} Valid Leads
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 12: LOG BRANCH ACTIVITY */}
      {/* ======================================================== */}
      {isActivityModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <Activity size={18} color="#2563eb" />
                <span>Log Activity for {activeBranch?.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsActivityModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="modal-body">
              <div style={{ padding: '8px 12px', background: '#eff6ff', borderRadius: 6, marginBottom: 14, fontSize: '0.8rem', color: '#1d4ed8' }}>
                📍 Branch: <strong>{activeBranch?.name}</strong> • Supervising Counselor: <strong>{currentUser.name}</strong>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Activity Title <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. In-Person Student Counseling & Campus Tour"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Activity Type</label>
                  <select
                    className="form-select"
                    value={activityForm.type}
                    onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                  >
                    <option value="counseling_followup">Counseling & Follow-up</option>
                    <option value="campus_tour">Campus Visit & Tour</option>
                    <option value="document_verification">Document Verification</option>
                    <option value="fee_collection">Fee & Seat Booking</option>
                    <option value="inquiry_walkin">Walk-in Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Execution / Attend Status</label>
                  <select
                    className="form-select"
                    value={activityForm.statusBadge}
                    onChange={(e) => setActivityForm({ ...activityForm, statusBadge: e.target.value })}
                  >
                    <option value="Attended">Attended</option>
                    <option value="Walk-in Verified">Walk-in Verified</option>
                    <option value="Completed">Completed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Details & Observations</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Notes on candidate interest, branch facilities shown, document status..."
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsActivityModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
