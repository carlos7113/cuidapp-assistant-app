
export interface HealthStat {
  icon: string;
  label: string;
  value: string;
  unit: string;
  status: string;
  color: 'green' | 'blue' | 'red' | 'orange';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}
