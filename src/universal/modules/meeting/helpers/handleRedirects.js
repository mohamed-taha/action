import {
  AGENDA_ITEMS,
  LOBBY,
  FIRST_CALL,
  SUMMARY,
  phaseOrder
} from 'universal/utils/constants';
import makePushURL from './makePushURL';
import isSkippingAhead from './isSkippingAhead';
import hasPhaseItem from './hasPhaseItem';

export default function handleRedirects(oldProps, nextProps) {
  const {agenda, localPhaseItem, router, params: {localPhase}, team} = nextProps;
  const {agenda: oldAgenda, team: oldTeam} = oldProps;
  /* DEBUG: uncomment below */
  // console.log(`handleRedirects(${JSON.stringify(team)}, ${localPhase}, ${localPhaseItem}, ...)`);
  const {facilitatorPhase, facilitatorPhaseItem, meetingPhase, id: teamId, meetingId} = team;

  // bail out fast while we're waiting for the team sub
  if (!teamId) return false;

  // DEBUGGING
  // if no phase given, goto the facilitator
  if (!localPhase) {
    const pushURL = makePushURL(teamId, facilitatorPhase, facilitatorPhaseItem);
    router.replace(pushURL);
    return false;
  }
  if (hasPhaseItem(localPhase)) {
    // the url should have a phase item
    if (isNaN(localPhaseItem)) {
      // if the url doesn't have a phase item, but they wanna go where the facilitator is, put them in sync
      if (facilitatorPhase === localPhase) {
        const pushURL = makePushURL(teamId, facilitatorPhase, facilitatorPhaseItem);
        router.replace(pushURL);
        return false;
      }
      // if they wanna go somewhere that the facilitator isn't take them to the beginning (url is 1-indexed)
      const pushURL = makePushURL(teamId, localPhase, 1);
      router.replace(pushURL);
      return false;
    }
  } else if (localPhaseItem !== undefined && isNaN(localPhaseItem)) {
    // if the url has a phase item that it shouldn't
    const pushURL = makePushURL(teamId, facilitatorPhase, facilitatorPhaseItem);
    router.replace(pushURL);
    return false;
  }

  // don't let anyone in the lobby after the meeting has started
  if (localPhase === LOBBY && meetingId) {
    const pushURL = makePushURL(teamId, facilitatorPhase, facilitatorPhaseItem);
    router.replace(pushURL);
    return false;
  }

  // don't let anyone skip to the next phase
  // TODO if the facilitator SOMEHOW skips ahead, it goes here we enter an infinite loop
  if (isSkippingAhead(localPhase, meetingPhase)) {
    const pushURL = makePushURL(teamId, facilitatorPhase, facilitatorPhaseItem);
    router.replace(pushURL);
    return false;
  }

  // don't let users go back to an agenda soundoff, take them to the agenda processing
  if (localPhase === FIRST_CALL && phaseOrder(meetingPhase) > phaseOrder(localPhase)) {
    const pushURL = makePushURL(teamId, facilitatorPhase, facilitatorPhaseItem);
    router.replace(pushURL);
    return false;
  }

  // is the facilitator making moves?
  if (team.facilitatorPhaseItem !== oldTeam.facilitatorPhaseItem ||
    team.facilitatorPhase !== oldTeam.facilitatorPhase) {
    // were we n'sync?
    const inSync = localPhase === oldTeam.facilitatorPhase &&
      (localPhaseItem === undefined || localPhaseItem === oldTeam.facilitatorPhaseItem);
    if (inSync) {
      const pushURL = makePushURL(team.id, team.facilitatorPhase, team.facilitatorPhaseItem);
      router.replace(pushURL);
      return false;
    }
  }
  if (team.facilitatorPhase === SUMMARY) {
    router.replace(`/summary/${team.meetingId}`);
    return false;
  }

  // check sort order for agenda items
  if (localPhase === AGENDA_ITEMS) {
    const oldAgendaItem = oldAgenda[localPhaseItem - 1];
    if (!oldAgendaItem) {
      return false;
    }
    const newAgendaItem = agenda[localPhaseItem - 1];
    if (!newAgendaItem || newAgendaItem.id !== oldAgendaItem.id) {
      const updatedAgendaItemIdx = agenda.findIndex((a) => a.id === oldAgendaItem.id);
      if (updatedAgendaItemIdx !== -1) {
        const pushURL = makePushURL(team.id, AGENDA_ITEMS, updatedAgendaItemIdx + 1);
        router.replace(pushURL);
        return false;
      }
    }
  }

  return true;

  /**
   * For agenda items, the localPhase should point to the sortOrder
   * This works great for all cases, except when someone skipped to a future agenda item & then its sort order changes
   * In that event, the url should change, but the content shouldn't
   * so, when we get new props we should have logic that sees if the underlying ID has changed
   * or conversely, if the person is not in sync, then redirect them to the sortOrder of where they were
   */
}
