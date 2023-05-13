const residents = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    intake_date: "2023-10-30",
    active: true,
  },
  {
    id: "2",
    name: "Michale Johnson",
    intake_date: "2023-03-12",
    active: true,
  },
  {
    id: "3",
    name: "Vikram Singh",
    intake_date: "2023-11-20",
    active: false,
  },
  {
    id: "4",
    name: "Иванов Иван Иванович",
    intake_date: "2023-10-30",
    active: true,
  },
  {
    id: "5",
    name: "Michale Johnson",
    intake_date: "2023-03-12",
    active: false,
  },
  {
    id: "6",
    name: "Vikram Singh",
    intake_date: "2023-11-20",
    active: true,
  },
  {
    id: "7",
    name: "Иванов Иван Иванович",
    intake_date: "2023-10-30",
    active: false,
  },
];
export default function Residents() {
  return (
    <div className="text-sm p-4">
      <div className="text-right mt-2">
        <button className="bg-blue-500 text-blue-50 px-2 py-1 rounded">
          + Добавить
        </button>
      </div>
      {/* <p className="underline">Мы им дали: </p> */}
      <div className="flex flex-col gap-2 mt-4">
        {residents.map((item) => (
          <div key={item.id} className="p-2 pt-6 grid grid-cols-4 ">
            <span className="absolute px-2 bg-blue-100 rounded text-blue-900 "></span>
            <div className="col-span-3">
              <div className="pr-2">{item.name}</div>
              <div className="mt-2">
                <span className="block text-xs font-light text-slate-500">
                  Дата заезда:
                </span>
                <span className="text-xs">{item.intake_date}</span>
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
