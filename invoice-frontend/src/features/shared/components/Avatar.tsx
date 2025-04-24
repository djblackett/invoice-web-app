import { useAuth } from "@/features/auth/hooks/useAuth";
import styled from "styled-components";
import { Grid } from "react-loader-spinner";
import { useState } from "react";
import { useDemoModeContext } from "./DemoModeProvider";

const AvatarBox = styled.div`
  height: 100%;
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #494e6e;
  padding-top: 5px;
  padding-bottom: 5px;

  @media (min-width: 1200px) {
    border-left: initial;
    width: 100%;
    border-top: 1px solid #494e6e;
  }
`;

function Avatar() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isDemoMode } = useDemoModeContext();
  const [isImageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <AvatarBox>
        <Grid
          visible={true}
          height="30"
          width="30"
          color="#7c5dfa"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperClass="grid-wrapper"
          wrapperStyle={{ margin: "25px" }}
        />
      </AvatarBox>
    );
  }

  const avatarSource =
    isAuthenticated && !isDemoMode
      ? user?.picture
      : `${import.meta.env.BASE_URL}assets/image-avatar.jpg`;

  return (
    <AvatarBox data-testid="avatar">
      <img
        src={avatarSource}
        alt="user avatar"
        onLoad={() => setImageLoaded(true)}
        style={{
          borderRadius: "50%",
          height: "48px",
          width: "48px",
          visibility: isImageLoaded ? "visible" : "hidden",
        }}
        referrerPolicy="no-referrer"
      />
    </AvatarBox>
  );
}

export default Avatar;
