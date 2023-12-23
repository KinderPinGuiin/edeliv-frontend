import {DataGrid, frFR, GridColDef, GridFilterModel, GridRowModel, GridValidRowModel} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import {GridPaginationModel} from '@mui/x-data-grid/models/gridPaginationProps';
import {GridSortModel} from '@mui/x-data-grid/models/gridSortModel';
import SearchResultResponseDTO from '@api/dto/response/search/SearchResultResponseDTO';

export type TableProps = {
    /**
     * The row field used as an ID for the data grid.
     */
    idField: string;

    /**
     * The table rows.
     */
    rows: GridRowModel[];

    /**
     * The table columns.
     */
    columns: GridColDef[];

    /**
     * The page data (page size, total amount of element...).
     */
    pageInfo: Partial<SearchResultResponseDTO<unknown>> | undefined;

    /**
     * Is the table loading.
     */
    loading: boolean;

    /**
     * Callback called when the table page or sort is updated.
     * 
     * @param pagination The current pagination model.
     * @param sort       The current sort model.
     */
    onChange: (pagination: GridPaginationModel, sort: GridSortModel) => void;

    /**
     * Callback called when the table filters are updated.
     * 
     * @param filter The applied filters.
     */
    onFilter?: (filter: GridFilterModel) => void;

    /**
     * Indicates if the filtering is enabled or no in the table (default: false).
     */
    disabledFiltering?: boolean;

    /**
     * Callback called when a row is edited.
     * 
     * @param newRow The new row values.
     * @param oldRow The previous row values.
     * @returns      The new grid model, or a promise resolving it.
     */
    processRowUpdate?: (newRow: GridValidRowModel, oldRow: GridValidRowModel) => GridValidRowModel | Promise<GridValidRowModel>;

    /**
     * The initial sort model.
     */
    initialSortModel?: GridSortModel;

    /**
     * The initial pagination model.
     */
    initialPaginationModel?: GridPaginationModel;
}

const ServerSideTable = ({
                   idField,
                   rows,
                   columns,
                   pageInfo,
                   onChange,
                   onFilter,
                   loading,
                   disabledFiltering,
                   processRowUpdate,
                   initialPaginationModel = {page: 0, pageSize: 10},
                   initialSortModel = []
}: TableProps) => {
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState(initialPaginationModel);
    const [sortModel, setSortModel] = useState<GridSortModel>(initialSortModel);

    useEffect(() => {
        setRowCount(pageInfo?.maxElements || 0);
    }, [pageInfo?.maxElements])

    useEffect(() => {
        onChange(paginationModel, sortModel);
    }, [paginationModel, sortModel, onChange]);

    return <DataGrid
        sx={{ width: "100%" }}
        rows={rows}
        editMode="row"
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
        rowCount={rowCount}
        onFilterModelChange={onFilter}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        processRowUpdate={processRowUpdate ?? ((newRow, _) => newRow)}
        onProcessRowUpdateError={() => 0}
        paginationModel={paginationModel}
        sortModel={sortModel}
        sortingMode="server"
        onSortModelChange={setSortModel}
        getRowId={(row) => row[idField ?? "id"]}
        loading={loading}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
        disableColumnFilter={disabledFiltering === undefined ? false : disabledFiltering}
        filterMode='server'
        filterDebounceMs={800}
    />
}

export default ServerSideTable;