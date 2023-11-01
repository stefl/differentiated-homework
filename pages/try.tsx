"use client";
import dynamic from "next/dynamic";

const DynamicTry = dynamic(() => import("../components/Try"), {
  loading: () => <p>Loading...</p>,
});

const TryPage = () => {
  if (typeof window === undefined) {
    return null;
  }
  return <DynamicTry />;
};

export default TryPage;
