# DeepCheck: The Private AI-Powered Security Suite 🛡️

DeepCheck is a cutting-edge security platform designed to protect individuals and organizations from the next generation of digital fraud. By combining **local, privacy-first AI analysis** with **intelligent threat heuristics**, DeepCheck provides a comprehensive shield against deepfakes and malicious web content.

## 🚀 Problem Statement
As generative AI becomes more accessible, "seeing is no longer believing." Deepfake media and increasingly sophisticated phishing attacks are bypassing traditional security filters. Most current solutions require users to upload sensitive data to the cloud for analysis, creating significant privacy risks and latency issues.

## 💡 The Solution
DeepCheck solves this by bringing advanced analysis **directly to the user**. By leveraging on-device machine learning and high-performance PWA technology, we provide instant, high-accuracy security verdicts without compromising personal privacy.

### Core Features
*   **Local AI Deepfake Detection**: Analyze images for AI manipulation using on-device models. Your photos never leave your browser.
*   **Heuristic URL Analysis**: Real-time evaluation of domain reputation, SSL status, and brand impersonation risks using advanced pattern recognition.
*   **Native PWA Experience**: Optimized for mobile with `100svh` layout stability, safe-area inset support (notches), and native history-based navigation (Back/Swipe support).
*   **Soft Handoff Transitions**: High-performance "Card Stacking" transition engine ensures zero visual glitches or flashes during application startup.
*   **System Status Heartbeat**: Real-time indicator that ensures your local analysis environment is primed and protected.

---

## 🏗️ System Architecture
DeepCheck is built with a focus on modularity and high performance:

1.  **Frontend (React/Vite)**: A sleek, mobile-ready interface that handles user input and visualizes risk metrics.
2.  **Web Worker Engine**: Runs heavy AI inference (Transformers.js) in a separate thread to ensure the UI remains buttery smooth.
3.  **Stability Layer**: Strict PWA viewport handling and transition management to ensure a "native" feel on Android and iOS.
4.  **Local Model Cache**: AI models are downloaded once and cached locally, enabling faster subsequent scans.

---

## 🛠️ Tech Stack
*   **UI/UX**: React 19, TypeScript, Tailwind CSS
*   **AI Inference**: [Transformers.js](https://huggingface.co/docs/transformers.js)
*   **Stability**: HTML5 History API (SPA Navigation), CSS `svh` Viewport Units
*   **Connectivity**: High-performance Gradio Client for hybrid analysis.

---

## 📥 Setup & Installation

### Requirements
*   Node.js v18+
*   NPM or Yarn

### 1. Installation
```bash
git clone https://github.com/JasonHan888/deepcheck.git
cd deepcheck
npm install
```

### 2. Run Locally
```bash
npm run dev
```

---

## 🛡️ Security & Privacy
*   **Privacy by Default**: Photos uploaded for deepfake check are processed locally on your device. They are never transmitted, stored, or processed on any server.
*   **Data Sovereignty**: DeepCheck prioritizes on-device computation, ensuring that your sensitive data remains under your control at all times.

## 🚧 Roadmap
*   **Video Analysis**: Expanding the worker engine to support real-time video deepfake detection.
*   **PDF Forensic Reports**: More detailed printable reports for security professionals.
*   **Always-On Protection**: Porting the URL scanner to a background service for continuous monitoring.

---
*DeepCheck: Trust, Verified.*
