import React, { useEffect, useState } from "react";
import "./App.css";

const Portfolio = () => {
  const [backendProjects, setBackendProjects] = useState([]);
  const [backendLoading, setBackendLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const socialLinks = {
    github: "https://github.com/Madhav7871",
    linkedin: "https://www.linkedin.com/in/madhav-kalra-807252242/",
  };

  const skills = [
    "C++",
    "Java",
    "Python",
    "React.js",
    "Node.js",
    "Express.js",
    "Socket.io",
    "Tailwind CSS",
    "Vite",
    "OpenCV",
    "JavaScript",
    "REST APIs",
    "MongoDB",
    "Git & GitHub",
    "Data Structures & Algorithms",
  ];

  const fileShareFallback = {
    title: "ShareFile",
    description:
      "A secure real-time sharing platform for nearby device discovery, instant file transfer, and live code collaboration without logins.",
    techStack: ["React", "Node.js", "Socket.io", "Express"],
    link: "https://github.com/Madhav7871/FileShare",
  };

  useEffect(() => {
    fetch("https://portfolio-iqqn.onrender.com/api/projects")
      .then((response) => response.json())
      .then(async (data) => {
        let fileShareRepo = null;

        try {
          const githubResponse = await fetch(
            "https://api.github.com/repos/Madhav7871/FileShare",
          );
          if (githubResponse.ok) {
            fileShareRepo = await githubResponse.json();
          }
        } catch (error) {
          console.error("Error fetching FileShare repo:", error);
        }

        const normalizedProjects = data.map((project) => {
          const isOldDropSync =
            typeof project.title === "string" &&
            project.title.trim().toLowerCase() === "dropsync";

          const isShareFile =
            typeof project.title === "string" &&
            project.title.trim().toLowerCase() === "sharefile";

          if (!isOldDropSync && !isShareFile) {
            return project;
          }

          return {
            ...project,
            title: "ShareFile",
            description:
              fileShareRepo?.description || fileShareFallback.description,
            techStack: fileShareFallback.techStack,
            link: fileShareRepo?.html_url || fileShareFallback.link,
          };
        });

        setBackendProjects(normalizedProjects);
        setBackendLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching backend projects:", error);
        setBackendLoading(false);
      });
  }, []);

  const handleContactInputChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitContactForm = async (event) => {
    event.preventDefault();
    setContactStatus("");
    setContactSending(true);

    try {
      const response = await fetch(
        "https://portfolio-iqqn.onrender.com/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactForm),
        },
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send message.");
      }

      setContactStatus("Message sent successfully. Please check your email.");
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setContactStatus(error.message || "Something went wrong.");
    } finally {
      setContactSending(false);
    }
  };

  return (
    <main className="portfolio-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="welcome-badge animate-fade-in delay-1">
            <span className="pulse-dot"></span>
            System Online
          </div>

          <div className="hero-tagline-container animate-fade-in delay-2">
            <p className="hero-tagline">Software Developer & Tech Learner</p>
          </div>

          <h1 className="hero-name animate-fade-in delay-3">Madhav Kalra.</h1>
          <h2 className="hero-role animate-fade-in delay-4">
            CSE Student | Developer | Problem Solver
          </h2>
          <div className="hero-actions animate-fade-in delay-5">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              GitHub
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Main Content - No more hide-section classes, everything is visible! */}
      <div className="portfolio-container">
        {/* About Section */}
        <section className="about-section">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-image-container">
              <img
                src="/Picsart_26-04-13_21-29-10-465.jpg.jpeg"
                alt="Madhav Kalra"
                className="about-image"
              />
            </div>
            <div className="about-text">
              <p>
                Hello, I am Madhav Kalra. I am currently pursuing B.Tech in
                Computer Science Engineering from Bhagwan Parshuram Institute of
                Technology. Before this, I completed a Diploma in Electronics
                and Communication Engineering from Guru Tegh Bahadur Polytechnic
                Institute.
              </p>
              <p>
                My ECE background built my foundation in technology, and now I
                am diving deep into software development, programming, and
                modern web technologies. I enjoy building projects, learning
                continuously, and collaborating with people who love creating
                impactful ideas.
              </p>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="education-section">
          <h2>Education</h2>
          <div className="timeline">
            <article className="timeline-card">
              <h3>B.Tech in Computer Science Engineering</h3>
              <p>Bhagwan Parshuram Institute of Technology</p>
              <span>Current</span>
            </article>
            <article className="timeline-card">
              <h3>Diploma in Electronics and Communication Engineering</h3>
              <p>Guru Tegh Bahadur Polytechnic Institute</p>
              <span>Completed</span>
            </article>
          </div>
        </section>

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
          <h2>Featured Projects</h2>
          {backendLoading ? (
            <p className="loading-text" style={{ color: "var(--text-muted)" }}>
              Loading projects from server...
            </p>
          ) : (
            <div className="project-grid">
              {backendProjects.map((project) => (
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
                  {project.link && (
                    <a
                      className="project-link"
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Source Code →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Connect Section */}
        <section className="connect-section">
          <h2>Let's Build Together</h2>
          <p>
            Whether you have a question, a project idea, or just want to say hi,
            I'm always open to discussing new opportunities and technologies.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setContactStatus("");
              setContactModalOpen(true);
            }}
          >
            Initialize Contact
          </button>
          <div className="connect-links">
            <a href={socialLinks.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span>•</span>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div
          className="contact-modal-backdrop"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="contact-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Get in Touch</h3>
            <p>Fill out your details and I'll get back to you soon.</p>
            <form className="contact-form" onSubmit={submitContactForm}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={handleContactInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={contactForm.email}
                onChange={handleContactInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Contact Number"
                value={contactForm.phone}
                onChange={handleContactInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="How can I help you?"
                rows="4"
                value={contactForm.message}
                onChange={handleContactInputChange}
                required
              />

              {contactStatus && (
                <p className="contact-status">{contactStatus}</p>
              )}

              <div className="contact-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setContactModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={contactSending}
                >
                  {contactSending ? "Transmitting..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Portfolio;
