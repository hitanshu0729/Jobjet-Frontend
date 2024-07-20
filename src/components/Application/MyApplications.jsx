import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { RotatingLines } from "react-loader-spinner";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoint =
          user && user.role === "Employer"
            ? "https://jobjet-backend.onrender.com/api/v1/application/employer/getall"
            : "https://jobjet-backend.onrender.com/api/v1/application/jobseeker/getall";

        const res = await axios.get(endpoint, {
          withCredentials: true,
        });

        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchData();
    } else {
      navigateTo("/");
    }
  }, [isAuthorized, navigateTo, user]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `https://jobjet-backend.onrender.com/api/v1/application/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {loading ? (
        <div
          className="loading-spinner"
          style={{ width: "100vw", display: "flex", justifyContent: "center" }}
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
        <>
          {user && user.role === "Job Seeker" ? (
            <div className="container">
              <h1>My Applications</h1>
              {applications.length <= 0 ? (
                <h4>No Applications Found</h4>
              ) : (
                applications.map((element) => (
                  <JobSeekerCard
                    element={element}
                    key={element._id}
                    deleteApplication={deleteApplication}
                    openModal={openModal}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="container">
              <h1>Applications From Job Seekers</h1>
              {applications.length <= 0 ? (
                <h4>No Applications Found</h4>
              ) : (
                applications.map((element) => (
                  <EmployerCard
                    element={element}
                    key={element._id}
                    openModal={openModal}
                  />
                ))
              )}
            </div>
          )}
          {modalOpen && (
            <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
          )}
        </>
      )}
    </section>
  );
};

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (element.resume.url.endsWith(".pdf")) {
      setIsPdf(true);
    } else {
      setIsPdf(false);
    }
  }, [element.resume.url]);

  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        {isPdf ? (
          <embed src={element.resume.url} width="100%" height="400px" />
        ) : (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        )}
      </div>
      <div className="btn_area">
        <button
          onClick={() => deleteApplication(element._id)}
          style={{ cursor: "pointer" }}
        >
          Delete Application
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (element.resume.url.endsWith(".pdf")) {
      setIsPdf(true);
    } else {
      setIsPdf(false);
    }
  }, [element.resume.url]);

  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        {isPdf ? (
          <embed src={element.resume.url} width="100%" height="400px" />
        ) : (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        )}
      </div>
    </div>
  );
};

export default MyApplications;
