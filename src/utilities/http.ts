import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./database/firebase";
import { User, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { Task } from "./type_task";

async function getCurrentUser(): Promise<User> {
  return new Promise((resolve) => {
    let id = setInterval(() => {
      if (auth?.currentUser) {
        resolve(auth?.currentUser);
        clearInterval(id);
      }
    }, 10);
  });
}

export async function currentUser() {
  return await getCurrentUser();
}

let tasksRef = collection(db, "tasks");
export async function saveTask(task: Task) {}

export async function updateUser(
  user: User,
  {
    displayName,
    photoURL,
  }: {
    displayName: string;
    photoURL: string | null;
  }
) {
  await updateProfile(user, {
    displayName,
    photoURL,
  });
}

export async function updateTask(task: Task) {}
export async function getTask(id: string) {}
export async function deleteTaskFromDB(id: string) {
  try {
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
    toast("task deleted succefully", {
      type: "info",
      draggable: true,
    });
  } catch (error) {
    toast("Error deleting task:", { type: "error", draggable: true });
  }
}
export async function deleteCategory(category: string) {
  try {
    const q = query(
      tasksRef,
      where("category", "==", category.trim().toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    toast(`${category} category deleted successfully`, {
      type: "success",
      draggable: true,
    });
  } catch (error) {
    toast(`Error deleting ${category} category try again later`, {
      type: "error",
      draggable: true,
    });
  }
}
export async function editCategory(category: string) {}
export async function saveTasksToServer(tasks: Task[], editedItems: string[]) {
  try {
    for (let item of editedItems) {
      let task = tasks.find((e) => e.tid === item);
      if (task) {
        const taskRef = doc(tasksRef, task.tid);
        await updateDoc(taskRef, task);
      }
    }
    toast("Tasks saved successfully.", { type: "success", draggable: true });
    return true;
  } catch (error) {
    toast("Error saving tasks try again later", {
      type: "error",
      draggable: true,
    });
    return false;
  }
}
