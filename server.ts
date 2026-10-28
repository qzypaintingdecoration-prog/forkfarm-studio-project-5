import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent in-memory & file storage for client briefs and enquiries
const DATA_FILE = path.join(__dirname, 'enquiries_db.json');

interface EnquiryRecord {
  id: string;
  createdAt: string;
  clientName: string;
  businessName: string;
  businessType: string;
  email: string;
  phone?: string;
  serviceOfInterest?: string;
  projectScope: string[];
  budgetTier: string;
  targetLaunch: string;
  details: string;
  status: string;
  privacyAcknowledged?: boolean;
}

let enquiries: EnquiryRecord[] = [];

// Seed sample food business inquiries if file does not exist
const initialSeed: EnquiryRecord[] = [
  {
    id: 'ENQ-7041',
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    clientName: 'Julian Sterling',
    businessName: 'L’Osteria Della Luna',
    businessType: 'Restaurant',
    email: 'j.sterling@losteriadellaluna.co.uk',
    phone: '+44 20 7946 0912',
    serviceOfInterest: 'Bespoke website design and development',
    projectScope: ['Immersive 3D Website', 'Direct Table & Private Dining Booking', 'Digital Menu Experience'],
    budgetTier: '£12,000 - £25,000',
    targetLaunch: 'Immediate (1-2 mo)',
    details: 'Looking to overhaul our Mayfair venue flagship online presence with dark luxury aesthetic, real-time sommelier menu pairings, and private dining bookings.',
    status: 'In Review',
    privacyAcknowledged: true
  },
  {
    id: 'ENQ-6892',
    createdAt: new Date(Date.now() - 84 * 3600000).toISOString(),
    clientName: 'Amara Vance',
    businessName: 'Kuro Matcha & Buns',
    businessType: 'Multi-unit Chain',
    email: 'amara@kuromatcha.com',
    phone: '+44 7700 900481',
    serviceOfInterest: 'Food-business applications and digital tools',
    projectScope: ['Custom Online Ordering App', 'Social Studio Automation', 'Loyalty Rewards'],
    budgetTier: '£25,000+',
    targetLaunch: 'Quarterly (2-4 mo)',
    details: 'Expanding to 4 locations in London and Manchester. Need unified click-and-collect ordering without 30% third-party aggregator commissions.',
    status: 'Discovery Scheduled',
    privacyAcknowledged: true
  }
];

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    enquiries = JSON.parse(raw);
  } else {
    enquiries = [...initialSeed];
    fs.writeFileSync(DATA_FILE, JSON.stringify(enquiries, null, 2));
  }
} catch {
  enquiries = [...initialSeed];
}

function saveEnquiries() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(enquiries, null, 2));
  } catch (err) {
    console.error('Failed to write enquiries to disk:', err);
  }
}

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Forkframe Studio Core', timestamp: new Date().toISOString() });
});

// Submit project enquiry
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { clientName, businessName, businessType, email, phone, serviceOfInterest, projectScope, budgetTier, targetLaunch, details, privacyAcknowledged } = req.body;

  if (!clientName || !email || !businessName) {
    res.status(400).json({ error: 'Client name, business name, and email are required.' });
    return;
  }

  const newRecord: EnquiryRecord = {
    id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    clientName: String(clientName).trim(),
    businessName: String(businessName).trim(),
    businessType: businessType || 'Restaurant',
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : undefined,
    serviceOfInterest: serviceOfInterest || 'Bespoke website design and development',
    projectScope: Array.isArray(projectScope) ? projectScope : ['Digital Strategy'],
    budgetTier: budgetTier || '£6,000 - £12,000',
    targetLaunch: targetLaunch || 'Quarterly (2-4 mo)',
    details: details ? String(details).trim() : '',
    status: 'New',
    privacyAcknowledged: Boolean(privacyAcknowledged)
  };

  enquiries.unshift(newRecord);
  saveEnquiries();

  res.status(201).json({
    success: true,
    message: 'Project brief submitted successfully to Forkframe Studio.',
    record: newRecord
  });
});

// Admin get enquiries (with authorization check)
app.get('/api/admin/enquiries', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer forkframe-studio-secure-2026') {
    res.status(401).json({ error: 'Unauthorized studio access token.' });
    return;
  }
  res.json({ enquiries });
});

// Admin update enquiry status
app.patch('/api/admin/enquiries/:id/status', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer forkframe-studio-secure-2026') {
    res.status(401).json({ error: 'Unauthorized studio access token.' });
    return;
  }

  const { id } = req.params;
  const { status } = req.body;

  const item = enquiries.find(e => e.id === id);
  if (!item) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  item.status = status;
  saveEnquiries();
  res.json({ success: true, item });
});

// Explicit route to download the project ZIP with proper content-type and disposition
app.get('/download/forkframe-studio-infinite-dimension.zip', (_req: Request, res: Response) => {
  const zipPath = path.join(__dirname, 'public', 'download', 'forkframe-studio-infinite-dimension.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="forkframe-studio-infinite-dimension.zip"');
    res.sendFile(zipPath);
  } else {
    res.status(404).send('ZIP file not found');
  }
});

// Serve public assets directory statically
app.use(express.static(path.join(__dirname, 'public')));

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Forkframe Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to boot Forkframe Studio server:', err);
});
