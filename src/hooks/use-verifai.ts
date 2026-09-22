// Shared data hooks for the VERIFAI console. Pages read from these so every
// screen shares one cache and one set of query keys.
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllRequirements,
  fetchAuditEvents,
  fetchBidders,
  fetchDecisions,
  fetchDemoConfig,
  fetchDemoMode,
  fetchReviewBundle,
  fetchSubmissions,
  fetchTenders,
  fetchVerifications,
  runVerification,
  saveOfficerDecision,
  setDemoMode,
} from "@/lib/verifai/api";
import type { DecisionType } from "@/lib/verifai/types";

const KEY = "verifai";
const BOOTSTRAP_FLAG = "verifai.verification.bootstrapped";

export function useTenders() {
  return useQuery({ queryKey: [KEY, "tenders"], queryFn: fetchTenders, staleTime: 30_000 });
}

export function useBidders() {
  return useQuery({ queryKey: [KEY, "bidders"], queryFn: fetchBidders, staleTime: 30_000 });
}

export function useSubmissions() {
  return useQuery({ queryKey: [KEY, "submissions"], queryFn: fetchSubmissions, staleTime: 15_000 });
}

export function useAllRequirements() {
  return useQuery({ queryKey: [KEY, "requirements"], queryFn: fetchAllRequirements, staleTime: 30_000 });
}

export function useDecisions() {
  return useQuery({ queryKey: [KEY, "decisions"], queryFn: fetchDecisions, staleTime: 15_000 });
}

export function useVerifications(bidderId?: string) {
  return useQuery({
    queryKey: [KEY, "verifications", bidderId ?? "all"],
    queryFn: () => fetchVerifications(bidderId),
    staleTime: 30_000,
  });
}

export function useAuditEvents() {
  return useQuery({ queryKey: [KEY, "audit"], queryFn: () => fetchAuditEvents(), staleTime: 10_000 });
}

export function useReviewBundle(submissionId: string | undefined) {
  return useQuery({
    queryKey: [KEY, "review", submissionId],
    queryFn: () => fetchReviewBundle(submissionId as string),
    enabled: Boolean(submissionId),
  });
}

export function useDemoState() {
  return useQuery({
    queryKey: [KEY, "demo"],
    queryFn: async () => {
      const [config, enabled] = await Promise.all([fetchDemoConfig(), fetchDemoMode()]);
      return { config, enabled };
    },
    staleTime: 30_000,
  });
}

export function useSetDemoMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => setDemoMode(enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY, "demo"] }),
  });
}

export function useRunVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: runVerification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useSaveDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { submissionId: string; decision: DecisionType; comment: string }) =>
      saveOfficerDecision(input.submissionId, input.decision, input.comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });
}

export type BootstrapState = "idle" | "running" | "done" | "error";

/**
 * Verifies any submission that has no evidence yet, once per browser session,
 * so the console always opens on a populated, auditable state.
 */
export function useVerificationBootstrap(): BootstrapState {
  const queryClient = useQueryClient();
  const [state, setState] = useState<BootstrapState>(() =>
    sessionStorage.getItem(BOOTSTRAP_FLAG) ? "done" : "idle",
  );

  useEffect(() => {
    if (state !== "idle") return;
    setState("running");
    runVerification({ scope: "pending" })
      .then((result) => {
        sessionStorage.setItem(BOOTSTRAP_FLAG, "1");
        if (result.verified.length > 0) {
          queryClient.invalidateQueries({ queryKey: [KEY] });
        }
        setState("done");
      })
      .catch(() => setState("error"));
  }, [state, queryClient]);

  return state;
}
