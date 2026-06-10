import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleClick = () => {
    onSearch(keyword);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) =>
          setKeyword(e.target.value)
        }
      />

      <button onClick={handleClick}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;