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
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "../api/transaction";
import { ru } from "date-fns/locale";

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

export function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="currentColor"
        d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z"
      />
      <path
        fill="currentColor"
        d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8Z"
      />
    </svg>
  );
}

export function DateIcon() {
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

export function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="currentColor"
        d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"
      />
    </svg>
  );
}

export function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="currentColor"
        fillOpacity=".15"
        d="M292.7 840h438.6l24.2-512h-487z"
      />
      <path
        fill="currentColor"
        d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z"
      />
    </svg>
  );
}
