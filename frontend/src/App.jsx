import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroScrollRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
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

      const scale = 1 + progressValue * 0.35;
      const coverScale = Math.max(
        viewportWidth / loadedImage.width,
        viewportHeight / loadedImage.height
      );
      const drawWidth = loadedImage.width * coverScale * scale;
      const drawHeight = loadedImage.height * coverScale * scale;
      const offsetX = (viewportWidth - drawWidth) / 2;
      const offsetY = (viewportHeight - drawHeight) / 2;

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

  const nameOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.05) / 0.2));
  const roleOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.2));

  return (
    <main className="portfolio-page">
      <section className="hero-scroll" ref={heroScrollRef}>
        <div className="hero-sticky">
          <canvas ref={canvasRef} className="hero-canvas" />

          <div className="hero-overlay hero-overlay-center">
            <h1
              className="hero-name"
              style={{
                opacity: nameOpacity,
                transform: `translateY(${(1 - nameOpacity) * 20}px)`,
              }}
            >
              Madhav Kalra.
            </h1>
            <h2
              className="hero-role"
              style={{
                opacity: roleOpacity,
                transform: `translateY(${(1 - roleOpacity) * 20}px)`,
              }}
            >
              Senior Full Stack Developer
            </h2>
          </div>

          <div className="scroll-hint">Scroll Down</div>
        </div>
      </section>

      <div className="portfolio-container">
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
    </main>
  );
};

export default Portfolio;
