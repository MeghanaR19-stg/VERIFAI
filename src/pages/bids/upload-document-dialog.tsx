// Document upload for the prototype: metadata and a simulated extraction.
// No file is stored and no OCR runs — the dialog says so plainly.
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtractionTag } from "@/components/verifai/method-tag";
import { insertDocument, recordAuditEvent } from "@/lib/verifai/api";
import { docTypeLabel } from "@/lib/verifai/format";
import type { Bidder } from "@/lib/verifai/types";

const DOC_TYPES = [
  "AUDITED_FINANCIAL_STATEMENT",
  "EXPERIENCE_CERTIFICATE",
  "GST_CERTIFICATE",
  "OEM_AUTHORIZATION",
  "COMPANY_REGISTRATION",
  "ISO_CERTIFICATE",
];

const DEFAULT_NAMES: Record<string, string> = {
  AUDITED_FINANCIAL_STATEMENT: "Audited Financial Statement.pdf",
  EXPERIENCE_CERTIFICATE: "Experience Certificate.pdf",
  GST_CERTIFICATE: "GST Certificate.pdf",
  OEM_AUTHORIZATION: "OEM Authorization Letter.pdf",
  COMPANY_REGISTRATION: "Company Registration Certificate.pdf",
  ISO_CERTIFICATE: "ISO 13485 Certificate.pdf",
};

/** Simulated extraction: reads the declared bidder record rather than a file. */
function simulateExtraction(docType: string, bidder: Bidder): Record<string, unknown> {
  switch (docType) {
    case "AUDITED_FINANCIAL_STATEMENT":
      return { turnover_cr: bidder.turnover_cr, financial_year: "FY 2024-25", currency: "INR" };
    case "EXPERIENCE_CERTIFICATE":
      return { experience_years: bidder.experience_years, projects: [] };
    case "GST_CERTIFICATE":
      return { gstin: bidder.gstin, status: bidder.gst_status, legal_name: bidder.registered_name };
    case "OEM_AUTHORIZATION":
      return {
        entity_name: bidder.registered_name,
        manufacturer: "Prototype manufacturer reference",
        valid_until: "2027-12-31",
      };
    case "ISO_CERTIFICATE":
      return {
        standard: "ISO 13485:2016",
        certificate_no: `PROTO-${Date.now().toString().slice(-6)}`,
        valid_until: "2027-12-31",
      };
    default:
      return { registered_name: bidder.registered_name, incorporated: "2018-04-01" };
  }
}

export function UploadDocumentDialog({
  submissionId,
  bidder,
  onUploaded,
}: {
  submissionId: string;
  bidder: Bidder;
  onUploaded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [fileName, setFileName] = useState("");
  const [sourcePage, setSourcePage] = useState("1");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const name = fileName.trim() || DEFAULT_NAMES[docType] || "Document.pdf";
      const page = Number.parseInt(sourcePage, 10);
      await insertDocument({
        submission_id: submissionId,
        name,
        doc_type: docType,
        status: "EXTRACTED",
        source_page: Number.isFinite(page) ? page : null,
        extraction_method: "PROTOTYPE EXTRACTION",
        confidence: 0.9,
        extracted_fields: simulateExtraction(docType, bidder),
        uploaded_by: "Procurement Officer",
      });
      await recordAuditEvent({
        action: "Document uploaded",
        entity_type: "SUBMISSION",
        entity_id: submissionId,
        entity_label: name,
        status: "RECEIVED",
        detail: `${docTypeLabel(docType)} added with prototype extraction.`,
      });
      toast.success("Document record added", {
        description: "Re-run verification to fold the new evidence into the compliance result.",
      });
      setOpen(false);
      setFileName("");
      setSourcePage("1");
      onUploaded();
    } catch (error) {
      toast.error("The document record could not be saved", {
        description: error instanceof Error ? error.message : "Unexpected error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Upload aria-hidden />
          Upload document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="gap-2 text-left">
          <div className="flex items-center gap-2">
            <ExtractionTag />
          </div>
          <DialogTitle className="text-base">Add a document record</DialogTitle>
          <DialogDescription className="text-xs">
            The prototype does not store the file and performs no OCR. Only the file name, source page and the
            simulated extracted values are recorded, then used by the compliance engine.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doc-type" className="text-xs text-muted-foreground">
              Document type
            </Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger id="doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {docTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-file" className="text-xs text-muted-foreground">
              File (name is used for the record only)
            </Label>
            <Input
              id="doc-file"
              type="file"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
              className="h-auto py-2 text-xs file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:text-secondary-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-page" className="text-xs text-muted-foreground">
              Source page
            </Label>
            <Input
              id="doc-page"
              type="number"
              min={1}
              value={sourcePage}
              onChange={(event) => setSourcePage(event.target.value)}
              className="w-28"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Recording…" : "Record document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
