import { useMemo, useState, useRef, useEffect } from "react";
import React from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Check, Clock, ChevronDown, Gift, Award, Trophy } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const WinnerList = () => {
  const [data, setData] = useState([]);
  const socket = React.useRef(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});
  const [isLoaded, setIsLoaded] = useState(false);
  const MySwal = withReactContent(Swal);
  useEffect(() => {
    // Fetch data from API using axios
    const fetchData = async () => {
      try {
        // Send the "Admin" role in the body of the POST request
        const response = await axios.post("/winnerdetails", {
          role: "Admin", // Sending role as part of the request body
        });

        const result = response.data;

        // You can update or modify the data based on your requirements
        setData(result); // Set the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const startSocket = () => {
    socket.current.on("newData", (newEntry) => {
      setData((prevEntries) => [newEntry, ...prevEntries]);
    });
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    startSocket();
    return () => {
      socket.current.off("newData");
      socket.current.disconnect();
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId !== null &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleStatusChange = (tokenNo, newStatus) => {
    console.log(tokenNo);
    setData((prevData) =>
      prevData.map((item) =>
        item._id === tokenNo ? { ...item, status: newStatus } : item
      )
    );
    setOpenDropdownId(null);
    const data = {
      role: "Admin",
      id: tokenNo,
    };
    axios
      .post("/changeuserstatus", data)
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const toggleDropdown = (tokenNo, status) => {
    if (status === "Completed") return;
    setOpenDropdownId(openDropdownId === tokenNo ? null : tokenNo);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "tokenno",
        header: "Token No",
        size: 100,
        Cell: ({ cell }) => (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-blue-700 font-medium">
              {cell.getValue()}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        Cell: ({ cell }) => (
          <div className="font-medium text-blue-800">{cell.getValue()}</div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 220,
        Cell: ({ cell }) => (
          <div className="text-blue-600 hover:text-blue-800 transition-colors">
            {cell.getValue()}
          </div>
        ),
      },
      { accessorKey: "mobileno", header: "Mobile No", size: 130 },
      {
        accessorKey: "city",
        header: "City",
        size: 120,
        Cell: ({ cell }) => (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 110,
        Cell: ({ cell }) => {
          // Convert the date string (DD/MM/YYYY) into a Date object
          const dateString = cell.getValue(); // Assuming it's "30/04/2025"
          const [day, month, year] = dateString.split("/"); // Split by "/"
          const formattedDate = new Date(`${year}-${month}-${day}`); // Reformat into YYYY-MM-DD

          return (
            <div className="text-gray-600">
              {formattedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          );
        },
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 200,
        Cell: ({ row }) => {
          const { tokenno, status, _id } = row.original;

          return (
            <div
              className="relative inline-block"
              ref={(el) => (dropdownRefs.current[tokenno] = el)}
            >
              <button
                onClick={() => toggleDropdown(tokenno, status)}
                disabled={status === "Completed"}
                className={`flex items-center w-48 px-3 py-1.5 rounded-md transition-all duration-200 ${
                  status === "Completed"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                }`}
              >
                {status === "Completed" ? (
                  <Check className="w-4 h-4 mr-1.5" />
                ) : (
                  <Clock className="w-4 h-4 mr-1.5" />
                )}
                {status === "Completed" ? "Tickets Issued" : "Pending"}
                {status !== "Completed" && (
                  <ChevronDown className="w-3 h-3 ml-1.5" />
                )}
              </button>

              {openDropdownId === tokenno && (
                <div className="absolute my-2 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-[1000] w-48 transition-all duration-200 ease-in-out">
                  <div
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center text-blue-700"
                    onClick={() => handleStatusChange(_id, "Completed")}
                  >
                    <Check className="w-4 h-4 mr-2 text-blue-600" />
                    Tickets Issued
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [openDropdownId]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnResizing: true,
    layoutMode: "grid",
    initialState: { density: "comfortable" },
    muiTableHeadProps: {
      sx: {
        "& .MuiTableCell-root": {
          backgroundColor: "#EBF5FF", // light blue header
          color: "#1E40AF",
          fontWeight: "bold",
        },
      },
    },
    muiTableBodyRowProps: {
      sx: {
        height: "110px",
        "&:nth-of-type(odd)": {
          backgroundColor: "#F0F9FF", // very light blue for alternating rows
        },
        "&:hover": {
          backgroundColor: "#DBEAFE", // slightly darker blue on hover
        },
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0.5rem",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
      },
    },
  });

  return (
    <div
      className={`bg-gradient-to-b from-blue-50 to-white p-6 rounded-lg shadow-md h-full transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex md:flex-row flex-col items-center justify-between mb-6">
        <div>
          <h2 className="md:text-2xl text-xl font-bold text-blue-800 mb-2 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-blue-600" />
            Winner List
          </h2>
        </div>
        <div className="bg-blue-100 rounded-lg px-4 py-2 flex items-center ">
          <Award className="w-5 h-5 text-blue-700 mr-2" />
          <span className="text-blue-800 font-medium text-sm">
            {data.length} <br className="block md:hidden" /> Total Winners
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default WinnerList;
