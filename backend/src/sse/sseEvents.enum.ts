// SSE events names
export enum sseEvents {
    //clients module
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",
    ClientsFlushed = "ClientsFlushed",

    //global settings module
    GlobalSettingsChanged = "GlobalSettingsChanged",
    MultilingualSettingsChanged = "MultilingualSettingsChanged",

    // frontend cache-invalidation events
    CategoriesChanged = "CategoriesChanged",
    OpeningHoursChanged = "OpeningHoursChanged",
    LogoAvailabilityChanged = "LogoAvailabilityChanged",
    UserSettingsChanged = "UserSettingsChanged",

    ReloadFrontend = "ReloadFrontend",
}
