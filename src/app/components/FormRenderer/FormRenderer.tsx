"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

 // Создаём схему валидации на основе полей
 const validationSchema = z.object(
   fields.reduce((acc, field) => {
     if (field.type === "email") acc[field.id] = z.string().email("Неверный email");
     else if (field.type === "number") {
       let rule = z.number();
       if (field.min !== undefined) rule = rule.min(field.min, `Минимум ${field.min}`);
       if (field.max !== undefined) rule = rule.max(field.max, `Максимум ${field.max}`);
       acc[field.id] = rule;
     } else acc[field.id] = z.string();
     return acc;
   }, {} as any)
 );

 const {
   register,
   handleSubmit,
   formState: { errors },
 } = useForm({
   resolver: zodResolver(validationSchema),
 });

 const onSubmit = (data: any) => {
   console.log("Отправка данных:", data);
 };

 return (
<form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <div key={field.id}>
          <label>{field.label}</label>
          {field.type === "checkbox" ? (
            <input type="checkbox" {...register(field.id)} />
          ) : (
            <input
              type={field.type}
              {...register(field.id)}
              placeholder={field.type === "text" ? "Введите текст" : ""}
            />
          )}
          {errors[field.id] && <p style={{ color: "red" }}>{(errors as any)[field.id]?.message}</p>}
        </div>
      ))}
      <button type="submit">Отправить</button>
    </form>
  );
};

export default FormRenderer;
