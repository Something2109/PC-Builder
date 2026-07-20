import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Products } from "@pc-builder/shared/part";

import { CRUD_INTERFACE, LIST_INTERFACE } from "./interface/database.interface";
import { PARSE_INTERFACE } from "./interface/part.interface";
import { PartService } from "./part.service";

describe("PartService", () => {
  let service: PartService;
  let parseService: any;
  let listService: any;
  let crudService: any;

  beforeEach(async () => {
    parseService = {
      options: jest.fn(),
      summary: jest.fn(),
      attributes: jest.fn(),
      filter: jest.fn(),
    };

    listService = {
      list: jest.fn(),
      filter: jest.fn(),
    };

    crudService = {
      create: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartService,
        {
          provide: PARSE_INTERFACE,
          useValue: parseService,
        },
        {
          provide: LIST_INTERFACE,
          useValue: listService,
        },
        {
          provide: CRUD_INTERFACE,
          useValue: crudService,
        },
      ],
    }).compile();

    service = module.get<PartService>(PartService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("list", () => {
    it("should retrieve options, call database list, map summaries, and return total", async () => {
      const params = { page: "1", limit: "5" };
      const product = Products.CPU;
      const mockOptions = { page: 1, limit: 5 };
      const mockRawPart = { id: "cpu-1", part: Products.CPU };
      const mockSummaryPart = { id: "cpu-1", name: "Ryzen 5" };

      parseService.options.mockReturnValue(mockOptions);
      listService.list.mockResolvedValue({ list: [mockRawPart], total: 1 });
      parseService.summary.mockReturnValue(mockSummaryPart);

      const result = await service.list(params, product);

      expect(parseService.options).toHaveBeenCalledWith(params, product);
      expect(listService.list).toHaveBeenCalledWith(mockOptions, expect.any(Object));
      expect(parseService.summary).toHaveBeenCalledWith(mockRawPart, product);
      expect(result).toEqual({ list: [mockSummaryPart], total: 1 });
    });
  });

  describe("filter", () => {
    it("should retrieve options, retrieve mapping, query list service filter, and return parsed filters", async () => {
      const params = { brand: "AMD" };
      const product = Products.CPU;
      const mockOptions = { part: { part: [Products.CPU] } };
      const mockMapping = { socket: ["socket"] };
      const mockRawFilterResult = { socket: ["AM4", "AM5"] };
      const mockParsedFilter = { socket: ["AM4", "AM5"] };

      parseService.options.mockReturnValue({ part: {} });
      parseService.attributes.mockReturnValue(mockMapping);
      listService.filter.mockResolvedValue(mockRawFilterResult);
      parseService.filter.mockReturnValue(mockParsedFilter);

      const result = await service.filter(params, product, "socket");

      expect(parseService.options).toHaveBeenCalledWith(params, product);
      expect(parseService.attributes).toHaveBeenCalledWith(["socket"], product);
      expect(listService.filter).toHaveBeenCalledWith(mockOptions, mockMapping);
      expect(parseService.filter).toHaveBeenCalledWith(mockRawFilterResult, product, "socket");
      expect(result).toEqual(mockParsedFilter);
    });
  });

  describe("create", () => {
    it("should call CRUD create and return the created instance", async () => {
      const product = Products.CPU;
      const data = { id: "cpu-1", name: "Ryzen 5" } as any;
      const mockInstance = { id: "cpu-1", part: Products.CPU, name: "Ryzen 5" };

      crudService.create.mockResolvedValue(mockInstance);

      const result = await service.create(product, data);

      expect(crudService.create).toHaveBeenCalledWith(
        { ...data, part: product },
        expect.any(Object)
      );
      expect(result).toEqual(mockInstance);
    });

    it("should throw BadRequestException on CRUD errors", async () => {
      crudService.create.mockRejectedValue(new Error("Validation failed"));

      await expect(service.create(Products.CPU, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe("get", () => {
    it("should return the instance when id and product match", async () => {
      const mockInstance = { id: "cpu-1", part: Products.CPU };
      crudService.get.mockResolvedValue(mockInstance);

      const result = await service.get("cpu-1", Products.CPU);

      expect(crudService.get).toHaveBeenCalledWith("cpu-1", expect.any(Object));
      expect(result).toEqual(mockInstance);
    });

    it("should return null if the found product category does not match", async () => {
      const mockInstance = { id: "cpu-1", part: Products.GPU };
      crudService.get.mockResolvedValue(mockInstance);

      const result = await service.get("cpu-1", Products.CPU);

      expect(result).toBeNull();
    });

    it("should return null if part does not exist", async () => {
      crudService.get.mockResolvedValue(null);

      const result = await service.get("unknown-id", Products.CPU);

      expect(result).toBeNull();
    });
  });

  describe("set", () => {
    it("should update a part successfully", async () => {
      const id = "cpu-1";
      const product = Products.CPU;
      const data = { name: "New Name" } as any;
      const mockInstance = { id, part: product };
      const mockUpdatedInstance = { id, part: product, name: "New Name" };

      crudService.get.mockResolvedValue(mockInstance);
      crudService.set.mockResolvedValue(mockUpdatedInstance);

      const result = await service.set(id, product, data);

      expect(crudService.get).toHaveBeenCalledWith(id);
      expect(crudService.set).toHaveBeenCalledWith(id, data, expect.any(Object));
      expect(result).toEqual(mockUpdatedInstance);
    });

    it("should return null if trying to edit a part under a different product category", async () => {
      const id = "cpu-1";
      const product = Products.CPU;
      const mockInstance = { id, part: Products.GPU }; // Mismatched category

      crudService.get.mockResolvedValue(mockInstance);

      const result = await service.set(id, product, {} as any);

      expect(result).toBeNull();
      expect(crudService.set).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete the part if category matches", async () => {
      const id = "cpu-1";
      const product = Products.CPU;
      const mockInstance = { id, part: product };

      crudService.get.mockResolvedValue(mockInstance);
      crudService.delete.mockResolvedValue(mockInstance);

      const result = await service.delete(id, product);

      expect(crudService.get).toHaveBeenCalledWith(id);
      expect(crudService.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockInstance);
    });

    it("should return null if trying to delete a part under a different category", async () => {
      const id = "cpu-1";
      const product = Products.CPU;
      const mockInstance = { id, part: Products.GPU }; // Mismatch

      crudService.get.mockResolvedValue(mockInstance);

      const result = await service.delete(id, product);

      expect(result).toBeNull();
      expect(crudService.delete).not.toHaveBeenCalled();
    });
  });
});
