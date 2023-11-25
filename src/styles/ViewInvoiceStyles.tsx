import styled from "styled-components";
import React from "react";

export const ViewContainer = styled.div`
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-self: center;
  align-self: center;
  margin-top: 104px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  
  @media (min-width: 325px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 768px) {
    max-width: 730px;
    padding-left: 0;
    padding-right: 0;
  }

  @media (min-width: 1200px) {
    margin-top: 4rem;
  }
`;

export const GoBackButton = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: 2rem;
`;

export const Icon = styled.p`
  color: ${({ theme }) => theme.outline};
  padding: 0;
  margin: 0;
  font-weight: 900;
`;

export const GoBack = styled.p`
  font-weight: bold;
  padding: 0;
  margin: 0;
  margin-left: 1rem;
  
  &:hover {
    color: #7E88C3;
  }
`;

export const arrowLeft = (
  <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.342.886L2.114 5.114l4.228 4.228"
      stroke="#9277FF"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
    />
  </svg>
);