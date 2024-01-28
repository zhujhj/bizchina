import { ColumnType } from './enums';

export interface TaskModel {
  id: string;
  title: string;
  column: ColumnType;
  color: string;
  to: string;
  from: string;
  deadline: Date;
}

export interface BookmarkModel {
  id: string;
  titleInput: string;
  linkInput: string;
  icon: string;
}

export interface DragItem {
  index: number;
  id: TaskModel['id'];
  from: ColumnType;
}
