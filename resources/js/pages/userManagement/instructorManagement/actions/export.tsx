import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface ExportProps {
  searchVal?: string;
  sorting?: any[]; // tanstack sorting state
  onExport?: (format: string) => void;
}

export default function ExportInstructors({ searchVal = "", sorting = [], onExport }: ExportProps) {
  const [processing, setProcessing] = useState(false);

  const pickExportType = async (type: "pdf" | "csv" | "xlsx") => {
    setProcessing(true);

    // Normalize sorting: take first sort if available
    const sort = sorting?.[0] ?? {};
    const payload = {
      searchVal: searchVal ?? "",
      sortBy: sort.id ?? "",
      sortDir: !!sort.desc, // true if descending
      exportType: type,
    };

    try {
      const response = await axios.post("/user-management/instructor/export", payload, {
        responseType: "blob",
        // withCredentials: true, // uncomment only if you need to include cross-site cookies
      });

      const contentType = response.headers["content-type"] || "";

      if (type === "pdf" || contentType.includes("pdf")) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      } else {
        const ext = type === "xlsx" ? "xlsx" : "csv";
        const blob = new Blob([response.data], { type: contentType || "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `instructors.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      }

      onExport?.(type);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={processing} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {processing ? "Exporting…" : "Export"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => pickExportType("pdf")}>PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => pickExportType("csv")}>CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={() => pickExportType("xlsx")}>Excel (XLSX)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
