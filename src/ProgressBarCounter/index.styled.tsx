import { styled } from "@stitches/react";

export const ProgressBarStyled = styled("div", {
  "@media screen and (-webkit-min-device-pixel-ratio: 0)": {
    "input[type='range']": {
      width: "6.75rem",
      height: "0.25rem",
      overflow: "hidden",
      "-webkit-appearance": "none",
      backgroundColor: "var(--base-white-8)",
      borderRadius: "0.1875rem",
    },
    "input[type='range']::-webkit-slider-runnable-track": {
      height: "0.25rem",
      "-webkit-appearance": "none",
      borderRadius: "0.1875rem",
      backgroundColor: "var(--base-white-8)",
    },
    "input[type='range']::-webkit-slider-thumb": {
      width: "0.25rem",
      "-webkit-appearance": "none",
      height: "0.25rem",
      cursor: "ew-resize",
      borderRadius: "0.1875rem",
      background: "var(--base-color-secondary-3)",
      boxShadow: "-6.375rem 0 0 6.25rem var(--base-color-secondary-3)",
    },
  },
  "input[type='range']::-moz-range-progress": {
    backgroundColor: "var(--base-color-secondary-3)",
  },
  "input[type='range']::-moz-range-track": {
    height: "0.25rem",
    backgroundColor: "var(--base-white-8)",
  },
  "input[type='range']::-moz-range-thumb": {
    width: "0.25rem",
    "-moz-appearance": "none",
    height: "0.25rem",
    cursor: "ew-resize",
    border: "none",
    borderRadius: "0.1875rem",
    background: "var(--base-color-secondary-3)",
    boxShadow: "-6.375rem 0 0 6.25rem var(--base-color-secondary-3)",
  },
  "input[type='range']::-ms-fill-lower": {
    backgroundColor: "var(--base-color-secondary-3)",
  },
  "input[type='range']::-ms-fill-upper": {
    backgroundColor: "var(--base-white-8)",
    borderRadius: "0.1875rem",
  },
});
