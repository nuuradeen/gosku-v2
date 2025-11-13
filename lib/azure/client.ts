// lib/azure/client.ts
import DocumentIntelligence from "@azure-rest/ai-document-intelligence";

export function createAzureClient() {
  const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT
  const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY

  if (!endpoint || !key) {
    throw new Error('Azure Document Intelligence credentials not configured')
  }

  return DocumentIntelligence(endpoint, {
      key,
  });
}