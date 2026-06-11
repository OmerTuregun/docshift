interface Window {
  gapi: {
    load: (api: string, callback: () => void) => void;
  };
  google: {
    picker: {
      PickerBuilder: new () => {
        addView: (view: unknown) => GooglePickerBuilder;
        setOAuthToken: (token: string) => GooglePickerBuilder;
        setDeveloperKey: (key: string) => GooglePickerBuilder;
        setAppId: (id: string) => GooglePickerBuilder;
        setCallback: (cb: (data: GooglePickerCallback) => void) => GooglePickerBuilder;
        build: () => {
          setVisible: (visible: boolean) => void;
        };
      };
      DocsView: new () => {
        setMimeTypes: (types: string) => GoogleDocsView;
        setSelectFolderEnabled: (enabled: boolean) => GoogleDocsView;
      };
      Action: { PICKED: string };
    };
  };
}

interface GooglePickerBuilder {
  addView: (view: unknown) => GooglePickerBuilder;
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setAppId: (id: string) => GooglePickerBuilder;
  setCallback: (cb: (data: GooglePickerCallback) => void) => GooglePickerBuilder;
  build: () => {
    setVisible: (visible: boolean) => void;
  };
}

interface GoogleDocsView {
  setMimeTypes: (types: string) => GoogleDocsView;
  setSelectFolderEnabled: (enabled: boolean) => GoogleDocsView;
}

interface GooglePickerCallback {
  action: string;
  docs: {
    id: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
  }[];
}
