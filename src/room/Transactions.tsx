import {
  eachMonthOfInterval,
  endOfYear,
  format,
  isEqual,
  isSameMonth,
  isThisMonth,
  startOfMonth,
  startOfToday,
  startOfYear,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import { addTransaction, getTransactions } from "../api/transaction";

function classNames(...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { amount, date, note, month } = Object.fromEntries(formData);
  console.log(month);

  await addTransaction(
    amount as string,
    date as string,
    note as string,
    month as string,
    params.id as string
  );
  return null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await getTransactions(params.id as string);
  return data;
}

export default function Transactions() {
  let today = startOfToday();
  let currentMonth = startOfMonth(today);
  let months = eachMonthOfInterval({
    start: startOfYear(currentMonth),
    end: endOfYear(currentMonth),
  });

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isEdited, setIsEdited] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  function showDatePicker() {
    if (dateRef.current) {
      dateRef.current.focus();
    }
  }

  const transactions = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  // console.log(transactions);
  // console.log("selected month", selectedMonth);

  useEffect(() => {
    setIsEdited(false);
  }, [transactions]);

  // debugger;

  return (
    <div className="mt-2 px-2 text-sm flex flex-col h-[25]vh">
      <div className="my-4 flex-auto">
        {isEdited ? (
          <div>
            <Form method="post" className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label>Сумма оплаты</label>
                <input
                  type="text"
                  name="amount"
                  className="border rounded py-1 "
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Дата оплаты</label>
                <div className="relative">
                  <input
                    ref={dateRef}
                    onFocus={(e) => e.currentTarget.showPicker()}
                    type="date"
                    name="date"
                    className="w-full rounded py-1"
                  />
                  <div
                    onClick={showDatePicker}
                    className="absolute top-0.5 right-0.5 bg-white rounded-lg"
                  >
                    <DateIcon />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label>Комментарии</label>
                <textarea
                  name="note"
                  className="resize-none border rounded py-1 "
                />
              </div>
              <input
                type="text"
                name="month"
                defaultValue={format(selectedMonth, "MMM yyyy")}
                hidden
              />
              <div className="text-right">
                <button className="bg-blue-500 text-white rounded px-2 py-1">
                  сохранить
                </button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="text-right">
            <button className="text-gray-400" onClick={() => setIsEdited(true)}>
              <EditIcon />
            </button>
            <h2 className="text-center text-xl">
              {transactions
                .filter((t) => t.month === format(selectedMonth, "MMM yyyy"))
                .map((t) => t.amount)
                .join("+")}
            </h2>
          </div>
        )}
      </div>
      <div className="mt-8 grid grid-cols-4 gap-1">
        {months.map((m) => {
          return (
            <button
              key={m.toString()}
              onClick={() => setSelectedMonth(m)}
              className={classNames(
                isThisMonth(m) && "border-2 border-pink-300",
                isThisMonth(m) &&
                  isSameMonth(m, selectedMonth) &&
                  "bg-pink-500",
                isEqual(m, selectedMonth) && "text-white",
                !isThisMonth(m) &&
                  isSameMonth(m, selectedMonth) &&
                  "bg-gray-400",
                "border rounded p-2"
              )}
            >
              <time dateTime={format(m, "MMM yy")}>{format(m, "MMM")}</time>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M5 3c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7H5V5h7V3H5m12.78 1a.69.69 0 0 0-.48.2l-1.22 1.21l2.5 2.5L19.8 6.7c.26-.26.26-.7 0-.95L18.25 4.2c-.13-.13-.3-.2-.47-.2m-2.41 2.12L8 13.5V16h2.5l7.37-7.38l-2.5-2.5Z"
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
      />
    </svg>
  );
}

function CrossMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-3.4 14L12 13.4L8.4 17L7 15.6l3.6-3.6L7 8.4L8.4 7l3.6 3.6L15.6 7L17 8.4L13.4 12l3.6 3.6l-1.4 1.4Z"
      />
    </svg>
  );
}

function DateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      className="inline-block"
    >
      <path
        fill="currentColor"
        d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5Z"
      />
    </svg>
  );
}
