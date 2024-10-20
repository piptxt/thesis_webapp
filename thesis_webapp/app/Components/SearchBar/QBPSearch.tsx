"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useExtractedText } from "../Contexts/ExtractedTextContext";
import { ChangeEvent } from "react";

export default function QBPSearchBar() {
  const { setExtractedText } = useExtractedText();

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const data = await response.json();
        setExtractedText({
          title: "", // Customize this if needed
          category: "", // Customize this if needed
          body: data.text,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  return (
    <div className="mx-auto p-5">
      <form className="max-w-5xl min-h-2 mx-auto text-start">
        <div className="mb-2">
          <input
            type="file"
            accept="application/pdf"
            className="block w-full p-4 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            onChange={handleFileChange}
          />
        </div>
      </form>
    </div>
  );
}
