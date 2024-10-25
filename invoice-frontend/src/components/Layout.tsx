import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
`;

const Layout = React.memo(() => (
  <Container>
    <Outlet />
  </Container>
));

export default Layout;
