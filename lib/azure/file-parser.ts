import { createAzureClient } from "./client";
import { isUnexpected, getLongRunningPoller, type AnalyzeOperationOutput } from "@azure-rest/ai-document-intelligence";
import crypto from 'crypto'

// Helper types for nested structures
export interface InvoiceAddress {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryRegion?: string;
}

export interface InvoiceLineItem {
  Description?: { content?: string; confidence?: number };
  Quantity?: { content?: string; confidence?: number };
  Unit?: { content?: string; confidence?: number };
  UnitPrice?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
  ProductCode?: { content?: string; confidence?: number };
  Date?: { content?: string; confidence?: number };
  Tax?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
  Amount?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
}

export interface ParsedInvoice {
  // Document metadata
  docType?: string;
  confidence?: number;
  fileHash: string;
  fileName: string;
  fileSize: number;

  // Vendor information
  VendorName?: { content?: string; confidence?: number };
  VendorAddress?: { content?: string; value?: InvoiceAddress; confidence?: number };
  VendorAddressRecipient?: { content?: string; confidence?: number };

  // Customer information
  CustomerName?: { content?: string; confidence?: number };
  CustomerId?: { content?: string; confidence?: number };
  CustomerAddress?: { content?: string; value?: InvoiceAddress; confidence?: number };
  CustomerAddressRecipient?: { content?: string; confidence?: number };

  // Invoice details
  InvoiceId?: { content?: string; confidence?: number };
  InvoiceDate?: { content?: string; confidence?: number };
  DueDate?: { content?: string; confidence?: number };
  InvoiceTotal?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
  PurchaseOrder?: { content?: string; confidence?: number };

  // Financial fields
  SubTotal?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
  TotalTax?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
  PreviousUnpaidBalance?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };
  AmountDue?: { content?: string; valueCurrency?: { amount?: number; currencyCode?: string }; confidence?: number };

  // Address fields
  BillingAddress?: { content?: string; value?: InvoiceAddress; confidence?: number };
  BillingAddressRecipient?: { content?: string; confidence?: number };
  ShippingAddress?: { content?: string; value?: InvoiceAddress; confidence?: number };
  ShippingAddressRecipient?: { content?: string; confidence?: number };
  ServiceAddress?: { content?: string; value?: InvoiceAddress; confidence?: number };
  ServiceAddressRecipient?: { content?: string; confidence?: number };
  RemittanceAddress?: { content?: string; value?: InvoiceAddress; confidence?: number };
  RemittanceAddressRecipient?: { content?: string; confidence?: number };

  // Service dates
  ServiceStartDate?: { content?: string; confidence?: number };
  ServiceEndDate?: { content?: string; confidence?: number };

  // Line items
  Items?: { values?: Array<{ properties?: InvoiceLineItem }> };
}

// Azure Invoice Model Parser with Azure Document Intelligence + SHA-256 hash
export async function processWithAzure(file: File): Promise<ParsedInvoice> {
  const client = createAzureClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
  const base64Source = buffer.toString('base64');

  console.log('Processing file with Azure Invoice Model:', file.name);

  try {
    // Call Azure Document Intelligence API
    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-invoice")
      .post({
        contentType: "application/json",
        body: {
          base64Source,
        },
      });

    if (isUnexpected(initialResponse)) {
      const error = initialResponse.body.error || { message: "Unknown error from Azure Document Intelligence" };
      throw new Error(`Azure API error: ${error.message || JSON.stringify(error)}`);
    }

    // Handle long-running operation
    const poller = getLongRunningPoller(client, initialResponse);
    const pollResult = (await poller.pollUntilDone()).body as AnalyzeOperationOutput;
    const analyzeResult = pollResult.analyzeResult;

    if (!analyzeResult?.documents || analyzeResult.documents.length === 0) {
      throw new Error("No documents found in the analysis result");
    }

    const document = analyzeResult.documents[0];
    if (!document) {
      throw new Error("Expected at least one invoice in the result");
    }

    // Map Azure response to ParsedInvoice interface
    const parsedInvoice: ParsedInvoice = {
      docType: document.docType,
      confidence: document.confidence,
      fileHash,
      fileName: file.name,
      fileSize: file.size,
    };

    // Extract fields from document.fields
    const fields = document.fields || {};

    // Vendor information
    if (fields.VendorName) parsedInvoice.VendorName = fields.VendorName;
    if (fields.VendorAddress) parsedInvoice.VendorAddress = fields.VendorAddress;
    if (fields.VendorAddressRecipient) parsedInvoice.VendorAddressRecipient = fields.VendorAddressRecipient;

    // Customer information
    if (fields.CustomerName) parsedInvoice.CustomerName = fields.CustomerName;
    if (fields.CustomerId) parsedInvoice.CustomerId = fields.CustomerId;
    if (fields.CustomerAddress) parsedInvoice.CustomerAddress = fields.CustomerAddress;
    if (fields.CustomerAddressRecipient) parsedInvoice.CustomerAddressRecipient = fields.CustomerAddressRecipient;

    // Invoice details
    if (fields.InvoiceId) parsedInvoice.InvoiceId = fields.InvoiceId;
    if (fields.InvoiceDate) parsedInvoice.InvoiceDate = fields.InvoiceDate;
    if (fields.DueDate) parsedInvoice.DueDate = fields.DueDate;
    if (fields.InvoiceTotal) parsedInvoice.InvoiceTotal = fields.InvoiceTotal;
    if (fields.PurchaseOrder) parsedInvoice.PurchaseOrder = fields.PurchaseOrder;

    // Financial fields
    if (fields.SubTotal) parsedInvoice.SubTotal = fields.SubTotal;
    if (fields.TotalTax) parsedInvoice.TotalTax = fields.TotalTax;
    if (fields.PreviousUnpaidBalance) parsedInvoice.PreviousUnpaidBalance = fields.PreviousUnpaidBalance;
    if (fields.AmountDue) parsedInvoice.AmountDue = fields.AmountDue;

    // Address fields
    if (fields.BillingAddress) parsedInvoice.BillingAddress = fields.BillingAddress;
    if (fields.BillingAddressRecipient) parsedInvoice.BillingAddressRecipient = fields.BillingAddressRecipient;
    if (fields.ShippingAddress) parsedInvoice.ShippingAddress = fields.ShippingAddress;
    if (fields.ShippingAddressRecipient) parsedInvoice.ShippingAddressRecipient = fields.ShippingAddressRecipient;
    if (fields.ServiceAddress) parsedInvoice.ServiceAddress = fields.ServiceAddress;
    if (fields.ServiceAddressRecipient) parsedInvoice.ServiceAddressRecipient = fields.ServiceAddressRecipient;
    if (fields.RemittanceAddress) parsedInvoice.RemittanceAddress = fields.RemittanceAddress;
    if (fields.RemittanceAddressRecipient) parsedInvoice.RemittanceAddressRecipient = fields.RemittanceAddressRecipient;

    // Service dates
    if (fields.ServiceStartDate) parsedInvoice.ServiceStartDate = fields.ServiceStartDate;
    if (fields.ServiceEndDate) parsedInvoice.ServiceEndDate = fields.ServiceEndDate;

    // Line items - Azure returns Items as a DocumentFieldOutput with values array
    if (fields.Items && 'values' in fields.Items) {
      parsedInvoice.Items = { values: fields.Items.values as Array<{ properties?: InvoiceLineItem }> };
    }

    console.log('Successfully parsed invoice:', parsedInvoice.InvoiceId?.content || 'Unknown ID');
    return parsedInvoice;
  } catch (error) {
    console.error('Error processing invoice with Azure:', error);
    throw error;
  }
}