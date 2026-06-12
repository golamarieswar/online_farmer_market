import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleClick = () => {
    onSearch(keyword);
  };

  return (
    <div className="search-bar">
      <input
        className="form-control"
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) =>
          setKeyword(e.target.value)
        }
      />

      <button className="btn btn-success" onClick={handleClick}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
