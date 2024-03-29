"use client";
import React from "react";
import { ModeToggle } from "@/app/Toggle";
import Image from "next/image";

import Logo from "@/components/Logo";
import Link from "next/link";
const Header = () => {

  return (
    <div className="flex justify-between items-center px-8 py-4">
      <div >
        <Logo />
      </div>
      <div className="flex items-center gap-5 ">
     <Image src="/githublogo.png" alt="Error" width={60} height={60}/>
      </div>

      <div className="  flex  items-center gap-5">
       
       

        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
