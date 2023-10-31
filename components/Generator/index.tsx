"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { SaveAsDocX } from "../SaveAsDocX";
import { Bars } from "react-loading-icons";
import { Label } from "../Label";
import { TfiWrite } from "react-icons/tfi";
export default function Generator() {
  // Create a ref for the div element
  const textDivRef = useRef<HTMLDivElement>(null);
  const [keyStageInput, setKeyStageInput] = useLocalStorage("keyStage", "");
  const [subjectInput, setSubjectInput] = useLocalStorage("subject", "");
  const [numberOfTasksInput, setNumberOfTasksInput] = useLocalStorage(
    "numberOfTasks",
    "2"
  );
  const [maxTasksInput, setMaxTasksInput] = useLocalStorage("maxTasks", "5");
  const [taskInput, setTaskInput] = useLocalStorage("task", "");
  const [actionPlanInput, setActionPlanInput] = useLocalStorage(
    "actionPlan",
    ""
  );
  const [summaryInput, setSummaryInput] = useLocalStorage("summary", "");
  const [objectivesInput, setObjectivesInput] = useLocalStorage(
    "objectives",
    ""
  );
  const [transcriptInput, setTranscriptInput] = useLocalStorage(
    "transcript",
    ""
  );
  const [titleInput, setTitleInput] = useLocalStorage("title", "");
  const [result, setResult] = useState(() => "");
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

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
    // window.outputRef = outputRef;
    // console.log(outputRef.current?.getBoundingClientRect());
    const top = outputRef.current?.getBoundingClientRect().top || 0;
    window.scrollTo(0, top);
    setResult("");
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
        maxTasks: maxTasksInput,
        task: taskInput,
        actionPlan: actionPlanInput,
        summary: summaryInput,
        objectives: objectivesInput,
        transcript: transcriptInput,
        title: titleInput,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResult((prev) => prev + chunkValue);
    }
    setIsLoading(false);
  }

  const clearForm = useCallback(() => {
    setKeyStageInput("");
    setActionPlanInput("");
    setNumberOfTasksInput("");
    setObjectivesInput("");
    setSubjectInput("");
    setTitleInput("");
    setSummaryInput("");
    setTranscriptInput("");
    setMaxTasksInput("");
    setTaskInput("");
  }, [
    setKeyStageInput,
    setActionPlanInput,
    setNumberOfTasksInput,
    setObjectivesInput,
    setSubjectInput,
    setTitleInput,
    setSummaryInput,
    setTranscriptInput,
  ]);

  return (
    <div>
      <main>
        <div className="w-full lg:w-1/2 p-8">
          <div className="text-slate-900 text-3xl mb-3 font-bold flex flex-row">
            <TfiWrite className="w-12 h-12 inline-block mr-8" />
            <h1>Differentiated Homework Generator</h1>
          </div>
          <p className="text-slate-700 text-lg mb-3">
            For teachers - generate and adapt homework tasks to the needs of
            students based on their ability or needs
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Label text="About the student (eg. their action plan. Don't include PII)">
              <textarea
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-64 border 
                              border-gray-200 rounded mb-2"
                name="actionPlan"
                placeholder="The student's action plan or needs. Eg. reading age"
                value={actionPlanInput}
                onChange={(e) => setActionPlanInput(e.target.value)}
              />
            </Label>

            <Label text="Lesson title">
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
            </Label>

            <Label text="Lesson subject">
              <input
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
                type="text"
                name="subject"
                placeholder="Computer Science"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
              />
            </Label>

            <Label text="Lesson key stage">
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
            </Label>

            <Label text="Lesson summary">
              <textarea
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-64 border 
                              border-gray-200 rounded mb-2"
                name="summary"
                placeholder="A summary of the lesson"
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
              />
            </Label>

            <Label text="Lesson learning objectives">
              <textarea
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 border 
                              border-gray-200 rounded mb-2 h-64"
                name="objectives"
                placeholder="Your learning objectives"
                value={objectivesInput}
                onChange={(e) => setObjectivesInput(e.target.value)}
              />
            </Label>

            <Label text="Lesson transcript or write-up">
              <textarea
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-64 border 
                              border-gray-200 rounded mb-2"
                name="transcript"
                placeholder="A transcript of the lesson, or any free text that you have that explains what the lesson covered"
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
              />
            </Label>

            <Label text="Number of homework tasks to generate">
              <input
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
                type="text"
                name="maxTasks"
                placeholder="5"
                value={maxTasksInput}
                onChange={(e) => setMaxTasksInput(e.target.value)}
              />
            </Label>

            <Label text="Number of homework tasks the student could pick to complete">
              <input
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
                type="text"
                name="numberOfTasks"
                placeholder="2"
                value={numberOfTasksInput}
                onChange={(e) => setNumberOfTasksInput(e.target.value)}
              />
            </Label>

            <Label text="The task you would like to set">
              <textarea
                className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 border 
                              border-gray-200 rounded mb-2 h-64"
                name="task"
                placeholder="If you already have a homework task in mind, add it here"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
              />
            </Label>

            <button
              className="m-auto bg-green-600 hover:bg-green-500  text-white rounded p-6 mb-10 font-bold text-xl"
              type="submit"
            >
              Generate homework
              {isLoading && <Bars className="inline w-4 h-4 ml-4" />}
            </button>

            <button
              className="text-gray-500 underline"
              onClick={() => clearForm()}
            >
              Clear form
            </button>
          </form>
        </div>
        <div
          className="lg:fixed lg:h-screen lg:top-9 lg:right-0 lg:w-1/2 bg-slate-100 overflow-y-auto"
          ref={outputRef}
        >
          {result && (
            <div className="">
              <div className="prose break-words w-full overflow-x-auto  ">
                <div ref={textDivRef} className="m-5 ">
                  <Markdown>{result}</Markdown>

                  <SaveAsDocX markdown={result} />
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
          )}
        </div>
        <div className="p-8 text-gray-400">
          A hackathon project by{" "}
          <a href="https://stef.io" className="text-pink-400">
            @stef
          </a>{" "}
          at the Generative AI in Education hackathon with support from Oak
          National Academy, DfE, National Institute of Teachers and Faculty.
        </div>
      </main>
    </div>
  );
}
