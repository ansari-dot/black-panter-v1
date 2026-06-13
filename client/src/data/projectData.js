import UPS from '../assets/UPS.webp';
import Man from '../assets/Man.webp';
import emr from '../assets/Emer.webp';

export const projectData = [
  {
    slug: 'critical-ups-replacement',
    title: 'Critical UPS Replacement',
    subtitle: 'Zero-downtime battery bank upgrade.',
    description: 'We replaced a legacy UPS battery bank with a high-efficiency solution that protected uptime during the cutover and improved reliability for the long term.',
    heroTitle: {
      line1: { white: 'Critical ', orange: 'UPS' },
      line2: { white: 'Replacement', orange: '' },
    },
    heroTag: 'Project Detail',
    image: UPS,
    gallery: [UPS, Man, emr],
    highlights: [
      'Zero downtime migration',
      'Improved backup reliability',
      'Modernized battery bank',
      'Commissioning and load testing',
    ],
    metrics: [
      { label: 'Downtime', value: '0 min' },
      { label: 'Reliability', value: '+38%' },
      { label: 'Scope', value: 'UPS Upgrade' },
    ],
    process: [
      'Site audit and load review',
      'Safe isolation and removal',
      'New battery bank installation',
      'Testing, validation, and handover',
    ],
  },
  {
    slug: 'manufacturing-plant-overhaul',
    title: 'Manufacturing Plant Overhaul',
    subtitle: 'Complete battery system modernization.',
    description: 'A full site modernization covering testing, refurbishment, and improved maintenance workflows for a busy plant environment.',
    heroTitle: {
      line1: { white: 'Manufacturing ', orange: 'Plant' },
      line2: { white: 'Overhaul', orange: '' },
    },
    heroTag: 'Project Detail',
    image: Man,
    gallery: [Man, UPS, emr],
    highlights: [
      'Modernized battery infrastructure',
      'Safer maintenance procedures',
      'Better monitoring and diagnostics',
      'Reduced emergency callouts',
    ],
    metrics: [
      { label: 'Systems', value: '24' },
      { label: 'Efficiency', value: '+42%' },
      { label: 'Scope', value: 'Plant Wide' },
    ],
    process: [
      'Inspection and fault mapping',
      'Replacement planning',
      'Modern controls rollout',
      'Final validation and support',
    ],
  },
  {
    slug: 'emergency-response-service',
    title: 'Emergency Response Service',
    subtitle: '24/7 critical power restoration.',
    description: 'Rapid-response support for urgent failures with a streamlined restoration workflow and fast deployment to keep operations moving.',
    heroTitle: {
      line1: { white: 'Emergency ', orange: 'Response' },
      line2: { white: 'Service', orange: '' },
    },
    heroTag: 'Project Detail',
    image: emr,
    gallery: [emr, UPS, Man],
    highlights: [
      'Fast dispatch and diagnosis',
      'Temporary power support',
      'Critical restoration workflow',
      'Clear post-incident reporting',
    ],
    metrics: [
      { label: 'Response', value: '24/7' },
      { label: 'Restore', value: '< 2 hrs' },
      { label: 'Scope', value: 'Emergency' },
    ],
    process: [
      'Urgent callout and triage',
      'Temporary stabilization',
      'Permanent repair or swap',
      'Reporting and prevention steps',
    ],
  },
];
