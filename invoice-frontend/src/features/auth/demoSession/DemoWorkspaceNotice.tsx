import styled from "styled-components";
import { useTemporarySession } from "./TemporarySessionProvider";

const Notice = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  margin: -8px 0 16px;
  padding: 0 24px;
  width: 100%;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.greyText};

  @media (min-width: 768px) {
    padding: 0 48px;
  }

  @media (min-width: 1200px) {
    min-width: 730px;
    width: 50%;
    padding: 0;
    margin-top: -40px;
  }
`;

const LinkButton = styled.button`
  border: 0;
  padding: 0;
  background: none;
  font: inherit;
  font-weight: 700;
  color: ${({ theme }) => theme.newButton};
  text-decoration: underline;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

function formatExpiry(expiresAt: string | null) {
  const date = expiresAt ? new Date(expiresAt) : null;
  return date && Number.isFinite(date.getTime())
    ? date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
}

/**
 * Tells a visitor their workspace is private and temporary, and is the always
 * available way to leave a workspace whose quotas are used up. The old
 * workspace is replaced only if the new one was created.
 */
export function DemoWorkspaceNotice() {
  const session = useTemporarySession();
  if (!session || session.phase !== "ready") return null;
  const expiry = formatExpiry(session.expiresAt);
  const startNew = () => {
    if (
      window.confirm(
        "Start a new demo? This workspace stays available only until it expires, and you won't be able to return to it from this browser.",
      )
    )
      void session.startNew();
  };
  return (
    <Notice role="note" data-testid="demo-workspace-notice">
      <span>
        Private demo workspace{expiry ? ` · available until ${expiry}` : ""}
      </span>
      <LinkButton onClick={startNew} disabled={session.renewing}>
        {session.renewing ? "Starting…" : "Start a new demo"}
      </LinkButton>
    </Notice>
  );
}
