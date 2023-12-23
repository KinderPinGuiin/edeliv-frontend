import DeliveryTourResponseDTO from "@api/dto/response/delivery-tour/DeliveryTourResponseDTO";
import useSnackbar from "@hook/snackbar/useSnackbar";
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
} from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import useApi from "@hook/api/useApi";
import { buildSearchParamsNullSafe } from "@utils/url-utils";
import useApiMutation from "@hook/api/useApiMutation";
import { Box, Button } from "@mui/material";
import CenterDiv from "@component/CenterDiv/CenterDiv";
import ServerSideTable from "@component/ServerSideTable/ServerSideTable";
import CenteredModal from "@component/CenteredModal/CenteredModal";
import CreateDeliveryTourRequestDTO from "@api/dto/request/deliverytour/CreateDeliveryTourRequestDTO";
import CreateDeliveryTourForm from "@component/DeliveryTour/CreateDeliveryTourForm/CreateDeliveryTourForm";
import UpdateDeliveryTourRequestDTO from "@api/dto/request/deliverytour/UpdateDeliveryTourRequestDTO";
import UpdateDeliveryTourForm from "@component/DeliveryTour/UpdateDeliveryTourForm/UpdateDeliveryTourForm";

export type DeliveryTourSearchModel = {
  page: number;
  pageSize: number;
  tourDate: string | null;
};

export default function DeliveryTours() {
  // Setup the fetch error snackbar
  const { snackbar: fetchErrorSnackbar, show: showFetchError } = useSnackbar(
    "Impossible de récupérer les tournées.",
    "warning"
  );

  // Server side table configuration
  const [selectedDeliveryTour, setSelectedDeliveryTour] =
    useState<DeliveryTourResponseDTO>({
      name: "",
      startDate: dayjs().toDate(),
      endDate: dayjs().toDate(),
      deliverer: {
        id: 0,
        name: "",
        creationDate: dayjs().toDate(),
        isAvailable: false,
      },
      deliveries: [],
    });
  const tableColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: "startDate",
      headerName: "Date de début",
      flex: 1,
      sortable: false,
      filterable: false,
      valueGetter: (e) =>
        new Date(e.value * 1000).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      field: "endDate",
      headerName: "Date de fin",
      flex: 1,
      sortable: false,
      filterable: false,
      valueGetter: (e) =>
        new Date(e.value * 1000).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      field: "deliverer",
      headerName: "Livreur",
      flex: 1,
      valueGetter: (e) => e.value?.name ?? "Impossible de charger le livreur",
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 0.5,
      sortable: false,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => {
            setSelectedDeliveryTour({ id: params.id as number, ...params.row });
            setOpenDeliveryTourUpdate(true);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Supprimer"
          onClick={() => deleteDelivery(params.id as number)}
        />,
      ],
    },
  ];

  const initialSearchModel: DeliveryTourSearchModel = {
    page: 0,
    pageSize: 10,
    tourDate: null,
  };
  const [searchModel, setSearchModel] = useState(initialSearchModel);

  const onSearchModelChange = (page: GridPaginationModel) => {
    const newSearchModel: DeliveryTourSearchModel = {
      ...searchModel,
      page: page.page,
      pageSize: page.pageSize,
    };
    if (JSON.stringify(newSearchModel) != JSON.stringify(searchModel)) {
      setSearchModel(newSearchModel);
    }
  };

  // Send an API request to get the deliveries
  const {
    data: deliveries,
    isLoading,
    refetch,
  } = useApi(APIEndpoint.GET_ALL_TOURS, undefined, {
    queryKey: JSON.stringify(searchModel),
    staleTime: -1,
    onError: showFetchError,
    searchParams: new URLSearchParams(
      buildSearchParamsNullSafe({
        page: `${searchModel.page}`,
        pageSize: `${searchModel.pageSize}`,
        tourDate:
          searchModel.tourDate != null ? `${searchModel.tourDate}` : null,
      })
    ),
  });

  // Delivery tour creation handling
  const [openDeliveryTourCreate, setOpenDeliveryTourCreate] = useState(false);
  const { snackbar: creationErrorSnackbar, show: showCreationError } =
    useSnackbar("Impossible de créer la tournée.", "error");
  const {
    mutate: mutateCreation,
    isError: isCreationError,
    isSuccess: isCreationSuccess,
    reset: resetCreationData,
  } = useApiMutation(APIEndpoint.CREATE_DELIVERY_TOUR, null, false, {
    invalidateQueries: [JSON.stringify(searchModel)],
  });
  const createDeliveryTour = (deliveryTour: CreateDeliveryTourRequestDTO) => {
    mutateCreation({ data: deliveryTour });
    setOpenDeliveryTourCreate(false);
  };
  if (isCreationError) {
    showCreationError();
    resetCreationData();
  } else if (isCreationSuccess) {
    resetCreationData();
    refetch();
  }

  // Delivery tour update handling
  const [openDeliveryTourUpdate, setOpenDeliveryTourUpdate] = useState(false);
  const { snackbar: updateErrorSnackbar, show: showUpdateError } = useSnackbar(
    "Impossible de modifier la livraison.",
    "error"
  );
  const {
    mutate: mutateUpdate,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    reset: resetUpdateData,
  } = useApiMutation(APIEndpoint.UPDATE_DELIVERY_TOUR, null, false, {
    invalidateQueries: [JSON.stringify(searchModel)],
  });
  const updateDelivery = (delivery: UpdateDeliveryTourRequestDTO) => {
    mutateUpdate({ data: delivery });
    setOpenDeliveryTourUpdate(false);
  };
  if (isUpdateError) {
    showUpdateError();
    resetUpdateData();
  } else if (isUpdateSuccess) {
    resetUpdateData();
    refetch();
  }

  // Delete handling
  const { mutate: mutateDelete } = useApiMutation(
    APIEndpoint.DELETE_DELIVERY_TOUR,
    null,
    false,
    {
      invalidateQueries: [JSON.stringify(searchModel)],
    }
  );
  const deleteDelivery = (id: number) => {
    mutateDelete({
      searchParams: {
        name: id,
      },
    });
  };

  return (
    <>
      <Box sx={{ paddingLeft: "5%" }}>
        <h1>Tournées</h1>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
          margin: "auto",
        }}
      >
        <Button
          variant="contained"
          sx={{ margin: "10px 0" }}
          onClick={() => setOpenDeliveryTourCreate(true)}
        >
          Créer une tournée
        </Button>
      </Box>
      <CenterDiv
        direction="column"
        sx={{ width: "90%", minHeight: "250px", margin: "auto" }}
      >
        <ServerSideTable
          idField="name"
          columns={tableColumns}
          rows={deliveries != null ? deliveries.elements : []}
          pageInfo={{
            maxElements: deliveries != null ? deliveries.maxElements : 0,
            page: searchModel.page,
            pageSize: searchModel.pageSize,
          }}
          loading={isLoading}
          onChange={onSearchModelChange}
        />
      </CenterDiv>
      {/* Creation modal */}
      <CenteredModal
        open={openDeliveryTourCreate}
        handleClose={() => setOpenDeliveryTourCreate(false)}
        sx={{ padding: "0 10px 10px 10px", width: "clamp(200px, 50%, 500px)" }}
      >
        <CreateDeliveryTourForm onSubmit={createDeliveryTour} />
      </CenteredModal>
      {/* Edit deliverer modal */}
      <CenteredModal
        open={openDeliveryTourUpdate}
        handleClose={() => setOpenDeliveryTourUpdate(false)}
        sx={{ padding: "0 10px 10px 10px", width: "clamp(200px, 50%, 500px)" }}
      >
        <UpdateDeliveryTourForm
          currentDeliveryTour={selectedDeliveryTour}
          onSubmit={updateDelivery}
        />
      </CenteredModal>
      {creationErrorSnackbar}
      {updateErrorSnackbar}
      {fetchErrorSnackbar}
    </>
  );
}
