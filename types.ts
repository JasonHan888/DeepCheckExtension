export enum AnalysisMode {
  URL = 'URL'
}

export enum AppScreen {
  STARTUP = 'STARTUP',
  URL_INPUT = 'URL_INPUT',
  URL_ANALYZING = 'URL_ANALYZING',
  URL_RESULT = 'URL_RESULT',
  ABOUT = 'ABOUT'
}

export interface URLAnalysisResult {
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
}