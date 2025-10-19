import styles from "./InboxList.module.css";
import { useDrag } from "react-dnd";

export const InboxList = ({ task, onEdit }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "TASK",
    item: {
      id: task._id,
      fromStatus: task.status,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <>
      <div
        ref={dragRef}
        className="card p-3 mb-3 mt-3"
        style={{ cursor: "pointer", opacity: isDragging ? 0.5 : 1 }}
      >
        <h4>{task.title}</h4>
        {/* <div className={styles.buttonBody}>
          <button
            style={{ border: "none", background: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#updateModal"
            onClick={onEdit}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/16412/16412240.png"
              width="15px"
              height="15px"
              alt="Edit"
            />
          </button>
          <button style={{ border: "none", background: "none" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
              width="15px"
              height="15px"
              alt="delete"
            />
          </button>
        </div> */}
      </div>
    </>
  );
};
