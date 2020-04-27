import uuid from 'uuid';
import passwordGenerator from 'generate-password';


export const generateApiToken = () => {
  return uuid.v4();
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

export const parseCookies = () => {
  const cookies = {};
  const cookieStrings =  document.cookie && document.cookie.split(';');

  if(!cookieStrings) {
    return cookies
  }

  cookieStrings.forEach(cookieString => {
    const cookieProperties = cookieString.split('=');
    const key = cookieProperties[0].trim();
    const value = cookieProperties[1].trim()

    cookies[key] = value;
  });

  return cookies
}

export const ellipsisInCenter = (text, balance) => {
  if (text.length > ((balance * 2) + 5)) {
    return text.substring(0, balance) + '...' + text.substring(text.length - balance, text.length);
  }
  return text;
}