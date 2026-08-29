import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ENV } from './config/env.js';
import { User } from './models/User.js';
import { Issue } from './models/Issue.js';
import { ConfirmationVote } from './models/ConfirmationVote.js';

const seedData = async () => {
  try {
    console.log(`[Seed] Connecting to MongoDB at ${ENV.MONGO_URI}...`);
    await mongoose.connect(ENV.MONGO_URI);
    console.log('[Seed] MongoDB Connected successfully.');

    // 1. Clear existing data
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Issue.deleteMany({}),
      ConfirmationVote.deleteMany({}),
    ]);
    console.log('[Seed] Old data wiped successfully.');

    // 2. Create Users
    console.log('[Seed] Creating demo users...');

    const users = await User.create([
      {
        name: 'Chief City Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 98111 22233',
        ward: 'Ward 1 - Central Zone',
        isActive: true,
      },
      {
        name: 'Rajesh Sharma',
        email: 'worker@gmail.com',
        password: 'worker123',
        role: 'worker',
        phone: '+91 98765 43210',
        ward: 'Ward 1 - Central Zone',
        isActive: true,
      },
      {
        name: 'Amit Patel',
        email: 'amit.worker@civic.org',
        password: 'worker123',
        role: 'worker',
        phone: '+91 98765 43211',
        ward: 'Ward 2 - North Zone',
        isActive: true,
      },
      {
        name: 'Sunil Verma',
        email: 'sunil.worker@civic.org',
        password: 'worker123',
        role: 'worker',
        phone: '+91 98765 43212',
        ward: 'Ward 3 - East Zone',
        isActive: true,
      },
      {
        name: 'Aarav Mehta',
        email: 'aarav.citizen@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 91234 56780',
        ward: 'Ward 1 - Central Zone',
        isActive: true,
      },
      {
        name: 'Priya Nair',
        email: 'priya.citizen@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 91234 56781',
        ward: 'Ward 2 - North Zone',
        isActive: true,
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan.citizen@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 91234 56782',
        ward: 'Ward 3 - East Zone',
        isActive: true,
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya.citizen@example.com',
        password: 'password123',
        role: 'citizen',
        phone: '+91 91234 56783',
        ward: 'Ward 4 - South Zone',
        isActive: true,
      },
    ]);

    const admin = users[0];
    const worker1 = users[1]; // Rajesh
    const worker2 = users[2]; // Amit
    const worker3 = users[3]; // Sunil
    const citizen1 = users[4]; // Aarav
    const citizen2 = users[5]; // Priya
    const citizen3 = users[6]; // Rohan
    const citizen4 = users[7]; // Ananya

    console.log(`[Seed] Created ${users.length} users.`);

    // 3. Create Issues
    console.log('[Seed] Creating demo civic issues...');

    const sampleIssues = [
      {
        ticketId: 'CR-2026-1001',
        title: 'Deep crater-like pothole near City Center Metro station',
        description: 'A large pothole roughly 2 feet wide and 8 inches deep has formed right outside Exit Gate 2. It is causing severe traffic slowdowns and risk of two-wheeler accidents.',
        category: 'pothole',
        severity: 'critical',
        severityWeight: 4,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_pothole_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760], // [lng, lat]
        },
        address: 'MG Road, Near Metro Exit Gate 2, Central Zone',
        ward: 'Ward 1 - Central Zone',
        aiClassification: {
          label: 'Severe Road Pothole Hazard',
          confidence: 0.96,
          reasoning: 'Detected high-depth asphalt breakage located on active roadway posing immediate vehicular danger.',
          processedAt: new Date(Date.now() - 36 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 3,
        priorityScore: 120,
        status: 'in_progress',
        assignedWorker: worker1._id,
        reporters: [
          {
            user: citizen1._id,
            name: citizen1.name,
            email: citizen1.email,
            phone: citizen1.phone,
            reportedAt: new Date(Date.now() - 36 * 3600 * 1000),
          },
          {
            user: citizen2._id,
            name: citizen2.name,
            email: citizen2.email,
            phone: citizen2.phone,
            reportedAt: new Date(Date.now() - 24 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen1.name,
            updatedBy: citizen1._id,
            note: 'Initial report filed with photo evidence.',
            timestamp: new Date(Date.now() - 36 * 3600 * 1000),
          },
          {
            status: 'verified',
            updatedByName: 'AI Auto-Verification Engine',
            note: 'High AI confidence score (96%). Verified automatically.',
            timestamp: new Date(Date.now() - 35 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            note: `Assigned priority repair to field officer ${worker1.name}.`,
            timestamp: new Date(Date.now() - 20 * 3600 * 1000),
          },
          {
            status: 'in_progress',
            updatedByName: worker1.name,
            updatedBy: worker1._id,
            note: 'Road repair crew dispatched with quick-mix cold asphalt.',
            timestamp: new Date(Date.now() - 4 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1002',
        title: 'Overflowing commercial dumpster blocking sidewalk',
        description: 'Commercial waste has not been collected for over 4 days. Garbage has spilled out across the walkway creating foul stench and hygiene concerns for pedestrians.',
        category: 'garbage',
        severity: 'high',
        severityWeight: 3,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_garbage_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8821, 19.0825],
        },
        address: 'Shop 14-B, Vegetable Market Road, Ward 2',
        ward: 'Ward 2 - North Zone',
        aiClassification: {
          label: 'Overflowing Municipal Waste Container',
          confidence: 0.93,
          reasoning: 'Image shows excessive organic and plastic waste spilling outside bin boundary onto pedestrian pavement.',
          processedAt: new Date(Date.now() - 72 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 2,
        priorityScore: 60,
        status: 'resolved',
        assignedWorker: worker2._id,
        reporters: [
          {
            user: citizen2._id,
            name: citizen2.name,
            email: citizen2.email,
            phone: citizen2.phone,
            reportedAt: new Date(Date.now() - 72 * 3600 * 1000),
          },
        ],
        resolutionEvidence: [
          {
            url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_garbage_resolved',
            uploadedAt: new Date(Date.now() - 12 * 3600 * 1000),
          },
        ],
        resolutionNotes: 'Solid waste management team cleared 1.8 tons of waste and sanitized the dumpster surrounding perimeter with lime powder.',
        resolutionSubmittedAt: new Date(Date.now() - 12 * 3600 * 1000),
        resolvedAt: new Date(Date.now() - 12 * 3600 * 1000),
        confirmationWindowExpiresAt: new Date(Date.now() + 60 * 3600 * 1000),
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen2.name,
            updatedBy: citizen2._id,
            note: 'Reported by local resident.',
            timestamp: new Date(Date.now() - 72 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            note: `Assigned to ${worker2.name}`,
            timestamp: new Date(Date.now() - 48 * 3600 * 1000),
          },
          {
            status: 'in_progress',
            updatedByName: worker2.name,
            updatedBy: worker2._id,
            note: 'Compactor vehicle en route.',
            timestamp: new Date(Date.now() - 20 * 3600 * 1000),
          },
          {
            status: 'resolved',
            updatedByName: worker2.name,
            updatedBy: worker2._id,
            note: 'Waste cleared completely. Proof photo uploaded.',
            timestamp: new Date(Date.now() - 12 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1003',
        title: 'Broken streetlight fixture dangling dangerously from pole',
        description: 'After yesterday thunderstorm, a heavy metal light fixture is hanging by an exposed wire above the sidewalk. Extreme electrocution and physical hazard.',
        category: 'streetlight',
        severity: 'critical',
        severityWeight: 4,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_light_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8710, 19.0690],
        },
        address: 'Opposite Community Hall, 5th Avenue, Ward 1',
        ward: 'Ward 1 - Central Zone',
        aiClassification: {
          label: 'Damaged Electrical Street Lighting Infrastructure',
          confidence: 0.98,
          reasoning: 'Critical electrical hardware dislodged with potential exposed high voltage lines.',
          processedAt: new Date(Date.now() - 48 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 4,
        priorityScore: 160,
        status: 'pending_confirmation',
        assignedWorker: worker1._id,
        reporters: [
          {
            user: citizen1._id,
            name: citizen1.name,
            email: citizen1.email,
            phone: citizen1.phone,
            reportedAt: new Date(Date.now() - 48 * 3600 * 1000),
          },
          {
            user: citizen3._id,
            name: citizen3.name,
            email: citizen3.email,
            phone: citizen3.phone,
            reportedAt: new Date(Date.now() - 36 * 3600 * 1000),
          },
        ],
        resolutionEvidence: [
          {
            url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_light_resolved',
            uploadedAt: new Date(Date.now() - 6 * 3600 * 1000),
          },
        ],
        resolutionNotes: 'Electrical maintenance wing replaced damaged bracket arm with new 45W energy-efficient LED luminaire.',
        resolutionSubmittedAt: new Date(Date.now() - 6 * 3600 * 1000),
        confirmationWindowExpiresAt: new Date(Date.now() + 66 * 3600 * 1000),
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen1.name,
            updatedBy: citizen1._id,
            note: 'Emergency report logged.',
            timestamp: new Date(Date.now() - 48 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            note: 'Dispatched electrical emergency crew.',
            timestamp: new Date(Date.now() - 30 * 3600 * 1000),
          },
          {
            status: 'pending_confirmation',
            updatedByName: worker1.name,
            updatedBy: worker1._id,
            note: 'Fixture repaired and tested. Waiting for citizen confirmation.',
            timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1004',
        title: 'Blocked storm drain causing stagnant water and foul odor',
        description: 'The underground stormwater drain grating is heavily choked with single-use plastic bottles, silt, and dry foliage. Stagnant water has pooled for 50 meters.',
        category: 'drainage',
        severity: 'high',
        severityWeight: 3,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_drain_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8940, 19.0910],
        },
        address: 'Sector 8 Junction, Near Govt Primary School, Ward 3',
        ward: 'Ward 3 - East Zone',
        aiClassification: {
          label: 'Blocked Urban Drainage Infiltration',
          confidence: 0.91,
          reasoning: 'Drainage channel fully occluded by solid debris causing surface ponding.',
          processedAt: new Date(Date.now() - 18 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 2,
        priorityScore: 60,
        status: 'verified',
        assignedWorker: null,
        reporters: [
          {
            user: citizen3._id,
            name: citizen3.name,
            email: citizen3.email,
            phone: citizen3.phone,
            reportedAt: new Date(Date.now() - 18 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen3.name,
            updatedBy: citizen3._id,
            note: 'Citizen report with location pinpoint.',
            timestamp: new Date(Date.now() - 18 * 3600 * 1000),
          },
          {
            status: 'verified',
            updatedByName: 'System',
            note: 'AI classified and marked valid for municipal action.',
            timestamp: new Date(Date.now() - 17 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1005',
        title: 'Major underground water pipeline burst flooding street',
        description: 'Potable water main line has fractured, creating a continuous fountain of high-pressure clean water spreading across 3 residential blocks. Water pressure in nearby houses dropped to zero.',
        category: 'water',
        severity: 'critical',
        severityWeight: 4,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_water_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8655, 19.0550],
        },
        address: 'Plot 42, Sunrise Colony, South Ward',
        ward: 'Ward 4 - South Zone',
        aiClassification: {
          label: 'Pressurized Water Distribution Pipe Rupture',
          confidence: 0.97,
          reasoning: 'Massive fresh water flood source emanating from subsurface infrastructure.',
          processedAt: new Date(Date.now() - 8 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 5,
        priorityScore: 200,
        status: 'in_progress',
        assignedWorker: worker3._id,
        reporters: [
          {
            user: citizen4._id,
            name: citizen4.name,
            email: citizen4.email,
            phone: citizen4.phone,
            reportedAt: new Date(Date.now() - 8 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen4.name,
            updatedBy: citizen4._id,
            note: 'Emergency water wastage reported.',
            timestamp: new Date(Date.now() - 8 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            note: `Hydraulic repair unit assigned to ${worker3.name}`,
            timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          },
          {
            status: 'in_progress',
            updatedByName: worker3.name,
            updatedBy: worker3._id,
            note: 'Main valve isolated. Excavator digging to access damaged joint collar.',
            timestamp: new Date(Date.now() - 3 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1006',
        title: 'Fallen tree branch obstructing right lane after thunderstorm',
        description: 'Large bough snapped from old banyan tree and is blocking eastbound traffic lane.',
        category: 'other',
        severity: 'medium',
        severityWeight: 2,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_other_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8790, 19.0715],
        },
        address: 'Near Old Post Office, Ward 1',
        ward: 'Ward 1 - Central Zone',
        aiClassification: {
          label: 'Fallen Vegetative Obstruction on Roadway',
          confidence: 0.89,
          reasoning: 'Tree limb obstructing vehicular passage.',
          processedAt: new Date(Date.now() - 80 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 1,
        priorityScore: 20,
        status: 'resolved',
        assignedWorker: worker1._id,
        reporters: [
          {
            user: citizen1._id,
            name: citizen1.name,
            email: citizen1.email,
            phone: citizen1.phone,
            reportedAt: new Date(Date.now() - 80 * 3600 * 1000),
          },
        ],
        resolutionEvidence: [
          {
            url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_tree_resolved',
            uploadedAt: new Date(Date.now() - 40 * 3600 * 1000),
          },
        ],
        resolutionNotes: 'Horticulture crew sawed down fallen limb and cleared the lane for normal traffic flow.',
        resolutionSubmittedAt: new Date(Date.now() - 40 * 3600 * 1000),
        resolvedAt: new Date(Date.now() - 40 * 3600 * 1000),
        confirmationWindowExpiresAt: new Date(Date.now() + 32 * 3600 * 1000),
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen1.name,
            updatedBy: citizen1._id,
            timestamp: new Date(Date.now() - 80 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            timestamp: new Date(Date.now() - 60 * 3600 * 1000),
          },
          {
            status: 'resolved',
            updatedByName: worker1.name,
            updatedBy: worker1._id,
            timestamp: new Date(Date.now() - 40 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1007',
        title: 'Broken manhole cover near pedestrian crossing',
        description: 'Cast iron cover is cracked in half with a gap wide enough for a person foot to fall through. Highly dangerous for evening pedestrians.',
        category: 'drainage',
        severity: 'critical',
        severityWeight: 4,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_manhole_1',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8860, 19.0880],
        },
        address: 'Zebra Crossing, Commercial Complex, Ward 2',
        ward: 'Ward 2 - North Zone',
        aiClassification: {
          label: 'Damaged Manhole Cover Opening',
          confidence: 0.95,
          reasoning: 'Direct structural opening in pedestrian walkway.',
          processedAt: new Date(Date.now() - 15 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 4,
        priorityScore: 160,
        status: 'in_progress',
        assignedWorker: worker2._id,
        reporters: [
          {
            user: citizen2._id,
            name: citizen2.name,
            email: citizen2.email,
            phone: citizen2.phone,
            reportedAt: new Date(Date.now() - 15 * 3600 * 1000),
          },
          {
            user: citizen3._id,
            name: citizen3.name,
            email: citizen3.email,
            phone: citizen3.phone,
            reportedAt: new Date(Date.now() - 10 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen2.name,
            updatedBy: citizen2._id,
            note: 'Urgent danger report.',
            timestamp: new Date(Date.now() - 15 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            note: 'Assigned to field worker with replacement SFRC heavy slab.',
            timestamp: new Date(Date.now() - 8 * 3600 * 1000),
          },
          {
            status: 'in_progress',
            updatedByName: worker2.name,
            updatedBy: worker2._id,
            note: 'Temporary safety barricade erected, new concrete ring installation underway.',
            timestamp: new Date(Date.now() - 2 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1008',
        title: 'Series of small potholes along Market Main Road',
        description: 'Road surface is deteriorating with multiple 4-6 inch potholes developing along the bus lane.',
        category: 'pothole',
        severity: 'medium',
        severityWeight: 2,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_pothole_2',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8800, 19.0740],
        },
        address: 'Market Main Road, Near Bank of Baroda, Ward 1',
        ward: 'Ward 1 - Central Zone',
        aiClassification: {
          label: 'Asphalt Pavement Deterioration',
          confidence: 0.87,
          reasoning: 'Surface patch distress and minor pothole clusters.',
          processedAt: new Date(Date.now() - 5 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 1,
        priorityScore: 20,
        status: 'reported',
        assignedWorker: null,
        reporters: [
          {
            user: citizen1._id,
            name: citizen1.name,
            email: citizen1.email,
            phone: citizen1.phone,
            reportedAt: new Date(Date.now() - 5 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen1.name,
            updatedBy: citizen1._id,
            note: 'Report submitted by citizen.',
            timestamp: new Date(Date.now() - 5 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1009',
        title: 'Complete blackout on 4th Cross Link Road - 6 consecutive poles dark',
        description: 'Circuit breaker tripped or cable cut, leaving whole residential corridor in total pitch darkness. Senior citizens unable to walk safely at night.',
        category: 'streetlight',
        severity: 'high',
        severityWeight: 3,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_light_2',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8980, 19.0950],
        },
        address: '4th Cross Link Road, East Zone',
        ward: 'Ward 3 - East Zone',
        aiClassification: {
          label: 'Multiple Streetlight Circuit Failure',
          confidence: 0.92,
          reasoning: 'Consecutive non-functioning luminaires on public transit lane.',
          processedAt: new Date(Date.now() - 22 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 3,
        priorityScore: 90,
        status: 'assigned',
        assignedWorker: worker3._id,
        reporters: [
          {
            user: citizen3._id,
            name: citizen3.name,
            email: citizen3.email,
            phone: citizen3.phone,
            reportedAt: new Date(Date.now() - 22 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen3.name,
            updatedBy: citizen3._id,
            timestamp: new Date(Date.now() - 22 * 3600 * 1000),
          },
          {
            status: 'assigned',
            updatedByName: admin.name,
            updatedBy: admin._id,
            note: `Work order dispatched to ${worker3.name}`,
            timestamp: new Date(Date.now() - 14 * 3600 * 1000),
          },
        ],
      },
      {
        ticketId: 'CR-2026-1010',
        title: 'Contaminated murky tap water supply in residential sector 5',
        description: 'Water coming out of municipal tap lines is discolored brown and smelling of sewer infiltration. Urgent testing and purification needed.',
        category: 'water',
        severity: 'critical',
        severityWeight: 4,
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1000&q=80',
            public_id: 'sample_water_2',
          },
        ],
        location: {
          type: 'Point',
          coordinates: [72.8620, 19.0510],
        },
        address: 'Building 12, Sector 5, South Ward',
        ward: 'Ward 4 - South Zone',
        aiClassification: {
          label: 'Drinking Water Contamination Hazard',
          confidence: 0.94,
          reasoning: 'Visual signs of high turbidity and biological/organic contamination in public water line.',
          processedAt: new Date(Date.now() - 11 * 3600 * 1000),
        },
        needsManualReview: false,
        recurrenceCount: 4,
        priorityScore: 160,
        status: 'verified',
        assignedWorker: null,
        reporters: [
          {
            user: citizen4._id,
            name: citizen4.name,
            email: citizen4.email,
            phone: citizen4.phone,
            reportedAt: new Date(Date.now() - 11 * 3600 * 1000),
          },
        ],
        timeline: [
          {
            status: 'reported',
            updatedByName: citizen4.name,
            updatedBy: citizen4._id,
            timestamp: new Date(Date.now() - 11 * 3600 * 1000),
          },
          {
            status: 'verified',
            updatedByName: 'System',
            note: 'High priority flag triggered for Public Health & Water Quality board.',
            timestamp: new Date(Date.now() - 10 * 3600 * 1000),
          },
        ],
      },
    ];

    const createdIssues = await Issue.create(sampleIssues);
    console.log(`[Seed] Successfully created ${createdIssues.length} issues.`);

    // 4. Create Confirmation Votes for resolved / pending confirmation issues
    console.log('[Seed] Creating citizen confirmation votes...');
    const resolvedIssue = createdIssues.find((i) => i.ticketId === 'CR-2026-1002');
    const pendingConfIssue = createdIssues.find((i) => i.ticketId === 'CR-2026-1003');

    const votes = [];
    if (resolvedIssue) {
      votes.push(
        {
          issueId: resolvedIssue._id,
          userId: citizen2._id,
          voterName: citizen2.name,
          vote: 'confirm',
          comment: 'Verified this morning. The garbage bin was emptied and area cleaned properly.',
        },
        {
          issueId: resolvedIssue._id,
          userId: citizen1._id,
          voterName: citizen1.name,
          vote: 'confirm',
          comment: 'Looks clean now, thanks for quick resolution!',
        }
      );
    }

    if (pendingConfIssue) {
      votes.push({
        issueId: pendingConfIssue._id,
        userId: citizen1._id,
        voterName: citizen1.name,
        vote: 'confirm',
        comment: 'Saw the worker installing the light bracket yesterday evening. Great job!',
      });
    }

    if (votes.length > 0) {
      await ConfirmationVote.create(votes);
      console.log(`[Seed] Created ${votes.length} confirmation votes.`);
    }

    console.log('\n===========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY! ');
    console.log('===========================================');
    console.log('Demo Credentials:');
    console.log('  Admin:   admin@gmail.com / admin123');
    console.log('  Worker:  worker@gmail.com / worker123');
    console.log('  Citizen: aarav.citizen@example.com / password123');
    console.log('===========================================\n');

    await mongoose.disconnect();
    console.log('[Seed] Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
