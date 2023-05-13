import sx, { commandMap } from "sx/sx";
import { forEachKeyVal, CommandID } from "sx/utils";

// WIP. There may be some bugs in this file. Not fully tested.

export const suspendAllCommands = () => {
  let commandIds = [] as CommandID[];

  forEachKeyVal(commandMap, (commandId, command) => {
    if (command.isEnabled) {
      commandIds.push(commandId);
    }
    command.isSupended = true;
  });

  sx.global().disable(commandIds);
};

export const resumeAllCommands = () => {
  let commandIds = [] as CommandID[];

  forEachKeyVal(commandMap, (commandId, command) => {
    if (command.isEnabled) {
      commandIds.push(commandId);
    }
    command.isSupended = false;
  });

  sx.global().enable(commandIds);
};

const setCommandStateSelectively = (
  commandId: CommandID,
  triggers: string | string[],
  enable: boolean
) => {
  const toDisable = [] as CommandID[];
  const toEnable = [] as CommandID[];

  forEachKeyVal(commandMap, (id, command) => {
    if (triggers.includes(command.trigger)) {
      if (id === commandId) {
        enable ? toEnable.push(id) : toDisable.push(id);
        command.isEnabled = enable;
        if (command.isSupended) {
          command.isSupended = false;
        }
      } else {
        if (command.isEnabled) {
          // only change states of commands that are/were enabled
          enable ? toDisable.push(id) : toEnable.push(id);
        }
        command.isSupended = enable;
      }
    }
  });

  if (toDisable.length) {
    sx.global().disable(toDisable);
  }
  if (toEnable.length) {
    sx.global().enable(toEnable);
  }
};

export const selectivelyEnableCommands = (
  commandId: CommandID,
  triggers: string | string[]
) => {
  setCommandStateSelectively(commandId, triggers, true);
};

export const selectivelyDisableCommands = (
  commandId: CommandID,
  triggers: string | string[]
) => {
  setCommandStateSelectively(commandId, triggers, false);
};

export const suspendCommands = (triggers: string | string[]) => {
  setSuspendedState(triggers, true);
};

export const resumeCommands = (triggers: string | string[]) => {
  setSuspendedState(triggers, false);
};

function setSuspendedState(triggers: string | string[], state: boolean) {
  let commandIds = [] as CommandID[];

  forEachKeyVal(commandMap, (commandId, command) => {
    if (triggers.includes(command.trigger)) {
      if (command.isEnabled) {
        commandIds.push(commandId);
      }
      command.isSupended = state;
    }
  });

  if (commandIds.length) {
    console.log("set suspended state ", commandIds, state);
    sx.global()[state ? "disable" : "enable"](commandIds);
  }
}
