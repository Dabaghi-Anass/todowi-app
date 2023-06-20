import { createContext } from "react";
import data from "./data";

interface Task {
  id: string;
  content: string;
  background: string;
  size: number;
  category: string;
  creationDate: Date;
  isPinned: boolean;
  isHidden: boolean;
  [key: string]: any;
}

var tasks: Task[] = [...data];
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
  tasks,
});
