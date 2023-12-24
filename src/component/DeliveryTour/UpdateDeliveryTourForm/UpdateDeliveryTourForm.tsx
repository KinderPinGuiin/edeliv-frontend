import UpdateDeliveryTourRequestDTO from "@api/dto/request/deliverytour/UpdateDeliveryTourRequestDTO";
import DeliveryTourResponseDTO from "@api/dto/response/delivery-tour/DeliveryTourResponseDTO";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import useApi from "@hook/api/useApi";
import { Autocomplete, Button, FormGroup, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRef, useState } from "react";

export type UpdateDeliveryTourFormProps = {
  currentDeliveryTour: DeliveryTourResponseDTO;
  onSubmit: (newDeliveryTour: UpdateDeliveryTourRequestDTO) => void;
};

/**
 * Form used to update a delivery.
 */
export default function UpdateDeliveryTourForm({
  currentDeliveryTour,
  onSubmit,
}: UpdateDeliveryTourFormProps) {
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const [deliverer, setDeliverer] = useState<{
    label: string;
    id: number;
  } | null>({
    label: currentDeliveryTour.deliverer.name,
    id: currentDeliveryTour.deliverer.id,
  });

  // Load the deliverers
  const { data: deliverers, isLoading } = useApi(
    APIEndpoint.GET_ALL_DELIVERERS
  );

  return (
    <>
      <h2>Editer une tournée</h2>
      <FormGroup>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date de début"
            inputRef={startDateRef}
            defaultValue={dayjs(
              (currentDeliveryTour.startDate as unknown as number) * 1000
            )}
            sx={{ margin: "10px 0" }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date de fin"
            inputRef={endDateRef}
            defaultValue={dayjs(
              (currentDeliveryTour.endDate as unknown as number) * 1000
            )}
            sx={{ margin: "10px 0" }}
          />
        </LocalizationProvider>
        <Autocomplete
          disablePortal
          options={
            isLoading
              ? [{ label: "Chargement des livreurs en cours", id: -1 }]
              : deliverers!.elements.map((deliverer) => ({
                  label: deliverer.name,
                  id: deliverer.id,
                }))
          }
          sx={{ margin: "10px 0" }}
          renderInput={(params) => <TextField {...params} label="Livreur" />}
          defaultValue={{
            label: currentDeliveryTour.deliverer.name,
            id: currentDeliveryTour.deliverer.id,
          }}
          onChange={(_, newValue) => setDeliverer(newValue)}
        />
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            onSubmit({
              name: currentDeliveryTour.name,
              newStartDate:
                startDateRef.current?.value != null
                  ? new Date(startDateRef.current.value)
                  : dayjs().toDate(),
              newEndDate:
                endDateRef.current?.value != null
                  ? new Date(endDateRef.current.value)
                  : dayjs().add(1, "day").toDate(),
              delivererId: deliverer?.id ?? -1,
              deliveries: currentDeliveryTour.deliveries.map(
                (delivery) => delivery.id
              ),
            });
          }}
          sx={{ margin: "10px 0" }}
        >
          Créer
        </Button>
      </FormGroup>
    </>
  );
}
