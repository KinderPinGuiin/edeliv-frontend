import { styled } from "@mui/material";
import backgroundPath from "@assets/home/background.svg";

/**
 * Contains all the props of a FormContainer component.
 */
export type SplashBackgroundProps = {
  /**
   * The image source at the right.
   */
  src: string;

  /**
   * The image alternative description at the right.
   */
  alt?: string;
}

/**
 * Component containing a splash background with the specified image.
 */
export default function SplashBackground({ src, alt }: SplashBackgroundProps) {
    return (
      <SplashBackgroundContainer>
        <IllustrationImage src={ src } alt={ alt ?? "Undocumented image" } draggable="false" />
      </SplashBackgroundContainer>
    )
}

const SplashBackgroundContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "0",
  right: "0",
  zIndex: "0",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  height: "100%",
  width: "70%",
  backgroundColor: theme.palette.primary.main,
  maskImage: `url(${backgroundPath})`,
  maskSize: "cover",
}));

const IllustrationImage = styled("img")(() => ({
  height: "60%",
  width: "auto",
  aspectRatio: "1 / 1", 
  marginRight: "10%",
  boxShadow: "0px 5px 15px 5px rgba(0, 0, 0, 0.3)",
}));
