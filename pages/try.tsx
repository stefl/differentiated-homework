import dynamic from "next/dynamic";

const DynamicTry = dynamic(() => import("../components/Try"), {
  loading: () => <p>Loading...</p>,
});

const TryPage = () => {
  return <DynamicTry />;
};

export default TryPage;
