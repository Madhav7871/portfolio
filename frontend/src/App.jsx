import React, { useEffect, useRef, useState } from "react";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroScrollRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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

  // NEW: Intersection Observer to animate page content smoothly on scroll
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

  useEffect(() => {
    const heroElement = heroScrollRef.current;
    const canvas = canvasRef.current;
    if (!heroElement || !canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = "/Picsart_26-04-13_21-29-10-465.jpg.jpeg";
    imageRef.current = image;

    const drawFrame = (progressValue) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      canvas.width = viewportWidth;
      canvas.height = viewportHeight;

      const loadedImage = imageRef.current;
      if (!loadedImage || !loadedImage.complete) {
        return;
      }

      // Responsive math for canvas background scaling
      const scale = 1 + progressValue * 0.35;
      const coverScale = Math.max(
        viewportWidth / loadedImage.width,
        viewportHeight / loadedImage.height,
      );
      const drawWidth = loadedImage.width * coverScale * scale;
      const drawHeight = loadedImage.height * coverScale * scale;

      // Keep horizontal center
      const offsetX = (viewportWidth - drawWidth) / 2;

      // Focus 15% from the top for mobile so it doesn't zoom too far into your face
      const isMobile = viewportWidth <= 768;
      const verticalFocus = isMobile ? 0.15 : 0.5;
      const offsetY = (viewportHeight - drawHeight) * verticalFocus;

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      ctx.drawImage(loadedImage, offsetX, offsetY, drawWidth, drawHeight);

      const overlay = ctx.createLinearGradient(0, 0, 0, viewportHeight);
      overlay.addColorStop(0, "rgba(3, 6, 16, 0.20)");
      overlay.addColorStop(0.6, "rgba(3, 6, 16, 0.45)");
      overlay.addColorStop(1, "rgba(3, 6, 16, 0.75)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    };

    const updateScroll = () => {
      const top = heroElement.offsetTop;
      const distance = heroElement.offsetHeight - window.innerHeight;
      const current = window.scrollY - top;
      const progressValue = Math.max(0, Math.min(1, current / distance));
      setScrollProgress(progressValue);
      drawFrame(progressValue);
    };

    const handleResize = () => {
      updateScroll();
    };

    image.onload = () => {
      drawFrame(0);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Adjusted the math slightly so it waits a tiny bit before fading in
  const nameOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.08) / 0.2));
  const roleOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.2));
  // Added actions opacity so buttons fade in after the text
  const actionsOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.2));

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
      {/* Styles for Animations & Layout Fixes */}
      <style>{`
        /* Smooth Scroll Animations for rest of the page */
        .hide-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .show-section {
          opacity: 1;
          transform: translateY(0);
        }

        /* Fix for buttons overlapping text */
        .hero-btn {
          white-space: nowrap !important;
          transition: transform 0.2s ease-out, background-color 0.2s;
        }
        
        .hero-btn:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .hero-overlay { 
            padding: 0 20px; 
            text-align: center; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-top: 40vh; /* Pushes text below your face */
          }
          .hero-name { font-size: 2.5rem !important; }
          .hero-role { font-size: 1.2rem !important; margin-bottom: 20px; }
          
          /* Fixed button layout for mobile */
          .hero-actions { 
            display: flex; 
            flex-direction: column; /* Stack buttons on top of each other */
            width: 100%; 
            align-items: center; 
            gap: 15px; 
          }
          .hero-btn { width: 80%; text-align: center; }
          
          .portfolio-container { padding: 20px 15px !important; }
          .about-section, .education-section, .skills-section, .projects-section, .connect-section { padding: 20px 0; }
          
          .skills-grid { display: grid !important; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important; gap: 10px; }
          .project-grid { display: grid !important; grid-template-columns: 1fr !important; gap: 20px; }
          .timeline { flex-direction: column !important; gap: 20px; }
          
          .contact-modal { width: 90% !important; max-width: 350px; padding: 20px !important; margin: 0 auto; }
          .contact-form input, .contact-form textarea { width: 100%; box-sizing: border-box; }
          .contact-actions { display: flex; flex-direction: column; gap: 10px; }
          .contact-actions button { width: 100%; }
        }
      `}</style>

      <section className="hero-scroll" ref={heroScrollRef}>
        <div className="hero-sticky">
          <canvas ref={canvasRef} className="hero-canvas" />

          <div className="hero-overlay hero-overlay-center">
            <p className="hero-tagline">Software Developer and Tech Learner</p>

            {/* Added CSS transitions so the scroll updates glide smoothly */}
            <h1
              className="hero-name"
              style={{
                opacity: nameOpacity,
                transform: `translateY(${(1 - nameOpacity) * 40}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              }}
            >
              Madhav Kalra.
            </h1>
            <h2
              className="hero-role"
              style={{
                opacity: roleOpacity,
                transform: `translateY(${(1 - roleOpacity) * 40}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              }}
            >
              CSE Student | Developer | Problem Solver
            </h2>
            <div
              className="hero-actions"
              style={{
                opacity: actionsOpacity,
                transform: `translateY(${(1 - actionsOpacity) * 40}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              }}
            >
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hero-btn hero-btn-primary"
              >
                Explore GitHub
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hero-btn hero-btn-secondary"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>

          <div className="scroll-hint">Scroll Down</div>
        </div>
      </section>

      <div className="portfolio-container">
        {/* Added 'hide-section' to enable scroll animations */}
        <section className="about-section hide-section">
          <h2>About Me</h2>
          <p>
            Hello, I am Madhav Kalra. I am currently pursuing B.Tech in Computer
            Science Engineering from Bhagwan Parshuram Institute of Technology.
            Before this, I completed a Diploma in Electronics and Communication
            Engineering from Guru Tegh Bahadur Polytechnic Institute.
          </p>
          <p>
            My ECE background built my foundation in technology, and now I am
            diving deep into software development, programming, and modern web
            technologies. I enjoy building projects, learning continuously, and
            collaborating with people who love creating impactful ideas.
          </p>
        </section>

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
            <p className="loading-text">Loading projects from server...</p>
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
                  {project.link ? (
                    <a
                      className="project-link"
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Project
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="connect-section hide-section">
          <h2>Let us Connect</h2>
          <p>
            If you are interested in technology, collaboration, or discussing
            innovative ideas, feel free to connect with me.
          </p>
          <button
            type="button"
            className="connect-cta-btn"
            onClick={() => {
              setContactStatus("");
              setContactModalOpen(true);
            }}
          >
            Connect With Me
          </button>
          <div className="connect-links">
            <a href={socialLinks.github} target="_blank" rel="noreferrer">
              GitHub Profile
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
              LinkedIn Profile
            </a>
          </div>
        </section>
      </div>

      {contactModalOpen ? (
        <div
          className="contact-modal-backdrop"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="contact-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Send a Message</h3>
            <p>Fill your details and I will connect with you soon.</p>
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
                placeholder="Your Email ID"
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
                placeholder="Your Message"
                rows="4"
                value={contactForm.message}
                onChange={handleContactInputChange}
                required
              />

              {contactStatus ? (
                <p className="contact-status">{contactStatus}</p>
              ) : null}

              <div className="contact-actions">
                <button
                  type="button"
                  className="contact-btn contact-btn-secondary"
                  onClick={() => setContactModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="contact-btn contact-btn-primary"
                  disabled={contactSending}
                >
                  {contactSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Portfolio;
