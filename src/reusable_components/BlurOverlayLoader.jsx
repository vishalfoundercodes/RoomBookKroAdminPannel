import React from "react";

const BlurOverlayLoader = ({
  loading,
  children,
  text = "Updating data...",
}) => {
  return (
    <div className="relative">
      {/* Content */}
      <div className={`${loading ? "blur-sm pointer-events-none" : ""}`}>
        {children}
      </div>

      {/* Overlay Loader */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 text-gray-600 font-mono text-lg animate-pulse blur-[1px]">
              <span>0</span>
              <span>1</span>
              <span>0</span>
              <span>1</span>
              <span>…</span>
            </div>
            <span className="text-sm text-gray-600">{text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlurOverlayLoader;
