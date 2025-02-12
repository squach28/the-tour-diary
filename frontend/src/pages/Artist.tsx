import { useParams } from "react-router";

const Artist = () => {
  const params = useParams();
  console.log(params.id);
  return <div>Artist</div>;
};

export default Artist;
