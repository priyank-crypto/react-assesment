import React, { useState, useEffect } from "react";
import axios from "axios";

const TableComponent = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicationData, setApplicationData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    // for pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 10;

    //search 
    const [searchQuery, setSearchQuery] = useState("");

    // for sorting
    const [sort, setSort] = useState({ key: null, direction: "asc" });

    //fetch data from api
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://raw.githubusercontent.com/RashitKhamidullin/Educhain-Assignment/refs/heads/main/applications');
                setApplicationData(res.data);
                setFilterData(res.data);
            } catch (error) {
                setError('Failed to fetch data from api');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search Functionality
    useEffect(() => {
        const lowerCasedQuery = searchQuery.toLowerCase();
        const filtered = applicationData.filter((item) =>
            ["applicantName", "status_En", "status_Ar", "studentID"].some((key) =>
                item[key]?.toLowerCase().includes(lowerCasedQuery)
            )
        );
        setFilterData(filtered);
        setCurrentPage(1); // Reset to first page after search
    }, [searchQuery, applicationData]);

    // Paginated Data
    const paginatData = filterData.slice(
        (currentPage - 1) * itemPerPage,
        currentPage * itemPerPage
    );

    // current page handling
    const totalPages = Math.ceil(filterData.length / itemPerPage);
    const handlePageChange = (page) => setCurrentPage(page);

    //sorting 
    const sortingData = (key) => {
        const direction = sort.key === key && sort.direction === "asc" ? "desc" : "asc";
        const sortedData = [...filterData].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setFilterData(sortedData);
        setSort({ key, direction });
    };

    // for column identification
    const getArrow = (columnKey) => {
        if (sort.key === columnKey) {
            return sort.direction === "asc" ? " ▲" : " ▼";
        }
        return " ⇅"; // Default arrow
    };
    //  Render Loading/Error
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div className="container mt-4">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by Applicant Name, Status, or Student ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />
            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => sortingData("applicationNO")}>Application No{getArrow("applicationNO")}</th>
                        <th onClick={() => sortingData("applicantName")}>Applicant Name {getArrow("applicationNO")}</th>
                        <th onClick={() => sortingData("applicationDate")}>Application Date{getArrow("applicationNO")}</th>
                        <th>Student ID</th>
                        <th>Paid Amount</th>
                        <th>Status (English)</th>
                        <th>Status (Arabic)</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatData && paginatData.length > 0 ? (
                        paginatData.map((app, index) => (
                            <tr key={index}>
                                <td>{app.applicationNO}</td>
                                <td>{app.applicantName}</td>
                                <td>{app.applicationDate}</td>
                                <td>{app.studentID}</td>
                                <td>{app.paidAmount}</td>
                                <td>{app.status_En}</td>
                                <td>{app.status_Ar}</td>
                                <td>{app.lastDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No data available</td>
                        </tr>
                    )}
                </tbody>

            </table>

            {/* Implement Pagination */}
            <div className="d-flex  mt-3">
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li
                            key={page}
                            className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}>
                                {page}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/** pagination end */}

        </div>
    )
}

export default TableComponent;