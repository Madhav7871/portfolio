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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-section");
          }
        });
      },
      { threshold: 0.15 },
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
          --bg-dark: #03050a;
          --bg-card: rgba(10, 15, 26, 0.65);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --accent-primary: #6366f1; /* Indigo */
          --accent-primary-glow: rgba(99, 102, 241, 0.6);
          --accent-secondary: #06b6d4; /* Neon Cyan */
          --accent-secondary-glow: rgba(6, 182, 212, 0.6);
          --glass-border: rgba(255, 255, 255, 0.05);
          --glass-border-hover: rgba(255, 255, 255, 0.15);
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

        /* Tech Grid Background */
        .tech-grid {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            linear-gradient(var(--glass-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--glass-border) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
          opacity: 0.3;
          animation: panBackground 60s linear infinite;
        }

        @keyframes panBackground {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(40px) translateX(40px); }
        }

        /* Animated Ambient Glowing Orbs */
        .hero-section::before,
        .hero-section::after {
          content: '';
          position: absolute;
          width: 60vw;
          height: 60vw;
          max-width: 700px;
          max-height: 700px;
          border-radius: 50%;
          filter: blur(140px);
          z-index: 0;
          animation: floatOrb 12s infinite ease-in-out alternate;
        }
        .hero-section::before {
          background: rgba(99, 102, 241, 0.15);
          top: -20%; left: -10%;
        }
        .hero-section::after {
          background: rgba(6, 182, 212, 0.12);
          bottom: -20%; right: -10%;
          animation-delay: -6s;
        }

        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -40px) scale(1.1); }
        }

        /* Premium Glassmorphism Hero Card */
        /* FIX APPLIED HERE: Added flex column layout to force vertical stacking */
        .hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 850px;
          padding: 4.5rem 3.5rem;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* --- Welcome Badge & Pulse Animation --- */
        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 20px;
          background: rgba(6, 182, 212, 0.05);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 50px;
          color: var(--accent-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          margin-bottom: 2.5rem;
          text-transform: uppercase;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: var(--accent-secondary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--accent-secondary);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 var(--accent-secondary-glow); }
          70% { box-shadow: 0 0 0 12px rgba(6, 182, 212, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }

        /* Typewriter Effect for Tagline */
        .hero-tagline-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          width: 100%;
        }
        
        .hero-tagline {
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 0.9rem;
          color: var(--accent-primary);
          font-weight: 600;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid var(--accent-primary);
          animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
          margin: 0;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: var(--accent-primary) }
        }

        .hero-name {
          font-size: 4.5rem;
          font-weight: 800;
          margin: 10px 0;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, var(--accent-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -2px;
          line-height: 1.1;
          transition: text-shadow 0.4s ease;
          text-align: center;
        }
        
        /* Interactive Hover Glow for Name */
        .hero-name:hover {
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px var(--accent-secondary-glow);
          cursor: default;
        }

        .hero-role {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 3rem;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-align: center;
        }

        /* Buttons with Neon Accents */
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 24px;
          width: 100%;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent-primary), #4f46e5);
          color: white;
          box-shadow: 0 10px 25px -5px var(--accent-primary-glow);
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 35px -5px var(--accent-primary-glow);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.03);
          color: white;
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: var(--accent-secondary);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px var(--accent-secondary-glow);
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
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          gap: 120px;
        }

        section h2 {
          font-size: 2.8rem;
          margin-bottom: 50px;
          position: relative;
          display: inline-block;
          font-weight: 700;
          letter-spacing: -1px;
        }
        section h2::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 0;
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          border-radius: 4px;
          box-shadow: 0 0 10px var(--accent-primary-glow);
        }

        /* About Section */
        .about-content {
          display: flex;
          align-items: center;
          gap: 70px;
          background: var(--bg-card);
          padding: 50px;
          border-radius: 32px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }
        /* Subtle glow inside about card */
        .about-content::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 100%; height: 100%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
          z-index: 0;
        }
        
        .about-image-container { z-index: 1; }
        .about-image {
          width: 100%;
          max-width: 320px;
          border-radius: 24px;
          object-fit: cover;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
          border: 1px solid var(--glass-border-hover);
          transition: transform 0.5s ease;
        }
        .about-image:hover {
          transform: scale(1.02) translateY(-5px);
          border-color: rgba(99, 102, 241, 0.4);
        }
        
        .about-text { z-index: 1; }
        .about-text p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 1.15rem;
          margin-bottom: 20px;
        }

        /* Education Timeline */
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 25px;
          position: relative;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 20px; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--accent-primary), transparent);
          opacity: 0.3;
        }
        
        .timeline-card {
          background: var(--bg-card);
          padding: 35px 35px 35px 60px;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
          position: relative;
          transition: all 0.4s ease;
        }
        .timeline-card::before {
          content: '';
          position: absolute;
          left: 14px; top: 40px;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--accent-primary);
          box-shadow: 0 0 15px var(--accent-primary-glow);
          border: 4px solid var(--bg-dark);
        }
        
        .timeline-card:hover {
          transform: translateX(10px);
          border-color: rgba(99, 102, 241, 0.4);
          background: rgba(20, 25, 40, 0.8);
        }
        .timeline-card h3 {
          margin: 0 0 10px 0;
          font-size: 1.4rem;
          color: white;
        }
        .timeline-card p {
          margin: 0 0 15px 0;
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        .timeline-card span {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--accent-primary);
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        /* Neon Skills Section */
        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .skill-badge {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 1.05rem;
          color: var(--text-muted);
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .skill-badge:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: var(--accent-secondary);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -5px var(--accent-secondary-glow);
        }

        /* Cyberpunk Projects Section */
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 35px;
        }
        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          padding: 40px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.4s ease;
          position: relative;
        }
        /* Top accent line */
        .project-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--glass-border-hover), transparent);
          transition: background 0.4s;
        }
        
        .project-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .project-card:hover::before {
          background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
        }
        
        .project-card h3 {
          font-size: 1.6rem;
          margin: 0 0 15px 0;
          color: white;
        }
        .project-card p {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 30px;
          flex-grow: 1;
        }
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 30px;
        }
        .tech-item {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          background: rgba(6, 182, 212, 0.08);
          color: var(--accent-secondary);
          border-radius: 8px;
          border: 1px solid rgba(6, 182, 212, 0.15);
        }
        .project-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: color 0.2s, transform 0.2s;
        }
        .project-link:hover {
          color: var(--accent-secondary);
          transform: translateX(5px);
        }

        /* Connect Section */
        .connect-section {
          text-align: center;
          background: linear-gradient(135deg, rgba(15, 20, 35, 0.8), rgba(5, 8, 15, 0.9));
          padding: 80px 40px;
          border-radius: 32px;
          border: 1px solid var(--glass-border);
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
        }
        .connect-section h2::after {
          left: 50%;
          transform: translateX(-50%);
        }
        .connect-section p {
          color: var(--text-muted);
          font-size: 1.25rem;
          margin-bottom: 50px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .connect-links {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          gap: 25px;
        }
        .connect-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 1px;
          transition: color 0.2s, text-shadow 0.2s;
        }
        .connect-links a:hover {
          color: white;
          text-shadow: 0 0 15px rgba(255,255,255,0.5);
        }

        /* Modal Styles */
        .contact-modal-backdrop {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
        }
        .contact-modal {
          background: #0a0f1a;
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 28px;
          padding: 50px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.1);
          transform: translateY(0);
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalPop {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .contact-modal h3 {
          margin: 0 0 10px 0;
          font-size: 2rem;
          color: white;
        }
        .contact-modal p {
          color: var(--text-muted);
          margin-bottom: 35px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          color: white;
          font-size: 1.05rem;
          font-family: inherit;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .contact-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 15px;
        }
        .contact-status {
          color: var(--accent-secondary);
          font-size: 0.95rem;
          margin: 0;
          padding: 10px;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .hero-name { font-size: 3rem; }
          .hero-role { font-size: 1.1rem; }
          .hero-content { padding: 3rem 1.5rem; width: 90%; border-radius: 24px; }
          .hero-actions { flex-direction: column; }
          
          .portfolio-container { padding: 50px 15px; gap: 80px; }
          
          .about-content { flex-direction: column; text-align: center; padding: 30px 20px; border-radius: 24px; }
          .about-image { max-width: 250px; }
          
          .timeline::before { left: 30px; }
          .timeline-card { padding: 25px 20px 25px 50px; }
          .timeline-card::before { left: 24px; }
          
          .skills-grid { justify-content: center; }
          
          .project-grid { grid-template-columns: 1fr; }
          
          .contact-modal { padding: 30px 20px; }
          .contact-actions { flex-direction: column; }
          .contact-actions button { width: 100%; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="tech-grid"></div>
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
