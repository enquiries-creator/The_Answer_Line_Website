"use client";

import Script from "next/script";

const AGENT_ID = "agent_4501kx8pad7qea483yt72ybbmpyb";

export default function TalkWidget() {
  return (
    <div className="flex justify-center">
      <div
        // ElevenLabs web component — rendered via innerHTML because it's a
        // custom element TypeScript doesn't know about
        dangerouslySetInnerHTML={{
          __html: `<elevenlabs-convai agent-id="${AGENT_ID}"></elevenlabs-convai>`,
        }}
      />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
      />
    </div>
  );
}
