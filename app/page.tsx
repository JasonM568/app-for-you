import { Suspense } from "react";
import HomeClient from "./HomeClient";

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: "center" }}>載入中...</div>}>
      <HomeClient />
    </Suspense>
  );
}
