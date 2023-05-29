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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useLoaderData,
} from "react-router-dom";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  markMonthAsSettled,
} from "../api/transaction";
import { ru } from "date-fns/locale";
import {
  AddIcon,
  DateIcon,
  DeleteIcon,
  LeftArrow,
} from "../components/icons/icons";

function classNames(...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  if (_action === "delete") {
    await deleteTransaction(values.id as string);
  }

  if (_action === "create") {
    const { amount, date, note, month, paymentType } = values;
    await addTransaction(
      amount as string,
      date as string,
      note as string,
      month as string,
      paymentType as string,
      params.id as string
    );
  }

  if (_action === "settled") {
    console.log(values.settlementMonth);
    await markMonthAsSettled(
      params.id as string,
      values.settlementMonth as string
    );
  }

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

  useEffect(() => {
    setIsEdited(false);
  }, [transactions, selectedMonth]);

  return (
    <div className="mt-2 px-2 text-sm flex flex-col">
      <Form className="flex items-center gap-2" method="post">
        <input
          type="text"
          hidden
          value={selectedMonth.toString().substring(0, 15)}
          name="settlementMonth"
          readOnly
        />
        <button
          id="debt-settled"
          name="_action"
          value="settled"
          className="border rounded px-2 py-1"
        >
          <span>
            Погасил все долги за{" "}
            <span className="font-semibold">
              {format(selectedMonth, "LLLL", { locale: ru })}
            </span>{" "}
            месяц
          </span>
        </button>
      </Form>
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
      <div className="my-4 flex-auto">
        {isEdited ? (
          <div>
            <button
              onClick={() => setIsEdited(false)}
              className="ml-auto mb-2 flex gap-1 text-blue-500 items-center"
            >
              <LeftArrow />
              <span>Назад</span>
            </button>
            <Form method="post" className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label>Сумма оплаты</label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  required
                  name="amount"
                  className="px-1 border rounded py-1 "
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Назначение оплаты</label>
                <select name="paymentType" className="py-1 border rounded">
                  <option value="rent">Аренда</option>
                  <option value="utilities">Коммунальные услуги</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Дата оплаты</label>
                <div className="relative">
                  <input
                    ref={dateRef}
                    onFocus={(e) => e.currentTarget.showPicker()}
                    type="date"
                    name="date"
                    required
                    className="p-1 w-full border rounded"
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
                  className="px-1 resize-none border rounded py-1 "
                />
              </div>
              <input
                type="text"
                name="month"
                defaultValue={format(selectedMonth, "MMM yyyy")}
                hidden
              />
              <div className="text-right">
                <button
                  name="_action"
                  value="create"
                  className="bg-blue-500 text-white rounded px-2 py-1"
                >
                  сохранить
                </button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="text-right min-h-[100px]">
            <button className="text-blue-400" onClick={() => setIsEdited(true)}>
              <AddIcon />
            </button>
            <div className=" text-left">
              <p className="mb-2">
                Итого:{" "}
                <span className="text-md font-bold">
                  {transactions
                    .filter(
                      (t) => t.month === format(selectedMonth, "MMM yyyy")
                    )
                    .reduce((accum, currentVal) => {
                      return accum + currentVal.amount;
                    }, 0)
                    .toLocaleString()}{" "}
                  тенге
                </span>
              </p>
              <hr className="my-2" />
              <p>Из них:</p>
              <div className="mt-2 space-y-2">
                {transactions
                  .filter((t) => t.month === format(selectedMonth, "MMM yyyy"))
                  .map((t) => {
                    return (
                      <div key={t.id} className="pl-2 text-sm">
                        <div className="grid grid-cols-6">
                          <div className="col-span-5 grid grid-cols-3">
                            <span className="font-bold">
                              {t.amount.toLocaleString()}тг
                            </span>
                            <span className="pl-2">
                              {format(new Date(t.date), "d MMM", {
                                locale: ru,
                              })}
                            </span>
                            <span className="pl-1 break-all">
                              {t.payment_type === "rent"
                                ? "аренда"
                                : t.payment_type === "utilities"
                                ? "комуслг"
                                : "другое"}
                            </span>
                          </div>
                          <div className="col-span-1 flex gap-2 items-end  justify-around">
                            <Form method="post">
                              <input
                                type="text"
                                hidden
                                defaultValue={t.id}
                                name="id"
                              />
                              <button
                                type="submit"
                                name="_action"
                                value="delete"
                                className="text-red-500"
                              >
                                <DeleteIcon />
                              </button>
                            </Form>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
