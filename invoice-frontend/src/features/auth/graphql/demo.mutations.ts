import { gql } from "@apollo/client";

export const RESET_DEMO_DATA = gql`
  mutation ResetDemoData {
    resetDemoData
  }
`;

// Temporary sessions only. Replaces every invoice ID in the caller's own
// workspace; the shared RESET_DEMO_DATA is never sent for a private workspace.
export const RESET_DEMO_SESSION = gql`
  mutation ResetDemoSession {
    resetDemoSession
  }
`;
