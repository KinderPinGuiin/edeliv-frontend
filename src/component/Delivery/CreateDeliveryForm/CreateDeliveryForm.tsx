import { Button, FormGroup, TextField } from "@mui/material";
import { useRef } from "react";

export type CreateDeliveryFormProps = {
  onSubmit: (createdDelivery: {
    startAddress: string;
    endAddress: string;
  }) => void;
};

/**
 * Form used to create a delivery.
 */
export default function CreateDeliveryForm({
  onSubmit,
}: CreateDeliveryFormProps) {
  const startAddressRef = useRef<HTMLInputElement | null>(null);
  const endAddressRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <h2>Créer une livraison</h2>
      <FormGroup>
        <TextField
          required
          label="Adresse de départ"
          variant="outlined"
          inputRef={startAddressRef}
          sx={{ margin: "10px 0" }}
        />
        <TextField
          required
          label="Adresse d'arrivée"
          variant="outlined"
          inputRef={endAddressRef}
          sx={{ margin: "10px 0" }}
        />
        <Button
          variant="contained"
          type="submit"
          onClick={() =>
            onSubmit({
              startAddress: startAddressRef.current?.value ?? "",
              endAddress: endAddressRef.current?.value ?? "",
            })
          }
          sx={{ margin: "10px 0" }}
        >
          Créer
        </Button>
      </FormGroup>
    </>
  );
}
