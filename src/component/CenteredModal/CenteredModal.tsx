import { Box, Modal, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export type CenteredModalProps = {
  open: boolean;

  handleClose: () => void;

  sx?: SxProps<Theme>

  children: ReactNode;
}

export default function CenteredModal({ open, handleClose, sx, children }: CenteredModalProps) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: "5px",
          ...sx
        }}
      >
        {children}
      </Box>
    </Modal>
  )
}