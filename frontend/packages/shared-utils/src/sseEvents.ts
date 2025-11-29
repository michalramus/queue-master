//SSE events names
export enum sseEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",
    ClientsFlushed = "ClientsChanged",

    GlobalSettingsChanged = "GlobalSettingsChanged",
    MultilingualSettingsChanged = "MultilingualSettingsChanged",
    CategoriesChanged = "CategoriesChanged",
    OpeningHoursChanged = "OpeningHoursChanged",
    LogoAvailabilityChanged = "LogoAvailabilityChanged",
    UserSettingsChanged = "UserSettingsChanged",

    ReloadFrontend = "ReloadFrontend",
}
