import { Test, TestingModule } from "@nestjs/testing";
import { BuildService } from "./build.service";
import { LIST_INTERFACE } from "src/part/interface/database.interface";
import { PARSE_INTERFACE } from "src/part/interface/part.interface";
import { Products } from "@pc-builder/shared/part";

describe("BuildService", () => {
  let service: BuildService;
  let parseService: any;
  let partDatabase: any;

  beforeEach(async () => {
    parseService = {
      summary: jest.fn((item, product) => ({ id: item.id, name: item.name, product })),
      options: jest.fn((params, product) => ({ part: { id: params.id }, page: 1, limit: 10 })),
    };

    partDatabase = {
      list: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildService,
        {
          provide: PARSE_INTERFACE,
          useValue: parseService,
        },
        {
          provide: LIST_INTERFACE,
          useValue: partDatabase,
        },
      ],
    }).compile();

    service = module.get<BuildService>(BuildService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getPartDetails", () => {
    it("should fetch details for parts in the build and return them", async () => {
      const buildList = {
        [Products.CPU]: "cpu-123",
        [Products.GRAPHIC_CARD]: ["gpu-456"],
      };

      // Mock database calls
      partDatabase.list.mockImplementation((options: any) => {
        const ids = options.part.id;
        if (ids.includes("cpu-123")) {
          return Promise.resolve({
            list: [{ id: "cpu-123", part: Products.CPU, name: "Intel Core i7" }],
            total: 1,
          });
        }
        if (ids.includes("gpu-456")) {
          return Promise.resolve({
            list: [{ id: "gpu-456", part: Products.GRAPHIC_CARD, name: "Nvidia RTX 4070" }],
            total: 1,
          });
        }
        return Promise.resolve({ list: [], total: 0 });
      });

      const result = await service.getPartDetails(buildList);

      expect(partDatabase.list).toHaveBeenCalledTimes(2);
      expect(parseService.summary).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        [Products.CPU]: { id: "cpu-123", name: "Intel Core i7", product: Products.CPU },
        [Products.GRAPHIC_CARD]: [
          { id: "gpu-456", name: "Nvidia RTX 4070", product: Products.GRAPHIC_CARD },
        ],
      });
    });
  });

  describe("validate", () => {
    it("should run validation rules and return errors/missing issues if there are mismatches", async () => {
      const buildList = {
        [Products.CPU]: "cpu-1",
        [Products.MAIN]: "mobo-1",
      };

      // Mock database list to return incompatibilities
      partDatabase.list.mockImplementation((options: any) => {
        const ids = options.part.id;
        if (ids.includes("cpu-1")) {
          return Promise.resolve({
            list: [
              {
                id: "cpu-1",
                part: Products.CPU,
                // CPU has a socket of LGA1700
                socket: "LGA1700",
                core: {
                  socket: "LGA1700",
                },
              },
            ],
            total: 1,
          });
        }
        if (ids.includes("mobo-1")) {
          return Promise.resolve({
            list: [
              {
                id: "mobo-1",
                part: Products.MAIN,
                // Motherboard has socket of AM4
                socket: "AM4",
                board: {
                  socket: "AM4",
                },
              },
            ],
            total: 1,
          });
        }
        return Promise.resolve({ list: [], total: 0 });
      });

      const result = await service.validate(buildList);

      expect(result).toHaveProperty("products");
      expect(result).toHaveProperty("rules");
      expect(result).toHaveProperty("missing");
    });
  });

  describe("getSuitablePart", () => {
    it("should filter and retrieve list of suitable parts for a product category", async () => {
      const buildList = {
        [Products.CPU]: "cpu-1",
      };
      const params = { page: "1", limit: "10" };

      // Mock DB list for build details fetching
      partDatabase.list.mockImplementation((options: any) => {
        if (options.part?.id?.includes("cpu-1")) {
          return Promise.resolve({
            list: [
              {
                id: "cpu-1",
                part: Products.CPU,
                core: { socket: "LGA1700" },
              },
            ],
            total: 1,
          });
        }
        // DB list for target product search
        return Promise.resolve({
          list: [{ id: "mobo-1", part: Products.MAIN, name: "ASUS Prime" }],
          total: 1,
        });
      });

      const result = await service.getSuitablePart(Products.MAIN, buildList, params);

      expect(partDatabase.list).toHaveBeenCalledTimes(2);
      expect(result.list).toEqual([{ id: "mobo-1", name: "ASUS Prime", product: Products.MAIN }]);
      expect(result.total).toBe(1);
    });
  });
});
