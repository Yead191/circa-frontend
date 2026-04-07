

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; stepsBack?: number }[];
}) {

  const handleBack = (steps: number = 1) => {
    window.history.go(-steps);
  };

  return (
    <div className="text-sm text-gray-400 flex items-center gap-2 px-4 pt-3">
      {/* <span
        onClick={() => handleBack(1)}
        className="cursor-pointer hover:text-white"
      >
        Home
      </span> */}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <span>{'>'}</span>}

            {isLast ? (
              <span className="text-white">{item.label}</span>
            ) : (
              <span
                onClick={() => handleBack(item.stepsBack || 1)}
                className="cursor-pointer hover:text-white"
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}