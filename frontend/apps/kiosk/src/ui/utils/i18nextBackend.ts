import { BackendModule, InitOptions, ReadCallback, Services } from "i18next";

class Backend implements BackendModule {
    type: "backend";
    static type: string;
    constructor(services: Services, options: unknown = {}, allOptions: InitOptions = {}) {
        this.type = "backend";
        this.init(services, options, allOptions);
    }

    init(_services: Services, _backendOptions: unknown = {}, _i18nextOptions: InitOptions = {}) {
        //empty
    }

    async read(language: string, _namespace: string, callback: ReadCallback) {
        const translation = await window.electronAPI.getTranslation(language);

        callback(null, translation);
    }
}

Backend.type = "backend";

export default Backend;
