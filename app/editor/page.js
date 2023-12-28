"use client";
import Image from "next/image";
import { useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const monaco = dynamic(() => import("monaco-editor"), { ssr: false });
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import { loader } from "@monaco-editor/react";

loader.config({ monaco });
const defaultCode = String.raw`#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]){
  int x;
  printf("Hello Superlit!\n");
  scanf("%d", &x);
  printf("%d", x);
  return EXIT_SUCCESS;
}`;

var question = String.raw`Write a C program to print 'Hello Superlit!'. Next, take an integer input and print it's square`;
var example_input = `2`;
var example_output = `Hello Superlit!
4
`;

export default function CodeEditor() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function run_button_clicked() {
    const editorValue = editorRef.current.getValue();
    const inputValue = document.querySelector(".code_input").value; // USE USE EFFECT!
    const post_request_data = {
      code: editorValue,
      input: inputValue,
    };

    console.log(editorValue);
    // console.log(inputValue);

    axios
      .post("api/backendi", post_request_data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const output_screen = document.querySelector(".code_output");
        output_screen.value = response.data;
      })
      .catch((error) => {
        console.log("Compiler post request screwed up", error);
      });
  }

  function submit_button_clicked() {
    const editorValue = editorRef.current.getValue();
    const post_request_data = {
      code: editorValue,
      test_cases: [
        {
          input: `2`,
          expected_output: `Hello Superlit!
4`,
        },
        {
          input: `4`,
          expected_output: `Hello Superlit!
16`,
        },
        {
          input: `5`,
          expected_output: `Hello Superlit!
25`,
        },
      ],
    };
    // expected json response:
    // {
    //   "all_passed": true,
    //   "test_case_failed": {
    //
    //   },
    // }
    //
    //
    // If any test case fails:
    // {
    //   "all_passed": false,
    //   "test_case_failed": {
    //        "input": `4`,
    //        "expected_output": `Hello Superlit!
    //         4`,
    //         "produced_output": `Unga Bunga`
    //   },
    // }

    axios
      .post("api/backendi/submit", post_request_data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const response_json = response.data;
        console.log(response_json);
        if (response_json.all_passed) {
          alert("All test cases have passed!");
        } else {
          console.log("test case failed");
          const failed_case = response_json.test_case_failed;
          alert(
            `Test case failed!\nInput:\n${failed_case.input}\n\n\nExpected output:\n${failed_case.expected_output}\n\n\nProduced output:\n${failed_case.produced_output}`,
          );
        }
      })
      .catch((error) => {
        console.log("Compiler post request screwed up", error);
      });
  }

  return (
    <div className="flex flex-row scrollbar-hide bg-[#1E1E21]">
      <div className="bg-[#1E1E21] text-white mt-5 mb-5 ml-5 p-5 h-[95vh] rounded-lg flex flex-col w-1/3">
        <h2 className="text-white text-2xl pr-5">QUESTION</h2>
        <textarea
          disabled
          className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-full scrollbar-hide"
          value={question}
        ></textarea>

        <h2 className="text-white text-2xl pt-2 pr-5">EXAMPLE</h2>
        <h3 className="text-white text-xl pr-2 pl-2">INPUT</h3>
        <textarea
          disabled
          className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-1/4 scrollbar-hide"
          value={example_input}
        ></textarea>
        <h3 className="text-white text-xl pt-2 pl-2 pr-2">OUTPUT</h3>
        <textarea
          disabled
          className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-1/4 scrollbar-hide"
          value={example_output}
        ></textarea>
      </div>

      <div className="editor_output_wrapper flex flex-col w-full">
        <Editor
          height="80vh"
          theme="vs-dark"
          language="c"
          defaultValue={defaultCode}
          automaticLayout="true"
          className="m-5 pt-5 pb-5 bg-[#1E1E21] rounded-lg"
          onMount={handleEditorDidMount}
        />
        <div className="input_output_wrapper flex">
          <div className="input bg-[#1E1E21] text-white ml-5 h-[17vh] w-1/2 flex flex-col rounded-lg border-2 border-[#1E1E21]">
            <div className="input_heading text-base text-bold bg-[#1E1E21] rounded-t-lg pl-2">
              INPUT:
            </div>
            <textarea
              className="code_input h-full w-full rounded-b-lg bg-[#252526] text-white outline-none resize-none pb-2 pl-2 pr-2"
              defaultValue={example_input}
            ></textarea>
          </div>
          <div className="flex flex-col justify-center items-center">
            <button
              className="text-white z-10 pl-5 pr-5 flex flex-col rounded-lg text-xl justify-center items-center"
              onClick={run_button_clicked}
            >
              <div className="flex justify-center items-center">
                <Image src="/run_button.png" alt="run" height={25} width={25} />
              </div>
              <div className="text-gray text-sm pt-2">RUN</div>
            </button>

            <button
              className="text-white z-10 pl-5 pr-5 flex flex-col rounded-lg text-xl justify-center items-center mt-5"
              onClick={submit_button_clicked}
            >
              <div className="flex justify-center items-center">
                <Image src="/run_button.png" alt="run" height={25} width={25} />
              </div>
              <div className="text-gray text-sm pt-2">SUBMIT</div>
            </button>
          </div>
          <div className="output bg-[#1E1E21] text-white mr-5 h-[17vh] w-1/2 flex flex-col rounded-lg border-2 border-[#1E1E21]">
            <div className="output_heading text-base text-bold bg-[#1E1E21] rounded-t-lg pl-2">
              OUTPUT:
            </div>
            <textarea
              disabled
              className="code_output h-full w-full rounded-b-lg bg-[#252526] text-white p-2 outline-none resize-none read-only"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
