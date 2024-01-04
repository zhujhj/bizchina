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

const citiesRef = firestore.collection('tasks');

// gets all todo tasks
const todoTasks = await citiesRef.where('column', '==', 'Todo').get();
if (todoTasks.empty) {
  console.log('No matching documents.');
}  

const todoTaskModels: TaskModel[] = []

todoTasks.forEach(doc => {
  console.log(doc.id, '=>', doc.data().column);
  todoTaskModels.push({
    id: doc.data().id,
    column: doc.data().column,
    title: doc.data().title,
    color: doc.data().color,
  });
});

// gets all in progress tasks
const inProgressTasks = await citiesRef.where('column', '==', 'In Progress').get();
if (inProgressTasks.empty) {
  console.log('No matching documents.');
}  

const inProgressTaskModels: TaskModel[] = []

inProgressTasks.forEach(doc => {
  console.log(doc.id, '=>', doc.data().column);
  inProgressTaskModels.push({
    id: doc.data().id,
    column: doc.data().column,
    title: doc.data().title,
    color: doc.data().color,
  });
});

// gets all blocked tasks
const blockedTasks = await citiesRef.where('column', '==', 'Blocked').get();
if (blockedTasks.empty) {
  console.log('No matching documents.');
}  

const blockedTaskModels: TaskModel[] = []

blockedTasks.forEach(doc => {
  console.log(doc.id, '=>', doc.data().column);
  blockedTaskModels.push({
    id: doc.data().id,
    column: doc.data().column,
    title: doc.data().title,
    color: doc.data().color,
  });
});

// gets all completed tasks
const completedTasks = await citiesRef.where('column', '==', 'Completed').get();
if (completedTasks.empty) {
  console.log('No matching documents.');
}  

const completedTaskModels: TaskModel[] = []

completedTasks.forEach(doc => {
  console.log(doc.id, '=>', doc.data().column);
  completedTaskModels.push({
    id: doc.data().id,
    column: doc.data().column,
    title: doc.data().title,
    color: doc.data().color,
  });
});

const kanbanRef = firestore.collection('tasks');
const query = kanbanRef.orderBy('id');
const taskQueryByColumn = (column) => kanbanRef.where('column', '==', column);

function useTaskCollection() {
  
  return useLocalStorage<{
    [key in ColumnType]: TaskModel[];
  }>('tasks', {
    Todo: todoTaskModels,
    'In Progress': inProgressTaskModels,
    Blocked: blockedTaskModels,
    Completed: completedTaskModels,
  });
}

export default useTaskCollection;
