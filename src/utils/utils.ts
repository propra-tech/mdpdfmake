import { decode } from "html-entities";

export const cleanUnicodefromText = (text: string) => decode(text);
