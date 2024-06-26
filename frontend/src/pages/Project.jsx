import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, createTask } from "../redux/actions/projectTaskAction";
import { useNavigate } from "react-router-dom";
import { getAll, user } from "../redux/actions/authAction";
import DragNDrop from "../components/DragNDrop";
import "../style/project.css";

export default function Project({ close }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [users, setUsers] = useState(useSelector((state) => state.auth.all));
    const project = useSelector((state) => state.project.one);
    const tasks = useSelector((state) => state.projectTask.tasks);
    const [open, setOpen] = useState(false);
    const [additional, setAdditional] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
        deadline: "",
        priority: null,
        difficulty: null,
        assigned_to: null,
    });

    const handleEditClick = () => {
        navigate("/projects/modify", { state: { edit: true } });
    };
    const handleCreate = (e) => {
        e.preventDefault();
        console.log("created");
        dispatch(createTask(project.id, data));
        setData({
            title: "",
            description: "",
            completion: 0,
            deadline: "",
            priority: null,
            difficulty: null,
            assigned_to: null,
        });
        setOpen(false);
    };
    const additionalValues = () => {
        if (additional) {
            setData({
                priority: null,
                difficulty: null,
                assigned_to: null,
            });
        }
        setAdditional(!additional);
    };
    useEffect(() => {
        dispatch(getTasks(project.id));
        dispatch(getAll());
        const handleKeyPress = (e) => {
            if (e.key === "Escape") {
                close();
            }
        };
        const memUsers = users.filter(
            (item) =>
                project.members.includes(item.id) || project.owner == item.id
        );
        setUsers(memUsers);
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    if (users == null || project == null || tasks == null) {
        return <h1>Loading</h1>;
    }
    return (
        <>
            {project && (
                <div className="projectListTitle">
                    <h1>
                        {project.title}
                        {project.group && (
                            <span className="material-symbols-outlined">
                                group
                            </span>
                        )}
                    </h1>
                    <div className="projectListTitle--add">
                        <button
                            className="secondary-button"
                            onClick={handleEditClick}
                        >
                            edit
                        </button>
                    </div>
                </div>
            )}
            {open && (
                <div className="create-project-task">
                    <form onSubmit={handleCreate}>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) =>
                                setData({ ...data, title: e.target.value })
                            }
                            placeholder="Task Title"
                            required
                        />
                        <textarea
                            type="text"
                            value={data.description}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Task Description"
                            required
                        />
                        <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={data.deadline}
                            onChange={(e) =>
                                setData({ ...data, deadline: e.target.value })
                            }
                        />
                        <div className="additional" onClick={additionalValues}>
                            <div>additional details</div>
                            <div>{additional ? "-" : "+"}</div>
                        </div>
                        {additional && (
                            <>
                                <div className="element">
                                    <label htmlFor="priority">Priority</label>
                                    <select
                                        id="priority"
                                        defaultValue="default"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                priority:
                                                    e.target.value.toLowerCase(),
                                            })
                                        }
                                    >
                                        <option disabled>default</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="element">
                                    <label htmlFor="difficulty">
                                        difficulty
                                    </label>
                                    <select
                                        id="difficulty"
                                        defaultValue="default"
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                difficulty:
                                                    e.target.value.toLowerCase(),
                                            })
                                        }
                                    >
                                        <option disabled>default</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="element">
                                    <label htmlFor="assign">Assign to</label>
                                    <select
                                        id="assign"
                                        defaultValue={"Select"}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                assigned_to:
                                                    e.target.value.toLowerCase(),
                                            })
                                        }
                                    >
                                        <option disabled>Select</option>
                                        {users.map((item, index) => {
                                            if (item.name != "myself")
                                                return (
                                                    <option
                                                        key={index}
                                                        value={item.id}
                                                    >
                                                        {item.name} -{" "}
                                                        {item.email}
                                                    </option>
                                                );
                                            else
                                                return (
                                                    <option
                                                        key={index}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                );
                                        })}
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="element">
                            <button onClick={() => setOpen(false)}>
                                cancel
                            </button>
                            <button type="submit">Create</button>
                        </div>
                    </form>
                </div>
            )}
            <DragNDrop
                tasks={tasks}
                newTask={() => setOpen(true)}
                users={users}
            />
        </>
    );
}
