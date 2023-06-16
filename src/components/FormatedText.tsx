import ContentEditable, { ContentEditableEvent } from "react-contenteditable"
interface Props {
  htmlString: string;
  onEdit: (e: ContentEditableEvent) => void;
}


const FormatedText = ({ htmlString, onEdit }: Props) => {
  return <ContentEditable html={htmlString} onChange={onEdit} style={{ outline: "none" }} />
};

export default FormatedText;
