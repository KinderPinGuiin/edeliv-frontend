import { Alert, IconButton, Snackbar, SnackbarOrigin } from "@mui/material";
import { useCallback, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { createPortal } from "react-dom";

export default function useSnackbar(
  message: string, 
  type?: "info" | "success" | "warning" | "error", 
  position?: SnackbarOrigin, 
  autoHideDuration?: number
) {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  const snackbarAction = (
    <IconButton
      size="small"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  const snackbar = (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      message={type != undefined ? null : message}
      anchorOrigin={position ?? { horizontal: "right", vertical: "bottom" }}
      action={snackbarAction}
    >
      {type && 
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>}
    </Snackbar>
  );

  return { snackbar: createPortal(snackbar, document.body), show: () => setOpen(true), close: () => setOpen(false) }
}
