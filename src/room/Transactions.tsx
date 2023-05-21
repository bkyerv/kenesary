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
import { ru } from "date-fns/locale";

function classNames(...classes: Array<string | boolean>) {
  return classes.filter(Boolean).join(" ");
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { amount, date, note, month, paymentType } =
    Object.fromEntries(formData);
  // console.log(paymentType);

  await addTransaction(
    amount as string,
    date as string,
    note as string,
    month as string,
    paymentType as string,
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

  useEffect(() => {
    setIsEdited(false);
  }, [transactions, selectedMonth]);

  return (
    <div className="mt-2 px-2 text-sm flex flex-col">
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
                  type="text"
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
                    className="px-1 w-full py-1 border rounded"
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
                <button className="bg-blue-500 text-white rounded px-2 py-1">
                  сохранить
                </button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="text-right min-h-[100px]">
            <button className="text-blue-400" onClick={() => setIsEdited(true)}>
              <AddPaymentIcon />
            </button>
            <div className=" text-left">
              <p className="mb-2">
                <span>
                  Итого:{" "}
                  {transactions
                    .filter(
                      (t) => t.month === format(selectedMonth, "MMM yyyy")
                    )
                    .reduce((accum, currentVal) => {
                      return accum + currentVal.amount;
                    }, 0)}{" "}
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
                      <div key={t.id} className="pl-2 ">
                        <div>
                          <span className="font-bold">
                            {t.amount} тыс. тенге
                          </span>{" "}
                          оплачено{" "}
                          <span className="text-gray-900">
                            {format(new Date(t.date), "d MMM", {
                              locale: ru,
                            })}
                          </span>
                          <span>
                            {" "}
                            за{" "}
                            {t.payment_type === "rent"
                              ? "аренду"
                              : t.payment_type === "utilities"
                              ? "коммунальные услуги"
                              : "другое"}
                          </span>
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

function AddPaymentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="currentColor"
        d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
      />
      <path
        fill="currentColor"
        fillOpacity=".15"
        d="M184 840h656V184H184v656zm136-352c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48z"
      />
      <path
        fill="currentColor"
        d="M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
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

function LeftArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="currentColor"
        d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 0 0 0 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"
      />
    </svg>
  );
}
