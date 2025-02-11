import { useEffect } from "react";
import { useSearchParams } from "react-router";

const Search = () => {
  const [searchParams, _] = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {}, []);

  return <div>{query}</div>;
};

export default Search;
