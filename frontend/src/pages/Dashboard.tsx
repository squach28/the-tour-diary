import { useNavigate } from "react-router";
import { SearchBar } from "../components/SearchBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search");
    if (query !== "") {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <SearchBar onSubmit={onSubmit} />
    </div>
  );
};

export default Dashboard;
