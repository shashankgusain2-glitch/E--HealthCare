"use client";
import { CheckCircle, AlertCircle } from "lucide-react";

interface FeedbackAlertProps {
  type: "success" | "error";
  message: string;
}

export default function FeedbackAlert({ type, message }: FeedbackAlertProps) {
  if (!message) return null;
  const isSuccess = type === "success";

  return (
    <div
      className={`p-4 rounded-lg flex gap-3 shadow-md border ${
        isSuccess
          ? "bg-green-100 border-green-200"
          : "bg-red-100 border-red-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <h3
          className={`font-semibold ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}
        >
          {isSuccess ? "Success" : "Error"}
        </h3>
        <p
          className={`text-sm ${
            isSuccess ? "text-green-600/90" : "text-red-600/90"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
