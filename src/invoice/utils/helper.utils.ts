import dayjs from 'dayjs';
import { Invoice } from '../entities/invoice.entities';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import PdfPrinter from 'pdfmake/src/printer';

let fonts: {
  Roboto?: {
    normal?: Buffer;
    bold?: Buffer;
    italics?: Buffer;
    bolditalics?: Buffer;
  };
} = {};

function initializeFonts() {
  if (Object.keys(fonts).length > 0) {
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfMakeFonts = require('pdfmake/build/vfs_fonts');
    const vfsFonts = pdfMakeFonts.vfs || pdfMakeFonts;

    const fontData: {
      normal?: Buffer;
      bold?: Buffer;
      italics?: Buffer;
      bolditalics?: Buffer;
    } = {
      normal: undefined,
      bold: undefined,
      italics: undefined,
      bolditalics: undefined,
    };

    // Safe font loading with validation
    try {
      if (vfsFonts['Roboto-Regular.ttf']) {
        fontData.normal = Buffer.from(
          vfsFonts['Roboto-Regular.ttf'] as string,
          'base64',
        );
      }
    } catch (error) {
      console.warn('Failed to load Roboto-Regular.ttf:', error);
    }

    try {
      if (vfsFonts['Roboto-Medium.ttf']) {
        fontData.bold = Buffer.from(
          vfsFonts['Roboto-Medium.ttf'] as string,
          'base64',
        );
      }
    } catch (error) {
      console.warn('Failed to load Roboto-Medium.ttf:', error);
    }

    try {
      if (vfsFonts['Roboto-Italic.ttf']) {
        fontData.italics = Buffer.from(
          vfsFonts['Roboto-Italic.ttf'] as string,
          'base64',
        );
      }
    } catch (error) {
      console.warn('Failed to load Roboto-Italic.ttf:', error);
    }

    try {
      if (vfsFonts['Roboto-MediumItalic.ttf']) {
        fontData.bolditalics = Buffer.from(
          vfsFonts['Roboto-MediumItalic.ttf'] as string,
          'base64',
        );
      }
    } catch (error) {
      console.warn('Failed to load Roboto-MediumItalic.ttf:', error);
    }

    fonts = {
      Roboto: fontData,
    };
  } catch (error) {
    console.error('Error initializing pdfmake fonts:', error);
    fonts = { Roboto: {} };
  }
}

/**
 * Generates invoice PDF document definition for pdfmake
 */
export function generateInvoicePdfDefinition(invoice: Invoice) {
  const formattedDate = dayjs(invoice.issueDate).format('DD/MM/YYYY');
  const monthName = dayjs(invoice.month).format('MMMM YYYY');
  const amount = Number(invoice.amount).toFixed(2);

  const emptyRows = Array.from({ length: 10 }, (_, idx) => {
    const bg = idx % 2 === 0 ? '#e6eef5' : '#ffffff';
    return [
      { text: '', margin: [0, 5, 0, 5], fillColor: bg },
      { text: '', margin: [0, 5, 0, 5], fillColor: bg },
      { text: '', margin: [0, 5, 0, 5], fillColor: bg },
      { text: '', margin: [0, 5, 0, 5], fillColor: bg },
    ];
  });

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 30],

    content: [
      // ================= HEADER =================
      {
        stack: [
          // ROW 1 → Invoice title
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                text: 'Invoice',
                fontSize: 34,
                italics: true,
                color: '#8fa3ad',
                alignment: 'right',
              },
            ],
          },

          // ROW 2 → Sender + Date/Invoice
          {
            columns: [
              // LEFT (Sender)
              {
                width: '*',
                stack: [
                  {
                    text: 'Minhazur Rahman Rafi',
                    fontSize: 16,
                    bold: true,
                    margin: [0, 8, 0, 4],
                  },

                  {
                    table: {
                      body: [
                        [
                          {
                            text: '183/56 Kazi Villa, 12 no Road, Bagbari, Sylhet, Bangladesh.',
                            margin: [8, 5, 8, 5],
                            fontSize: 10,
                            bold: true,
                            color: '#333',
                          },
                        ],
                      ],
                    },
                    layout: {
                      fillColor: () => '#fff9cc',
                      hLineColor: () => '#f0e6a6',
                      vLineColor: () => '#f0e6a6',
                      hLineWidth: () => 0.5,
                      vLineWidth: () => 0.5,
                    },
                  },
                ],
              },

              // RIGHT (Date + Invoice)
              {
                width: 'auto',
                table: {
                  widths: ['auto', 'auto'],
                  body: [
                    [
                      {
                        text: 'Date:',
                        bold: true,
                        color: '#5f7f95',
                        margin: [0, 2, 6, 2],
                      },
                      {
                        table: {
                          body: [
                            [
                              {
                                text: formattedDate,
                                bold: true,
                                margin: [8, 4, 8, 4],
                                color: '#333',
                              },
                            ],
                          ],
                        },
                        layout: {
                          fillColor: () => '#fff9cc',
                          hLineColor: () => '#f0e6a6',
                          vLineColor: () => '#f0e6a6',
                          hLineWidth: () => 0.5,
                          vLineWidth: () => 0.5,
                        },
                      },
                    ],
                    [
                      {
                        text: 'Invoice #:',
                        bold: true,
                        color: '#5f7f95',
                        margin: [0, 2, 6, 2],
                      },
                      {
                        table: {
                          body: [
                            [
                              {
                                text: invoice.invoiceNumber.toString(),
                                bold: true,
                                margin: [8, 4, 8, 4],
                                color: '#333',
                              },
                            ],
                          ],
                        },
                        layout: {
                          fillColor: () => '#fff9cc',
                          hLineColor: () => '#f0e6a6',
                          vLineColor: () => '#f0e6a6',
                          hLineWidth: () => 0.5,
                          vLineWidth: () => 0.5,
                        },
                      },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                },
                margin: [0, 6, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 18],
      },

      // ================= TO =================
      {
        columns: [
          { width: 35, text: 'To:', bold: true, margin: [0, 4, 0, 0] },
          {
            width: '*',
            stack: [
              { text: 'Infarsight FZ LLC', bold: true, margin: [0, 0, 0, 4] },
              {
                text:
                  'CWEP0325 Compass Building, Al Shohada Road,\n' +
                  'AL Hamra Industrial Zone-FZ,\n' +
                  'Ras Al Khaimah, 10055, Ras Al Khaimah',
                fontSize: 10,
                color: '#444',
                lineHeight: 1.4,
              },
            ],
          },
        ],
        margin: [0, 8, 0, 14],
      },

      // ================= TABLE =================
      {
        table: {
          headerRows: 1,
          widths: [50, '*', 80, 80],
          body: [
            [
              {
                text: 'Sr. No.',
                bold: true,
                color: '#fff',
                fillColor: '#5f7f95',
                margin: [6, 6, 6, 6],
              },
              {
                text: 'Description',
                bold: true,
                color: '#fff',
                fillColor: '#5f7f95',
                margin: [6, 6, 6, 6],
              },
              {
                text: 'Unit Price',
                bold: true,
                color: '#fff',
                fillColor: '#5f7f95',
                alignment: 'right',
                margin: [6, 6, 6, 6],
              },
              {
                text: 'Line Total',
                bold: true,
                color: '#fff',
                fillColor: '#5f7f95',
                alignment: 'right',
                margin: [6, 6, 6, 6],
              },
            ],

            [
              { text: '1', alignment: 'center', margin: [0, 6, 0, 6] },
              {
                text: `Professional Services for the month of ${monthName}`,
                margin: [0, 6, 0, 6],
              },
              { text: '', margin: [0, 6, 0, 6] },
              { text: `$ ${amount}`, alignment: 'right', margin: [0, 6, 0, 6] },
            ],

            ...emptyRows,
          ],
        },
        layout: {
          hLineColor: '#c5d0d8',
          vLineColor: '#c5d0d8',
        },
        margin: [0, 0, 0, 6],
      },

      // ================= BOTTOM =================
      {
        columns: [
          {
            width: '55%',
            stack: [
              { text: 'Please make checks payable to', fontSize: 10 },

              {
                text: [
                  { text: 'Wire transfer to credit of - ', fontSize: 10 },
                  {
                    text: 'Md Minhazur Rahman Rafi',
                    color: '#c0392b',
                    bold: true,
                    fontSize: 10,
                  },
                ],
                margin: [0, 2, 0, 6],
              },

              {
                text:
                  'Bank Name- The City Bank\n' +
                  'Bank Account No - 2933502880001\n' +
                  'Bank Branch Name - Ambarkhana, Sylhet, Bangladesh.\n' +
                  'Routing Code - 225910041\n' +
                  'SWIFT Code - CIBLBDDH',
                fontSize: 10.5,
                lineHeight: 1.5,
              },
            ],
          },

          {
            width: '45%',
            table: {
              widths: ['*', 20, 80],
              body: [
                [
                  { text: 'Subtotal', alignment: 'right' },
                  { text: '$', alignment: 'center' },
                  { text: amount, alignment: 'right' },
                ],
                [
                  { text: 'Tax', alignment: 'right' },
                  { text: '$', alignment: 'center' },
                  { text: '-', alignment: 'right' },
                ],
                [
                  {
                    text: 'Total',
                    bold: true,
                    alignment: 'right',
                    margin: [0, 6, 0, 6],
                  },
                  { text: '$', bold: true, alignment: 'center' },
                  { text: amount, bold: true, alignment: 'right' },
                ],
              ],
            },
            layout: {
              hLineWidth: (i: number) => (i === 2 ? 1 : 0),
              hLineColor: () => '#000',
              vLineWidth: () => 0,
            },
          },
        ],
        margin: [0, 4, 0, 10],
      },

      // ================= FOOTER =================
      {
        text: '183/56 Kazi Villa, 12 no Road, Bagbari, Sylhet, Bangladesh.',
        alignment: 'center',
        fontSize: 9,
        color: '#6c8ea0',
        margin: [0, 12, 0, 0],
        decoration: 'underline',
        decorationColor: '#ccc',
      },
    ],
  };
}

/**
 * Generates a PDF from invoice data and uploads it to Cloudinary
 * Uses pdfmake for lightweight generation without Puppeteer/Chromium
 */
export async function generateAndUploadPdf(
  invoice: Invoice,
  cloudinaryService: CloudinaryService,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      initializeFonts();
      if (!fonts.Roboto) {
        reject(
          new Error(
            'Font files not properly loaded. Check pdfmake vfs_fonts availability.',
          ),
        );
        return;
      }

      const printer = new PdfPrinter(fonts);
      const docDefinition = generateInvoicePdfDefinition(invoice);

      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const monthName = dayjs(invoice.month).format('MMMM');
          const fileName = `Invoice_${monthName}_${Date.now()}`;

          const pdfUrl = await cloudinaryService.uploadPdfBuffer(
            pdfBuffer,
            fileName,
          );

          resolve(pdfUrl);
        } catch (error) {
          reject(
            new Error(
              `Failed to upload PDF: ${
                error instanceof Error ? error.message : String(error)
              }`,
            ),
          );
        }
      });

      pdfDoc.on('error', (error: Error) => {
        reject(new Error(`Failed to generate PDF: ${error.message}`));
      });

      pdfDoc.end();
    } catch (error) {
      reject(
        new Error(
          `PDF generation error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        ),
      );
    }
  });
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
