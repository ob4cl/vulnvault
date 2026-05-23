export interface Exploit {
  exploit_id: string;
  cve: string;
  vulnerability_type: string;
  platform: string;
  architecture: string;
  payload_goal: string;
  cvss_score: number | string;
  shellcode: string;
  description: string;
  source: string;
  date_added?: string;
}

export interface AIResponse {
  analysis: string;
  related_cves: string[];
  mitigation: string;
}

export type FilterState = {
  query: string;
  vulnType: string;
  platform: string;
  architecture: string;
  payloadGoal: string;
  minCvss: number;
  maxCvss: number;
};
