/**
 * Safe Browsing API Types
 * Interfaces for Google Safe Browsing API v4 responses and our internal analysis result
 */

export interface SafeBrowsingThreatMatch {
  threat: {
    url: string;
  };
  platformType: string;
  threatType: string;
  cacheDuration?: string;
}

export interface SafeBrowsingApiResponse {
  matches?: SafeBrowsingThreatMatch[];
}

export interface URLSafeBrowsingResult {
  classification: 'Legitimate' | 'Suspicious' | 'Malicious';
  riskScore: number; // 0-100
  explanation: string;
  details: {
    protocol: string;
    hasHttps: boolean;
    isIpBased: boolean;
    suspiciousTLD: boolean;
    hasPhishingKeywords: boolean;
    tooManySubdomains: boolean;
    unusualLength: boolean;
    specialCharCount: number;
  };
  threatTypes?: string[]; // e.g., ['MALWARE', 'SOCIAL_ENGINEERING']
}

export interface AnalyzeUrlRequest {
  url: string;
}

export interface AnalyzeUrlResponse extends URLSafeBrowsingResult {}
