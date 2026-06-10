/** @jest-environment node */

import bcrypt from "bcryptjs";
import {
  deleteApiKey,
  generateApiKey,
  validateApiKey,
} from "@/lib/db/apiKeys";
import pool from "@/lib/db/pool";

jest.mock("@/lib/db/pool", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockedQuery = pool.query as jest.Mock;

describe("apiKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generateApiKey returns a key starting with ds_live_", async () => {
    mockedQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "key-1",
          user_id: 1,
          name: "Test",
          key_prefix: "ds_live_abc1...",
          last_used_at: null,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      rowCount: 1,
      command: "INSERT",
      oid: 0,
      fields: [],
    });

    const { key, record } = await generateApiKey("1", "Test");

    expect(key.startsWith("ds_live_")).toBe(true);
    expect(record.name).toBe("Test");
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO api_keys"),
      expect.arrayContaining([1, "Test", expect.any(String), expect.any(String)]),
    );
  });

  it("validateApiKey returns false for wrong key", async () => {
    const hash = await bcrypt.hash("ds_live_wrongkey123", 10);

    mockedQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "key-1",
          user_id: 1,
          key_hash: hash,
        },
      ],
      rowCount: 1,
      command: "SELECT",
      oid: 0,
      fields: [],
    });

    const result = await validateApiKey("ds_live_notmatching");

    expect(result).toEqual({ valid: false });
  });

  it("deleteApiKey sets is_active to false", async () => {
    mockedQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 1,
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    await deleteApiKey("key-1", "1");

    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining("SET is_active = false"),
      ["key-1", 1],
    );
  });
});
