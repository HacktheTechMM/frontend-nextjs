
import Agent from "../_components/Agent";

const Page = async () => {
  // const user = await getCurrentUser();

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        // userName={user?.name!}
        // userId={user?.id}
        // type="generate"
        userName={"htoo"}
        userId={"1"}
        type="generate"
      />
    </>
  );
};

export default Page;
