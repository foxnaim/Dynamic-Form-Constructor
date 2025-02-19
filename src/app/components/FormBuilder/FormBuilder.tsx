"use client";
import React, {useState, useEffect} from 'react'

interface Field {
 id: string;
 type: "text" | "number" | "email" | "checkbox"| "select";
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

  return (
    <div>FormBuilder</div>
  )
}

export default FormBuilder
