import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ColumnType } from '../utils/enums';
import { pickChakraRandomColor, swap } from '../utils/helpers.ts';
import { debug } from '../utils/logging.ts';
import { TaskModel } from '../utils/models.ts';
import useTaskCollection from './useTaskCollection.ts';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

const MAX_TASK_PER_COLUMN = 100;

const firestore = firebase.firestore();

const tasksCollection = firestore.collection('tasks');
const taskQueryById = (id) => tasksCollection.where('id', '==', id);

console.log();

const saveTask = (task: TaskModel) => {
  tasksCollection.add(task)
      .then(_ => console.log(`task added: ${task.id}`));
}


const deleteTaskById = (taskId: TaskModel['id']) => {
  taskQueryById(taskId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => doc.ref.delete());
        console.log(`task deleted: ${taskId}`);
      });
}

const update = (task: TaskModel) => {
  console.log("reached");
  taskQueryById(task.id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.update(task);
        })
      });
}

function useColumnTasks(column: ColumnType) {
  localStorage.clear();
  const [tasks, setTasks] = useTaskCollection();

  const columnTasks = tasks[column];

  const addEmptyTask = useCallback((newTaskParams) => {
    debug(`Adding new empty task to ${column} column`);
    setTasks((allTasks) => {
      const columnTasks = allTasks[column];

      if (columnTasks.length > MAX_TASK_PER_COLUMN) {
        debug('Too many task!');
        return allTasks;
      }

      // const newColumnTask: TaskModel = {
      //   id: uuidv4(),
      //   title: `New ${column} task`,
      //   color: pickChakraRandomColor('.300'),
      //   column,
      //   to: "",
      //   from: "",
      //   deadline: new Date(),
      // };
      const newColumnTask: TaskModel = newTaskParams;

      saveTask(newColumnTask);

      return {
        ...allTasks,
        [column]: [newColumnTask, ...columnTasks],
      };
    });
  }, [column, setTasks]);

  const deleteTask = useCallback(
      (id: TaskModel['id']) => {
        debug(`Removing task ${id}..`);
        setTasks((allTasks) => {
          const columnTasks = allTasks[column];

          deleteTaskById(id);

          return {
            ...allTasks,
            [column]: columnTasks.filter((task) => task.id !== id),
          };
        });
      },
      [column, setTasks],
  );

  const updateTask = useCallback(
      (id: TaskModel['id'], updatedTask: Omit<Partial<TaskModel>, 'id'>) => {
        debug(`Updating task ${id} with ${JSON.stringify(updateTask)}`);
        setTasks((allTasks) => {
          const columnTasks = allTasks[column];
          columnTasks.map((task) =>
              update(task),
          )

          return {
            ...allTasks,
            [column]: columnTasks.map((task) =>
                task.id === id ? { ...task, ...updatedTask } : task,
            ),
          };
        });
      },
      [column, setTasks],
  );

  const dropTaskFrom = useCallback(
      (from: ColumnType, id: TaskModel['id']) => {
        setTasks((allTasks) => {
          const fromColumnTasks = allTasks[from];
          const toColumnTasks = allTasks[column];
          const movingTask = fromColumnTasks.find((task) => task.id === id);

          console.log(`Moving task ${movingTask?.id} from ${from} to ${column}`);

          if (movingTask) {
            update({
              id: movingTask.id,
              column: column,
              title: movingTask.title,
              dsc: movingTask.dsc,
              color: movingTask.color,
              to: movingTask.to,
              from: movingTask.from,
              deadline: movingTask.deadline,
            });
          }

          if (!movingTask) {
            return allTasks;
          }

          // remove the task from the original column and copy it within the destination column
          return {
            ...allTasks,
            [from]: fromColumnTasks.filter((task) => task.id !== id),
            [column]: [{ ...movingTask, column }, ...toColumnTasks],
          };
        });
      },
      [column, setTasks],
  );

  const swapTasks = useCallback(
      (i: number, j: number) => {
        debug(`Swapping task ${i} with ${j} in ${column} column`);
        setTasks((allTasks) => {
          const columnTasks = allTasks[column];
          return {
            ...allTasks,
            [column]: swap(columnTasks, i, j),
          };
        });
      },
      [column, setTasks],
  );

  return {
    tasks: columnTasks,
    addEmptyTask,
    updateTask,
    dropTaskFrom,
    deleteTask,
    swapTasks,
  };
}

export default useColumnTasks;