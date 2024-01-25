import { useDrop } from 'react-dnd';
import { ColumnType, ItemType } from '../utils/enums.ts';
import { DragItem, TaskModel } from '../utils/models.ts';

import '../../firebaseConfig.js';

import 'firebase/compat/analytics';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { getAuth } from "firebase/auth";
import { useCollectionData } from 'react-firebase-hooks/firestore';

const auth = getAuth();
const firestore = firebase.firestore();

const kanbanRef = firestore.collection('Tasks');

function useColumnDrop(
  column: ColumnType,
  handleDrop: (fromColumn: ColumnType, taskId: TaskModel['id']) => void,
) {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemType.TASK,
    drop: (dragItem) => {
      if (!dragItem || dragItem.from === column) {
        return;
      }
      
      handleDrop(dragItem.from, dragItem.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return {
    isOver,
    dropRef,
  };
}

export default useColumnDrop;
