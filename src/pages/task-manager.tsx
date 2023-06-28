import SearchAndFilterSection from "../components/search-and-filter-section";
import TaskBodySection from "../components/task-body-section";
import SideNav from "../components/side-nav";
import React, { useEffect, useRef, useState } from "react";
import ScrollToTop from "../components/scrollToTop";
import Context, { fetchTasks } from "../components/context";
import { Logo } from "../components/app-logo";
import UserProfile from "../components/user-profile";
import { deleteCategory, saveTasksToServer } from "../utilities/http";
import { useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { auth, db } from "../utilities/database/firebase";
import LoadingSpinner from "../components/loader";
import { Alert, TextField } from "@mui/material";
import { Settings, Task } from "../utilities/type_task";
import { nanoid } from "nanoid";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import Popup from "../components/app-popup";
import { toast } from "react-toastify";

export const TasksManager = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(auth?.currentUser);
  const [filterItems, setFilterItems] = useState<string[]>([]);
  const [category, setCategory] = useState<string>();
  const [isFilterPage, setIsFilterPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editedTasks, setEditedTasks] = useState<string[]>([]);
  const tasksBackup = useRef<Task[]>([]);

  function switchDisplayMode(displayMode: string) {
    if (displayMode === "grid") setGrid(true);
    else setGrid(false);
  }
  function deleteTask(id: string) {
    let tasksCopy = [...tasksBackup.current];
    let stateTasksCopy = [...tasks];
    tasksCopy = tasksCopy.filter((e) => e.tid !== id);
    stateTasksCopy = stateTasksCopy.filter((e) => e.tid !== id);
    setTasks((prev) => stateTasksCopy);
    setEditedTasks((prev) => prev.filter((t) => t !== id));
    tasksBackup.current = [...tasksCopy];
  }
  function saveTask(task: Task) {
    let tasksCopy = [...tasksBackup.current];
    let element = tasksCopy.find((e) => e.tid === task.tid);
    if (!element) return;
    let index = tasksCopy.indexOf(element);
    tasksCopy[index] = { ...task };
    tasksBackup.current = [...tasksCopy];
    setEditedTasks((prev) => {
      if (prev.includes(task.tid)) {
        return prev;
      } else {
        return [...prev, task.tid];
      }
    });
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
  async function handleCreateTodo() {
    if (!user) return;
    let id = user.uid;
    let tasksReference = collection(db, "tasks");
    let uniqueId = nanoid();
    const newTask = {
      id,
      tid: uniqueId,
      content: "new task",
      background: "#728cfe",
      size: "new task".length,
      category: "Category",
      creationDate: Date.now(),
      isPinned: false,
      isHidden: false,
    };
    let doc = await addDoc(tasksReference, newTask);
    newTask.tid = doc.id;
    await updateDoc(doc, newTask);
    saveTask(newTask);
    setTasks((prev) => [...tasks, newTask]);
    setEditedTasks((p) => [...p, newTask.tid]);
    tasksBackup.current = [...tasksBackup.current, newTask];
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
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
        tasksCopy = tasksCopy.sort((a, b) => a.creationDate - b.creationDate);
        break;
    }
    setTasks((prev) => tasksCopy);
  }
  async function handleEditCategory(key: string, newCategory: string) {
    try {
      let tasksCopy = [...tasksBackup.current];
      tasksCopy = tasksCopy.map((e) => {
        if (e.category.trim().toLocaleLowerCase() === key.toLowerCase()) {
          e.category = newCategory;
          const docRef = doc(db, "tasks", e.tid);
          updateDoc(docRef, { category: newCategory });
        }
        return e;
      });
      tasksBackup.current = [...tasksCopy];
      setTasks((prev) => [...tasksCopy]);
      toast("category updated successfully", {
        type: "success",
        draggable: true,
      });
    } catch (e) {
      toast("error updating category.", { type: "error", draggable: true });
    }
  }
  async function handleDeleteCategory() {
    let tasksCopy = [...tasksBackup.current];
    if (!category) return setModalOpen(false);
    tasksCopy = tasksCopy.filter(
      (e) =>
        e.category.trim().toLocaleLowerCase() !==
        category.trim().toLocaleLowerCase()
    );
    tasksBackup.current = [...tasksCopy];
    setTasks((prev) => tasksCopy);
    setModalOpen(false);
    await deleteCategory(category);
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
  async function setUserTasks() {
    setLoading(true);
    const tasksCopy = await fetchTasks();
    setTasks((prev) => tasksCopy);
    tasksBackup.current = tasksCopy;
    setLoading(false);
  }
  async function handleSaveTasks() {
    let fullfilled = await saveTasksToServer(tasksBackup.current, editedTasks);
    if (fullfilled) setEditedTasks([]);
  }
  async function isAuthenticated() {
    if (!user) navigate("/auth/login");
  }
  useEffect(() => {
    if (user) {
      setUserTasks();
    }
  }, [user]);
  useEffect(() => {
    setUser(user);
    isAuthenticated();
  }, [auth.currentUser]);
  const contextValue = {
    saveTask,
    deleteTask,
    handleEditCategory,
    handleDeleteCategory,
    handleSelectCategory,
    tasks,
  };
  return (
    <>
      {loading && <LoadingSpinner />}

      <Popup open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="confirm">
          <h2>confirm delete {category} category</h2>
          <div className="actions">
            <button
              className="link button btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button className="link button" onClick={handleDeleteCategory}>
              Confirm
            </button>
          </div>
        </div>
      </Popup>
      <main className="tasks-page">
        <ScrollToTop />
        <Context.Provider value={contextValue}>
          <SideNav
            categories={categories}
            filterItems={filterItems}
            onDeleteCategory={(categorie) => {
              setModalOpen(true);
              setCategory(categorie);
            }}
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
            {editedTasks.length > 0 ? (
              <div className="save-actions">
                <Alert className="alert" severity="warning">
                  warning : you must save you tasks
                </Alert>
                <div className="actions">
                  <button
                    className="link button btn-secondary"
                    onClick={() => setEditedTasks([])}
                  >
                    cancel
                  </button>
                  <button className="link button" onClick={handleSaveTasks}>
                    save
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
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
    </>
  );
};
