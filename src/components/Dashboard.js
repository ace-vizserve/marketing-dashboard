'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Chart from 'chart.js/auto';

// ── Social data ──
const socialData = {
  all: {
    labels: ['January', 'February', 'March'],
    fb: { views: [90576,89500,141988], reach: [34605,54337,71623], interactions: [784,412,2105], clicks: [363,628,828], visits: [5876,3592,5945] },
    ig: { views: [17532,9143,16922], reach: [6412,3328,4846], interactions: [326,189,595], clicks: [63,23,13], visits: [494,303,483] },
    li: { impressions: [226,350,1359], clicks: [23,13,75], reactions: [3,8,34] }
  },
  jan: {
    labels: ['January'],
    fb: { views: [90576], reach: [34605], interactions: [784], clicks: [363], visits: [5876] },
    ig: { views: [17532], reach: [6412], interactions: [326], clicks: [63], visits: [494] },
    li: { impressions: [226], clicks: [23], reactions: [3] }
  },
  feb: {
    labels: ['February'],
    fb: { views: [89500], reach: [54337], interactions: [412], clicks: [628], visits: [3592] },
    ig: { views: [9143], reach: [3328], interactions: [189], clicks: [23], visits: [303] },
    li: { impressions: [350], clicks: [13], reactions: [8] }
  },
  mar: {
    labels: ['March'],
    fb: { views: [141988], reach: [71623], interactions: [2105], clicks: [828], visits: [5945] },
    ig: { views: [16922], reach: [4846], interactions: [595], clicks: [13], visits: [483] },
    li: { impressions: [1359], clicks: [75], reactions: [34] }
  }
};

const isaData = [50,50,59,44,59,46,66,96,57,25,29,82,56,56,58,83,64,48,100,77,81,68,78,86,51,93,91,80,59,93,41,18,70,109,84,84,70,69,59,71,84,66,70,85,48,58,55,58,48,68,74,56,48,54,64,67,79,85,38,59,63,76,73,81,81,75,58,117,66,91,63,70,61,49,74,83,73,86,65,45,50,60,69,67,62,63,50,58,72,67];

function numFmt(v) {
  if (v >= 1000) return (v/1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'K';
  return v;
}

export default function Dashboard({ userEmail }) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('fb');
  const [activePeriod, setActivePeriod] = useState('all');
  const [emailExpanded, setEmailExpanded] = useState(false);
  const chartsRef = useRef({});

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Chart initialization
  useEffect(() => {
    // Destroy any existing charts first (handles React Strict Mode double-mount)
    Object.values(chartsRef.current).forEach(c => { if (c) c.destroy(); });
    chartsRef.current = {};
    const charts = chartsRef.current;
    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 12 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 } } }
      }
    };

    const numFmtTick = { callback: v => numFmt(v), font: { size: 11 } };
    const yScaleNum = { grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: numFmtTick };

    // FB Trend
    const fbTrendEl = document.getElementById('fbTrendChart');
    if (fbTrendEl) {
      charts.fbTrend = new Chart(fbTrendEl, {
        type: 'bar',
        data: {
          labels: socialData.all.labels,
          datasets: [
            { label: 'Views', data: [...socialData.all.fb.views], backgroundColor: 'rgba(31,69,199,0.15)', borderColor: '#1f45c7', borderWidth: 2, borderRadius: 6 },
            { label: 'Reach', data: [...socialData.all.fb.reach], backgroundColor: '#1f45c7', borderRadius: 6 }
          ]
        },
        options: { ...chartDefaults, scales: { x: { grid: { display: false } }, y: yScaleNum } }
      });
    }

    // FB Engagement
    const fbEngEl = document.getElementById('fbEngagementChart');
    if (fbEngEl) {
      charts.fbEng = new Chart(fbEngEl, {
        type: 'bar',
        data: {
          labels: socialData.all.labels,
          datasets: [
            { label: 'Interactions', data: [...socialData.all.fb.interactions], backgroundColor: '#fd8735', borderRadius: 6 },
            { label: 'Link Clicks', data: [...socialData.all.fb.clicks], backgroundColor: '#fdc280', borderRadius: 6 },
            { label: 'Visits', data: [...socialData.all.fb.visits], backgroundColor: '#e5e8f0', borderRadius: 6 }
          ]
        },
        options: { ...chartDefaults, scales: { x: { grid: { display: false } }, y: yScaleNum } }
      });
    }

    // IG Trend
    const igTrendEl = document.getElementById('igTrendChart');
    if (igTrendEl) {
      charts.igTrend = new Chart(igTrendEl, {
        type: 'bar',
        data: {
          labels: socialData.all.labels,
          datasets: [
            { label: 'Views', data: [...socialData.all.ig.views], backgroundColor: 'rgba(240,148,51,0.2)', borderColor: '#f09433', borderWidth: 2, borderRadius: 6 },
            { label: 'Reach', data: [...socialData.all.ig.reach], backgroundColor: '#bc1888', borderRadius: 6 }
          ]
        },
        options: { ...chartDefaults, scales: { x: { grid: { display: false } }, y: yScaleNum } }
      });
    }

    // IG Engagement
    const igEngEl = document.getElementById('igEngagementChart');
    if (igEngEl) {
      charts.igEng = new Chart(igEngEl, {
        type: 'bar',
        data: {
          labels: socialData.all.labels,
          datasets: [
            { label: 'Interactions', data: [...socialData.all.ig.interactions], backgroundColor: '#f09433', borderRadius: 6 },
            { label: 'Link Clicks', data: [...socialData.all.ig.clicks], backgroundColor: '#fdc280', borderRadius: 6 },
            { label: 'Visits', data: [...socialData.all.ig.visits], backgroundColor: '#e5e8f0', borderRadius: 6 }
          ]
        },
        options: { ...chartDefaults, scales: { x: { grid: { display: false } }, y: yScaleNum } }
      });
    }

    // LinkedIn
    const liEl = document.getElementById('liChart');
    if (liEl) {
      charts.li = new Chart(liEl, {
        type: 'bar',
        data: {
          labels: socialData.all.labels,
          datasets: [
            { label: 'Impressions', data: [...socialData.all.li.impressions], backgroundColor: '#0A66C2', borderRadius: 6 },
            { label: 'Clicks', data: [...socialData.all.li.clicks], backgroundColor: '#6aaad6', borderRadius: 6 },
            { label: 'Reactions', data: [...socialData.all.li.reactions], backgroundColor: '#c8dff0', borderRadius: 6 }
          ]
        },
        options: { ...chartDefaults, scales: { x: { grid: { display: false } }, y: { grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 } } } } }
      });
    }

    // Top Pages
    const topPagesEl = document.getElementById('topPagesChart');
    if (topPagesEl) {
      charts.topPages = new Chart(topPagesEl, {
        type: 'bar',
        data: {
          labels: ['Home','Job Opportunities','Submit Application','About Us','HFSE Youngstarters','Contact Us','Career Opp. SG'],
          datasets: [{ label: 'Page Views', data: [10807,8683,4055,2575,2120,1476,1410], backgroundColor: ['#1f45c7','#3d62d4','#5b7ee1','#7999ee','#97b5f4','#b5d0fa','#d3ecff'], borderRadius: 5 }]
        },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
          plugins: { legend: { display: false } },
          scales: { x: { grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 }, callback: v => numFmt(v) } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } }
        }
      });
    }

    // ISA Daily Users
    const isaEl = document.getElementById('isaChart');
    if (isaEl) {
      const months = ['Jan','Feb','Mar'];
      const monthStarts = [0, 31, 59];
      const labels = isaData.map((_, i) => {
        const mi = monthStarts.findIndex((s, idx) => s <= i && (idx === 2 || monthStarts[idx+1] > i));
        const day = i - monthStarts[mi] + 1;
        return day === 1 ? months[mi] + ' 1' : (day % 7 === 0 ? months[mi] + ' ' + day : '');
      });
      charts.isa = new Chart(isaEl, {
        type: 'line',
        data: {
          labels,
          datasets: [{ label: 'Daily Active Users', data: isaData, borderColor: '#1f45c7', backgroundColor: 'rgba(31,69,199,0.07)', fill: true, tension: 0.35, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 800 },
          plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items) => 'Day ' + (items[0].dataIndex + 1) } } },
          scales: { x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0 } }, y: { grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, beginAtZero: false, ticks: { font: { size: 11 } } } }
        }
      });
    }

    // Leads Stacked Bar
    const leadsEl = document.getElementById('leadsChart');
    if (leadsEl) {
      charts.leads = new Chart(leadsEl, {
        type: 'bar',
        data: {
          labels: ['January','February','March'],
          datasets: [
            { label: 'Contact Us Form', data: [23,10,10], backgroundColor: '#1f45c7' },
            { label: 'WhatsApp', data: [19,10,5], backgroundColor: '#25D366' },
            { label: 'Open-House Form', data: [0,5,8], backgroundColor: '#97b5f4' },
            { label: 'Event Walk-ins', data: [2,1,9], backgroundColor: '#6366f1' },
            { label: 'Facebook Messenger', data: [1,8,2], backgroundColor: '#0084FF' },
            { label: 'Phone Call', data: [0,2,2], backgroundColor: '#fd8735' },
            { label: 'Email', data: [0,1,1], backgroundColor: '#e2e8f0' }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 10 } } },
          scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 } } } }
        }
      });
    }

    // Email Chart
    const emailEl = document.getElementById('emailChart');
    if (emailEl) {
      charts.email = new Chart(emailEl, {
        type: 'bar',
        data: {
          labels: ['Welcome\nAY26',"Founder's\nMsg",'Jan\nHighlights','Virtual\nOH','VOH\nFollow-up','Feb\nHighlights','EduTrust\nAnn.','EduTrust\nEOI','Open\nHouse'],
          datasets: [
            { label: 'Open Rate (%)', data: [69.42,60.88,57.1,37.66,49.13,56.85,56.44,64.62,36.51], backgroundColor: '#1f45c7', borderRadius: 5 },
            { label: 'CTR (%)', data: [0,0.68,5.03,4.6,0.87,8.63,9.41,13.92,2.38], backgroundColor: '#fd8735', borderRadius: 5 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } } },
          scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { callback: v => v + '%', font: { size: 11 } } } }
        }
      });
    }

    // Spend Doughnut
    const spendDEl = document.getElementById('spendDoughnutChart');
    if (spendDEl) {
      charts.spendD = new Chart(spendDEl, {
        type: 'doughnut',
        data: {
          labels: ['Events & Sponsorships','Google Ads','Meta Ads','Other Online Ad','Email / Brevo'],
          datasets: [{ data: [3770,2428.33,659.06,300,66.66], backgroundColor: ['#1f45c7','#fd8735','#fdc280','#7c3aed','#97b5f4'], borderWidth: 3, borderColor: '#ffffff', hoverOffset: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 800 }, cutout: '68%',
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 12 } }, tooltip: { callbacks: { label: ctx => ' $' + ctx.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } } }
        }
      });
    }

    // Spend Monthly
    const spendMEl = document.getElementById('spendMonthlyChart');
    if (spendMEl) {
      charts.spendM = new Chart(spendMEl, {
        type: 'bar',
        data: {
          labels: ['January','February','March'],
          datasets: [
            { label: 'Google Ads', data: [1433.35,564.42,430.56], backgroundColor: '#fd8735' },
            { label: 'Meta Ads', data: [213.34,210.22,235.50], backgroundColor: '#fdc280' },
            { label: 'Other Online Ad', data: [0,150,150], backgroundColor: '#7c3aed' },
            { label: 'Email / Brevo', data: [0,33.33,33.33], backgroundColor: '#97b5f4' },
            { label: 'Events/Sponsorships', data: [0,800,2970], backgroundColor: '#1f45c7' }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
          plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 10 } } },
          scales: { x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } }, y: { stacked: true, beginAtZero: true, grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 }, callback: v => '$' + v.toLocaleString() } } }
        }
      });
    }

    // CPL Chart
    const cplEl = document.getElementById('cplChart');
    if (cplEl) {
      charts.cpl = new Chart(cplEl, {
        type: 'bar',
        data: {
          labels: ['January','February','March'],
          datasets: [{ label: 'Cost per Lead', data: [36.59,47.51,103.23], backgroundColor: ['#1f45c7','#fd8735','#dc2626'], borderRadius: 6 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' $' + ctx.raw.toFixed(2) + ' per lead' } } },
          scales: { x: { grid: { display: false }, ticks: { font: { size: 11 } } }, y: { beginAtZero: true, grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 }, callback: v => '$' + v } } }
        }
      });
    }

    // ROI Chart
    const roiEl = document.getElementById('roiChart');
    if (roiEl) {
      charts.roi = new Chart(roiEl, {
        type: 'bar',
        data: {
          labels: ['Marketing Spend','Conversion Revenue'],
          datasets: [{ data: [7224.05,23020.80], backgroundColor: ['#fd8735','#16a34a'], borderRadius: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 600 },
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' $' + ctx.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } } },
          scales: { x: { grid: { display: false }, ticks: { font: { size: 12, weight: '600' } } }, y: { beginAtZero: true, grid: { color: '#f0f0f0' }, border: { dash: [4,4] }, ticks: { font: { size: 11 }, callback: v => '$' + v.toLocaleString() } } }
        }
      });
    }

    return () => {
      Object.values(charts).forEach(c => { if (c) c.destroy(); });
    };
  }, []);

  // Update charts when period changes
  useEffect(() => {
    const charts = chartsRef.current;
    const d = socialData[activePeriod];
    if (!d || !charts.fbTrend) return;

    [charts.fbTrend, charts.fbEng, charts.igTrend, charts.igEng].forEach(c => {
      if (c) c.data.labels = d.labels;
    });

    if (charts.fbTrend) { charts.fbTrend.data.datasets[0].data = d.fb.views; charts.fbTrend.data.datasets[1].data = d.fb.reach; charts.fbTrend.update(); }
    if (charts.fbEng) { charts.fbEng.data.datasets[0].data = d.fb.interactions; charts.fbEng.data.datasets[1].data = d.fb.clicks; charts.fbEng.data.datasets[2].data = d.fb.visits; charts.fbEng.update(); }
    if (charts.igTrend) { charts.igTrend.data.datasets[0].data = d.ig.views; charts.igTrend.data.datasets[1].data = d.ig.reach; charts.igTrend.update(); }
    if (charts.igEng) { charts.igEng.data.datasets[0].data = d.ig.interactions; charts.igEng.data.datasets[1].data = d.ig.clicks; charts.igEng.data.datasets[2].data = d.ig.visits; charts.igEng.update(); }
  }, [activePeriod]);

  const panels = { fb: 'fb-panel', ig: 'ig-panel', li: 'li-panel' };

  return (
    <>
      {/* STICKY NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <img src="/LOGO_SOLID (3).png" alt="HFSE International School" onError={(e) => { e.target.style.display = 'none'; }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>HFSE International School</span>
        </div>
        <ul className="nav-links">
          <li><a href="#overview">Overview</a></li>
          <li><a href="#social">Social</a></li>
          <li><a href="#website">Website</a></li>
          <li><a href="#leads">Leads</a></li>
          <li><a href="#email">Email</a></li>
          <li><a href="#spend">Spend</a></li>
          <li><a href="#conversion">Conversion</a></li>
          <li><a href="#posts">Posts</a></li>
          <li><a href="#recommendations">Actions</a></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span className="nav-badge">Q1 2026</span>
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <header className="page-header">
        <div className="page-header-left">
          <img src="/LOGO_SOLID (3).png" alt="HFSE International School" className="header-logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="header-text">
            <h1>Marketing Performance <span>Dashboard</span></h1>
            <p>HFSE International School &nbsp;&middot;&nbsp; Q1 2026 &nbsp;&middot;&nbsp; January – March 2026</p>
          </div>
        </div>
        <div className="header-meta">
          <strong>Generated</strong><br />April 14, 2026<br />
          <span style={{ marginTop: '4px', display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '11px' }}>Q1 2026 Report</span>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">

        {/* 1. EXECUTIVE SUMMARY */}
        <section className="section" id="overview">
          <div className="section-header">
            <div className="section-icon blue">&#x1F4CA;</div>
            <div>
              <div className="section-title">Executive Summary</div>
              <div className="section-subtitle">Key performance indicators across all marketing channels, Q1 2026</div>
            </div>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card primary">
              <div className="kpi-label">Total Social Reach</div>
              <div className="kpi-value">175,151</div>
              <div className="kpi-change">FB 160,565 + IG 14,586</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Website Views</div>
              <div className="kpi-value">49,219</div>
              <div className="kpi-change">hfse.edu.sg · Q1 2026</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">ISA Portal Users</div>
              <div className="kpi-value">5,992</div>
              <div className="kpi-change">isa.hfse.edu.sg · Q1 2026</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Admission Leads</div>
              <div className="kpi-value">119</div>
              <div className="kpi-change">All channels combined</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Avg Email Open Rate</div>
              <div className="kpi-value">54.3%</div>
              <div className="kpi-change"><span className="up">&#x2191; 2.6× industry avg (21%)</span></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Top Post Views</div>
              <div className="kpi-value">7,466</div>
              <div className="kpi-change">EduTrust certification reel</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Conversion Rate</div>
              <div className="kpi-value">1.68%</div>
              <div className="kpi-change">2 enrolments from 119 leads</div>
            </div>
            <div className="kpi-card orange">
              <div className="kpi-label">Q1 Marketing Spend</div>
              <div className="kpi-value small">$7,224</div>
              <div className="kpi-change">Jan–Mar 2026 total</div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* 2. SOCIAL MEDIA */}
        <section className="section" id="social">
          <div className="section-header">
            <div className="section-icon blue">&#x1F4F1;</div>
            <div>
              <div className="section-title">Social Media Performance</div>
              <div className="section-subtitle">Facebook, Instagram & LinkedIn · Q1 2026</div>
            </div>
          </div>

          <div className="platform-tabs">
            {[{key:'fb',label:'Facebook',dot:'dot-fb'},{key:'ig',label:'Instagram',dot:'dot-ig'},{key:'li',label:'LinkedIn',dot:'dot-li'}].map(p => (
              <button key={p.key} className={`platform-tab ${activeTab === p.key ? 'active' : ''}`} onClick={() => setActiveTab(p.key)}>
                <span className={`dot ${p.dot}`}></span> {p.label}
              </button>
            ))}
          </div>

          {/* FACEBOOK PANEL */}
          <div className={`platform-panel ${activeTab === 'fb' ? 'active' : ''}`} id="fb-panel">
            <div className="kpi-grid">
              <div className="kpi-card"><div className="kpi-label">Q1 Views</div><div className="kpi-value">322,064</div><div className="kpi-change"><span className="up">&#x2191; Mar best month (141,988)</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Reach</div><div className="kpi-value">160,565</div><div className="kpi-change"><span className="up">&#x2191; +107% Jan→Mar</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Interactions</div><div className="kpi-value">3,301</div><div className="kpi-change"><span className="up">&#x2191; Mar peak: 2,105</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Link Clicks</div><div className="kpi-value">1,819</div><div className="kpi-change">Best: Mar (828)</div></div>
              <div className="kpi-card"><div className="kpi-label">Page Visits</div><div className="kpi-value">15,413</div><div className="kpi-change">Q1 total</div></div>
              <div className="kpi-card"><div className="kpi-label">New Followers</div><div className="kpi-value">79</div><div className="kpi-change"><span className="up">&#x2191; Mar net: +47</span></div></div>
            </div>
            <div className="month-filter">
              {['all','jan','feb','mar'].map(p => (
                <button key={p} className={`month-btn ${activePeriod === p ? 'active' : ''}`} onClick={() => setActivePeriod(p)}>
                  {p === 'all' ? 'All Q1' : p.charAt(0).toUpperCase() + p.slice(1) + ({ jan: 'uary', feb: 'ruary', mar: 'ch' }[p] || '')}
                </button>
              ))}
            </div>
            <div className="two-col">
              <div className="card">
                <div className="card-title">Views & Reach</div>
                <div className="card-subtitle">Monthly comparison</div>
                <div style={{ position: 'relative', height: '220px' }}><canvas id="fbTrendChart"></canvas></div>
              </div>
              <div className="card">
                <div className="card-title">Interactions, Link Clicks & Visits</div>
                <div className="card-subtitle">Monthly engagement breakdown</div>
                <div style={{ position: 'relative', height: '220px' }}><canvas id="fbEngagementChart"></canvas></div>
              </div>
            </div>

            {/* Demographics */}
            <div style={{ marginTop: '24px' }}>
              <div className="card-title" style={{ marginBottom: '16px' }}>Audience Demographics</div>
              <div className="demo-grid">
                <div className="card">
                  <div className="demo-platform-label">&#x1F4D8; Facebook Audience</div>
                  <div className="gender-row">
                    <div className="gender-block"><div className="gender-pct f">73.5%</div><div className="gender-label">Women</div></div>
                    <div className="gender-block"><div className="gender-pct m">26.5%</div><div className="gender-label">Men</div></div>
                  </div>
                  {[['35–44','100%','44.2%'],['45–54','61.7%','27.3%'],['25–34','38.2%','16.9%'],['55–64','12.7%','5.6%'],['65+','8.4%','3.7%'],['18–24','5.2%','2.3%']].map(([label,width,val]) => (
                    <div className="demo-bar-row" key={label}><span className="demo-bar-label">{label}</span><div className="demo-bar-track"><div className="demo-bar-fill" style={{width}}></div></div><span className="demo-bar-val">{val}</span></div>
                  ))}
                </div>
                <div className="card">
                  <div className="demo-platform-label">&#x1F4D8; Facebook — Top Countries</div>
                  <ul className="geo-list">
                    {[['🇵🇭','Philippines','100%','43.9%'],['🇸🇬','Singapore','96.1%','42.2%'],['🇨🇦','Canada','6.6%','2.9%'],['🇦🇺','Australia','5.5%','2.4%'],['🇺🇸','United States','5.0%','2.2%'],['🇦🇪','UAE','2.7%','1.2%']].map(([flag,name,width,pct]) => (
                      <li className="geo-item" key={name}><span className="geo-flag">{flag}</span><span className="geo-name">{name}</span><div className="geo-bar"><div className="geo-bar-fill" style={{width}}></div></div><span className="geo-pct">{pct}</span></li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', marginBottom: '8px' }}>Top Cities</div>
                  <ul className="geo-list">
                    {[['🇸🇬','Singapore, SG','100%','41.0%'],['🇵🇭','Quezon City, PH','5.1%','2.1%'],['🇵🇭','San Fernando, PH','4.6%','1.9%'],['🇵🇭','Santa Rosa, PH','3.9%','1.6%'],['🇵🇭','Manila, PH','3.7%','1.5%']].map(([flag,name,width,pct]) => (
                      <li className="geo-item" key={name}><span className="geo-flag">{flag}</span><span className="geo-name">{name}</span><div className="geo-bar"><div className="geo-bar-fill" style={{width}}></div></div><span className="geo-pct">{pct}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* INSTAGRAM PANEL */}
          <div className={`platform-panel ${activeTab === 'ig' ? 'active' : ''}`} id="ig-panel">
            <div className="kpi-grid">
              <div className="kpi-card"><div className="kpi-label">Q1 Views</div><div className="kpi-value">43,597</div><div className="kpi-change">Best: Jan (17,532)</div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Reach</div><div className="kpi-value">14,586</div><div className="kpi-change"><span className="down">&#x2193; 9% of FB reach</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Interactions</div><div className="kpi-value">1,110</div><div className="kpi-change"><span className="up">&#x2191; Mar best: 595</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Link Clicks</div><div className="kpi-value">99</div><div className="kpi-change">Best: Jan (63)</div></div>
              <div className="kpi-card"><div className="kpi-label">Profile Visits</div><div className="kpi-value">1,280</div><div className="kpi-change">Q1 total</div></div>
              <div className="kpi-card"><div className="kpi-label">New Followers</div><div className="kpi-value">16</div><div className="kpi-change">Feb +6, Mar +6</div></div>
            </div>
            <div className="two-col">
              <div className="card"><div className="card-title">Views & Reach</div><div className="card-subtitle">Monthly comparison</div><div style={{ position: 'relative', height: '220px' }}><canvas id="igTrendChart"></canvas></div></div>
              <div className="card"><div className="card-title">Interactions, Link Clicks & Visits</div><div className="card-subtitle">Monthly engagement breakdown</div><div style={{ position: 'relative', height: '220px' }}><canvas id="igEngagementChart"></canvas></div></div>
            </div>
            <div style={{ marginTop: '24px' }} className="card">
              <div className="demo-platform-label">&#x1F4F8; Instagram — Top Countries</div>
              <div className="two-col">
                <ul className="geo-list">
                  {[['🇸🇬','Singapore','100%','65.2%'],['🇵🇭','Philippines','25.9%','16.9%'],['🇨🇦','Canada','4.1%','2.7%'],['🇮🇩','Indonesia','2.9%','1.9%'],['🇦🇺','Australia','2.8%','1.8%']].map(([flag,name,width,pct]) => (
                    <li className="geo-item" key={name}><span className="geo-flag">{flag}</span><span className="geo-name">{name}</span><div className="geo-bar"><div className="geo-bar-fill" style={{width}}></div></div><span className="geo-pct">{pct}</span></li>
                  ))}
                </ul>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted)', marginBottom: '10px' }}>Gender Split</div>
                  <div className="gender-row">
                    <div className="gender-block"><div className="gender-pct f">73.5%</div><div className="gender-label">Women</div></div>
                    <div className="gender-block"><div className="gender-pct m">26.5%</div><div className="gender-label">Men</div></div>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px', lineHeight: 1.6 }}>Instagram audience closely mirrors Facebook demographics, with Singapore leading (65.2%) compared to Facebook&apos;s split between Singapore (42.2%) and Philippines (43.9%).</p>
                </div>
              </div>
            </div>
          </div>

          {/* LINKEDIN PANEL */}
          <div className={`platform-panel ${activeTab === 'li' ? 'active' : ''}`} id="li-panel">
            <div className="kpi-grid">
              <div className="kpi-card"><div className="kpi-label">Q1 Impressions</div><div className="kpi-value">1,935</div><div className="kpi-change"><span className="up">&#x2191; +502% Jan→Mar</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Unique Impressions</div><div className="kpi-value">660</div><div className="kpi-change">Best: Mar (449)</div></div>
              <div className="kpi-card"><div className="kpi-label">Q1 Clicks</div><div className="kpi-value">111</div><div className="kpi-change">Best: Mar (75)</div></div>
              <div className="kpi-card"><div className="kpi-label">Reactions</div><div className="kpi-value">45</div><div className="kpi-change"><span className="up">&#x2191; Mar: 34 of 45</span></div></div>
              <div className="kpi-card"><div className="kpi-label">New Followers</div><div className="kpi-value">27</div><div className="kpi-change"><span className="up">&#x2191; Mar alone: +20</span></div></div>
              <div className="kpi-card"><div className="kpi-label">Page Views</div><div className="kpi-value">235</div><div className="kpi-change">Q1 total</div></div>
            </div>
            <div className="card">
              <div className="card-title">LinkedIn Monthly Performance</div>
              <div className="card-subtitle">Impressions, Clicks & Reactions by month — strong March acceleration</div>
              <div style={{ position: 'relative', height: '240px' }}><canvas id="liChart"></canvas></div>
            </div>
            <div style={{ marginTop: '16px', padding: '16px 20px', background: 'var(--primary-light)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>&#x1F4C8; LinkedIn Growth Signal</p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.6 }}>March LinkedIn impressions (1,359) were <strong style={{ color: 'var(--text)' }}>6× January&apos;s (226)</strong>. This channel is gaining momentum with minimal spend and represents a strong Q2 opportunity for B2B and parent community outreach in Singapore.</p>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* 3. WEBSITE ANALYTICS */}
        <section className="section" id="website">
          <div className="section-header">
            <div className="section-icon orange">&#x1F310;</div>
            <div>
              <div className="section-title">Website Analytics</div>
              <div className="section-subtitle">hfse.edu.sg & isa.hfse.edu.sg · Q1 2026 · Google Analytics 4</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="site-header">
              <div className="site-icon blue">&#x1F3E0;</div>
              <div><div className="site-name">hfse.edu.sg</div><div className="site-url">HFSE Global Education Group — Main website</div></div>
            </div>
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
              <div className="kpi-card primary"><div className="kpi-label">Total Views</div><div className="kpi-value">49,219</div><div className="kpi-change">Q1 2026 · All pages</div></div>
              <div className="kpi-card"><div className="kpi-label">New Users</div><div className="kpi-value">17,071</div><div className="kpi-change">First-time visitors</div></div>
              <div className="kpi-card"><div className="kpi-label">Engaged Sessions</div><div className="kpi-value">7,595</div><div className="kpi-change">Active, quality visits</div></div>
              <div className="kpi-card"><div className="kpi-label">Event Count</div><div className="kpi-value small">138,313</div><div className="kpi-change">All tracked user events</div></div>
            </div>
            <div className="card-title">Top Pages by Views</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>Q1 2026 · hfse.edu.sg</div>
            <div style={{ position: 'relative', height: '280px' }}><canvas id="topPagesChart"></canvas></div>
          </div>

          <div className="card">
            <div className="site-header">
              <div className="site-icon teal">&#x1F393;</div>
              <div><div className="site-name">isa.hfse.edu.sg</div><div className="site-url">HFSE International School — Admissions portal</div></div>
            </div>
            <div className="kpi-grid" style={{ marginBottom: '28px' }}>
              <div className="kpi-card"><div className="kpi-label">January</div><div className="kpi-value">2,026</div><div className="kpi-change">Active users</div></div>
              <div className="kpi-card"><div className="kpi-label">February</div><div className="kpi-value">1,898</div><div className="kpi-change"><span className="down">&#x2193; –6.3% vs Jan</span></div></div>
              <div className="kpi-card"><div className="kpi-label">March</div><div className="kpi-value">2,068</div><div className="kpi-change"><span className="up">&#x2191; +9.0% vs Feb</span></div></div>
              <div className="kpi-card primary"><div className="kpi-label">Q1 Total</div><div className="kpi-value">5,992</div><div className="kpi-change">Active users</div></div>
            </div>
            <div className="card-title">Daily Active Users — Jan 1 to Mar 31, 2026</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>90-day trend · isa.hfse.edu.sg</div>
            <div style={{ position: 'relative', height: '200px' }}><canvas id="isaChart"></canvas></div>
          </div>
        </section>

        <hr className="divider" />

        {/* 4. ADMISSION LEADS */}
        <section className="section" id="leads">
          <div className="section-header">
            <div className="section-icon green">&#x1F3AF;</div>
            <div>
              <div className="section-title">Admission Leads</div>
              <div className="section-subtitle">Lead volume by channel · Q1 2026 · 119 total inquiries</div>
            </div>
          </div>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-label">January</div><div className="kpi-value">45</div><div className="kpi-change">Best Q1 month</div></div>
            <div className="kpi-card"><div className="kpi-label">February</div><div className="kpi-value">37</div><div className="kpi-change"><span className="down">&#x2193; –17.8% vs Jan</span></div></div>
            <div className="kpi-card"><div className="kpi-label">March</div><div className="kpi-value">37</div><div className="kpi-change">Stable vs Feb</div></div>
            <div className="kpi-card primary"><div className="kpi-label">Q1 Total</div><div className="kpi-value">119</div><div className="kpi-change">All channels combined</div></div>
          </div>
          <div className="two-col">
            <div className="card"><div className="card-title">Lead Source by Month</div><div className="card-subtitle">Stacked by channel</div><div style={{ position: 'relative', height: '260px' }}><canvas id="leadsChart"></canvas></div></div>
            <div className="card">
              <div className="card-title">Q1 Lead Source Breakdown</div>
              <div className="card-subtitle">119 total leads</div>
              <ul className="source-list">
                {[
                  { color: '#1f45c7', name: 'Contact Us Form', count: 43, pct: '36.1%', width: '100%' },
                  { color: '#25D366', name: 'WhatsApp', count: 34, pct: '28.6%', width: '79.1%' },
                  { color: '#a8d8ea', name: 'Book Open-House Form', count: 13, pct: '10.9%', width: '30.2%' },
                  { color: '#6366f1', name: 'Event Walk-ins', count: 12, pct: '10.1%', width: '27.9%' },
                  { color: '#0084FF', name: 'Facebook Messenger', count: 11, pct: '9.2%', width: '25.6%' },
                  { color: '#fd8735', name: 'Phone Call', count: 4, pct: '3.4%', width: '9.3%' },
                  { color: '#94a3b8', name: 'Email', count: 2, pct: '1.7%', width: '4.7%' },
                ].map(s => (
                  <li className="source-item" key={s.name}>
                    <span className="source-dot" style={{ background: s.color }}></span>
                    <span className="source-name">{s.name}</span>
                    <div className="source-bar-track"><div className="source-bar-fill" style={{ width: s.width, background: s.color }}></div></div>
                    <span className="source-count">{s.count}</span>
                    <span className="source-pct">{s.pct}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* 5. EMAIL MARKETING */}
        <section className="section" id="email">
          <div className="section-header">
            <div className="section-icon purple">&#x2709;&#xFE0F;</div>
            <div>
              <div className="section-title">Email Marketing</div>
              <div className="section-subtitle">9 campaigns via Brevo · Q1 2026 · Avg open rate 54.3% (industry avg ~21%)</div>
            </div>
          </div>
          <div className="two-col" style={{ marginBottom: '24px' }}>
            <div className="kpi-card primary"><div className="kpi-label">Avg Open Rate</div><div className="kpi-value">54.3%</div><div className="kpi-change">9 campaigns · Q1 2026</div></div>
            <div className="kpi-card"><div className="kpi-label">Best Open Rate</div><div className="kpi-value">69.4%</div><div className="kpi-change">Welcome AY2026 · Jan</div></div>
            <div className="kpi-card"><div className="kpi-label">Best CTR</div><div className="kpi-value">13.9%</div><div className="kpi-change">EduTrust EOI · Mar</div></div>
            <div className="kpi-card"><div className="kpi-label">Total Emails Sent</div><div className="kpi-value small">3,044</div><div className="kpi-change">Across 9 campaigns</div></div>
          </div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-title">Campaign Performance</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>Open rate vs CTR per campaign</div>
            <div style={{ position: 'relative', height: '260px' }}><canvas id="emailChart"></canvas></div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '2px' }}>All Campaigns</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>Sorted by date · Q1 2026</div>
            <div className="email-table-wrap">
              <table className="email-table">
                <thead><tr><th>Month</th><th>Campaign</th><th>Recipients</th><th>Opens</th><th>Open Rate</th><th>Clicks</th><th>CTR</th></tr></thead>
                <tbody>
                  {[
                    { month: 'jan', name: 'Welcome AY2026', recip: 327, opens: 227, rate: '69.42%', clicks: 0, ctr: '0%', hidden: false },
                    { month: 'jan', name: "Founder's Message", recip: 294, opens: 179, rate: '60.88%', clicks: 2, ctr: '0.68%', hidden: false },
                    { month: 'feb', name: 'Jan 2026 Highlights', recip: 338, opens: 193, rate: '57.1%', clicks: 17, ctr: '5.03%', hidden: false },
                    { month: 'feb', name: 'Virtual Open House', recip: 239, opens: 90, rate: '37.66%', clicks: 11, ctr: '4.6%', hidden: true },
                    { month: 'feb', name: 'VOH Follow-up', recip: 230, opens: 113, rate: '49.13%', clicks: 2, ctr: '0.87%', hidden: true },
                    { month: 'mar', name: 'Feb 2026 Highlights', recip: 336, opens: 191, rate: '56.85%', clicks: 29, ctr: '8.63%', hidden: true },
                    { month: 'mar', name: 'EduTrust Announcement', recip: 404, opens: 228, rate: '56.44%', clicks: 38, ctr: '9.41%', hidden: true },
                    { month: 'mar', name: 'EduTrust EOI', recip: 424, opens: 274, rate: '64.62%', clicks: 59, ctr: '13.92%', hidden: true, star: true },
                    { month: 'mar', name: 'Open House (24 Mar)', recip: 252, opens: 92, rate: '36.51%', clicks: 6, ctr: '2.38%', hidden: true },
                  ].map((c, i) => (
                    <tr key={i} style={{ display: c.hidden && !emailExpanded ? 'none' : 'table-row' }}>
                      <td><span className={`month-tag ${c.month}`}>{c.month.charAt(0).toUpperCase() + c.month.slice(1)}</span></td>
                      <td style={c.star ? { fontWeight: 700, color: 'var(--primary)' } : {}}>{c.name}{c.star ? ' ⭐' : ''}</td>
                      <td>{c.recip}</td><td>{c.opens}</td>
                      <td>{c.rate}<div className="open-bar-track"><div className="open-bar-fill" style={{ width: c.rate, ...(c.star ? { background: 'var(--secondary)' } : {}) }}></div></div></td>
                      <td>{c.clicks}</td>
                      <td style={c.star ? { fontWeight: 700, color: 'var(--secondary)' } : {}}>{c.ctr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="show-all-btn" onClick={() => setEmailExpanded(!emailExpanded)}>
              {emailExpanded ? '↑ Show fewer campaigns' : 'Show all 9 campaigns ↓'}
            </button>
          </div>
        </section>

        <hr className="divider" />

        {/* 6. MARKETING SPEND */}
        <section className="section" id="spend">
          <div className="section-header">
            <div className="section-icon orange">&#x1F4B0;</div>
            <div>
              <div className="section-title">Marketing Spend</div>
              <div className="section-subtitle">Q1 2026 · $7,224.05 total investment</div>
            </div>
          </div>
          <div className="kpi-grid" style={{ marginBottom: '28px' }}>
            <div className="kpi-card orange"><div className="kpi-label">Q1 Total Spend</div><div className="kpi-value small">$7,224.05</div><div className="kpi-change">Jan–Mar 2026</div></div>
            <div className="kpi-card"><div className="kpi-label">Events & Sponsorships</div><div className="kpi-value small">$3,770</div><div className="kpi-change">52.2% of total</div></div>
            <div className="kpi-card"><div className="kpi-label">Google Ads</div><div className="kpi-value small">$2,428</div><div className="kpi-change">33.6% of total</div></div>
            <div className="kpi-card"><div className="kpi-label">Meta Ads</div><div className="kpi-value small">$659</div><div className="kpi-change">9.1% of total</div></div>
            <div className="kpi-card"><div className="kpi-label">Other Online Ad</div><div className="kpi-value small">$300</div><div className="kpi-change">4.2% of total · Tickikids</div></div>
            <div className="kpi-card"><div className="kpi-label">Email / Brevo</div><div className="kpi-value small">$67</div><div className="kpi-change">0.9% of total · Feb & Mar</div></div>
          </div>
          <div className="two-col">
            <div className="card">
              <div className="card-title">Spend by Channel</div>
              <div className="card-subtitle">Q1 2026 distribution</div>
              <div className="doughnut-wrap" style={{ height: '280px' }}>
                <canvas id="spendDoughnutChart"></canvas>
                <div className="doughnut-center">
                  <div className="doughnut-center-val">$7,224</div>
                  <div className="doughnut-center-lbl">Q1 Total</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Monthly Spend Breakdown</div>
              <div className="card-subtitle">By channel per month</div>
              <div style={{ position: 'relative', height: '280px' }}><canvas id="spendMonthlyChart"></canvas></div>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface)', borderRadius: '8px' }}>
            &#x1F4A1; <strong>Note:</strong> Q1 total spend $7,224.05 (Jan $1,646.69 + Feb $1,757.97 + Mar $3,819.39). Events & Sponsorships includes HoneyKids ($2,970), HFSE Dadbodz ($500), Griffins ($300). Other Online Ad = Tickikids ($300).
          </div>
        </section>

        <hr className="divider" />

        {/* 7. CONVERSION & ROI */}
        <section className="section" id="conversion">
          <div className="section-header">
            <div className="section-icon green">&#x1F4C8;</div>
            <div>
              <div className="section-title">Conversion & ROI</div>
              <div className="section-subtitle">Lead-to-enrolment funnel & return on ad spend · Q1 2026</div>
            </div>
          </div>
          <div className="kpi-grid" style={{ marginBottom: '28px' }}>
            <div className="kpi-card primary"><div className="kpi-label">Conversion Rate</div><div className="kpi-value">1.68%</div><div className="kpi-change">2 enrolments from 119 leads</div></div>
            <div className="kpi-card"><div className="kpi-label">ROAS</div><div className="kpi-value">3.19x</div><div className="kpi-change">$23,021 revenue / $7,224 spend</div></div>
            <div className="kpi-card"><div className="kpi-label">Cost per Conversion</div><div className="kpi-value small">$3,612</div><div className="kpi-change">Total spend ÷ 2 enrolments</div></div>
            <div className="kpi-card orange"><div className="kpi-label">Conversion Revenue</div><div className="kpi-value small">$23,020.80</div><div className="kpi-change">Q1 2026 enrolment revenue</div></div>
          </div>
          <div className="two-col">
            <div className="card"><div className="card-title">Cost per Lead by Month</div><div className="card-subtitle">Marketing spend ÷ Leads generated</div><div style={{ position: 'relative', height: '260px' }}><canvas id="cplChart"></canvas></div></div>
            <div className="card"><div className="card-title">Marketing Spend vs Conversion Revenue</div><div className="card-subtitle">Q1 2026 ROI summary</div><div style={{ position: 'relative', height: '260px' }}><canvas id="roiChart"></canvas></div></div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface)', borderRadius: '8px' }}>
            &#x1F4A1; <strong>Note:</strong> 2 enrolments in Q1 2026 (1 Feb, 1 Mar). Conversion Rate = Enrolments ÷ Total Leads. ROAS = Conversion Revenue ÷ Marketing Spend.
          </div>
        </section>

        <hr className="divider" />

        {/* 8. TOP PERFORMING POSTS */}
        <section className="section" id="posts">
          <div className="section-header">
            <div className="section-icon blue">&#x1F3C6;</div>
            <div>
              <div className="section-title">Top Performing Posts</div>
              <div className="section-subtitle">Ranked by views · Q1 2026 · Facebook</div>
            </div>
          </div>
          <div className="posts-grid">
            {[
              { rank: 1, badge: 'gold', type: 'Facebook Reel', title: '"Big News! HFSE International School is now officially EduTrust Certified!"', views: '7,466', reach: '4,315', seconds: '86,840', link: 'https://www.facebook.com/reel/1623184182335662/', top: true },
              { rank: 2, badge: 'silver', type: 'Facebook', title: '"Congratulations, HFSE Champions! Speech & Drama Merit Awards"', views: '5,983', reach: '1,951', link: 'https://www.facebook.com/hfseinternational/posts/pfbid02BHUzNfMvtTkyyif4xjA2w678nR4eHWobFTe77LTr6yc9sdNKrFikTtn1DnAJx6r8l' },
              { rank: 3, badge: 'bronze', type: 'Facebook', title: '"Friendship Night 2026: Where Memories Shine Bright"', views: '4,822', reach: '1,837', link: 'https://www.facebook.com/hfseinternational/posts/pfbid02YoY54kUNJ9jx5XewzHQvuKCAZQQDbTP1CPRZeixqLRqPsvi2nvUfcE7FPSvcUHWtl' },
              { rank: 4, badge: 'plain', type: 'Facebook', title: '"Become a Champion for Learners: JOIN OUR H.A.P.I DREAM TEAM!"', views: '3,267', reach: '1,941', link: 'https://www.facebook.com/hfseinternational/posts/pfbid034ZpZ4KZu34Wm4ZJNCD7aLKJmUuHmKRfwHYijCaPN3YPT927PYPr6cBvA7JbPeAE5l' },
              { rank: 5, badge: 'plain', type: 'Facebook Reel', title: '"Behind the scenes, we have been working on a significant milestone…"', views: '2,902', reach: '1,639', seconds: '20,451', link: 'https://www.facebook.com/reel/931424586242442/' },
              { rank: 6, badge: 'plain', type: 'Facebook', title: '"It\'s a wrap! Term 1 was filled with learning, growth, and memorable moments…"', views: '2,874', reach: '1,267', link: 'https://www.facebook.com/hfseinternational/posts/pfbid02Q3vmnkTuEV3A87vpSMPVCEQtN8PbJF7pTGXoitn1X2NC3PhweExmgb1XwNeAB9QEl' },
            ].map(post => (
              <div className={`post-card ${post.top ? 'top' : ''}`} key={post.rank}>
                <div className="post-card-header">
                  <div className={`rank-badge ${post.badge}`}>#{post.rank}</div>
                  <span className="post-platform-tag">&#x1F4D8; {post.type}</span>
                </div>
                <div className="post-title">{post.title}</div>
                <div className="post-metrics">
                  <div className="post-metric"><div className="post-metric-val primary">{post.views}</div><div className="post-metric-lbl">Views</div></div>
                  <div className="post-metric"><div className="post-metric-val">{post.reach}</div><div className="post-metric-lbl">Reach</div></div>
                  {post.seconds && <div className="post-metric"><div className="post-metric-val">{post.seconds}</div><div className="post-metric-lbl">Seconds Viewed</div></div>}
                </div>
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">View Post →</a>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* 9. RECOMMENDATIONS */}
        <section className="section" id="recommendations">
          <div className="section-header">
            <div className="section-icon orange">&#x1F4A1;</div>
            <div>
              <div className="section-title">Strategic Recommendations</div>
              <div className="section-subtitle">Data-driven actions for Q2 2026 based on Q1 performance</div>
            </div>
          </div>
          <div className="reco-grid">
            {[
              { priority: 'high', icon: '🎓', title: 'Double Down on EduTrust Content', body: 'The EduTrust certification reel drove 7,466 views and 86,840 seconds viewed — the highest of any Q1 post and well above average. Create follow-up EduTrust content: parent FAQs, what EduTrust means for students, and testimonial videos.', metric: '📊 #1 post: 7,466 views · 86,840 seconds viewed' },
              { priority: 'high', icon: '📸', title: 'Activate & Grow Instagram', body: 'Instagram reach (14,586) is only 9% of Facebook\'s (160,565), yet both audiences share near-identical demographics. Systematically repurpose top Facebook posts as IG Reels. Set a weekly posting cadence with Stories for event coverage.', metric: '📊 IG reach = 9% of FB · Same audience demo' },
              { priority: 'high', icon: '💰', title: 'Measure Event ROI vs Lead Attribution', body: '51.7% of Q1 spend ($3,737) went to events and sponsorships — the single largest cost center. However only 12 event walk-in leads were captured. Implement strict lead capture at all events in Q2 to measure true cost-per-lead.', metric: '📊 $3,737 events · only 12 walk-in leads captured · 0.84% conversion rate' },
              { priority: 'medium', icon: '💬', title: 'Strengthen WhatsApp & Form CTAs', body: 'Contact Us Form (43 leads, 36.1%) and WhatsApp (34 leads, 28.6%) are the top two lead channels. Add a WhatsApp click-to-chat button in every Facebook post caption and email footer. Ensure all form confirmations have an immediate follow-up auto-reply.', metric: '📊 Contact Form + WhatsApp = 64.7% of all Q1 leads' },
              { priority: 'medium', icon: '📈', title: 'Sustain the March Momentum', body: 'March was the strongest month across all metrics: FB reach +32% vs Feb, FB interactions +411% vs Feb, LinkedIn impressions 6× vs January. Identify and document what drove this surge (EduTrust news, event mix, posting frequency) and replicate the playbook in Q2.', metric: '📊 Mar FB interactions: 2,105 vs Jan: 784 (+168%)' },
              { priority: 'medium', icon: '✉️', title: 'Scale High-Performing Email Formats', body: 'EduTrust EOI had the highest CTR at 13.92% — nearly 10× the average CTR. The template combined urgency (limited spots), social proof (certification), and a clear CTA. Apply this formula to upcoming Open House and enrollment deadline campaigns.', metric: '📊 EduTrust EOI: 13.92% CTR vs avg ~5.3%' },
              { priority: 'insight', icon: '💼', title: 'Invest More in LinkedIn', body: 'LinkedIn impressions grew 502% from January (226) to March (1,359) with near-zero incremental spend. This is a high-value channel for reaching Singapore-based parents and education professionals. Increase posting frequency to 3× per week and consider a small sponsored content budget in Q2.', metric: '📊 LinkedIn impressions: +502% Jan→Mar · Low cost' },
            ].map((r, i) => (
              <div className={`reco-card ${r.priority}`} key={i}>
                <div className="reco-header">
                  <span className="reco-icon">{r.icon}</span>
                  <span className={`reco-badge ${r.priority}`}>{r.priority === 'insight' ? 'Growth Insight' : r.priority.charAt(0).toUpperCase() + r.priority.slice(1) + ' Priority'}</span>
                </div>
                <div className="reco-title">{r.title}</div>
                <div className="reco-body">{r.body}</div>
                <span className="reco-metric">{r.metric}</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">
          <img src="/LOGO_SOLID (3).png" alt="HFSE International School" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <div className="footer-text">
          <strong>HFSE International School</strong> — Q1 2026 Marketing Performance Dashboard<br />
          Generated April 14, 2026 &nbsp;&middot;&nbsp;
          Data: Meta Business Suite · Google Analytics 4 (hfse.edu.sg &amp; isa.hfse.edu.sg) · HFSE IS Internal CRM · Brevo Email Platform
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Prepared by Neri Lopez | Marketing Research &amp; Development</div>
      </footer>
    </>
  );
}
