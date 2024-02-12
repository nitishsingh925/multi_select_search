import { useState, useEffect } from "react";

const useFetch = (searchTerm) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() === "") {
        setData([]);
        return;
      }

      try {
        const response = await fetch(
          `https://dummyjson.com/users/search?q=${searchTerm}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return data;
};

export default useFetch;
