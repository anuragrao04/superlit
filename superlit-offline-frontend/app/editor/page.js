"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

import { loader } from "@monaco-editor/react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
const monaco = dynamic(
  () =>
    import("monaco-editor").then(() => {
      loader.config({ monaco });
    }),
  { ssr: false },
);

// this must be fetched from server in the future
const test_data = {
  test_id: 0,
  class_id: 0,
  questions: [
    {
      question_id: 0,
      question: String.raw`Write a C program to print 'Hello Superlit!'. Next, take an integer input and print it's square`,
      defaultCode: String.raw`#include <stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[]){
  // put your code here
}`,

      example_input: `2`,
      example_output: `Hello Superlit!
4`,
    },
    {
      question_id: 1,
      question: String.raw`Write a C program to print 'I am going to fail this test'`,
      defaultCode: String.raw`#include <stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[]){
  // just kidding, ik you're not. but put your code here
}`,

      example_input: ``,
      example_output: `I am going to fail this test`,
    },
    {
      question_id: 2,
      question: String.raw`Write a C program print 69`,
      defaultCode: String.raw`#include <stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[]){
  // put your code here
}`,

      example_input: ``,
      example_output: `69`,
    },
  ],
};

export default function CodeEditor() {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const router = useRouter();
  const { user, login, logout } = useAuth();
  useEffect(() => {
    if (!user) router.replace("/auth");
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function run_button_clicked() {
    console.log(editorRef.current);
    const editorValue = editorRef.current.getValue();
    const inputValue = inputRef.current.value;
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
        console.log("Compiler post request successful");
        console.log(response.data);
        const output_screen = outputRef.current;
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


    const goToNextQuestion = () => {
      setQuestionNumber((qNum) => {
        if(qNum == test_data.questions.length - 1){
           return qNum;
        }
        else {
          return qNum + 1;
        }
      });
    }

    const goToPrevQuestion = () => {
      setQuestionNumber((qNum) => {
        if(qNum == 0){
           return qNum;
        }
        else {
          return qNum - 1;
        }
      });
    }


  if (!user) return <div>loading...</div>;
  return (
    <div className="flex flex-row scrollbar-hide bg-[#1E1E21]">
      <div className="bg-[#1E1E21] text-white mt-5 mb-5 ml-5 p-5 h-[95vh] rounded-lg flex flex-col w-1/3">
        <div className="text-white text-2xl pr-5 flex flex-row"><div onClick={goToPrevQuestion} className="pr-2 pl-2 cursor-pointer"> &lt; </div>QUESTION {questionNumber}<div onClick={goToNextQuestion} className="pr-2 pl-2 cursor-pointer"> &gt; </div></div>
        <textarea
          disabled
          className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-full scrollbar-hide"
          value={test_data.questions[questionNumber].question}
        ></textarea>

        <h2 className="text-white text-2xl pt-2 pr-5">EXAMPLE</h2>
        <h3 className="text-white text-xl pr-2 pl-2">INPUT</h3>
        <textarea
          disabled
          className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-1/4 scrollbar-hide"
          value={test_data.questions[questionNumber].example_input}
        ></textarea>
        <h3 className="text-white text-xl pt-2 pl-2 pr-2">OUTPUT</h3>
        <textarea
          disabled
          className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-1/4 scrollbar-hide"
          value={test_data.questions[questionNumber].example_output}
        ></textarea>
      </div>

      <div className="editor_output_wrapper flex flex-col w-full">
        <Editor
          height="80vh"
          theme="vs-dark"
          defaultLanguage="c"
          defaultValue={test_data.questions[questionNumber].defaultCode}
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
              defaultValue={test_data.questions[questionNumber].example_input}
              ref={inputRef}
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
              ref={outputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
