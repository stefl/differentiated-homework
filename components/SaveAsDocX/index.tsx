import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import { saveAs } from "file-saver";
import { useCallback } from "react";
import { TfiDownload } from "react-icons/tfi";
const processor = unified().use(markdown).use(docx, { output: "blob" });

export const SaveAsDocX = ({ markdown }: { markdown: string }) => {
  const handleDownload = useCallback(async () => {
    const doc = await processor.process(markdown);
    const blob = await doc.result;
    saveAs(blob, "example.docx");
  }, [markdown]);

  return (
    <button
      className="px-4 py-2 border-gray-400 border rounded hover:bg-white text-sm"
      onClick={(e) => {
        e.preventDefault();
        handleDownload();
      }}
    >
      Download Word doc
    </button>
  );
};
