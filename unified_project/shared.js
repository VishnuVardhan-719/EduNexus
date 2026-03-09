/* =============================================
   EduNexus – Shared JS utilities & sidebar
   ============================================= */

// CO3: JavaScript Programming Fundamentals (Objects)
const STUDENT = { name: 'Alex Johnson', id: 'STU-2024-0421', dept: 'Computer Science', year: '3rd Year' };

function renderSidebar(activePage) {
  const pages = [
    { href: 'dashboard.html', icon: 'grid-1x2-fill', label: 'Dashboard', id: 'dashboard' },
    { href: 'assistant.html', icon: 'robot', label: 'Study Assistant', id: 'assistant' },
    { href: 'cgpa.html', icon: 'calculator-fill', label: 'CGPA Calculator', id: 'cgpa' },
    { href: 'planner.html', icon: 'calendar3', label: 'Study Planner', id: 'planner', badge: '3' },
    { href: 'analytics.html', icon: 'bar-chart-fill', label: 'Performance Analytics', id: 'analytics' },
    { href: 'smart-focus.html', icon: 'stopwatch-fill', label: 'Smart Focus', id: 'smart-focus' },
  ];

  // CO3: JavaScript Programming Fundamentals (Array methods - map, Arrow functions, Template literals)
  const navLinks = pages.map(p => `
    <a href="${p.href}" class="sidebar-link ${activePage === p.id ? 'active' : ''}">
      <i class="bi bi-${p.icon}"></i>
      <span>${p.label}</span>
      ${p.badge ? `<span class="nav-badge">${p.badge}</span>` : ''}
    </a>
  `).join('');

  const initials = STUDENT.name.split(' ').map(w => w[0]).join('');

  return `
    <div class="sidebar-brand">
      <div class="brand-icon"><i class="bi bi-mortarboard-fill"></i></div>
      <div class="brand-text">EduNexus<small>Student Portal</small></div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Main Menu</div>
      ${navLinks}
      <div class="nav-section-label">Account</div>
      <a href="index.html" class="sidebar-link logout-link">
        <i class="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="user-chip">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="user-name">${STUDENT.name}</div>
          <div class="user-role">${STUDENT.dept} • ${STUDENT.year}</div>
        </div>
      </div>
    </div>
  `;
}

function renderTopbar(title, breadcrumb) {
  return `
    <button class="topbar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
      <i class="bi bi-list"></i>
    </button>
    <div>
      <div class="page-title">${title}</div>
      <div class="page-breadcrumb">${breadcrumb}</div>
    </div>
    <div class="topbar-actions ms-auto">
      <button class="topbar-btn" title="Notifications" onclick="showToast('No new notifications.')">
        <i class="bi bi-bell"></i>
        <span class="notif-badge"></span>
      </button>
      <button class="topbar-btn" title="Settings" onclick="showToast('Settings coming soon.')">
        <i class="bi bi-gear"></i>
      </button>
    </div>
  `;
}

// CO4: DOM Manipulation, Events & API Integration (DOM Elements selection)
function initLayout(activePage, title, breadcrumb) {
  document.getElementById('sidebar').innerHTML = renderSidebar(activePage);
  document.getElementById('topbar').innerHTML = renderTopbar(title, breadcrumb);

  // Sidebar overlay
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  // If we are on the dashboard page, initialize the specific widgets
  if (activePage === 'dashboard') {
    initDashboardWidgets();
  }
}

function initDashboardWidgets() {
  // 1. Generate Heatmap Grid (7 rows x ~20 columns)
  const heatmapGrid = document.getElementById('studyHeatmapGrid');
  if (heatmapGrid) {
    let html = '';
    const totalDays = 7 * 20; // 140 days
    // Randomize intensity 0-4
    for (let i = 0; i < totalDays; i++) {
      const intensity = Math.floor(Math.random() * 5); // 0 to 4
      let bg = '#ebedf0'; // Level 0
      if (intensity === 1) bg = '#9be9a8';
      else if (intensity === 2) bg = '#40c463';
      else if (intensity === 3) bg = '#30a14e';
      else if (intensity === 4) bg = '#216e39';

      html += `<div style="width:12px; height:12px; background:${bg}; border-radius:3px;" title="intensity: ${intensity}"></div>`;
    }
    heatmapGrid.innerHTML = html;
    // Scroll heatmap to the far right to show "most recent" days
    const hc = document.querySelector('.heatmap-container');
    if (hc) hc.scrollLeft = hc.scrollWidth;
  }

  // 2. Inject AI Insights
  const aiContainer = document.getElementById('aiInsightsContainer');
  if (aiContainer) {
    const insights = [
      {
        icon: 'lightbulb-fill',
        color: '#f59e0b',
        title: 'Focus Recommendation',
        text: 'Your <strong>Operating Systems</strong> grade is slipping (68%). Try using the Smart Focus Engine for 2 hours today on OS chapters 3 and 4.'
      },
      {
        icon: 'graph-up-arrow',
        color: '#10b981',
        title: 'Habit Consistency',
        text: 'Great job! You have hit your 2L water goal 5 days in a row. Staying hydrated improves cognitive performance.'
      },
      {
        icon: 'calendar2-check-fill',
        color: '#3b82f6',
        title: 'Upcoming Deadline',
        text: 'You have a <em>Machine Learning Lab Report</em> due today. Your schedule is clear from 3 PM to 5 PM to finish it.'
      }
    ];

    aiContainer.innerHTML = insights.map(i => `
      <div class="d-flex align-items-start gap-3 p-3 rounded-3" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.1); color: ${i.color}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <i class="bi bi-${i.icon}"></i>
        </div>
        <div>
          <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 2px;">${i.title}</div>
          <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.5;">${i.text}</div>
        </div>
      </div>
    `).join('');
  }
}

function showToast(msg, type = 'success') {
  const icon = type === 'danger' ? 'x-circle-fill' :
    type === 'warning' ? 'exclamation-triangle-fill' :
      'check-circle-fill';
  const color = type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#0fa968';
  const t = document.createElement('div');
  t.className = 'en-toast';
  t.style.borderLeft = `4px solid ${color}`;
  t.innerHTML = `<i class="bi bi-${icon}" style="color:${color}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}