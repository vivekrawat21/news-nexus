"use client";

import { SignUp } from "@clerk/nextjs";
import React from "react";

const CustomSignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
    <SignUp />
  </div>
  );
};

export default CustomSignUp;
