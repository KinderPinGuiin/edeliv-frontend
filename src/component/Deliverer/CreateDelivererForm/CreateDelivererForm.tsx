import { Button, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material"
import { useRef } from "react";

export type CreateDelivererFormProps = {
  onSubmit: (createdDeliverer: { name: string, available: boolean }) => void
}

/**
 * Form used to create a deliverer.
 */
export default function CreateDelivererForm({ onSubmit }: CreateDelivererFormProps) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const isAvailableRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <h2>Créer un livreur</h2>
      <FormGroup>
        <TextField required label="Nom du livreur" variant="outlined" inputRef={nameRef} />
        <FormControlLabel required control={<Checkbox inputRef={isAvailableRef} />} label="Disponible ?" />
        <Button 
          variant="contained"
          type="submit" 
          onClick={() => onSubmit({ 
            name: nameRef.current?.value ?? "", 
            available: isAvailableRef.current?.checked ?? false
          })}
        >
          Créer
        </Button>
      </FormGroup>
    </>
  )
}