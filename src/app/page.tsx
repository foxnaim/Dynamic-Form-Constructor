"use client";
import React from "react";
import FormBuilder from "@/app/components/FormBuilder/FormBuilder";
import Link from "next/link";


export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Конструктор форм</h1>
      <FormBuilder />
      
      <Link href="/form"   className="mt-4 text-blue-500 hover:underline text-lg"
      >
        Перейти к заполнению →
      </Link>
    </div>
  );
}
