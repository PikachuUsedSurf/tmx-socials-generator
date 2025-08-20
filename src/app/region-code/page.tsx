type Region = {
  name: string;
  code: string;
};

const REGION_CODES: Record<string, string> = {
  SINGIDA: "SING",
  MBEYA: "MBEY",
  MANYARA: "MANY",
  RUVUMA: "RUVU",
  MTWARA: "MTWR",
  DODOMA: "DDM",
  LINDI: "LIND",
  MOROGORO: "MORO",
  PWANI: "PWAN",
  ARUSHA: "ARUS",
  "DAR ES SALAAM": "DSM",
  GEITA: "GEIT",
  IRINGA: "IRIN",
  KAGERA: "KAGE",
  KATAVI: "KATA",
  KIGOMA: "KIGO",
  KILIMANJARO: "KILI",
  MARA: "MARA",
  MWANZA: "MWAN",
  NJOMBE: "NJOM",
  PEMBA: "PEMB",
  RUKWA: "RUKW",
  SHINYANGA: "SHIN",
  SIMIYU: "SIMI",
  SONGWE: "SONG",
  TABORA: "TABO",
  TANGA: "TANG",
  ZANZIBAR: "ZANZ",
}

const REGIONS = [
  "SINGIDA",
  "MBEYA",
  "MANYARA",
  "RUVUMA",
  "MTWARA",
  "DODOMA",
  "LINDI",
  "MOROGORO",
  "PWANI",
  "ARUSHA",
  "DAR ES SALAAM",
  "GEITA",
  "IRINGA",
  "KAGERA",
  "KATAVI",
  "KIGOMA",
  "KILIMANJARO",
  "MARA",
  "MWANZA",
  "NJOMBE",
  "PEMBA",
  "RUKWA",
  "SHINYANGA",
  "SIMIYU",
  "SONGWE",
  "TABORA",
  "TANGA",
  "ZANZIBAR",
] as const

const Regions: Region[] = REGIONS.map((name) => ({ name, code: REGION_CODES[name] }));

export default function RegionC() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
        {Regions.map((region, index) => (
          <div className=" flex text-center justify-center items-center  border rounded-md shadow-lg p-4 w-40 h-40 space-y-4 ">
            <div key={index}>
              <h1>{region.name}</h1>
              <h2>{region.code}</h2>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
