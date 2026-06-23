export interface MappingTrace {
  basic: Array<{
    rawKey: string;
    attribute: string;
    matchType: "exact" | "alias" | "fuzzy";
    matchScore: number;
  }>;
  info: Array<{
    rawKey: string;
    info: string;
    attribute: string;
    matchType: "exact" | "alias" | "fuzzy";
    matchScore: number;
  }>;
}

export interface MappedItem {
  index: number;
  data: Record<string, unknown>;
  parsed?: Record<string, unknown>;
  mappings?: MappingTrace;
}

export interface FailedItem {
  index: number;
  raw: Record<string, unknown>;
  error: unknown;
  parsed?: Record<string, unknown>;
  mappings?: MappingTrace;
}

export interface MapperResult {
  success: boolean;
  mappedCount: number;
  failedCount: number;
  mapped: MappedItem[];
  failed: FailedItem[];
}

export interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface KeyValueRow {
  key: string;
  value: string;
}
