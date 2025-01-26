import React from "react";

export const Loader: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "text-orange-500",
}) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-${color} border-t-transparent`}
      style={{
        width: size,
        height: size,
      }}
      role="status"
      aria-label="Loading"
    ></div>
  );
};
