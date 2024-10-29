const RegionName = ["mtwara"];

const RegionCode = ["MTWR"];

export default function RegionC() {
  return (
    <>
      <div>
        <div className=" border rounded-md text-center p-4 w-40 h-40">
          {RegionName.map((region, index) => (
            <div key={index}>{region}</div>
          ))}
        </div>
      </div>
    </>
  );
}
