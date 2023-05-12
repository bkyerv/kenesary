const details = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    iin: "983123128234",
    active: true,
    room: "1",
    start_date: "2022-01-01",
    end_date: null,
    documents: [
      {
        id: "1",
        name: "Паспорт",
        img_url: "https://www.google.com",
        doc_url: "https://www.google.com",
      },
    ],
  },
];

export default function ResidentDetails() {
  return (
    <>
      {details.map((item) => (
        <div key={item.id}>
          <p>Имя: {item.name}</p>
          Document: {item.documents[0].name}
          <p>Заехал: {item.end_date}</p>
          {item.active ? "Активный" : "Не активный"}
        </div>
      ))}
    </>
  );
}
