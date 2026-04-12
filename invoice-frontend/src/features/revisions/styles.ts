import styled, { css } from "styled-components";

export const PanelBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 50;
`;

export const Panel = styled.aside`
  width: 100%;
  max-width: 720px;
  height: 100%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.primaryText};
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: minmax(260px, 1fr) 1.2fr;
  grid-template-areas:
    "header header"
    "timeline detail";
  overflow: hidden;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      "header"
      "timeline"
      "detail";
    max-width: 100%;
  }
`;

export const PanelHeader = styled.header`
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder ?? "#494e6e"};

  h2 {
    font-size: 18px;
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.cardBorder ?? "#494e6e"};
  border-radius: 24px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: ${({ theme }) => theme.editButtonHover};
  }
`;

export const Timeline = styled.ol`
  grid-area: timeline;
  list-style: none;
  margin: 0;
  padding: 8px 0;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.cardBorder ?? "#494e6e"};

  @media (max-width: 700px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.cardBorder ?? "#494e6e"};
    max-height: 40vh;
  }
`;

export const TimelineItem = styled.li<{ selected?: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 3px solid transparent;
  ${({ selected, theme }) =>
    selected &&
    css`
      border-left-color: #7c5dfa;
      background: ${theme.editButtonHover ?? "rgba(124, 93, 250, 0.08)"};
    `}
  &:hover {
    background: ${({ theme }) => theme.editButtonHover ?? "rgba(124, 93, 250, 0.08)"};
  }
  &:focus {
    outline: 2px solid #7c5dfa;
    outline-offset: -2px;
  }
`;

export const TimelineHeadline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

export const Badge = styled.span<{ kind: "create" | "edit" | "restore" }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
  ${({ kind }) =>
    kind === "create"
      ? css`
          background: rgba(51, 214, 159, 0.15);
          color: #33d69f;
        `
      : kind === "restore"
        ? css`
            background: rgba(255, 143, 0, 0.15);
            color: #ff8f00;
          `
        : css`
            background: rgba(124, 93, 250, 0.15);
            color: #7c5dfa;
          `}
`;

export const TimelineMeta = styled.small`
  color: ${({ theme }) => theme.greyText};
  font-size: 12px;
`;

export const DetailPane = styled.section`
  grid-area: detail;
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const RestoreButton = styled.button`
  background: #7c5dfa;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 700;
  &:hover {
    background: #9277ff;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ChangeGroup = styled.div`
  border: 1px solid ${({ theme }) => theme.cardBorder ?? "#494e6e"};
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.greyText};
  }
`;

export const ChangeRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr auto 1fr;
  gap: 8px;
  align-items: baseline;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldLabel = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText};
`;

export const ValueChip = styled.span<{ tone: "before" | "after" | "neutral" }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  ${({ tone }) =>
    tone === "before"
      ? css`
          background: rgba(236, 87, 87, 0.12);
          color: #ec5757;
          text-decoration: line-through;
        `
      : tone === "after"
        ? css`
            background: rgba(51, 214, 159, 0.12);
            color: #33d69f;
          `
        : css`
            background: rgba(128, 128, 128, 0.12);
          `}
`;

export const Arrow = styled.span`
  color: ${({ theme }) => theme.greyText};
  font-weight: 700;
`;

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.greyText};
  font-style: italic;
`;

export const ItemCard = styled.div<{ tone: "added" | "removed" | "modified" }>`
  border-left: 4px solid
    ${({ tone }) =>
      tone === "added" ? "#33d69f" : tone === "removed" ? "#ec5757" : "#7c5dfa"};
  padding: 8px 12px;
  background: ${({ theme }) => theme.editButtonHover ?? "rgba(124, 93, 250, 0.05)"};
  border-radius: 4px;
`;

export const HistoryButton = styled.button`
  background-color: ${({ theme }) => theme.editButton};
  border-radius: 24px;
  padding: 16px 20px 17px;
  color: ${({ theme }) => theme.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  margin-right: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.editButtonHover};
  }
  &:focus {
    outline: 2px solid #7c5dfa;
  }
`;

export const ConfirmModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;

  > div {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.primaryText};
    padding: 24px;
    border-radius: 8px;
    max-width: 420px;
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
`;
