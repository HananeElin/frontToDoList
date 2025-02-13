"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Pencil, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const TaskBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<any>([]);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  
  // const currentUserId ;

    // Filter tasks based on search query
    const filteredTasks = tasks.filter((task: any)  => task.content.toLowerCase().includes(searchQuery.toLowerCase()));

  // useEffect(() => {
  //   // Récupérer le token JWT depuis les cookies
  //   const token = Cookies.get("jwt");
  //   if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token); // Decoder le JWT
  //       setCurrentUserId(decodedToken.id); // Stocker l'ID utilisateur
  //     } catch (error) {
  //       console.error("Erreur lors du decodage du token:", error);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (currentUserId) {
  //     axios.get(`https://backendtodolist-production-5d7d.up.railway.app/tasks/user`, {withCredentials: true})
  //       .then(response => setTasks(response.data))
  //       .catch(error => console.error("Error loading tasks:", error));
  //   }
  // }, [currentUserId]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          'https://backendtodolist-production-5d7d.up.railway.app/asks/user/',
          { withCredentials: true } // Envoie les cookies avec la requête
        );
  
        if (response.data.id) {
          console.log('User ID from cookie:', response.data.id);
          setTasks(response.data.tasks || []);
        } else {
          console.warn('Aucun utilisateur trouvé dans les cookies');
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
  
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTaskContent.trim()) return;
    setLoading(true);
  
    try {
      //  recup l'ID utilisateur depuis le backend
      const userResponse = await axios.get(
        "https://backendtodolist-production-5d7d.up.railway.app/user", 
        { withCredentials: true }
      );
  
      const userId = userResponse.data.id;
      if (!userId) {
        console.warn("Aucun utilisateur trouvé dans les cookies");
        setLoading(false);
        return;
      }
  
      //  Créer la tâche avec l'ID recuo
      const newTask = {
        content: newTaskContent,
        status: "TODO",
        userId: userId, // Utilisation de l'ID rec
        deadline: newTaskDeadline ? new Date(newTaskDeadline) : null
      };
  
      const taskResponse = await axios.post(
        "https://backendtodolist-production-5d7d.up.railway.app/tasks/user/",
        newTask,
        { withCredentials: true }
      );
  
      //  Mettre à jour l'état avec la nouvelle tâche
      setTasks((prev: any) => [...prev, taskResponse.data]);
      setNewTaskContent("");
      setNewTaskDeadline("");
      setShowModal(false);
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTask = (id: any) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // If the user confirms, proceed with deletion
      axios.delete(`https://backendtodolist-production-5d7d.up.railway.app/tasks/${id}`, {withCredentials: true})
        .then(() => {
          setTasks((prev: any) => prev.filter((task: any) => task.id !== id));
          toast.success("Task deleted successfully!");
        })
        .catch(error => {
          console.error("Error deleting task:", error);
          toast.error("Failed to delete task.");
        });
    } else {

      toast.info("Task deletion canceled.");
    }
  };


  const handleUpdateTask = () => {
    if (!(editTask as any).content.trim()) return;
    axios
      .put(`https://backendtodolist-production-5d7d.up.railway.app/tasks/${(editTask as any).id}`, editTask, {withCredentials: true})
      .then(() => {
        setTasks((prev: any) => prev.map((task: any) => task.id === (editTask as any).id ? editTask : task));
        setShowEditModal(false);
        toast.success("Task updated successfully!");
      })
      .catch((error: any) => console.error("Error updating task:", error));
  };

  const moveTask = (id: any, status: any) => {
    axios
      .put(`https://backendtodolist-production-5d7d.up.railway.app/tasks/${id}`, { status }, {withCredentials: true})
      .then(() => setTasks((prev: any) => prev.map((task: any) => task.id === id ? { ...task, status } : task)))
      .catch((error: any) => console.error("Error moving task:", error));
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 flex justify-between bg-white">
        <div className="flex items-center gap-4 w-full">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-72 text-black" // Set text color to black
          />
          {/* Add Task Button */}
          <button className="bg-black text-white p-2 rounded-lg ml-auto" onClick={() => setShowModal(true)}>
            Add Task
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
        {["TODO", "IN_PROGRESS", "DONE"].map(status => (
          <TaskColumn key={status} status={status} tasks={tasks} moveTask={moveTask} setEditTask={setEditTask} setShowEditModal={setShowEditModal} handleDeleteTask={handleDeleteTask} />
        ))}
      </div>

      {showModal && <TaskModal onClose={() => setShowModal(false)} onSave={handleCreateTask} value={newTaskContent} onChange={setNewTaskContent} deadline={newTaskDeadline} onDeadlineChange={setNewTaskDeadline} loading={loading} />}
      {showEditModal && <TaskModal onClose={() => setShowEditModal(false)} onSave={handleUpdateTask} value={editTask.content} onChange={(content: any) => setEditTask({ ...editTask, content })} deadline={editTask.deadline} onDeadlineChange={(deadline: any) => setEditTask({ ...editTask, deadline })} loading={loading} />}

      <ToastContainer />
    </DndProvider>
  );
};

const TaskColumn = ({ status, tasks, moveTask, setEditTask, setShowEditModal, handleDeleteTask }: any) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop({ accept: "TASK", drop: (item: any) => moveTask(item.id, status), collect: monitor => ({ isOver: !!monitor.isOver() }) });
  drop(ref);
  return (
    <div ref={ref} className={`p-6 rounded-xl shadow-xl bg-gradient-to-r ${isOver ? "from-orange-200 to-purple-200" : "from-orange-100 to-orange-50"}`}>
      <h2 className="text-2xl font-bold mb-4 text-orange-600">{status}</h2>
      {tasks.filter((task: any) => task.status === status).map((task: any) => (
        <TaskCard key={task.id} task={task} setEditTask={setEditTask} setShowEditModal={setShowEditModal} handleDeleteTask={handleDeleteTask} />
      ))}
    </div>
  );
};

const TaskCard = ({ task, setEditTask, setShowEditModal, handleDeleteTask }: any) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({ type: "TASK", item: { id: task.id }, collect: monitor => ({ isDragging: !!monitor.isDragging() }) });
  drag(ref);
  return (
    <div ref={ref} className={`p-4 mb-4 bg-white rounded-lg shadow-lg flex justify-between items-center ${isDragging ? "opacity-50" : ""}`}>
      <p className="text-gray-800 flex-1">{task.content}</p>
      {task.deadline && <p className="text-sm text-gray-500">{new Date(task.deadline).toLocaleDateString()}</p>}
      <div className="flex gap-2">
        <button onClick={() => { setEditTask(task); setShowEditModal(true); }} className="text-black hover:text-gray-600"><Pencil size={18} /></button>
        <button onClick={() => handleDeleteTask(task.id)} className="text-orange-700 hover:text-orange-500"><Trash size={18} /></button>
      </div>
    </div>
  );
};

const TaskModal = ({ onClose, onSave, value, onChange, deadline, onDeadlineChange, loading }: any) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
      <h2 className="text-2xl font-bold mb-4 text-black">{value ? "Edit" : "Add"} Task</h2>
      <textarea
        className="w-full p-2 mb-4 border rounded-lg text-black"
        placeholder="Enter task description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
      <input
        type="datetime-local"
        value={deadline ? new Date(deadline).toISOString().slice(0, 16) : ""}
        onChange={(e) => onDeadlineChange(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg text-black"
      />
      <div className="flex justify-between">
        <button className="bg-gray-500 text-white p-2 rounded-lg" onClick={onClose}>Cancel</button>
        <button className="bg-orange-500 text-white p-2 rounded-lg" onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  </div>
);

export default TaskBoard;
