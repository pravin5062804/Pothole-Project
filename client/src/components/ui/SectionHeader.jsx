/**
 * Section header with title and optional subtitle.
 * Supports an underline-accented word via the `accent` prop.
 */
export default function SectionHeader({ title, accent, subtitle }) {
  // If accent is provided, wrap it in the decorated span
  const renderedTitle = accent
    ? title.split(accent).reduce((acc, part, i, arr) => {
        acc.push(part);
        if (i < arr.length - 1) {
          acc.push(
            <span
              key={i}
              className="underline decoration-green-400 underline-offset-[6px] decoration-[3px]"
            >
              {accent}
            </span>
          );
        }
        return acc;
      }, [])
    : title;

  return (
    <div className="text-center mb-12">
      <h2 className="font-primary text-[2rem] font-extrabold text-gray-900 mb-2">
        {renderedTitle}
      </h2>
      {subtitle && <p className="text-gray-500 text-base">{subtitle}</p>}
    </div>
  );
}
