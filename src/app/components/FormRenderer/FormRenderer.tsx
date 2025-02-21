"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from "zod";

interface Field {
  id: string;
  type: "text" | "number" | "email" | "checkbox" | "select";
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

const FormRenderer = () => {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) setFields(JSON.parse(savedFields));
  }, []);

  // Формируем схему валидации динамически
  const validationSchema = z.object(
    fields.reduce((acc, field) => {
      if (field.type === "email") {
        acc[field.id] = z.string().email("Неверный email");
      } else if (field.type === "number") {
        let rule = z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number({ invalid_type_error: "Введите число" })
            .refine((val) => !isNaN(val), "Введите число") // Доп. проверка на NaN
        );

        if (typeof field.min === "number") {
          rule = rule.refine((val) => val >= field.min!, `Минимум ${field.min}`);
        }
        if (typeof field.max === "number") {
          rule = rule.refine((val) => val <= field.max!, `Максимум ${field.max}`);
        }

        acc[field.id] = rule;
      } else if (field.type === "checkbox") {
        acc[field.id] = z.boolean().default(false);
      } else if (field.type === "select" && field.options && field.options.length > 0) {
        acc[field.id] = z.enum([field.options[0], ...field.options.slice(1)]);
      } else {
        acc[field.id] = z.string().min(1, "Поле обязательно");
      }
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: fields.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.id] = false;
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const onSubmit = (data: any) => {
    console.log("Отправка данных:", data);
    toast.success("Форма успешно отправлена!", { autoClose: 2000 });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      <ToastContainer position="top-right" />
      <h2 className="text-xl font-semibold mb-4">Форма</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label className="font-medium">{field.label}</label>

            {field.type === "checkbox" ? (
              <input type="checkbox" {...register(field.id)} className="mt-1" />
            ) : field.type === "select" && field.options ? (
              <select {...register(field.id)} className="p-2 border rounded">
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                {...register(field.id, field.type === "number" ? { valueAsNumber: true } : {})}
                placeholder={field.type === "text" ? "Введите текст" : ""}
                className="p-2 border rounded"
              />
            )}

            {errors[field.id] && (
              <p className="text-red-500 text-sm">{(errors as any)[field.id]?.message}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Отправить
        </button>
      </form>
    </div>
  );
};

export default FormRenderer;
