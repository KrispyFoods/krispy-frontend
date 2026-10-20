'use client';

import { Suspense } from 'react';

function Year() {
  return <>{new Date().getFullYear()}</>;
}

// Reading the current time must be streamed (cacheComponents), so it gets its own Suspense boundary.
export function CurrentYear() {
  return (
    <Suspense fallback={null}>
      <Year />
    </Suspense>
  );
}
