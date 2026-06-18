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
    CategoriesDesksChanged = "CategoriesDesksChanged",
    DesksChanged = "DesksChanged",
    OpeningHoursChanged = "OpeningHoursChanged",
    LogoAvailabilityChanged = "LogoAvailabilityChanged",
    UserSettingsChanged = "UserSettingsChanged",

    UserChanged = "UserChanged",

    ReloadFrontend = "ReloadFrontend",
}
