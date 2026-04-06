import React, { useState, useEffect } from "react";
import "./App.css";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const skills = [
    "C++",
    "Java",
    "Python",
    "React.js",
    "Node.js",
    "OpenCV",
    "Data Structures & Algorithms",
  ];

  // Fetch data from your backend API
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="portfolio-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>
          Hi, I'm <span className="highlight">Madhav Kalra</span>
        </h1>
        <h2>Full-Stack Developer & AI Enthusiast</h2>
        <p>
          B.Tech CSE Student building scalable web applications and exploring
          computer vision.
        </p>
        <div className="hero-links">
          <a
            href="https://github.com/Madhav7871"
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary"
          >
            GitHub Profile
          </a>
        </div>
      </header>

      {/* Skills Section */}
      <section className="skills-section">
        <h2>Technical Arsenal</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <span key={index} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <h2>Featured Projects (Fetched from Backend)</h2>

        {loading ? (
          <p className="loading-text">Loading projects from server...</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="tech-item">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
