const mapping: Record<string, string> = {
  companies: 'company',
  influencers: 'influencer',
  transactions: 'transaction',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
