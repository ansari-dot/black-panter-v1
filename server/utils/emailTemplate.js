export const generateQuotationEmailHTML = (q, adminMessage = '') => {
  const materialsSubtotal = (q.materials || []).reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0);
  const labourSubtotal = (q.labour || []).reduce((sum, item) => sum + ((item.hours || 0) * (item.rate || 0)), 0);
  const equipmentSubtotal = (q.equipment || []).reduce((sum, item) => sum + ((item.qtyHrs || 0) * (item.rate || 0)), 0);
  const additionalSubtotal = (q.additionalCharges || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  const subtotal = materialsSubtotal + labourSubtotal + equipmentSubtotal + additionalSubtotal;

  const discountVal = q.discountValue || 0;
  const discountAmount = q.discountType === 'percentage' ? (subtotal * discountVal / 100) : discountVal;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * ((q.taxRate || 10) / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Convert newlines in admin message to html breaks
  const formattedMessage = adminMessage.trim().replace(/\n/g, '<br />');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quotation ${q.quoteNo}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      max-width: 700px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #e2e2e2;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #1a1a1a;
      color: #ffffff;
      padding: 24px;
      text-align: center;
      border-bottom: 4px solid #f15a22;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .content {
      padding: 28px;
    }
    .message-card {
      background-color: #fff9f6;
      border-left: 4px solid #f15a22;
      padding: 16px 20px;
      margin-bottom: 24px;
      border-radius: 4px;
      font-size: 14px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: #f15a22;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #f15a22;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .grid {
      display: table;
      width: 100%;
      table-layout: fixed;
      margin-bottom: 16px;
    }
    .col {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }
    .meta-table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;
    }
    .meta-table td {
      padding: 4px 0;
    }
    .meta-label {
      color: #666;
      font-weight: 500;
      width: 100px;
    }
    .meta-value {
      font-weight: 600;
    }
    .spec-badge {
      display: inline-block;
      background-color: #f5f5f5;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      margin-right: 8px;
      margin-bottom: 8px;
      border: 1px solid #e2e2e2;
    }
    .spec-label {
      color: #666;
      font-weight: 500;
    }
    .spec-value {
      font-weight: bold;
    }
    .scope-item {
      font-size: 13px;
      padding: 6px 0;
      display: flex;
      align-items: center;
    }
    .pricing-table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .pricing-table th {
      background-color: #fafafa;
      border-bottom: 1px solid #e2e2e2;
      padding: 8px;
      font-weight: 600;
      text-align: left;
    }
    .pricing-table td {
      border-bottom: 1px solid #f0f0f0;
      padding: 8px;
    }
    .totals-box {
      width: 260px;
      float: right;
      font-size: 13px;
      margin-top: 16px;
      margin-bottom: 24px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .grand-total {
      font-size: 16px;
      font-weight: bold;
      color: #f15a22;
      border-top: 1px solid #e2e2e2;
      padding-top: 8px;
      margin-top: 8px;
    }
    .bank-details {
      background-color: #fafafa;
      border: 1px solid #e2e2e2;
      border-radius: 8px;
      padding: 16px;
      font-size: 13px;
      margin-top: 24px;
      clear: both;
    }
    .footer {
      background-color: #1a1a1a;
      color: #888888;
      padding: 20px;
      font-size: 11px;
      text-align: center;
      border-top: 1px solid #e2e2e2;
    }
    .footer a {
      color: #f15a22;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>BLACK PANTHER BATTERIES</h1>
      <div style="font-size:12px; color:#aaa; margin-top:4px;">Power &amp; Maintenance Solutions</div>
    </div>
    
    <div class="content">
      <!-- Admin Custom Email Message -->
      ${formattedMessage ? `<div class="message-card">${formattedMessage}</div>` : ''}
      
      <!-- Quotation Header -->
      <div class="grid">
        <div class="col" style="padding-right: 10px;">
          <div class="section-title">Client Details</div>
          <table class="meta-table">
            <tr><td class="meta-label">Company</td><td class="meta-value">${q.client?.companyName || 'N/A'}</td></tr>
            <tr><td class="meta-label">Contact</td><td class="meta-value">${q.client?.contactPerson || 'N/A'}</td></tr>
            <tr><td class="meta-label">Email</td><td class="meta-value">${q.client?.email || 'N/A'}</td></tr>
            <tr><td class="meta-label">Phone</td><td class="meta-value">${q.client?.phone || 'N/A'}</td></tr>
            <tr><td class="meta-label">ABN</td><td class="meta-value">${q.client?.abn || 'N/A'}</td></tr>
          </table>
        </div>
        <div class="col" style="padding-left: 10px;">
          <div class="section-title">Quotation details</div>
          <table class="meta-table">
            <tr><td class="meta-label">Quote No</td><td class="meta-value" style="color:#f15a22;">${q.quoteNo}</td></tr>
            <tr><td class="meta-label">Date</td><td class="meta-value">${q.quoteDate}</td></tr>
            <tr><td class="meta-label">Expiry Date</td><td class="meta-value">${q.expiryDate}</td></tr>
            <tr><td class="meta-label">Prepared By</td><td class="meta-value">${q.preparedBy || 'Sales Team'}</td></tr>
            <tr><td class="meta-label">Project</td><td class="meta-value">${q.projectName || 'N/A'}</td></tr>
          </table>
        </div>
      </div>
      
      <!-- Battery Specifications -->
      ${q.battery?.batteryType ? `
        <div class="section-title">Battery Specifications</div>
        <div style="margin-bottom: 12px;">
          <div class="spec-badge"><span class="spec-label">Type:</span> <span class="spec-value">${q.battery.batteryType}</span></div>
          ${q.battery.manufacturer ? `<div class="spec-badge"><span class="spec-label">Manufacturer:</span> <span class="spec-value">${q.battery.manufacturer}</span></div>` : ''}
          ${q.battery.model ? `<div class="spec-badge"><span class="spec-label">Model:</span> <span class="spec-value">${q.battery.model}</span></div>` : ''}
          ${q.battery.voltage ? `<div class="spec-badge"><span class="spec-label">Voltage:</span> <span class="spec-value">${q.battery.voltage}</span></div>` : ''}
          ${q.battery.capacity ? `<div class="spec-badge"><span class="spec-label">Capacity:</span> <span class="spec-value">${q.battery.capacity}</span></div>` : ''}
          ${q.battery.cells ? `<div class="spec-badge"><span class="spec-label">Cells:</span> <span class="spec-value">${q.battery.cells}</span></div>` : ''}
          ${q.battery.location ? `<div class="spec-badge"><span class="spec-label">Location:</span> <span class="spec-value">${q.battery.location}</span></div>` : ''}
        </div>
      ` : ''}

      <!-- Scope of Work Checklist -->
      ${q.scopeOfWork && q.scopeOfWork.length > 0 ? `
        <div class="section-title">Scope of Work</div>
        <div style="margin-bottom: 16px;">
          ${q.scopeOfWork.map(item => `
            <div class="scope-item">
              <span style="color:#22c55e; font-weight:bold; margin-right:8px;">✔</span>
              <span>${item.name}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Pricing Table -->
      <div class="section-title">Pricing &amp; Cost Breakdown</div>
      <table class="pricing-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right; width: 60px;">Qty / Hrs</th>
            <th style="text-align: right; width: 100px;">Rate</th>
            <th style="text-align: right; width: 100px;">Total</th>
          </tr>
        </thead>
        <tbody>
          <!-- Materials -->
          ${(q.materials || []).map(item => `
            <tr>
              <td>${item.desc}</td>
              <td style="text-align: right;">${item.qty}</td>
              <td style="text-align: right;">$${(item.price || 0).toFixed(2)}</td>
              <td style="text-align: right; font-weight:600;">$${((item.qty || 0) * (item.price || 0)).toFixed(2)}</td>
            </tr>
          `).join('')}
          <!-- Labour -->
          ${(q.labour || []).map(item => `
            <tr>
              <td>Labour: ${item.desc}</td>
              <td style="text-align: right;">${item.hours}</td>
              <td style="text-align: right;">$${(item.rate || 0).toFixed(2)}</td>
              <td style="text-align: right; font-weight:600;">$${((item.hours || 0) * (item.rate || 0)).toFixed(2)}</td>
            </tr>
          `).join('')}
          <!-- Equipment -->
          ${(q.equipment || []).map(item => `
            <tr>
              <td>Equipment: ${item.desc}</td>
              <td style="text-align: right;">${item.qtyHrs}</td>
              <td style="text-align: right;">$${(item.rate || 0).toFixed(2)}</td>
              <td style="text-align: right; font-weight:600;">$${((item.qtyHrs || 0) * (item.rate || 0)).toFixed(2)}</td>
            </tr>
          `).join('')}
          <!-- Additional Charges -->
          ${(q.additionalCharges || []).map(item => `
            <tr>
              <td>Charges: ${item.desc}</td>
              <td style="text-align: right;">1</td>
              <td style="text-align: right;">$${(item.amount || 0).toFixed(2)}</td>
              <td style="text-align: right; font-weight:600;">$${(item.amount || 0).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Totals -->
      <div class="totals-box">
        <div class="totals-row">
          <span style="color:#666;">Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        ${discountAmount > 0 ? `
          <div class="totals-row">
            <span style="color:#666;">Discount:</span>
            <span>-$${discountAmount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="totals-row">
          <span style="color:#666;">GST (10%):</span>
          <span>$${taxAmount.toFixed(2)}</span>
        </div>
        <div class="totals-row grand-total">
          <span>Grand Total:</span>
          <span>$${grandTotal.toFixed(2)} AUD</span>
        </div>
      </div>
      <div style="clear: both;"></div>

      <!-- Bank Details -->
      ${q.showBankDetails && q.bankName ? `
        <div class="bank-details">
          <div style="font-weight: bold; color: #1a1a1a; margin-bottom: 8px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Payment Bank Details</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr><td style="color:#666; width:100px;">Bank Name</td><td style="font-weight:600;">${q.bankName}</td></tr>
            <tr><td style="color:#666;">Account Name</td><td style="font-weight:600;">${q.accountName}</td></tr>
            <tr><td style="color:#666;">BSB</td><td style="font-weight:600;">${q.bsb}</td></tr>
            <tr><td style="color:#666;">Account No</td><td style="font-weight:600;">${q.accountNumber}</td></tr>
          </table>
        </div>
      ` : ''}
      
      <!-- Terms and conditions -->
      ${q.terms && q.terms.length > 0 ? `
        <div class="section-title">Terms &amp; Conditions</div>
        <ol style="font-size: 11px; color:#555; padding-left: 16px; margin: 0; line-height: 1.8;">
          ${q.terms.map(term => `<li>${term}</li>`).join('')}
        </ol>
      ` : ''}
    </div>
    
    <div class="footer">
      <div>Black Panther Batteries Pty Ltd &copy; 2026</div>
      <div style="margin-top: 4px;">If you have any questions, please contact our support at <a href="mailto:support@blackpantherbatteries.com.au">support@blackpantherbatteries.com.au</a></div>
    </div>
  </div>
</body>
</html>
  `;
};
