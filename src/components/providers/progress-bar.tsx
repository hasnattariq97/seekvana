"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function ProgressBar() {
  return (
    <AppProgressBar
      height="3px"
      color="#C9633F"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
