export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-gray-300 pb-8 lg:flex-row lg:items-end">
      <div>
        <p className="mono-label text-gray-500">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-medium tracking-tight md:text-7xl">
          {title}
        </h1>
      </div>
      <p className="max-w-md text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}
