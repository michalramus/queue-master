//Websocket events names
export enum wsEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",

    GlobalSettingsChanged = "GlobalSettingsChanged",

    ReloadFrontend = "ReloadFrontend",
}
