type HeadlessFilePickerOptions = {
  accept: HTMLInputElement["accept"];
  multiple: HTMLInputElement["multiple"];
};

export async function headlessFilePicker({
  accept = "*",
  multiple = false,
}: HeadlessFilePickerOptions) {
  return new Promise<FileList>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;

    input.onchange = () => {
      if (input.files) {
        resolve(input.files);
      } else {
        reject("No files selected");
      }
      input.remove();
    };
    input.click();
  });
}
