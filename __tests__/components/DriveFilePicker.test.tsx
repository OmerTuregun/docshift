import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DriveFilePicker from "@/components/DriveFilePicker";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/components/Toast", () => ({
  showToast: jest.fn(),
}));

import { useSession } from "next-auth/react";

const mockedUseSession = useSession as jest.Mock;

describe("DriveFilePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.gapi = {
      load: (_api: string, callback: () => void) => callback(),
    };

    window.google = {
      picker: {
        PickerBuilder: jest.fn().mockImplementation(() => {
          const builder = {
            addView: jest.fn().mockReturnThis(),
            setOAuthToken: jest.fn().mockReturnThis(),
            setDeveloperKey: jest.fn().mockReturnThis(),
            setAppId: jest.fn().mockReturnThis(),
            setCallback: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue({
              setVisible: jest.fn(),
            }),
          };

          return builder;
        }),
        DocsView: jest.fn().mockImplementation(() => ({
          setMimeTypes: jest.fn().mockReturnThis(),
          setSelectFolderEnabled: jest.fn().mockReturnThis(),
        })),
        Action: { PICKED: "picked" },
      },
    };

    process.env.NEXT_PUBLIC_GOOGLE_API_KEY = "test-api-key";
    process.env.NEXT_PUBLIC_GOOGLE_APP_ID = "123456";
  });

  it("renders null when not logged in", () => {
    mockedUseSession.mockReturnValue({ data: null });

    const { container } = render(
      <DriveFilePicker onFileSelected={jest.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("disables button when picker is not loaded", () => {
    mockedUseSession.mockReturnValue({ data: { user: { id: "1" } } });
    delete (window as Partial<Window>).google;

    render(<DriveFilePicker onFileSelected={jest.fn()} />);

    expect(screen.getByRole("button", { name: /Drive'dan Seç/i })).toBeDisabled();
  });

  it("renders button when session exists and picker is loaded", async () => {
    mockedUseSession.mockReturnValue({ data: { user: { id: "1" } } });

    render(<DriveFilePicker onFileSelected={jest.fn()} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Drive'dan Seç/i }),
      ).not.toBeDisabled();
    });
  });

  it("initializes picker on click", async () => {
    mockedUseSession.mockReturnValue({ data: { user: { id: "1" } } });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ accessToken: "picker-token" }),
    }) as jest.Mock;

    render(<DriveFilePicker onFileSelected={jest.fn()} />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Drive'dan Seç/i }),
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Drive'dan Seç/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/drive/token");
      expect(window.google.picker.PickerBuilder).toHaveBeenCalled();
    });
  });
});
