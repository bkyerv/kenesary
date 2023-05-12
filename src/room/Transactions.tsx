const transactions = [
  {
    id: "1",
    month: "January",
    year: "2022",
    breakdown: [
      {
        id: "1",
        description: "rent",
        amount: 100,
      },
      {
        id: "2",
        description: "parking",
        amount: 5,
      },
    ],
  },
];

export default function Transactions() {
  return (
    <div>
      {transactions.map((item) => (
        <div key={item.id}>{item.month}</div>
      ))}
    </div>
  );
}
