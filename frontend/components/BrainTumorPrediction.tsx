"use client";

import { useState } from "react";
import axios from "axios";
import { Upload, Brain, Loader2, Activity } from "lucide-react";

export default function BrainTumorPrediction() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    predicted_label: string;
    confidence: number;
    probabilities: Record<string, number>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handlePredict = async () => {
    if (!file) return alert("Please upload an MRI scan first.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-xl mx-auto mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-slate-800">Brain Tumor Prediction</h2>
      </div>

      {/* Upload Section */}
      <div className="flex flex-col items-center border-2 border-dashed border-slate-300 p-6 rounded-xl mb-6">
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="MRI Preview"
              className="w-48 h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm text-slate-600">{file.name}</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-slate-400 mb-2" />
            <p className="text-slate-500 text-sm">Upload MRI image for analysis</p>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4 text-sm" />
      </div>

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        disabled={loading || !file}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Brain className="h-5 w-5" />}
        {loading ? "Analyzing..." : "Predict Brain Tumor"}
      </button>

      {/* Result Section */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-lg font-semibold text-slate-800">
            Prediction:{" "}
            <span className="text-green-700 capitalize">{result.predicted_label}</span>
          </p>
          <p className="text-sm text-slate-600 mb-3">
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </p>

          <div className="mt-4 bg-white border border-green-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium text-green-700">Class Probabilities</p>
            </div>
            <ul className="space-y-2">
              {Object.entries(result.probabilities).map(([label, prob]) => (
                <li key={label} className="flex justify-between text-sm text-slate-700">
                  <span className="capitalize">{label}</span>
                  <span className="font-medium text-slate-800">{(prob * 100).toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
