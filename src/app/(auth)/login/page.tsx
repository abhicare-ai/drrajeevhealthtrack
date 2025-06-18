import React from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";
import logo from "@/assets/web_logo_2.png";
import "@/app/styles.css";

export default function Page() {
  return (
    <main className="lginBody flex h-screen items-center justify-center p-5">
      <div className="space-y-5">
        <Image
          src={logo}
          alt="logo"
          width={150}
          className="mx-auto shadow-2xl"
        />
        <div className="bg-card max-w-[30rem] space-y-5 rounded-md p-5 shadow-2xl">
          <h5 className="texthsadow text-2xl font-bold">
            Login To Dr. Rajeev Health Track
          </h5>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
