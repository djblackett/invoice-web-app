import { gql } from "@apollo/client";

export const RESET_DEMO_DATA = gql`
  mutation ResetDemoData {
    resetDemoData
  }
`;
