// view-invoice-dialog.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";

export default function ViewInvoiceDialog({ open, onOpenChange, invoice }) {
  if (!invoice) return null;

  const company = useSelector((state) => state.company.company);
  const client = invoice.clientId;
  const bank = invoice.bankId;

  const handlePrint = () => {
    // Create invoice HTML with fixed print styles
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              color: #111827;
              background: white;
              line-height: 1.5;
            }
            
            @page {
              size: A4;
              margin: 20mm;
            }
            
            @media print {
              body {
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            .invoice-container {
              max-width: 800px;
              border: 1px solid #E5E7EB;
              margin: 30px ;
              padding: 30px;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #E5E7EB;
            }
            
            .header-left h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 4px;
              color: #111827;
            }
            
            .header-left h2 {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 10px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            
            .header-left p {
              font-size: 13px;
              color: #6B7280;
              margin-bottom: 3px;
              line-height: 1.4;
            }
            
            .header-left strong {
              color: #111827;
              font-weight: 600;
            }
            
            .header-right {
              text-align: right;
              max-width: 300px;
            }
            
            .header-right p {
              font-size: 12px;
              color: #6B7280;
              margin-bottom: 3px;
              line-height: 1.4;
            }
            
            .header-right .gstin {
              font-weight: 600;
              color: #111827;
              margin-top: 6px;
            }
            
            .bill-to {
              background: #F9FAFB;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 25px;
            }
            
            .bill-to h3 {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #6B7280;
              margin-bottom: 10px;
            }
            
            .bill-to .client-name {
              font-size: 15px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 3px;
            }
            
            .bill-to p {
              font-size: 12px;
              color: #6B7280;
              margin-bottom: 3px;
              line-height: 1.4;
            }
            
            .bill-to .gstin {
              font-weight: 600;
              color: #111827;
              margin-top: 6px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              border: 1px solid #E5E7EB;
            }
            
            .items-table thead {
           border: 2px solid #E5E7EB;
            }
            
            .items-table th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: 600;
            }
            
            .items-table th.right {
              text-align: right;
            }
            
            .items-table tbody tr {
              border-bottom: 1px solid #E5E7EB;
            }
            
            .items-table tbody tr:last-child {
              border-bottom: none;
            }
            
            .items-table td {
              padding: 12px;
              font-size: 12px;
              vertical-align: top;
            }
            
            .items-table td.gray {
              color: #6B7280;
            }
            
            .items-table td.bold {
              font-weight: 600;
              color: #111827;
            }
            
            .items-table td.right {
              text-align: right;
            }
            
            .totals {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 25px;
            }
            
            .totals-box {
              width: 350px;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              font-size: 13px;
              border-bottom: 1px solid #E5E7EB;
            }
            
            .totals-row.discount {
              color: #DC2626;
            }
            
            .totals-row .label {
              color: #6B7280;
            }
            
            .totals-row .value {
              font-weight: 600;
              color: #111827;
            }
            
            .totals-row.discount .value {
              color: #DC2626;
            }
            
            .grand-total {
              display: flex;
              justify-content: space-between;
              padding: 15px;
              margin-top: 15px;
              
              border: 2px solid #E5E7EB;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 700;
            }
            
            .bank-details {
              background: #F9FAFB;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            
            .bank-details h3 {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #6B7280;
              margin-bottom: 15px;
            }
            
            .bank-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .bank-item label {
              display: block;
              font-size: 10px;
              color: #6B7280;
              margin-bottom: 4px;
            }
            
            .bank-item p {
              font-size: 12px;
              font-weight: 600;
              color: #111827;
            }
            
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
            }
            
            .footer p {
              font-size: 10px;
              color: #6B7280;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- HEADER -->
            <div class="header">
              <div class="header-left">
                <h1>${company?.ClientName || ""}</h1>
                <h2>INVOICE</h2>
                <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date(
                  invoice.invoiceDate
                ).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
              </div>
              <div class="header-right">
                <p>${company?.OfficeAddress || ""}</p>
                <p>${company?.City || ""}, ${company?.State || ""} ${
      company?.Pincode || ""
    }</p>
                <p>${company?.PhoneNumber || ""}</p>
                <p>${company?.email || ""}</p>
                ${
                  company?.GSTNumber
                    ? `<p class="gstin">GSTIN: ${company.GSTNumber}</p>`
                    : ""
                }
              </div>
            </div>
            
            <!-- BILL TO -->
            <div class="bill-to">
              <h3>Bill To</h3>
              <p class="client-name">${client.ClientName}</p>
              <p>${client.OfficeAddress}</p>
              <p>${client.City}, ${client.State}, ${client.Country} ${
      client.Pincode
    }</p>
              <p>${client.PhoneNumber}</p>
              <p>${client.email}</p>
              ${
                client.GSTNumber
                  ? `<p class="gstin">GSTIN: ${client.GSTNumber}</p>`
                  : ""
              }
            </div>
            
            <!-- ITEMS TABLE -->
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 30px;">#</th>
                  <th>Item</th>
                  <th>Description</th>
                  <th class="right" style="width: 60px;">Qty</th>
                  <th class="right" style="width: 100px;">Rate</th>
                  <th class="right" style="width: 100px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items
                  .map(
                    (item, index) => `
                  <tr>
                    <td class="gray">${index + 1}</td>
                    <td class="bold">${item.product.productName} – ${
                      item.subProduct.subProductName
                    }</td>
                    <td class="gray">${item.description || "—"}</td>
                    <td class="right">${item.qty}</td>
                    <td class="right bold">₹${item.rate.toLocaleString(
                      "en-IN"
                    )}</td>
                    <td class="right bold">₹${item.amount.toLocaleString(
                      "en-IN"
                    )}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            
            <!-- TOTALS -->
            <div class="totals">
              <div class="totals-box">
                <div class="totals-row">
                  <span class="label">Subtotal</span>
                  <span class="value">₹${invoice.subTotal.toLocaleString(
                    "en-IN"
                  )}</span>
                </div>
                
                ${
                  invoice.discountValue > 0
                    ? `
                  <div class="totals-row discount">
                    <span class="label">Discount ${
                      invoice.discountType === "percent"
                        ? `(${invoice.discountValue}%)`
                        : "(Flat)"
                    }</span>
                    <span class="value">- ₹${invoice.discountValue.toLocaleString(
                      "en-IN"
                    )}</span>
                  </div>
                `
                    : ""
                }
                
                <div class="totals-row">
                  <span class="label">GST</span>
                  <span class="value">₹${invoice.gstAmount.toLocaleString(
                    "en-IN"
                  )}</span>
                </div>
                
                <div class="grand-total">
                  <span>Grand Total</span>
                  <span>₹${invoice.grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            
            <!-- BANK DETAILS -->
            ${
              bank
                ? `
              <div class="bank-details">
                <h3>Payment Details</h3>
                <div class="bank-grid">
                  <div class="bank-item">
                    <label>Account Name</label>
                    <p>${bank.accountName}</p>
                  </div>
                  <div class="bank-item">
                    <label>Account Number</label>
                    <p>${bank.accountNumber}</p>
                  </div>
                  <div class="bank-item">
                    <label>Bank & Branch</label>
                    <p>${bank.bankName}, ${bank.branch}</p>
                  </div>
                  <div class="bank-item">
                    <label>IFSC Code</label>
                    <p>${bank.ifsc}</p>
                  </div>
                  ${
                    bank.upi
                      ? `
                    <div class="bank-item">
                      <label>UPI ID</label>
                      <p>${bank.upi}</p>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `
                : ""
            }
            
          
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Open in new window and print
    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    let clonedElement = null;
    try {
      // Import jsPDF and html2canvas dynamically
      const { default: jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      // Get the invoice content element
      const invoiceElement = document.getElementById("invoice-preview-content");
      if (!invoiceElement) {
        alert("Invoice content not found");
        return;
      }

      // Clone the element to avoid modifying the original
      clonedElement = invoiceElement.cloneNode(true);
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.top = "0";
      document.body.appendChild(clonedElement);

      const sanitizeColors = (root) => {
        const elements = root.querySelectorAll("*");
        elements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.color.includes("oklch")) {
            el.style.color = "#111827";
          }
          if (style.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#ffffff";
          }
        });
      };

      // Create canvas from HTML with additional options to handle modern CSS
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        windowHeight: clonedElement.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedContent = clonedDoc.getElementById(
            "invoice-preview-content"
          );
          if (clonedContent) {
            sanitizeColors(clonedContent);
          }
        },
      });

      // Remove cloned element
      if (clonedElement && document.body.contains(clonedElement)) {
        document.body.removeChild(clonedElement);
      }

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Failed to generate PDF. Please use the Print button instead and save as PDF from the print dialog."
      );
    } finally {
      // Cleanup: remove cloned element if it still exists
      if (clonedElement && document.body.contains(clonedElement)) {
        document.body.removeChild(clonedElement);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Invoice #{invoice.invoiceNumber}
          </DialogTitle>
          <DialogDescription>
            Preview and download or print your invoice
          </DialogDescription>
        </DialogHeader>

        <div
          id="invoice-preview-content"
          className="bg-white text-gray-900 p-8"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6 pb-5 border-b-2 border-gray-900">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1 text-gray-900">
                {company?.ClientName}
              </h1>
              <h2 className="text-lg font-semibold tracking-wide mb-2 text-gray-600 uppercase">
                Invoice
              </h2>
              <div className="space-y-0.5 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Invoice No:</span>{" "}
                  {invoice.invoiceNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Date:</span>{" "}
                  {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="text-right max-w-md">
              <div className="text-xs text-gray-600 space-y-0.5">
                <p>{company?.OfficeAddress}</p>
                <p>
                  {company?.City}, {company?.State} {company?.Pincode}
                </p>
                <p>{company?.PhoneNumber}</p>
                <p>{company?.email}</p>
                {company?.GSTNumber && (
                  <p className="font-semibold text-gray-900 mt-1.5">
                    GSTIN: {company.GSTNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CLIENT INFO */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Bill To
            </h3>
            <div className="space-y-0.5">
              <p className="font-bold text-base text-gray-900">
                {client.ClientName}
              </p>
              <p className="text-xs text-gray-600">{client.OfficeAddress}</p>
              <p className="text-xs text-gray-600">
                {client.City}, {client.State}, {client.Country} {client.Pincode}
              </p>
              <p className="text-xs text-gray-600">{client.PhoneNumber}</p>
              <p className="text-xs text-gray-600">{client.email}</p>
              {client.GSTNumber && (
                <p className="text-xs font-semibold text-gray-900 mt-1.5">
                  GSTIN: {client.GSTNumber}
                </p>
              )}
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr
                  // style={{ backgroundColor: "#111827", color: "#ffffff" }}
                  className="border"
                >
                  <th className="p-3 text-left font-semibold w-10">#</th>
                  <th className="p-3 text-left font-semibold">Item</th>
                  <th className="p-3 text-left font-semibold">Description</th>
                  <th className="p-3 text-right font-semibold w-16">Qty</th>
                  <th className="p-3 text-right font-semibold w-24">Rate</th>
                  <th className="p-3 text-right font-semibold w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={item._id}>
                    <td className="p-3 text-gray-500">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-900">
                      {item.product.productName} –{" "}
                      {item.subProduct.subProductName}
                    </td>
                    <td className="p-3 text-gray-600">
                      {item.description || "—"}
                    </td>
                    <td className="p-3 text-right text-gray-900">{item.qty}</td>
                    <td className="p-3 text-right text-gray-900 font-medium">
                      ₹{item.rate.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right text-gray-900 font-semibold">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS SECTION */}
          <div className="flex justify-end mb-6">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{invoice.subTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {invoice.discountValue > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>
                    Discount (
                    {invoice.discountType === "percent"
                      ? `${invoice.discountValue}%`
                      : "Flat"}
                    )
                  </span>
                  <span>- ₹{invoice.discountValue.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                <span className="text-gray-600">GST</span>
                <span className="font-medium text-gray-900">
                  ₹{invoice.gstAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div
                // style={{ backgroundColor: "#111827", color: "#ffffff" }}
                className="flex justify-between text-base border py-3 px-4 rounded-lg mt-3"
              >
                <span className="font-bold">Grand Total</span>
                <span className="font-bold">
                  ₹{invoice.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* BANK DETAILS */}
          {bank && (
            <div className="bg-gray-50 p-4 rounded-lg mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Account Name</p>
                  <p className="font-medium text-gray-900">
                    {bank.accountName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Account Number</p>
                  <p className="font-medium text-gray-900">
                    {bank.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Bank & Branch</p>
                  <p className="font-medium text-gray-900">
                    {bank.bankName}, {bank.branch}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">IFSC Code</p>
                  <p className="font-medium text-gray-900">{bank.ifsc}</p>
                </div>
                {bank.upi && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">UPI ID</p>
                    <p className="font-medium text-gray-900">{bank.upi}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This is a computer-generated invoice and does not require a
              signature.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {/* <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Download PDF
          </Button> */}
          <Button
            onClick={handlePrint}
            className="bg-gray-900 hover:bg-gray-800"
          >
            Print Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
