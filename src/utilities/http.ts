import { db, auth } from "./database/firebase";
import { collection } from "firebase/firestore";
import { User, updateProfile } from "firebase/auth";

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
currentUser();
const usersRef = collection(db, "users");

interface Task {
  id: string;
  title: string;
  content: string;
  background: string;
  size: number;
  category: string;
  creationDate: Date;
  expirationDate: Date;
  isPinned: boolean;
  isHidden: boolean;
  [key: string]: any;
}

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
export async function deleteTask(id: string) {}
export async function deleteCategory(category: string) {}
export async function editCategory(category: string) {}
export async function getTasks() {}
