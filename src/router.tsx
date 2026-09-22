import { AppShell } from "./components/layout/app-shell";
import AuditPage from "./pages/audit";
import BidDetailPage from "./pages/bids/detail";
import BidsPage from "./pages/bids";
import DashboardPage from "./pages/dashboard";
import NotFound from "./pages/NotFound";
import ReviewPage from "./pages/review";
import SettingsPage from "./pages/settings";
import TenderDetailPage from "./pages/tenders/detail";
import TendersPage from "./pages/tenders";
import VerificationPage from "./pages/verification";

export const routers = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "",
        name: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "tenders",
        name: "tenders",
        element: <TendersPage />,
      },
      {
        path: "tenders/:tenderId",
        name: "tender-detail",
        element: <TenderDetailPage />,
      },
      {
        path: "bids",
        name: "bids",
        element: <BidsPage />,
      },
      {
        path: "bids/:submissionId",
        name: "bid-detail",
        element: <BidDetailPage />,
      },
      {
        path: "review/:submissionId",
        name: "compliance-review",
        element: <ReviewPage />,
      },
      {
        path: "verification",
        name: "verification",
        element: <VerificationPage />,
      },
      {
        path: "audit",
        name: "audit",
        element: <AuditPage />,
      },
      {
        path: "settings",
        name: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
