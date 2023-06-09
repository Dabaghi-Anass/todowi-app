import SearchAndFilterSection from "../components/search-and-filter-section"
import TaskBodySection from "../components/task-body-section"
import SideNav from "../components/side-nav"
import data from "../components/data.js";
import { useState } from "react";


export const TasksManager = () => {
  const [grid, setGrid] = useState<boolean>(true);
  const [tasks, setTasks] = useState(data);
  function switchDisplayMode(displayMode: string) {
    if (displayMode === 'grid') return setGrid(true);
    setGrid(false);
  }
  function handleCreateTodo() {
      const newTask  = {
        id: "akak",
        title: "title",
        content: "new task",
        background: "hsl(210,50%,50%)",
        size: 8,
        category: "Category",
        creationDate: new Date(),
        expirationDate: new Date(),
        isPinned: false,
        isHidden: false,
        boldWords: [],
        italicWords: [],
        underlinedWords: [],
        lineCrossedWords: [],
    }
    setTasks(prev => ([
      ...prev, newTask
    ]))
  }
  return (
    <main className="tasks-page">
      <SideNav />
      <section className="todos-container">
        <section className="task-head-section">
          <h1>
            TODOWI
            <span>tasks</span>
          </h1>
        </section>
        <SearchAndFilterSection onAddTodo={handleCreateTodo}   onFilter={switchDisplayMode} />
        <TaskBodySection data={tasks} grid={grid} />
      </section>
   </main>
  )
}
