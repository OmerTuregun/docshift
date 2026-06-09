import mammoth from "mammoth";
import { parseWord } from "@/lib/parsers/parseWord";

jest.mock("mammoth", () => ({
  __esModule: true,
  default: {
    extractRawText: jest.fn(),
  },
}));

const mockedExtractRawText = mammoth.extractRawText as jest.MockedFunction<
  typeof mammoth.extractRawText
>;

describe("parseWord", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns extracted text from mammoth", async () => {
    mockedExtractRawText.mockResolvedValue({
      value: "Hello DocShift",
      messages: [],
    });

    const result = await parseWord(Buffer.from("docx-content"));

    expect(mockedExtractRawText).toHaveBeenCalledWith({
      buffer: expect.any(Buffer),
    });
    expect(result).toEqual({ text: "Hello DocShift" });
  });
});
