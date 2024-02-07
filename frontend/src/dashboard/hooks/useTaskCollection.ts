import { useLocalStorage } from 'usehooks-ts';

import { v4 as uuidv4 } from 'uuid';
import { ColumnType } from '../utils/enums.ts';
import { TaskModel } from '../utils/models.ts';

import '../../firebaseConfig.js';

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firestore = firebase.firestore;
import {useEffect, useState} from "react";
import axios from "axios";
import Task from "../components/Task";

function useTaskCollection(column:ColumnType,chatUser:any,tasks:any[]) {
  let todoTaskModels =[];
  let inProgressTaskModels =[];
  let blockedTaskModels:TaskModel[] =[];
  let completedTaskModels =[];

  switch (column) {
    case ColumnType.IN_PROGRESS:
      tasks.forEach(task =>{
        if(task.column == column){
          inProgressTaskModels.push(task);
        }
      })
          break;
    case ColumnType.TO_DO:
      tasks.forEach(task =>{
        if(task.column == column){
          todoTaskModels.push(task);
        }
      })
      break;
    case ColumnType.COMPLETED:
      tasks.forEach(task =>{
        if(task.column == column){
          completedTaskModels.push(task);
        }
      })
      break;
    case ColumnType.BLOCKED:
      tasks.forEach(task =>{
        if(task.column == column){
          blockedTaskModels.push(task);
        }
      })
        console.log(tasks)
      break;
  }

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
