// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Pencil, Trash } from "lucide-react";

// const TaskBoard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [newTaskContent, setNewTaskContent] = useState("");
//   const [newTaskDeadline, setNewTaskDeadline] = useState(""); // Added deadline state
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editTask, setEditTask] = useState(null);
//   const API_URL = process.env.PUBLIC_API_URL;

//     // const currentUserId = 12; // Replace with actual logic

// const currentUserId = localStorage.getItem("userId"); // Récupération de l'id stocké

//    useEffect(() => {
//      if (currentUserId) {
//        axios.get(`${API_URL}/tasks/user/${currentUserId}`)
//          .then(response => setTasks(response.data))
//          .catch(error => console.error("Error loading tasks:", error));
//      }
//    }, [currentUserId]);
   

//   const handleCreateTask = () => {
//     if (!newTaskContent.trim()) return;
//     setLoading(true);
//     const newTask = {
//       content: newTaskContent,
//       status: "TODO",
//       userId: currentUserId,
//       deadline: newTaskDeadline ? new Date(newTaskDeadline) : null // Include deadline in task data
//     };
//     axios.post(`${API_URL}/tasks`, newTask)
//       .then(response => {
//         setTasks(prev => [...prev, response.data]);
//         setNewTaskContent("");
//         setNewTaskDeadline(""); // Clear deadline after adding
//         setShowModal(false);
//       })
//       .catch(error => console.error("Error creating task:", error))
//       .finally(() => setLoading(false));
//   };

//   const handleDeleteTask = (id) => {
//     axios.delete(`${API_URL}/tasks/${id}`)
//       .then(() => setTasks(prev => prev.filter(task => task.id !== id)))
//       .catch(error => console.error("Error deleting task:", error));
//   };

//   const handleUpdateTask = () => {
//     if (!editTask.content.trim()) return;
//     axios.put(`${API_URL}/tasks/${editTask.id}`, editTask)
//       .then(() => {
//         setTasks(prev => prev.map(task => task.id === editTask.id ? editTask : task));
//         setShowEditModal(false);
//       })
//       .catch(error => console.error("Error updating task:", error));
//   };

//   const moveTask = (id, status) => {
//     axios.put(`${API_URL}/tasks/${id}`, { status })
//       .then(() => setTasks(prev => prev.map(task => task.id === id ? { ...task, status } : task)))
//       .catch(error => console.error("Error moving task:", error));
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="p-6 flex justify-between bg-white">
//         <h1 className="text-2xl font-bold text-black">Task Board</h1>
//         <button className="bg-black text-white p-2 rounded-lg" onClick={() => setShowModal(true)}>
//           Add Task
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
//         {["TODO", "IN_PROGRESS", "DONE"].map(status => (
//           <TaskColumn key={status} status={status} tasks={tasks} moveTask={moveTask} setEditTask={setEditTask} setShowEditModal={setShowEditModal} handleDeleteTask={handleDeleteTask} />
//         ))}
//       </div>

//       {showModal && <TaskModal onClose={() => setShowModal(false)} onSave={handleCreateTask} value={newTaskContent} onChange={setNewTaskContent} deadline={newTaskDeadline} onDeadlineChange={setNewTaskDeadline} loading={loading} />}
//       {showEditModal && <TaskModal onClose={() => setShowEditModal(false)} onSave={handleUpdateTask} value={editTask.content} onChange={content => setEditTask({ ...editTask, content })} deadline={editTask.deadline} onDeadlineChange={(deadline) => setEditTask({ ...editTask, deadline })} loading={loading} />}
//     </DndProvider>
//   );
// };

// const TaskColumn = ({ status, tasks, moveTask, setEditTask, setShowEditModal, handleDeleteTask }) => {
//   const [{ isOver }, drop] = useDrop({ accept: "TASK", drop: item => moveTask(item.id, status), collect: monitor => ({ isOver: !!monitor.isOver() }) });
//   return (
//     <div ref={drop} className={`p-6 rounded-xl shadow-xl bg-gradient-to-r ${isOver ? "from-orange-200 to-purple-200" : "from-orange-100 to-orange-50"}`}>
//       <h2 className="text-2xl font-bold mb-4 text-orange-600">{status}</h2>
//       {tasks.filter(task => task.status === status).map(task => (
//         <TaskCard key={task.id} task={task} setEditTask={setEditTask} setShowEditModal={setShowEditModal} handleDeleteTask={handleDeleteTask} />
//       ))}
//     </div>
//   );
// };

// const TaskCard = ({ task, setEditTask, setShowEditModal, handleDeleteTask }) => {
//   const [{ isDragging }, drag] = useDrag({ type: "TASK", item: { id: task.id }, collect: monitor => ({ isDragging: !!monitor.isDragging() }) });
//   return (
//     <div ref={drag} className={`p-4 mb-4 bg-white rounded-lg shadow-lg flex justify-between items-center ${isDragging ? "opacity-50" : ""}`}>
//       <p className="text-gray-800 flex-1">{task.content}</p>
//       {task.deadline && <p className="text-sm text-gray-500">{new Date(task.deadline).toLocaleDateString()}</p>}
//       <div className="flex gap-2">
//         <button onClick={() => { setEditTask(task); setShowEditModal(true); }} className="text-black hover:text-gray-600"><Pencil size={18} /></button>
//         <button onClick={() => handleDeleteTask(task.id)} className="text-orange-700 hover:text-orange-500"><Trash size={18} /></button>
//       </div>
//     </div>
//   );
// };

// const TaskModal = ({ onClose, onSave, value, onChange, deadline, onDeadlineChange, loading }) => (
//   <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
//       <h2 className="text-2xl font-bold mb-4 text-black">{value ? "Edit" : "Add"} Task</h2>
//       <textarea
//         className="w-full p-2 mb-4 border rounded-lg text-black"
//         placeholder="Enter task description"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         rows={4}
//       />
//       <input
//         type="datetime-local"
//         value={deadline ? new Date(deadline).toISOString().slice(0, 16) : ""}
//         onChange={(e) => onDeadlineChange(e.target.value)}
//         className="w-full p-2 mb-4 border rounded-lg text-black"
//       />
//       <div className="flex justify-between">
//         <button className="bg-gray-500 text-white p-2 rounded-lg" onClick={onClose}>Cancel</button>
//         <button className="bg-orange-500 text-white p-2 rounded-lg" onClick={onSave} disabled={loading}>
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </div>
//   </div>
// );



// export default TaskBoard;
