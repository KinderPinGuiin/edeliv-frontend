import { Box, styled } from "@mui/material";

/**
 * The CenterDiv properties.
 */
export interface CenterDivProps {
  /**
   * The div childrens direction.
   */
  direction?: "row" | "column"
}

/**
 * A div that centers all its elements in both axes.
 */
const CenterDiv = styled(Box, {
  shouldForwardProp: (prop) => prop !== "direction"
})<CenterDivProps>(({ direction }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: direction ?? "row"
}));

export default CenterDiv;