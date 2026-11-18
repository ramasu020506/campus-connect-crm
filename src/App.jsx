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
  FolderTree
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
  STATUS_LIST,
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
      const saved = localStorage.getItem('cc_saas_tenants_v3');
      return saved ? JSON.parse(saved) : INITIAL_TENANTS;
    } catch {
      return INITIAL_TENANTS;
    }
  });

  const [activeTenantId, setActiveTenantId] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_active_tenant_id_v3');
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
      const saved = localStorage.getItem('cc_saas_users_v3');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Logged-in User (default: Priya Patel - Tenant Admin)
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_current_user_id_v3');
      return saved || 'usr-102'; // Default: Priya Patel (Tenant Admin)
    } catch {
      return 'usr-102';
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
      const saved = localStorage.getItem('cc_saas_organizations_v3');
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
      const saved = localStorage.getItem('cc_saas_courses_v3');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_classes_v3');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_groups_v3');
      return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    } catch {
      return INITIAL_GROUPS;
    }
  });

  // Leads
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_leads_v3');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cc_saas_tenants_v3', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('cc_saas_active_tenant_id_v3', activeTenantId);
  }, [activeTenantId]);

  useEffect(() => {
    localStorage.setItem('cc_saas_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cc_saas_current_user_id_v3', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('cc_saas_organizations_v3', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('cc_saas_courses_v3', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('cc_saas_classes_v3', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('cc_saas_groups_v3', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('cc_saas_leads_v3', JSON.stringify(leads));
  }, [leads]);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // 3. Multi-Branch & Primary Branch Access Logic
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

  // Active Branch: Defaults to user's PRIMARY branch on login / user change
  const [activeBranchId, setActiveBranchId] = useState(() => {
    const primary = currentUser?.primaryBranchId;
    if (primary && userAllowedBranches.some((b) => b.id === primary)) {
      return primary;
    }
    return userAllowedBranches[0]?.id || 'branch-1';
  });

  // When current user changes, automatically switch active branch to that user's Primary Branch
  useEffect(() => {
    if (currentUser) {
      const primary = currentUser.primaryBranchId;
      if (primary && userAllowedBranches.some((b) => b.id === primary)) {
        setActiveBranchId(primary);
      } else if (userAllowedBranches.length > 0) {
        setActiveBranchId(userAllowedBranches[0].id);
      }
    }
  }, [currentUserId]);

  const activeBranch = useMemo(() => {
    return allBranches.find((b) => b.id === activeBranchId) || userAllowedBranches[0] || allBranches[0];
  }, [allBranches, userAllowedBranches, activeBranchId]);

  const activeOrg = useMemo(() => {
    if (!activeBranch) return organizations[0];
    return organizations.find((o) => o.id === activeBranch.orgId) || organizations[0];
  }, [organizations, activeBranch]);

  const userPrimaryBranch = useMemo(() => {
    return allBranches.find((b) => b.id === currentUser?.primaryBranchId) || null;
  }, [allBranches, currentUser]);

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

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Branch filtering
      if (filterByBranch && lead.branchId && lead.branchId !== activeBranchId) {
        return false;
      }

      const matchesSearch =
        searchQuery === '' ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.landmark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.doorNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.groupName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter;
      const matchesCourse = courseFilter === 'All Courses' || lead.courseId === courseFilter;
      const matchesClass = classFilter === 'All Classes' || lead.classId === classFilter;
      const matchesGroup = groupFilter === 'All Groups' || lead.groupId === groupFilter;

      return matchesSearch && matchesStatus && matchesCourse && matchesClass && matchesGroup;
    });
  }, [leads, searchQuery, statusFilter, courseFilter, classFilter, groupFilter, filterByBranch, activeBranchId]);

  // Lead Modal & Detail States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeLead, setActiveLead] = useState(null);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [leadFormErrors, setLeadFormErrors] = useState({});

  const emptyLeadForm = {
    name: '',
    email: '',
    phone: '',
    courseId: '',
    classId: '',
    groupId: '',
    status: 'Inquiry',
    priority: 'Medium',
    // Address Details: Address is MANDATORY; Locality, Landmark, DoorNo are OPTIONAL
    address: '',
    locality: '',
    landmark: '',
    doorNo: '',
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
      courseId: initialCourse?.id || '',
      classId: initialClass?.id || '',
      groupId: initialGroups[0]?.id || '',
      city: activeBranch?.city || 'Bangalore',
    });
    setLeadFormErrors({});
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setIsEditingLead(true);
    setActiveLead(lead);
    setLeadForm({
      ...lead,
      courseId: lead.courseId || '',
      classId: lead.classId || '',
      groupId: lead.groupId || '',
      locality: lead.locality || lead.area || '',
      doorNo: lead.doorNo || '',
      landmark: lead.landmark || '',
    });
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
    e.preventDefault();
    const errors = {};

    if (!leadForm.name?.trim()) errors.name = 'Student Name is required.';
    if (!leadForm.email?.trim()) errors.email = 'Email address is required.';
    if (!leadForm.phone?.trim()) errors.phone = 'Phone number is required.';
    if (!leadForm.courseId) errors.courseId = 'Please select a Course / Program.';

    // MANDATORY ADDRESS VALIDATION
    if (!leadForm.address?.trim()) {
      errors.address = 'Address is a required mandatory field. Please enter street / residential address.';
    }

    if (Object.keys(errors).length > 0) {
      setLeadFormErrors(errors);
      showToast('⚠️ Please fill in all required fields, including the mandatory Address.');
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
              course: assignedCourse ? assignedCourse.name : l.course,
              className: assignedClass ? assignedClass.name : l.className,
              groupName: assignedGroup ? assignedGroup.name : l.groupName,
            }
          : l
      );
      setLeads(updated);
      showToast(`Lead "${leadForm.name}" updated with course, class, and group allocation.`);
    } else {
      const newLead = {
        ...leadForm,
        id: generateLeadId(),
        tenantId: activeTenantId,
        orgId: activeOrg?.id || 'org-101',
        branchId: activeBranchId,
        campus: activeBranch?.name,
        course: assignedCourse?.name || 'Unassigned Course',
        className: assignedClass?.name || 'Unassigned Class',
        groupName: assignedGroup?.name || 'Unassigned Group',
        createdAt: new Date().toISOString().split('T')[0],
        assignedTo: currentUser.name,
      };
      setLeads([newLead, ...leads]);
      showToast(`New lead created for "${leadForm.name}" marked to ${assignedGroup?.name || 'Group'}.`);
    }

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
      lead.address ? `Address: ${lead.address}` : null,
      lead.locality ? `Locality: ${lead.locality}` : null,
      lead.landmark ? `Landmark: ${lead.landmark}` : null,
      [lead.city, lead.state, lead.pincode].filter(Boolean).join(', '),
    ].filter(Boolean);

    navigator.clipboard.writeText(parts.join('\n'));
    showToast(`Copied address for ${lead.name} to clipboard.`);
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
    assignedBranchIds: [activeBranchId],
    primaryBranchId: activeBranchId,
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
      assignedBranchIds: user.assignedBranchIds || [],
      primaryBranchId: user.primaryBranchId || user.assignedBranchIds?.[0] || activeBranchId,
      status: user.status || 'Active',
    });
    setUserFormErrors({});
    setIsUserModalOpen(true);
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
    if (!userForm.primaryBranchId) {
      errors.primaryBranch = 'A primary branch must be designated.';
    }

    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    if (isEditingUser && selectedUserToEdit) {
      const updated = users.map((u) =>
        u.id === selectedUserToEdit.id ? { ...u, ...userForm } : u
      );
      setUsers(updated);
      showToast(`User "${userForm.name}" updated with primary branch: ${allBranches.find((b) => b.id === userForm.primaryBranchId)?.name}.`);
    } else {
      const newUser = {
        ...userForm,
        id: generateUserId(),
        tenantId: activeTenantId,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
      };
      setUsers([newUser, ...users]);
      showToast(`New user "${userForm.name}" added successfully.`);
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

    const newTenant = {
      ...tenantForm,
      id: tenantForm.id || generateTenantId(),
      createdAt: new Date().toISOString().split('T')[0],
      domain: tenantForm.domain || `${tenantForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.campusconnect.io`,
    };

    setTenants([...tenants, newTenant]);
    setActiveTenantId(newTenant.id);
    showToast(`Tenant "${newTenant.name}" created with Auto-Generated ID: ${newTenant.id}`);
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
              title="Click to switch your active branch"
            >
              <Building2 size={18} color="#2563eb" />
              <div className="branch-active-label">
                <span className="branch-active-org">{activeOrg?.name}</span>
                <span className="branch-active-name">
                  {activeBranch?.name}
                  {isCurrentActivePrimary && (
                    <span className="primary-star-badge" title="Your designated Primary Branch">
                      ★ Primary Branch
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
                  <div>
                    {currentUser?.role === 'super_admin'
                      ? 'Super Admin has global access to all branches.'
                      : `You have access to ${userAllowedBranches.length} branch(es). Primary branch is marked with ★.`}
                  </div>
                </div>

                {userAllowedBranches.map((b) => {
                  const isPrimary = b.id === currentUser?.primaryBranchId;
                  const isActive = b.id === activeBranchId;

                  return (
                    <button
                      key={b.id}
                      className={`dropdown-branch-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => handleSelectBranch(b.id)}
                    >
                      <div>
                        <div className="branch-item-name">
                          {b.name}
                          {isPrimary && (
                            <span className="primary-star-badge">
                              ★ Primary
                            </span>
                          )}
                        </div>
                        <div className="branch-item-city">
                          {b.orgName} • {b.city}
                        </div>
                      </div>
                      {isActive && <CheckCircle2 size={16} color="#2563eb" />}
                    </button>
                  );
                })}
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

      {/* 4. Active Branch vs Primary Branch Banner */}
      <div className="context-banner">
        <div className="context-banner-info">
          <span>
            📍 <strong>Active Branch:</strong> {activeBranch?.name} ({activeOrg?.name})
          </span>
          <span>•</span>
          <span>
            ★ <strong>Your Primary Branch:</strong> {userPrimaryBranch?.name || 'Not set'}
          </span>
          {!isCurrentActivePrimary && (
            <span className="non-primary-alert">
              (You are currently viewing a secondary branch)
            </span>
          )}
        </div>

        {!isCurrentActivePrimary && userPrimaryBranch && (
          <button className="btn-reset-default" onClick={handleResetToPrimaryBranch}>
            <Star size={13} fill="#166534" /> Return to My Primary Branch ({userPrimaryBranch.name})
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

                <button className="btn btn-primary" onClick={handleOpenNewLead}>
                  <Plus size={16} /> Add Student Lead
                </button>
              </div>
            </div>

            {/* Leads Table with Academic Allocation & Mandatory Address Columns */}
            <div className="table-card">
              <div className="table-header-bar">
                <div className="table-title">
                  <Layers size={18} />
                  <span>Student Leads Roster</span>
                  <span className="table-count-badge">{filteredLeads.length} leads</span>
                </div>
                <div className="address-requirement-indicator">
                  <span className="mandatory-dot">•</span> Address: Mandatory (*) | Course, Class & Group Tagging
                </div>
              </div>

              <div className="table-wrapper">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Lead ID</th>
                      <th>Student Info</th>
                      {/* ACADEMIC ALLOCATION: COURSE, CLASS & SECTION / GROUP */}
                      <th style={{ minWidth: 220 }}>
                        Program & Group Allocation
                        <span className="address-header-subtitle">
                          Course → Class / Batch → Section / Group
                        </span>
                      </th>
                      {/* MANDATORY ADDRESS DETAILS */}
                      <th className="address-col-header">
                        Address Details
                        <span className="address-header-subtitle">
                          Mandatory Address*, Locality, Landmark
                        </span>
                      </th>
                      <th>Status</th>
                      <th>Assigned Counselor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="7">
                          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                            <AlertCircle size={36} color="#cbd5e1" style={{ marginBottom: 10 }} />
                            <p>No student leads found matching current branch or filters.</p>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ marginTop: 12 }}
                              onClick={handleOpenNewLead}
                            >
                              <Plus size={14} /> Add First Lead to {activeBranch?.name}
                            </button>
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
                            </td>

                            <td>
                              <div className="student-name">{lead.name}</div>
                              <div className="student-contact">{lead.email}</div>
                              <div className="student-contact">{lead.phone}</div>
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

                            {/* Address Details Column */}
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
                                    Locality: {lead.locality}
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
                            </td>

                            <td>
                              <div style={{ fontSize: '0.825rem', fontWeight: 500 }}>
                                {lead.assignedTo || 'Unassigned'}
                              </div>
                            </td>

                            <td>
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  className="btn-icon"
                                  title="View Full Profile, Allocation & Address"
                                  onClick={() => {
                                    setActiveLead(lead);
                                    setIsDetailOpen(true);
                                  }}
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Edit Lead"
                                  onClick={() => handleOpenEditLead(lead)}
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Copy Full Address"
                                  onClick={() => handleCopyAddress(lead)}
                                >
                                  <Copy size={15} />
                                </button>
                                <button
                                  className="btn-icon"
                                  title="Delete Lead"
                                  onClick={() => handleDeleteLead(lead.id, lead.name)}
                                  style={{ color: '#ef4444' }}
                                >
                                  <Trash2 size={15} />
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
                          <th>Branch Permissions & Primary Branch</th>
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
                                  <span className="primary-label">★ Primary Branch:</span>
                                  <strong>{primaryBranchObj ? primaryBranchObj.name : 'Not Designated'}</strong>
                                </div>

                                <div className="assigned-branches-tags">
                                  <span className="assigned-label">All Accessible Branches:</span>
                                  {u.role === 'super_admin' ? (
                                    <span className="tag-all-branches">All System Branches (Super Admin)</span>
                                  ) : (
                                    u.assignedBranchIds?.map((bId) => {
                                      const bObj = allBranches.find((b) => b.id === bId);
                                      const isPrimary = bId === u.primaryBranchId;

                                      return (
                                        <span
                                          key={bId}
                                          className={`branch-pill-tag ${isPrimary ? 'is-primary-pill' : ''}`}
                                          title={isPrimary ? 'Designated Primary Branch' : 'Accessible Branch'}
                                        >
                                          {isPrimary ? '★ ' : ''}
                                          {bObj ? bObj.name : bId}
                                        </span>
                                      );
                                    })
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

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT LEAD (COURSE, CLASS & GROUP ALLOCATION + MANDATORY ADDRESS) */}
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
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
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
                    Phone Number <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${leadFormErrors.phone ? 'input-error' : ''}`}
                    placeholder="+91 98765 43210"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  />
                  {leadFormErrors.phone && (
                    <span className="error-text">{leadFormErrors.phone}</span>
                  )}
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

              {/* DEDICATED ACADEMIC ALLOCATION: COURSE, CLASS & GROUP */}
              <div className="academic-form-box">
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

              {/* DEDICATED MANDATORY ADDRESS SECTION */}
              <div className="address-form-box">
                <div className="address-section-header">
                  <MapPin size={16} color="#dc2626" />
                  <div>
                    <h4 className="address-section-title">
                      Student Residential Address
                      <span className="address-mandatory-tag">Address is Mandatory</span>
                    </h4>
                    <p className="address-section-desc">
                      Street address is mandatory. Locality, Landmark, and Door No are optional.
                    </p>
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
                    onChange={(e) => setLeadForm({ ...leadForm, address: e.target.value })}
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
                      onChange={(e) => setLeadForm({ ...leadForm, doorNo: e.target.value })}
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
      {/* MODAL 2: LEAD DETAIL DRAWER (WITH FULL ACADEMIC & ADDRESS ALLOCATION) */}
      {/* ======================================================== */}
      {isDetailOpen && activeLead && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <div className="modal-title">
                <UserCheck size={18} color="#2563eb" />
                <span>Student Profile: {activeLead.name}</span>
              </div>
              <button className="btn-close" onClick={() => setIsDetailOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="lead-detail-card">
                <div className="detail-row">
                  <span className="detail-label">Lead ID:</span>
                  <strong>{activeLead.id}</strong>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span>{activeLead.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span>{activeLead.phone}</span>
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

              {/* Full Address Breakdown */}
              <div className="lead-detail-address-box">
                <div className="address-detail-title">
                  <MapPin size={16} color="#dc2626" />
                  <strong>Residential Address Details</strong>
                </div>

                <div className="detail-address-line">
                  <span className="address-key">Mandatory Address:</span>
                  <span className="address-val-bold">{activeLead.address || 'Not Provided'}</span>
                </div>

                {activeLead.locality && (
                  <div className="detail-address-line">
                    <span className="address-key">Locality / Area:</span>
                    <span className="address-val">{activeLead.locality}</span>
                  </div>
                )}

                {activeLead.landmark && (
                  <div className="detail-address-line">
                    <span className="address-key">Landmark:</span>
                    <span className="address-val">📍 {activeLead.landmark}</span>
                  </div>
                )}

                {activeLead.doorNo && (
                  <div className="detail-address-line">
                    <span className="address-key">Door / Flat No:</span>
                    <span className="address-val">{activeLead.doorNo}</span>
                  </div>
                )}

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

              {activeLead.notes && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Remarks:</div>
                  <p style={{ fontSize: '0.875rem', marginTop: 4 }}>{activeLead.notes}</p>
                </div>
              )}
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

              {/* Multi-Branch Assignment with Primary Branch */}
              <div className="user-branch-assignment-box">
                <div className="branch-assignment-title">
                  <Building2 size={16} color="#2563eb" />
                  <div>
                    <h4>Multi-Branch Access & Primary Branch Designation</h4>
                    <p>
                      Assign branches to this user. Mark which one is their <strong>Primary Branch</strong> (they default to it on login).
                    </p>
                  </div>
                </div>

                <div className="branch-selection-table">
                  <div className="branch-selection-header">
                    <span>Assign Branch</span>
                    <span>Designate as Primary Branch (★)</span>
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
                            <div className="branch-row-name">{b.name}</div>
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
                              {isPrimary ? '★ Primary Branch' : 'Set as Primary'}
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
    </div>
  );
}
