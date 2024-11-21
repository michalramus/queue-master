// Websockets events names
export enum wsEvents {
    //clients module
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",

    //global settings module
    GlobalSettingsChanged = "GlobalSettingsChanged",
}
