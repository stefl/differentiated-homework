"use client";
import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";

const DynamicGenerator = dynamic(() => import("../components/Generator"), {
  loading: () => <p>Loading...</p>,
});

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Differentiated Homework Generator</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {typeof window !== "undefined" && <DynamicGenerator />}
    </>
  );
}
