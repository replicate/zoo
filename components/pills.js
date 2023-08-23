import { useEffect } from "react";
import { useRouter } from "next/router";

const tabs = [
  { name: "Text to Image", href: "/", current: true },
  { name: "ControlNet", href: "/controlnet", current: false },
  { name: "X/Y plot", href: "/xyplot", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pills() {
  const router = useRouter();
  useEffect(() => {
    console.log(router.pathname);
    tabs.forEach(tab => {
      tab.current = router.pathname === tab.href;
    });
  }, []);
  return (
    <div>
      <div className="block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                tab.current
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
