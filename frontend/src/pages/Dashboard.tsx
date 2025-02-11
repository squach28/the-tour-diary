import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Search = () => {
  return (
    <form className="flex relative p-3">
      <input
        className="w-full border border-gray-400 p-2 rounded-md rounded-r-none focus:outline-none focus:border-black"
        type="text"
        placeholder="Search for an artist or event"
      />
      <button className="bg-green-400 w-16 border border-l-red-200 rounded-md rounded-l-none">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
};

const Dashboard = () => {
  return (
    <div>
      <Search />
    </div>
  );
};

export default Dashboard;
