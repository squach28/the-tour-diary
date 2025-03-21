import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const SearchBar = ({
  onSubmit,
  value = "",
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
}) => {
  const [query, setQuery] = useState(value);

  return (
    <form className="flex relative p-3" onSubmit={onSubmit}>
      <input
        id="search"
        name="search"
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
