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
  ShieldAlert
} from 'lucide-react';
import {
  FIXED_TENANT,
  INITIAL_ORGANIZATIONS,
  INITIAL_CLASSES,
  INITIAL_LEADS,
  STATUS_LIST,
} from './mockData';
import './App.css';

export default function App() {
  // 1. Persistent State for Multi-Tenant SaaS
  const [organizations, setOrganizations] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_organizations');
      return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
    } catch {
      return INITIAL_ORGANIZATIONS;
    }
  });

  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_classes');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_saas_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cc_saas_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('cc_saas_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('cc_saas_leads', JSON.stringify(leads));
  }, [leads]);

  // 2. Active Branch & Org Selection (Top Dropdown)
  // By default, the active branch is the designated DEFAULT branch of the first organization.
  const [activeOrgId, setActiveOrgId] = useState(organizations[0]?.id || 'org-101');
  const activeOrg = useMemo(() => {
    return organizations.find(o => o.id === activeOrgId) || organizations[0];
  }, [organizations, activeOrgId]);

  // Active Branch: defaults to the organization's defaultBranchId, but user can switch it.
  const [activeBranchId, setActiveBranchId] = useState(() => {
    return organizations[0]?.defaultBranchId || organizations[0]?.branches[0]?.id || 'branch-1';
  });

  const activeBranch = useMemo(() => {
    for (const org of organizations) {
      const found = org.branches.find(b => b.id === activeBranchId);
      if (found) return found;
    }
    return activeOrg?.branches[0] || null;
  }, [organizations, activeBranchId, activeOrg]);

  // Find the permanent DEFAULT branch for the active organization
  const defaultBranch = useMemo(() => {
    if (!activeOrg) return null;
    return activeOrg.branches.find(b => b.id === activeOrg.defaultBranchId) || activeOrg.branches[0];
  }, [activeOrg]);

  // Is the currently active branch the default branch?
  const isCurrentlyDefault = activeBranch?.id === activeOrg?.defaultBranchId;

  // Dropdown open state
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBranchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler to switch active branch (Default branch NEVER changes)
  const handleSelectBranch = (orgId, branchId) => {
    setActiveOrgId(orgId);
    setActiveBranchId(branchId);
    setIsBranchDropdownOpen(false);
    showToast(`Switched active branch to "${organizations.find(o => o.id === orgId)?.branches.find(b => b.id === branchId)?.name}". (Default branch remains unchanged)`);
  };

  // Handler to quickly reset back to the default branch
  const handleResetToDefaultBranch = () => {
    if (activeOrg && activeOrg.defaultBranchId) {
      setActiveBranchId(activeOrg.defaultBranchId);
      showToast(`Active branch restored to Default: ${defaultBranch?.name}`);
    }
  };

  // 3. Navigation Tabs
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'classes' | 'organizations'

  // 4. Toast notifications
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 5. Leads Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [filterByBranch, setFilterByBranch] = useState(true); // Filter leads to active branch or all

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Branch filter check
      if (filterByBranch && lead.branchId && lead.branchId !== activeBranchId) {
        return false;
      }

      // Search matches
      const matchesSearch =
        searchQuery === '' ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.landmark?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.doorNo?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All Statuses' || lead.status === statusFilter;
      const matchesClass = classFilter === 'All Classes' || lead.classId === classFilter || lead.course === classFilter;

      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [leads, searchQuery, statusFilter, classFilter, filterByBranch, activeBranchId]);

  // Lead Modal States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeLead, setActiveLead] = useState(null);
  const [isEditingLead, setIsEditingLead] = useState(false);

  // Lead Form State
  const emptyLeadForm = {
    name: '',
    email: '',
    phone: '',
    classId: '',
    course: '',
    status: 'Inquiry',
    priority: 'Medium',
    // Address fields
    address: '',  // Mandatory
    doorNo: '',   // Optional
    area: '',     // Optional
    landmark: '', // Optional
    city: '',
    state: '',
    pincode: '',
    notes: '',
  };
  const [leadFormData, setLeadFormData] = useState(emptyLeadForm);
  const [leadErrors, setLeadErrors] = useState({});

  // 6. Customizable Class Modal States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isEditingClass, setIsEditingClass] = useState(false);

  // Class Form State with dynamic custom fields
  const emptyClassForm = {
    name: '',
    code: '',
    department: 'General Academics',
    academicYear: '2026-2027',
    capacity: 50,
    classTeacher: '',
    orgId: activeOrgId,
    branchId: activeBranchId,
    customFields: [
      { key: 'Shift Timing', value: 'Morning (08:30 AM - 02:30 PM)' },
      { key: 'Lab / Room No.', value: 'Wing A - Room 101' },
    ],
  };
  const [classFormData, setClassFormData] = useState(emptyClassForm);
  const [classErrors, setClassErrors] = useState({});

  // 7. Organization & Branch Modal States
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [orgFormData, setOrgFormData] = useState({ name: '', code: '', type: 'Higher Education / College' });
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [targetOrgIdForBranch, setTargetOrgIdForBranch] = useState(activeOrgId);
  const [branchFormData, setBranchFormData] = useState({ name: '', code: '', city: '', address: '' });

  // Add/Remove custom field handlers in Class Form
  const handleAddCustomField = () => {
    setClassFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, { key: '', value: '' }],
    }));
  };

  const handleUpdateCustomField = (index, field, val) => {
    setClassFormData(prev => {
      const updated = [...prev.customFields];
      updated[index][field] = val;
      return { ...prev, customFields: updated };
    });
  };

  const handleRemoveCustomField = (index) => {
    setClassFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  // Open Create Class Modal
  const handleOpenCreateClass = () => {
    setClassFormData({
      ...emptyClassForm,
      orgId: activeOrgId,
      branchId: activeBranchId,
    });
    setClassErrors({});
    setIsEditingClass(false);
    setIsClassModalOpen(true);
  };

  // Submit Create / Edit Class
  const handleSubmitClass = (e) => {
    e.preventDefault();
    const errs = {};
    if (!classFormData.name.trim()) errs.name = 'Class name is required';
    if (!classFormData.code.trim()) errs.code = 'Class code is required';

    if (Object.keys(errs).length > 0) {
      setClassErrors(errs);
      return;
    }

    // Filter out blank custom fields
    const cleanedCustomFields = classFormData.customFields.filter(f => f.key.trim() !== '');

    if (isEditingClass) {
      setClasses(prev =>
        prev.map(c => (c.id === classFormData.id ? { ...classFormData, customFields: cleanedCustomFields } : c))
      );
      showToast(`Class "${classFormData.name}" updated successfully.`);
    } else {
      const newClass = {
        ...classFormData,
        id: `cls-${Date.now().toString().slice(-4)}`,
        customFields: cleanedCustomFields,
        enrolledCount: 0,
      };
      setClasses(prev => [newClass, ...prev]);
      showToast(`Customized Class "${newClass.name}" created for ${activeBranch?.name}!`);
    }

    setIsClassModalOpen(false);
  };

  // Delete Class
  const handleDeleteClass = (id, name) => {
    if (window.confirm(`Are you sure you want to delete class "${name}"?`)) {
      setClasses(prev => prev.filter(c => c.id !== id));
      showToast(`Class "${name}" removed.`);
    }
  };

  // Submit Create Organization
  const handleSubmitOrg = (e) => {
    e.preventDefault();
    if (!orgFormData.name.trim()) return;

    const newOrgId = `org-${Date.now().toString().slice(-4)}`;
    const newBranchId = `branch-${Date.now().toString().slice(-4)}`;

    const newOrg = {
      id: newOrgId,
      name: orgFormData.name,
      code: orgFormData.code || orgFormData.name.substring(0, 3).toUpperCase(),
      type: orgFormData.type,
      defaultBranchId: newBranchId, // First branch is default
      branches: [
        {
          id: newBranchId,
          name: "Main Campus",
          code: "MAIN",
          isDefault: true,
          city: "Headquarters",
          address: "Main Campus Road",
        },
      ],
    };

    setOrganizations(prev => [...prev, newOrg]);
    setActiveOrgId(newOrgId);
    setActiveBranchId(newBranchId);
    setIsOrgModalOpen(false);
    showToast(`Organization "${newOrg.name}" created with default "Main Campus" branch.`);
  };

  // Submit Add Branch to an Organization
  const handleSubmitBranch = (e) => {
    e.preventDefault();
    if (!branchFormData.name.trim()) return;

    const newBranchId = `branch-${Date.now().toString().slice(-4)}`;
    const newBranch = {
      id: newBranchId,
      name: branchFormData.name,
      code: branchFormData.code || branchFormData.name.substring(0, 3).toUpperCase(),
      isDefault: false, // New branches are non-default (default never changes)
      city: branchFormData.city || "Branch City",
      address: branchFormData.address || "Branch Address",
    };

    setOrganizations(prev =>
      prev.map(org => {
        if (org.id === targetOrgIdForBranch) {
          return {
            ...org,
            branches: [...org.branches, newBranch],
          };
        }
        return org;
      })
    );

    setIsBranchModalOpen(false);
    showToast(`New branch "${newBranch.name}" assigned to organization.`);
  };

  // Open Lead Modal
  const handleOpenNewLead = () => {
    const defaultClass = classes.find(c => c.branchId === activeBranchId) || classes[0];
    setLeadFormData({
      ...emptyLeadForm,
      classId: defaultClass ? defaultClass.id : '',
      course: defaultClass ? defaultClass.name : 'General Admission',
    });
    setLeadErrors({});
    setIsEditingLead(false);
    setIsLeadModalOpen(true);
  };

  const handleOpenEditLead = (lead) => {
    setLeadFormData({ ...lead });
    setLeadErrors({});
    setIsEditingLead(true);
    setIsLeadModalOpen(true);
  };

  // Lead Form Validation (Mandatory Address, Optional D.No, Area, Landmark)
  const validateLeadForm = () => {
    const errs = {};
    if (!leadFormData.name.trim()) errs.name = 'Full name is required';
    if (!leadFormData.phone.trim()) errs.phone = 'Phone number is required';
    if (!leadFormData.email.trim()) errs.email = 'Email is required';

    // Address mandatory validation
    if (!leadFormData.address.trim()) {
      errs.address = 'Address is mandatory';
    }

    setLeadErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitLead = (e) => {
    e.preventDefault();
    if (!validateLeadForm()) return;

    const matchedClass = classes.find(c => c.id === leadFormData.classId);

    if (isEditingLead) {
      setLeads(prev =>
        prev.map(l =>
          l.id === leadFormData.id
            ? {
                ...leadFormData,
                course: matchedClass ? matchedClass.name : leadFormData.course,
              }
            : l
        )
      );
      showToast('Lead information updated successfully!');
    } else {
      const newLead = {
        ...leadFormData,
        id: `CC-${Math.floor(1000 + Math.random() * 9000)}`,
        orgId: activeOrgId,
        branchId: activeBranchId,
        campus: activeBranch?.name || 'Active Campus',
        course: matchedClass ? matchedClass.name : (leadFormData.course || 'General Admission'),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeads(prev => [newLead, ...prev]);
      showToast(`Student registered under ${activeBranch?.name}!`);
    }

    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = (id, name) => {
    if (window.confirm(`Are you sure you want to delete lead: "${name}"?`)) {
      setLeads(prev => prev.filter(l => l.id !== id));
      showToast(`Lead "${name}" removed.`);
      if (activeLead?.id === id) setIsDetailOpen(false);
    }
  };

  // Copy full address
  const copyFormattedAddress = (lead) => {
    const parts = [];
    if (lead.doorNo) parts.push(lead.doorNo);
    if (lead.address) parts.push(lead.address);
    if (lead.area) parts.push(lead.area);
    if (lead.landmark) parts.push(`(Landmark: ${lead.landmark})`);
    if (lead.city) parts.push(lead.city);
    if (lead.state) parts.push(lead.state);
    if (lead.pincode) parts.push(lead.pincode);

    navigator.clipboard.writeText(parts.join(', '));
    showToast('Full address copied to clipboard!');
  };

  // Available classes for active branch
  const activeBranchClasses = useMemo(() => {
    return classes.filter(c => c.branchId === activeBranchId);
  }, [classes, activeBranchId]);

  return (
    <div className="app-container">
      {/* 1. Fixed Tenant System Bar */}
      <div className="tenant-bar">
        <div className="tenant-left">
          <span className="tenant-tag">
            <School size={13} />
            Tenant: {FIXED_TENANT.name}
          </span>
          <span className="tenant-fixed-notice">
            🔒 Fixed User Tenant Context: {FIXED_TENANT.fixedUser}
          </span>
        </div>
        <div className="tenant-right">
          <span>SaaS Tier: <strong>{FIXED_TENANT.tier}</strong></span>
          <span>Tenant ID: <code>{FIXED_TENANT.id}</code></span>
        </div>
      </div>

      {/* 2. Top Header with Active Branch Dropdown */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="brand-title">
                Campus Connect SaaS
                <span className="brand-badge">Multi-Org CRM</span>
              </div>
              <div className="brand-subtitle">
                {activeOrg?.name}
              </div>
            </div>
          </div>

          {/* Active Branch Dropdown Selector (Top Header Requirement) */}
          <div className="branch-selector-wrapper" ref={dropdownRef}>
            <button
              className="branch-selector-btn"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              title="Click to select active branch"
            >
              <Building2 size={18} color="#2563eb" />
              <div className="branch-active-label">
                <span className="branch-active-org">{activeOrg?.name}</span>
                <span className="branch-active-name">
                  {activeBranch?.name}
                  {isCurrentlyDefault ? (
                    <span className="default-star-badge" title="Default branch of this organization">
                      ★ Default Branch
                    </span>
                  ) : (
                    <span className="non-default-badge">
                      Active
                    </span>
                  )}
                </span>
              </div>
              <ChevronDown size={16} color="#64748b" />
            </button>

            {/* Dropdown Popup */}
            {isBranchDropdownOpen && (
              <div className="branch-dropdown-menu">
                <div className="dropdown-header-note">
                  <div><strong>Select Active Branch:</strong></div>
                  <div>Default branch (★) never changes, but you can switch the active branch anytime.</div>
                </div>

                {organizations.map((org) => (
                  <div key={org.id} className="dropdown-org-group">
                    <div className="dropdown-org-title">
                      <School size={13} />
                      <span>{org.name}</span>
                    </div>

                    {org.branches.map((b) => {
                      const isDefault = b.id === org.defaultBranchId;
                      const isActive = b.id === activeBranchId;

                      return (
                        <button
                          key={b.id}
                          className={`dropdown-branch-item ${isActive ? 'is-active' : ''}`}
                          onClick={() => handleSelectBranch(org.id, b.id)}
                        >
                          <div>
                            <div className="branch-item-name">
                              {b.name}
                              {isDefault && (
                                <span className="default-star-badge">
                                  ★ Default
                                </span>
                              )}
                            </div>
                            <div className="branch-item-city">
                              {b.city} • {b.address}
                            </div>
                          </div>
                          {isActive && <CheckCircle2 size={16} color="#2563eb" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Actions */}
          <div className="header-actions">
            {activeTab === 'leads' && (
              <button className="btn btn-primary" onClick={handleOpenNewLead}>
                <Plus size={16} /> Add Student Lead
              </button>
            )}
            {activeTab === 'classes' && (
              <button className="btn btn-primary" onClick={handleOpenCreateClass}>
                <Plus size={16} /> Create Customizable Class
              </button>
            )}
            {activeTab === 'organizations' && (
              <button className="btn btn-primary" onClick={() => setIsOrgModalOpen(true)}>
                <Plus size={16} /> Add New Organization
              </button>
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

          <button
            className={`nav-tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            <BookOpen size={16} />
            <span>Customizable Classes & Batches</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'organizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('organizations')}
          >
            <Building2 size={16} />
            <span>Organizations & Branches</span>
          </button>
        </div>
      </nav>

      {/* 4. Active vs Default Branch Context Banner */}
      <div className="context-banner">
        <div className="context-banner-info">
          <span>
            📍 <strong>Active Branch:</strong> {activeBranch?.name} ({activeOrg?.name})
          </span>
          <span>•</span>
          <span>
            ★ <strong>Default Branch:</strong> {defaultBranch?.name} <em>(Fixed - never changes)</em>
          </span>
        </div>

        {!isCurrentlyDefault && (
          <button className="btn-reset-default" onClick={handleResetToDefaultBranch}>
            <Star size={12} fill="#166534" /> Switch back to Default Branch
          </button>
        )}
      </div>

      {/* 5. Main Content Area */}
      <main className="main-content">
        {/* TAB 1: ADMISSIONS & LEADS */}
        {activeTab === 'leads' && (
          <>
            {/* KPI Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-info">
                  <h4>Branch Leads</h4>
                  <div className="metric-value">{filteredLeads.length}</div>
                </div>
                <div className="metric-icon-wrap metric-blue">
                  <Users size={22} />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-info">
                  <h4>Branch Classes</h4>
                  <div className="metric-value">{activeBranchClasses.length}</div>
                </div>
                <div className="metric-icon-wrap metric-purple">
                  <BookOpen size={22} />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-info">
                  <h4>Applications</h4>
                  <div className="metric-value">
                    {filteredLeads.filter(l => l.status === 'Applied').length}
                  </div>
                </div>
                <div className="metric-icon-wrap metric-amber">
                  <FileText size={22} />
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-info">
                  <h4>Enrolled</h4>
                  <div className="metric-value">
                    {filteredLeads.filter(l => l.status === 'Enrolled').length}
                  </div>
                </div>
                <div className="metric-icon-wrap metric-emerald">
                  <UserCheck size={22} />
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
                  placeholder="Search name, phone, email, address, area, or landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters-group">
                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filterByBranch}
                    onChange={(e) => setFilterByBranch(e.target.checked)}
                  />
                  <span>Show only active branch ({activeBranch?.name})</span>
                </label>

                <select
                  className="select-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_LIST.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                <select
                  className="select-filter"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="All Classes">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leads Table with Address Columns */}
            <div className="table-card">
              <div className="table-header-bar">
                <div className="table-title">
                  <Layers size={18} />
                  <span>Student Leads Roster</span>
                  <span className="table-count-badge">{filteredLeads.length} students</span>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Lead ID</th>
                      <th>Student Info</th>
                      <th>Class & Program</th>
                      {/* Address Column Header with Field Specifications */}
                      <th className="address-col-header">
                        Address
                        <span className="address-header-subtitle">
                          Address*, D.No, Area, Landmark
                        </span>
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="6">
                          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                            <AlertCircle size={36} color="#cbd5e1" style={{ marginBottom: 10 }} />
                            <p>No student leads found for this branch or filter criteria.</p>
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
                        const matchedClass = classes.find(c => c.id === lead.classId);

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

                            <td>
                              <div className="course-badge">
                                {matchedClass ? matchedClass.name : lead.course}
                              </div>
                              {matchedClass && (
                                <div className="class-assignment-pill">
                                  Class: <strong>{matchedClass.code}</strong>
                                </div>
                              )}
                            </td>

                            {/* Address Column: Mandatory Address, Optional D.No, Area, Landmark */}
                            <td className="address-cell">
                              <div className="address-main">
                                <MapPin size={13} color="#dc2626" style={{ flexShrink: 0 }} />
                                <span>
                                  {lead.address} <span className="mandatory-star" title="Mandatory Field">*</span>
                                </span>
                              </div>

                              <div className="address-sub-details">
                                {lead.doorNo && (
                                  <span className="tag-dno" title="Door / Flat Number (Optional)">
                                    {lead.doorNo}
                                  </span>
                                )}
                                {lead.area && (
                                  <span className="tag-area" title="Area / Locality (Optional)">
                                    {lead.area}
                                  </span>
                                )}
                                {lead.landmark && (
                                  <span className="tag-landmark" title="Landmark (Optional)">
                                    📍 {lead.landmark}
                                  </span>
                                )}
                              </div>

                              {(lead.city || lead.state) && (
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
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  className="btn-icon"
                                  title="View Profile & Address"
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

        {/* TAB 2: CUSTOMIZABLE CLASSES & BATCHES */}
        {activeTab === 'classes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Customizable Classes for {activeBranch?.name}
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Create classes with customizable attributes, shift timings, lab allocations, and capacities.
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleOpenCreateClass}>
                <Plus size={16} /> Create Customizable Class
              </button>
            </div>

            <div className="classes-grid">
              {activeBranchClasses.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <BookOpen size={42} color="#cbd5e1" style={{ marginBottom: 12 }} />
                  <h3>No classes created for {activeBranch?.name} yet</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4 }}>
                    Every branch in your tenant can have its own customized classes.
                  </p>
                  <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleOpenCreateClass}>
                    <Plus size={16} /> Create First Class Now
                  </button>
                </div>
              ) : (
                activeBranchClasses.map((cls) => (
                  <div key={cls.id} className="class-card">
                    <div>
                      <div className="class-card-header">
                        <div>
                          <div className="class-name">{cls.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cls.department}</div>
                        </div>
                        <span className="class-code">{cls.code}</span>
                      </div>

                      <div className="class-meta-grid">
                        <div className="class-meta-item">
                          <strong>Academic Year</strong>
                          <span>{cls.academicYear}</span>
                        </div>
                        <div className="class-meta-item">
                          <strong>Max Capacity</strong>
                          <span>{cls.enrolledCount || 0} / {cls.capacity} Seats</span>
                        </div>
                        <div className="class-meta-item" style={{ gridColumn: 'span 2' }}>
                          <strong>Faculty / Class Head</strong>
                          <span>{cls.classTeacher || 'Assigned Coordinator'}</span>
                        </div>
                      </div>

                      {/* Customizable Dynamic Attributes */}
                      {cls.customFields && cls.customFields.length > 0 && (
                        <div className="class-custom-box">
                          <div className="custom-box-title">
                            <Sparkles size={13} color="#ea580c" />
                            <span>Customizable Class Attributes</span>
                          </div>
                          <div className="custom-tags-wrap">
                            {cls.customFields.map((cf, idx) => (
                              <div key={idx} className="custom-attr-pill">
                                <span className="custom-attr-key">{cf.key}: </span>
                                <span className="custom-attr-val">{cf.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setClassFormData({ ...cls });
                          setClassErrors({});
                          setIsEditingClass(true);
                          setIsClassModalOpen(true);
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444' }}
                        onClick={() => handleDeleteClass(cls.id, cls.name)}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ORGANIZATIONS & BRANCHES (SAAS MULTI-TENANT ARCHITECTURE) */}
        {activeTab === 'organizations' && (
          <div className="org-management-grid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Organizations & Branches ({FIXED_TENANT.name})
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
                  Manage multiple organizations under your single fixed tenant. Each organization has assigned branches and one designated default branch.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setIsOrgModalOpen(true)}>
                <Plus size={16} /> Create Organization
              </button>
            </div>

            {organizations.map((org) => (
              <div key={org.id} className="org-card">
                <div className="org-card-header">
                  <div className="org-info-block">
                    <h3>
                      <Building2 size={20} color="#2563eb" />
                      <span>{org.name}</span>
                      <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: 4 }}>
                        {org.code}
                      </span>
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                      {org.type} • {org.branches.length} Assigned Branches
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setTargetOrgIdForBranch(org.id);
                      setBranchFormData({ name: '', code: '', city: '', address: '' });
                      setIsBranchModalOpen(true);
                    }}
                  >
                    <Plus size={14} /> Assign New Branch
                  </button>
                </div>

                <div>
                  <strong style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>
                    Assigned Branches:
                  </strong>

                  <div className="branch-chips-grid">
                    {org.branches.map((b) => {
                      const isDefault = b.id === org.defaultBranchId;
                      const isActive = b.id === activeBranchId;

                      return (
                        <div
                          key={b.id}
                          className={`branch-chip ${isDefault ? 'is-default-branch' : ''}`}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <strong style={{ fontSize: '0.95rem' }}>{b.name}</strong>
                              {isDefault ? (
                                <span className="default-star-badge">
                                  ★ Default Branch
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.675rem', color: '#64748b' }}>
                                  Branch
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: 4 }}>
                              📍 {b.city} • {b.address}
                            </div>
                          </div>

                          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                              Code: <code>{b.code}</code>
                            </span>

                            {isActive ? (
                              <span style={{ fontSize: '0.725rem', color: '#2563eb', fontWeight: 700 }}>
                                ✓ Currently Active
                              </span>
                            ) : (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleSelectBranch(org.id, b.id)}
                              >
                                Set as Active
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL 1: CREATE / EDIT CUSTOMIZABLE CLASS */}
      {isClassModalOpen && (
        <div className="modal-overlay" onClick={() => setIsClassModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Sparkles size={20} color="#ea580c" />
                <span>{isEditingClass ? 'Edit Class' : 'Create Customizable Class'}</span>
              </h3>
              <button className="btn-icon" onClick={() => setIsClassModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitClass}>
              <div className="modal-body">
                <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#1e40af' }}>
                  Assigning to Active Branch: <strong>{activeBranch?.name}</strong> ({activeOrg?.name})
                </div>

                {/* Standard Class Info */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>Class Core Details</span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Class / Batch Name <span className="badge-req">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${classErrors.name ? 'input-error' : ''}`}
                        placeholder="e.g. Grade 10-A or B.Tech AI 2026"
                        value={classFormData.name}
                        onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                      />
                      {classErrors.name && <span className="error-text">{classErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Class Code <span className="badge-req">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${classErrors.code ? 'input-error' : ''}`}
                        placeholder="e.g. CSE-101 or G10-A"
                        value={classFormData.code}
                        onChange={(e) => setClassFormData({ ...classFormData, code: e.target.value })}
                      />
                      {classErrors.code && <span className="error-text">{classErrors.code}</span>}
                    </div>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">Department / Wing</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Engineering / High School"
                        value={classFormData.department}
                        onChange={(e) => setClassFormData({ ...classFormData, department: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Academic Year</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 2026-2027"
                        value={classFormData.academicYear}
                        onChange={(e) => setClassFormData({ ...classFormData, academicYear: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Max Student Capacity</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 60"
                        value={classFormData.capacity}
                        onChange={(e) => setClassFormData({ ...classFormData, capacity: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Teacher / Coordinator</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. A. Sharma"
                      value={classFormData.classTeacher}
                      onChange={(e) => setClassFormData({ ...classFormData, classTeacher: e.target.value })}
                    />
                  </div>
                </div>

                {/* Customizable Attributes Builder */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>✨ Customizable Attributes & Dynamic Fields</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddCustomField}
                    >
                      <Plus size={13} /> Add Custom Field
                    </button>
                  </div>

                  <p className="section-hint">
                    Add custom parameters unique to your institution (e.g. Shift Timing, Lab Room, Specialization, Scholarship Seats).
                  </p>

                  <div className="custom-fields-editor">
                    {classFormData.customFields.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '16px', color: '#78716c', fontSize: '0.8rem' }}>
                        No custom fields added yet. Click "+ Add Custom Field" above.
                      </div>
                    ) : (
                      classFormData.customFields.map((cf, idx) => (
                        <div key={idx} className="custom-field-row">
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Field Name (e.g. Shift Timing)"
                            value={cf.key}
                            onChange={(e) => handleUpdateCustomField(idx, 'key', e.target.value)}
                          />
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Field Value (e.g. 09:00 AM - 01:00 PM)"
                            value={cf.value}
                            onChange={(e) => handleUpdateCustomField(idx, 'value', e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn-icon"
                            style={{ color: '#ef4444' }}
                            onClick={() => handleRemoveCustomField(idx)}
                            title="Remove field"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsClassModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingClass ? 'Save Class Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT STUDENT LEAD (WITH MANDATORY ADDRESS & OPTIONAL D.NO, AREA, LANDMARK) */}
      {isLeadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLeadModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Plus size={18} />
                <span>{isEditingLead ? 'Edit Student Lead' : 'Register New Student Lead'}</span>
              </h3>
              <button className="btn-icon" onClick={() => setIsLeadModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitLead}>
              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#475569' }}>
                  Registering under Branch: <strong>{activeBranch?.name}</strong> ({activeOrg?.name})
                </div>

                {/* Personal Information */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>👤 Personal Information</span>
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label">
                        Full Name <span className="badge-req">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${leadErrors.name ? 'input-error' : ''}`}
                        placeholder="e.g. Rahul Verma"
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                      />
                      {leadErrors.name && <span className="error-text">{leadErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email Address <span className="badge-req">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-input ${leadErrors.email ? 'input-error' : ''}`}
                        placeholder="e.g. rahul@example.com"
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                      />
                      {leadErrors.email && <span className="error-text">{leadErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Phone Number <span className="badge-req">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-input ${leadErrors.phone ? 'input-error' : ''}`}
                        placeholder="e.g. +91 98765 43210"
                        value={leadFormData.phone}
                        onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                      />
                      {leadErrors.phone && <span className="error-text">{leadErrors.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* ADDRESS SECTION (Mandatory Address, Optional D.No, Area, Landmark) */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>📍 Address Information</span>
                    <span className="section-hint">Address is mandatory; D.No., Area, Landmark are optional</span>
                  </div>

                  <div className="address-highlight-box">
                    {/* Mandatory Address Field */}
                    <div className="form-group">
                      <label className="form-label">
                        Street Address / Location <span className="badge-req">* (Mandatory)</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${leadErrors.address ? 'input-error' : ''}`}
                        placeholder="e.g. 14/B, 3rd Cross, 5th Block"
                        value={leadFormData.address}
                        onChange={(e) => setLeadFormData({ ...leadFormData, address: e.target.value })}
                      />
                      {leadErrors.address && <span className="error-text">{leadErrors.address}</span>}
                    </div>

                    {/* Optional Address Fields */}
                    <div className="form-grid-3">
                      <div className="form-group">
                        <label className="form-label">
                          D.No. (Door / Flat No.) <span className="badge-opt">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. D.No. 402, Flat 3B"
                          value={leadFormData.doorNo}
                          onChange={(e) => setLeadFormData({ ...leadFormData, doorNo: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Area / Locality <span className="badge-opt">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Koramangala"
                          value={leadFormData.area}
                          onChange={(e) => setLeadFormData({ ...leadFormData, area: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Landmark <span className="badge-opt">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Opp. Forum Mall"
                          value={leadFormData.landmark}
                          onChange={(e) => setLeadFormData({ ...leadFormData, landmark: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-3">
                      <div className="form-group">
                        <label className="form-label">City <span className="badge-opt">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Bangalore"
                          value={leadFormData.city}
                          onChange={(e) => setLeadFormData({ ...leadFormData, city: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">State <span className="badge-opt">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Karnataka"
                          value={leadFormData.state}
                          onChange={(e) => setLeadFormData({ ...leadFormData, state: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pincode <span className="badge-opt">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 560034"
                          value={leadFormData.pincode}
                          onChange={(e) => setLeadFormData({ ...leadFormData, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class Assignment & Admission Stage */}
                <div className="form-section">
                  <div className="form-section-title">
                    <span>🎓 Class Assignment & Stage</span>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Assign to Class</label>
                      <select
                        className="form-select"
                        value={leadFormData.classId}
                        onChange={(e) => setLeadFormData({ ...leadFormData, classId: e.target.value })}
                      >
                        <option value="">-- Select Class --</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} ({cls.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Admission Stage</label>
                      <select
                        className="form-select"
                        value={leadFormData.status}
                        onChange={(e) => setLeadFormData({ ...leadFormData, status: e.target.value })}
                      >
                        {STATUS_LIST.filter(s => s !== 'All Statuses').map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsLeadModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingLead ? 'Save Changes' : 'Register Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW ORGANIZATION IN SINGLE TENANT */}
      {isOrgModalOpen && (
        <div className="modal-overlay" onClick={() => setIsOrgModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Building2 size={20} color="#2563eb" />
                <span>Create Organization in Tenant</span>
              </h3>
              <button className="btn-icon" onClick={() => setIsOrgModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitOrg}>
              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#64748b' }}>
                  Creating under Tenant: <strong>{FIXED_TENANT.name}</strong> (SaaS Model)
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Organization Name <span className="badge-req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cambridge School of Architecture"
                    value={orgFormData.name}
                    onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Org Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CSA"
                      value={orgFormData.code}
                      onChange={(e) => setOrgFormData({ ...orgFormData, code: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Institution Type</label>
                    <select
                      className="form-select"
                      value={orgFormData.type}
                      onChange={(e) => setOrgFormData({ ...orgFormData, type: e.target.value })}
                    >
                      <option value="Higher Education / University">Higher Education / University</option>
                      <option value="K-12 & Pre-University">K-12 & Pre-University</option>
                      <option value="Vocational & Tech Academy">Vocational & Tech Academy</option>
                      <option value="Corporate Training Institute">Corporate Training Institute</option>
                    </select>
                  </div>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  * A default "Main Campus" branch will be created automatically. The default branch never changes unless updated in org settings.
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsOrgModalOpen(false)}>
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

      {/* MODAL 4: ASSIGN NEW BRANCH TO AN ORGANIZATION */}
      {isBranchModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBranchModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Building2 size={20} color="#2563eb" />
                <span>Assign New Branch to Organization</span>
              </h3>
              <button className="btn-icon" onClick={() => setIsBranchModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBranch}>
              <div className="modal-body">
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem', color: '#64748b' }}>
                  Organization: <strong>{organizations.find(o => o.id === targetOrgIdForBranch)?.name}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Branch Name <span className="badge-req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. East Valley Campus"
                    value={branchFormData.name}
                    onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Branch Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. EVC"
                      value={branchFormData.code}
                      onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Pune"
                      value={branchFormData.city}
                      onChange={(e) => setBranchFormData({ ...branchFormData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tech Park Boulevard, Sector 5"
                    value={branchFormData.address}
                    onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsBranchModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: VIEW STUDENT PROFILE & ADDRESS BREAKDOWN */}
      {isDetailOpen && activeLead && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <GraduationCap size={20} color="#2563eb" />
                <span>Student Profile: {activeLead.name}</span>
              </h3>
              <button className="btn-icon" onClick={() => setIsDetailOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{activeLead.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    ID: <strong>{activeLead.id}</strong> • Campus: {activeLead.campus || activeBranch?.name}
                  </div>
                </div>
                <span className={`status-badge status-${activeLead.status?.toLowerCase()}`}>
                  <span className="status-dot"></span>
                  {activeLead.status}
                </span>
              </div>

              {/* Detailed Address Card */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 14, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: '0.8rem', color: '#166534', textTransform: 'uppercase' }}>
                    📍 Complete Address Breakdown
                  </strong>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ background: '#fff' }}
                    onClick={() => copyFormattedAddress(activeLead)}
                  >
                    <Copy size={13} /> Copy Address
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.85rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>ADDRESS (MANDATORY):</span>
                    <strong style={{ color: '#0f172a' }}>{activeLead.address}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>D.NO. (OPTIONAL):</span>
                    <span>{activeLead.doorNo || '— Not provided —'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>AREA (OPTIONAL):</span>
                    <span>{activeLead.area || '— Not provided —'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>LANDMARK (OPTIONAL):</span>
                    <span>{activeLead.landmark ? `📍 ${activeLead.landmark}` : '— Not provided —'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>CITY & STATE:</span>
                    <span>{[activeLead.city, activeLead.state, activeLead.pincode].filter(Boolean).join(', ') || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsDetailOpen(false);
                  handleOpenEditLead(activeLead);
                }}
              >
                <Edit2 size={14} /> Edit Lead
              </button>
              <button className="btn btn-primary" onClick={() => setIsDetailOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-bar">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
