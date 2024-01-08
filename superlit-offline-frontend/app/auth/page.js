"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Page({ children }) {
  const srnRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

  const handleLogin = async () => {
    // this will create user with the given password and srn. If user already exists, it will just login
    try {
      // sends post request to /api/login with srn and password
      const res = await fetch("/api/backendi/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          srn: srnRef.current.value,
          password: passwordRef.current.value,
        }),
      });
      // if response is not ok, throw error
      if (!res.ok) throw new Error(res.statusText);
      // get the json data
      const data = await res.json();
      console.log(data);
      if (data.success) {
        // if success is true, redirect to /dashboard
        router.push("/dashboard");
      } else {
        // else, show alert
        alert("Make sure your password is right");
      }
    } catch (err) {
      alert(
        "Something went wrong in logging in. Please contact the sys admin. The error is logged to the console.",
      );
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="h-1/2 w-1/4 rounded-lg bg-[#1E1E21] flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <input
            ref={srnRef}
            type="text"
            placeholder="SRN"
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <button
            className="bg-[#252526] text-white p-3 rounded-lg m-3 border-2 border-[#252526] hover:border-white"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
