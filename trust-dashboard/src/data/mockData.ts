import { ConnectedApp, ActivityLog, Recommendation, DashboardMetrics } from '../types';

export const mockApps: ConnectedApp[] = [
  {
    id: '1',
    name: 'Google Chrome',
    logoUrl: 'Chrome',
    riskLevel: 'Moderate',
    trustScore: 78,
    lastAccessed: '2026-03-25T11:45:00Z',
    dataCategories: ['Location', 'Microphone', 'Camera'],
    usageFrequency: 'High',
    riskExplanation: 'Frequent background data usage for location and browsing telemetry. Standard for browsers.',
    permissions: [
      { id: 'p1', category: 'Location', isOptional: true, isGranted: true, purpose: 'Used to provide local search results.' },
      { id: 'p2', category: 'Microphone', isOptional: true, isGranted: false, purpose: 'Voice search capabilities.' },
      { id: 'p3', category: 'Camera', isOptional: true, isGranted: false, purpose: 'QR code scanning and WebRTC.' }
    ]
  },
  {
    id: '2',
    name: 'Spotify',
    logoUrl: 'Music',
    riskLevel: 'Safe',
    trustScore: 92,
    lastAccessed: '2026-03-25T13:00:00Z',
    dataCategories: ['Location', 'Microphone'],
    usageFrequency: 'High',
    riskExplanation: 'Minimal background tracking. Does not share data with third parties aggressively.',
    permissions: [
      { id: 'p4', category: 'Location', isOptional: true, isGranted: false, purpose: 'Concert recommendations near you.' },
      { id: 'p5', category: 'Microphone', isOptional: true, isGranted: true, purpose: 'Voice commands for hands-free driving.' }
    ]
  },
  {
    id: '3',
    name: 'Instagram',
    logoUrl: 'Camera',
    riskLevel: 'Moderate',
    trustScore: 65,
    lastAccessed: '2026-03-25T12:15:00Z',
    dataCategories: ['Photos', 'Camera', 'Microphone', 'Contacts', 'Location'],
    usageFrequency: 'High',
    riskExplanation: 'Has extensive access to media and contacts. Uses background location for targeted ads.',
    permissions: [
      { id: 'p6', category: 'Camera', isOptional: false, isGranted: true, purpose: 'Take photos and record stories.' },
      { id: 'p7', category: 'Photos', isOptional: false, isGranted: true, purpose: 'Upload posts to your feed.' },
      { id: 'p8', category: 'Location', isOptional: true, isGranted: true, purpose: 'Tag locations on your posts.' }
    ]
  },
  {
    id: '4',
    name: 'Snapchat',
    logoUrl: 'Ghost', 
    riskLevel: 'Risky',
    trustScore: 48,
    lastAccessed: '2026-03-20T09:00:00Z',
    dataCategories: ['Location', 'Camera', 'Contacts'],
    usageFrequency: 'Unused',
    riskExplanation: 'High risk: App has not been used in 5 days but continuously polls background location for Snap Map.',
    permissions: [
      { id: 'p9', category: 'Location', isOptional: true, isGranted: true, purpose: 'Share location on Snap Map.' },
      { id: 'p10', category: 'Camera', isOptional: false, isGranted: true, purpose: 'Capture snaps.' }
    ]
  },
  {
    id: '5',
    name: 'WhatsApp',
    logoUrl: 'MessageCircle',
    riskLevel: 'Safe',
    trustScore: 85,
    lastAccessed: '2026-03-25T13:10:00Z',
    dataCategories: ['Contacts', 'Microphone', 'Photos'],
    usageFrequency: 'High',
    riskExplanation: 'Maintains end-to-end encryption. Contact access is necessary for core functionality.',
    permissions: [
      { id: 'p11', category: 'Contacts', isOptional: false, isGranted: true, purpose: 'Sync address book to find contacts.' }
    ]
  },
  {
    id: '6',
    name: 'Amazon',
    logoUrl: 'ShoppingBag',
    riskLevel: 'Moderate',
    trustScore: 74,
    lastAccessed: '2026-03-23T16:20:00Z',
    dataCategories: ['Location', 'Camera', 'Microphone'],
    usageFrequency: 'Medium',
    riskExplanation: 'Collects substantial shopping behavior and location data for logistics and ads.',
    permissions: [
      { id: 'p12', category: 'Location', isOptional: true, isGranted: true, purpose: 'Determine optimal shipping times and locker locations.' }
    ]
  },
  {
    id: '7',
    name: 'YouTube',
    logoUrl: 'Youtube',
    riskLevel: 'Safe',
    trustScore: 81,
    lastAccessed: '2026-03-25T10:00:00Z',
    dataCategories: ['Location', 'Microphone'],
    usageFrequency: 'High',
    riskExplanation: 'Permissions are scoped properly. Watch history is stored by Google.',
    permissions: [
      { id: 'p13', category: 'Microphone', isOptional: true, isGranted: false, purpose: 'Voice search videos.' }
    ]
  },
  {
    id: '8',
    name: 'Google Maps',
    logoUrl: 'Map',
    riskLevel: 'Moderate',
    trustScore: 70,
    lastAccessed: '2026-03-25T08:30:00Z',
    dataCategories: ['Location', 'Microphone', 'Contacts'],
    usageFrequency: 'High',
    riskExplanation: 'Tracks location history persistently to provide timeline and traffic data.',
    permissions: [
      { id: 'p14', category: 'Location', isOptional: false, isGranted: true, purpose: 'Required for navigation and local recommendations.' }
    ]
  },
  {
    id: '9',
    name: 'Uber',
    logoUrl: 'Car',
    riskLevel: 'Risky',
    trustScore: 55,
    lastAccessed: '2026-03-01T19:40:00Z',
    dataCategories: ['Location', 'Contacts', 'Camera'],
    usageFrequency: 'Unused',
    riskExplanation: 'Tracks location frequently in background. Has not been actively opened in 24 days.',
    permissions: [
      { id: 'p15', category: 'Location', isOptional: false, isGranted: true, purpose: 'Required to request a ride.' },
      { id: 'p16', category: 'Contacts', isOptional: true, isGranted: true, purpose: 'Used for splitting fares.' }
    ]
  },
  {
    id: '10',
    name: 'Netflix',
    logoUrl: 'Film',
    riskLevel: 'Safe',
    trustScore: 95,
    lastAccessed: '2026-03-24T21:00:00Z',
    dataCategories: ['Location'],
    usageFrequency: 'High',
    riskExplanation: 'Only accesses location to verify regional content licensing.',
    permissions: [
      { id: 'p17', category: 'Location', isOptional: false, isGranted: true, purpose: 'Required for regional licensing.' }
    ]
  }
];

export const mockActivities: ActivityLog[] = [
  { id: 'a1', appId: '3', appName: 'Instagram', category: 'Location', timestamp: '2026-03-25T12:05:00Z', action: 'Accessed' },
  { id: 'a2', appId: '4', appName: 'Snapchat', category: 'Location', timestamp: '2026-03-25T11:30:00Z', action: 'Accessed' },
  { id: 'a3', appId: '1', appName: 'Google Chrome', category: 'Location', timestamp: '2026-03-25T11:15:00Z', action: 'Requested' },
  { id: 'a4', appId: '9', appName: 'Uber', category: 'Location', timestamp: '2026-03-25T10:00:00Z', action: 'Accessed' },
  { id: 'a5', appId: '5', appName: 'WhatsApp', category: 'Contacts', timestamp: '2026-03-25T09:20:00Z', action: 'Accessed' },
  { id: 'a6', appId: '8', appName: 'Google Maps', category: 'Location', timestamp: '2026-03-25T08:30:00Z', action: 'Accessed' },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'r1',
    appId: '4',
    title: 'Remove High-Risk Unused App',
    description: 'Snapchat is constantly polling your background location but hasn’t been opened in 5 days.',
    type: 'Remove'
  },
  {
    id: 'r2',
    appId: '9',
    title: 'Revoke Location Access',
    description: 'Uber maintains constant background location tracking. Change to "While Using" to improve privacy.',
    type: 'Limit'
  },
  {
    id: 'r3',
    appId: '3',
    title: 'Review Contact Syncing',
    description: 'Instagram just uploaded your latest address book to find friends. Consider turning this off.',
    type: 'Review'
  }
];

export const mockMetrics: DashboardMetrics = {
  overallTrustScore: 74,
  totalApps: 10,
  totalDataPointsShared: 25,
  safeApps: 4,
  moderateApps: 4,
  riskyApps: 2,
};
