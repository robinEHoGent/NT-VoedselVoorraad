import apiClient from "./apiClient";

export async function GetAllUnits(): Promise<UnitOfMeasurementContract[]> {
  const response =
    await apiClient.get<UnitOfMeasurementContract[]>("unitsofmeasurement");
  return response.data;
}

export async function GetAllUnitsSimple(): Promise<
  UnitOfMeasurementContract[]
> {
  const response = await apiClient.get<UnitOfMeasurementContract[]>(
    "unitsofmeasurement/simple",
  );
  return response.data;
}

export async function AddUnitOfMeasurement(
  uom: UnitOfMeasurementRequestContract,
): Promise<UnitOfMeasurementContract> {
  const response = await apiClient.post<UnitOfMeasurementContract>(
    "unitsofmeasurement",
    uom,
  );

  return response.data;
}
