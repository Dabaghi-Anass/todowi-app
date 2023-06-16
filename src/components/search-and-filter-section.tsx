import React from "react";
import AppIcon from "./app-icon"
interface Props {
  onFilter: (string: string) => void;
  onAddTodo: () => void;
  onSearch: (e: React.FormEvent) => void;
}
export default ({ onFilter, onAddTodo, onSearch }: Props) => {
  return (<section className="task-filter-section">
    <div>
      <input type="search" placeholder="search task" onInput={onSearch} />
    </div>
    <div className="filters">
      <div className="filters-icons">
        <AppIcon name="GridView" onClick={(e) => onFilter("grid")} />
        <AppIcon name="Splitscreen" onClick={(e) => onFilter("split")} />
      </div>
      <div>
        <button className="add-todo-button" onClick={onAddTodo}>
          <span>Add Task</span>
          <AppIcon name="AddBox" />
        </button>
      </div>
    </div>
  </section>)
}