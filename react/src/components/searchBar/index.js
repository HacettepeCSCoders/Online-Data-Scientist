import { useState, useEffect } from "react";
import { Input, Tag } from "antd";
import { getAllWorkspaces } from "../../services/workspaceService";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const SearchBar = ({ userId }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    const getAll = async () => {
      try {
        const response = await getAllWorkspaces(userId);
        let arr = [];
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].active !== false) {
            arr.push(response.data[i]);
          }
        }

        for (let i = 0; i < arr.length; i++) {
          arr[i].updateDate = new Date(arr[i].updateDate);
          arr[i].createDate = new Date(arr[i].createDate);
        }
        arr.sort(function (a, b) {
          return new Date(b.updateDate) - new Date(a.updateDate);
        });
        setData(arr);
      } catch (e) {
        setError(e);
      }
    };
    getAll();
  }, []);
  const handleFilter = (e) => {
    const searchInput = e.target.value;
    setInput(searchInput);
    const newFilter = data.filter((value) => {
      return value.fileName.toLowerCase().includes(searchInput.toLowerCase());
    });
    if (searchInput === "" || searchInput === undefined) {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const onClickGoToWorkspace = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
    setInput("");
    setFilteredData([]);
  };
  return (
    <div className="search">
      <div className="searchInputs">
        <Search
          placeholder="Search Workspace"
          value={input}
          onChange={(e) => handleFilter(e)}
        />
      </div>
      {filteredData.length != 0 && (
        <div className="search-Result text-center">
          {filteredData.slice(0, 10).map((value) => {
            return (
              <div key={value.id}>
                <p
                  onClick={() => {
                    onClickGoToWorkspace(value.id);
                  }}
                >
                  <Tag>{value.fileName} </Tag> <Tag>{value.id} </Tag>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
