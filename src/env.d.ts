// add ts intellisense for process.env
declare namespace NodeJS {
  interface ProcessEnv {
    ROOT_DIR: string;
    AUTOHOTKEY_V1_EXE_PATH?: string;
    AUTOHOTKEY_V2_EXE_PATH?: string;
    VSCODE_WORKSPACE_PATH?: string;
  }
}
