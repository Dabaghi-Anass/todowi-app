import SearchAndFilterSection from "../components/search-and-filter-section";
import TaskBodySection from "../components/task-body-section";
import SideNav from "../components/side-nav";
import data from "../components/data.js";
import React, { useEffect, useRef, useState } from "react";
import ScrollToTop from "../components/scrollToTop";
import { nanoid } from "nanoid";
import Context from "../components/context";
import { Logo } from "../components/app-logo";
import UserProfile from "../components/user-profile";
import { currentUser } from "../utilities/http";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { auth } from "../utilities/database/firebase";

interface Task {
  id: string;
  content: string;
  background: string;
  size: number;
  category: string;
  creationDate: Date;
  isPinned: boolean;
  isHidden: boolean;
}

export const TasksManager = () => {
  const [grid, setGrid] = useState<boolean>(true);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(auth?.currentUser);
  const [filterItems, setFilterItems] = useState<string[]>([]);
  const [isFilterPage, setIsFilterPage] = useState<number>(1);
  const [tasks, setTasks] = useState(data);
  const tasksBackup = useRef<Task[]>(data);

  function switchDisplayMode(displayMode: string) {
    if (displayMode === "grid") return setGrid(true);
    setGrid(false);
  }
  function deleteTask(id: string) {
    let tasksCopy = [...tasksBackup.current];
    let stateTasksCopy = [...tasks];
    tasksCopy = tasksCopy.filter((e) => e.id !== id);
    stateTasksCopy = stateTasksCopy.filter((e) => e.id !== id);
    setTasks((prev) => stateTasksCopy);
    tasksBackup.current = [...tasksCopy];
  }
  function saveTask(task: Task) {
    let tasksCopy = [...tasksBackup.current];
    let element = tasksCopy.find((e) => e.id === task.id);
    if (!element) return;
    let index = tasksCopy.indexOf(element);
    tasksCopy[index] = { ...task };
    tasksBackup.current = [...tasksCopy];
    setTasks((prev) => tasksCopy);
  }

  function handleSearch(e: React.FormEvent): void {
    setTasks((prev) => tasksBackup.current);
    let input = e.target as HTMLInputElement;
    if (!input) return;
    let query = input.value.toLowerCase();
    const matchingTasks: Task[] = [];
    for (const task of tasksBackup.current) {
      const content = task.content.toLowerCase();
      const category = task.category.toLowerCase();
      if (content.includes(query) || category.includes(query)) {
        matchingTasks.push(task);
      }
    }
    setTasks((prev) => matchingTasks);
  }
  function handleCreateTodo() {
    let id = nanoid();
    const newTask = {
      id: id,
      content: "new task",
      background: "rgb(232, 232, 125)",
      size: "new task".length,
      category: "Category",
      creationDate: new Date(),
      isPinned: false,
      isHidden: false,
    };
    setTasks((prev) => [...tasks, newTask]);
    tasksBackup.current = [...tasksBackup.current, newTask];
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }
  function getDateDifferenceInMilliseconds(date1: Date, date2: Date) {
    const timeDiff = date2.getTime() - date1.getTime();
    return timeDiff;
  }

  function handleFilter(key: string) {
    let tasksCopy = [...tasksBackup.current];
    setIsFilterPage((p) => 1);
    switch (key) {
      case "category":
        tasksCopy = tasksCopy.sort((a, b) =>
          a.category.localeCompare(b.category)
        );
        break;
      case "alphabetic order":
        tasksCopy = tasksCopy.sort((a, b) =>
          a.content.localeCompare(b.content)
        );
        break;

      case "size":
        tasksCopy = tasksCopy.sort((a, b) => a.size - b.size);
        break;
      case "hidden":
        tasksCopy = tasksCopy.filter((e) => e.isHidden);
        setIsFilterPage((p) => 0);
        break;
      case "pinned":
        tasksCopy = tasksCopy.filter((e) => e.isPinned);
        break;
      case "creation date":
        tasksCopy = tasksCopy.sort((a, b) =>
          getDateDifferenceInMilliseconds(a.creationDate, b.creationDate)
        );
        break;
    }
    setTasks((prev) => tasksCopy);
  }
  function handleEditCategory(key: string, newCategory: string) {
    console.log(key, newCategory);
    let tasksCopy = [...tasksBackup.current];
    tasksCopy = tasksCopy.map((e) => {
      if (e.category.trim().toLocaleLowerCase() === key)
        e.category = newCategory;
      return e;
    });
    tasksBackup.current = [...tasksCopy];
    setTasks((prev) => tasksCopy);
  }
  function handleDeleteCategory(key: string) {
    let tasksCopy = [...tasksBackup.current];
    tasksCopy = tasksCopy.filter(
      (e) =>
        e.category.trim().toLocaleLowerCase() !== key.trim().toLocaleLowerCase()
    );
    tasksBackup.current = [...tasksCopy];
    setTasks((prev) => tasksCopy);
  }
  function handleSelectCategory(key: string) {
    setIsFilterPage((p) => -1);
    let tasksCopy = [...tasksBackup.current];
    tasksCopy = tasksCopy.filter(
      (e) =>
        e.category.trim().toLocaleLowerCase() === key.trim().toLocaleLowerCase()
    );
    setTasks((prev) => tasksCopy);
  }
  useEffect(() => {
    let categoriesStrings = [
      ...new Set(
        tasksBackup.current.map((t) => t.category.trim().toLocaleLowerCase())
      ),
    ];
    let filterItemsStrings = [
      "category",
      "alphabitic ordre",
      "creation date",
      "size",
      "hidden",
      "pinned",
    ];
    setCategories((prev) => categoriesStrings);
    setFilterItems((prev) => filterItemsStrings);
  }, [tasks]);
  useEffect(() => {
    setTasks((prev) => data);
  }, [data]);
  async function isAuthenticated() {
    const user = auth.currentUser;
    if (!user) navigate("/auth/login");
  }
  useEffect(() => {
    isAuthenticated();
  }, [auth.currentUser]);
  async function getUser() {
    setUser(await currentUser());
  }
  useEffect(() => {
    getUser();
  }, []);
  const contextValue = {
    saveTask,
    deleteTask,
    handleEditCategory,
    handleDeleteCategory,
    handleSelectCategory,
    tasks,
  };
  return (
    <main className="tasks-page">
      <ScrollToTop />
      <Context.Provider value={contextValue}>
        <SideNav
          categories={categories}
          filterItems={filterItems}
          onFilter={handleFilter}
        />
      </Context.Provider>
      <section className="todos-container">
        <section className="task-head-section">
          <span></span>
          <h1>
            <Logo />
            <span className="sub">tasks</span>
          </h1>
          <UserProfile />
        </section>
        <SearchAndFilterSection
          onAddTodo={handleCreateTodo}
          onFilter={switchDisplayMode}
          onSearch={handleSearch}
        />
        <Context.Provider value={contextValue}>
          <TaskBodySection
            data={
              isFilterPage === 0
                ? tasks
                    .filter((e) => e.isHidden)
                    .sort((a, b) => {
                      if (a.isPinned && !b.isPinned) return -1;
                      else if (!a.isPinned && b.isPinned) return 1;
                      else return 0;
                    })
                : isFilterPage === 1
                ? tasks
                    .filter((e) => !e.isHidden)
                    .sort((a, b) => {
                      if (a.isPinned && !b.isPinned) return -1;
                      else if (!a.isPinned && b.isPinned) return 1;
                      else return 0;
                    })
                : tasks.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    else if (!a.isPinned && b.isPinned) return 1;
                    else return 0;
                  })
            }
            grid={grid}
          />
        </Context.Provider>
      </section>
    </main>
  );
};
