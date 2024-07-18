import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
// import { Progress } from "@/components/ui/progress";
import Spinner from "react-bootstrap/Spinner";
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const [progress, setProgress] = useState(0);
  const navigateTo = useNavigate();
  useEffect(() => {
    try {
      axios
        .get("https://jobjet-backend.onrender.com/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (!isAuthorized) {
    setTimeout(() => {
      navigateTo("/");
    }, 5000);
  }

  return (
    <section className="jobs page">
      {isAuthorized ? (
        <div className="container">
          <h1>ALL AVAILABLE JOBS</h1>
          <div className="banner">
            {jobs.jobs &&
              jobs.jobs.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p>{element.title}</p>
                    <p>{element.category}</p>
                    <p>{element.country}</p>
                    <Link to={`/jobs/${element._id}`}>Job Details</Link>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          <h1 style={{ width: "full", text: "center" }}>
            Navigating to home as you are not logged in
          </h1>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </>
      )}
    </section>
  );
};

export default Jobs;
