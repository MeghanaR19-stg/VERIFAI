// Aggregation for the Command Center. Small dataset, so the joins happen in
// memory rather than in a heavier query layer.
import {
  useAllRequirements,
  useBidders,
  useDecisions,
  useDemoState,
  useSubmissions,
  useTenders,
} from "@/hooks/use-verifai";
import type { Bidder, DemoCase, Submission, Tender } from "@/lib/verifai/types";

export interface DashboardData {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  demoEnabled: boolean;
  demoCases: DemoCase[];
  activeTenders: number;
  bidsUnderReview: number;
  reviewsCompleted: number;
  highRiskCases: number;
  statusSegments: { label: string; count: number; tone: "pass" | "review" | "fail" }[];
  riskSegments: { label: string; count: number; tone: "pass" | "review" | "fail" }[];
  recentTenders: { tender: Tender; requirementCount: number; bidCount: number }[];
  recentReviews: { submission: Submission; tender: Tender | undefined; bidder: Bidder | undefined }[];
  tenderCount: number;
  bidderCount: number;
}

export function useDashboardData(): DashboardData {
  const tenders = useTenders();
  const submissions = useSubmissions();
  const bidders = useBidders();
  const requirements = useAllRequirements();
  const decisions = useDecisions();
  const demo = useDemoState();

  const tenderList = tenders.data ?? [];
  const submissionList = submissions.data ?? [];
  const bidderList = bidders.data ?? [];
  const requirementList = requirements.data ?? [];
  const decidedIds = new Set((decisions.data ?? []).map((decision) => decision.submission_id));

  const tenderById = new Map(tenderList.map((tender) => [tender.id, tender]));
  const bidderById = new Map(bidderList.map((bidder) => [bidder.id, bidder]));

  const verified = submissionList.filter((submission) => Boolean(submission.verified_at));
  const countStatus = (status: string) => verified.filter((s) => s.overall_status === status).length;
  const countRisk = (risk: string) => verified.filter((s) => s.risk_level === risk).length;

  return {
    isLoading: [tenders, submissions, bidders, requirements, decisions, demo].some((query) => query.isLoading),
    isError: [tenders, submissions, bidders].some((query) => query.isError),
    error: (tenders.error ?? submissions.error ?? bidders.error) as Error | null,
    refetch: () => {
      void tenders.refetch();
      void submissions.refetch();
      void bidders.refetch();
      void decisions.refetch();
    },
    demoEnabled: demo.data?.enabled ?? false,
    demoCases: demo.data?.config?.cases ?? [],
    activeTenders: tenderList.filter((tender) => tender.status === "ACTIVE").length,
    bidsUnderReview: submissionList.filter((submission) => !decidedIds.has(submission.id)).length,
    reviewsCompleted: verified.length,
    highRiskCases: countRisk("HIGH"),
    statusSegments: [
      { label: "PASS", count: countStatus("PASS"), tone: "pass" as const },
      { label: "REVIEW", count: countStatus("REVIEW"), tone: "review" as const },
      { label: "FAIL", count: countStatus("FAIL"), tone: "fail" as const },
    ],
    riskSegments: [
      { label: "LOW", count: countRisk("LOW"), tone: "pass" as const },
      { label: "MEDIUM", count: countRisk("MEDIUM"), tone: "review" as const },
      { label: "HIGH", count: countRisk("HIGH"), tone: "fail" as const },
    ],
    recentTenders: tenderList.slice(0, 3).map((tender) => ({
      tender,
      requirementCount: requirementList.filter((requirement) => requirement.tender_id === tender.id).length,
      bidCount: submissionList.filter((submission) => submission.tender_id === tender.id).length,
    })),
    recentReviews: [...verified]
      .sort((a, b) => (b.verified_at ?? "").localeCompare(a.verified_at ?? ""))
      .slice(0, 5)
      .map((submission) => ({
        submission,
        tender: tenderById.get(submission.tender_id),
        bidder: bidderById.get(submission.bidder_id),
      })),
    tenderCount: tenderList.length,
    bidderCount: bidderList.length,
  };
}
