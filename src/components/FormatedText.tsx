import { useState, useEffect,Fragment } from "react";

type Word = {
  word: string;
  index: number;
};

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
}

interface Props {
  task: Task;
}

const FormatedText = ({ task }: Props) => {
  const [component, setComponent] = useState<string[]>();

  function areEqual(word1: Word, word2: Word): boolean {
    return (word1.word === word2.word && word1.index === word2.index);
  }

  function isExist(word: Word, key: keyof Task): boolean {
    const words = task[key];
    if (words instanceof Array) {
      for (const w of words) {
        if (areEqual(word, w)) {
          return true;
        }
      }
    }
    return false;
  }

  const tags: (keyof Task)[] = ["boldWords", "italicWords", "underlinedWords", "lineCrossedWords"];
  useEffect(() => {
    setComponent(task.content.split(" "));
  }, [task.content]);
  return <div>{
    component?.map((word, index) => {
      if (isExist({ word, index }, tags[0])) return <b key={index}> {word} </b>;
      if (isExist({ word, index }, tags[1])) return <i key={index}> {word} </i>;
      if (isExist({ word, index }, tags[2])) return <u key={index}> {word} </u>;
      if (isExist({ word, index }, tags[3])) return <del key={index}> {word} </del>;
      return <Fragment key={index}> {word} </Fragment>;
    })}</div>;
};

export default FormatedText;
