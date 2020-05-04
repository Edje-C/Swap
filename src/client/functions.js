import {v4 as uuidv4} from 'uuid';
import passwordGenerator from 'generate-password';

export const generateApiToken = () => {
  return uuidv4();
}

export const generatePassword = () => {
  return passwordGenerator.generate({
    length: 16,
    numbers: true,
    strict: true
  });
}

export const copyToClipboard = (text) => {
  var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

export const ellipsisInCenter = (text, balance) => {
  if (text.length > ((balance * 2) + 5)) {
    return text.substring(0, balance) + '...' + text.substring(text.length - balance, text.length);
  }
  return text;
}