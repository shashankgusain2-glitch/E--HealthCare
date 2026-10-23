"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ConsultationInner: React.FC = () => {
  const searchParams = useSearchParams();
  const roomFromUrl = searchParams.get("roomID") || "";

  const [meetingId, setMeetingId] = useState(roomFromUrl);
  const [isJoined, setIsJoined] = useState(!!roomFromUrl);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zegoInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    const startMeeting = async (element: HTMLDivElement) => {
      // The backend signs the call token, so the Zego server secret never reaches the browser.
      const res = await fetch("/api/consultation/token");
      if (!res.ok) {
        if (isMounted) setError("Couldn't start the video call. Please refresh the page and try again.");
        return;
      }
      const { appID, token, userID, userName } = await res.json();

      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      if (!isMounted) return; // left the page while we were loading

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        token,
        meetingId,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zegoInstanceRef.current = zp;

      zp.joinRoom({
        container: element,
        sharedLinks: [
          { name: "Invite Link", url: `${window.location.origin}/consultation?roomID=${meetingId}` },
        ],
        scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
        showPreJoinView: true,
      });
    };

    if (isJoined && containerRef.current) startMeeting(containerRef.current);

    return () => {
      isMounted = false;
      // Cleanup: stop camera/mic and destroy SDK instance
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }
    };
  }, [isJoined, meetingId]);

  const handleLeave = () => {
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.destroy();
      zegoInstanceRef.current = null;
    }
    setIsJoined(false);
    setMeetingId("");
    setError("");
    window.history.replaceState(null, "", "/consultation"); // clean URL
  };

  if (!isJoined) {
    // Step 1: Ask for Meeting ID
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-green-200">
          <h1 className="text-3xl font-semibold text-emerald-700 mb-6">Join Video Consultation</h1>
          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-5 text-gray-800 placeholder-gray-400 transition"
          />
          <button
            onClick={() => meetingId.trim() && setIsJoined(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition duration-200"
          >
            Join Call
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Enter the meeting ID shared with you to start your consultation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen from-emerald-100 via-white to-green-50 text-gray-800">
      <header className="flex items-center justify-between px-6 py-3 bg-emerald-600 text-white shadow-md">
        <h1 className="text-xl font-semibold">💬 Video Consultation</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-90">
            Room: <strong>{meetingId}</strong>
          </span>
          <button
            onClick={handleLeave}
            className="bg-white text-emerald-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-emerald-100 transition"
          >
            Leave
          </button>
        </div>
      </header>

      {error && (
        <p className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div
        ref={containerRef}
        className="flex-1 m-4 rounded-xl overflow-hidden border border-emerald-200 shadow-lg bg-white"
      />

      <footer className="py-2 text-center text-xs text-gray-500 border-t border-emerald-200">
        Powered by <span className="text-emerald-600 font-medium">HealthCare+</span>
      </footer>
    </div>
  );
};

export default function VideoConsultationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-600">Loading consultation...</div>}>
      <ConsultationInner />
    </Suspense>
  );
}
