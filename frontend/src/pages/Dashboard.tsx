import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router";

const Dashboard = () => {
  return (
    <div className="max-w-lg mx-auto">
      <SearchBar />
    </div>
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query !== "") {
      navigate(`/search?query=${query}`);
    }
  };
  return (
    <form className="flex relative p-3" onSubmit={onSubmit}>
      <input
        className="w-full border border-gray-400 p-2 rounded-md rounded-r-none focus:outline-none focus:border-black focus:bg-gray-100"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search for a user or artist"
      />
      <button className="bg-green-400 w-16 border border-l-red-200 rounded-md rounded-l-none cursor-pointer hover:bg-green-600">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
};

export default Dashboard;
