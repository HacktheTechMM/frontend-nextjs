"use client"
import { useAppSelector } from "@/redux/store";
import Agent from "../_components/Agent";

const Page =  () => {
  const user = useAppSelector(state => state.user.current)

  return (
    <>
      <h3 className="text-2xl font-mona font-bold mt-12">Interview generation</h3>

      <Agent
        userName={user?.name!}
        userId={user?.id}
        type="generate"
       
      />
    </>
  );
};

export default Page;
