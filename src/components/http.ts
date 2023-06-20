// import axios from "axios"

type Word = {
  word: string;
  index: number;
};
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

export async function updateTask(task: Task) {}
export async function getTask(id: string) {}
export async function deleteTask(id: string) {}
export async function deleteCategory(category: string) {}
export async function editCategory(category: string) {}
export async function getTasks() {}
