import UpdateDelivererRequestDTO from "@api/dto/request/deliverer/UpdateDelivererRequestDTO";
import DelivererResponseDTO from "@api/dto/response/deliverer/DelivererResponseDTO"
import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormLabel, TextField } from "@mui/material";
import { useRef } from "react";

export type UpdateDelivererFormProps = {
  currentDeliverer: DelivererResponseDTO;

  onSubmit: (newDeliverer: UpdateDelivererRequestDTO) => void;
}

export default function UpdateDelivererForm({ currentDeliverer, onSubmit }: UpdateDelivererFormProps) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const isAvailableRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <h2>Editer un livreur</h2>
      <FormGroup>
        <TextField label="Nom du livreur" variant="outlined" inputRef={nameRef} defaultValue={currentDeliverer.name} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>Disponible ? *</span>
          <Checkbox inputRef={isAvailableRef} defaultChecked={currentDeliverer.isAvailable} />
        </Box>
        <Button 
          variant="contained"
          type="submit" 
          onClick={() => onSubmit({
            id: currentDeliverer.id, 
            newName: nameRef.current?.value ?? "", 
            newIsAvailable: isAvailableRef.current?.checked ?? false
          })}
        >
          Editer
        </Button>
      </FormGroup>
    </>
  )
}