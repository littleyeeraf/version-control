import React from "react";

function Loading(): JSX.Element {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-400"></div>
    </main>
  );
}

export default Loading;
