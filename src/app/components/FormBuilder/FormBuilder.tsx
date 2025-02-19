import React, { useState, useEffect } from "react";

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

  // Загрузка из localStorage
  useEffect(() => {
    const savedFields = localStorage.getItem("formFields");
    if (savedFields) setFields(JSON.parse(savedFields));
  }, []);

  // Сохранение в localStorage
  const saveForm = () => {
    localStorage.setItem("formFields", JSON.stringify(fields));
    alert("Форма сохранена!");
  };

  // Добавление нового поля
  const addField = (type: Field["type"]) => {
    setFields([...fields, { id: Date.now().toString(), type, label: "Новое поле" }]);
  };

  // Удаление поля
  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  // Обновление параметров поля
  const updateField = (id: string, key: keyof Field, value: any) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  return (
    <div>
      <h2>Конструктор формы</h2>

      <div>
        <button onClick={() => addField("text")}>Текст</button>
        <button onClick={() => addField("number")}>Число</button>
        <button onClick={() => addField("email")}>Email</button>
        <button onClick={() => addField("checkbox")}>Чекбокс</button>
        <button onClick={() => addField("select")}>Список</button>
      </div>

      {fields.map((field) => (
        <div key={field.id}>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
          />
          {field.type === "number" && (
            <>
              <input
                type="number"
                placeholder="min"
                onChange={(e) => updateField(field.id, "min", Number(e.target.value))}
              />
              <input
                type="number"
                placeholder="max"
                onChange={(e) => updateField(field.id, "max", Number(e.target.value))}
              />
            </>
          )}
          <button onClick={() => removeField(field.id)}>Удалить</button>
        </div>
      ))}

      <button onClick={saveForm}>Сохранить форму</button>
    </div>
  );
};

export default FormBuilder;
