import useApi from "@hook/api/useApi";
import APIEndpoint from "@api/endpoint/APIEndpoint";
import useSnackbar from "@hook/snackbar/useSnackbar";
import CenterDiv from "@component/CenterDiv/CenterDiv";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import {
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid/models/";
import ServerSideTable from "@component/ServerSideTable/ServerSideTable";
import { buildSearchParamsNullSafe } from "@utils/url-utils";
import {
  GridActionsCellItem,
  GridFilterModel,
  getGridStringOperators,
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import CenteredModal from "@component/CenteredModal/CenteredModal";
import CreateDelivererForm from "@component/Deliverer/CreateDelivererForm/CreateDelivererForm";
import useApiMutation from "@hook/api/useApiMutation";
import CreateDelivererRequestDTO from "@api/dto/request/deliverer/CreateDelivererRequestDTO";
import UpdateDelivererRequestDTO from "@api/dto/request/deliverer/UpdateDelivererRequestDTO";
import UpdateDelivererForm from "@component/Deliverer/UpdateDelivererForm/UpdateDelivererForm";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DelivererResponseDTO from "@api/dto/response/deliverer/DelivererResponseDTO";

type DelivererSearchModel = {
  page: number;
  pageSize: number;
  minDate: string;
  maxDate: string;
  isDelivererAvailable: boolean | null;
  nameSort: number | null;
  creationDateSort: number | null;
  nameFilter: string | null;
};

export default function Deliverers() {
  // Setup the fetch error snackbar
  const { snackbar: fetchErrorSnackbar, show: showFetchError } = useSnackbar(
    "Impossible de récupérer les livreurs.",
    "warning"
  );

  // Server side table configuration
  const [selectedDeliverer, setSelectedDeliverer] =
    useState<DelivererResponseDTO>({
      id: 0,
      name: "",
      isAvailable: true,
      creationDate: dayjs().toDate(),
    });
  const tableColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      filterOperators: getGridStringOperators().filter(
        (o) => o.value === "contains"
      ),
    },
    {
      field: "creationDate",
      headerName: "Date de création",
      flex: 1,
      valueGetter: (e) => new Date(e.value * 1000).toLocaleDateString("fr-FR"),
      filterable: false,
    },
    {
      field: "isAvailable",
      headerName: "Disponible",
      flex: 1,
      type: "boolean",
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
            setOpenDelivererUpdate(true);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Supprimer"
          onClick={() => deleteDeliverer(params.id as number)}
        />,
      ],
    },
  ];

  dayjs.locale("fr");
  const initialSearchModel: DelivererSearchModel = {
    page: 0,
    pageSize: 10,
    minDate: dayjs("1970-01-01").toISOString(),
    maxDate: dayjs("275760-09-13").toISOString(),
    isDelivererAvailable: null,
    nameSort: null,
    creationDateSort: null,
    nameFilter: null,
  };
  const [searchModel, setSearchModel] = useState(initialSearchModel);

  const onSearchModelChange = (
    page: GridPaginationModel,
    sort: GridSortModel
  ) => {
    const nameSort = sort.filter((s) => s.field == "name")[0];
    const creationDateSort = sort.filter((s) => s.field == "creationDate")[0];
    const newSearchModel: DelivererSearchModel = {
      ...searchModel,
      page: page.page,
      pageSize: page.pageSize,
      nameSort:
        nameSort?.sort === undefined ? null : nameSort.sort === "desc" ? 0 : 1,
      creationDateSort:
        creationDateSort?.sort === undefined
          ? null
          : creationDateSort.sort === "desc"
          ? 0
          : 1,
    };
    if (JSON.stringify(newSearchModel) != JSON.stringify(searchModel)) {
      setSearchModel(newSearchModel);
    }
  };

  const onFilterModelChange = (filter: GridFilterModel) => {
    const nameFilter = filter.items.filter((f) => f.field == "name")[0];
    const availableFilter = filter.items.filter(
      (f) => f.field == "isAvailable"
    )[0];
    const newSearchModel: DelivererSearchModel = {
      ...searchModel,
      nameFilter: nameFilter?.value,
      isDelivererAvailable: availableFilter?.value,
    };
    if (JSON.stringify(newSearchModel) != JSON.stringify(searchModel)) {
      setSearchModel(newSearchModel);
    }
  };

  const onMinDateChange = (newValue: Dayjs | null) => {
    setSearchModel({
      ...searchModel,
      minDate: newValue?.toISOString() ?? initialSearchModel.minDate,
    });
  };

  const onMaxDateChange = (newValue: Dayjs | null) => {
    setSearchModel({
      ...searchModel,
      maxDate: newValue?.toISOString() ?? initialSearchModel.maxDate,
    });
  };

  // Send an API request to get the deliverers
  const {
    data: deliverers,
    isLoading,
    refetch,
  } = useApi(APIEndpoint.GET_ALL_DELIVERERS, undefined, {
    queryKey: JSON.stringify(searchModel),
    staleTime: -1,
    onError: showFetchError,
    searchParams: new URLSearchParams(
      buildSearchParamsNullSafe({
        page: `${searchModel.page}`,
        pageSize: `${searchModel.pageSize}`,
        nameSort: searchModel.nameSort,
        minDate: searchModel.minDate,
        maxDate: searchModel.maxDate,
        creationDateSort: searchModel.creationDateSort,
        nameFilter: searchModel.nameFilter,
        isDelivererAvailable: searchModel.isDelivererAvailable,
      })
    ),
  });

  // Deliverer creation handling
  const [openDelivererCreate, setOpenDelivererCreate] = useState(false);
  const { snackbar: creationErrorSnackbar, show: showCreationError } =
    useSnackbar("Impossible de créer le livreur.", "error");
  const {
    mutate: mutateCreation,
    isError: isCreationError,
    isSuccess: isCreationSuccess,
    reset: resetCreationData,
  } = useApiMutation(APIEndpoint.CREATE_DELIVERER, null, false, {
    invalidateQueries: [JSON.stringify(searchModel)],
  });
  const createDeliverer = (deliverer: CreateDelivererRequestDTO) => {
    mutateCreation({ data: deliverer });
    setOpenDelivererCreate(false);
  };
  if (isCreationError) {
    showCreationError();
    resetCreationData();
  } else if (isCreationSuccess) {
    resetCreationData();
    refetch();
  }

  // Deliverer update handling
  const [openDelivererUpdate, setOpenDelivererUpdate] = useState(false);
  const { snackbar: updateErrorSnackbar, show: showUpdateError } = useSnackbar(
    "Impossible de modifier le livreur.",
    "error"
  );
  const {
    mutate: mutateUpdate,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    reset: resetUpdateData,
  } = useApiMutation(APIEndpoint.UPDATE_DELIVERER, null, false, {
    invalidateQueries: [JSON.stringify(searchModel)],
  });
  const updateDeliverer = (deliverer: UpdateDelivererRequestDTO) => {
    mutateUpdate({ data: deliverer });
    setOpenDelivererUpdate(false);
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
    APIEndpoint.DELETE_DELIVERER,
    null,
    false,
    {
      invalidateQueries: [JSON.stringify(searchModel)],
    }
  );
  const deleteDeliverer = (id: number) => {
    mutateDelete({
      searchParams: {
        id: id,
      },
    });
  };

  return (
    <>
      <Box sx={{ paddingLeft: "5%" }}>
        <h1>Livreurs</h1>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
          margin: "auto",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <DatePicker
              label="Date minimale"
              sx={{ margin: "10px 10px 10px 0" }}
              onChange={onMinDateChange}
            />
            <DatePicker
              label="Date maximale"
              sx={{ margin: "10px 10px 10px 0" }}
              onChange={onMaxDateChange}
            />
          </Box>
        </LocalizationProvider>
        <Button
          variant="contained"
          sx={{ margin: "10px 0" }}
          onClick={() => setOpenDelivererCreate(true)}
        >
          Créer un livreur
        </Button>
      </Box>
      <CenterDiv
        direction="column"
        sx={{ width: "90%", minHeight: "250px", margin: "auto" }}
      >
        <ServerSideTable
          idField="id"
          columns={tableColumns}
          rows={deliverers != null ? deliverers.elements : []}
          pageInfo={{
            maxElements: deliverers != null ? deliverers.maxElements : 0,
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
        open={openDelivererCreate}
        handleClose={() => setOpenDelivererCreate(false)}
        sx={{ padding: "0 10px 10px 10px", width: "clamp(200px, 50%, 500px)" }}
      >
        <CreateDelivererForm onSubmit={createDeliverer} />
      </CenteredModal>
      {/* Edit deliverer modal */}
      <CenteredModal
        open={openDelivererUpdate}
        handleClose={() => setOpenDelivererUpdate(false)}
        sx={{ padding: "0 10px 10px 10px", width: "clamp(200px, 50%, 500px)" }}
      >
        <UpdateDelivererForm
          currentDeliverer={selectedDeliverer}
          onSubmit={updateDeliverer}
        />
      </CenteredModal>
      {creationErrorSnackbar}
      {updateErrorSnackbar}
      {fetchErrorSnackbar}
    </>
  );
}
