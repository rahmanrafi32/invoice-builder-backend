import dayjs from 'dayjs';
import puppeteer from 'puppeteer';
import { Invoice } from '../entities/invoice.entities';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Generates HTML content for the invoice
 */
export function generateInvoiceHtml(invoice: Invoice): string {
  const formattedDate = dayjs(invoice.issueDate).format('DD/MM/YYYY');
  const monthName = dayjs(invoice.month).format('MMMM YYYY');
  const amount = Number(invoice.amount).toFixed(2);

  const emptyRows = Array.from(
    { length: 19 },
    () => `<tr><td></td><td></td><td></td><td></td></tr>`,
  ).join('');

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=794"/>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }

            html, body {
              width: 794px;
              height: 1123px;
            }

            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              color: #1a1a2e;
              background: #fff;
              padding: 48px 56px;
              display: flex;
              flex-direction: column;
            }

            /* ── HEADER ── */
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 22px;
            }

            .sender-name {
              font-size: 19px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .sender-address {
              background: #f5e642 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              padding: 3px 6px;
              font-size: 12px;
              display: inline-block;
              line-height: 1.55;
            }

            .invoice-title {
              font-size: 44px;
              font-style: italic;
              color: #a0aab4;
              text-align: right;
              line-height: 1;
              margin-bottom: 10px;
            }

            .meta-grid {
              display: grid;
              grid-template-columns: auto auto;
              gap: 3px 0;
              justify-content: end;
            }

            .meta-label {
              font-size: 12px;
              color: #333;
              padding-right: 10px;
              text-align: right;
              display: flex;
              align-items: center;
            }

            .meta-value {
              background: #f5e642 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              padding: 2px 10px;
              font-size: 12px;
              font-weight: 600;
              min-width: 120px;
            }

            /* ── BILL TO ── */
            .bill-section {
              margin-bottom: 20px;
            }

            .bill-row {
              display: flex;
            }

            .bill-label {
              font-weight: bold;
              font-size: 13px;
              min-width: 48px;
              padding-top: 1px;
            }

            .bill-name {
              font-weight: bold;
              font-size: 13px;
            }

            .bill-address {
              font-size: 12px;
              color: #444;
              line-height: 1.65;
              margin-top: 2px;
            }

            /* ── INVOICE TABLE ── */
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
            }

            .invoice-table thead tr {
              background: #4a6f8a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color: #fff;
            }

            .invoice-table thead th {
              padding: 9px 10px;
              font-size: 12px;
              font-weight: bold;
              text-align: left;
            }

            .invoice-table thead th:nth-child(3),
            .invoice-table thead th:nth-child(4) {
              text-align: right;
            }

            .invoice-table tbody tr:nth-child(odd) {
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .invoice-table tbody tr:nth-child(even) {
              background: #dce8f0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .invoice-table tbody td {
              padding: 0 10px;
              height: 21px;
              font-size: 12px;
              color: #333;
            }

            .invoice-table tbody td:nth-child(3),
            .invoice-table tbody td:nth-child(4) {
              text-align: right;
            }

            /* ── BOTTOM ── */
            .bottom-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-top: 1px solid #bbb;
              padding-top: 12px;
              margin-top: 0;
            }

            .payment-block {
              max-width: 360px;
            }

            .payment-intro {
              font-size: 12px;
              color: #333;
              line-height: 1.9;
            }

            .payee-name {
              color: #1a4a8a;
              font-weight: 700;
            }

            .bank-table {
              border-collapse: collapse;
              margin-top: 2px;
            }

            .bank-table td {
              font-size: 12px;
              color: #333;
              padding: 1.5px 0;
              vertical-align: top;
              line-height: 1.7;
            }

            .bank-table td:first-child {
              white-space: nowrap;
              padding-right: 6px;
            }

            /* ── TOTALS ── */
            .totals-block {
              width: 240px;
            }

            .totals-table {
              border-collapse: collapse;
              width: 100%;
              table-layout: fixed;
            }

            .totals-table td {
              font-size: 12px;
              padding: 3px 8px;
              color: #333;
            }

            .totals-table td:first-child {
              text-align: left;
              width: 80px;
            }

            .totals-table td:nth-child(2) {
              text-align: right;
              width: 24px;
            }

            .totals-table td:last-child {
              text-align: right;
              width: 136px;
            }

            .totals-table .divider td {
              border-top: 1.5px solid #1a1a2e;
              padding-top: 5px;
              font-weight: bold;
              font-size: 13px;
              color: #1a1a2e;
            }

            /* ── FOOTER ── */
            .footer {
              padding-top: 16px;
              text-align: center;
              font-size: 11.5px;
              color: #5a7fa0;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>

          <!-- HEADER -->
          <div class="header">
            <div>
              <div class="sender-name">Minhazur Rahman Rafi</div>
              <div class="sender-address">183/56 Kazi Villa, 12 no Road, Bagbari, Sylhet, Bangladesh.</div>
            </div>
            <div>
              <div class="invoice-title">Invoice</div>
              <div class="meta-grid">
                <span class="meta-label">Date:</span>
                <span class="meta-value">${formattedDate}</span>
                <span class="meta-label">Invoice #:</span>
                <span class="meta-value">${invoice.invoiceNumber}</span>
              </div>
            </div>
          </div>

          <!-- BILL TO -->
          <div class="bill-section">
            <div class="bill-row">
              <div class="bill-label">To:</div>
              <div>
                <div class="bill-name">Infarsight FZ LLC</div>
                <div class="bill-address">
                  CWEP0325 Compass Building, Al Shohada Road,<br/>
                  AL Hamra Industrial Zone-FZ,<br/>
                  Ras Al Khaimah, 10055, Ras Al Khaimah
                </div>
              </div>
            </div>
          </div>

          <!-- TABLE -->
          <table class="invoice-table">
            <thead>
              <tr>
                <th style="width:62px">Sr. No.</th>
                <th>Description</th>
                <th style="width:110px">Unit Price</th>
                <th style="width:110px">Line Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>Professional Services for the month of ${monthName}</td>
                <td></td>
                <td>$&nbsp;&nbsp;${amount}</td>
              </tr>
              ${emptyRows}
            </tbody>
          </table>

          <!-- BOTTOM -->
          <div class="bottom-section">
            <div class="payment-block">
              <div class="payment-intro">Please make checks payable to</div>
              <div class="payment-intro">
                Wire transfer to credit of - <span class="payee-name">Md Minhazur Rahman Rafi</span>
              </div>
              <table class="bank-table">
                <tr><td>Bank Name-</td><td>The City Bank</td></tr>
                <tr><td>Bank Account No -</td><td>2933502880001</td></tr>
                <tr><td>Bank Branch Name -</td><td>Ambarkhana, Sylhet, Bangladesh.</td></tr>
                <tr><td>Routing Code -</td><td>225910041</td></tr>
                <tr><td>SWIFT Code -</td><td>CIBLBDDH</td></tr>
              </table>
            </div>

            <div class="totals-block">
              <table class="totals-table">
                <tr>
                  <td>Subtotal</td>
                  <td>$</td>
                  <td>${amount}</td>
                </tr>
                <tr>
                  <td>Tax</td>
                  <td>$</td>
                  <td>-</td>
                </tr>
                <tr class="divider">
                  <td>Total</td>
                  <td>$</td>
                  <td>${amount}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- spacer -->
          <div style="flex: 1;"></div>

          <!-- FOOTER -->
          <div class="footer">
            183/56 Kazi Villa, 12 no Road, Bagbari, Sylhet, Bangladesh.
          </div>

        </body>
      </html>
    `;
}

/**
 * Generates a PDF from HTML and uploads it to Cloudinary
 */
export async function generateAndUploadPdf(
  invoice: Invoice,
  cloudinaryService: CloudinaryService,
): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

  const htmlContent = generateInvoiceHtml(invoice);

  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
  });

  const pdfBuffer = await page.pdf({
    width: '794px',
    height: '1123px',
    printBackground: true,
    margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
  });

  await browser.close();

  const monthName = dayjs(invoice.month).format('MMMM');
  const fileName = `Invoice_${monthName}_${Date.now()}`;

  return await cloudinaryService.uploadPdfBuffer(
    Buffer.from(pdfBuffer),
    fileName,
  );
}

export function transformInvoiceWithUrls(invoice: Invoice) {
  return {
    ...invoice,
    pdfPreviewUrl: cloudinary.url(invoice.pdfPath, {
      resource_type: 'raw',
      secure: true,
    }),
    pdfDownloadUrl: cloudinary.url(invoice.pdfPath, {
      resource_type: 'raw',
      flags: 'attachment',
      secure: true,
    }),
  };
}

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    const uploadIndex = pathParts.findIndex(
      (part) => part === 'upload' || part.startsWith('v'),
    );

    if (uploadIndex !== -1) {
      const publicIdParts = pathParts.slice(uploadIndex + 1);
      const publicIdWithExt = publicIdParts.join('/');
      return publicIdWithExt.replace(/\.[^/.]+$/, '');
    }

    return null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
}
