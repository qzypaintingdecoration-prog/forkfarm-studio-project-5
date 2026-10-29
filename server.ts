import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent storage setup in data/enquiries.json and root backup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Could not create data directory:', err);
  }
}

const PRIMARY_DATA_FILE = path.join(DATA_DIR, 'enquiries.json');
const LEGACY_DATA_FILE = path.join(__dirname, 'enquiries_db.json');

export interface EnquiryRecord {
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
  status: 'New' | 'In Review' | 'Discovery Scheduled' | 'Proposal Sent';
  privacyAcknowledged: boolean;
  emailStatus: 'SENT' | 'PROVIDER_UNCONFIGURED' | 'FAILED';
  emailStatusReason?: string;
  recipientEmail: string;
}

let enquiries: EnquiryRecord[] = [];

// Seed sample food business inquiries (100% Halal-First, zero alcohol)
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
    details: 'Looking to overhaul our Mayfair venue flagship online presence with dark luxury aesthetic, real-time artisanal botanical mocktail pairings, and private dining bookings.',
    status: 'In Review',
    privacyAcknowledged: true,
    emailStatus: 'PROVIDER_UNCONFIGURED',
    emailStatusReason: 'Server SMTP credentials unconfigured in demo environment. Record securely saved.',
    recipientEmail: 'studioforkframe@gmail.com'
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
    privacyAcknowledged: true,
    emailStatus: 'PROVIDER_UNCONFIGURED',
    emailStatusReason: 'Server SMTP credentials unconfigured in demo environment. Record securely saved.',
    recipientEmail: 'studioforkframe@gmail.com'
  }
];

// Load persisted database
try {
  if (fs.existsSync(PRIMARY_DATA_FILE)) {
    const raw = fs.readFileSync(PRIMARY_DATA_FILE, 'utf-8');
    enquiries = JSON.parse(raw);
  } else if (fs.existsSync(LEGACY_DATA_FILE)) {
    const raw = fs.readFileSync(LEGACY_DATA_FILE, 'utf-8');
    enquiries = JSON.parse(raw);
  } else {
    enquiries = [...initialSeed];
  }
} catch {
  enquiries = [...initialSeed];
}

function saveEnquiries() {
  try {
    const json = JSON.stringify(enquiries, null, 2);
    fs.writeFileSync(PRIMARY_DATA_FILE, json);
    fs.writeFileSync(LEGACY_DATA_FILE, json);
  } catch (err) {
    console.error('Failed to write enquiries to disk:', err);
  }
}
saveEnquiries();

// Rate limiting map (IP -> { count, resetAt })
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 8; // Max 8 submissions per 10 mins

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Honest Outbound Email Notification Dispatcher
async function dispatchEmailNotification(enquiry: EnquiryRecord): Promise<{
  status: 'SENT' | 'PROVIDER_UNCONFIGURED' | 'FAILED';
  reason?: string;
}> {
  const recipient = 'studioforkframe@gmail.com';
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Check if SMTP is configured in environment
  if (!smtpHost || !smtpUser || !smtpPass) {
    return {
      status: 'PROVIDER_UNCONFIGURED',
      reason: `Outbound SMTP environment variables (SMTP_HOST / SMTP_USER / SMTP_PASS) not configured. Brief safely stored to database and immediately accessible in Studio Admin.`
    };
  }

  // Attempt real email send via dynamic module if present
  try {
    let nodemailer: any = null;
    try {
      nodemailer = await (Function('return import("nodemailer")')() as Promise<any>);
    } catch {
      nodemailer = null;
    }

    if (!nodemailer || !nodemailer.createTransport) {
      return {
        status: 'PROVIDER_UNCONFIGURED',
        reason: `SMTP credentials specified, but mail transport module is unavailable. Brief stored safely to disk database.`
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"Forkframe Studio Portal" <${smtpUser}>`,
      to: recipient,
      replyTo: enquiry.email,
      subject: `[New Hospitality Brief] ${enquiry.businessName} · ${enquiry.clientName} (${enquiry.budgetTier})`,
      text: `
New Client Enquiry Received on Forkframe Studio:
--------------------------------------------------
Reference ID: ${enquiry.id}
Client: ${enquiry.clientName}
Business: ${enquiry.businessName} (${enquiry.businessType})
Email: ${enquiry.email}
Phone: ${enquiry.phone || 'N/A'}
Service of Interest: ${enquiry.serviceOfInterest || 'General Tech Scoping'}
Budget Tier: ${enquiry.budgetTier}
Target Launch: ${enquiry.targetLaunch}
Project Scope: ${enquiry.projectScope.join(', ')}

Client Notes:
${enquiry.details || 'None provided.'}

Timestamp: ${enquiry.createdAt}
      `.trim()
    });

    return {
      status: 'SENT',
      reason: `Successfully dispatched email to ${recipient} (Message ID: ${info.messageId})`
    };
  } catch (err: any) {
    console.error('SMTP Delivery error:', err);
    return {
      status: 'FAILED',
      reason: `SMTP delivery failed: ${err.message || 'Unknown network error'}`
    };
  }
}

// API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Forkframe Studio Core Engine',
    timestamp: new Date().toISOString(),
    recordsCount: enquiries.length,
    officialEmail: 'studioforkframe@gmail.com'
  });
});

// Submit project enquiry
app.post('/api/enquiries', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  // 1. Anti-spam honeypot detection
  const honeypot = req.body.website || req.body.fax_number || req.body.hp_field;
  if (honeypot && String(honeypot).trim().length > 0) {
    // Drop bot submission without saving
    res.status(400).json({ error: 'Spam validation failed.' });
    return;
  }

  // 2. IP Rate Limiting
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      error: 'Submission rate limit reached. Please wait a few minutes before submitting another brief.'
    });
    return;
  }

  const {
    clientName,
    businessName,
    businessType,
    email,
    phone,
    serviceOfInterest,
    projectScope,
    budgetTier,
    targetLaunch,
    details,
    privacyAcknowledged
  } = req.body;

  if (!clientName || !email || !businessName) {
    res.status(400).json({ error: 'Client name, venue name, and contact email are required.' });
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
    projectScope: Array.isArray(projectScope) && projectScope.length > 0 ? projectScope : ['Digital Strategy'],
    budgetTier: budgetTier || '£6,000 - £12,000',
    targetLaunch: targetLaunch || 'Quarterly (2-4 mo)',
    details: details ? String(details).trim() : '',
    status: 'New',
    privacyAcknowledged: Boolean(privacyAcknowledged),
    emailStatus: 'PROVIDER_UNCONFIGURED',
    recipientEmail: 'studioforkframe@gmail.com'
  };

  // 3. Attempt email notification to studioforkframe@gmail.com
  const emailResult = await dispatchEmailNotification(newRecord);
  newRecord.emailStatus = emailResult.status;
  newRecord.emailStatusReason = emailResult.reason;

  // 4. Persist to storage
  enquiries.unshift(newRecord);
  saveEnquiries();

  res.status(201).json({
    success: true,
    message: 'Project brief submitted successfully to Forkframe Studio.',
    record: newRecord,
    emailDelivery: {
      status: newRecord.emailStatus,
      recipient: newRecord.recipientEmail,
      diagnostic: newRecord.emailStatusReason
    }
  });
});

// Admin get enquiries (with authorization check)
app.get('/api/admin/enquiries', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer forkframe-studio-secure-2026') {
    res.status(401).json({ error: 'Unauthorized studio access token.' });
    return;
  }
  res.json({
    enquiries,
    diagnostics: {
      storagePath: PRIMARY_DATA_FILE,
      totalCount: enquiries.length,
      officialEmail: 'studioforkframe@gmail.com',
      smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
    }
  });
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

  const item = enquiries.find((e) => e.id === id);
  if (!item) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  item.status = status;
  saveEnquiries();
  res.json({ success: true, item });
});

// Static public directory
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

startServer().catch((err) => {
  console.error('Failed to boot Forkframe Studio server:', err);
});
