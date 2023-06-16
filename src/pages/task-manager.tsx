import SearchAndFilterSection from "../components/search-and-filter-section"
import TaskBodySection from "../components/task-body-section"
import SideNav from "../components/side-nav"
import data from "../components/data.js";
import React, { useEffect, useRef, useState } from "react";
import ScrollToTop from "../components/scrollToTop";
import { saveTask } from "../components/http";

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
}

export const TasksManager = () => {
  const [grid, setGrid] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterItems, setFilterItems] = useState<string[]>([]);
  const [tasks, setTasks] = useState(data);
  const tasksBackup = useRef<Task[]>(data);
  function switchDisplayMode(displayMode: string) {
    if (displayMode === 'grid') return setGrid(true);
    setGrid(false);
  }
  function handleSearch(e: React.FormEvent): void {
    setTasks(prev => tasksBackup.current);
    let input = e.target as HTMLInputElement;
    if (!input) return
    let query = input.value.toLowerCase();
    const matchingTasks: Task[] = [];
    for (const task of tasksBackup.current) {
      const title = task.title.toLowerCase();
      const content = task.content.toLowerCase();
      const category = task.category.toLowerCase();
      if (title.includes(query) || content.includes(query) || category.includes(query)) {
        matchingTasks.push(task);
      }
    }
    setTasks(prev => matchingTasks);
  }
  function handleCreateTodo() {
    const newTask = {
      id: `hello aoaoao`,
      title: "title",
      content: "new task",
      background: "#ebba50",
      size: 8,
      category: "Category",
      creationDate: new Date(),
      expirationDate: new Date(),
      isPinned: false,
      isHidden: false,
    }
    setTasks(prev => ([
      ...tasks, newTask
    ]))
    saveTask(newTask);
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }
  function getDateDifferenceInMilliseconds(date1: Date, date2: Date) {
    const timeDiff = date2.getTime() - date1.getTime();
    return timeDiff;
  }

  function handleFilter(key: string) {
    let tasksCopy = [...tasksBackup.current]
    switch (key) {
      case "category": tasksCopy = tasksCopy.sort((a, b) => a.category.charCodeAt(0) - b.category.charCodeAt(0)); break;
      case "alphabitic ordre": tasksCopy = tasksCopy.sort((a, b) => a.content.charCodeAt(0) - b.content.charCodeAt(0)); break;
      case "size": tasksCopy = tasksCopy.sort((a, b) => a.size - b.size); break;
      case "hidden": tasksCopy = tasksCopy.filter(e => e.isHidden); break;
      case "pinned": tasksCopy = tasksCopy.filter(e => e.isPinned); break;
      case "creation date": tasksCopy = tasksCopy.sort((a, b) => getDateDifferenceInMilliseconds(a.creationDate, b.creationDate)); break;
    }
    setTasks(prev => tasksCopy);
  }
  useEffect(() => {
    let categoriesStrings = [...new Set(tasks.map(t => t.category.trim().toLocaleLowerCase()))]
    let filterItemsStrings = ["category", "alphabitic ordre", "creation date", "size", "hidden", "pinned"]
    setCategories(prev => categoriesStrings)
    setFilterItems(prev => filterItemsStrings)
  }, [tasks])
  return (
    <main className="tasks-page">
      <ScrollToTop />
      <SideNav categories={categories} filterItems={filterItems} onFilter={handleFilter} />
      <section className="todos-container">
        <section className="task-head-section">
          <h1>
            TODOWI
            <span>tasks</span>
          </h1>
        </section>
        <SearchAndFilterSection onAddTodo={handleCreateTodo} onFilter={switchDisplayMode} onSearch={handleSearch} />
        <TaskBodySection data={tasks} grid={grid} />
      </section>
    </main>
  );
}
