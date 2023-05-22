import SideNav from "../components/side-nav"
import SearchAndFilterSection from "../components/search-and-filter-section"
import TaskBodySection from "../components/task-body-section"
import data from "../components/data.js";
import { useState } from "react";
import Popup from "../components/app-popup";
export const TasksManager = () => {
  const [grid, setGrid] = useState<boolean>(true);
  function switchDisplayMode(displayMode: string) {
    if (displayMode === 'grid') return setGrid(true);
    setGrid(false);
  }
  return (
    <main className="tasks-page">
      <SideNav />
      {/* <Popup>
        <h1>anass dabaghi</h1>
      </Popup> */}
      <section className="todos-container">
        <section className="task-head-section">
          <h1>
            TODOWI
            <span>tasks</span>
          </h1>
        </section>
        <SearchAndFilterSection onFilter={switchDisplayMode} />
        <TaskBodySection data={data} grid={grid} />
      </section>
   </main>
  )
}
