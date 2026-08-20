import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

const features = [
  ["🏠", "Building Requirements", "Submit land, building, floor and budget requirements."],
  ["👷", "Civil Engineer Matching", "Find a suitable professional for your project."],
  ["💬", "Direct Communication", "Keep customer and engineer communication in one place."],
  ["📐", "Design & Planning", "Manage design, structural planning and project details."],
  ["💰", "Cost Estimation", "Track estimated construction costs transparently."],
  ["📊", "Progress Tracking", "Monitor project completion with live progress updates."],
  ["📅", "Milestones & Schedule", "Organize construction stages and deadlines."],
  ["⭐", "Feedback & Rating", "Collect customer feedback after project completion."]
];

const engineers = [
  { name: "Engr. Arif Hasan", specialty: "Structural Engineer", exp: "8 Years", rating: "4.9" },
  { name: "Engr. Nusrat Jahan", specialty: "Civil & Building Design", exp: "6 Years", rating: "4.8" },
  { name: "Engr. Mahbub Rahman", specialty: "Construction Management", exp: "10 Years", rating: "4.9" }
];

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

function dashboardPath(role) {
  if (role === "admin") return "/admin-dashboard";
  if (role === "engineer") return "/engineer-dashboard";
  return "/customer-dashboard";
}

function Navbar() {
  const user = currentUser();

  return (
    <nav className="nav">
      <Link className="brand" to="/">Build<span>NOVA</span></Link>
      <div className="navlinks">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/engineers">Engineers</NavLink>
        <NavLink to="/projects">Projects</NavLink>

        {user ? (
          <>
            <NavLink to={dashboardPath(user.role)}>Dashboard</NavLink>
            <button className="btn small" onClick={logout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer>
      <h2>BuildNOVA Construction Ltd.</h2>
      <p>Smart Building Design & Construction Management System</p>
      <p>© 2026 BuildNOVA. All rights reserved.</p>
    </footer>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">SMART CONSTRUCTION PLATFORM</p>
          <h1>Build Your Dream.<br /><span>We Build Your Future.</span></h1>
          <p className="lead">Connect with civil engineers, plan your building, estimate cost and track construction from one platform.</p>
          <div className="actions">
            <Link className="btn primary" to="/requirements">Start Your Project</Link>
            <Link className="btn secondary" to="/engineers">Find Engineer</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <p className="eyebrow">OUR FEATURES</p>
          <h2>Everything You Need to Build Better</h2>
        </div>
        <div className="feature-grid">
          {features.map(([icon, title, text]) => (
            <div className="card" key={title}>
              <div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="cta">
        <div><p className="eyebrow">READY TO START?</p><h2>Turn Your Building Idea Into Reality.</h2></div>
        <Link className="btn primary" to="/requirements">Submit Requirements</Link>
      </section>
    </>
  );
}

function Services() {
  return <Page title="Our Services" subtitle="Professional construction services designed around your requirements.">
    <div className="feature-grid">
      {features.map(([icon, title, text]) => (
        <div className="card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p><Link to="/requirements">Use Service →</Link></div>
      ))}
    </div>
  </Page>;
}

function Engineers() {
  return <Page title="Our Civil Engineers" subtitle="Choose a professional engineer for your construction project.">
    <div className="engineer-grid">
      {engineers.map((e) => (
        <div className="engineer card" key={e.name}>
          <div className="avatar">👷</div><h3>{e.name}</h3><p>{e.specialty}</p>
          <div className="stats"><span>Experience<br /><b>{e.exp}</b></span><span>Rating<br /><b>⭐ {e.rating}</b></span></div>
          <Link className="btn small" to="/requirements">Request Engineer</Link>
        </div>
      ))}
    </div>
  </Page>;
}

function Projects() {
  return <Page title="Featured Projects" subtitle="Example project portfolio for residential and commercial construction.">
    <div className="project-grid">
      {["Modern 6-Storey Residence", "Green View Apartment", "City Commercial Complex"].map((p, i) => (
        <div className="project card" key={p}><div className={`project-img p${i}`}></div><h3>{p}</h3><p>Dhaka, Bangladesh • Completed</p><div className="tag">Construction Management</div></div>
      ))}
    </div>
  </Page>;
}

function Login() {
  const [role, setRole] = useState("Customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password.");
    setLoading(true);
    try {
      const backendRole = role === "Customer" ? "customer" : role === "Civil Engineer" ? "engineer" : "admin";
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, role: backendRole })
      });
      const data = await response.json();
      if (!response.ok) return alert(data.message || "Login failed.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = dashboardPath(data.user.role);
    } catch (error) {
      console.error(error);
      alert("Cannot connect to server. Make sure backend is running on port 5000.");
    } finally { setLoading(false); }
  };

  return <Page title="Welcome Back" subtitle="Login to access your BuildNOVA role dashboard.">
    <form className="form" onSubmit={handleLogin}>
      <label>Account Type<select value={role} onChange={e => setRole(e.target.value)}>
        <option>Customer</option><option>Civil Engineer</option><option>Admin</option>
      </select></label>
      <label>Email<input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn primary" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      <p className="muted">New user? <Link to="/register">Create an account</Link></p>
    </form>
  </Page>;
}

function Register() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); const [role, setRole] = useState("customer"); const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim(), phone, password, role })
      });
      const data = await response.json();
      if (!response.ok) return alert(data.message || "Registration failed.");
      alert("Registration successful! Please login.");
      window.location.href = "/login";
    } catch (error) { console.error(error); alert("Cannot connect to server."); }
    finally { setLoading(false); }
  };

  return <Page title="Create Account" subtitle="Register as a customer or professional civil engineer.">
    <form className="form" onSubmit={handleRegister}>
      <label>Full Name<input placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required /></label>
      <label>Email<input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label>Phone<input placeholder="+880..." value={phone} onChange={e => setPhone(e.target.value)} required /></label>
      <label>Role<select value={role} onChange={e => setRole(e.target.value)}><option value="customer">Customer</option><option value="engineer">Civil Engineer</option></select></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
      <button className="btn primary" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
    </form>
  </Page>;
}

function ProtectedRoute({ roles, children }) {
  const user = currentUser();
  const token = localStorage.getItem("token");
  if (!user || !token) return <NavigateToLogin />;
  if (roles && !roles.includes(user.role)) return <AccessDenied />;
  return children;
}

function NavigateToLogin() {
  useEffect(() => { window.location.href = "/login"; }, []);
  return <Page title="Login Required" subtitle="Redirecting to login..." />;
}

function AccessDenied() {
  const user = currentUser();
  return <Page title="Access Denied" subtitle="You do not have permission to open this page.">
    <div className="success"><h2>🔒 Wrong Role</h2><p>This page belongs to another account type.</p>
      <Link className="btn primary" to={dashboardPath(user?.role)}>Go to My Dashboard</Link>
    </div>
  </Page>;
}

function RoleLayout({ title, subtitle, menu, children }) {
  return <main className="role-shell">
    <aside className="role-sidebar">
      <Link className="brand sidebar-brand" to="/">Build<span>NOVA</span></Link>
      <div className="role-title">{title}</div>
      <div className="role-menu">{menu.map(item => <NavLink key={item.to} to={item.to} end={item.end}>{item.icon} {item.label}</NavLink>)}</div>
      <button className="logout-btn" onClick={logout}>🚪 Logout</button>
    </aside>
    <section className="role-content">{children}</section>
  </main>;
}

const customerMenu = [
  { to: "/customer-dashboard", label: "Dashboard", icon: "📊", end: true },
  { to: "/customer/projects", label: "My Projects", icon: "🏗️" },
  { to: "/customer/new-project", label: "New Project", icon: "➕" },
  { to: "/customer/profile", label: "My Profile", icon: "👤" }
];

function CustomerDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`${API}/projects/my-projects`, { headers: authHeaders() }).then(r => r.json()).then(d => setProjects(d.projects || [])).catch(console.error).finally(() => setLoading(false)); }, []);
  const active = projects.filter(p => p.status !== "Completed").length;
  const progress = projects.length ? Math.round(projects.reduce((s,p)=>s+Number(p.progress||0),0)/projects.length) : 0;
  return <RoleLayout title="Customer Portal" menu={customerMenu}>
    <DashboardHeader title="Customer Dashboard" subtitle="Manage your construction projects, requests and progress." />
    <div className="dashboard-grid">
      <Stat title="Total Projects" value={projects.length} icon="🏗️" />
      <Stat title="Active Projects" value={active} icon="🚧" />
      <Stat title="Average Progress" value={`${progress}%`} icon="📈" />
      <Stat title="Completed" value={projects.filter(p=>p.status==="Completed").length} icon="✅" />
    </div>
    <div className="card">
      <div className="section-head-row"><h2>Recent Projects</h2><Link className="btn small" to="/customer/new-project">+ New Project</Link></div>
      {loading ? <p>Loading projects...</p> : projects.length === 0 ? <Empty text="No project yet. Submit your first construction requirement." link="/customer/new-project" /> :
        projects.slice(0,4).map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  </RoleLayout>;
}

function CustomerProjects() {
  const [projects, setProjects] = useState([]); const [loading,setLoading]=useState(true);
  const load=()=>fetch(`${API}/projects/my-projects`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setProjects(d.projects||[])).finally(()=>setLoading(false));
  useEffect(()=>{load().catch(console.error)},[]);
  return <RoleLayout title="Customer Portal" menu={customerMenu}><DashboardHeader title="My Projects" subtitle="View every project request and its current construction status." />
    {loading ? <p>Loading...</p> : projects.length ? projects.map(p=><ProjectCard key={p.id} project={p} />) : <Empty text="No projects found." link="/customer/new-project" />}</RoleLayout>;
}

function CustomerNewProject() {
  const [form,setForm]=useState({project_name:"",building_type:"Residential",location:"",land_size:"",number_of_floors:1,number_of_rooms:0,budget:"",requirements:""});
  const [saving,setSaving]=useState(false);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const submit=async e=>{e.preventDefault();setSaving(true);try{const r=await fetch(`${API}/projects`,{method:"POST",headers:authHeaders(),body:JSON.stringify(form)});const d=await r.json();if(!r.ok) return alert(d.message||"Could not submit");alert("Project request submitted successfully!");window.location.href="/customer/projects";}catch(err){alert("Server connection failed.");}finally{setSaving(false)}};
  return <RoleLayout title="Customer Portal" menu={customerMenu}><DashboardHeader title="Create New Project" subtitle="Submit your building requirements to BuildNOVA." />
    <form className="form wide card" onSubmit={submit}>
      <div className="two"><label>Project Name<input name="project_name" value={form.project_name} onChange={change} required placeholder="My Dream House"/></label>
      <label>Building Type<select name="building_type" value={form.building_type} onChange={change}><option>Residential</option><option>Commercial</option><option>Apartment</option><option>Industrial</option></select></label></div>
      <div className="two"><label>Location<input name="location" value={form.location} onChange={change} required placeholder="Dhaka"/></label><label>Land Size<input name="land_size" value={form.land_size} onChange={change} placeholder="5 Katha"/></label></div>
      <div className="two"><label>Number of Floors<input type="number" min="1" name="number_of_floors" value={form.number_of_floors} onChange={change}/></label><label>Number of Rooms<input type="number" min="0" name="number_of_rooms" value={form.number_of_rooms} onChange={change}/></label></div>
      <label>Estimated Budget (BDT)<input type="number" min="0" name="budget" value={form.budget} onChange={change} placeholder="15000000"/></label>
      <label>Additional Requirements<textarea name="requirements" value={form.requirements} onChange={change} placeholder="Lift, parking, rooftop, room preferences..."/></label>
      <button className="btn primary" disabled={saving}>{saving ? "Submitting..." : "Submit Project Request"}</button>
    </form>
  </RoleLayout>;
}

function CustomerProfile() {
  const user=currentUser();
  return <RoleLayout title="Customer Portal" menu={customerMenu}><DashboardHeader title="My Profile" subtitle="Your BuildNOVA account information." />
    <div className="card profile-card"><div className="avatar big">👤</div><h2>{user?.name}</h2><p><b>Email:</b> {user?.email}</p><p><b>Phone:</b> {user?.phone || "Not added"}</p><p><b>Role:</b> Customer</p></div>
  </RoleLayout>;
}

const engineerMenu=[
  {to:"/engineer-dashboard",label:"Dashboard",icon:"📊",end:true},
  {to:"/engineer/requests",label:"Project Requests",icon:"📥"},
  {to:"/engineer/projects",label:"My Projects",icon:"🏗️"},
  {to:"/engineer/profile",label:"My Profile",icon:"👤"}
];

function EngineerDashboard() {
  const [projects,setProjects]=useState([]); const [requests,setRequests]=useState([]);
  useEffect(()=>{Promise.all([
    fetch(`${API}/engineers/my-projects`,{headers:authHeaders()}).then(r=>r.json()),
    fetch(`${API}/engineers/project-requests`,{headers:authHeaders()}).then(r=>r.json())
  ]).then(([p,r])=>{setProjects(p.projects||[]);setRequests(r.projects||[])}).catch(console.error)},[]);
  return <RoleLayout title="Engineer Portal" menu={engineerMenu}><DashboardHeader title="Civil Engineer Dashboard" subtitle="Review customer requests, manage assigned projects and update construction progress." />
    <div className="dashboard-grid"><Stat title="New Requests" value={requests.length} icon="📥"/><Stat title="Assigned Projects" value={projects.length} icon="🏗️"/><Stat title="In Construction" value={projects.filter(p=>p.status==="Construction").length} icon="🚧"/><Stat title="Completed" value={projects.filter(p=>p.status==="Completed").length} icon="✅"/></div>
    <div className="card"><h2>Latest Customer Requests</h2>{requests.slice(0,3).map(p=><ProjectCard key={p.id} project={p} engineerView />)}{!requests.length&&<p className="muted">No pending requests.</p>}</div>
  </RoleLayout>;
}

function EngineerRequests(){
  const [projects,setProjects]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch(`${API}/engineers/project-requests`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setProjects(d.projects||[])).catch(console.error).finally(()=>setLoading(false))},[]);
  return <RoleLayout title="Engineer Portal" menu={engineerMenu}><DashboardHeader title="Project Requests" subtitle="Pending customer requests waiting for admin assignment." />
    {loading?<p>Loading...</p>:projects.length?projects.map(p=><ProjectCard key={p.id} project={p} engineerView/>):<Empty text="No pending project requests right now."/>}</RoleLayout>;
}

function EngineerProjects(){
  const [projects,setProjects]=useState([]);const [loading,setLoading]=useState(true);
  const load=()=>fetch(`${API}/engineers/my-projects`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setProjects(d.projects||[])).finally(()=>setLoading(false));
  useEffect(()=>{load().catch(console.error)},[]);
  return <RoleLayout title="Engineer Portal" menu={engineerMenu}><DashboardHeader title="My Assigned Projects" subtitle="Update construction progress and monitor your customers." />
    {loading?<p>Loading...</p>:projects.length?projects.map(p=><EngineerProjectCard key={p.id} project={p} onUpdated={load}/>):<Empty text="No project has been assigned to you yet."/>}</RoleLayout>;
}

function EngineerProjectCard({project,onUpdated}){
  const [progress,setProgress]=useState(project.progress||0);const [description,setDescription]=useState("");const [saving,setSaving]=useState(false);
  const update=async()=>{setSaving(true);try{const r=await fetch(`${API}/progress`,{method:"POST",headers:authHeaders(),body:JSON.stringify({project_id:project.id,progress_percentage:Number(progress),description})});const d=await r.json();if(!r.ok)return alert(d.message||"Update failed");alert("Progress updated successfully");setDescription("");onUpdated();}catch(e){alert("Server connection failed")}finally{setSaving(false)}};
  return <div className="card project-card"><div className="project-head"><h3>{project.project_name}</h3><span>{project.status}</span></div><p>Customer: <b>{project.customer_name}</b> • {project.location}</p><div className="progress"><div style={{width:`${project.progress||0}%`}}/></div><p>{project.progress||0}% complete • Budget ৳{Number(project.budget||0).toLocaleString()}</p>
    <div className="two"><label>Update Progress %<input type="number" min="0" max="100" value={progress} onChange={e=>setProgress(e.target.value)}/></label><label>Progress Note<input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Foundation completed..."/></label></div>
    <button className="btn primary" onClick={update} disabled={saving}>{saving?"Updating...":"Update Project Progress"}</button>
  </div>;
}

function EngineerProfile(){
  const user=currentUser();
  return <RoleLayout title="Engineer Portal" menu={engineerMenu}><DashboardHeader title="Engineer Profile" subtitle="Your professional account information."/><div className="card profile-card"><div className="avatar big">👷</div><h2>{user?.name}</h2><p><b>Email:</b> {user?.email}</p><p><b>Phone:</b> {user?.phone||"Not added"}</p><p><b>Role:</b> Civil Engineer</p></div></RoleLayout>;
}

const adminMenu=[
  {to:"/admin-dashboard",label:"Dashboard",icon:"📊",end:true},
  {to:"/admin/users",label:"Manage Users",icon:"👥"},
  {to:"/admin/projects",label:"Manage Projects",icon:"🏗️"},
  {to:"/admin/assign",label:"Assign Engineer",icon:"👷"}
];

function AdminDashboard(){
  const [stats,setStats]=useState(null);
  useEffect(()=>{fetch(`${API}/admin/dashboard`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setStats(d.dashboard)).catch(console.error)},[]);
  return <RoleLayout title="Admin Portal" menu={adminMenu}><DashboardHeader title="Admin Dashboard" subtitle="Control customers, engineers and construction projects from one place."/>
    <div className="dashboard-grid"><Stat title="Total Users" value={stats?.totalUsers??"—"} icon="👥"/><Stat title="Customers" value={stats?.totalCustomers??"—"} icon="🧑"/><Stat title="Engineers" value={stats?.totalEngineers??"—"} icon="👷"/><Stat title="Projects" value={stats?.totalProjects??"—"} icon="🏗️"/><Stat title="Pending" value={stats?.pendingProjects??"—"} icon="⏳"/><Stat title="Completed" value={stats?.completedProjects??"—"} icon="✅"/></div>
    <div className="card"><h2>Admin Actions</h2><div className="quick-grid"><Link className="quick-action" to="/admin/users">👥 Manage Users</Link><Link className="quick-action" to="/admin/projects">🏗️ View Projects</Link><Link className="quick-action" to="/admin/assign">👷 Assign Engineer</Link></div></div>
  </RoleLayout>;
}

function AdminUsers(){
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch(`${API}/admin/users`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setUsers(d.users||[])).catch(console.error).finally(()=>setLoading(false))},[]);
  return <RoleLayout title="Admin Portal" menu={adminMenu}><DashboardHeader title="Manage Users" subtitle="View all registered customers, engineers and administrators."/>
    <div className="card table-wrap">{loading?<p>Loading...</p>:<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone||"—"}</td><td><span className="role-badge">{u.role}</span></td></tr>)}</tbody></table>}</div>
  </RoleLayout>;
}

function AdminProjects(){
  const [projects,setProjects]=useState([]);const [loading,setLoading]=useState(true);
  const load=()=>fetch(`${API}/admin/projects`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setProjects(d.projects||[])).finally(()=>setLoading(false));
  useEffect(()=>{load().catch(console.error)},[]);
  return <RoleLayout title="Admin Portal" menu={adminMenu}><DashboardHeader title="Manage Projects" subtitle="Monitor every customer project and its assigned engineer."/>
    <div className="card">{loading?<p>Loading...</p>:projects.length?projects.map(p=><div className="project" key={p.id}><div className="project-head"><h3>{p.project_name}</h3><span>{p.status}</span></div><p>Customer: <b>{p.customer_name}</b> • Engineer: <b>{p.engineer_name||"Not assigned"}</b></p><p>{p.building_type} • {p.location} • {p.number_of_floors} floors</p><div className="progress"><div style={{width:`${p.progress||0}%`}}/></div><p>{p.progress||0}% complete</p></div>):<Empty text="No projects found."/>}</div>
  </RoleLayout>;
}

function AdminAssign(){
  const [projects,setProjects]=useState([]);const [engineers,setEngineers]=useState([]);const [loading,setLoading]=useState(true);
  const load=()=>Promise.all([
    fetch(`${API}/admin/projects`,{headers:authHeaders()}).then(r=>r.json()),
    fetch(`${API}/engineers`,{headers:authHeaders()}).then(r=>r.json())
  ]).then(([p,e])=>{setProjects(p.projects||[]);setEngineers(e.engineers||[])}).finally(()=>setLoading(false));
  useEffect(()=>{load().catch(console.error)},[]);
  const assign=async(projectId,engineerId)=>{if(!engineerId)return;const r=await fetch(`${API}/engineers/assign/${projectId}`,{method:"PUT",headers:authHeaders(),body:JSON.stringify({engineer_id:Number(engineerId)})});const d=await r.json();if(!r.ok)return alert(d.message||"Assignment failed");alert("Engineer assigned successfully");load()};
  return <RoleLayout title="Admin Portal" menu={adminMenu}><DashboardHeader title="Assign Engineer" subtitle="Assign a civil engineer to a pending customer project."/>
    {loading?<p>Loading...</p>:projects.map(p=><div className="card project" key={p.id}><div className="project-head"><h3>{p.project_name}</h3><span>{p.status}</span></div><p>Customer: {p.customer_name} • {p.location}</p><div className="two"><label>Engineer<select defaultValue={p.engineer_id||""} onChange={e=>assign(p.id,e.target.value)}><option value="">Select engineer</option>{engineers.map(e=><option value={e.id} key={e.id}>{e.name}</option>)}</select></label><div><p>Current: <b>{p.engineer_name||"Not assigned"}</b></p></div></div></div>)}</RoleLayout>;
}

function Requirements(){ return <CustomerNewProject />; }

function ProjectDetails(){
  const {id}=useParams(); const [project,setProject]=useState(null);
  useEffect(()=>{fetch(`${API}/projects/${id}`,{headers:authHeaders()}).then(r=>r.json()).then(d=>setProject(d.project)).catch(console.error)},[id]);
  if(!project)return <Page title="Project Details" subtitle="Loading project..."/>;
  return <Page title={project.project_name} subtitle={`${project.building_type} • ${project.location}`}><div className="two-cards"><div className="card"><h3>Project Information</h3><p>Customer: {project.customer_name}</p><p>Floors: {project.number_of_floors}</p><p>Budget: ৳{Number(project.budget||0).toLocaleString()}</p><p>Status: {project.status}</p></div><div className="card"><h3>Assigned Engineer</h3><p>{project.engineer_name||"Not assigned"}</p><p>{project.engineer_email||""}</p></div></div><div className="card"><h3>Construction Progress</h3><div className="progress"><div style={{width:`${project.progress||0}%`}}/></div><p>{project.progress||0}% completed</p></div></Page>;
}

function DashboardHeader({title,subtitle}){return <div className="welcome"><p className="eyebrow">BUILDNOVA PORTAL</p><h1>{title}</h1><p className="lead dark">{subtitle}</p></div>;}
function ProjectCard({project,engineerView=false}){return <div className="project"><div className="project-head"><h3>{project.project_name}</h3><span>{project.status}</span></div><p>{project.building_type} • {project.location} • {project.number_of_floors} floors</p>{project.customer_name&&<p>Customer: <b>{project.customer_name}</b></p>}<div className="progress"><div style={{width:`${project.progress||0}%`}}/></div><p>{project.progress||0}% complete • Budget ৳{Number(project.budget||0).toLocaleString()}</p>{engineerView&&<p className="muted">Customer contact: {project.customer_email||"—"} {project.customer_phone||""}</p>}<Link className="btn small" to={`/project/${project.id}`}>View Details</Link></div>;}
function Empty({text,link}){return <div className="success"><p>{text}</p>{link&&<Link className="btn primary" to={link}>Get Started</Link>}</div>;}
function Stat({title,value,icon}){return <div className="card stat"><div className="stat-icon">{icon}</div><p>{title}</p><h2>{value}</h2></div>;}
function Page({title,subtitle,children}){return <main className="page"><p className="eyebrow">BUILDNOVA</p><h1>{title}</h1><p className="lead dark">{subtitle}</p>{children}</main>;}

export default function App(){
  return <><Navbar/><Routes>
    <Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/engineers" element={<Engineers/>}/><Route path="/projects" element={<Projects/>}/>
    <Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/requirements" element={<Requirements/>}/>
    <Route path="/customer-dashboard" element={<ProtectedRoute roles={["customer"]}><CustomerDashboard/></ProtectedRoute>}/>
    <Route path="/customer/projects" element={<ProtectedRoute roles={["customer"]}><CustomerProjects/></ProtectedRoute>}/>
    <Route path="/customer/new-project" element={<ProtectedRoute roles={["customer"]}><CustomerNewProject/></ProtectedRoute>}/>
    <Route path="/customer/profile" element={<ProtectedRoute roles={["customer"]}><CustomerProfile/></ProtectedRoute>}/>
    <Route path="/engineer-dashboard" element={<ProtectedRoute roles={["engineer"]}><EngineerDashboard/></ProtectedRoute>}/>
    <Route path="/engineer/requests" element={<ProtectedRoute roles={["engineer"]}><EngineerRequests/></ProtectedRoute>}/>
    <Route path="/engineer/projects" element={<ProtectedRoute roles={["engineer"]}><EngineerProjects/></ProtectedRoute>}/>
    <Route path="/engineer/profile" element={<ProtectedRoute roles={["engineer"]}><EngineerProfile/></ProtectedRoute>}/>
    <Route path="/admin-dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>}/>
    <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers/></ProtectedRoute>}/>
    <Route path="/admin/projects" element={<ProtectedRoute roles={["admin"]}><AdminProjects/></ProtectedRoute>}/>
    <Route path="/admin/assign" element={<ProtectedRoute roles={["admin"]}><AdminAssign/></ProtectedRoute>}/>
    <Route path="/project/:id" element={<ProtectedRoute roles={["customer","engineer","admin"]}><ProjectDetails/></ProtectedRoute>}/>
    <Route path="*" element={<Home/>}/>
  </Routes><Footer/></>;
}
