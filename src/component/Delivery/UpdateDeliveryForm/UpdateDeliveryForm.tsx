import UpdateDeliveryRequestDTO from "@api/dto/request/delivery/UpdateDeliveryRequestDTO";
import DeliveryResponseDTO from "@api/dto/response/delivery/DeliveryResponseDTO";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import useApi from "@hook/api/useApi";
import { Autocomplete, Button, FormGroup, TextField } from "@mui/material";
import { useRef } from "react";

export type UpdateDeliveryFormProps = {
  currentDelivery: DeliveryResponseDTO;

  onSubmit: (newDeliverer: UpdateDeliveryRequestDTO) => void;
};

export default function UpdateDeliveryForm({
  currentDelivery,
  onSubmit,
}: UpdateDeliveryFormProps) {
  const startAddressRef = useRef<HTMLInputElement | null>(null);
  const endAddressRef = useRef<HTMLInputElement | null>(null);
  const deliveryTourRef = useRef<HTMLInputElement | null>(null);

  // Get the delivery tours
  const { data: deliveryTours, isLoading } = useApi(
    APIEndpoint.GET_ALL_DELIVERY
  );

  return (
    <>
      <h2>Editer une livraison</h2>
      <FormGroup>
        <TextField
          label="Adresse de départ"
          variant="outlined"
          inputRef={startAddressRef}
          defaultValue={currentDelivery.startAddress}
          sx={{ margin: "10px 0" }}
        />
        <TextField
          label="Adresse d'arriée"
          variant="outlined"
          inputRef={endAddressRef}
          defaultValue={currentDelivery.endAddress}
          sx={{ margin: "10px 0" }}
        />
        <Autocomplete
          disablePortal
          options={
            isLoading
              ? ["Chargement des tournées en cours"]
              : deliveryTours!.elements.map((tour) => tour.name)
          }
          sx={{ margin: "10px 0" }}
          renderInput={(params) => (
            <TextField {...params} label="Tournée" inputRef={deliveryTourRef} />
          )}
          defaultValue={currentDelivery.tour?.name}
        />
        <Button
          variant="contained"
          type="submit"
          onClick={() =>
            onSubmit({
              id: currentDelivery.id,
              newStartAddress: startAddressRef.current?.value ?? "",
              newEndAddress: endAddressRef.current?.value ?? "",
              deliveryTourId:
                deliveryTourRef.current?.value == ""
                  ? null
                  : deliveryTourRef.current?.value ?? null,
            })
          }
          sx={{ margin: "10px 0" }}
        >
          Editer
        </Button>
      </FormGroup>
    </>
  );
}
