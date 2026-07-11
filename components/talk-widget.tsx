"use client";

import Script from "next/script";

const AGENT_ID = "agent_4501kx8pad7qea483yt72ybbmpyb";

// The ElevenLabs widget always renders as a floating launcher in the
// bottom-right corner of the viewport (it can't be embedded inline), so
// this component mounts it once and the page copy points people at it.
export default function TalkWidget() {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: `<elevenlabs-convai agent-id="${AGENT_ID}" action-text="Don’t believe it? Talk to it" start-call-text="Talk to it now" end-call-text="Hang up" listening-text="Listening…" speaking-text="Talking…"></elevenlabs-convai>`,
        }}
      />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
      />
    </>
  );
}
