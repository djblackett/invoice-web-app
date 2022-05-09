import styled from "styled-components";

const HeaderContainer = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #373b53;
  // needs background color dynamically
`;

const Logo = styled.div`
  height: 100%;
  width: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #7c5dfa;
  z-index: 0;
  border-radius: 0 20px 20px 0;
`;

const DarkModeProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const BottomColorBoxForLogo = styled.div`
  position: absolute;
  background-color: #9277ff;
  top: 50%;
  bottom: 0;
  width: 100%;
  border-radius: 20px 0 20px 0;
`;

const AvatarBox = styled.div`
  height: 100%;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #494e6e;
`;

const DarkLightBox = styled.div`
  height: 100%;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const moon = (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.502 11.342a.703.703 0 00-.588.128 7.499 7.499 0 01-2.275 1.33 7.123 7.123 0 01-2.581.46A7.516 7.516 0 018.74 11.06a7.516 7.516 0 01-2.198-5.316c0-.87.153-1.713.41-2.48.28-.817.69-1.559 1.226-2.197a.652.652 0 00-.102-.92.703.703 0 00-.588-.128C5.316.607 3.425 1.91 2.07 3.649A10.082 10.082 0 000 9.783C0 12.57 1.125 15.1 2.965 16.94a10.04 10.04 0 007.156 2.965c2.352 0 4.524-.818 6.262-2.173a10.078 10.078 0 003.579-5.597.62.62 0 00-.46-.793z"
      fill="#7E88C3"
      fill-rule="nonzero"
    />
  </svg>
);
const logo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="26"
    style={{ zIndex: 1 }}
  >
    <path
      fill="#FFF"
      fillRule="evenodd"
      d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
    />
  </svg>
);

function Header() {
  return (
    <HeaderContainer>
      <Logo>
        <BottomColorBoxForLogo />
        {logo}
      </Logo>
      <DarkModeProfileContainer>
        <DarkLightBox>{moon}</DarkLightBox>

        <AvatarBox>
          <img
            src="assets/image-avatar.jpg"
            alt=""
            height="32px"
            width="32px"
            style={{ borderRadius: "50%" }}
          />
        </AvatarBox>
      </DarkModeProfileContainer>
    </HeaderContainer>
  );
}

export default Header;
