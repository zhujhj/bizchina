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

function useTaskCollection(column:ColumnType,chatUser:any) {
  let todoTaskModels =[];
  let inProgressTaskModels =[];
  let blockedTaskModels =[];
  let completedTaskModels =[];
  const firestore = firebase.firestore();
  const [loading, setLoading] = useState(true);
  const tasksCollection = firestore.collection('tasks').where("to","==",chatUser.department).where("column","==",column);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await tasksCollection.get();

        let tasksArray = [];
        doc.forEach(task => {
          tasksArray.push(task.data());
        })
        switch (column){
          case ColumnType.TO_DO:
            todoTaskModels = tasksArray;
            break;
          case ColumnType.IN_PROGRESS:
            inProgressTaskModels = tasksArray;
            break;
          case ColumnType.BLOCKED:
            blockedTaskModels = tasksArray;
            break;
          case ColumnType.COMPLETED:
            completedTaskModels = tasksArray;
            break;
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
