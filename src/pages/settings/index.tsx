// Settings: demo mode, the configured demo cases, and an explicit statement of
// what this prototype does and does not do.
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bot, Database, Info, ShieldCheck, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/verifai/page-header";
import { Pill } from "@/components/verifai/result-badge";
import { PrototypeNotice, SyntheticNotice } from "@/components/verifai/synthetic-notice";
import { useAuditEvents, useDemoState, useSetDemoMode, useSubmissions } from "@/hooks/use-verifai";
import { fetchAllDocuments, fetchAllEvidence } from "@/lib/verifai/api";
import { AI_MODE_DETAIL, AI_MODE_LABELS, OFFICER_DECISION_NOTICE } from "@/lib/verifai/labels";

const LIMITATIONS = [
  "All tender, bidder, document and verification data is synthetic and preloaded for demonstration.",
  "No live GST, Udyam, PAN, MCA, Startup India, NSIC, EPFO/ESIC, DigiLocker or debarment integration exists.",
  "Document text is not read by OCR; extracted values come from the prototype extraction record.",
  "No fraud prediction, no measured savings and no accuracy statistics are claimed.",
  "The compliance engine produces decision support only; it never determines eligibility.",
];

const SettingsPage = () => {
  const demo = useDemoState();
  const setDemoMode = useSetDemoMode();
  const submissions = useSubmissions();
  const audit = useAuditEvents();
  const documents = useQuery({ queryKey: ["verifai", "documents", "all"], queryFn: fetchAllDocuments });
  const evidence = useQuery({ queryKey: ["verifai", "evidence", "all"], queryFn: fetchAllEvidence });

  const latestMode = (submissions.data ?? []).find((submission) => submission.ai_mode)?.ai_mode ?? null;

  const counts = [
    { label: "Submissions", value: (submissions.data ?? []).length },
    { label: "Document records", value: (documents.data ?? []).length },
    { label: "Evidence records", value: (evidence.data ?? []).length },
    { label: "Recent audit events", value: (audit.data ?? []).length },
  ];

  const handleToggle = (enabled: boolean) => {
    setDemoMode.mutate(enabled, {
      onSuccess: () =>
        toast.success(enabled ? "Demo mode enabled" : "Demo mode disabled", {
          description: "The setting is stored with the project state and persists across refreshes.",
        }),
      onError: (error: Error) => toast.error("Demo mode could not be changed", { description: error.message }),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Prototype configuration and the limits of this demonstration build."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-panel">
          <CardHeader className="gap-1.5 pb-3">
            <CardTitle className="text-base">Demo mode</CardTitle>
            <CardDescription className="text-xs">
              Keeps the preloaded demonstration state visible across the console.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
              <div className="min-w-0">
                <Label htmlFor="demo-mode" className="text-sm font-medium">
                  Demo mode
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {demo.data?.enabled
                    ? "Enabled — demo banners and preloaded scenarios are shown."
                    : "Disabled — the console still works, without demo banners."}
                </p>
              </div>
              <Switch
                id="demo-mode"
                checked={demo.data?.enabled ?? false}
                onCheckedChange={handleToggle}
                disabled={setDemoMode.isPending || demo.isLoading}
              />
            </div>

            <div className="space-y-2">
              <p className="label-mono text-muted-foreground">Configured demo cases</p>
              {(demo.data?.config?.cases ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No demo cases are configured.</p>
              ) : (
                <ul className="space-y-2">
                  {(demo.data?.config?.cases ?? []).map((demoCase, index) => (
                    <li key={demoCase.submission_id}>
                      <Link
                        to={`/review/${demoCase.submission_id}`}
                        className="flex items-start justify-between gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/60"
                      >
                        <span className="min-w-0">
                          <span className="label-mono text-muted-foreground">
                            {index === 0 ? "Primary demo" : `Demo ${index + 1}`} · {demoCase.submission_id}
                          </span>
                          <span className="mt-1 block text-sm font-medium text-foreground">{demoCase.title}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{demoCase.expected}</span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-panel">
          <CardHeader className="gap-1.5 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4 text-muted-foreground" aria-hidden />
              AI reasoning
            </CardTitle>
            <CardDescription className="text-xs">
              Semantic checks run on the server; the model token is never exposed to the browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {latestMode ? AI_MODE_LABELS[latestMode] : "Not yet exercised"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {latestMode
                    ? AI_MODE_DETAIL[latestMode]
                    : "Run a verification to see which reasoning path was used."}
                </p>
              </div>
              <Pill tone={latestMode === "live" ? "info" : "review"}>
                {latestMode === "live" ? "LIVE AI" : "DEMO REASONING"}
              </Pill>
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {OFFICER_DECISION_NOTICE}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-panel">
          <CardHeader className="gap-1.5 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-muted-foreground" aria-hidden />
              Stored prototype data
            </CardTitle>
            <CardDescription className="text-xs">
              Everything the console shows is read back from the project database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              {counts.map((count) => (
                <div key={count.label} className="rounded-md border border-border p-3">
                  <dt className="label-mono text-muted-foreground">{count.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{count.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="border-border shadow-panel">
          <CardHeader className="gap-1.5 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TriangleAlert className="h-4 w-4 text-muted-foreground" aria-hidden />
              Prototype limits
            </CardTitle>
            <CardDescription className="text-xs">
              Stated plainly so no result in this console is mistaken for a government record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {LIMITATIONS.map((limitation) => (
                <li key={limitation} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                  {limitation}
                </li>
              ))}
            </ul>
            <p className="flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              This build has no sign-in: the console runs as a single demonstration officer, so the database is
              readable by the demo session. That is acceptable only because the dataset is entirely synthetic and
              contains no real procurement information.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <SyntheticNotice />
        <PrototypeNotice />
      </div>
    </div>
  );
};

export default SettingsPage;
