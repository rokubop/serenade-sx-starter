#Requires AutoHotkey v2.0
#SingleInstance Force
; https://www.autohotkey.com/docs/v2/lib/SendMode.htm
; SendMode can be "Event", "Input", "InputThenPlay", or "Play"
SendMode "Input"
SetWorkingDir A_ScriptDir

ExecKeyPress(key, count, modifiers) {
    Loop (count) {
        for modifier in modifiers {
            SendInput("{" . modifier . " down}")
        }

        SendInput("{" . key . "}")

        for modifier in modifiers {
            SendInput("{" . modifier . " up}")
        }

        if (count > 1 && delayInterval > 0) {
            Sleep(delayInterval)
        }
    }
}

if (A_Args.Length > 0) {
    key := A_Args[1]
    count := A_Args[2] ? Integer(A_Args[2]) : 1
    delayInterval := A_Args[3] ? Integer(A_Args[3]) : 0
    modifiers := []
    for i, arg in A_Args
    {
        if (i > 3)
        {
            modifiers.Push(arg)
        }
    }
    ExecKeyPress(key, count, modifiers)
} else {
    MsgBox("pressKey.ahk: No arguments provided.")
}

ExitApp()