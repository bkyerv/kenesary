const transactions = [
  {
    id: "1",
    month: "Jan",
    year: "2022",
    payment: {
      has_settled: true,
      amount: "150",
      breakdown: [
        {
          description: "rent",
          amount: 140,
        },
        {
          description: "utility",
          amount: 10,
        },
      ],
    },
  },
  {
    id: "2",
    month: "Feb",
    year: "2022",
    payment: {
      has_settled: true,
      amount: "140",
      breakdown: [
        {
          description: "rent",
          amount: 140,
        },
        {
          description: "utility",
          amount: 0,
        },
      ],
    },
  },
  {
    id: "3",
    month: "Mar",
    year: "2022",
    payment: {
      has_settled: true,
      amount: "155",
      breakdown: [
        {
          description: "rent",
          amount: 140,
        },
        {
          description: "utility",
          amount: 15,
        },
      ],
    },
  },
  {
    id: "4",
    month: "Apr",
    year: "2022",
    payment: {
      has_settled: true,
      amount: "152",
      breakdown: [
        {
          description: "rent",
          amount: 140,
        },
        {
          description: "utility",
          amount: 12,
        },
      ],
    },
  },
  {
    id: "5",
    month: "May",
    year: "2022",
    payment: {
      has_settled: true,
      amount: "150",
      breakdown: [
        {
          description: "rent",
          amount: 140,
        },
        {
          description: "utility",
          amount: 10,
        },
      ],
    },
  },
];

export default function Transactions() {
  return (
    <div className="mt-2">
      <div className="grid grid-cols-2 gap-2 ">
        {transactions.map((item) => (
          <div
            key={item.id}
            className="relative outline outline-1 outline-blue-500 px-2 h-12 rounded flex flex-col items-center justify-center"
          >
            <span className="absolute top-0 left-0 px-1 bg-blue-50 text-blue-800 rounded text-sm">
              {item.month}
            </span>
            <div className="font-bold">{item.payment.amount}</div>
            <div>
              <div className="text-sm">
                {item.payment.breakdown.map((p) => p.amount).join(" + ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
