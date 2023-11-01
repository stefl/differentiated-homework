import Head from "next/head";
import React from "react";
import Generator from "../components/Generator";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Differentiated Homework Generator</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Generator />
    </>
  );
}
