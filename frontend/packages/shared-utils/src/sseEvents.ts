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
    CategoriesDesksChanged = "CategoriesDesksChanged", //changes in categories to desks assignment
    DesksChanged = "DesksChanged",
    OpeningHoursChanged = "OpeningHoursChanged",
    LogoAvailabilityChanged = "LogoAvailabilityChanged",
    UserSettingsChanged = "UserSettingsChanged",

    UserChanged = "UserChanged",

    ReloadFrontend = "ReloadFrontend",
}
