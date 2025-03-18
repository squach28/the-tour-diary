import { useSearchParams } from "react-router";

const Artists = () => {
  const [searchParams, _] = useSearchParams();
  console.log(searchParams.get("query"));
  return <div>Artists</div>;
};

export default Artists;
