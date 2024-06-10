export default function Header({ title }: { title: string }) {
  return (
    <div className="w-full rounded-full border-2 bg-white bg-opacity-10 p-6 text-center">
      <h1 className="text-5xl">{title}</h1>
    </div>
  );
}
