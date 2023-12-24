import SplashBackground from "@component/SplashBackground/SplashBackground";
import { ApplicationRoute } from "@constant/ApplicationRoute/ApplicationRoute";
import { Box, Button, styled } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Home component containing the home of the application.
 */
export default function Home() {
  const navigate = useNavigate();

  const onAccessButtonClick = useCallback(() => {
    navigate(ApplicationRoute.DELIVERERS);
  }, []);

  return (
    <HomeWrapper>
      <TitleContainer>
        <ApplicationTitle>eDeliv</ApplicationTitle>
        <ApplicationSubtitle>
          Plateforme de gestion de livraison
        </ApplicationSubtitle>
        <Box marginTop={5}>
          <Button
            variant="contained"
            onClick={onAccessButtonClick}
            style={{ zIndex: "1", width: "100%", marginRight: "5px" }}
          >
            Accéder
          </Button>
        </Box>
      </TitleContainer>
      <SplashBackground
        src="https://picsum.photos/600"
        alt="Random test picture"
      />
    </HomeWrapper>
  );
}

const HomeWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  height: "100vh",
  background: theme.palette.background.default,
}));

const TitleContainer = styled("div")(() => ({
  position: "absolute",
  top: "40%",
  left: "5%",
  zIndex: "1",
}));

const commonTitleStyle = {
  zIndex: "1",
  margin: "0",
  color: "black",
};

const ApplicationTitle = styled("h1")(() => ({
  fontSize: "3rem",
  ...commonTitleStyle,
}));

const ApplicationSubtitle = styled("h3")(() => ({
  fontSize: "2rem",
  fontWeight: "normal",
  ...commonTitleStyle,
}));
