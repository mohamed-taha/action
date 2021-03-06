import {GraphQLObjectType} from 'graphql';
import meeting from './models/Meeting/meetingQuery';
import outcome from './models/Outcome/outcomeQuery';
import project from './models/Project/projectQuery';
import team from './models/Team/teamQuery';
import user from './models/User/userQuery';

const rootFields = Object.assign({},
  meeting,
  outcome,
  project,
  team,
  user
);

export default new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});
