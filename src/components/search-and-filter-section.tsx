import AppIcon from "./app-icon"
interface Props{
  onFilter: (string : string) => void;
}
export default ({onFilter} : Props) => {
  return (<section className="task-filter-section">
          <div>
            <input type="search" placeholder="search task" />
          </div>
          <div className="filters">
            <div></div>
      <div className="filters-icons">
        <AppIcon name="GridView" onClick={(e) => onFilter("grid")} />
        <AppIcon name="Splitscreen" onClick={(e) => onFilter("split")} />
            </div>
      <div>
        <button className="add-todo-button">
          <span>Add Task / TO DO</span>
          <AppIcon name="AddBoxOutlined"/>
        </button>
            </div>
          </div>
        </section>)
}