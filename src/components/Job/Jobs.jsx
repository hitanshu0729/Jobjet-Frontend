import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { RotatingLines } from "react-loader-spinner";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://jobjet-backend.onrender.com/api/v1/job/getall",
          {
            withCredentials: true,
          }
        );
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      setTimeout(() => {
        navigateTo("/login");
      }, 5000);
    }
  }, );

  return (
    <section className="jobs page">
      {isAuthorized ? (
        <div className="container">
          <h1>ALL AVAILABLE JOBS</h1>
          {loading ? (
            <div
              className="loading-spinner"
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
            </div>
          ) : (
            <div className="banner">
              {jobs.jobs && jobs.jobs.length > 0 ? (
                jobs.jobs.map((element) => (
                  <div className="card" key={element._id}>
                    <p>{element.title}</p>
                    <p>{element.category}</p>
                    <p>{element.country}</p>
                    <Link to={`/jobs/${element._id}`}>Job Details</Link>
                  </div>
                ))
              ) : (
                <h4>No Jobs Found</h4>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <h1 style={{ width: "full", text: "center" }}>
            Navigating to home as you are not logged in
          </h1>
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </>
      )}
    </section>
  );
};

export default Jobs;
