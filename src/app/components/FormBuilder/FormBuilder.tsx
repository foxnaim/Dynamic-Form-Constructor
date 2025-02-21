"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Field {
  id: string;
  type: "text" | "number" | "email" | "checkbox" | "select";
  label: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

const FormBuilder = () => {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) setFields(JSON.parse(savedFields));
  }, []);

  const saveForm = () => {
    localStorage.setItem("formFields", JSON.stringify(fields));
    toast.success("Форма успешно сохранена!", { autoClose: 2000 });
  };

  const addField = (type: Field["type"]) => {
    setFields([...fields, { id: Date.now().toString(), type, label: "Новое поле", options: type === "select" ? ["Опция 1"] : undefined }]);
    toast.info(`Добавлено поле: ${type}`, { autoClose: 1500 });
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
    toast.error("Поле удалено", { autoClose: 1500 });
  };

  const updateField = (id: string, key: keyof Field, value: any) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      <ToastContainer position="top-right" />

      <h2 className="text-xl font-semibold mb-4">Конструктор формы</h2>

      <div className="flex gap-2 mb-4">
        <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={() => addField("text")}>
          Текст
        </button>
        <button className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition" onClick={() => addField("number")}>
          Число
        </button>
        <button className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition" onClick={() => addField("email")}>
          Email
        </button>
        <button className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" onClick={() => addField("checkbox")}>
          Чекбокс
        </button>
        <button className="px-3 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition" onClick={() => addField("select")}>
          Список
        </button>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="mb-4 p-4 bg-white shadow rounded-md">
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
            placeholder="Название поля"
          />
          {field.type === "number" && (
            <div className="flex gap-2">
              <input type="number" className="w-1/2 p-2 border rounded" placeholder="min" onChange={(e) => updateField(field.id, "min", Number(e.target.value))} />
              <input type="number" className="w-1/2 p-2 border rounded" placeholder="max" onChange={(e) => updateField(field.id, "max", Number(e.target.value))} />
            </div>
          )}
          {field.type === "select" && (
            <div className="mt-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2 items-center mb-1">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = e.target.value;
                      updateField(field.id, "options", newOptions);
                    }}
                  />
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index);
                      updateField(field.id, "options", newOptions);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  const newOptions = [...(field.options ?? []), `Опция ${(field.options?.length ?? 0) + 1}`];
                  updateField(field.id, "options", newOptions);
                }}
                
              >
                Добавить опцию
              </button>
            </div>
          )}
          <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => removeField(field.id)}>
            Удалить
          </button>
        </div>
      ))}

      <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition" onClick={saveForm}>
        Сохранить форму
      </button>
    </div>
  );
};

export default FormBuilder;
