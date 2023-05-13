#Requires AutoHotkey v2.0
#SingleInstance Force
; https://www.autohotkey.com/docs/v2/lib/SendMode.htm
; SendMode can be "Event", "Input", "InputThenPlay", or "Play"
SendMode "Input"
SetWorkingDir A_ScriptDir

ExecKeyHold(key, duration, modifiers) {
    for modifier in modifiers {
        SendInput("{" . modifier . " down}")
    }
    SendInput("{" . key . " down}")

    Sleep(duration)

    SendInput("{" . key . " up}")
    for modifier in modifiers {
        SendInput("{" . modifier . " up}")
    }
}

if (A_Args.Length > 0) {
    key := A_Args[1]
    duration := A_Args[2] ? Integer(A_Args[2]) : 1
    modifiers := []
    for i, arg in A_Args
    {
        if (i > 2)
        {
            modifiers.Push(arg)
        }
    }
    ExecKeyHold(key, duration, modifiers)
} else {
    MsgBox("pressKey.ahk: No arguments provided.")
}

ExitApp()