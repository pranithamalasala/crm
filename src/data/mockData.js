export const leads = [
  { id: 1, name: 'Aria Mendez', company: 'Veritas Cloud', email: 'aria@veritascloud.io', phone: '+1 415 209 3344', status: 'hot', score: 92, source: 'LinkedIn', value: 48000, assignee: 'Jake T.', createdAt: '2024-03-01' },
  { id: 2, name: 'Marcus Lin', company: 'NovaSpark AI', email: 'mlin@novaspark.ai', phone: '+1 332 881 0012', status: 'warm', score: 74, source: 'Referral', value: 22500, assignee: 'Priya S.', createdAt: '2024-03-04' },
  { id: 3, name: 'Chloe Reeves', company: 'Datum Systems', email: 'creeves@datum.io', phone: '+1 628 774 5501', status: 'cold', score: 41, source: 'Website', value: 9800, assignee: 'Jake T.', createdAt: '2024-03-07' },
  { id: 4, name: 'Omar Hassan', company: 'PeakFlow SaaS', email: 'omar@peakflow.com', phone: '+1 212 993 6623', status: 'hot', score: 88, source: 'Conference', value: 71000, assignee: 'Leila W.', createdAt: '2024-03-09' },
  { id: 5, name: 'Sofia Yuen', company: 'Brightwave Labs', email: 'syuen@brightwave.io', phone: '+1 510 445 2278', status: 'warm', score: 65, source: 'Email', value: 31200, assignee: 'Priya S.', createdAt: '2024-03-11' },
  { id: 6, name: 'Diego Navarro', company: 'TerraVault', email: 'dnavarro@terravault.co', phone: '+1 305 667 4490', status: 'hot', score: 95, source: 'LinkedIn', value: 89000, assignee: 'Leila W.', createdAt: '2024-03-12' },
  { id: 7, name: 'Priya Kapoor', company: 'Helios Fintech', email: 'pkapoor@heliosfin.com', phone: '+1 408 312 7780', status: 'cold', score: 33, source: 'Website', value: 7500, assignee: 'Jake T.', createdAt: '2024-03-14' },
  { id: 8, name: 'Noah Brennan', company: 'Crux Analytics', email: 'nbrennan@crux.ai', phone: '+1 617 554 9981', status: 'warm', score: 70, source: 'Referral', value: 28000, assignee: 'Priya S.', createdAt: '2024-03-15' },
]

export const pipelineStages = [
  {
    id: 'prospecting',
    label: 'Prospecting',
    color: 'slate',
    deals: [
      { id: 'd1', name: 'Veritas Cloud — Enterprise', value: 48000, company: 'Veritas Cloud', contact: 'Aria Mendez', probability: 20, daysInStage: 3 },
      { id: 'd2', name: 'Helios Fintech — Starter', value: 7500, company: 'Helios Fintech', contact: 'Priya Kapoor', probability: 15, daysInStage: 7 },
    ]
  },
  {
    id: 'qualification',
    label: 'Qualification',
    color: 'blue',
    deals: [
      { id: 'd3', name: 'NovaSpark AI — Growth', value: 22500, company: 'NovaSpark AI', contact: 'Marcus Lin', probability: 40, daysInStage: 5 },
      { id: 'd4', name: 'Crux Analytics — Pro', value: 28000, company: 'Crux Analytics', contact: 'Noah Brennan', probability: 35, daysInStage: 2 },
    ]
  },
  {
    id: 'proposal',
    label: 'Proposal',
    color: 'violet',
    deals: [
      { id: 'd5', name: 'Brightwave Labs — Team', value: 31200, company: 'Brightwave Labs', contact: 'Sofia Yuen', probability: 60, daysInStage: 8 },
      { id: 'd6', name: 'Datum Systems — Scale', value: 9800, company: 'Datum Systems', contact: 'Chloe Reeves', probability: 55, daysInStage: 4 },
    ]
  },
  {
    id: 'negotiation',
    label: 'Negotiation',
    color: 'amber',
    deals: [
      { id: 'd7', name: 'PeakFlow SaaS — Ent.', value: 71000, company: 'PeakFlow SaaS', contact: 'Omar Hassan', probability: 75, daysInStage: 6 },
    ]
  },
  {
    id: 'closed',
    label: 'Closed Won',
    color: 'emerald',
    deals: [
      { id: 'd8', name: 'TerraVault — Ent. Suite', value: 89000, company: 'TerraVault', contact: 'Diego Navarro', probability: 100, daysInStage: 1 },
    ]
  },
]

export const customers = [
  {
    id: 1, name: 'Diego Navarro', company: 'TerraVault', email: 'dnavarro@terravault.co',
    phone: '+1 305 667 4490', role: 'VP of Engineering', avatar: 'DN',
    status: 'customer', deal: '$89,000', plan: 'Enterprise Suite', joinDate: 'Mar 2024',
    tags: ['Enterprise', 'High-Value', 'Tech'],
    notes: 'Highly engaged champion. Interested in additional seats next quarter.',
    activities: [
      { type: 'call', label: 'Discovery call completed', date: '2 days ago' },
      { type: 'email', label: 'Proposal sent', date: '5 days ago' },
      { type: 'deal', label: 'Contract signed', date: '1 week ago' },
      { type: 'meeting', label: 'Kickoff scheduled', date: 'Today' },
    ]
  },
  {
    id: 4, name: 'Omar Hassan', company: 'PeakFlow SaaS', email: 'omar@peakflow.com',
    phone: '+1 212 993 6623', role: 'CEO', avatar: 'OH',
    status: 'negotiation', deal: '$71,000', plan: 'Enterprise', joinDate: 'Mar 2024',
    tags: ['SaaS', 'Hot Lead', 'Executive'],
    notes: 'Strong buy intent. Legal review in progress. Close expected this week.',
    activities: [
      { type: 'meeting', label: 'Final negotiation call', date: 'Yesterday' },
      { type: 'email', label: 'Updated MSA sent', date: '3 days ago' },
      { type: 'call', label: 'Pricing discussion', date: '1 week ago' },
    ]
  },
]

export const revenueData = [
  { month: 'Oct', revenue: 42000, target: 50000 },
  { month: 'Nov', revenue: 56000, target: 55000 },
  { month: 'Dec', revenue: 48000, target: 58000 },
  { month: 'Jan', revenue: 71000, target: 65000 },
  { month: 'Feb', revenue: 63000, target: 70000 },
  { month: 'Mar', revenue: 89000, target: 75000 },
]

export const conversionData = [
  { stage: 'Leads', count: 284 },
  { stage: 'Qualified', count: 131 },
  { stage: 'Proposal', count: 68 },
  { stage: 'Negotiation', count: 29 },
  { stage: 'Closed', count: 18 },
]
