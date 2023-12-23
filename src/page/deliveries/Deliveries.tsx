import DeliveryResponseDTO from "@api/dto/response/delivery/DeliveryResponseDTO";
import useSnackbar from "@hook/snackbar/useSnackbar";
import { Box, Button } from "@mui/material";
import {
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CenterDiv from "@component/CenterDiv/CenterDiv";
import ServerSideTable from "@component/ServerSideTable/ServerSideTable";
import CenteredModal from "@component/CenteredModal/CenteredModal";
import useApi from "@hook/api/useApi";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import { buildSearchParamsNullSafe } from "@utils/url-utils";
import useApiMutation from "@hook/api/useApiMutation";
import CreateDeliveryRequestDTO from "@api/dto/request/delivery/CreateDeliveryRequestDTO";
import CreateDeliveryForm from "@component/Delivery/CreateDeliveryForm/CreateDeliveryForm";
import UpdateDeliveryRequestDTO from "@api/dto/request/delivery/UpdateDeliveryRequestDTO";
import UpdateDeliveryForm from "@component/Delivery/UpdateDeliveryForm/UpdateDeliveryForm";

type DeliverySearchModel = {
  page: number;
  pageSize: number;
  deliveryTour: string | null;
};

export default function Deliveries() {
  // Setup the fetch error snackbar
  const { snackbar: fetchErrorSnackbar, show: showFetchError } = useSnackbar(
    "Impossible de récupérer les livraisons.",
    "warning"
  );

  // Server side table configuration
  const [selectedDelivery, setSelectedDeliverer] =
    useState<DeliveryResponseDTO>({
      id: 0,
      startAddress: "",
      endAddress: "",
      tour: null,
    });
  const tableColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Identifiant",
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: "startAddress",
      headerName: "Adresse de départ",
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: "endAddress",
      headerName: "Adresse d'arrivée",
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: "tour",
      headerName: "Tournée",
      flex: 1,
      valueGetter: (e) => e.value?.name ?? "Aucune tournée",
      sortable: false,
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
            setSelectedDeliverer({ id: params.id as number, ...params.row });
            setOpenDeliveryUpdate(true);
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

  const initialSearchModel: DeliverySearchModel = {
    page: 0,
    pageSize: 10,
    deliveryTour: null,
  };
  const [searchModel, setSearchModel] = useState(initialSearchModel);

  const onSearchModelChange = (page: GridPaginationModel) => {
    const newSearchModel: DeliverySearchModel = {
      ...searchModel,
      page: page.page,
      pageSize: page.pageSize,
    };
    if (JSON.stringify(newSearchModel) != JSON.stringify(searchModel)) {
      setSearchModel(newSearchModel);
    }
  };

  const onFilterModelChange = (filter: GridFilterModel) => {
    const tourFilter = filter.items.filter((f) => f.field == "tour")[0];
    const newSearchModel: DeliverySearchModel = {
      ...searchModel,
      deliveryTour: tourFilter?.value !== "" ? tourFilter?.value : null,
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
  } = useApi(APIEndpoint.GET_ALL_DELIVERIES, undefined, {
    queryKey: JSON.stringify(searchModel),
    staleTime: -1,
    onError: showFetchError,
    searchParams: new URLSearchParams(
      buildSearchParamsNullSafe({
        page: `${searchModel.page}`,
        pageSize: `${searchModel.pageSize}`,
        deliveryTour:
          searchModel.deliveryTour != null
            ? `${searchModel.deliveryTour}`
            : null,
      })
    ),
  });

  // Delivery creation handling
  const [openDeliveryCreate, setOpenDeliveryCreate] = useState(false);
  const { snackbar: creationErrorSnackbar, show: showCreationError } =
    useSnackbar("Impossible de créer la livraison.", "error");
  const {
    mutate: mutateCreation,
    isError: isCreationError,
    isSuccess: isCreationSuccess,
    reset: resetCreationData,
  } = useApiMutation(APIEndpoint.CREATE_DELIVERY, null, false, {
    invalidateQueries: [JSON.stringify(searchModel)],
  });
  const createDelivery = (delivery: CreateDeliveryRequestDTO) => {
    mutateCreation({ data: delivery });
    setOpenDeliveryCreate(false);
  };
  if (isCreationError) {
    showCreationError();
    resetCreationData();
  } else if (isCreationSuccess) {
    resetCreationData();
    refetch();
  }

  // Deliverer update handling
  const [openDeliveryUpdate, setOpenDeliveryUpdate] = useState(false);
  const { snackbar: updateErrorSnackbar, show: showUpdateError } = useSnackbar(
    "Impossible de modifier la livraison.",
    "error"
  );
  const {
    mutate: mutateUpdate,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    reset: resetUpdateData,
  } = useApiMutation(APIEndpoint.UPDATE_DELIVERY, null, false, {
    invalidateQueries: [JSON.stringify(searchModel)],
  });
  const updateDelivery = (delivery: UpdateDeliveryRequestDTO) => {
    mutateUpdate({ data: delivery });
    setOpenDeliveryUpdate(false);
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
    APIEndpoint.DELETE_DELIVERY,
    null,
    false,
    {
      invalidateQueries: [JSON.stringify(searchModel)],
    }
  );
  const deleteDelivery = (id: number) => {
    mutateDelete({
      searchParams: {
        id: id,
      },
    });
  };

  return (
    <>
      <Box sx={{ paddingLeft: "5%" }}>
        <h1>Livraisons</h1>
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
          onClick={() => setOpenDeliveryCreate(true)}
        >
          Créer une livraison
        </Button>
      </Box>
      <CenterDiv
        direction="column"
        sx={{ width: "90%", minHeight: "250px", margin: "auto" }}
      >
        <ServerSideTable
          idField="id"
          columns={tableColumns}
          rows={deliveries != null ? deliveries.elements : []}
          pageInfo={{
            maxElements: deliveries != null ? deliveries.maxElements : 0,
            page: searchModel.page,
            pageSize: searchModel.pageSize,
          }}
          loading={isLoading}
          onChange={onSearchModelChange}
          onFilter={onFilterModelChange}
        />
      </CenterDiv>
      {/* Creation modal */}
      <CenteredModal
        open={openDeliveryCreate}
        handleClose={() => setOpenDeliveryCreate(false)}
        sx={{ padding: "0 10px 10px 10px", width: "clamp(200px, 50%, 500px)" }}
      >
        <CreateDeliveryForm onSubmit={createDelivery} />
      </CenteredModal>
      {/* Edit deliverer modal */}
      <CenteredModal
        open={openDeliveryUpdate}
        handleClose={() => setOpenDeliveryUpdate(false)}
        sx={{ padding: "0 10px 10px 10px", width: "clamp(200px, 50%, 500px)" }}
      >
        <UpdateDeliveryForm
          currentDelivery={selectedDelivery}
          onSubmit={updateDelivery}
        />
      </CenteredModal>
      {creationErrorSnackbar}
      {updateErrorSnackbar}
      {fetchErrorSnackbar}
    </>
  );
}
