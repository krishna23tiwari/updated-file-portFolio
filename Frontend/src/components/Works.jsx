import React, { useEffect, useState } from "react";

import Tilt from "react-parallax-tilt";

import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import axios from "axios";
import baseurl from "./BaseUrl";
import { Github, Pencil, Trash2 } from "lucide-react";

const truncateWords = (text = "", wordLimit = 50) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  link,
  source_code_link,
  isAdmin,
  onEdit,
  onDelete,
}) => {
    const [expanded, setExpanded] = useState(false);
  const full = description;
  const preview = truncateWords(full, 20);
  const needsToggle = full.trim().split(/\s+/).length > 50;

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full relative"
      >
        {/* Project Image */}
        <a href={link} target="_blank" rel="noopener noreferrer">
          <div className="relative w-full h-[230px]">
            <img
              src={image}
              alt="project_image"
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* GitHub Source Code Link */}
            <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              >
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </a>

        {/* Project Details */}
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          {/* <p className="mt-2 text-secondary text-[14px]">{description}</p> */}
                <p className="mt-2 text-secondary text-[14px]">
            {expanded ? full : preview}{" "}
            {needsToggle && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-sm text-indigo-400 ml-1 underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <p key={i} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>

       

        {isAdmin && (
  <div className="mt-4 flex justify-end gap-2">
    <button
      className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full"
      onClick={onEdit}
      title="Edit Project"
    >
      <Pencil size={16} />
    </button>
    <button
      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
      onClick={onDelete}
      title="Delete Project"
    >
      <Trash2 size={16} />
    </button>
  </div>
)}

      </Tilt>
    </motion.div>
  );
};


const Works = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      link: "",
      source_code_link: "",
      tags: "",
      image: null,
    });
  const [isAdmin, setIsAdmin] = useState(false);
  const [editId, setEditId] = useState(null);
  // const [expanded, setExpanded] = useState(false);
  // const full = project.description || "";
  // const preview = truncateWords(full, 50);

    const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };
  

  useEffect(() => {
    fetchProjects();

    
    const checkLocalStorage = () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      setIsAdmin(isLoggedIn);
    };

    checkLocalStorage();

    window.addEventListener("storage", checkLocalStorage);

    return () => window.removeEventListener("storage", checkLocalStorage);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseurl}projects/getproject`, getAuthHeaders());
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };


//  const handleAddProject = async (e) => {
//    e.preventDefault();

//   const tagsArray = formData.tags.split(",").map((tag) => ({
//     name: tag.trim(),
//     color: "text-green-400",
//   }));

//   const payload = new FormData();
//   payload.append("name", formData.name);
//   payload.append("description", formData.description);
//   payload.append("link", formData.link);
//   payload.append("source_code_link", formData.source_code_link);
//   payload.append("tags", JSON.stringify(tagsArray));
//   if (formData.image) {
//     payload.append("image", formData.image);
//   }

//   try {
//     if (editId) {
//       // Update
//       await axios.put(`${baseurl}projects/update/${editId}`, payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log("Project updated");
//     } else {
//       // Add
//       await axios.post(`${baseurl}projects/addproject`, payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log("Project added");
//     }

//     fetchProjects();
//     setShowForm(false);
//     setEditId(null); // Reset edit state
//     setFormData({
//       name: "",
//       description: "",
//       link: "",
//       source_code_link: "",
//       tags: "",
//       image: null,
//     });
//   } catch (error) {
//     console.error("Error submitting project:", error);
//   }
// };

// const truncateWords = (text = "", wordLimit = 50) => {
//   const words = text.trim().split(/\s+/);
//   if (words.length <= wordLimit) return text;
//   return words.slice(0, wordLimit).join(" ") + "...";
// };



const handleAddProject = async (e) => {
  e.preventDefault();

  const tagsArray = formData.tags.split(",").map((tag) => ({
    name: tag.trim(),
    color: "text-green-400",
  }));

  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("description", formData.description);
  payload.append("link", formData.link);
  payload.append("source_code_link", formData.source_code_link);
  payload.append("tags", JSON.stringify(tagsArray));
  if (formData.image) {
    payload.append("image", formData.image);
  }

  // Merge your token header with content type
  const config = {
    headers: {
      ...getAuthHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    if (editId) {
      // Update
      await axios.put(`${baseurl}projects/update/${editId}`, payload, config);
      console.log("Project updated");
    } else {
      // Add
      await axios.post(`${baseurl}projects/addproject`, payload, config);
      console.log("Project added");
    }

    fetchProjects();
    setShowForm(false);
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      link: "",
      source_code_link: "",
      tags: "",
      image: null,
    });
  } catch (error) {
    console.error("Error submitting project:", error);
  }
};

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this project?")) {
    try {
      await axios.delete(`${baseurl}projects/delete/${id}`, getAuthHeaders());
      fetchProjects(); 
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }
};

const handleEdit = (project) => {
  setShowForm(true);
  setEditId(project._id); // Set ID for updating
  setFormData({
    name: project.name,
    description: project.description,
    link: project.link,
    source_code_link: project.source_code_link,
    tags: project.tags.map((tag) => tag.name).join(", "), // convert array to string
    image: null, // Don't prefill image
  });
};
  
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Following projects showcase my skills and experience...
        </motion.p>
      </div>

      {isAdmin && (
        <div className="my-8">
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Cancel" : "Add Project"}
          </button>

          {showForm && (
            <form
              onSubmit={handleAddProject}
              className="mt-6 p-6 bg-[#1f1f1f] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-lg"
            >
              <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-3 rounded-lg bg-[#2a2a2a] text-white"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="p-3 bg-[#2a2a2a] text-white rounded-lg"
                required={!editId}
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="p-3 rounded-lg bg-[#2a2a2a] text-white col-span-full"
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="p-3 rounded-lg bg-[#2a2a2a] text-white"
              />
              <input
                type="url"
                placeholder="Live Link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="p-3 rounded-lg bg-[#2a2a2a] text-white"
              />
              <input
                type="url"
                placeholder="Source Code Link"
                value={formData.source_code_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source_code_link: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-[#2a2a2a] text-white"
              />
              {/* <button
                type="submit"
                className="col-span-full bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
              >
                Submit Project
              </button> */},

              <button
  type="submit"
  className="col-span-full bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
>
  {editId ? "Update Project" : "Submit Project"}
</button>

            </form>
          )}
        </div>
      )}

      <div className="mt-20 flex flex-wrap gap-6">
        {projects.map((project, index) => (
          {/* <ProjectCard key={project._id || index} index={index} {...project} /> */},
          <ProjectCard
  key={project._id}
  index={index}
  {...project}
  isAdmin={isAdmin}
  onEdit={() => handleEdit(project)}
  onDelete={() => handleDelete(project._id)}
/>

        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
