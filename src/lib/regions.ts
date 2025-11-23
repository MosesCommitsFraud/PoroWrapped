export const REGIONS = {
      'EUW': { region: 'europe', platform: 'euw1' },
      'EUNE': { region: 'europe', platform: 'eun1' },
      'NA': { region: 'americas', platform: 'na1' },
      'KR': { region: 'asia', platform: 'kr' },
      'TR': { region: 'europe', platform: 'tr1' },
      'RU': { region: 'europe', platform: 'ru' },
      'BR': { region: 'americas', platform: 'br1' },
      'LAN': { region: 'americas', platform: 'la1' },
      'LAS': { region: 'americas', platform: 'la2' },
      'OCE': { region: 'americas', platform: 'oc1' }, // OCE is weird, routed to americas for account-v1? Or sea? Usually americas for account-v1 routing is safe-ish or asia? Actually OCE is technically its own but API routing often groups it. Let's stick to 'sea' or 'americas'. Riot docs say: "Americas: NA, BR, LAN, LAS, OCE".
      'JP': { region: 'asia', platform: 'jp1' },
      // ... others
};

export type RegionKey = keyof typeof REGIONS;



