type Region = {
  name: string;
  code: string;
};

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
]

const Regions: Region[] = REGIONS.map((name) => ({ name, code: REGION_CODES[name] }));

export default function RegionC() {
  return (
    <div className="p-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Regions.map((region) => (
          <Card
            key={region.code}
            className="flex flex-col items-center justify-center text-center p-4 aspect-square"
          >
            <CardTitle className="text-base">{region.name}</CardTitle>
            <Badge variant="secondary" className="mt-2 font-mono">
              {region.code}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
