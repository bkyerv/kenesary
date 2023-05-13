const inventory = [
  {
    id: "1",
    name: "холодильник (свой из дома отвезли)",
    condition: "б/у",
    date: "2022-01-01",
    category: "inventory",
    room_id: "234",
  },
  {
    id: "2",
    name: "стиральная машина",
    condition: "новый",
    date: "2022-01-01",
    category: "inventory",
    room_id: "234",
  },
  {
    id: "3",
    name: "4 стульчика",
    condition: "б/у",
    date: "2023-10-01",
    category: "inventory",
    room_id: "234",
  },
  {
    id: "4",
    name: "холодильник (свой из дома отвезли)",
    condition: "б/у",
    date: "2022-01-01",
    category: "inventory",
    room_id: "234",
  },
  {
    id: "5",
    name: "стиральная машина",
    condition: "новый",
    date: "2022-01-01",
    category: "inventory",
    room_id: "234",
  },
  {
    id: "6",
    name: "4 стульчика",
    condition: "б/у",
    date: "2023-10-01",
    category: "inventory",
    room_id: "234",
  },
];

export default function Dashboard() {
  return (
    <div className="text-sm p-4 ">
      <div className="text-right mt-2">
        <button className="bg-blue-500 text-blue-50 px-2 py-1 rounded">
          + Добавить
        </button>
      </div>
      <p className="underline">Мы им дали: </p>
      <div className="flex flex-col gap-2 mt-2">
        {inventory.map((item) => (
          <div
            key={item.id}
            className=" relative border rounded p-2 pt-6 grid grid-cols-4 "
          >
            <span className="absolute px-2 bg-blue-100 rounded text-blue-900 ">
              {item.condition === "новый" ? "Новый" : ""}
            </span>
            <div className="col-span-3">
              <div className="pr-2">{item.name}</div>
              <div className="mt-2">
                <span className="block text-xs font-light text-slate-500">
                  Date:
                </span>
                <span className="text-xs">{item.date}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-2">
              <button className="outline outline-1 outline-blue-500 px-1 my-1  rounded">
                Edit
              </button>
              <button className="outline outline-1 outline-blue-500 px-1 my-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
