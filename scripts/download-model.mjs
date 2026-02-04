import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_ID = 'onnx-community/Deep-Fake-Detector-v2-Model-ONNX';
const FILES_TO_DOWNLOAD = [
    'model_quantized.onnx',
    'config.json',
    'preprocessor_config.json'
];

const TARGET_DIR = path.join(__dirname, '../public/models/deepfake-detector');

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const downloadFile = async (filename) => {
    const url = `https://huggingface.co/${MODEL_ID}/resolve/main/${filename}`;
    const dest = path.join(TARGET_DIR, filename);

    if (fs.existsSync(dest)) {
        console.log(`Skipping ${filename} (already exists)`);
        return;
    }

    console.log(`Downloading ${filename} from ${url}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(dest, buffer);
        console.log(`Downloaded ${filename}`);
    } catch (error) {
        console.error(`Error downloading ${filename}:`, error);
        throw error;
    }
};

async function main() {
    try {
        for (const file of FILES_TO_DOWNLOAD) {
            await downloadFile(file);
        }
        console.log('All model files downloaded successfully!');
    } catch (error) {
        console.error('Download failed:', error);
        process.exit(1);
    }
}

main();
