import gradio as gr
from transformers import pipeline
import torch
import sys

# Logging setup
print("Starting app...", flush=True)

# Load the model
model_path = "r3ddkahili/final-complete-malicious-url-model"
pipe = None
load_error = None

try:
    print(f"Loading model from {model_path}...", flush=True)
    # Explicitly trying to load pipeline. 
    # Ensure peft is installed in requirements.txt
    pipe = pipeline("text-classification", model=model_path)
    print("Model loaded successfully!", flush=True)
except Exception as e:
    load_error = str(e)
    print(f"CRITICAL ERROR loading model: {e}", file=sys.stderr, flush=True)

# Label mapping
LABEL_MAP = {
    "LABEL_0": "safe",
    "LABEL_1": "defacement",
    "LABEL_2": "phishing",
    "LABEL_3": "malware"
}

def predict_url(url):
    """
    Predicts the category of a given URL.
    """
    if load_error:
        return {"error": f"Model failed to load: {load_error}"}
        
    if not pipe:
        return {"error": "Model is not loaded (unknown reason)."}

    if not url:
        return {"error": "No URL provided"}
        
    try:
        # The model expects a string input
        results = pipe(url)
        # Result is a list of dicts, e.g., [{'label': 'LABEL_0', 'score': 0.99}]
        result = results[0]
        
        label_key = result['label']
        score = result['score']
        
        category = LABEL_MAP.get(label_key, "unknown")
        
        # Determine if malicious (safe is usually considered non-malicious)
        is_malicious = category != "safe"
        
        return {
            "url": url,
            "category": category,
            "confidence": float(score),
            "is_malicious": is_malicious
        }
    except Exception as e:
        print(f"Prediction error: {e}", file=sys.stderr, flush=True)
        return {"error": str(e)}

# create a Gradio interface
iface = gr.Interface(
    fn=predict_url,
    inputs=gr.Textbox(label="URL", placeholder="Enter URL to scan..."),
    outputs=gr.JSON(label="Analysis Result"),
    title="Malicious URL Scanner",
    description="Enter a URL to check if it's safe, phishing, malware, or defacement."
)

if __name__ == "__main__":
    iface.launch()
