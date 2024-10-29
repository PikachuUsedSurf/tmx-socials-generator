type Region = {
  name: string;
  code: string;
};

const Regions: Region[] = [{ name: "MTWARA", code: "MTWR" }];

export default function RegionC() {
  return (
    <>
      <div>
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
