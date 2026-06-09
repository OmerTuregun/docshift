import { toJson } from "@/lib/converters/toJson";

describe("toJson", () => {
  it("returns a formatted JSON string", () => {
    const input = { name: "test", value: 42 };

    const result = toJson(input);

    expect(result).toBe(
      JSON.stringify(
        {
          name: "test",
          value: 42,
        },
        null,
        2,
      ),
    );
    expect(JSON.parse(result)).toEqual(input);
  });
});
