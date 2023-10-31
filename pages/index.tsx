import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import React from "react";
import Markdown from "react-markdown";
export default function Review() {
  // Create a ref for the div element
  const textDivRef = useRef<HTMLDivElement>(null);
  const [keyStageInput, setKeyStageInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [numberOfTasksInput, setNumberOfTasksInput] = useState("");
  const [actionPlanInput, setActionPlanInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [objectivesInput, setObjectivesInput] = useState("");
  const [transcriptInput, setTranscriptInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [result, setResult] = useState(() => "");
  const [isLoading, setIsLoading] = useState(false);

  // Add a click event listener to the copy icon that copies the text in the div to the clipboard when clicked
  useEffect(() => {
    const copyIcon = document.querySelector(".copy-icon");
    if (!copyIcon) return;
    copyIcon.addEventListener("click", () => {
      const textDiv = textDivRef.current;
      let text;
      if (textDivRef.current) {
        text = textDivRef.current.textContent;
      }
      // Create a hidden textarea element
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);

      // Select the text in the textarea
      textArea.select();

      // Copy the text to the clipboard
      document.execCommand("copy");

      // Remove the textarea element
      document.body.removeChild(textArea);
    });
  }, []); // Run this only once

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/homework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        keyStage: keyStageInput,
        subject: subjectInput,
        numberOfTasks: numberOfTasksInput,
        actionPlan: actionPlanInput,
        summary: summaryInput,
        objectives: objectivesInput,
        transcript: transcriptInput,
        title: titleInput,
      }),
    });
    const data = await response.json();
    console.log("data", data);
    console.log("data.result", data.result);

    let rawResult = data.result;

    console.log("rawResult");

    // set result to the highlighted code. Address this error: Argument of type 'string' is not assignable to parameter of type '(prevState: undefined) => undefined'.ts(2345)
    setResult(rawResult);

    // setKeyStageInput("");
    // setSubjectInput("");
    // setNumberOfTasksInput("");
    // setActionPlanInput("");
    // setSummaryInput("");
    // setObjectivesInput("");
    // setTranscriptInput("");
    // setTitleInput("");
    setIsLoading(false);
  }

  return (
    <div>
      <Head>
        <title>Differentiated Homework Generator</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className="flex flex-col 
                    items-center justify-center max-w-xl m-auto py-16"
      >
        <h3 className="text-slate-900 text-xl mb-3 font-bold">
          Differentiated Homework Generator
        </h3>
        <p className="text-slate-700 text-lg mb-3">
          Adapt a homework task to the needs of a particular student
        </p>
        <form onSubmit={onSubmit}>
          <label>
            Lesson title
            <input
              className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
              type="text"
              name="title"
              placeholder="Enter the title of the lesson"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </label>

          <label>
            Key stage
            <input
              className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
              type="text"
              name="keyStage"
              placeholder="Key Stage 3"
              value={keyStageInput}
              onChange={(e) => setKeyStageInput(e.target.value)}
            />
          </label>

          <label>
            Lesson summary
            <textarea
              className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-64 border 
                              border-gray-200 rounded mb-2"
              type="text"
              name="summary"
              placeholder="A summary of the lesson"
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
            />
          </label>

          <label>
            Learning objectives
            <textarea
              className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 border 
                              border-gray-200 rounded mb-2 h-64"
              type="text"
              name="objectives"
              placeholder="Your learning objectives"
              value={objectivesInput}
              onChange={(e) => setObjectivesInput(e.target.value)}
            />
          </label>

          <label>
            Student action plan
            <textarea
              className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-64 border 
                              border-gray-200 rounded mb-2"
              type="text"
              name="actionPlan"
              placeholder="The student's action plan or needs. Eg. reading age"
              value={actionPlanInput}
              onChange={(e) => setActionPlanInput(e.target.value)}
            />
          </label>

          <label>
            Lesson transcript or write-up
            <textarea
              className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-64 border 
                              border-gray-200 rounded mb-2"
              type="text"
              name="transcript"
              placeholder="A transcript of the lesson, or any free text that you have that explains what the lesson covered"
              value={transcriptInput}
              onChange={(e) => setTranscriptInput(e.target.value)}
            />
          </label>

          <button
            className="text-sm m-auto bg-green-600  text-white
                              rounded p-6 mb-10 font-bold text-xl"
            type="submit"
          >
            Generate homework
          </button>
        </form>
        {isLoading ? (
          <p>Loading... be patient.. may take 30s+</p>
        ) : result ? (
          <div className="relative w-2/4 ">
            <div className="rounded-md border-spacing-2 border-slate-900 bg-slate-100 break-words w-full overflow-x-auto  ">
              <div ref={textDivRef} className="m-5 ">
                <Markdown>{result}</Markdown>
              </div>
            </div>
            <div className="copy-icon absolute top-0 right-0 mt-2 mr-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-copy"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
              </svg>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
