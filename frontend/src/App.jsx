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

  // Fetch projects from your Render backend API
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

  // Intersection Observer to animate page content smoothly on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-section");
          }
        });
      },
      { threshold: 0.15 }, // Triggers when 15% of the element is visible
    );

    const hiddenElements = document.querySelectorAll(".hide-section");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
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
      <style>{`
        :root {
          --bg-dark: #050814;
          --bg-card: rgba(20, 25, 40, 0.6);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --accent-primary: #6366f1;
          --accent-primary-hover: #4f46e5;
          --accent-secondary: #0ea5e9;
          --glass-border: rgba(255, 255, 255, 0.08);
          --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
        }

        body {
          margin: 0;
          font-family: var(--font-sans);
          background-color: var(--bg-dark);
          color: var(--text-main);
          overflow-x: hidden;
        }

        /* Smooth Scroll Animations */
        .hide-section {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .show-section {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- Upgraded Hero Section --- */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
          position: relative;
          overflow: hidden;
          background: var(--bg-dark);
        }

        /* Animated Ambient Glowing Orbs */
        .hero-section::before,
        .hero-section::after {
          content: '';
          position: absolute;
          width: 50vw;
          height: 50vw;
          max-width: 600px;
          max-height: 600px;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          animation: floatOrb 10s infinite ease-in-out alternate;
        }
        .hero-section::before {
          background: rgba(99, 102, 241, 0.12); /* Indigo glow */
          top: -10%;
          left: -10%;
        }
        .hero-section::after {
          background: rgba(14, 165, 233, 0.1); /* Cyan glow */
          bottom: -10%;
          right: -10%;
          animation-delay: -5s;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 50px) scale(1.1); }
        }

        /* Glassmorphism Hero Card */
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 4rem 3rem;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        }

        /* --- Welcome Badge & Pulse Animation --- */
        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 16px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 50px;
          color: #a5b4fc;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          text-transform: uppercase;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .hero-tagline {
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.85rem;
          color: var(--accent-secondary);
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .hero-name {
          font-size: 4rem;
          font-weight: 800;
          margin: 10px 0;
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -1px;
          line-height: 1.2;
          transition: text-shadow 0.3s ease;
        }
        
        /* Interactive Hover Glow for Name */
        .hero-name:hover {
          text-shadow: 0 0 20px rgba(165, 180, 252, 0.8), 0 0 40px rgba(99, 102, 241, 0.4);
          cursor: default;
        }

        .hero-role {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        /* Buttons */
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .btn {
          display: inline-block;
          padding: 12px 28px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        /* Initial load animations */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { opacity: 0; animation: fadeInUp 0.8s ease-out forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.5s; }
        .delay-4 { animation-delay: 0.7s; }
        .delay-5 { animation-delay: 0.9s; }

        /* --- Main Content Layout --- */
        .portfolio-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          gap: 100px;
        }

        section h2 {
          font-size: 2.5rem;
          margin-bottom: 40px;
          position: relative;
          display: inline-block;
        }
        section h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 4px;
          background: var(--accent-primary);
          border-radius: 2px;
        }

        /* About Section */
        .about-content {
          display: flex;
          align-items: center;
          gap: 60px;
          background: var(--bg-card);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
        }
        .about-image {
          width: 100%;
          max-width: 300px;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .about-text p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        /* Education Timeline */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .timeline-card {
          background: var(--bg-card);
          padding: 30px;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .timeline-card:hover {
          transform: translateX(10px);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .timeline-card h3 {
          margin: 0 0 10px 0;
          font-size: 1.3rem;
          color: white;
        }
        .timeline-card p {
          margin: 0 0 15px 0;
          color: var(--text-muted);
        }
        .timeline-card span {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(99, 102, 241, 0.15);
          color: var(--accent-primary);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Skills Section */
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .skill-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 1rem;
          color: var(--text-main);
          transition: all 0.3s ease;
        }
        .skill-badge:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--accent-primary);
          color: white;
          transform: translateY(-3px);
        }

        /* Projects Section */
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          padding: 30px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.15);
        }
        .project-card h3 {
          font-size: 1.5rem;
          margin: 0 0 15px 0;
        }
        .project-card p {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 25px;
          flex-grow: 1;
        }
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 25px;
        }
        .tech-item {
          font-size: 0.8rem;
          padding: 4px 10px;
          background: rgba(14, 165, 233, 0.1);
          color: var(--accent-secondary);
          border-radius: 6px;
        }
        .project-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .project-link:hover {
          color: var(--accent-secondary);
        }

        /* Connect Section */
        .connect-section {
          text-align: center;
          background: linear-gradient(135deg, rgba(20,25,40,0.8), rgba(10,15,30,0.8));
          padding: 60px 40px;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
        }
        .connect-section h2::after {
          left: 50%;
          transform: translateX(-50%);
        }
        .connect-section p {
          color: var(--text-muted);
          font-size: 1.2rem;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .connect-links {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        .connect-links a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .connect-links a:hover {
          color: white;
        }

        /* Modal Styles */
        .contact-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
        }
        .contact-modal {
          background: #0f172a;
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .contact-modal h3 {
          margin: 0 0 10px 0;
          font-size: 1.8rem;
        }
        .contact-modal p {
          color: var(--text-muted);
          margin-bottom: 30px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
          box-sizing: border-box;
          transition: border-color 0.3s;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .contact-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 10px;
        }
        .contact-status {
          color: var(--accent-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .hero-name { font-size: 2.8rem; }
          .hero-role { font-size: 1.1rem; }
          .hero-content { padding: 3rem 1.5rem; width: 90%; }
          .hero-actions { flex-direction: column; }
          
          .portfolio-container { padding: 40px 15px; gap: 70px; }
          
          .about-content { flex-direction: column; text-align: center; padding: 30px 20px; }
          
          .skills-grid { justify-content: center; }
          
          .project-grid { grid-template-columns: 1fr; }
          
          .contact-actions { flex-direction: column; }
          .contact-actions button { width: 100%; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="welcome-badge animate-fade-in delay-1">
            <span className="pulse-dot"></span>
            Hello, World!
          </div>

          <p className="hero-tagline animate-fade-in delay-2">
            Software Developer & Tech Learner
          </p>
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
              Explore GitHub
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="portfolio-container">
        {/* About Section */}
        <section className="about-section hide-section">
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
        <section className="education-section hide-section">
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
        <section className="skills-section hide-section">
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
        <section className="projects-section hide-section">
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
        <section className="connect-section hide-section">
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
            Send Me a Message
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
                  {contactSending ? "Sending..." : "Send Message"}
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
