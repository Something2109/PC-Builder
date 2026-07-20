import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { ArticleStatus } from "@pc-builder/shared/article";

import { ArticleService } from "./article.service";

describe("ArticleService", () => {
  let service: ArticleService;
  let modelMock: any;

  // Helper class to mock Mongoose query chaining
  class MockQuery {
    constructor(private resolveValue: any) {}
    select = jest.fn().mockReturnThis();
    sort = jest.fn().mockReturnThis();
    skip = jest.fn().mockReturnThis();
    limit = jest.fn().mockReturnThis();
    exec = jest.fn().mockImplementation(() => Promise.resolve(this.resolveValue));
    then = jest
      .fn()
      .mockImplementation((onfulfilled: any) =>
        Promise.resolve(this.resolveValue).then(onfulfilled)
      );
  }

  const createMockDocument = (data: any) => {
    const doc: any = {
      author: "admin",
      content: [],
      ...data,
      toJSON: jest.fn().mockImplementation(function (this: any) {
        return {
          _id: this._id || "64b73b5e4a5d893f412c98a5",
          author: this.author || "admin",
          content: this.content || [],
          ...this,
        };
      }),
      set: jest.fn().mockImplementation(function (this: any, updates: any) {
        Object.assign(this, updates);
        return this;
      }),
      save: jest.fn().mockImplementation(function (this: any) {
        return Promise.resolve(this);
      }),
      deleteOne: jest.fn().mockResolvedValue(true),
    };
    return doc;
  };

  beforeEach(async () => {
    modelMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getModelToken("article"),
          useValue: modelMock,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("list", () => {
    it("should return a list of article summaries", async () => {
      const criteria = {
        page: 1,
        limit: 10,
        topic: "guides",
      };

      const mockData = [
        {
          _id: "64b73b5e4a5d893f412c98a5",
          slug: "test-article",
          title: "Test Article",
          author: "admin",
          standfirst: "Just a test",
          createdAt: new Date(),
          status: ArticleStatus.Published,
          topic: ["guides"],
          part: [],
          content: [],
        },
      ];

      const mockDocs = mockData.map(createMockDocument);
      modelMock.find.mockReturnValue(new MockQuery(mockDocs));

      const result = await service.list(criteria);

      expect(modelMock.find).toHaveBeenCalledWith({
        topic: "guides",
        status: ArticleStatus.Published,
      });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Test Article");
    });
  });

  describe("getByIdOrSlug", () => {
    it("should find by ID if a valid Mongo ID is provided", async () => {
      const id = "64b73b5e4a5d893f412c98a5";
      const mockDoc = createMockDocument({
        _id: id,
        slug: "test-article",
        title: "Test Article",
        author: "admin",
        standfirst: "Just a test",
        createdAt: new Date(),
        status: ArticleStatus.Published,
        topic: [],
        part: [],
        content: [],
      });

      modelMock.findOne.mockResolvedValue(mockDoc);
      modelMock.updateOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(true) });

      const result = await service.getByIdOrSlug(id);

      expect(modelMock.findOne).toHaveBeenCalledWith({ _id: id });
      expect(result?.title).toBe("Test Article");
    });

    it("should find by slug if not a valid Mongo ID", async () => {
      const slug = "test-article";
      const mockDoc = createMockDocument({
        _id: "64b73b5e4a5d893f412c98a5",
        slug,
        title: "Test Article",
        author: "admin",
        standfirst: "Just a test",
        createdAt: new Date(),
        status: ArticleStatus.Published,
        topic: [],
        part: [],
        content: [],
      });

      modelMock.findOne.mockResolvedValue(mockDoc);
      modelMock.updateOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(true) });

      const result = await service.getByIdOrSlug(slug);

      expect(modelMock.findOne).toHaveBeenCalledWith({ slug });
      expect(result?.title).toBe("Test Article");
    });

    it("should return null if article is draft and preview is not allowed", async () => {
      const slug = "draft-article";
      const mockDoc = createMockDocument({
        _id: "64b73b5e4a5d893f412c98a5",
        slug,
        title: "Draft Article",
        author: "admin",
        standfirst: "Just a test",
        createdAt: new Date(),
        status: ArticleStatus.Draft,
        topic: [],
        part: [],
        content: [],
      });

      modelMock.findOne.mockResolvedValue(mockDoc);

      const result = await service.getByIdOrSlug(slug, false);

      expect(result).toBeNull();
    });

    it("should return article if draft and preview is allowed", async () => {
      const slug = "draft-article";
      const mockDoc = createMockDocument({
        _id: "64b73b5e4a5d893f412c98a5",
        slug,
        title: "Draft Article",
        author: "admin",
        standfirst: "Just a test",
        createdAt: new Date(),
        status: ArticleStatus.Draft,
        topic: [],
        part: [],
        content: [],
      });

      modelMock.findOne.mockResolvedValue(mockDoc);

      const result = await service.getByIdOrSlug(slug, true);

      expect(result?.title).toBe("Draft Article");
    });
  });

  describe("create", () => {
    it("should create article and ensure unique slug", async () => {
      const dto = {
        title: "Unique Article Title",
        standfirst: "First stand",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      };

      const mockDoc = createMockDocument({
        _id: "64b73b5e4a5d893f412c98a5",
        slug: "unique-article-title",
        createdAt: new Date(),
        ...dto,
      });

      modelMock.findOne.mockResolvedValueOnce(null); // No pre-existing slug
      modelMock.create.mockResolvedValue(mockDoc);

      const result = await service.create(dto);

      expect(modelMock.findOne).toHaveBeenCalledWith({ slug: "unique-article-title" });
      expect(modelMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: "unique-article-title",
          title: "Unique Article Title",
        })
      );
      expect(result.slug).toBe("unique-article-title");
    });

    it("should append a counter to slug if it already exists", async () => {
      const dto = {
        title: "Duplicate Title",
        standfirst: "First stand",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      };

      const mockDoc = createMockDocument({
        _id: "64b73b5e4a5d893f412c98a5",
        slug: "duplicate-title-1",
        createdAt: new Date(),
        ...dto,
      });

      modelMock.findOne
        .mockResolvedValueOnce({ _id: "other-id" }) // slug "duplicate-title" exists
        .mockResolvedValueOnce(null); // slug "duplicate-title-1" is available
      modelMock.create.mockResolvedValue(mockDoc);

      const result = await service.create(dto);

      expect(modelMock.findOne).toHaveBeenCalledTimes(2);
      expect(result.slug).toBe("duplicate-title-1");
    });
  });

  describe("update", () => {
    it("should update article and save", async () => {
      const id = "64b73b5e4a5d893f412c98a5";
      const dto = {
        title: "Updated Title",
        standfirst: "Updated standfirst",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      };

      const mockDoc = createMockDocument({
        _id: id,
        slug: "original-slug",
        createdAt: new Date(),
        title: "Original Title",
        standfirst: "Original standfirst",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      });

      modelMock.findById.mockResolvedValue(mockDoc);

      const result = await service.update(id, dto);

      expect(modelMock.findById).toHaveBeenCalledWith(id);
      expect(mockDoc.set).toHaveBeenCalled();
      expect(mockDoc.save).toHaveBeenCalled();
      expect(result?.title).toBe("Updated Title");
    });

    it("should return null if article not found", async () => {
      modelMock.findById.mockResolvedValue(null);
      const result = await service.update("64b73b5e4a5d893f412c98a5", {
        title: "Test",
        standfirst: "Test",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      });
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should find and delete article", async () => {
      const id = "64b73b5e4a5d893f412c98a5";
      const mockDoc = createMockDocument({
        _id: id,
        slug: "test-slug",
        createdAt: new Date(),
        title: "Test Title",
        standfirst: "Test standfirst",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      });

      modelMock.findById.mockResolvedValue(mockDoc);

      const result = await service.delete(id);

      expect(modelMock.findById).toHaveBeenCalledWith(id);
      expect(mockDoc.deleteOne).toHaveBeenCalled();
      expect(result?.title).toBe("Test Title");
    });
  });

  describe("publish", () => {
    it("should set status to Published and set publishedAt date", async () => {
      const id = "64b73b5e4a5d893f412c98a5";
      const mockDoc = createMockDocument({
        _id: id,
        slug: "test-slug",
        createdAt: new Date(),
        title: "Test Title",
        standfirst: "Test standfirst",
        content: [],
        topic: [],
        part: [],
        status: ArticleStatus.Draft,
      });

      modelMock.findById.mockResolvedValue(mockDoc);

      const result = await service.publish(id);

      expect(mockDoc.status).toBe(ArticleStatus.Published);
      expect(mockDoc.publishedAt).toBeInstanceOf(Date);
      expect(mockDoc.save).toHaveBeenCalled();
      expect(result?.status).toBe(ArticleStatus.Published);
    });
  });
});
