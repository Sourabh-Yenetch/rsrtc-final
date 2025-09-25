// api/rsrtc/TimetableServices/VtsService.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, SOAPAction');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Making request to RSRTC API...');
    
    const response = await fetch('http://mis.rajasthanroadways.com:8081/TimetableServices/VtsService', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': '"getAvailableServices"',
      },
      body: req.body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('RSRTC API response received');
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(xmlText);
  } catch (error) {
    console.error('RSRTC API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch RSRTC services',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}