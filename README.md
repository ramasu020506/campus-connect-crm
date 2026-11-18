# Campus Connect CRM - Multi-Tenant SaaS Educational Platform

Campus Connect CRM is a modern, responsive Single Page Application (SPA) designed for multi-tenant educational institutions, university systems, and multi-campus academies. It streamlines admissions, lead management, role-based user access, multi-branch operations, and dynamic academic hierarchy allocations.

---

## 🌟 Key Features

### 1. Multi-Tenant Architecture with Auto-Generated Tenant IDs
- **Multi-Tenant Context:** Each institution operates in an isolated tenant environment with its own users, organizations, courses, batches, and leads.
- **Auto-Generated Tenant IDs:** Adding a new tenant automatically assigns a unique identifier (`TNT-XXXXX`) to guarantee platform-wide uniqueness, with an option to regenerate.
- **Tenant Directory & Switcher:** Instant tenant context switching with custom subdomains and subscription plans.

### 2. User Management & Role-Based Access Control (RBAC)
- **Role Hierarchy:**
  - **Super Admin (`super_admin`):** Global access across all tenants, users, and branches.
  - **Tenant Admin (`tenant_admin`):** Full tenant administration (manage users, passwords, branches, classes, and leads).
  - **Branch Manager (`branch_manager`):** Supervises assigned branches, classes, batches, and leads.
  - **Admissions Counselor (`admissions_counselor`):** Manages student leads, inquiries, and admissions.
  - **Academic Staff / Faculty (`academic_staff`):** Views classes, batches, and student rosters.
- **Password Management:** Tenant Admins can create initial passwords (with a built-in random password generator) and change/reset user passwords at any time.
- **Access Guard:** Restricts administrative modules to authorized roles with visual access warnings.

### 3. Multi-Branch Assignment with Designated Primary Branch
- **Flexible Branch Access:** A user can be assigned to multiple branches within an organization (e.g., Branches A, B, and C).
- **Primary Branch Designation:** Each user is assigned a **Primary Branch** (e.g., Branch B) that serves as their default work location upon login.
- **Context Isolation:** The branch selector restricts options to only the user's permitted branches, with a one-click *"Return to My Primary Branch"* action.

### 4. Custom Academic Hierarchy: Courses, Classes & Groups
Each tenant can customize their complete 3-tier academic structure:
- **🎓 Courses & Programs:** Configure degree levels (UG, PG, K-12, Diploma), codes, departments, and durations.
- **📚 Classes & Batches:** Linked to courses and campus branches with capacity tracking, mentor assignments, and dynamic custom attributes (shift timings, fee tiers).
- **👥 Sections & Groups:** Multiple group classification types (`Section`, `Batch`, `Group`, `Lab Group`, `Specialization Track`) with classroom/lab assignments and instructor allocations.

### 5. Student Lead Management with Mandatory Address Verification
- **Academic Allocation:** Mark leads to a specific **Course → Class/Batch → Section/Group** with cascading dropdown selectors and real-time preview.
- **Address Structure:**
  - **Mandatory (`*`):** Street / Residential Address (validated with required indicators).
  - **Optional:** Locality / Area, Landmark, and Door / Flat Number.
  - Formatted City, State, and Pincode.
- **Lead Pipeline:** Track stages across `Inquiry`, `Contacted`, `Applied`, `Admitted`, and `Enrolled`.
- **Search & Filters:** Filter leads by Course, Class, Section/Group, Branch, Status, or multi-field search.

### 6. Interactive User Switcher / Simulator
- Built-in user switcher in the top navigation header allows testing different roles, permissions, and branch assignments with a single click.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 (`react` & `react-dom` `19.3.1`)
- **Bundler:** Vite 8 (`vite` `8.3.4`)
- **Icons:** Lucide React (`lucide-react` `1.74.0`)
- **Styling:** Modern Native CSS with CSS Design Tokens
- **Linting:** ESLint 10

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/ramasu020506/campus-connect-crm.git

# Navigate into project directory
cd campus-connect-crm

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Build for Production
```bash
npm run build
```
The output will be placed in the `dist/` directory ready for deployment.
