import { Client } from "@gradio/client";
import { URLAnalysisResult } from '../types';

/**
 * Connects to the Hugging Face Space and analyzes the URL.
 * Space: jasonhan888/my-url-scanner
 */
export async function checkUrlWithHuggingFace(url: string): Promise<URLAnalysisResult> {
    try {
        const client = await Client.connect("jasonhan888/my-url-scanner");

        // Use the named endpoint /predict as requested by user
        // Pass arguments as an array
        const result = await client.predict("/predict", [url]);

        // Log the raw result to see what came back
        console.log("Raw HF Result:", result);

        // The data usually resides in the 'data' array
        const apiResponse = (result as any).data[0];

        if (!apiResponse) {
            throw new Error("No data received from analysis API");
        }

        if (apiResponse.error) {
            throw new Error(apiResponse.error);
        }

        const prediction = apiResponse;

        // Map the backend response to URLAnalysisResult interface

        let riskScore = 0;
        let classification: 'Legitimate' | 'Suspicious' | 'Malicious' = 'Legitimate';

        if (prediction.is_malicious) {
            classification = 'Malicious';
            riskScore = Math.min(Math.round(prediction.confidence * 100), 100);
            if (riskScore < 70) classification = 'Suspicious';
            if (riskScore === 0) riskScore = 90;
        } else {
            // Safe
            riskScore = Math.max(0, 100 - Math.round(prediction.confidence * 100));
            if (riskScore > 65) classification = 'Malicious';
            else if (riskScore > 30) classification = 'Suspicious';
        }

        const category = prediction.category || 'unknown';

        let explanation = "";
        if (prediction.is_malicious) {
            explanation = `Detected as ${category} with ${(prediction.confidence * 100).toFixed(1)}% confidence.`;
        } else {
            explanation = `Classified as ${category} (Safe) with ${(prediction.confidence * 100).toFixed(1)}% confidence.`;
        }

        return {
            classification,
            riskScore,
            explanation,
            details: {
                protocol: url.startsWith('https') ? 'https:' : 'http:',
                hasHttps: url.startsWith('https'),
                isIpBased: false,
                suspiciousTLD: false,
                hasPhishingKeywords: false,
                tooManySubdomains: false,
                unusualLength: false,
                specialCharCount: 0,
            }
        };

    } catch (error: any) {
        console.error("Hugging Face Space analysis failed:", error);
        throw error;
    }
}
