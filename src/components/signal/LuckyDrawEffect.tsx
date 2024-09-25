import React, { useEffect, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src: string;
        background: string;
        speed: string;
        loop: boolean;
        autoplay: boolean;
      };
    }
  }
}

const LuckyDrawEffect = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {scriptLoaded && (
        <dotlottie-player
          src="https://lottie.host/aba3f407-a95a-4dab-81c2-90a64006e0fc/V42zvLqjse.json"
          background="transparent"
          speed="1"
          style={{
            width: "300px",
            height: "300px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          loop
          autoplay
        ></dotlottie-player>
      )}
    </>
  );
};

export default LuckyDrawEffect;
