import "./SearchFilter.css";

 const SearchFilter = ({ search, setSearch }) => {
  return (
    <div className="sr-search-container">
      <input
        type="text"
        placeholder="🔍 Search stores by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchFilter;
