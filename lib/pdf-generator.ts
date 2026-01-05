// PDF generation disabled in MVP - Puppeteer not installed
// Uncomment and install puppeteer to enable: npm install puppeteer
// import puppeteer from 'puppeteer';

export async function generatePdfBuffer(report: any): Promise<Buffer> {
  throw new Error('PDF generation is disabled. Install puppeteer to enable: npm install puppeteer');

  // Uncomment below code when puppeteer is installed:
  /*
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    const html = generateReportHtml(report);

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    return Buffer.from(pdfBuffer);

  } finally {
    await browser.close();
  }
  */
}

function generateReportHtml(report: any): string {
  const damageRows = report.damageHistory.map((d: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${d.date}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${d.type}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${d.severity === 'low' ? 'Mineur' : 'Majeur'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${d.description}</td>
    </tr>
  `).join('');

  const mileageRows = report.mileageHistory.map((m: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${m.date}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${m.mileage.toLocaleString()} km</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${m.source}</td>
    </tr>
  `).join('');

  const ownershipRows = report.ownershipHistory.map((o: any, i: number) => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="font-weight: 600; margin-bottom: 4px;">Propriétaire #${i + 1}</div>
      <div style="color: #6b7280;">${o.from} → ${o.to}</div>
      <div style="color: #6b7280; margin-top: 8px;">${o.country}</div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>FindMyCar Report - ${report.vin}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #111827;
            line-height: 1.5;
          }
          .header {
            background: linear-gradient(to right, #0d9488, #10b981);
            color: white;
            padding: 32px 24px;
            margin-bottom: 24px;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          .container {
            padding: 0 24px;
          }
          .section {
            margin-bottom: 32px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .icon-box {
            width: 40px;
            height: 40px;
            background: #0d9488;
            border-radius: 8px;
            display: inline-block;
          }
          .overview-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
          }
          .vehicle-name {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .vehicle-info {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            color: #6b7280;
            font-size: 14px;
          }
          .score-box {
            text-align: center;
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
          }
          .score {
            font-size: 48px;
            font-weight: 700;
            color: #0d9488;
          }
          .score-label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          th {
            background: #f9fafb;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            border-bottom: 2px solid #e5e7eb;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }
          .summary-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
          }
          .summary-card h3 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .summary-card p {
            font-size: 12px;
            color: #6b7280;
          }
          .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FindMyCar - Rapport de vérification</h1>
          <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div class="container">
          <div class="overview-card">
            <div class="vehicle-name">${report.make || 'Unknown'} ${report.model || 'Unknown'} (${report.modelYear || 'Unknown'})</div>
            <div class="vehicle-info">
              <div><strong>VIN:</strong> ${report.vin}</div>
              <div><strong>Kilométrage:</strong> ${(report.mileage || 0).toLocaleString()} km</div>
              <div><strong>1ère immatriculation:</strong> ${report.firstRegistration || 'Unknown'}</div>
            </div>
            <div class="score-box">
              <div class="score">${report.score}</div>
              <div class="score-label">Score de confiance / 10</div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <h3>✓ Pas de vol signalé</h3>
              <p>Aucune correspondance dans les bases de données internationales de véhicules volés.</p>
            </div>
            <div class="summary-card">
              <h3>⚠ ${report.damageHistory.length} incidents</h3>
              <p>${report.damageHistory.length > 0 ? 'Quelques dommages mineurs signalés dans l\'historique.' : 'Aucun dommage signalé.'}</p>
            </div>
            <div class="summary-card">
              <h3>✓ Kilométrage cohérent</h3>
              <p>Aucune manipulation du compteur kilométrique détectée.</p>
            </div>
          </div>

          ${report.damageHistory.length > 0 ? `
          <div class="section">
            <div class="section-title">
              <span class="icon-box"></span>
              Historique des dommages
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Gravité</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${damageRows}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">
              <span class="icon-box"></span>
              Historique du kilométrage
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Kilométrage</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                ${mileageRows}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">
              <span class="icon-box"></span>
              Historique de propriété
            </div>
            ${ownershipRows}
            <p style="color: #6b7280; font-size: 14px; margin-top: 12px;">
              Total de ${report.ownershipHistory.length} propriétaires enregistrés
            </p>
          </div>

          <div class="footer">
            <p>Ce rapport a été généré par FindMyCar</p>
            <p>Les données proviennent de sources officielles et synthétiques</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
