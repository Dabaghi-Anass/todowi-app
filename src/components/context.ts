import { createContext } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../utilities/database/firebase";
import { currentUser } from "../utilities/http";
import { Task } from "../utilities/type_task";
import { toast } from "react-toastify";

export async function fetchTasks() {
  try {
    const user = await currentUser();
    if (!user) return [];
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("id", "==", user.uid));
    const querySnapshot = await getDocs(q);
    let docs: Task[] = [];
    querySnapshot.forEach((doc) => {
      let tsk = doc.data();
      tsk.tid = doc.id;
      docs.push(tsk as Task);
    });
    return docs;
  } catch (error) {
    toast("Error fetching tasks:", { type: "error", draggable: true });
    return [];
  }
}
function saveTask(task: Task) {}
function deleteTask(id: string) {}
function handleSelectCategory(key: string) {}
function handleEditCategory(key: string, newCategory: string) {}
function handleDeleteCategory(key: string) {}

export default createContext({
  saveTask,
  deleteTask,
  handleEditCategory,
  handleDeleteCategory,
  handleSelectCategory,
  tasks: [] as Task[],
});
