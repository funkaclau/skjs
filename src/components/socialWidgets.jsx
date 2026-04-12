import { FaTelegramPlane, FaGlobe, FaMedium, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import clsx from "clsx";

// 💡 Optional reusable classes
const baseIconBtn = `
  flex items-center justify-center
  w-10 h-10 rounded-full
  transition hover:scale-110
  text-white
`;

const activeStyle = `
  bg-white/10 hover:bg-white/20 cursor-pointer
`;

const disabledStyle = `
  bg-gray-700 text-gray-400 cursor-not-allowed relative group
`;

export const getWidgets = (links, size = 24) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-6 mb-8">
      {["twitter", "telegram", "website", "medium", "youtube"].map((platform) => {
        const link = links[platform];

        const icon = (() => {
          switch (platform) {
            case "twitter": return <BsTwitterX size={size} />;
            case "telegram": return <FaTelegramPlane size={size} />;
            case "website": return <FaGlobe size={size} />;
            case "medium": return <FaMedium size={size} />;
            case "youtube": return <FaYoutube size={size} />;
            default: return null;
          }
        })();

        return (
          <div key={platform}>
            <a
              href={link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(baseIconBtn, link ? activeStyle : disabledStyle)}
              onClick={(e) => !link && e.preventDefault()}
            >
              {icon}
              {!link && (
                <span className="absolute bottom-[-1.8rem] text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  No link
                </span>
              )}
            </a>
          </div>
        );
      })}
    </div>
  );
};
