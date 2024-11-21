import { Test, TestingModule } from "@nestjs/testing";
import { MultilingualTextService } from "./multilingual-text.service";

describe("MultilingualTextService", () => {
    let service: MultilingualTextService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MultilingualTextService],
        }).compile();

        service = module.get<MultilingualTextService>(MultilingualTextService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
