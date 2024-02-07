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

const usersRef = firestore.collection('users');

var email = "";

firebase.auth().onAuthStateChanged((user) => {
  if (user && user.email) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    email = user.email;
    console.log("hello " + user.email);
    console.log("user is signed in")
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const ITUsers = await usersRef.where('department', '==', 'IT').get();
ITUsers.forEach(user => {
  console.log(user.data());
});

// finds current user in the firestore database
const currentUser = await usersRef.where('email', '==', email).get();
if (currentUser) {
  console.log("user existsssss " + currentUser);
} else {
  console.log("user not found");
}
var currentDepartment = "";
currentUser.forEach(doc => {
  console.log('user exists');
  console.log(doc.data());
  currentDepartment = doc.data().department;
});

const citiesRef = firestore.collection('tasks');

const todoTasks = await citiesRef.where('column', '==', 'Todo').where('to', '==', currentDepartment).get();
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
    dsc: doc.data().dsc,
    to: doc.data().to,
    from: doc.data().from,
    deadline: doc.data().deadline,
  });
});

// gets all in progress tasks
const inProgressTasks = await citiesRef.where('column', '==', 'In Progress').where('to', '==', currentDepartment).get();
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
    dsc: doc.data().dsc,
    color: doc.data().color,
    to: doc.data().to,
    from: doc.data().from,
    deadline: doc.data().deadline,
  });
});

// gets all blocked tasks
const blockedTasks = await citiesRef.where('column', '==', 'Blocked').where('to', '==', currentDepartment).get();
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
    dsc: doc.data().dsc,
    color: doc.data().color,
    to: doc.data().to,
    from: doc.data().from,
    deadline: doc.data().deadline,
  });
});

// gets all completed tasks
const completedTasks = await citiesRef.where('column', '==', 'Completed').where('to', '==', currentDepartment).get();
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
    dsc: doc.data().dsc,
    color: doc.data().color,
    to: doc.data().to,
    from: doc.data().from,
    deadline: doc.data().deadline,
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