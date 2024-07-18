import * as React from "react";

// Helper Functions and Types
const cssValue = (value) => (typeof value === "number" ? `${value}px` : value);

export type LoaderSizeProps = {
  loading?: boolean;
  color?: string;
  speedMultiplier?: number;
  cssOverride?: React.CSSProperties;
  size?: number;
};

const createAnimation = (name, frames, identifier) => {
  const styleSheet = document.styleSheets[0];
  const keyframes =
    `@keyframes ${name} {${frames}}` +
    `@-webkit-keyframes ${name} {${frames}}`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  return `${name}-${identifier}`;
};