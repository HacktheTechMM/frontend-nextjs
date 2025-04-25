"use client"

import { Button } from "@/components/ui/button";
import Agent from "../_components/Agent";
import Link from "next/link";

const Page = () => {

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-mona font-bold mt-12">
          Interview Generation
        </h3>
        <Link href={'/interviews'} className="mt-12">
          <Button>Go Back</Button>
        </Link>
      </div>

      <Agent
        // userName={user?.name!}
        // userId={user?.id}
        // type="generate"
        userName={"heck the tech"}
        userId={'1'}
        type="generate"

      />
    </>
  );
};

export default Page;
