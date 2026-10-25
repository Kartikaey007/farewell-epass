<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Organizer Portal | Montfort Farewell</title>
    <meta name="description" content="Event organizer portal for scanning farewell e-pass QR codes." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="hero-banner" style="min-height: 240px;">
      <div class="hero-overlay"></div>
      <div class="hero-content" style="padding-bottom: 1.5rem;">
        <div class="brand-row">
          <img src="logo.svg" alt="Montfort logo" class="brand-logo" />
          <div class="brand-copy">
            <p class="small-label">Organizer Panel</p>
            <h1 style="letter-spacing: 0.15em;">MONTFORT</h1>
          </div>
        </div>
        <div class="divider"></div>
        <h2 style="font-size: clamp(2.7rem, 7vw, 5.5rem);">FAREWELL 2026</h2>
      </div>
    </header>

    <main class="organizer-shell">
      <section class="organizer-panel">
        <div class="organizer-header">
          <h3>Entry Manager</h3>
          <a class="header-link" href="index.html">Student portal</a>
        </div>

        <div id="pinScreen">
          <div class="pin-box">
            <label>Enter organizer PIN</label>
            <input id="pinInput" type="password" placeholder="••••••" />
            <button id="pinSubmit" class="pin-btn" type="button">Open dashboard</button>
          </div>
        </div>

        <div id="dashboard" class="dashboard">
          <div class="stats-grid">
            <div class="stat-card">
              <small>Total Passes</small>
              <strong id="totalPasses">0</strong>
            </div>
            <div class="stat-card">
              <small>Checked In</small>
              <strong id="checkedInCount">0</strong>
            </div>
            <div class="stat-card">
              <small>Pending</small>
              <strong id="pendingCount">0</strong>
            </div>
          </div>

          <div class="scanner-layout">
            <div>
              <div id="reader"></div>
              <div class="scanner-actions">
                <button id="startScan" class="scan-btn" type="button">Start QR Scan</button>
                <button id="stopScan" class="reset-btn" type="button">Stop</button>
              </div>
            </div>

            <div class="scanner-status-box">
              <h4>Last scan</h4>
              <div id="scanResult">Waiting for QR scan...</div>
            </div>
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="margin:0 0 0.5rem;">Registered entries</h4>
            <div class="entry-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Pass ID</th>
                    <th>Status</th>
                    <th>Scanned at</th>
                  </tr>
                </thead>
                <tbody id="entryTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/minified/html5-qrcode.min.js"></script>
    <script src="organizer.js"></script>
  </body>
</html>
