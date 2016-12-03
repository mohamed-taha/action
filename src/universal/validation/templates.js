import {compositeIdRegex, idRegex} from 'universal/validation/regex';
import emailAddresses from 'email-addresses';

export const compositeId = (value) => value.matches(compositeIdRegex);
export const fullName = (value) => value
  .trim()
  .min(1, 'It looks like you wanted to include a name')
  .max(200, 'That name looks too long!');
export const id = (value) => value.matches(idRegex);
export const task = (value) => value
  .trim()
  .min(2, 'That doesn\'t seem like much of a task')
  .max(100, 'Try shortening down the task name');
export const inviteesRaw = (value) => value
  .test((inviteesRaw) => {
    if (!inviteesRaw) return undefined;
    const parsedAddresses = emailAddresses.parseAddressList(inviteesRaw);
    if (!parsedAddresses) {
      let i = inviteesRaw.lastIndexOf(',');
      while (i > 0) {
        const lastGoodString = inviteesRaw.substr(0, i);
        const parseable = emailAddresses.parseAddressList(lastGoodString);
        if (parseable) {
          const startingIdx = lastGoodString.lastIndexOf(',') + 1;
          return `Problem parsing email after ${lastGoodString.substr(startingIdx)}`;
        }
        i = lastGoodString.lastIndexOf(',');
      }
      return 'That first email doesn\'t look right';
    }
    return undefined;
  });
export const teamName = (value) => value
  .trim()
  .required('"The nameless wonder" is better than nothing')
  .min(2, 'The "A Team" had a longer name than that')
  .max(50, 'That isn\'t very memorable. Maybe shorten it up?');
