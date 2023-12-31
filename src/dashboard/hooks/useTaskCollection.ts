import { useLocalStorage } from 'usehooks-ts';

import { v4 as uuidv4 } from 'uuid';
import { ColumnType } from '../utils/enums.ts';
import { TaskModel } from '../utils/models.ts';

import '../../firebaseConfig.js';

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { getAuth } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore';

const auth = getAuth();
const firestore = firebase.firestore();

// let todo: TaskModel[] = [];
// let inProgress = [];
// let blocked = [];
// let completed = [];

// for (let task in kanbanRef.get()) {
//   if (task['column'] === "Todo") {
//     todo.push(task);
//   } else if (task['column'] === "In Progress") {
//     inProgress.push(task);
//   } else if (task['column'] === "Blocked") {

//   } else if (task['column'] === "Completed") {

//   }
// }

const kanbanRef = firestore.collection('tasks');
const query = kanbanRef.orderBy('id');
const taskQueryByColumn = (column) => kanbanRef.where('column', '==', column);



function useTaskCollection() {
  
  return useLocalStorage<{
    [key in ColumnType]: TaskModel[];
  }>('tasks', {
    Todo: [
      {
        id: uuidv4(),
        column: ColumnType.TO_DO,
        title: 'Task 1',
        color: 'blue.300',
      },
    ],
    'In Progress': [
      {
        id: uuidv4(),
        column: ColumnType.IN_PROGRESS,
        title: 'Task 2',
        color: 'yellow.300',
      },
    ],
    Blocked: [
      {
        id: uuidv4(),
        column: ColumnType.BLOCKED,
        title: 'Task 3',
        color: 'red.300',
      },
    ],
    Completed: [
      {
        id: uuidv4(),
        column: ColumnType.COMPLETED,
        title: 'Task 4',
        color: 'green.300',
      },
    ],
  });
}

export default useTaskCollection;
