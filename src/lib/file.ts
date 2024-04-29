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

type FileSizeOptions = {
	source: number | Blob;
	digit?: number;
};

const UNIT = ["B", "KB", "MB", "GB", "TB", "PB"];

export function fileSize({ source, digit = 2 }: FileSizeOptions) {
	let bytes = typeof source === "number" ? source : source.size;
	let count = 0;

	while (bytes >= 1024 && count < UNIT.length) {
		bytes /= 1024;
		++count;
	}

	return [bytes.toFixed(digit), UNIT[count]].join(" ");
}
