import React from 'react';
import { Icon } from './Icon';

interface AboutScreenProps {
    onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
    return (
        <div className="h-full min-h-full flex flex-col bg-white relative overflow-y-auto">
            {/* Header */}
            <div className="w-full px-6 pt-12 pb-4 flex items-center shrink-0 z-20 sticky top-0 bg-white/90 backdrop-blur-sm border-b border-slate-100">
                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100 -ml-2"
                    aria-label="Back"
                >
                    <Icon name="arrow_back" className="text-2xl" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 ml-4">About DeepCheck</h1>
            </div>

            <div className="flex-1 px-6 py-8 flex flex-col gap-8 max-w-2xl mx-auto w-full">
                {/* App Version & Logo */}
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
                        <Icon name="shield" className="text-4xl" filled />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">DeepCheck</h2>
                        <p className="text-slate-500 text-sm font-medium">Version 1.0</p>
                    </div>
                </div>

                {/* Creators Section */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Created By</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm font-bold text-sm">
                                JO
                            </div>
                            <span className="font-semibold text-slate-800">Jason Oh</span>
                        </div>
                        <div className="w-full h-px bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm font-bold text-sm">
                                FK
                            </div>
                            <span className="font-semibold text-slate-800">Fong Kia En</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Terms of Service</h3>
                    <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                        <p>
                            By using DeepCheck, you agree to these terms. This application is provided "as is" for informational purposes only.
                        </p>
                        <p>
                            <strong>1. Usage of Service:</strong> DeepCheck allows users to analyze URLs and images for potential security risks. You agree not to use this service for any illegal activities or to analyze content you do not have permission to access.
                        </p>
                        <p>
                            <strong>2. No Warranty:</strong> While we strive for accuracy, DeepCheck cannot guarantee 100% detection of all threats or deepfakes. Results should be used as one of many indicators for decision making.
                        </p>
                        <p>
                            <strong>3. Limitations:</strong> The creators (Jason Oh & Fong Kia En) are not liable for any damages arising from the use or inability to use this application.
                        </p>
                    </div>
                </div>

                {/* Privacy Policy */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Privacy Policy</h3>
                    <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                        <p>
                            Your privacy is important to us. This policy explains how we handle your data.
                        </p>
                        <p>
                            <strong>1. No Data Storage:</strong> We do not permanently store your analyzed images or URLs. Analysis is performed in real-time and results are discarded after your session.
                        </p>
                        <p>
                            <strong>2. Local Processing:</strong> Whenever possible, checks are performed locally on your device to minimize data transmission.
                        </p>
                    </div>
                </div>

                <div className="pt-8 text-center">
                    <p className="text-xs text-slate-400">
                        © 2026 DeepCheck Project. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};
