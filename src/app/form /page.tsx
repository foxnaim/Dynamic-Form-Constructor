import FormRenderer from "@/app/components/FormRenderer/FormRenderer";

export default function FormPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Заполнение формы</h1>
      <FormRenderer />
      <a
        href="/"
        className="mt-4 text-blue-500 hover:underline text-lg"
      >
        ← Назад
      </a>
    </div>
  );
}
