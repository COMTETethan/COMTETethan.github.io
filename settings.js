const portfolioSettings = {
    siteTitle: "Mon E-Portfolio",
    author: "COMTET Ethan",
    projects: [
      {
        title: "Project 1",
        description: "Description for Project 1. A brief overview of what it does and technologies used.",
        technologies: ["HTML", "CSS", "JavaScript"],
        repoLink: "https://github.com/yourusername/project1",
        liveLink: "https://yourusername.github.io/project1"
      },
      {
        title: "Project 2",
        description: "Description for Project 2. A brief overview of what it does and technologies used.",
        technologies: ["React", "Tailwind CSS"],
        repoLink: "https://github.com/yourusername/project2",
        liveLink: "https://yourusername.github.io/project2"
      },
      {
        title: "Project 3",
        description: "Description for Project 3. A brief overview of what it does and technologies used.",
        technologies: ["Vue.js", "SCSS"],
        repoLink: "https://github.com/yourusername/project3",
        liveLink: "https://yourusername.github.io/project3"
      },
      {
        title: "Three Js",
        description: "Utilisation de Three Js pour modéliser des objets 3D lors de mini-projets",
        technologies: ["JavaScript", "Three Js", "3D"],
        repoLink: "#",
        liveLink: "https://COMTETethan.github.io/ThreeJs/live"
      },
      {
        title: "Echec Js",
        description: "Projet de création d'un site web de jeux d'échec à deux utilisateurs",
        technologies: ["Javascript", "TypeScript", "Vue.js"],
        repoLink: "https://github.com/yourusername/project5",
        liveLink: "https://yourusername.github.io/project5"
      },
      {
        title: "Project 6",
        description: "Description for Project 6. A brief overview of what it does and technologies used.",
        technologies: ["Python", "Flask", "SQLite"],
        repoLink: "https://github.com/yourusername/project6",
        liveLink: "https://yourusername.github.io/project6"
      }
    ]
  };
  
  if (typeof module !== "undefined") {
    module.exports = portfolioSettings;
  }