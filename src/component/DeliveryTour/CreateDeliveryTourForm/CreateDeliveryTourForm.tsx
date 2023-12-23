import APIEndpoint from "@api/endpoint/APIEndpoint";
import useApi from "@hook/api/useApi";
import { Autocomplete, Button, FormGroup, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRef, useState } from "react";

export type CreateDeliveryTourFormProps = {
  onSubmit: (createdDeliveryTour: {
    name: string;
    startDate: Date;
    endDate: Date;
    delivererId: number;
  }) => void;
};

/**
 * Form used to create a delivery.
 */
export default function CreateDeliveryTourForm({
  onSubmit,
}: CreateDeliveryTourFormProps) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const [deliverer, setDeliverer] = useState<{
    label: string;
    id: number;
  } | null>(null);

  // Load the deliverers
  const { data: deliverers, isLoading } = useApi(
    APIEndpoint.GET_ALL_DELIVERERS
  );

  return (
    <>
      <h2>Créer une tournée</h2>
      <FormGroup>
        <TextField
          required
          label="Nom"
          variant="outlined"
          inputRef={nameRef}
          sx={{ margin: "10px 0" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date de début"
            inputRef={startDateRef}
            sx={{ margin: "10px 0" }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Date de fin"
            inputRef={endDateRef}
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
          onChange={(_, newValue) => setDeliverer(newValue)}
        />
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            onSubmit({
              name: nameRef.current?.value ?? "",
              startDate:
                startDateRef.current?.value != null
                  ? new Date(startDateRef.current.value)
                  : dayjs().toDate(),
              endDate:
                endDateRef.current?.value != null
                  ? new Date(endDateRef.current.value)
                  : dayjs().add(1, "day").toDate(),
              delivererId: deliverer?.id ?? -1,
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
