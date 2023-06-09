// import axios from "axios"

type Word = {
  word: string;
  index: number
}
interface Task {
  id: string;
  title: string;
  content: string;
  background: string;
  size: number;
  category: string;
  creationDate: Date;
  expirationDate: Date;
  isPinned: boolean;
  isHidden: boolean;
  boldWords: Word[];
  italicWords: Word[];
  underlinedWords: Word[];
  lineCrossedWords: Word[];
  [key: string]: any;
}

export function saveTask(id: string) {

}

export function updateTask(id: string) {

}
export function getTask(id: string) {

}
export function deleteTask(id: string) {

}