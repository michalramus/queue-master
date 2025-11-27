// SSE events names
export enum sseEvents {
    //clients module
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",

    //global settings module
    GlobalSettingsChanged = "GlobalSettingsChanged",

    ReloadFrontend = "ReloadFrontend",
}
