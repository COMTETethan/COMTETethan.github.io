const portfolioSettings = {
    siteTitle: "Mon E-Portfolio",
    author: "COMTET Ethan",
    projects: [
      {
        title: "Scan Hub",
        description: "Création d'un site pour pouvoir lire des manga et scanlation en ligne basé à l'aide de l'API de MangaDex.",
        technologies: ["PHP", "Symfony", "Doctrine", "Twig"],
        repoLink: "#",
        liveLink: "#"
      },
      {
        title: "Image Manip",
        description: "Utilisation de DockerHub pour pouvoir aisaiement manipuler des images, notament si je souhaite en changer la résolution ou passer l'extension de celle-ci en Webp ou Avif.",
        technologies: ["Docker", "PHP"],
        repoLink: "https://hub.docker.com/repository/docker/comteteth/image-converter/general",
        liveLink: "#"
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
        title: "IoT Presence",
        description: "Projet utilisant un ESP32 Light Feather pour détécter la présence de quelqu'un et suivant la luminosité capté sur l'instant ainsi que le seuil paramétré sur le site web associé, cela ouvrira la porte et allumera la lumière.",
        technologies: ["JavaScript", "Angular", "ESP32", "Arduino"],
        repoLink: "#",
        liveLink: "#"
      }
    ]
  };
  
  if (typeof module !== "undefined") {
    module.exports = portfolioSettings;
  }