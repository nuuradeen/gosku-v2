import { NextRequest, NextResponse } from 'next/server';
import { processWithAzure } from '@/lib/azure/file-parser';

// Maximum file size: 50MB (Azure Document Intelligence limit is typically 50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Supported file types for invoice/receipt processing
// Azure Document Intelligence invoice model supports: PDF, JPEG/JPG, PNG, BMP, TIFF
const ALLOWED_FILE_TYPES = [
  'application/pdf',      // PDF files
  'image/png',            // PNG images
  'image/jpeg',           // JPEG images
  'image/jpg',            // JPG images (alternative MIME type)
  'image/bmp',            // BMP images
  'image/tiff',           // TIFF images
  'image/tif',            // TIF images (alternative MIME type)
];

export async function POST(request: NextRequest) {
  try {
    // Parse FormData from request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please include a file in the request.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Supported types for invoices/receipts: PDF, PNG, JPEG, BMP, TIFF. Received: ${file.type || 'unknown'}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        },
        { status: 400 }
      );
    }

    // Validate file is not empty
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty. Please provide a valid file.' },
        { status: 400 }
      );
    }

    // Process the file with Azure Document Intelligence
    const parsedInvoice = await processWithAzure(file);

    // Return successful response with parsed invoice data
    return NextResponse.json(
      {
        success: true,
        data: parsedInvoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in invoice parse API:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Azure API errors
      if (error.message.includes('Azure API error')) {
        return NextResponse.json(
          {
            error: 'Failed to process invoice with Azure Document Intelligence',
            details: error.message,
          },
          { status: 502 }
        );
      }

      // Azure credentials errors
      if (error.message.includes('Azure Document Intelligence credentials')) {
        return NextResponse.json(
          {
            error: 'Azure Document Intelligence service is not properly configured',
            details: error.message,
          },
          { status: 500 }
        );
      }

      // No documents found
      if (error.message.includes('No documents found') || error.message.includes('Expected at least one invoice')) {
        return NextResponse.json(
          {
            error: 'Could not extract invoice data from the provided file. Please ensure the file contains a valid invoice.',
            details: error.message,
          },
          { status: 422 }
        );
      }

      // Generic error
      return NextResponse.json(
        {
          error: 'An error occurred while processing the invoice',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Unknown error type
    return NextResponse.json(
      {
        error: 'An unknown error occurred while processing the invoice',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

